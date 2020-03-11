package requesthandle

import (
	"github.com/bedrock17/router"
	"net/http"
	// "github.com/bedrock17/s0afweb/common"
	// "github.com/bedrock17/s0afweb/model"
	"fmt"
)

func vueURIHandelGenerator(file string) router.HandlerFunc {
	return func(c *router.Context) {

		dir := http.Dir(".")
		f, err := dir.Open(file)
		if err != nil {
			fmt.Println(err)
			panic(err)
		}

		defer f.Close()

		fi, err := f.Stat()
		if err != nil || fi.IsDir() {
			panic(err)
		}

		http.ServeContent(c.ResponseWriter, c.Request, file, fi.ModTime(), f)
	}
}