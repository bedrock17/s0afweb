package game

import (
	"fmt"
	"strconv"

	"github.com/bedrock17/s0afweb/models"
)

type PoptileGame struct {
	score      int
	touchcount int

	width   int
	height  int
	gameMap [][]int

	gameHistroty [][]int
	touchHistory []models.Point
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
	for i := 0; i < self.height; i++ {
		for j := 0; j < self.width; j++ {
			if i != 0 {
				self.gameMap[i-1][j] = self.gameMap[i][j]
			}
			if i == self.height-1 {
				self.gameMap[i][j] = line[j]
			}
		}
	}
}

func (self *PoptileGame) InitMap(width, height int) {
	self.gameMap = make([][]int, height)
	for i := 0; i < height; i++ {
		self.gameMap[i] = make([]int, width)
	}
}

func (self *PoptileGame) SetGameParameter(width, height int, GameHistroty [][]int, touchHistory []model.Pos) {
	self.width = width
	self.height = height

	self.gameHistroty = GameHistroty
	self.touchHistory = touchHistory
}

var direction4 []model.Pos = []model.Pos{
	{X: 0, Y: 1},
	{X: 1, Y: 0},
	{X: -1, Y: 0},
	{X: 0, Y: -1},
}

func (self *PoptileGame) removeBlocks(p model.Pos, blockCode int) int {
	queue := make(chan model.Pos, 120)
	queue <- p
	self.gameMap[p.Y][p.X] = 0
	count := 0
	for len(queue) > 0 {
		p := <-queue
		// for debug, 유저 플레이랑 시뮬레이션 오차있을떄 확인할것
		// fmt.Println(len(queue), self.score, p)
		count += 1

		for _, v := range direction4 {
			np := p.Add(v)
			if np.IsValidRange(self.width, self.height) {
				if self.gameMap[np.Y][np.X] == blockCode {
					self.gameMap[np.Y][np.X] = 0
					queue <- np
				}
			}
		}
	}

	return count
}

func (self *PoptileGame) dropBlicks() {
	isContinue := true
	for isContinue {
		isContinue = false
		for i := self.height - 1; i > 0; i-- {
			for j := 0; j < self.width; j++ {
				if self.gameMap[i][j] == 0 && self.gameMap[i-1][j] != 0 {
					self.gameMap[i][j] = self.gameMap[i-1][j]
					self.gameMap[i-1][j] = 0

					isContinue = true
				}
			}
		}
	}
}

func (self *PoptileGame) SimulationGame() int {

	if len(self.gameHistroty) != len(self.touchHistory) {
		fmt.Errorf("line and touch count are not same!")
	}

	for i := 0; i < len(self.gameHistroty); i++ {
		self.makeBlocks(self.gameHistroty[i])
		pos := self.touchHistory[i]
		count := self.removeBlocks(pos, self.gameMap[pos.Y][pos.X])

		self.score += (count * count)

		self.dropBlicks()
	}

	return self.score
}

func GameValidChceck(data *model.PopTileRank) bool {

	valid := false
	score := 0
	lines := make([][]int, len(data.LineHistory))
	for i := 0; i < len(lines); i++ {
		lines[i] = make([]int, len(data.LineHistory[i]))

		for j := 0; j < len(data.LineHistory[i]); j++ {
			v, err := strconv.Atoi(string(data.LineHistory[i][j]))
			if err != nil {
				fmt.Println("Error!", err)
				return false
			}
			lines[i][j] = v
		}
	}

	game := PoptileGame{}

	game.InitMap(8, 15)
	game.SetGameParameter(8, 15, lines, data.TouchHistory)

	score = game.SimulationGame()
	fmt.Println("Game Result", data.Score, score)
	if score == data.Score {
		valid = true
	}

	return valid
}
