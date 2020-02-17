package model

// PopTileRank : POPTILE 랭킹을 저장한다.
type PopTileRank struct {
	UserName       string
	Score          int
	TouchCount     int
	CheckSumSha256 string
}
