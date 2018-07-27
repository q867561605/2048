// JavaScript source code
var gamerule = function () {
    //获取棋盘大小
    var _value, _size;

    //游戏存储区
    var _gameset, //当前存储
        _lastset, //上一步，用作撤销，只记一步，即只可以撤销一步，并且记录上一步分数
        _new;     //当前新增
};

gamerule.prototype = {
    constructor: gamerule,
    //读取或创建相应值
    init: function () {
        var select = document.getElementById("size");
        var index = parseInt(select.selectedIndex);
        _value = parseInt(select.options[index].value);
        _size = parseInt(_value * _value);

        _gameset = new Array(_size);
        _lastset = new Array(_size + 2);
        _new = new Array(_size);

        this.draw();
    },

    //添加区块
    draw: function () {
        var container = document.getElementById("container");
        var div;
        var cellsize = parseFloat(84 / _value) - 1;

        for (var i = 0; i < _size ; i++) {
            div = document.createElement("div");
            div.setAttribute("class", "cell");
            div.setAttribute("id", "cell" + i);
            div.style.width = cellsize + "vmin";
            div.style.height = cellsize + "vmin";
            div.style.fontSize = (cellsize / 4) - 1 + "vmin";
            div.style.textAlign = "center";
            div.style.lineHeight = cellsize + "vmin";
            container.insertBefore(div, container.childNodes[i]);
        }
    },

    //清空区域
    clear: function () {
        for (var i = 0; i < _size ; i++) {
            div = document.getElementById("cell" + i);
            if (div != null) {
                div.parentNode.removeChild(div);
            } else {
                break;
            }
        }
    },

    //更新棋盘
    updata: function () {
        for (var i = 0; i < _size ; i++) {
            var div = document.getElementById("cell" + i);
            if (div == null) {
                this.draw();;
            }

            div = document.getElementById("cell" + i);
            div.innerText = "";
            div.style.backgroundColor = "lightgray";
            if (_gameset[i] != 0) {
                div.innerText = _gameset[i];
                switch (_gameset[i]) {
                    case 2: div.style.backgroundColor = "#eee4da"; break;
                    case 4: div.style.backgroundColor = "#f26179"; break;
                    case 8: div.style.backgroundColor = "#f59563"; break;
                    case 16: div.style.backgroundColor = "#f67c5f"; break;
                    case 32: div.style.backgroundColor = "#f65e36"; break;
                    case 64: div.style.backgroundColor = "#edcf72"; break;
                    case 128: div.style.backgroundColor = "#edcc61"; break;
                    case 256: div.style.backgroundColor = "#9c0"; break;
                    case 512: div.style.backgroundColor = "#3365a5"; break;
                    case 1024: div.style.backgroundColor = "#09c"; break;
                    case 2048: div.style.backgroundColor = "#a6bc"; break;
                }
            }
        }
    },

    //新游戏
    newgame: function () {
        document.getElementById("now").textContent = 0;
        for (var i = 0; i < _size; i++) {
            _gameset[i] = 0;
            _new[i] = 0;
        }
        _lastset[_size] = 0;
        _lastset[_size+1] = 0;
        this.random();
        this.random();
        
        var ad = document.getElementById("ad");
        if (ad != null) {
            ad.parentNode.removeChild(ad);
        }

        this.updata();
    },

    //撤销操作
    back: function () {
        var div = document.getElementById("cell0");
        if (div != null) {
            if (_lastset[_size] == 1) {
                for (var i = 0; i < _size; i++) {
                    _gameset[i] = _lastset[i];
                }
                _lastset[_size] = 0;
                document.getElementById("now").textContent=_lastset[_size+1];
            }
            this.updata();
        }
    },

    //移动操作
    move: function (direction) {
        var j, result;
        var temp = new Array(_size+1);
        temp[_size]= document.getElementById("now").textContent;

        for (var i = 0 ; i < _size; i++) {
            temp[i] = _gameset[i];
            _new[i] = 0;
        }

        switch (direction) {
            case 'W':
                for (var i = _value; i < _size; i++) {
                    j = i;
                    while (j >= _value) {
                        this.moveto(j - _value, j);
                        j -= _value;
                    }
                }
                break;
            case 'S':
                for (var i = _value * (_value - 1) - 1; i >= 0; i--) {
                    j = i;
                    while (j <= _value * (_value - 1) - 1) {
                        this.moveto(j + _value, j);
                        j += _value;
                    }
                }
                break;
            case 'A':
                for (var i = 1; i < _size; i++) {
                    j = i;
                    while (j % _value != 0) {
                        this.moveto(j - 1, j);
                        j -= 1;
                    }
                }
                break;
            case 'D':
                for (var i = _size - 2; i >= 0; i--) {
                    j = i;
                    while (j % _value != _value - 1) {
                        this.moveto(j + 1, j);
                        j += 1;
                    }
                }
                break;
        }

        //验证是否2048
        if (!this.complete()) {
            //验证是否有变化
            for (i = 0, result = 0; i < _size; i++) {
                if (_gameset[i] == temp[i]) result++;
            }
            if (result != _size) {
                this.random();
                this.updata();
                if (!this.over()) {
                    for (var i = 0 ; i < _size; i++) {
                        _lastset[i] = temp[i];
                    }
                    _lastset[_size] = 1;
                    _lastset[_size+1]=temp[_size];
                } else {
                    for (var i = 0 ; i < _size; i++) {
                        _gameset[i] = 0;
                        _lastset[i] = 0;
                    }
                    _lastset[_size] = 0;
                    var container = document.getElementById("container");
                    var div = document.createElement("div");
                    div.innerText = "请重新来过\n";
                    div.setAttribute("id","ad");
                    div.style.textAlign = "center";
                    div.style.lineHeight = 70 + "vmin";
                    div.style.width = 84 + "vmin";
                    div.style.height = 84 + "vmin";
                    div.style.position = "absolute";
                    container.insertBefore(div, container.childNodes[0]);
                }
            }
        } else {
            var container = document.getElementById("container");
            var div = document.createElement("div");
            div.innerText = "你获得了2048的胜利\n";
            div.style.textAlign = "center";
            div.setAttribute("id", "ad");
            div.style.lineHeight = 70 + "vmin";
            div.style.width = 84 + "vmin";
            div.style.height = 84 + "vmin";
            div.style.position = "absolute";
            container.insertBefore(div, container.childNodes[0]);
        }

    },

    //具体移动操作
    moveto: function (point1, point2) {
        var value1 = _gameset[point1],
            value2 = _gameset[point2];
        var soccre = parseInt(document.getElementById("now").textContent);
        var max = parseInt(document.getElementById("max").textContent);

        if (value2 != 0) {
            if (value1 == 0) {
                _gameset[point1] = value2;
                _gameset[point2] = 0;
            }
            else if (value1 == value2 && _new[point1] == 0 && _new[point2] == 0) {
                _gameset[point1] = 2 * value2;
                _gameset[point2] = 0;
                _new[point1] = 1;
                soccre = soccre + 2 * value2;
                document.getElementById("now").textContent = soccre;
                if (soccre > max) {
                    document.getElementById("max").textContent = soccre;
                }
            }
        }
    },

    //随机空白地点生成2或4
    random: function () {
        var point = Math.floor(Math.random() * _size);
        var num = Math.random() < 0.8 ? 2 : 4;
        while (_gameset[point] != 0) {
            point = Math.floor(Math.random() * _size);
        }
        _gameset[point] = num;
    },

    //完成游戏
    complete: function () {
        for (var i = 0; i < _size; i++) {
            if (_gameset[i] == 2048) {
                return true;
            }
        }
        return false;
    },

    //无路可走
    over: function () {
        for (var i = 0; i < _size; i++) {
            //确认棋盘全满
            if (_gameset[i] == 0) {
                return false;
            }
            //确认相邻的格子不同
            if (i % _value != (_value - 1)) {
                if (_gameset[i] == _gameset[i + 1]) {
                    return false;
                }
            }
            //确认与下一行不同
            if (i < _value * (_value - 1)) {
                if (_gameset[i] == _gameset[i + _value]) {
                    return false;
                }
            }
        }
        return true;
    }
}

//事件绑定
window.onload = function () {
    var gameR = new gamerule;

    //按钮
    var backBtn = document.getElementById("cancel");//撤销按钮
    var resetBtn = document.getElementById("reset");//重开按钮
    //选单
    var sizeSlt = document.getElementById("size");

    document.getElementById("max").textContent = 0;

    gameR.init();
    gameR.newgame();

    backBtn.addEventListener("click", function () {
        gameR.back();
    });

    resetBtn.addEventListener("click", function () {
        gameR.newgame();
    });

    sizeSlt.addEventListener("change", function () {
        gameR.clear();
        gameR.init();
        gameR.newgame();
    });

    //键盘响应
    window.onkeydown = function (e) {
        var keynum, keychar;
        if (window.event) {    // IE
            keynum = e.keyCode;
        }
        else if (e.which) {    // Netscape/Firefox/Opera
            keynum = e.which;
        }
        keychar = String.fromCharCode(keynum);
        if (['W', 'S', 'A', 'D'].indexOf(keychar) > -1) {
            gameR.move(keychar);
        }
    }

    //滑屏响应
    var startX, startY,
        endX, endY;

    function touchstart(e) {
        e.preventDefault();
        var touch = e.touches[0];
        startX = touch.pageX;
        startY = touch.pageY;
    }

    function touchend(e) {
        e.preventDefault();
        var touch = e.changedTouches[0];
        endX = touch.pageX;
        endY = touch.pageY;
        gameR.move(getSwipeDirection(startX,endX,startY,endY));
    }

    function getSwipeDirection(x1, x2, y1, y2) {
        return Math.abs(x1 - x2) >=Math.abs(y1 - y2) ? (x1 - x2 > 0 ? 'A' : 'D') : (y1 - y2 > 0 ? 'W' : 'S')
    }

    var container = document.getElementById("container");
    container.addEventListener("touchstart", touchstart.bind(this));
    container.addEventListener("touchend", touchend.bind(this));

}

