package main

import (
	"fmt"

	"github.com/valyala/fasthttp"
)

var (
	oneDaySeconds = 24 * 60 * 60
	maxAge        = fmt.Sprintf("max-age=%d, public", oneDaySeconds)
)

func fastHTTPHandler(ctx *fasthttp.RequestCtx) {
	ctx.SetStatusCode(fasthttp.StatusOK)
	ctx.Response.Header.Set("Cache-Control", maxAge)
	path := string(ctx.Path())
	if path == "/markhtml.js" {
		ctx.SetContentType("application/javascript")
		ctx.SetBody(markhtmlJSBytes)
		return
	}
	if path == "/markhtml.css" {
		ctx.SetContentType("text/style")
		ctx.SetBody(markhtmlCSSBytes)
		return
	}
	if path == "/favicon.ico" {
		ctx.SetContentType("image/x-icon")
		ctx.SetBody(icoFileBytes)
		return
	}
	ctx.SetContentType("text/html")
	ctx.SetBody(indexhtmlBytes)
}

func main() {
	fmt.Printf("start markhtml")
	_ = fasthttp.ListenAndServe(":80", fastHTTPHandler)
}
