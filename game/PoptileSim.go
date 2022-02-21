package game

type PoptileGame struct {
	Score      uint64
	Touchcount uint64

	width   int
	height  int
	mapSize [][]int
}

func (self *PoptileGame) MakeBlocks(line string) {
	for i := 0; i < self.width; i++ {
		for j := 0; j < self.height; j++ {
			switch line[j] {
			}
		}
	}
}

func (self *PoptileGame) InitMap(width, height uint) {
	self.mapSize = make([][]uint8, height)
	for i := 0; i < height; i++ {
		self.mapSize[i] = make([]uint8, width)
	}
}
