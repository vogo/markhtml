# npm install -g js-beautify
# npm install -g uglify-js
# npm install -g html-minifier-cli

#------------------------------------


markhtml_min:
	uglifyjs  js/markhtml.js -c -m -o  dist/markhtml.min.js

build:
	go build  -ldflags '-s -w' -o dist/markhtml cmd/markhtml/*.go

build_linux:
	GOOS=linux go build  -ldflags '-s -w' -o dist/markhtml cmd/markhtml/*.go

install:
	go install cmd/markhtml/*.go
