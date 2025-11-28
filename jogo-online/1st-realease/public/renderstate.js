/**
 * 
 * @param {*} contextScreen 
 * @param {*} game 
 * @param {*} clientPlayer 
 */
export default function renderstate(contextScreen, game, clientPlayerId) {
    //clear screen
    contextScreen.clearRect(0,0, 10, 10) // mais performatico que apenas redesenhar um react ta tela inteira

    for (const playerId in game.state.players) {
    
        let currentPlayer = game.state.players[playerId]
        
        if (playerId == clientPlayerId) {
            contextScreen.fillStyle = "blue"    
        } else {
            contextScreen.fillStyle = "black"
        }
        
        contextScreen.fillRect(currentPlayer.x, currentPlayer.y, 1, 1)
    }

    for (const fruitId in game.state.fruits) {
        let currentFruit = game.state.fruits[fruitId]
        contextScreen.fillStyle = "green"
        contextScreen.fillRect(currentFruit.x, currentFruit.y, 1,1)
        
    }

    
    requestAnimationFrame(() => {
        renderstate(contextScreen, game, clientPlayerId)
    }) // chama o método, fazendo com que atualize a tela a todo frame
}