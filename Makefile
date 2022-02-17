# npm install -g js-beautify
# npm install -g uglify-js
# npm install -g html-minifier-cli

#------------------------------------

marksvr_min:
	uglifyjs  marktool.js markurl.js marktitle.js markmenu.js markhighlight.js markgittalk.js markload.js -c -m -o  cmd/marksvr/markhtml.min.js

markrender_min:
	uglifyjs  marktool.js marktitle.js markmenu.js markmath.js markmind.js markhighlight.js markgittalk.js loadscript.js -c -m -o  dist/markrender.min.js

build:
	go build  -ldflags '-s -w' -o dist/marksvr cmd/marksvr/*.go
	go build  -ldflags '-s -w' -o dist/markhtml cmd/markhtml/*.go

build_linux:
	GOOS=linux go build  -ldflags '-s -w' -o dist/marksvr cmd/marksvr/*.go
	GOOS=linux go build  -ldflags '-s -w' -o dist/markhtml cmd/markhtml/*.go

install:
	go install cmd/markhtml/*.go
