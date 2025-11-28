export default function createGame() {
    
    const state = {
        players : { },
        fruits : {},
        canvas : {
            width : 10,
            height : 10
        }
    }

    /**
     * estamos iniciandos o observers fora do state, porque lembre-se que a camada de game é compartilhado entre o backend e o client. E não acho interessante export esses observers para o client quando atualizar=mos o estado do game com o server.
     */
    const observers = [] //lista de observer

    /**
     * 
     * @param {*function} observerFunction 
     * @description Subscribe observer to observer ->> subject
     */
    function subscribe(observerFunction) {
        observers.push(observerFunction)
    }

    /**
     * 
     * @param {*object} command => {
     *  type : {string}
     *  
     * }
     * 
     * @description notify all observers in subscribe in for subsjecct
     */
    function notifyAll(command) {
        for (const functionObserver of observers) {
            if (functionObserver) {
                functionObserver(command)
            }
        }
    }

    //set state
    function setState(newState) {
        Object.assign(state, newState) // mescla o state argumento com state original desssa instancia
        
    }

    //add player
    function addPlayer(command) {
        const playerX = 'playerX' in command ? command.playerX : Math.floor(Math.random() * state.canvas.width)
        const playerY = 'playery' in command ? command.playerY : Math.floor(Math.random() * state.canvas.height)

        console.log(playerX, playerY)

        state.players[command.playerId] = {
            x : playerX,
            y : playerY
        }

        //notify all observers that emit to client
        notifyAll({
            type : 'add-player',
            playerId : command.playerId,
            playerX : playerX,
            playerY : playerX
        })

    }
    // remove player
    function removePlayer(command) {
        delete state.players[command.playerId]

        notifyAll({
            type : 'remove-player',
            playerId : command.playerId
        })
    }

    //start ftuits

    function start(frequency) {
        if (!frequency) {
            frequency = 2000
        }

        setInterval(addFruit, frequency)

    }

    //add fruit
    function addFruit(command) {
        const fruitId = command ? command.fruitId : Math.floor(Math.random() * 10000)
        const fruitX = command ? command.fruitX : Math.floor(Math.random() * state.canvas.width)
        const fruitY = command ? command.fruitY : Math.ceil(Math.random() * state.canvas.height)
        
        state.fruits[fruitId] = {
            x : fruitX,
            y : fruitY
        }

        notifyAll({
            type : 'add-fruit', 
            fruitX,
            fruitY
        })
    }
    //remove fruit
    function removeFruit(command) {
        delete state.fruits[command.fruitId]
    }

    function movePlayer(command) {

        notifyAll(command) // manda para o observer que fica no servidor observando a camada de game e enviar para todos clients

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
        setState,
        addPlayer,
        removePlayer,
        addFruit,
        removeFruit,
        subscribe,
        start
    }
    
}