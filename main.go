package main

import (
	"fmt"

	"github.com/bedrock17/s0afWeb/common"
	"github.com/bedrock17/s0afWeb/requesthandle"
)

func main() {

	fmt.Println("my server start")

	common.GlobalConfig.Load()

	requesthandle.Run(common.GlobalConfig.ServicePort)

}
