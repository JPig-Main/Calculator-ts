"use strict";
{
    var Calc = /** @class */ (function () {
        function Calc() {
            var _this = this;
            this.buffer = ["0"];
            this.numbers = [];
            this.symbols = [];
            this.isAns = false;
            this.bfAns = 0;
            this.isNumber = function (ch) {
                if (ch.length !== 1) {
                    return false;
                }
                var numberCh = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
                return numberCh.some(function (el) { return el === ch; }) ? true : false;
            };
            this.isSymbol = function (ch) {
                if (ch.length !== 1) {
                    return false;
                }
                var symbolCh = ["+", "-", "×", "÷"];
                return symbolCh.some(function (el) { return el === ch; }) ? true : false;
            };
            this.isSign = function (ch) {
                if (ch.length !== 1) {
                    return false;
                }
                var signCh = ["+", "-"];
                return signCh.some(function (el) { return el === ch; }) ? true : false;
            };
            this.pushBuffer = function (input) {
                var MAX_RENDER_NUM = 18;
                if (_this.buffer.length >= MAX_RENDER_NUM) {
                    return;
                }
                if (_this.isAns) {
                    _this.isAns = false;
                    if (!_this.isSymbol(input)) {
                        _this.buffer.length = 0;
                    }
                }
                else if (_this.buffer.length === 1) {
                    switch (_this.buffer[0]) {
                        case "0":
                            if (!_this.isSymbol(input)) {
                                console.log("input : " + input);
                                _this.buffer.shift();
                            }
                            break;
                        case "Syntax Error":
                            _this.buffer.shift();
                    }
                }
                _this.buffer.push(input);
            };
            this.popBuffer = function () {
                if (_this.buffer.length === 1) {
                    _this.buffer[0] = "0";
                    return;
                }
                return _this.buffer.pop();
            };
            this.clearBuffer = function () {
                _this.buffer.length = 0;
            };
            this.getBuffer = function () {
                return _this.buffer;
            };
            this.convertBuffer = function () {
                var isBfNum = false;
                var numberStr = "";
                var firstbufferLength = _this.buffer.length;
                while (_this.buffer.length > 0) {
                    var ch = _this.buffer.shift();
                    if (_this.isNumber(ch) || ch == ".") {
                        numberStr += ch;
                        isBfNum = true;
                    }
                    else if (_this.buffer.length === firstbufferLength - 1 &&
                        _this.isSign(ch)) {
                        console.log("ch = " + ch);
                        numberStr += ch;
                    }
                    else {
                        if (!_this.isSymbol(ch)) {
                            return false;
                        }
                        if (isBfNum) {
                            _this.numbers.push(parseFloat(numberStr));
                            numberStr = "";
                            isBfNum = false;
                        }
                        _this.symbols.push(ch);
                    }
                }
                if (isBfNum) {
                    _this.numbers.push(parseInt(numberStr, 10));
                    numberStr = "";
                    isBfNum = false;
                }
                return _this.numbers.length - _this.symbols.length == 1 ? true : false;
            };
            this.calcAns = function () {
                for (var i = 0; i < _this.symbols.length;) {
                    if (_this.symbols[i] === "×") {
                        var bfCalc = _this.numbers.splice(i, 2);
                        _this.symbols.splice(i, 1);
                        _this.numbers.splice(i, 0, bfCalc[0] * bfCalc[1]);
                    }
                    else if (_this.symbols[i] === "÷") {
                        var bfCalc = _this.numbers.splice(i, 2);
                        _this.symbols.splice(i, 1);
                        _this.numbers.splice(i, 0, bfCalc[0] / bfCalc[1]);
                    }
                    else {
                        i++;
                    }
                }
                for (var i = 0; i < _this.symbols.length;) {
                    if (_this.symbols[i] === "+") {
                        var bfCalc = _this.numbers.splice(i, 2);
                        _this.symbols.splice(i, 1);
                        _this.numbers.splice(i, 0, bfCalc[0] + bfCalc[1]);
                    }
                    else if (_this.symbols[i] === "-") {
                        var bfCalc = _this.numbers.splice(i, 2);
                        _this.symbols.splice(i, 1);
                        _this.numbers.splice(i, 0, bfCalc[0] - bfCalc[1]);
                    }
                    else {
                        i++;
                    }
                }
                _this.symbols.forEach(function (el) { });
            };
            this.calc = function () {
                // 文法エラー
                if (!_this.convertBuffer()) {
                    _this.numbers.length = 0;
                    _this.symbols.length = 0;
                    _this.buffer.length = 0;
                    _this.buffer.push("Syntax Error");
                    return null;
                }
                _this.calcAns();
                _this.buffer.length = 0;
                String(_this.numbers)
                    .split("")
                    .forEach(function (val) {
                    _this.buffer.push(val);
                });
                _this.bfAns = _this.numbers[0];
                _this.numbers.length = 0;
                _this.isAns = true;
            };
            this.setBufferByAnsMemory = function () {
                if (!_this.bfAns && _this.bfAns !== 0) {
                    return;
                }
                if (!_this.isSymbol(_this.buffer[_this.buffer.length - 1])) {
                    return;
                }
                String(_this.bfAns)
                    .split("")
                    .forEach(function (val) {
                    console.log("val : " + val);
                    _this.buffer.push(val);
                });
            };
        }
        return Calc;
    }());
    var InOut = /** @class */ (function () {
        function InOut() {
            var _this = this;
            this.INPUT_BTN = {
                zero: document.getElementById("zero"),
                one: document.getElementById("one"),
                two: document.getElementById("two"),
                three: document.getElementById("three"),
                four: document.getElementById("four"),
                five: document.getElementById("five"),
                six: document.getElementById("six"),
                seven: document.getElementById("seven"),
                eight: document.getElementById("eight"),
                nine: document.getElementById("nine"),
                add: document.getElementById("add"),
                sub: document.getElementById("sub"),
                mul: document.getElementById("mul"),
                div: document.getElementById("div"),
                equal: document.getElementById("equal"),
                dec: document.getElementById("dec"),
                ce: document.getElementById("ce"),
                del: document.getElementById("del"),
                ans: document.getElementById("ans")
            };
            this.OUTPUT = {
                display: document.getElementById("calc-display")
            };
            this.calc = new Calc();
            this.clicked = function (node) {
                node.classList.add("clicked");
                var timerId = setTimeout(function () {
                    node.classList.remove("clicked");
                    clearTimeout(timerId);
                }, 100);
            };
            this.configBtn = function (key) {
                var node = _this.INPUT_BTN[key];
                node.addEventListener("click", function () {
                    _this.clicked(node);
                    switch (key) {
                        case "zero":
                            _this.calc.pushBuffer("0");
                            break;
                        case "one":
                            _this.calc.pushBuffer("1");
                            break;
                        case "two":
                            _this.calc.pushBuffer("2");
                            break;
                        case "three":
                            _this.calc.pushBuffer("3");
                            break;
                        case "four":
                            _this.calc.pushBuffer("4");
                            break;
                        case "five":
                            _this.calc.pushBuffer("5");
                            break;
                        case "six":
                            _this.calc.pushBuffer("6");
                            break;
                        case "seven":
                            _this.calc.pushBuffer("7");
                            break;
                        case "eight":
                            _this.calc.pushBuffer("8");
                            break;
                        case "nine":
                            _this.calc.pushBuffer("9");
                            break;
                        case "add":
                            _this.calc.pushBuffer("+");
                            break;
                        case "sub":
                            _this.calc.pushBuffer("-");
                            break;
                        case "mul":
                            _this.calc.pushBuffer("×");
                            break;
                        case "div":
                            _this.calc.pushBuffer("÷");
                            break;
                        case "dec":
                            _this.calc.pushBuffer(".");
                            break;
                        case "del":
                            _this.calc.popBuffer();
                            break;
                        case "ce":
                            _this.calc.clearBuffer();
                            _this.calc.pushBuffer("0");
                            break;
                        case "ans":
                            _this.calc.setBufferByAnsMemory();
                            break;
                        case "equal":
                            _this.calc.calc();
                            break;
                    }
                    _this.renderDisplay();
                });
            };
            this.configKey = function () {
                document.addEventListener("keydown", function (e) {
                    switch (e.key) {
                        case "0":
                            _this.calc.pushBuffer("0");
                            break;
                        case "1":
                            _this.calc.pushBuffer("1");
                            break;
                        case "2":
                            _this.calc.pushBuffer("2");
                            break;
                        case "3":
                            _this.calc.pushBuffer("3");
                            break;
                        case "4":
                            _this.calc.pushBuffer("4");
                            break;
                        case "5":
                            _this.calc.pushBuffer("5");
                            break;
                        case "6":
                            _this.calc.pushBuffer("6");
                            break;
                        case "7":
                            _this.calc.pushBuffer("7");
                            break;
                        case "8":
                            _this.calc.pushBuffer("8");
                            break;
                        case "9":
                            _this.calc.pushBuffer("9");
                            break;
                        case "+":
                        case "＋":
                            _this.calc.pushBuffer("+");
                            break;
                        case "-":
                        case "－":
                            _this.calc.pushBuffer("-");
                            break;
                        case "*":
                        case "＊":
                            _this.calc.pushBuffer("×");
                            break;
                        case "/":
                            _this.calc.pushBuffer("÷");
                            break;
                        case ".":
                            _this.calc.pushBuffer(".");
                            break;
                        case "Backspace":
                            _this.calc.popBuffer();
                            break;
                        case "Escape":
                            _this.calc.clearBuffer();
                            _this.calc.pushBuffer("0");
                            break;
                        case "@":
                        case "＠":
                            _this.calc.setBufferByAnsMemory();
                            break;
                        case "=":
                        case "＝":
                        case "Enter":
                            _this.calc.calc();
                            break;
                        default:
                            return;
                    }
                    _this.renderDisplay();
                });
            };
            this.renderDisplay = function () {
                console.log("buffer : " + _this.calc.getBuffer());
                _this.OUTPUT.display.innerHTML = _this.calc.getBuffer().join("");
            };
            Object.keys(this.INPUT_BTN).forEach(function (key) {
                _this.configBtn(key);
            });
            this.configKey();
        }
        return InOut;
    }());
    new InOut();
}
