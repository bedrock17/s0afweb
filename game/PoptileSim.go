package game

type Pos struct {
	x int
	y int
}

type PoptileGame struct {
	Score      uint64
	Touchcount uint64

	width   int
	height  int
	mapSize [][]int

	GameHistroty []string
	BlockHisroty []Pos
}

func (self *PoptileGame) MakeBlocks(line string) {
	for i := 0; i < self.width; i++ {
		for j := 0; j < self.height; j++ {
			switch line[j] {
			}
		}
	}
}

func (self *PoptileGame) InitMap(width, height int) {
	self.mapSize = make([][]int, height)
	for i := 0; i < height; i++ {
		self.mapSize[i] = make([]int, width)
	}
}
