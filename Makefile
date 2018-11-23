
static:
	go run makestatic.go

run: static
	go run main.go html.go

build: static
	GOOS=linux go build -o markhtml main.go html.go


