# npm -g install js-beautify
# npm install -g uglify-js
#
markhtml.min.js: markhtml.js
	uglifyjs markhtml.js > markdown.min.js

static: index.html markhtml.js
	go run makestatic.go

run: static
	go run main.go static.go

build: static
	GOOS=linux go build -o markhtml main.go static.go


