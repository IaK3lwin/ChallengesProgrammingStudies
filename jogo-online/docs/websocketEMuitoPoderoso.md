# Websocket na prática é MUITO poderoso!!! (Javascript + Nodejs + Socket.io)

## Navegação //---------

[Anterior](./meVejaProgramarUmBackendQueTrocaInformacoesEmTempoReal.md) | [Próximo](/README.md)

## Introdução

Bom, Chegamos ao último capítulo dessa interessante adaptação da playlist do Filipe Deschamps! Foi muito divertido aprender conceitos e participar dessa jornada, certo?
Bom, mais para o final desse capítulo conversarei sobre o “fim”.

### O que veremos hoje?

- Veremos o potencial do websocket;
- Finalizaremos as mecânicas centrais do jogo;
- Sincronizaremos o jogo no backend para todos os clients.

## Melhorando a camada de Jogo

Como vimos, ao se **conectar ao backend**, o backend manda o sinal de 'setup' — sinal que criamos para enviar o estado atual do jogo — mas ele não está bom o suficiente! Vamos melhor a camada de jogo adicionando uma função específica para setar um estado novo:

```js
//set state
function setState(newState) {
    Object.assign(state, newState) // mescla o state argumento com state original desssa instancia
    
}

...

return {
    ...,
    setState //tornando ela pública
}
```

Agora mudamos o client para usar essa função:

```html
...
    ...
    <script type="module">
        ...
        socket.on('setup', (state) => {
            console.log("> setup in the game completed")
            gameClient.setState(state)

        })

    </script>
    </body>
</html>

```

Agora temos um pequeno problema, ao se conectar com o servidor não estamos criando um player de fato, então a primeira coisa que iremos fazer é isso:

## melhorando o game.createPlayer()

Como pode ver, o comando `game.addPlayer({playerId : socket.id})` está um pouco diferente, fizemos algumas mudanças nele:

```js
//add player
function addPlayer(command) {
    const playerX = 'playerX' in command ? command.playerX : Math.floor(Math.random() * state.canvas.width)
    const playerY = 'playery' in command ? command.playerY : Math.floor(Math.random() * state.canvas.height)

    state.players[command.playerId] = {
        x : playerX,
        y : playerY
    }
}
```

Caso não adicionamos as propriedades de `playerX` e `playerY` calculamos a posição de forma aleatória e adicionamos ao estado do jogo.

## Adicionando o player ao jogo de forma abstrata no backend

```js
//conected signal
socket.on("connection", (socket) => {
  // console.log("connected with player:", socket.id)
  game.addPlayer({playerId : socket.id})
  socket.emit('setup', (game.state))
})
```

E com isso podemos adicionar o player ao ser conectar! Mas quando desconectamos não fazemos muita nada, então eu te pergunto: Como podemos atualizar todos clients que um player foi desconectado?

No estado atual, quando reiniciamos a página, aparece mais um jogador, mas o da sessão antiga ainda continua no estado do jogo no backend; Bom vamos adicionar a funcionalidade de remover o player ao se desconectar:

```js
//conected signal
socket.on("connection", (socket) => {
 ...
  //desconnect signal
  socket.on('disconnect', () => {
    game.removePlayer({playerId : socket.id})
    console.log('> disconnected player with id: ', socket.id)
  })

})
```

Agora quando reiniciamos a página o player antigo some e aparece o novo, mas um problema novo aparece! Quando duplicamos a aba e um novo player aparece ao voltarmos a primeira página continuamos com somente um player! Isso acontece porque a página aberta é alimentada com o `setup` que manda o estado atual do jogo, mas a outra página tem o client “antigo”, que seu `setup` não tinha o novo player adicionado, então surge uma pergunta: Como vamos dizer para os outros client que entrou ou saiu um player?

## Implementação utilizada

Bom, já sabemos como emitir uma informação para os clients, mas não existe em nenhum lugar de nosso código responsável por atualizar os outros clients quando um player se conectou ao jogo.

> "Uma das formas de sincronizar todos os clients conectados, e a gente manualmente ir adicionando emits para a gente mandar essas novas informações pro client. Então, por exemplo: — Quando um novo jogador se conecta a gente emite de forma manual para todos jogadores que isso aconteceu ou quando alguém se desconecta a gente, manualmente adiciona um novo emit para notificar todos os clientes... — Mas isso não me parece um esforço inteligente! Porque se a gente pensar um pouquinho mais o que a gente quer, na verdade é: A cada coisa que acontece na camada do jogo, a gente gostaria de ser avisado, de forma passiva, por exemplo: eu gostaria de ser avisado todo vez que um jogador for adicionado dentro do jogo, mas um detalhe importante, NÃO ME INTERESSA, dentro do sistema aonde que o método addPlayer foi utilizado, mas apartir do momento que ele for utilizado, eu gostaria de ser avisado novamente de forma passiva sem eu precisar ir atrás do código pra entender onde é que esse método foi chamado. E por que dssa minha ânsia de querer ser avisado toda hora? Porque daí meu trabalho é tão simples quanto ficar OBSERVANDO essas coisas acontecerem e quando elas acontecerem eu avisar todos os clients que estiverem OBSERVANDO. Então eu pergutno para vocês, o que vocês acham da gente utilizar o design pattern OBSORVER dentro da camada de jogo? Ou seja, transforma a camada de jogo em um SUBJECT e construir uma peçinha que vai ficar assistindo a cada emissão,a cada evento que o jogo quiser emitir e ai propagar isso para todos os clients." -- Filipe Deschamps

Citação grande, eu sei, mas Filipe explica de forma tão animada e eficaz que tive que colocar sua explicação completa. Então para essa realease inicial vamos usar o design pattern OBSORVER para observar a camada de jogo, assim quando ela emitir uma notificação iremos emitir para todos clients!

### Transformando a camada de jogo em um subject

Para começar vamos criar nossa lista de observadores juntamente com os metodos que faz um objeto se torna um subject:

`game.js ////////////`

```js
export default function createGame() {
    ...
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
```

Nada de novo até agora, tirando que no keyboardListenner colocamos a lista de observadores no estado, mas como o arquivo `game.js` é pública e utilizado pelo backend. Só não faz sentido o backend compartilhar sua lista de observadores. O método `subscribe()` não mudou nada! sua lógica continua exatamente da mesma forma.

```js
    ...
    /**
     * @param {*object} command : {
     *  type : {string}
     * }
     * @description notify all observers in subscribe in for subsjecct
     */
    function notifyAll(command) {
        for (const functionObserver of observers) {
            if (functionObserver) {
                functionObserver(command)
            }
        }
    }

    ...

    return { 
        ...
        subscribe // tornar método público
    }
```

Novamente nada de novo, adicionamos o método `notifyAll` e retornamos o método subscrbe o tornando publico.

### Observando nosso novo subject

Com o game se tornando um subject, Vamos construir um observer para observar todas ações do
game, e com isso enviando essas ações para todos os clients:

`server.js /////////`

```js

const game = createGame();

game.subscribe((command) => {
  console.log('> emmiting signal to client with type: ', command.type)
  socket.emit(command.type, command)
})

```

Com isso, emitimos qualquer ação notificada pelo game para os clients usando o método `emit` do socket. Bom agora só falta de fato notificar essas ações:

`game.js ///////////`

```js
    ...
    function addPlayer(command) {
        ...

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
```

Agora quando adicionar um player ao estado do jogo, notificamos e a mágia acontece, pois o nosso observer humilde capita essa ação com o commad com os seguintes valores:

```js
type : 'add-player',
playerId : command.playerId,
playerX : playerX,
playerY : playerX
```

E manda para o client:

`server.js /////////////`

```js
game.subscribe((command) => {
  //         'add-player' | { posição do player X, posição do playerY } 
  socket.emit(command.type, command)
})
```

Essas informações, agora no client basta receber essas informações e adicionar no jogo do client:

`index.html ///////`

```js
...
    ...
    <script type="module">
        ...

        socket.on('add-player', (command) => {
            console.log(`received signal with name: ${command.type}`)
            gameClient.addPlayer(command) // adiciona o player novo
        })

    </script>
    </body>
</html>
```

Dessa forma quando um player entra ela será atualizado em todos clients! Basta fazer a mmesma coisa ao remover o player.

## Notificando ao client que um player saiu

Mesmo processo de adicionar um player:

`game.js ////////////`

```js
    ...
    function removePlayer(command) {
        ...
        delete state.players[command.playerId]

        notifyAll({
            type : 'remove-player',
            playerId : command.playerId
        })
    }
}
```

E agora o nosso observer no backend que vê as mudanças no game é acionado e enviar as informações para o client, e lá é só dizer o que fazer com o sinal:

`index.html ///////`

```js
...
    ...
    <script type="module">
        ...

        //sinal de player desconected
        socket.on('remove-player', (command) => {
            console.log('received signal with id: ', command.id)
            gameClient.removePlayer(command)
        })

    </script>
    </body>
</html>
```

### movimentando nosso player

Agora que conseguimos atualizar a lista de player para todo mundo, falta agora podermos controlar nosso personagem. Para isso vamos melhorar nosso keyboardListenner:

`keyboardListenner.js /////////`

```js
export default function createKeydownListenner() {

    const state = {
        observers : [],
        playerId : '' // perceba que adiconei o playerId no estado do keyboardListenner
    }

    ...

    //seta o playerId
    function setPlayerId(playerId) { // criamos o método que agora define qual player vamos controlar
        state.playerId = playerId
    }

    ...

    function handleKeydown(event) {
        
        const keyPressed = event.key
        
        const command = {
            type : 'move-player', // atribuimos o tipo de commando
            playerId : state.playerId,// mudamos para o valor do player de forma dinâmica
            keyPressed :  keyPressed
        }

        notifyAll(command)
    }

    return {
        subscribe,
        setPlayerId // definimos como público
    }
}
```

Melhoramos nossa camada de input adicionando coisas simples, inferimos agora o id do player que vamos controlar ao estado do keyboardListenner e criamos uma função que define esse atributo. Agora basta usá-los no `client.html`:

`index.html ///////`

```js
...
    ...
    <script type="module">
        ...

        socket.on('connect', () => {
            const playerId = socket.id
            ...            
            
            keyboardListener.setPlayerId(playerId) //definir player
            keyboardListener.subscribe(gameClient.movePlayer) //inscrever a movimentação do player

            renderstate(contextScreen, gameClient, playerId)
        })

    </script>
    </body>
</html>
```

Lindamente definimos o player de forma dinâmica, ativamos a notificação do player somente quando nos conectamos ao backend e escrevemos um observe simples que enviar para o backend o tipo de commando e o commando.

Demos um passo bem importante! Já sincronizamos a entrada e saída dos players,e a movimentação do player (de forma local, essa movimentação ainda não está sincronizada), mas como identificamos qual é o nosso player? Antes de partir para a movimentação vamos atualizar nossa função de renderização:

## Melhorando a renderização

`renderState.js //////////`

```js
/**
 * 
 * @param {*} contextScreen 
 * @param {*} game 
 * @param {*} clientPlayer 
 */
export default function renderstate(contextScreen, game, clientPlayerId) {
    //clear screen
    contextScreen.clearRect(0,0, 10, 10) // mais performatico que apenas redesenhar um react ta tela inteira

    for (const fruitId in game.state.fruits) {
        let currentFruit = game.state.fruits[fruitId]
        contextScreen.fillStyle = "green"
        contextScreen.fillRect(currentFruit.x, currentFruit.y, 1,1)
    }

    for (const playerId in game.state.players) {
    
        let currentPlayer = game.state.players[playerId]
        
        if (playerId == clientPlayerId) {
            contextScreen.fillStyle = "blue"    
        } else {
            contextScreen.fillStyle = "black"
        }
        
        contextScreen.fillRect(currentPlayer.x, currentPlayer.y, 1, 1)
    }

    
    requestAnimationFrame(() => {
        renderstate(contextScreen, game)
    }) // chama o método, fazendo com que atualize a tela a todo frame
}
```

Basicamente única mudança foi a adição da posição do playerId atual e a verificação se o player que estou renderizando é o player atual:

```js
    ...

    for (const playerId in game.state.players) {
    
        let currentPlayer = game.state.players[playerId]
        
        if (playerId == clientPlayerId) { // valida se o player atual
            contextScreen.fillStyle = "blue"//se for pinta de azul
        } else {
            contextScreen.fillStyle = "black"
        }
        
        contextScreen.fillRect(currentPlayer.x, currentPlayer.y, 1, 1)
    }

    ...
```

Outra pequena mudança foi no `client.html`, veja que quando a gente recepe o sinal de `connect`, também começamos a renderizar a tela passando o playerId para ela:

`index.html ///////`

```js
...
    ...
    <script type="module">
        ...

        socket.on('connect', () => {
            const playerId = socket.id
            ...            
            
            keyboardListener.setPlayerId(playerId) //definir player
            keyboardListener.subscribe(gameClient.movePlayer) //inscrever a movimentação do player

            renderstate(contextScreen, gameClient, playerId)
        })

    </script>
    </body>
</html>
```

## Sincronizando a movimentação dos players

Pode não parecer, mas já pavimentamos a estrada para isso, recapitulando a lógica, já temos a estrutura para implemetar essa sincronização! Inicialmente temos que identificar que o client movimento o player, logo em seguida enviar isso para o backend. Lá ele move o player de forma abstrata e retorna para todos os clients que um player se moveu! Simples assim. Tem uns detalhes de implementação, mas tocarei neles enquanto programamos essa parte!

### Ultilizando o keyboardListenner tunado

Modificamos o keyboardListenner recentemente, e basicamente vamos utilizar ele! Criaremos um observer (Lembre-se que o keyboarListenner é um subject) para observar as teclas e também seguiremos a lógica de escrever ele quando nosso client se conectar ao servidor:

`index.html ///////`

```js
...
    ...
    <script type="module">
        ...

        socket.on('connect', () => {
            const playerId = socket.id
            ...            
            
            keyboardListener.setPlayerId(playerId) //definir player
            keyboardListener.subscribe(gameClient.movePlayer) //inscrever a movimentação do player

            keyboardListener.subscribe((command) => {
                socket.emit(command.type, command) // enviamos para o backend
            })

            renderstate(contextScreen, gameClient, playerId)
        })

    </script>
    </body>
</html>
```

```js
keyboardListener.subscribe((command) => {
    socket.emit(command.type, command) // enviamos para o backend
})
```

Esse nosso observer irá notificar o backend quando o player andar! Agora vamos no backend receber esse sinal:

`server.js /////////`

```js

//conected signal
socket.on("connection", (socket) => {

    ...
    //moveplayer
    socket.on('move-player', (command) => {
        command.playerId = socket.id // garante que o id é realmente o correti
        command.type = 'move-player' // garante que o tipo de evento seja memso o movimentar
        game.movePlayer(command) // move de forma abstrata
    })

    ...

});

```

Aqui mora um perigo! Estamos recebendo informações direto do client. Tivemos uma conversar nos últimos capítulos sobre a confiabilidade dos dados do client, nos como "dono da verdade" (backend) precisamos garantir que essas informações são validas! Ou pelo menos a maior parte. No command recebemos algumas informações: `keyPressed` -> tecla usada pelo player , `playerId`-> qual player está fazendo a ação e por fim `type` que diz o tipo da ação.

Entre esses 3 valores, quais podemos confiar com 100%? Acredito que seja o `keyPressed`. Nos como backend precisamos nós virarmos com as entradas de usuário, mas o playerId que diz qual player será afetado pela ação e a ação em si pode ser alterado pelo client! E essas alterações podem impactar no jogo de forma perigosa! Não temos sistema de authenticação! mas por sorte sabemos qual ação queremos verificar e o id do socket que mandou o sinal. Então só precisamos sobrescrever essas informações para evitar alterações mal intencionadas!

```js
command.playerId = socket.id // garante que o id é realmente o correti
command.type = 'move-player' // garante que o tipo de evento seja memso o movimentar
```

Por isso reatribuimos os valores do id e do type! Agora basta dizer ao client o que ele deve fazer quando receber o sinal de `move-player`:

`index.html ///////`

```js
...
    ...
    <script type="module">
        ...

        //move player
        socket.on('move-player', (command) => {
            const playerId = socket.id
          
            if (playerId !== command.playerId) {
                gameClient.movePlayer(command)
            }
        })

    </script>
    </body>
</html>
```

Para finalizar, ao receber o sinal do backend que um player se moveu, verificamos se o player que se moveu não foi o próprio player, sim, é estranho, mas o socket notifica todo mundo! Incluindo o próprio socket que enviou. Para evitar a definição de uma movimentação que já foi feita pelo client fazemos essa verificação. Depois efetuamos a movimentação do game do client.

## Útimas palavras

Se a última parte ficou confusa e apressada, me desculpa. Ainda vou melhorá-la. Por hora vou descansar e comer algokkkk e o projeto não acabou aqui! Falei no último capítulo que o MVP do jogo estava quase pronto, mas isso é somente o mínimo produto viável. Quero adicionar mais mecânicas e transforma a ideia em minha! Os capítulos vão continuar com os conteúdos sendo 100% de minha autoria. Espero que fique e veja as loucuras que vamos aprontar com esse projeto.

Para meio de organizar, irei criar um fork do projeto! E as adições e melhorias serão feitos em outro momento em outro repositório. Estou ainda pensando em levar esses conteúdos para um blog tecnico, estou pensando ainda.

## FIM

## Navegação //----------

[Anterior](./meVejaProgramarUmBackendQueTrocaInformacoesEmTempoReal.md) | [Próximo](/README.md)
