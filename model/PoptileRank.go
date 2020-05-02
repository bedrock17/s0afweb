package model

// PopTileRank : POPTILE 랭킹을 저장한다.
type PopTileRank struct {
	UserName   string `json:"UserName"`
	Score      int    `json:"Score"`
	TouchCount int    `json:"TouchCount"`
	Check      string `json:"Check"`
}
