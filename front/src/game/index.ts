
import XORShift from './xorshift';

class Queue<T> {
  list: T[] = [];
  get length() {
    return this.list.length;
  }
  enqueue(item: T) {
    this.list.push(item);
  }
  dequeue() {
    return this.list.shift();
  }
}

export type Point = {
  x: number,
  y: number,
};

const direction4: Point[] = [
  { x: 0, y: 1 },
  { x: 1, y: 0 },
  { x: 0, y: -1 },
  { x: -1, y: 0 },
];

export class Game {

  public score: number;
  public gameOver: boolean;
  public gameOverCallback: (() => void) | null;
  public touchCount: number;
  public animationEffect: boolean;
  public lineHistory: string[] = [];
  public touchHistory: Point[] = [];
  public random?: XORShift;

  private createBlock = false;
  private lastPos: Point;
  private _colors: string[];
  private _seed: number;

  private blockMax: number;
  private map: number[][];
  private maxBlockRow: number;
  private maxBlockColumn: number;
  private BWIDTH: number;
  private BHEIGHT: number;
  private OUTLINE_PIXEL: number;
  private MAPPXWIDTH: number;
  private MAPPXHEIGHT: number;

  private onScoreChangeCallback?: CallableFunction;

  private canvas: HTMLCanvasElement; //canvas
  private context: CanvasRenderingContext2D; //canvas 2d

  private bfsQueue: Queue<Point>;
  private removeBlockCode = 0;
  private removeBlockCount = 0;

  constructor(canvas: HTMLCanvasElement) {
    this.score = 0;
    this.touchCount = 0;
    this.gameOver = false;
    this.gameOverCallback = null;
    this.lastPos = { 'y': -1, 'x': -1 };

    this.map = [[]];
    this.blockMax = 3; //default

    this.maxBlockRow = 15; //max map width
    this.maxBlockColumn = 8; //max map height
    this.BWIDTH = 31; //block width
    this.BHEIGHT = 31; //block height
    this.OUTLINE_PIXEL = 0;
    this.MAPPXWIDTH = 800; //canvas width
    this.MAPPXHEIGHT = 800; //canvas height

    //option
    this.animationEffect = true;

    this.canvas = canvas;
    this.canvas.addEventListener('click', this.onTileClick);

    const context = this.canvas.getContext('2d');
    if (context === null) {
      throw new Error('canvas context is null');
    }
    this.context = context;

    this._colors = [ //color code
      '(255, 255, 255)',
      '(0, 171, 255)',
      '(255, 171, 0)',
      '(0, 255, 171)',
    ];

    this._seed = 0;

    this.bfsQueue = new Queue<Point>();
  }

  private static getMousePoint(canvas: HTMLCanvasElement, evt: MouseEvent) {
    const rect = canvas.getBoundingClientRect();
    return {
      x: evt.clientX - rect.left,
      y: evt.clientY - rect.top
    };
  }

  private static addPoint(p1: Point, p2: Point): Point {
    return { x: p1.x + p2.x, y: p1.y + p2.y };
  }

  private pointIsValid(p: Point): boolean {
    if (0 <= p.y && p.y < this.maxBlockRow) {
      if (0 <= p.x && p.x < this.maxBlockColumn) {
        return true;
      }
    }
    return false;
  }

  private set seed(seed: number) {
    this._seed = seed;
    this.random = new XORShift(seed);
  }

  public get seed() {
    return this._seed;
  }

  private set colors(colors: string[]) {
    this.blockMax = colors.length - 1;
    this._colors = colors;
  }

  private get colors() {
    return this._colors;
  }

  public set mapSize(size: { width: number, height: number }) {
    this.maxBlockColumn = size.width;
    this.maxBlockRow = size.height;

    this.MAPPXWIDTH = this.maxBlockColumn * this.BWIDTH; //canvas widlth
    this.MAPPXHEIGHT = this.maxBlockRow * this.BHEIGHT; //canvas height
  }

  // animationFrame 인자로 넘어온 값 만큼 블록이 올라가는 과정을 프임별로 보여준다
  private draw(animationFrame: number) { //draw blocks and score
    this.context.fillStyle = 'rgb(255, 255, 255)';
    this.context.fillRect(0, 0, this.MAPPXWIDTH, this.BHEIGHT);

    for (let animationIndex = 0; animationIndex < animationFrame; animationIndex++) {

      let yposFrameValue = 0;
      if (animationFrame > 1) {
        yposFrameValue = (this.BHEIGHT * (animationFrame - animationIndex - 1)) / animationFrame;

      }

      for (let i = 0; i < this.maxBlockRow; i++) {
        for (let j = 0; j < this.maxBlockColumn; j++) {
          const yPos = i * (this.BHEIGHT + this.OUTLINE_PIXEL);
          const xPos = j * (this.BWIDTH + this.OUTLINE_PIXEL);

          const colorCode = this.colors[this.map[i][j]];

          this.context.fillStyle = 'rgb' + colorCode;
          this.context.fillRect(xPos, yPos + yposFrameValue, this.BWIDTH, this.BHEIGHT);
        }
      }
    }
  }

  private newBlocks() {
    for (let i = 0; i < this.maxBlockRow; i++) {
      for (let j = 0; j < this.maxBlockColumn; j++) {
        if (i === 0) {
          if (this.map[i][j] !== 0) {
            //end
            // console.log("end!!!")
            this.gameOver = true;
            // this.startGame()

            if (this.gameOverCallback != null) {
              this.gameOverCallback();
            }

            return;
          }
        } else {
          this.map[i - 1][j] = this.map[i][j];
        }

        if (i === this.maxBlockRow - 1) {
          const randomValue = this.random?.next();
          if (randomValue !== undefined) {
            this.map[i][j] = randomValue % this.blockMax + 1;
          }
        }
      }

      if (i === this.maxBlockRow - 1) {
        let historyItem = '';
        for (let j = 0; j < this.maxBlockColumn; j++) {
          historyItem += this.map[i][j].toString();
        }
        this.lineHistory.push(historyItem);
      }
    }
  }

  private onTileClick = (e: MouseEvent) => {
    const pos = Game.getMousePoint(this.canvas, e);
    const { x, y } = pos;

    const column = Math.floor(x / (this.BWIDTH + this.OUTLINE_PIXEL));
    const row = Math.floor(y / (this.BHEIGHT + this.OUTLINE_PIXEL));

    if (row >= this.maxBlockRow || column >= this.maxBlockColumn) {
      return;
    }

    if (this.map[row][column] === 0) {
      return;
    }

    this.lastPos = { y: row, x: column };
  };

  private initialize(): void { //init game
    for (let i = 0; i < this.maxBlockRow; i++) {
      this.map[i] = new Array(this.maxBlockColumn).fill(0);
    }

    this.newBlocks();
    this.context.globalAlpha = 0.2;
    this.context.fillStyle = 'rgb(0, 171, 255)';
    this.context.fillRect(0, 0, this.MAPPXWIDTH, this.MAPPXHEIGHT);
    this.context.globalAlpha = 1;
  }

  private removeSingleDepthBlocks() {
    const pointsLength = this.bfsQueue.length;
    for (let i = 0; i < pointsLength; i++) {
      const curPoint = this.bfsQueue.dequeue();

      if (!curPoint) {
        continue;
      }

      for (const dir of direction4) {
        const nextPoint = Game.addPoint(curPoint, dir);

        if (!this.pointIsValid(nextPoint)) {
          continue;
        }

        if (this.map[nextPoint.y][nextPoint.x] !== this.removeBlockCode) {
          continue;
        }

        this.removeBlockCount += 1;
        this.map[nextPoint.y][nextPoint.x] = 0;
        this.bfsQueue.enqueue(nextPoint);
      }
    }
  }

  // 이곳에서 그리기 및 블록처리를 해준다.
  private gameLoop = () => {
    if (this.gameOver) {
      return;
    }

    let userInputProc = true;

    do {
      userInputProc = true;
      if (this.bfsQueue.length > 0) {
        userInputProc = false;
        this.removeSingleDepthBlocks();
      } else {
        this.score += this.removeBlockCount * this.removeBlockCount;
        this.removeBlockCount = 0;
        for (let y = this.maxBlockRow - 1; y > 0; y--) {
          for (let x = 0; x < this.maxBlockColumn; x++) {
            if (this.map[y][x] === 0 && this.map[y - 1][x] !== 0) {
              this.map[y][x] = this.map[y - 1][x];
              this.map[y - 1][x] = 0;
              userInputProc = false;
            }
          }
        }
      }
    } while (!this.animationEffect && (this.removeBlockCount > 0 || !userInputProc));

    const displayScore = this.score + this.removeBlockCount * this.removeBlockCount;
    if (this.removeBlockCount !== 0) {
      this.onScoreChangeCallback?.(displayScore);
    }

    if (this.lastPos.x >= 0 && this.lastPos.y >= 0 && userInputProc) {
      if (this.createBlock) {
        this.onScoreChangeCallback?.(displayScore);
        this.newBlocks();
        this.createBlock = false;
        this.lastPos = { y: -1, x: -1 };
      }
    }

    if (this.lastPos.x >= 0 && this.lastPos.y >= 0 && userInputProc) {
      this.touchHistory.push(this.lastPos);

      this.removeBlockCode = this.map[this.lastPos.y][this.lastPos.x];
      this.removeBlockCount = 1;
      this.map[this.lastPos.y][this.lastPos.x] = 0;
      this.bfsQueue.enqueue(this.lastPos);

      this.touchCount += 1;
      this.createBlock = true;
    }
    else {
      this.draw(1);
    }

    setTimeout(() => {
      requestAnimationFrame(this.gameLoop);
    }, 1000 / 30);
  };

  public startGame(seed: number) {
    this.score = 0;
    this.touchCount = 0;
    this.lineHistory = [];
    this.touchHistory = [];
    this.gameOver = false;
    this.createBlock = false;

    this.seed = seed;
    this.initialize();

    window.requestAnimationFrame(this.gameLoop);
  }

  public set onScoreChange(fn: CallableFunction) {
    this.onScoreChangeCallback = fn;
  }
}
