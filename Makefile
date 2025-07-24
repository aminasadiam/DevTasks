BINDIR=bin
MAIN=cmd/server/main.go
APPNAME=devtasks

GOBUILD=go build
GOTEST=go test
GOCLEAN=go clean

.PHONY: all

all: test build run clean

build:
	@$(GOBUILD) -o $(BINDIR)/$(APPNAME) $(MAIN)

run:
	@$(BINDIR)/$(APPNAME)

test:
	@$(GOTEST) -v ./...

clean:
	@$(GOCLEAN)
	@if exist $(BINDIR) rmdir /s /q $(BINDIR)