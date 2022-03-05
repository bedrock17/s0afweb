package game

import (
	"encoding/json"
	"fmt"
	"github.com/bedrock17/s0afweb/models"
	"github.com/taylorza/go-lfsr"
)

type popTileGame struct {
	score      int
	touchCount int

	columns int
	rows    int
	gameMap [][]int

	LFSRSeed uint64

	touchHistory []models.Point
}

func isValidRange(p models.Point, maxColumns, maxRows int) bool {
	if 0 <= p.X && p.X < maxColumns {
		if 0 <= p.Y && p.Y < maxRows {
			return true
		}
	}
	return false
}

func (g *popTileGame) IsGameEnd() bool {
	for i := 0; i < g.columns; i++ {
		if i == 0 {
			if g.gameMap[0][i] != 0 {
				return true
			}
		}
	}
	return false
}

func (g *popTileGame) makeBlocks(line []int) {
	for i := 0; i < g.rows; i++ {
		for j := 0; j < g.columns; j++ {
			if i != 0 {
				g.gameMap[i-1][j] = g.gameMap[i][j]
			}
			if i == g.rows-1 {
				g.gameMap[i][j] = line[j]
			}
		}
	}
}

func (g *popTileGame) InitMap(width, height int) {
	g.gameMap = make([][]int, height)
	for i := 0; i < height; i++ {
		g.gameMap[i] = make([]int, width)
	}
}

func (g *popTileGame) SetGameParameter(width, height int, seed uint64, touchHistory []models.Point) {
	g.columns = width
	g.rows = height

	g.LFSRSeed = seed
	g.touchHistory = touchHistory
}

var direction4 []models.Point = []models.Point{
	{X: 0, Y: 1},
	{X: 1, Y: 0},
	{X: -1, Y: 0},
	{X: 0, Y: -1},
}

func (g *popTileGame) removeBlocks(p models.Point, blockCode int) int {
	queue := make(chan models.Point, 120)
	queue <- p
	g.gameMap[p.Y][p.X] = 0
	count := 0
	for len(queue) > 0 {
		p := <-queue
		// for debug, 유저 플레이랑 시뮬레이션 오차있을떄 확인할것
		// fmt.Println(len(queue), g.score, p)
		count += 1

		for _, v := range direction4 {
			np := models.Point{X: p.X + v.X, Y: p.Y + v.Y}
			if isValidRange(np, g.columns, g.rows) {
				if g.gameMap[np.Y][np.X] == blockCode {
					g.gameMap[np.Y][np.X] = 0
					queue <- np
				}
			}
		}
	}

	return count
}

func (g *popTileGame) dropBlicks() {
	isContinue := true
	for isContinue {
		isContinue = false
		for i := g.rows - 1; i > 0; i-- {
			for j := 0; j < g.columns; j++ {
				if g.gameMap[i][j] == 0 && g.gameMap[i-1][j] != 0 {
					g.gameMap[i][j] = g.gameMap[i-1][j]
					g.gameMap[i-1][j] = 0

					isContinue = true
				}
			}
		}
	}
}

func (g *popTileGame) SimulationGame() int {

	l := lfsr.NewLfsr64(g.LFSRSeed)

	for i := 0; i < len(g.touchHistory); i++ {
		var line []int = make([]int, g.columns)
		for j := 0; j < g.columns; j++ {
			v, _ := l.Next()
			if v%4 == 3 {
				v, _ = l.Next()
			}
			line[j] = int((v % 3) + 1)
		}
		g.makeBlocks(line)
		pos := g.touchHistory[i]
		count := g.removeBlocks(pos, g.gameMap[pos.Y][pos.X])
		g.score += count * count
		g.dropBlicks()
	}

	return g.score
}

func GameValidChceck(data *models.Leaderboard) bool {

	valid := false
	score := 0

	game := popTileGame{}

	game.InitMap(8, 15)

	var touchHistory []models.Point
	err := json.Unmarshal([]byte(data.TouchHistory), &touchHistory)
	if err != nil {
		panic(err)
	}

	game.SetGameParameter(8, 15, data.Seed, touchHistory)

	score = game.SimulationGame()
	fmt.Println("Game Result", data.Score, score)
	if score == data.Score {
		valid = true
	}

	return valid
}
