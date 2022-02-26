package model

// PopTileRank : POPTILE 랭킹을 저장한다.

type Pos struct {
	X int
	Y int
}

func (self *Pos) IsValidRange(width, height int) bool {
	if 0 <= self.Y && self.Y < height {
		if 0 <= self.X && self.X < width {
			return true
		}
	}
	return false
}

func (self Pos) Add(p Pos) Pos {
	self.X += p.X
	self.Y += p.Y
	return self
}

type PopTileRank struct {
	UserName     string   `json:"UserName"`
	Score        int      `json:"Score"`
	TouchCount   int      `json:"TouchCount"`
	Check        string   `json:"Check"`
	LineHistory  []string `json:LineHistory`
	TouchHistory []Pos    `json:TouchHistory`
}
