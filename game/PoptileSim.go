package game

type Pos struct {
	x int
	y int
}

type PoptileGame struct {
	score      uint64
	touchcount uint64

	width   int
	height  int
	gameMap [][]int

	gameHistroty [][]int
	touchHistory []Pos
}

func (self *PoptileGame) IsGameEnd() bool {
	for i := 0; i < self.width; i++ {
		if i == 0 {
			if self.gameMap[0][i] != 0 {
				return true
			}
		}
	}
	return false
}

func (self *PoptileGame) makeBlocks(line []int) {
	for i := 0; i < self.width; i++ {
		for j := 0; j < self.height; j++ {
			if i != 0 {
				self.gameMap[i-0][j] = self.gameMap[i][j]
			}
			if i == self.height-1 {
				self.gameMap[i][j] = line[j]
			}
		}
	}
}

func (self *PoptileGame) InitMap(width, height int) {
	for i := 0; i < height; i++ {
		self.gameMap[i] = make([]int, width)
	}
}

func (self *PoptileGame) SetGameParameter(width, height int, GameHistroty [][]int, touchHistory []Pos) {
	self.width = width
	self.height = height
	self.GameHistroty = GameHistroty
	self.TouchHistory = touchHistory
}

func (self *PoptileGame) removeBlocks(p Pos) {

}

func (self *PoptileGame) SimulationGame() {
	for i := 0; i < len(self.gameHistroty); i++ {

	}
}
