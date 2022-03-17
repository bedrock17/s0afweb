package utils

import (
	"time"
)

type GameTicker struct {
	Ticker              *time.Ticker
	TickerDeadlineMilli int64
	OnFinishCallback    func()
}

func (gt GameTicker) Start() {
	go func() {
		for range gt.Ticker.C {
			if time.Now().UnixMilli() >= gt.TickerDeadlineMilli {
				gt.Ticker.Stop()
				if gt.OnFinishCallback != nil {
					gt.OnFinishCallback()
				}
				return
			}
		}
	}()
}

func (gt GameTicker) ForceQuit() {
	gt.Ticker.Stop()
	if gt.OnFinishCallback != nil {
		gt.OnFinishCallback()
	}
}
