package game

import (
	"encoding/json"
	"github.com/bedrock17/s0afweb/models"
)

const (
	DefaultMapWidth  int = 8
	DefaultMapHeight int = 15
)

type XORShift struct {
	seed  int32
	state int32
}

func (x *XORShift) Next() int32 {
	x.state ^= x.state << 13
	x.state ^= x.state >> 17
	x.state ^= x.state << 5

	if x.state < 0 {
		x.state += 2147483647
	}

	return x.state
}

type PopTileGame struct {
	Score      int
	touchCount int

	columns int
	rows    int
	gameMap [][]int
	random  XORShift

	RandomSeed int32
}

func isValidRange(p models.Point, maxColumns, maxRows int) bool {
	if 0 <= p.X && p.X < maxColumns {
		if 0 <= p.Y && p.Y < maxRows {
			return true
		}
	}
	return false
}

func (g *PopTileGame) IsGameEnd() bool {
	for i := 0; i < g.columns; i++ {
		if i == 0 {
			if g.gameMap[0][i] != 0 {
				return true
			}
		}
	}
	return false
}

func (g *PopTileGame) MakeBlocks(line []int) {
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

func (g *PopTileGame) InitMap(width, height int) {
	g.gameMap = make([][]int, height)
	for i := 0; i < height; i++ {
		g.gameMap[i] = make([]int, width)
	}
}

func (g *PopTileGame) SetGameParameter(width, height int, seed int32) {
	g.columns = width
	g.rows = height
	g.RandomSeed = seed
	g.random = XORShift{g.RandomSeed, g.RandomSeed}
}

var direction4 = []models.Point{
	{X: 0, Y: 1},
	{X: 1, Y: 0},
	{X: -1, Y: 0},
	{X: 0, Y: -1},
}

func (g *PopTileGame) removeBlocks(p models.Point, blockCode int) int {
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

func (g *PopTileGame) dropBlocks() {
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

func (g *PopTileGame) SimulateOneStep(p models.Point) int {
	var line []int = make([]int, g.columns)
	for j := 0; j < g.columns; j++ {
		v := g.random.Next()
		line[j] = int((v % 3) + 1)
	}
	g.MakeBlocks(line)
	count := g.removeBlocks(p, g.gameMap[p.Y][p.X])
	g.Score += count * count
	g.dropBlocks()

	return count
}

func Validate(data *models.Leaderboard) bool {
	valid := false

	game := PopTileGame{}

	game.InitMap(DefaultMapWidth, DefaultMapHeight)

	var touchHistory []models.Point
	err := json.Unmarshal([]byte(data.TouchHistory), &touchHistory)
	if err != nil {
		panic(err)
	}

	game.SetGameParameter(DefaultMapWidth, DefaultMapHeight, data.Seed)

	for i := 0; i < len(touchHistory); i++ {
		game.SimulateOneStep(touchHistory[i])
	}

	if game.Score == data.Score {
		valid = true
	}

	return valid
}

func (g *PopTileGame) Initialize(width int, height int, seed int32) {
	g.InitMap(width, height)
	g.SetGameParameter(width, height, seed)
}

func (g *PopTileGame) WalkOneStep(x int, y int) {
	p := models.Point{X: x, Y: y}
	g.SimulateOneStep(p)
}
