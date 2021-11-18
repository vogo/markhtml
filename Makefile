# npm install -g js-beautify
# npm install -g uglify-js
# npm install -g html-minifier-cli

#------------------------------------


static-bin:
	go build -o dist/makestatic cmd/static/*.go

marksvr_min: index.html
	uglifyjs  marktool.js markurl.js marktitle.js markmenu.js markhighlight.js markgittalk.js markload.js -c -m -o  markhtml.min.js
	htmlmin -o index.min.html index.html

marksvr_static: static-bin marksvr_min
	./dist/makestatic ./cmd/marksvr/static.go true index.min.html markhtml.min.js markhtml.css

markrender_min:
	uglifyjs  marktool.js marktitle.js markmenu.js markmath.js markmind.js markhighlight.js markgittalk.js loadscript.js -c -m -o  markrender.min.js

markhtml_static: static-bin markrender_min
	./dist/makestatic ./cmd/markhtml/static.go false index-template-prefix.html index-template-suffix.html markhtml.css

build: marksvr_static markhtml_static
	go build  -ldflags '-s -w' -o dist/marksvr cmd/marksvr/*.go
	go build  -ldflags '-s -w' -o dist/markhtml cmd/markhtml/*.go

build_linux: marksvr_static markhtml_static
	GOOS=linux go build  -ldflags '-s -w' -o dist/marksvr cmd/marksvr/*.go
	GOOS=linux go build  -ldflags '-s -w' -o dist/markhtml cmd/markhtml/*.go

install: markhtml_static
	go install cmd/markhtml/*.go
