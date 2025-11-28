export default function renderstate(contextScreen, state) {
    console.log("teste")
    //clear screen
    contextScreen.clearRect(0,0, 10, 10) // mais performatico que apenas redesenhar um react ta tela inteira


    for (const playerId in state.players) {
            let currentPlayer = state.players[playerId]
        contextScreen.fillStyle = "black"
        contextScreen.fillRect(currentPlayer.x, currentPlayer.y, 1, 1)
    }

    for (const fruitId in state.fruits) {
        let currentFruit = state.fruits[fruitId]
        contextScreen.fillStyle = "green"
        contextScreen.fillRect(currentFruit.x, currentFruit.y, 1,1)
        
    }

    requestAnimationFrame(() => {
        renderstate(contextScreen, state)
    }) // chama o método, fazendo com que atualize a tela a todo frame
}