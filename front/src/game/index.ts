function randInt(min: number, max: number, count: number) {
  return (Math.floor(Math.random() * (max - min + 1)) + count) % (max - min + 1) + min;
}

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

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

type Point = {
  x: number,
  y: number,
};

type MapPosition = {
  i: number,
  j: number,
  depth: number,
};

export class Game {

  public score: number;
  public gameOver: boolean;
  public gameOverCallback: (() => void) | null;
  public touchcount: number;
  public animationEffect: boolean;
  public displayScore: number;
  public lineHistory: string[] = [];
  public touchHistory: Point[] = [];

  private lastPos: Point;
  private _colors: string[];

  private blockMax: number;
  private map: number[][];
  private maxBlockRow: number;
  private maxBlockColumn: number;
  private BWIDTH: number;
  private BHEIGHT: number;
  private OUTLINE_PIXEL: number;
  private MAPPXWIDTH: number;
  private MAPPXHEIGHT: number;

  private gameID: number; //게임 루프제어용

  private canvas: HTMLCanvasElement; //canvas
  private context: CanvasRenderingContext2D; //canvas 2d

  constructor(canvas: HTMLCanvasElement) {
    this.score = 0;
    this.touchcount = 0;
    this.gameOver = false;
    this.gameOverCallback = null;
    this.lastPos = { 'y': -1, 'x': -1 };
    this.displayScore = 0;

    this.map = [[]];
    this.blockMax = 3; //default

    this.maxBlockRow = 15; //max map width
    this.maxBlockColumn = 8; //max map height
    this.BWIDTH = 31; //block width
    this.BHEIGHT = 31; //block height
    this.OUTLINE_PIXEL = 0;
    this.MAPPXWIDTH = 800; //canvas widlth
    this.MAPPXHEIGHT = 800; //canvas height
    this.gameID = 0;

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
  }

  private static getMousePos(canvas: HTMLCanvasElement, evt: MouseEvent) {
    const rect = canvas.getBoundingClientRect();
    return {
      x: evt.clientX - rect.left,
      y: evt.clientY - rect.top
    };
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
  private async draw(animationFrame: number) { //draw blocks and score
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
      if (animationFrame > 1)
        await sleep(33);
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
          this.map[i][j] = (randInt(1, this.blockMax, this.score) + j) % this.blockMax + 1;
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

  private async removeBlocks(argPos: MapPosition, blockCode: number): Promise<number> {
    let count = 0;

    const queue = new Queue<MapPosition>();
    queue.enqueue(argPos);

    let depth = argPos.depth;
    while (queue.length > 0) {
      const pos = queue.dequeue();

      if (pos === undefined)
        break;

      if (this.map[pos.i][pos.j] === 0)
        continue;

      this.map[pos.i][pos.j] = 0;
      count++;

      if (this.animationEffect) { //블록을 지워나가는 과정을 보여주는 부분.
        if (depth < pos.depth) {
          this.displayScore = this.score + count * count; //지우면서 점수 올라가는것을 보여줌
          await this.draw(1);
          await sleep(33);
          depth = pos.depth;
        }
      }
      //up
      if (pos.i !== 0 && this.map[pos.i - 1][pos.j] === blockCode) {
        queue.enqueue({ 'i': pos.i - 1, 'j': pos.j, 'depth': pos.depth + 1 });
      }
      //right
      if (pos.j !== this.maxBlockColumn - 1 && this.map[pos.i][pos.j + 1] === blockCode) {
        queue.enqueue({ 'i': pos.i, 'j': pos.j + 1, 'depth': pos.depth + 1 });
      }
      //down
      if (pos.i !== this.maxBlockRow - 1 && this.map[pos.i + 1][pos.j] === blockCode) {
        queue.enqueue({ 'i': pos.i + 1, 'j': pos.j, 'depth': pos.depth + 1 });
      }
      //left
      if (pos.j !== 0 && this.map[pos.i][pos.j - 1] === blockCode) {
        queue.enqueue({ 'i': pos.i, 'j': pos.j - 1, 'depth': pos.depth + 1 });
      }
    }

    // return count
    return new Promise<number>((resolve) => {
      resolve(count);
    });
  }

  private onTileClick = (e: MouseEvent) => { //mouse event
    const pos = Game.getMousePos(this.canvas, e);
    const { x, y } = pos;

    const column = Math.floor(x / (this.BWIDTH + this.OUTLINE_PIXEL));
    const row = Math.floor(y / (this.BHEIGHT + this.OUTLINE_PIXEL));

    if (row >= this.maxBlockRow || column >= this.maxBlockColumn) {
      return;
    }

    if (this.map[row][column] === 0) {
      return;
    }

    this.lastPos = { 'y': row, 'x': column };
  };

  private initialize(): void { //init game
    for (let i = 0; i < this.maxBlockRow; i++) {
      if (typeof (this.map[i]) === 'undefined')
        this.map[i] = [];

      for (let j = 0; j < this.maxBlockColumn; j++) {
        this.map[i][j] = 0;
      }
    }

    this.newBlocks();
    this.context.globalAlpha = 0.2;
    this.context.fillStyle = 'rgb(0, 171, 255)';
    this.context.fillRect(0, 0, this.MAPPXWIDTH, this.MAPPXHEIGHT);
    this.context.globalAlpha = 1;
  }

  // 이곳에서 그리기 및 블록처리를 해준다.
  private async gameProcLoop(gameID: number) {
    let createBlock = false;

    this.initialize();
    await this.draw(1);

    while (!this.gameOver && gameID === this.gameID) {
      await sleep(33);

      if (this.lastPos.x >= 0 && this.lastPos.y >= 0) {
        this.touchHistory.push(this.lastPos);
        const count = await this.removeBlocks({
          'i': this.lastPos.y,
          'j': this.lastPos.x,
          'depth': 0
        }, this.map[this.lastPos.y][this.lastPos.x]);

        this.touchcount += 1;
        this.score += count * count; //(count*count+count)/2 //점수 계산 식
        this.displayScore = this.score;

        this.lastPos = { 'y': -1, 'x': -1 };
        createBlock = true;
      }

      let isDown = false;
      let isContinue = true;
      while (isContinue) {
        isContinue = false;
        for (let i = this.maxBlockRow - 1; i > 0; i--) {
          for (let j = 0; j < this.maxBlockColumn; j++) {
            if (this.map[i][j] === 0 && this.map[i - 1][j] !== 0) {
              this.map[i][j] = this.map[i - 1][j];
              this.map[i - 1][j] = 0;

              isDown = true;
              isContinue = true;
            }
          }
        }

        if (this.animationEffect && isDown) {
          await this.draw(1);
          await sleep(33);
        }
      }

      if (createBlock) {
        this.newBlocks();
        const frame = this.animationEffect ? 5 : 1;
        await this.draw(frame);
        createBlock = false;
      }
    }
  }

  public startGame() {
    this.score = 0;
    this.displayScore = 0;
    this.touchcount = 0;
    this.lineHistory = [];
    this.touchHistory = [];
    this.gameOver = false;
    this.gameID++;

    void this.gameProcLoop(this.gameID);
  }
}
