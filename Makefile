# npm install -g js-beautify
# npm install -g uglify-js
# npm install -g html-minifier-cli
#

# ----------------------------------
src: index.html markhtml.js
	cp index.html index.min.html
	cp markhtml.js markhtml.min.js

src-static: src
	go run makestatic.go

run: src-static
	go run main.go static.go

#------------------------------------
min: index.html markhtml.js
	uglifyjs  markhtml.js -c -m -o  markhtml.min.js
	htmlmin -o index.min.html index.html	

static: min 
	go run makestatic.go

build: static
	GOOS=linux go build -o markhtml main.go static.go


