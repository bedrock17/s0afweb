const colors = [ //color code
	"(255, 255, 255)",
	"(0, 171, 255)",
	"(255, 171, 0)",
	"(0, 255, 171) "
]
const BLCOKCOLORMAX = 3
let cvs: any //canvas
let ctx: any //canvas 2d

const MAP: any = {}

const MAPX = 8 //max map width
const MAPY = 15 //max map height
const BWIDTH = 31 //block width 
const BHEIGHT = 31 //block height 
const OUTLINE_PIXEL = 0
const MAPPXWIDTH = 800 //canvas widlth
const MAPPXHEIGHT = 800 //canvas heightㅁ

function randInt(min: number, max: number) {
	const ranNum = Math.floor(Math.random() * (max - min + 1)) + min
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


function draw() { //draw blocks and score

	ctx.globalAlpha = 1
	ctx.fillStyle = 'rgb(0, 0, 0)'
	ctx.fillRect(0, 0, MAPPXWIDTH, MAPPXHEIGHT)
	ctx.globalAlpha = 1

	
	for (let i = 0; i < MAPY; i++) {
		for (let j = 0; j < MAPX; j++) {
			const ypos = i * (BHEIGHT + OUTLINE_PIXEL)
			const xpos = j * (BWIDTH + OUTLINE_PIXEL)
			
			ctx.fillStyle = "rgb" + colors[MAP[i][j]]
			ctx.fillRect(xpos, ypos, BWIDTH, BHEIGHT)

			//  console.log(xpos, ypos, BWIDTH, BHEIGHT)

		}
	}
}

type POS = {
	x: number;
	y: number;
}	

export class Game {

	public score: number
	public gameOver: boolean
	public gameOverCallback: (() => void) | null
	public touchcount: number

	private handleInit: boolean
	private lastPos: POS
	

	constructor() {
		this.score = 0
		this.touchcount = 0
		this.gameOver = false
		this.handleInit = false
		this.gameOverCallback = null
		this.lastPos = {"y": -1, "x": -1}
	}

	private newBlocks() {
		let i = 0
		let j = 0
		for (i = 0; i < MAPY; i++) {
			for (j = 0; j < MAPX; j++) {
				if (i == 0) {
					if (MAP[i][j] != 0) {
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
					MAP[i - 1][j] = MAP[i][j]
				}
	
				if (i == MAPY - 1) {
					MAP[i][j] = randInt(1, BLCOKCOLORMAX)
				}
			}
		}
	}

	// 이곳에서 그리기 및 블록처리를 해준다.
	private async gameProcLoop() {
		let createBlock = false
		while (!this.gameOver) {
			draw()
	
			await sleep(100)
			
			if (this.lastPos.x >= 0 && this.lastPos.y >= 0) {
				const count = this.deleteblock({
					"i": this.lastPos.y,
					"j": this.lastPos.x
				}, MAP[this.lastPos.y][this.lastPos.x], 1)
				this.touchcount += 1
				this.score += count*count //(count*count+count)/2 //점수 계산 식
				this.lastPos = {"y": -1, "x": -1}
				createBlock = true
			}
			
			for (let i = MAPY - 1; i > 0; i--) {
				for (let j = 0; j < MAPX; j++) {
					if (MAP[i][j] == 0 && MAP[i - 1][j] != 0) {
						MAP[i][j] = MAP[i - 1][j]
						MAP[i - 1][j] = 0
					}
				}
			}

			if (createBlock) {
				this.newBlocks()
				createBlock = false
			}
			
		}
	}

	private deleteblock(pos: any, blockCode: any, depth: number): number {
		
		let count = 1
		const nextpos = {
			"i": 0,
			"j": 0
		}
	
		MAP[pos.i][pos.j] = 0
	
		// console.log("delete block", pos.i, pos.j, blockCode)
		// console.log(MAP)
	
		//up
		if (pos.i != 0 && MAP[pos.i - 1][pos.j] == blockCode) {
			nextpos.i = pos.i - 1
			nextpos.j = pos.j
			count += this.deleteblock(nextpos, blockCode, depth + 1)
		}
		//right
		if (pos.j != MAPX - 1 && MAP[pos.i][pos.j + 1] == blockCode) {
			nextpos.i = pos.i
			nextpos.j = pos.j + 1
			count += this.deleteblock(nextpos, blockCode, depth + 1)
		}
		//down
		if (pos.i != MAPY - 1 && MAP[pos.i + 1][pos.j] == blockCode) {
			nextpos.i = pos.i + 1
			nextpos.j = pos.j
			count += this.deleteblock(nextpos, blockCode, depth + 1)
		}
		//left
		if (pos.j != 0 && MAP[pos.i][pos.j - 1] == blockCode) {
			nextpos.i = pos.i
			nextpos.j = pos.j - 1
			count += this.deleteblock(nextpos, blockCode, depth + 1)
		}
		
		return count
	}

	private proc = (e: any) => { //mouse event
	
		if (cvs == null) {
			return
		}
	
		const pos = getMousePos(cvs, e)
	
		const xpos = pos.x
		const ypos = pos.y
	
		const j = Math.floor(xpos / (BWIDTH + OUTLINE_PIXEL))
		const i = Math.floor(ypos / (BHEIGHT + OUTLINE_PIXEL))
	
		if (i >= MAPY || j >= MAPX) {
			// console.log("big!", i, j)
			return
		}
	
		if (MAP[i][j] == 0) {
			// 빈 타일
			return
		} else {

			this.lastPos = {"y": i, "x": j};

			// const count = this.deleteblock({
				// "i": i,
				// "j": j
			// }, MAP[i][j], 1)
			
			// this.touchcount += 1
			// this.score += count*count //(count*count+count)/2 //점수 계산 식
			
			// draw()
			// this.gameProcLoop()
		}
	
		// this.newBlocks()
		// draw()
	}

	private initMAP(): void { //init game

		cvs = document.getElementById('cvs');
	
		if (cvs == null) {
			return
		}
	
		for (let i = 0; i < MAPY; i++) {
			if (typeof (MAP[i]) == "undefined")
				MAP[i] = {}
	
			for (let j = 0; j < MAPX; j++) {
				MAP[i][j] = 0
			}
		}
	
		if (this.handleInit == false) {
			ctx = cvs.getContext('2d')
			
			if (cvs == null) {
				return
			}
			
			cvs.addEventListener("click", this.proc);
	
			ctx.globalAlpha = 0.2
			ctx.fillStyle = 'rgb(0, 171, 255)'
			ctx.fillRect(0, 0, MAPPXWIDTH, MAPPXHEIGHT)
			ctx.globalAlpha = 1

			this.handleInit = true
		}
	
		// console.log(MAP)
		this.newBlocks()
	}

	public startGame() {
		this.initMAP()
		this.score = 0
		this.touchcount = 0
		this.gameOver = false

		this.gameProcLoop() 
		// draw()
	}
	
}

// $(document).ready(function () {
// 	console.log("MAP INIT")
//  initMAP();
// 	draw();
// })
