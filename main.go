package main

import (
	"fmt"

	"github.com/bedrock17/s0afweb/common"
	"github.com/bedrock17/s0afweb/requesthandle"
)

func main() {

	fmt.Println("my server start")

	common.GlobalConfig.Load()

	var httpConfig requesthandle.HTTPServerConfifg

	httpConfig.HTTPSPort = common.GlobalConfig.ServicePort
	httpConfig.HTTPPort = 80
	httpConfig.HostName = common.GlobalConfig.HostName

	// common.GlobalConfig.ServicePort
	requesthandle.Run(httpConfig)

}
