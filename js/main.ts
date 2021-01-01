"use strict";
{
  class Calc {
    private inputs: Array<string> = ["0"];
    private numbers: Array<number> = [];
    private symbols: Array<string> = [];
    private isAns: boolean = false;
    private bfAns: number = 0;

    isNumber = (ch: string): boolean => {
      if (ch.length !== 1) {
        return false;
      }
      const numberCh = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
      return numberCh.some((el) => el === ch) ? true : false;
    };

    isSymbol = (ch: string): boolean => {
      if (ch.length !== 1) {
        return false;
      }
      const symbolCh = ["+", "-", "×", "÷"];
      return symbolCh.some((el) => el === ch) ? true : false;
    };

    isSign = (ch: string): boolean => {
      if (ch.length !== 1) {
        return false;
      }
      const signCh = ["+", "-"];
      return signCh.some((el) => el === ch) ? true : false;
    };

    public pushInput = (input: string): void => {
      const MAX_RENDER_NUM: number = 18;
      if (this.inputs.length >= MAX_RENDER_NUM) {
        return;
      }
      if (this.isAns) {
        this.isAns = false;
        if (this.isNumber(input)) {
          this.inputs.length = 0;
        }
      } else if (this.inputs.length === 1) {
        switch (this.inputs[0]) {
          case "0":
          case "Syntax Error":
            this.inputs.shift();
        }
      }
      this.inputs.push(input);
    };
    public popInput = (): string => {
      return this.inputs.pop();
    };
    public clearInputs = (): void => {
      this.inputs.length = 0;
    };
    public getInputs = (): Array<string> => {
      return this.inputs;
    };

    private convertInputs = (): boolean => {
      let isBfNum: boolean = false;
      let numberStr: string = "";
      const firstInputsLength: number = this.inputs.length;
      while (this.inputs.length > 0) {
        const ch = this.inputs.shift();
        if (this.isNumber(ch) || ch == ".") {
          numberStr += ch;
          isBfNum = true;
        } else if (
          this.inputs.length === firstInputsLength - 1 &&
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
      String(this.numbers)
        .split("")
        .forEach((val) => {
          this.inputs.push(val);
        });
      this.bfAns = this.numbers[0];
      this.numbers.length = 0;
      this.isAns = true;
    };
    public setBfAns = (): void => {
      console.log(
        `bfAns[${String(this.bfAns).split("").length}] : ${String(
          this.bfAns
        ).split("")}`
      );
      if (!this.bfAns && this.bfAns !== 0) {
        return;
      }
      if (!this.isSymbol(this.inputs[this.inputs.length - 1])) {
        return;
      }
      String(this.bfAns)
        .split("")
        .forEach((val) => {
          console.log(`val : ${val}`);
          this.inputs.push(val);
        });
    };
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
            this.calc.pushInput("-");
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
          case "equal":
            this.calc.calc();
            break;
        }
        console.log("render");
        this.renderDisplay();
      });
    };

    public renderDisplay(): void {
      console.log(`inputs : ${this.calc.getInputs()}`);
      this.OUTPUT.display.innerHTML = this.calc.getInputs().join("");
    }
  }

  new InOut();
}
