import { darkTheme } from '~/stitches.config';
import Queue from '~/utils/queue';

import XORShift from './xorshift';

const direction4: Point[] = [
  { x: 0, y: 1 },
  { x: 1, y: 0 },
  { x: 0, y: -1 },
  { x: -1, y: 0 },
];



export class Game {
  public readonly: boolean;
  public score: number;
  public isGameOver: boolean;
  public onStateChange?: (isGameOver: boolean) => void;
  public touchCallback?: (p: Point) => void;

  public touchCount: number;
  public animationEffect: boolean;
  public touchHistory: Point[] = [];
  public random?: XORShift;

  private createBlock = false;
  private lastPos: Point;
  private _colors: string[];
  private _seed: number;

  private readonly map: number[][];
  private readonly tileWidth: number;
  private readonly canvas: HTMLCanvasElement; //canvas

  private blockMax: number;
  private maxBlockRow: number;
  private maxBlockColumn: number;
  private canvasWidth: number;
  private canvasHeight: number;
  private receivedLineCount: number;

  private onScoreChangeCallback?: CallableFunction;

  private context: CanvasRenderingContext2D; //canvas 2d

  private bfsQueue: Queue<Point>;
  private eventQueue: Queue<PopTileEvent>;
  private removeBlockCode = 0;
  private removeBlockCount = 0;
  private singlePlay = true;


  constructor(canvas: HTMLCanvasElement, tileWidth = 31, singlePlay = true) {
    this.readonly = false;
    this.score = 0;
    this.touchCount = 0;
    this.receivedLineCount = 0;
    this.isGameOver = false;
    this.lastPos = { 'y': -1, 'x': -1 };
    this.singlePlay = singlePlay;

    this.map = [[]];
    this.blockMax = 3; //default

    this.maxBlockRow = 15; //max map width
    this.maxBlockColumn = 8; //max map height
    this.tileWidth = tileWidth; //tile width

    this.canvasWidth = this.maxBlockColumn * this.tileWidth; //canvas width
    this.canvasHeight = this.maxBlockRow * this.tileWidth; //canvas height

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
      '(80, 150, 220)', // Soft cornflower/pastel blue
      '(235, 160, 60)',  // Soft warm amber/orange
      '(85, 195, 145)',  // Soft sage/emerald green
    ];

    this._seed = 0;

    this.bfsQueue = new Queue<Point>();
    this.eventQueue = new Queue<PopTileEvent>();
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

  public touch(p: Point) {
    this.eventQueue.enqueue({
      type: 'Touch',
      data: p,
    });
  }

  public apppendLine(lines: Lines) {
    this.eventQueue.enqueue({
      type: 'Attack',
      data: lines
    });
  }

  public set seed(seed: number) {
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

    this.canvasWidth = this.maxBlockColumn * this.tileWidth; //canvas width
    this.canvasHeight = this.maxBlockRow * this.tileWidth; //canvas height
  }

  // animationFrame 인자로 넘어온 값 만큼 블록이 올라가는 과정을 프임별로 보여준다
  private draw(animationFrame: number) { //draw blocks and score
    const isDark = document.documentElement.classList.contains(darkTheme.className);
    const bgColor = isDark ? 'rgb(37, 37, 38)' : 'rgb(255, 255, 255)';
    this.context.fillStyle = bgColor;
    this.context.fillRect(0, 0, this.canvasWidth, this.tileWidth);

    for (let animationIndex = 0; animationIndex < animationFrame; animationIndex++) {
      let yposFrameValue = 0;
      if (animationFrame > 1) {
        yposFrameValue = (this.tileWidth * (animationFrame - animationIndex - 1)) / animationFrame;
      }

      // Pass 1: Draw all block backgrounds
      for (let i = 0; i < this.maxBlockRow; i++) {
        for (let j = 0; j < this.maxBlockColumn; j++) {
          const yPos = i * this.tileWidth;
          const xPos = j * this.tileWidth;

          if (this.map[i][j] === 0) {
            this.context.fillStyle = bgColor;
            this.context.fillRect(xPos, yPos + yposFrameValue, this.tileWidth, this.tileWidth);
          } else {
            const colorIdx = this.map[i][j];
            const colorCode = this.colors[colorIdx];
            const match = colorCode.match(/(\d+),\s*(\d+),\s*(\d+)/);

            let r = 255, g = 255, b = 255;
            if (match) {
              r = parseInt(match[1]);
              g = parseInt(match[2]);
              b = parseInt(match[3]);
            }

            let fillColor = '';
            if (isDark) {
              fillColor = `rgb(${Math.floor(r * 0.65)}, ${Math.floor(g * 0.65)}, ${Math.floor(b * 0.65)})`;
            } else {
              fillColor = `rgb(${r}, ${g}, ${b})`;
            }

            this.context.fillStyle = fillColor;
            this.context.fillRect(xPos, yPos + yposFrameValue, this.tileWidth, this.tileWidth);
          }
        }
      }

      // Pass 2: Draw all group outlines on top of the backgrounds
      for (let i = 0; i < this.maxBlockRow; i++) {
        for (let j = 0; j < this.maxBlockColumn; j++) {
          const yPos = i * this.tileWidth;
          const xPos = j * this.tileWidth;

          if (this.map[i][j] !== 0) {
            const colorIdx = this.map[i][j];
            const colorCode = this.colors[colorIdx];
            const match = colorCode.match(/(\d+),\s*(\d+),\s*(\d+)/);

            let r = 255, g = 255, b = 255;
            if (match) {
              r = parseInt(match[1]);
              g = parseInt(match[2]);
              b = parseInt(match[3]);
            }

            let borderColor = '';
            if (isDark) {
              borderColor = `rgb(${Math.floor(r * 0.95)}, ${Math.floor(g * 0.95)}, ${Math.floor(b * 0.95)})`;
            } else {
              borderColor = `rgb(${Math.floor(r * 0.75)}, ${Math.floor(g * 0.75)}, ${Math.floor(b * 0.75)})`;
            }

            const leftX = xPos;
            const rightX = xPos + this.tileWidth;
            const topY = yPos + yposFrameValue;
            const bottomY = yPos + yposFrameValue + this.tileWidth;

            const w = 3.0; // lineWidth of 3px
            const halfW = w / 2; // 1.5px offset to draw strictly inside

            this.context.strokeStyle = borderColor;
            this.context.lineWidth = w;
            this.context.lineJoin = 'round';
            this.context.lineCap = 'round';

            this.context.beginPath();

            // Top edge outer boundary
            if (i === 0 || this.map[i - 1][j] !== colorIdx) {
              const lineY = topY + halfW;
              const startX = (j === 0 || this.map[i][j - 1] !== colorIdx) ? leftX + halfW : leftX;
              const endX = (j === this.maxBlockColumn - 1 || this.map[i][j + 1] !== colorIdx) ? rightX - halfW : rightX;
              this.context.moveTo(startX, lineY);
              this.context.lineTo(endX, lineY);
            }

            // Bottom edge outer boundary
            if (i === this.maxBlockRow - 1 || this.map[i + 1][j] !== colorIdx) {
              const lineY = bottomY - halfW;
              const startX = (j === 0 || this.map[i][j - 1] !== colorIdx) ? leftX + halfW : leftX;
              const endX = (j === this.maxBlockColumn - 1 || this.map[i][j + 1] !== colorIdx) ? rightX - halfW : rightX;
              this.context.moveTo(startX, lineY);
              this.context.lineTo(endX, lineY);
            }

            // Left edge outer boundary
            if (j === 0 || this.map[i][j - 1] !== colorIdx) {
              const lineX = leftX + halfW;
              const startY = (i === 0 || this.map[i - 1][j] !== colorIdx) ? topY + halfW : topY;
              const endY = (i === this.maxBlockRow - 1 || this.map[i + 1][j] !== colorIdx) ? bottomY - halfW : bottomY;
              this.context.moveTo(lineX, startY);
              this.context.lineTo(lineX, endY);
            }

            // Right edge outer boundary
            if (j === this.maxBlockColumn - 1 || this.map[i][j + 1] !== colorIdx) {
              const lineX = rightX - halfW;
              const startY = (i === 0 || this.map[i - 1][j] !== colorIdx) ? topY + halfW : topY;
              const endY = (i === this.maxBlockRow - 1 || this.map[i + 1][j] !== colorIdx) ? bottomY - halfW : bottomY;
              this.context.moveTo(lineX, startY);
              this.context.lineTo(lineX, endY);
            }

            this.context.stroke();
          }
        }
      }
    }
  }

  private newBlocks() {
    for (let i = 0; i < this.maxBlockRow; i++) {
      for (let j = 0; j < this.maxBlockColumn; j++) {
        if (i === 0) {
          if (this.map[i][j] !== 0) {
            this.isGameOver = true;
            this.onStateChange?.(this.isGameOver);
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
    }
  }

  private onTileClick = (e: MouseEvent) => {
    if (this.readonly) {
      e.preventDefault();
      return;
    }

    const pos = Game.getMousePoint(this.canvas, e);
    const { x, y } = pos;

    const column = Math.floor(x / this.tileWidth);
    const row = Math.floor(y / this.tileWidth);

    if (row >= this.maxBlockRow || column >= this.maxBlockColumn) {
      return;
    }

    if (this.map[row][column] === 0) {
      return;
    }

    if (this.singlePlay) {
      this.lastPos = { y: row, x: column };
    } else {
      if (this.isGameOver === false) {
        if (this.touchCallback) {
          this.touchCallback({ y: row, x: column });
        }
      }
    }
  };

  private initialize(): void { //init game
    this.eventQueue = new Queue<PopTileEvent>();
    for (let i = 0; i < this.maxBlockRow; i++) {
      this.map[i] = new Array(this.maxBlockColumn).fill(0);
    }

    this.newBlocks();
    this.context.globalAlpha = 0.2;
    this.context.fillStyle = 'rgb(80, 150, 220)';
    this.context.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
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
    if (this.isGameOver) {
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

    // 외부에서 강제로 발생시킨 touchEvent 를 일반 touch 이벤트 처럼 처리
    if (this.eventQueue.length > 0 && this.lastPos.x === -1 && this.lastPos.y === -1) {
      const p = this.eventQueue.dequeue();
      if (p) {
        if (p.type === 'Touch') {
          this.lastPos = p.data as Point;
        } else {
          const lines = p.data as Lines;
          for (let i = 0; i < lines; i++) {
            this.newBlocks();
          }
        }

      }
    }

    if (this.lastPos.x >= 0 && this.lastPos.y >= 0 && userInputProc) {
      if (this.createBlock) {
        this.onScoreChangeCallback?.(displayScore);
        this.newBlocks();

        for (let i = 0; i < this.receivedLineCount; i++) {
          this.newBlocks();
        }
        this.receivedLineCount = 0;

        this.createBlock = false;
        this.lastPos = { y: -1, x: -1 };
      }
    }

    if (this.lastPos.x >= 0 && this.lastPos.y >= 0 && userInputProc) {
      this.touchHistory.push(this.lastPos);

      this.removeBlockCode = this.map[this.lastPos.y][this.lastPos.x];
      if (this.removeBlockCode !== 0) {
        this.removeBlockCount = 1;
        this.map[this.lastPos.y][this.lastPos.x] = 0;
        this.bfsQueue.enqueue(this.lastPos);
      }

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
    this.receivedLineCount = 0;
    this.touchHistory = [];
    this.isGameOver = false;
    this.createBlock = false;
    this.lastPos = { x: -1, y: -1 };

    this.seed = seed;
    this.initialize();
    this.onStateChange?.(false);

    window.requestAnimationFrame(this.gameLoop);
  }

  public set onScoreChange(fn: CallableFunction) {
    this.onScoreChangeCallback = fn;
  }
}
