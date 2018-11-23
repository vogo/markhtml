package main

import (
	"flag"
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
)

var (
	port = flag.String("port", "80", "port")
)

func main() {
	flag.Parse()
	fmt.Printf("start server on port %s", *port)

	gin.SetMode(gin.ReleaseMode)
	r := gin.New()

	r.GET("/*.html", gin.WrapH(http.HandlerFunc(func(w http.ResponseWriter, req *http.Request) {
		w.Header().Set("Content-Type", "text/html")
		w.Write([]byte(HTML))
	})))
	r.Run(fmt.Sprintf(":%s", *port))

}
