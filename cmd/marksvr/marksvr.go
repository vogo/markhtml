package main

import (
	"encoding/base64"
	"fmt"

	"github.com/valyala/fasthttp"
)

var (
	markhtmlJSBytes  = []byte(Files["markhtml.min.js"])
	markhtmlCSSBytes = []byte(Files["markhtml.css"])
	indexhtmlBytes   = []byte(Files["index.min.html"])
	oneDaySeconds    = 24 * 60 * 60
	maxAge           = fmt.Sprintf("max-age=%d, public", oneDaySeconds)
	icoFileBytes     []byte
)

func init() {
	var err error
	icoFileBytes, err = base64.StdEncoding.DecodeString(IcoFile)
	if err != nil {
		panic(err)
	}
}

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
	fasthttp.ListenAndServe(":80", fastHTTPHandler)
}
