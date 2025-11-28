export default function createGame() {
    
    const state = {
        players : { },
        fruits : {},
        canvas : {
            width : 10,
            height : 10
        }
    }

    //add player
    function addPlayer(command) {
        state.players[command.playerId] = {
            x : command.playerX,
            y : command.playerY
        }

    }
    // remove player
    function removePlayer(command) {
        delete state.players[command.playerId]
    }

    //add fruit
    function addFruit(command) {
        state.fruits[command.fruitId] = {
            x : command.fruitX,
            y : command.fruitY
        }
    }
    //remove fruit
    function removeFruit(command) {
        delete state.fruits[command.fruitId]
    }

    function movePlayer(command) {
        // console.log(`moving  ${command.playerId} with ${command.keyPressed}`)
        const player = state.players[command.playerId]


        const acceptMove = {
            ArrowUp(player) {
                // console.log(`movePlayer.acceptMove -> Moving player to Up`)
                if ( player.y > 0) {
                    player.y -= 1
                }
            },
            ArrowDown(player) {
                // console.log(`movePlayer.acceptMove -> Moving player to Down`)
                if ( player.y + 1 < state.canvas.height ) {
                    player.y += 1
                }
            },
            ArrowLeft(player) {
                // console.log(`movePlayer.acceptMove -> Moving player to Left`)
                if (player.x - 1 >= 0) {
                    player.x -= 1
                }
            }, 
            ArrowRight(player) {
                // console.log(`movePlayer.acceptMove -> Moving player to Right`)
                if (player.x + 1 < state.canvas.width) {
                    player.x += 1
                }
            }
        }

        const keyPressed = command.keyPressed
        const moveFunction = acceptMove[keyPressed]

        if (player && moveFunction) {
            moveFunction(player)
            checkCollision(player)
        }
        
    }

    function checkCollision(player) {
        for (const fruitCurrentId in state.fruits) {
            const fruitCurrent = state.fruits[fruitCurrentId]

            if (fruitCurrent.x === player.x && fruitCurrent.y === player.y) {
                removeFruit({fruitId : fruitCurrentId})
            }
        }
    }
    
    return {
        movePlayer,
        state,
        addPlayer,
        removePlayer,
        addFruit,
        removeFruit
    }
    
}