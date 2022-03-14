package utils

import (
	"fmt"
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
			fmt.Println("Tick")
			if time.Now().UnixMilli() >= gt.TickerDeadlineMilli {
				fmt.Println("Done")
				gt.Ticker.Stop()
				if gt.OnFinishCallback != nil {
					gt.OnFinishCallback()
				}
				return
			}
		}
	}()
}
