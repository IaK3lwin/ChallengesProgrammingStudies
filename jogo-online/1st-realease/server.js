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

game.subscribe((command) => {
  console.log('> emmiting signal to client with type: ', command.type)
  socket.emit(command.type, command)
})

game.start()

game.movePlayer({ playerId: 'player1', keyPressed: 'ArrowDown' })

app.use(express.static("public"))

//conected signal
socket.on("connection", (socket) => {
  console.log("connected with player:", socket.id)
  game.addPlayer({playerId : socket.id})
  socket.emit('setup', (game.state))
  
  //desconnect signal
  socket.on('disconnect', () => {
    game.removePlayer({playerId : socket.id})
    console.log('> disconnected player with id: ', socket.id)
  })

  socket.on('move-player', (command) => {
    command.playerId = socket.id
    command.type = 'move-player'
    
    game.movePlayer(command)
    console.log(game.state)
  })

});



server.listen(3000, () => {
  console.log(game.state)
  console.log("Server listening with port 3000")
});
