FROM golang:1.24-alpine

WORKDIR /devtasks/backend

COPY go.mod go.sum ./
RUN go mod download

COPY . .
RUN go build -v -o bin/devtasks cmd/server/main.go

EXPOSE 3000

CMD [ "bin/devtasks" ]