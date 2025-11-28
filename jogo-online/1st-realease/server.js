import express from "express"
import http from "http"
import { Server } from "socket.io"
import createGame from "./public/game.js"

const app = express()
const server = http.createServer(app)
const socket = new Server(server, {
  cors: { origin: "*" }
})

const game = createGame();

game.addFruit({ fruitId: 'fruit1', fruitX: 3, fruitY: 2 })
game.addFruit({ fruitId: 'fruit2', fruitX: 2, fruitY: 7 })

game.movePlayer({ playerId: 'player1', keyPressed: 'ArrowDown' })

app.use(express.static("public"))

socket.on("connection", (socket) => {
  console.log("connected with player:", socket.id)
  socket.emit('setup', (game.state))
});



server.listen(3000, () => {
  console.log(game.state);
  console.log("Server listening with port 3000")
});
