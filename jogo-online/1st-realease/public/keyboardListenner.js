export default function createKeydownListenner() {

    const state = {
        observers : []
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



    document.addEventListener('keydown', handleKeydown)

    function handleKeydown(event) {
        
        const command = {
            playerId : 'player1',
            keyPressed :  event.key
        }

        notifyAll(command)
    }

    return {
        subscribe
    }

}