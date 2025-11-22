## Duvido você programar um algoritmo mais rápido que o meu!!!

O que verá nesse cápitulo:
- Implementação de adição de players e frutas de forma dinâmica;
- Implementação do sistema de colisão;
- Finalizando assim a camada de jogo.

Filipe começa com a seguinte afirmação:

[imagem do jogo com colisão para demostrar que nosso cerebro já vem econhece um algoritmo de colisão
mas quando mostra em estrutura de dados nção]

> "è engraçado porque a gente tem dificuldade de fazer em código algo que o nosso cerebro já sabe fazer
por natureza, o bom é que nesse vídeo a gente vai treinar exatamente isso..." Filipe Deschamps

Para finalizar a camada do jogo não falta muito, o MVP da camada de jogo seria:
- adicionar jogador;
- remover jogador;
- adicionar frutas;
- remover frutas;
- colisão.

## adição e remoção de players dinamicamente

Para começar a finalizar a camada de jogo vamos criar os metodos de adição e remoção de players e frutas

```js
function createGame() {
    const state = {
        players : [],
        fruits : []
    }
}
```

Começamos zerando o estado do jogo, já que agora ele será atualizado de forma dinâmica

```js
function createGame() {
    const state = {
        players : {},
        fruits : {}
    }

    function addPlayer(command) {
        state.players[command.playerId] = {
            x : command.playerX,
            y : command.playerY
        }
    }

}
```

Função super simples e nada muito complexo, perceba que padronizamos a entidade command como parametro de 
acoplamento, dessa forma padronizado poderemos evitar confusões.

```js
function createGame() {
    const state = {
        players : {},
        fruits : {}
    }

    function addPlayer(command) ...

    function removePlayer(command) {
        delete state.players[command.playerId]
    }

}
```

E assim agora adicionamos de forma dinâmica a criação e exclusão de players, basta fazer a mesma
coisa com as frutas. Não iremos desenvolver um método generico para isso pois
podemos deixar o código confunso, então por hora iremos separá-las.

```js
function createGame() {
    const state = {
        players : {},
        fruits : {}
    }

    //adição de player
    function addPlayer(command) {
        state.players[command.playerId] = {
            x : command.playerX,
            y : command.playerY
        }
    }
//remoção de player
    function removePlayer(command) {
        delete state.players[command.playerId]
    }
    //adição de fruitas
    function addFruits(command) {
        state.fruits[command.fruitId] = {
            x : command.fruitsX,
            y : command.fruitsY
        }
    }
    // remoção de frutas
    function removePlayer(command) {
        delete state.fruits[command.fruitsId]
    }

    ...

    return {
        movePlayer,
        state,
        addPlayer,
        removePlayer,
        addFruits,
        removeFruits
    } 
}
```

Por fim tornamos esses métodos publicos retornando eles! E essa parte está finalizada!

![alt text](./assets/imgs/playeraddfunction.gif)

Ou pelo menos quase! o que acontece se adicionar um player com o código atual?

![alt text](./assets/imgs/playermovingerror.gif)

O código quebra! 