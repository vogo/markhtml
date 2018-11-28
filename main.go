package main

import (
	"fmt"

	"github.com/valyala/fasthttp"
)

var (
	markhtmljsBytes = []byte(Files["markhtml.min.js"])
	indexhtmlBytes  = []byte(Files["index.min.html"])
)

func fastHTTPHandler(ctx *fasthttp.RequestCtx) {
	ctx.SetStatusCode(fasthttp.StatusOK)
	if string(ctx.Path()) == "/markhtml.js" {
		ctx.SetContentType("application/javascript")
		ctx.SetBody(markhtmljsBytes)
		return
	}
	ctx.SetContentType("text/html")
	ctx.SetBody(indexhtmlBytes)
}

func main() {
	fmt.Printf("start markhtml")
	fasthttp.ListenAndServe(":80", fastHTTPHandler)
}
