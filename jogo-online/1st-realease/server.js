import express from "express"
import http from "http"
import { Server } from "socket.io"
import createGame from "./public/game.js"

const app = express()
const server = http.createServer(app)
const socket = new Server(server, {
  cors: { origin: "*" }
})

const game = createGame(true);

game.subscribe((command) => {
  console.log('> emmiting signal to client with type: ', command.type)
  socket.emit(command.type, command)
})

game.start(2000)

app.use(express.static("public"))

//conected signal
socket.on("connection", (socket) => {
  // console.log("connected with player:", socket.id)
  game.addPlayer({playerId : socket.id})
  socket.emit('setup', (game.state))
  
  
  //moveplayer
  socket.on('move-player', (command) => {
    let moves = 0 // temp
    command.playerId = socket.id // garante que o id é realmente o correti
    command.type = 'move-player' // garante que o tipo de evento seja memso o movimentar
    
    game.movePlayer(command) // move de forma abstrata
    moves++ // temp
    console.log(`moves: ${moves} > state: `, game.state) // temp
  })
  

  //desconnect signal
  socket.on('disconnect', () => {
    game.removePlayer({playerId : socket.id})
    console.log('> disconnected player with id: ', socket.id)
  })

});

server.listen(3000, () => {
  console.log(game.state)
  console.log("Server listening with port 3000")
});
