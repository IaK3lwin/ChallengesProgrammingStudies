# Teste do código ruim (quero ver você passar!)

Nesse vídeo o Filipe diz querer fazer nós pensarmos como programador!
E que o conteúdo apresentado agora é mais importante que o jogo em si.
Melhorias sugeridas pela própria comunidade:

## Melhoria no clean screen
O nosso mano Rafael Miliewski, Sugeriu o uso do mêtodo cleanRect do próprio contexto 
do Canvas: 

```JavaScript

 //clear screen
contextGame.clearnRect(0,0, 10, 10) // mais performatico que apenas redesenhar um react ta tela inteira


```

## implicitar o tipo das variáveis em loops

Outro detalhe importante é de esplicitar o tipo de variável nos loops:

```JavaScript
...
for (const playerId in game.players) {
        let currentPlayer = game.players[playerId]
    contextGame.fillStyle = "black"
    contextGame.fillRect(currentPlayer.x, currentPlayer.y, 1, 1)
}

for (const fruitId in game.fruits) {
    let currentFruit = game.fruits[fruitId]
    contextGame.fillStyle = "green"
    contextGame.fillRect(currentFruit.x, currentFruit.y, 1,1)
}
...
```