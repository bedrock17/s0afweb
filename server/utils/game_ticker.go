package utils

import (
	"time"
)

type GameTicker struct {
	Ticker              *time.Ticker
	TickerDeadlineMilli int64
	OnFinishCallback    func()
	OnHeartBeatCallback func()
}

func (gt GameTicker) Start() {
	go func() {
		lastHeartBeatCheckTime := time.Now().UnixMilli()
		for range gt.Ticker.C {
			nowMilli := time.Now().UnixMilli()
			if nowMilli-lastHeartBeatCheckTime > 10000 {
				gt.OnHeartBeatCallback()
				lastHeartBeatCheckTime = nowMilli
			}

			if nowMilli >= gt.TickerDeadlineMilli {
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
