"use strict";
{
  // 計算中心部
  class Calc {
    // バッファ
    private buffer: Array<string> = ["0"];
    // 数のバッファ
    private numbers: Array<number> = [];
    // 計算記号のバッファ
    private symbols: Array<string> = [];
    // バッファが答えかどうか
    protected isAns: boolean = false;
    // 前の答え
    protected bfAns: number = 0;

    // 数, 計算記号, 符号の判定
    protected isNumber = (ch: string): boolean => {
      if (ch.length !== 1) {
        return false;
      }
      const numberCh = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
      return numberCh.some((el) => el === ch) ? true : false;
    };
    protected isSymbol = (ch: string): boolean => {
      if (ch.length !== 1) {
        return false;
      }
      const symbolCh = ["+", "-", "×", "÷"];
      return symbolCh.some((el) => el === ch) ? true : false;
    };
    protected isSign = (ch: string): boolean => {
      if (ch.length !== 1) {
        return false;
      }
      const signCh = ["+", "-"];
      return signCh.some((el) => el === ch) ? true : false;
    };

    // バッファの操作
    public pushBuffer = (input: string): void => {
      const MAX_RENDER_NUM: number = 18;
      if (this.buffer.length >= MAX_RENDER_NUM) {
        return;
      }
      if (this.isAns) {
        this.isAns = false;
        if (!this.isSymbol(input)) {
          this.buffer.length = 0;
        }
      } else if (this.buffer.length === 1) {
        switch (this.buffer[0]) {
          case "0":
            if (!this.isSymbol(input)) {
              console.log(`input : ${input}`);
              this.buffer.shift();
            }
            break;
          case "Syntax Error":
            this.buffer.shift();
        }
      }
      this.buffer.push(input);
    };
    public popBuffer = (): string => {
      if (this.buffer.length === 1) {
        this.buffer[0] = "0";
        return;
      }
      return this.buffer.pop();
    };
    public clearBuffer = (): void => {
      this.buffer.length = 0;
    };
    public getBuffer = (): Array<string> => {
      return this.buffer;
    };

    // 計算中心部分
    public calc = (): void => {
      // 文法エラー
      if (!this.convertBuffer()) {
        this.numbers.length = 0;
        this.symbols.length = 0;
        this.buffer.length = 0;
        this.buffer.push("Syntax Error");
        return null;
      }
      this.calcAns();
      this.buffer.length = 0;
      String(this.numbers)
        .split("")
        .forEach((val) => {
          this.buffer.push(val);
        });
      this.bfAns = this.numbers[0];
      this.numbers.length = 0;
      this.isAns = true;
    };
    protected convertBuffer = (): boolean => {
      let isBfNum: boolean = false;
      let numberStr: string = "";
      const firstbufferLength: number = this.buffer.length;
      while (this.buffer.length > 0) {
        const ch = this.buffer.shift();
        if (this.isNumber(ch) || ch == ".") {
          numberStr += ch;
          isBfNum = true;
        } else if (
          this.buffer.length === firstbufferLength - 1 &&
          this.isSign(ch)
        ) {
          console.log(`ch = ${ch}`);
          numberStr += ch;
        } else {
          if (!this.isSymbol(ch)) {
            return false;
          }
          if (isBfNum) {
            this.numbers.push(parseFloat(numberStr));
            numberStr = "";
            isBfNum = false;
          }
          this.symbols.push(ch);
        }
      }
      if (isBfNum) {
        this.numbers.push(parseInt(numberStr, 10));
        numberStr = "";
        isBfNum = false;
      }
      return this.numbers.length - this.symbols.length == 1 ? true : false;
    };
    protected calcAns = (): void => {
      for (let i = 0; i < this.symbols.length; ) {
        if (this.symbols[i] === "×") {
          const bfCalc: Array<number> = this.numbers.splice(i, 2);
          this.symbols.splice(i, 1);
          this.numbers.splice(i, 0, bfCalc[0] * bfCalc[1]);
        } else if (this.symbols[i] === "÷") {
          const bfCalc: Array<number> = this.numbers.splice(i, 2);
          this.symbols.splice(i, 1);
          this.numbers.splice(i, 0, bfCalc[0] / bfCalc[1]);
        } else {
          i++;
        }
      }
      for (let i = 0; i < this.symbols.length; ) {
        if (this.symbols[i] === "+") {
          const bfCalc: Array<number> = this.numbers.splice(i, 2);
          this.symbols.splice(i, 1);
          this.numbers.splice(i, 0, bfCalc[0] + bfCalc[1]);
        } else if (this.symbols[i] === "-") {
          const bfCalc: Array<number> = this.numbers.splice(i, 2);
          this.symbols.splice(i, 1);
          this.numbers.splice(i, 0, bfCalc[0] - bfCalc[1]);
        } else {
          i++;
        }
      }

      this.symbols.forEach((el) => {});
    };

    // 前の答えをバッファに追加
    public addBufferFromBfAns = (): void => {
      if (!this.bfAns && this.bfAns !== 0) {
        return;
      }
      if (!this.isSymbol(this.buffer[this.buffer.length - 1])) {
        return;
      }
      String(this.bfAns)
        .split("")
        .forEach((val) => {
          console.log(`val : ${val}`);
          this.buffer.push(val);
        });
    };
  }

  // 入出力
  class InOut {
    // 入力ボタンのHTML要素
    protected INPUT_BTN = {
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
      ans: document.getElementById("ans"),
    };
    // 出力のHTML要素
    protected OUTPUT = {
      display: document.getElementById("calc-display"),
    };
    // Calcクラスを利用
    protected calc = new Calc();

    // 入出力操作
    constructor() {
      Object.keys(this.INPUT_BTN).forEach((key) => {
        this.configBtn(key);
      });
      this.configKey();
    }
    protected configBtn = (key: any): void => {
      const node = this.INPUT_BTN[key];
      node.addEventListener("click", () => {
        this.clickedMotion(node);
        switch (key) {
          case "zero":
            this.calc.pushBuffer("0");
            break;
          case "one":
            this.calc.pushBuffer("1");
            break;
          case "two":
            this.calc.pushBuffer("2");
            break;
          case "three":
            this.calc.pushBuffer("3");
            break;
          case "four":
            this.calc.pushBuffer("4");
            break;
          case "five":
            this.calc.pushBuffer("5");
            break;
          case "six":
            this.calc.pushBuffer("6");
            break;
          case "seven":
            this.calc.pushBuffer("7");
            break;
          case "eight":
            this.calc.pushBuffer("8");
            break;
          case "nine":
            this.calc.pushBuffer("9");
            break;
          case "add":
            this.calc.pushBuffer("+");
            break;
          case "sub":
            this.calc.pushBuffer("-");
            break;
          case "mul":
            this.calc.pushBuffer("×");
            break;
          case "div":
            this.calc.pushBuffer("÷");
            break;
          case "dec":
            this.calc.pushBuffer(".");
            break;
          case "del":
            this.calc.popBuffer();
            break;
          case "ce":
            this.calc.clearBuffer();
            this.calc.pushBuffer("0");
            break;
          case "ans":
            this.calc.addBufferFromBfAns();
            break;
          case "equal":
            this.calc.calc();
            break;
        }
        this.renderDisplay();
      });
    };
    protected configKey = (): void => {
      document.addEventListener("keydown", (e) => {
        switch (e.key) {
          case "0":
            this.calc.pushBuffer("0");
            break;
          case "1":
            this.calc.pushBuffer("1");
            break;
          case "2":
            this.calc.pushBuffer("2");
            break;
          case "3":
            this.calc.pushBuffer("3");
            break;
          case "4":
            this.calc.pushBuffer("4");
            break;
          case "5":
            this.calc.pushBuffer("5");
            break;
          case "6":
            this.calc.pushBuffer("6");
            break;
          case "7":
            this.calc.pushBuffer("7");
            break;
          case "8":
            this.calc.pushBuffer("8");
            break;
          case "9":
            this.calc.pushBuffer("9");
            break;
          case "+":
          case "＋":
            this.calc.pushBuffer("+");
            break;
          case "-":
          case "－":
            this.calc.pushBuffer("-");
            break;
          case "*":
          case "＊":
            this.calc.pushBuffer("×");
            break;
          case "/":
            this.calc.pushBuffer("÷");
            break;
          case ".":
            this.calc.pushBuffer(".");
            break;
          case "Backspace":
            this.calc.popBuffer();
            break;
          case "Escape":
            this.calc.clearBuffer();
            this.calc.pushBuffer("0");
            break;
          case "@":
          case "＠":
            this.calc.addBufferFromBfAns();
            break;
          case "=":
          case "＝":
          case "Enter":
            this.calc.calc();
            break;
          default:
            return;
        }
        this.renderDisplay();
      });
    };
    protected clickedMotion = (node: any): void => {
      node.classList.add("clickedMotion");
      const timerId = setTimeout(() => {
        node.classList.remove("clickedMotion");
        clearTimeout(timerId);
      }, 100);
    };

    // 出力操作
    protected renderDisplay = (): void => {
      console.log(`buffer : ${this.calc.getBuffer()}`);
      this.OUTPUT.display.innerHTML = this.calc.getBuffer().join("");
    };
  }

  new InOut();
}
