export default function createKeydownListenner() {

    const state = {
        observers : [],
        playerId : ''
    }

    function subscribe(observerFunc) {
        /*
            essa função faz a inscrição para o subject keyboardListenner
        */
        state.observers.push(observerFunc)
    }

    /*
    * @description essa função faz a inscrição para o subject keyboardListenner
    */
    function notifyAll(command) {
        // console.log(`Notify ${state.observers.length} observers `)
        for (const observerFunc of state.observers) {
            observerFunc(command)
        }
    }

    //seta o playerId
    function setPlayerId(playerId) {
        state.playerId = playerId
    }

    document.addEventListener('keydown', handleKeydown)

    function handleKeydown(event) {
        
        const command = {
            playerId : state.playerId,
            keyPressed :  event.key
        }

        notifyAll({
            type : 'move-player',
            playerId : state.playerId,
            keyPressed : event.key
        })
    }

    return {
        subscribe,
        setPlayerId
    }

}