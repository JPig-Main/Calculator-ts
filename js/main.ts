"use strict";
{
  const isNumber = (ch: string): boolean => {
    if (ch.length !== 1) {
      return false;
    }
    const numberCh = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
    return numberCh.some((el) => el === ch) ? true : false;
  };

  const isSymbol = (ch: string): boolean => {
    if (ch.length !== 1) {
      return false;
    }
    const symbolCh = ["+", "－", "×", "÷"];
    return symbolCh.some((el) => el === ch) ? true : false;
  };

  class Calc {
    private inputs: Array<string> = ["0"];
    private numbers: Array<number> = [];
    private symbols: Array<string> = [];
    private isAns: boolean = false;
    private bfAns: number = 0;
    private SIGN = {
      plus: 1,
      minus: -1,
    };
    private sign: number = this.SIGN.plus;

    public pushInput = (input: string): void => {
      if (this.isAns) {
        this.inputs.shift();
        this.inputs.push(input);
        this.isAns = false;
      } else if (this.inputs.length === 1) {  
        switch (this.inputs[0]) {
          case "0":
          case "Syntax Error":
            this.inputs.shift();
          default:
            this.inputs.push(input);
        }
      } else {
        this.inputs.push(input);
      }
    };
    public popInput = (): string => {
      return this.inputs.pop();
    };
    public clearInputs = (): void => {
      this.inputs.length = 0;
    };
    public getInput = (): Array<string> => {
      return this.inputs;
    };
    private setSign = (sign: number): void => {
      this.sign = sign;
    };
    private getSign = (): number => {
      return this.sign;
    };
    public reversePm = (): void => {
      this.setSign(
        this.getSign() === this.SIGN.plus ? this.SIGN.plus : this.SIGN.minus
      );
    };

    private convertInputs = (): boolean => {
      let ch: string = "";
      let isBfSmb: boolean = true;
      while (this.inputs.length > 0) {
        ch = this.inputs.shift();
        if (isNumber(ch)) {
          const numberPos: number = this.numbers.length - 1;
          const number: number = parseInt(ch, 10);
          if (isBfSmb) {
            isBfSmb = false;
            this.numbers.push(number);
          } else {
            this.numbers[numberPos] *= 10;
            this.numbers[numberPos] += number;
          }
        } else {
          if (!isSymbol(ch)) {
            return false;
          }
          isBfSmb = true;
          this.symbols.push(ch);
        }
      }
      return this.numbers.length - this.symbols.length == 1 ? true : false;
    };
    private calcAns = (): void => {
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
        } else if (this.symbols[i] === "－") {
          const bfCalc: Array<number> = this.numbers.splice(i, 2);
          this.symbols.splice(i, 1);
          this.numbers.splice(i, 0, bfCalc[0] - bfCalc[1]);
        } else {
          i++;
        }
      }

      this.symbols.forEach((el) => {});
    };
    public calc = (): void => {
      // 文法エラー
      if (!this.convertInputs()) {
        this.numbers.length = 0;
        this.symbols.length = 0;
        this.inputs.length = 0;
        this.inputs.push("Syntax Error");
        return null;
      }
      this.calcAns();
      this.inputs.length = 0;
      this.inputs[0] = String(this.numbers[0]);
      this.numbers.length = 0;
      this.bfAns = this.numbers[0];
      this.isAns = true;
    };
    public setBfAns = (): void => {};
  }

  class InOut {
    private INPUT_BTN = {
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
      pm: document.getElementById("pm"),
      ce: document.getElementById("ce"),
      del: document.getElementById("del"),
      ans: document.getElementById("ans"),
    };

    private OUTPUT = {
      display: document.getElementById("calc-display"),
    };

    private calc = new Calc();

    constructor() {
      Object.keys(this.INPUT_BTN).forEach((key) => {
        this.configInput(key);
      });
    }

    private clicked = (node: any): void => {
      node.classList.add("clicked");
      const timerId = setTimeout(() => {
        node.classList.remove("clicked");
        clearTimeout(timerId);
      }, 100);
    };

    private configInput = (key: any): void => {
      const node = this.INPUT_BTN[key];
      node.addEventListener("click", () => {
        this.clicked(node);
        switch (key) {
          case "zero":
            this.calc.pushInput("0");
            break;
          case "one":
            this.calc.pushInput("1");
            break;
          case "two":
            this.calc.pushInput("2");
            break;
          case "three":
            this.calc.pushInput("3");
            break;
          case "four":
            this.calc.pushInput("4");
            break;
          case "five":
            this.calc.pushInput("5");
            break;
          case "six":
            this.calc.pushInput("6");
            break;
          case "seven":
            this.calc.pushInput("7");
            break;
          case "eight":
            this.calc.pushInput("8");
            break;
          case "nine":
            this.calc.pushInput("9");
            break;
          case "add":
            this.calc.pushInput("+");
            break;
          case "sub":
            this.calc.pushInput("－");
            break;
          case "mul":
            this.calc.pushInput("×");
            break;
          case "div":
            this.calc.pushInput("÷");
            break;
          case "dec":
            this.calc.pushInput(".");
            break;
          case "del":
            this.calc.popInput();
            break;
          case "ce":
            this.calc.clearInputs();
            this.calc.pushInput("0");
            break;
          case "ans":
            this.calc.setBfAns();
            break;
          case "pm":
            this.calc.reversePm();
            break;
          case "equal":
            this.calc.calc();
            break;
        }
        console.log("render");
        this.renderDisplay();
      });
    };

    public renderDisplay(): void {
      this.OUTPUT.display.innerHTML = this.calc.getInput().join("");
    }
  }

  new InOut();
}
