package utils

import (
	"time"
)

type GameTicker struct {
	ticker              *time.Ticker
	TickerDuration      time.Duration
	TickerDeadlineMilli int64
	OnFinishCallback    func()
}

func (gt GameTicker) Start() {
	if gt.ticker == nil {
		gt.ticker = time.NewTicker(gt.TickerDuration)
	} else {
		gt.ticker.Reset(gt.TickerDuration)
	}

	go func() {
		for range gt.ticker.C {
			if time.Now().UnixMilli() >= gt.TickerDeadlineMilli {
				gt.ticker.Stop()
				if gt.OnFinishCallback != nil {
					gt.OnFinishCallback()
				}
				return
			}
		}
	}()
}

func (gt GameTicker) ForceQuit() {
	if gt.ticker == nil {
		return
	}
	gt.ticker.Stop()
	if gt.OnFinishCallback != nil {
		gt.OnFinishCallback()
	}
}
