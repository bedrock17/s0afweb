

let cvs: any //canvas
let ctx: any //canvas 2d

function randInt(min: number, max: number, count: number) {
	const ranNum = (Math.floor(Math.random() * (max - min + 1)) + count) % (max - min + 1) + min
	return ranNum
}

function getMousePos(canvas: HTMLCanvasElement, evt: any) {
	const rect = canvas.getBoundingClientRect();
	return {
		x: evt.clientX - rect.left,
		y: evt.clientY - rect.top
	};
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

type POS = {
	x: number;
	y: number;
}

type MAPPOS = {
	i: number;
	j: number;
	depth: number;
}

export class Game {

	public score: number
	public gameOver: boolean
	public gameOverCallback: (() => void) | null
	public touchcount: number
	public dropEffect: boolean
	public deleteEffect: boolean
	public displayScore: number
	public lineHistory: string[] = []
	public touchHistory: POS[] = []

	private handleInit: boolean
	private lastPos: POS
	private colors: string[]
	
	private blockMax: number
	private map: number[][]
	private maxBlockRow: number
	private maxBlockColum: number
	private BWIDTH: number
	private BHEIGHT: number
	private OUTLINE_PIXEL: number
	private MAPPXWIDTH: number
	private MAPPXHEIGHT: number

	private gameID: number //게임 루프제어용


	constructor() {
		this.score = 0
		this.touchcount = 0
		this.gameOver = false
		this.handleInit = false
		this.gameOverCallback = null
		this.lastPos = {"y": -1, "x": -1}
		this.displayScore = 0

		this.map = [[]]
		this.blockMax = 3 //default

		this.maxBlockRow = 15 //max map width
		this.maxBlockColum = 8 //max map height
		this.BWIDTH = 31 //block width 
		this.BHEIGHT = 31 //block height 
		this.OUTLINE_PIXEL = 0
		this.MAPPXWIDTH = 800 //canvas widlth
		this.MAPPXHEIGHT = 800 //canvas height
		this.gameID = 0

		//option
		this.dropEffect = true
		this.deleteEffect = true

		this.colors = [ //color code
			"(255, 255, 255)",
			"(0, 171, 255)",
			"(255, 171, 0)",
			"(0, 255, 171)",
		]
	}

	public setColors(colorArray: string[]) {
		this.blockMax = colorArray.length -1
		this.colors = colorArray
	}

	public setMapSize(width = 8, height = 15) {
		this.maxBlockColum = width
		this.maxBlockRow = height

		this.MAPPXWIDTH = this.maxBlockColum * this.BWIDTH //canvas widlth
		this.MAPPXHEIGHT = this.maxBlockRow * this.BHEIGHT //canvas height
	}
	

	// animationFrame 인자로 넘어온 값 만큼 블록이 올라가는 과정을 프임별로 보여준다
	private async draw(animationFrame: number) { //draw blocks and score
		
		// ctx.globalAlpha = 1
		ctx.fillStyle = 'rgb(255, 255, 255)'
		ctx.fillRect(0, 0, this.MAPPXWIDTH, this.BHEIGHT)

		for (let animationIndex = 0; animationIndex < animationFrame; animationIndex++) {
			
			let yposFrameValue = 0
			if (animationFrame > 1) {
				yposFrameValue = (this.BHEIGHT * (animationFrame - animationIndex - 1)) / animationFrame
				
			}

			for (let i = 0; i < this.maxBlockRow; i++) {
				for (let j = 0; j < this.maxBlockColum; j++) {
					const ypos = i * (this.BHEIGHT + this.OUTLINE_PIXEL)
					const xpos = j * (this.BWIDTH + this.OUTLINE_PIXEL)

					const colorCode = this.colors[this.map[i][j]]
					
					// if (MAP[i][j] == 0)
					// 	colorCode = bgColor
					
					ctx.fillStyle = "rgb" + colorCode
					ctx.fillRect(xpos, ypos+yposFrameValue, this.BWIDTH, this.BHEIGHT)
		
					//  console.log(xpos, ypos, BWIDTH, BHEIGHT)
		
				}
			}
			if (animationFrame > 1)
				await sleep(33)
		}
	}
	

	private newBlocks() {
		let i = 0
		let j = 0
		for (i = 0; i < this.maxBlockRow; i++) {
			for (j = 0; j < this.maxBlockColum; j++) {
				if (i == 0) {
					if (this.map[i][j] != 0) {
						//end
						// console.log("end!!!")
						this.gameOver = true
						// this.startGame()
						
						if (this.gameOverCallback != null) {
							this.gameOverCallback()
						}

						return
						
					}
				} else {
					this.map[i - 1][j] = this.map[i][j]
				}
	
				if (i == this.maxBlockRow - 1) {
					this.map[i][j] = (randInt(1, this.blockMax, this.score) + j) % this.blockMax + 1
				}
			}

			if (i == this.maxBlockRow - 1) {
				let historyItem = ""
				for (j = 0; j < this.maxBlockColum; j++) {
					historyItem += this.map[i][j].toString()
				}
				this.lineHistory.push(historyItem)
			}
		}
	}

	// 이곳에서 그리기 및 블록처리를 해준다.
	private async gameProcLoop(gameID: number) {
		let createBlock = false
		
		this.initMAP()
		await this.draw(1)
		// await sleep(100)

		while (!this.gameOver && gameID == this.gameID) {
			// console.log(this.gameOver, gameID, this.gameID)
			
			await sleep(33)
			
			if (this.lastPos.x >= 0 && this.lastPos.y >= 0) {
				this.touchHistory.push(this.lastPos)
				const count = await this.removeBlocks({
					"i": this.lastPos.y,
					"j": this.lastPos.x,
					"depth": 0
				}, this.map[this.lastPos.y][this.lastPos.x])

				this.touchcount += 1
				this.score += count*count //(count*count+count)/2 //점수 계산 식
				this.displayScore = this.score

				this.lastPos = {"y": -1, "x": -1}
				createBlock = true
			}

			let isDown = false
			let isContinue = true
			while (isContinue) {
				isContinue = false
				for (let i = this.maxBlockRow - 1; i > 0; i--) {
					for (let j = 0; j < this.maxBlockColum; j++) {
						if (this.map[i][j] == 0 && this.map[i - 1][j] != 0) {
							this.map[i][j] = this.map[i - 1][j]
							this.map[i - 1][j] = 0

							isDown = true
							isContinue = true
						}
					}
				}

				if (this.dropEffect) {
					if (isDown) {
						await this.draw(1)
						await sleep(33)
					}
				}
			}
			
			if (createBlock) {
				this.newBlocks()
				if (this.dropEffect) {
					await this.draw(5)
				} else {
					await this.draw(1)
				}
				createBlock = false
			}
			
			
		}
	}

  private async removeBlocks(argPos: MAPPOS, blockCode: any): Promise<number> {
		
		let count = 0
		
		const queue = new Queue<MAPPOS>()
		queue.enqueue(argPos)

		let depth = argPos.depth
		while (queue.length > 0)
		{
			const pos = queue.dequeue()

			if (pos == undefined)
				break

			if (this.map[pos.i][pos.j] == 0)
				continue
			
			this.map[pos.i][pos.j] = 0
			// console.log(pos, queue.length)
			count++
			
			if (this.deleteEffect) { //블록을 지워나가는 과정을 보여주는 부분.
				if (depth < pos.depth) {
					this.displayScore = this.score + count*count //지우면서 점수 올라가는것을 보여줌
					await this.draw(1)
					await sleep(33)
					depth = pos.depth
				}
			}
			//up
			if (pos.i != 0 && this.map[pos.i - 1][pos.j] == blockCode) {
				queue.enqueue({"i": pos.i - 1, "j": pos.j, "depth": pos.depth + 1})
			}
			//right
			if (pos.j != this.maxBlockColum - 1 && this.map[pos.i][pos.j + 1] == blockCode) {
				queue.enqueue({"i": pos.i, "j": pos.j + 1, "depth": pos.depth + 1})
			}
			//down
			if (pos.i != this.maxBlockRow - 1 && this.map[pos.i + 1][pos.j] == blockCode) {
				queue.enqueue({"i": pos.i + 1, "j": pos.j, "depth": pos.depth + 1})
			}
			//left
			if (pos.j != 0 && this.map[pos.i][pos.j - 1] == blockCode) {
				queue.enqueue({"i": pos.i, "j": pos.j - 1, "depth": pos.depth + 1})
			}
		}
		
		// return count
		return new Promise<number>((resolve) => {
			resolve(count);
		})
	}

	private proc = (e: any) => { //mouse event
	
		if (cvs == null) {
			return
		}
	
		const pos = getMousePos(cvs, e)
	
		const xpos = pos.x
		const ypos = pos.y
	
		const j = Math.floor(xpos / (this.BWIDTH + this.OUTLINE_PIXEL))
		const i = Math.floor(ypos / (this.BHEIGHT + this.OUTLINE_PIXEL))
	
		if (i >= this.maxBlockRow || j >= this.maxBlockColum) {
			// console.log("big!", i, j)
			return
		}
	
		if (this.map[i][j] == 0) {
			// 빈 타일
			return
		} else {
			this.lastPos = {"y": i, "x": j};
		}
	}

	private initMAP(): void { //init game

		cvs = document.getElementById('cvs');
	
		if (cvs == null) {
			return
		}
	
		for (let i = 0; i < this.maxBlockRow; i++) {
			if (typeof (this.map[i]) == "undefined")
				this.map[i] = []
	
			for (let j = 0; j < this.maxBlockColum; j++) {
				this.map[i][j] = 0
			}
		}
	
		this.newBlocks()

		if (this.handleInit == false) {
			ctx = cvs.getContext('2d')
			
			if (cvs == null) {
				return
			}
			
			cvs.addEventListener("click", this.proc);
	
			ctx.globalAlpha = 0.2
			ctx.fillStyle = 'rgb(0, 171, 255)'
			ctx.fillRect(0, 0, this.MAPPXWIDTH, this.MAPPXHEIGHT)
			ctx.globalAlpha = 1

			this.handleInit = true
		}
	}

	public startGame() {
		
		this.score = 0
		this.displayScore = 0
		this.touchcount = 0
		this.lineHistory = []
		this.touchHistory = []

		this.gameOver = false
		this.gameID++
		this.handleInit = false
		
		cvs = null

		this.gameProcLoop(this.gameID)
	
	}
	
}
