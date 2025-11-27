import express from "express"
import http from "http"
import { Server } from "socket.io"
import createGame from "./public/game.js"
import cors from "cors"

const app = express()
const server = http.createServer(app)
const socket = new Server(server)

const game = createGame()

game.addFruit({fruitId : 'fruit1', fruitX : 3, fruitY : 2})
game.addFruit({fruitId : 'fruit2', fruitX : 2, fruitY : 7})
game.addPlayer({playerId : 'player1', playerX : 0, playerY : 0})

// movendo o player de forma abstrata
game.movePlayer({playerId : 'player1', keyPressed : 'ArrowDown'})

app.use(express.static("public"))
app.use(cors)

socket.on("connection", (socket) => {
    const playerId = socket.id
    console.log("player connected with id: ", playerId) 
})

app.listen(3000, () => {
    console.log(game.state)
    console.log("Server listening with port 3000")
})