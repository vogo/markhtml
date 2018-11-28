package main

import (
	"flag"
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
)

var (
	port            = flag.String("port", "80", "port")
	markhtmljsBytes = []byte(Files["markhtml.min.js"])
	indexhtmlBytes  = []byte(Files["index.min.html"])
)

func main() {
	flag.Parse()
	fmt.Printf("start server on port %s", *port)

	gin.SetMode(gin.ReleaseMode)
	r := gin.New()

	r.GET("/*.html", func(c *gin.Context) {
		if c.Request.URL.Path == "/markhtml.js" {
			c.Data(http.StatusOK, "application/javascript", markhtmljsBytes)
			return
		}
		c.Data(http.StatusOK, "text/html", indexhtmlBytes)
	})

	r.Run(fmt.Sprintf(":%s", *port))

}
