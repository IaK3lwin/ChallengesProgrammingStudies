# Teste do código ruim (quero ver você passar!)

Nesse vídeo o Filipe almeja fazer com que a gente comece a pensar como programadores!
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

Filipe faz o seguinte código nada elegante:

```JavaScript

 document.addEventListener('keydown', handleKeydown)
function handleKeydown(event) {
    const player = game.players[currentPlayerId]
    if (event.key == 'ArrowDown') {
        player.y += 1
        console.log("tecla ativa: ", event.key)
    }

    if (event.key == 'ArrowUp') {
        player.y -= 1
        console.log("tecla ativa: ", event.key)
    }
    if (event.key == 'ArrowRight') {
        console.log("tecla ativa: ", event.key)
        player.x += 1
    }

    if (event.key == 'ArrowLeft') {
        console.log("tecla ativa: ", event.key)
        player.x -= 1
    }
}

```

Para cada tecla precionada ele faz um if verificando a tecla, 
Fazendo com que o código não escale.

## Primeira regra de negócio!
A gora chegou uma hora importante! Nossa primeira regra
de negócio que consiste em limitar a zona de movimenta-
ção do player a tela do jogo. 

```JavaScript


document.addEventListener('keydown', handleKeydown)
function handleKeydown(event) {
    const player = game.players[currentPlayerId]
    

    if (event.key == 'ArrowUp' && player.y - 1 >= 0) {
        player.y -= 1
        console.log("tecla ativa: ", event.key)
    }
    console.log(canvas.width)
    console.log(player.y)
    if (event.key == 'ArrowDown' && player.y + 2 <= canvas.height) {
        player.y += 1
        console.log("tecla ativa: ", event.key)
    }

    if (event.key == 'ArrowRight' && player.x + 2 <= canvas.width) {
        console.log("tecla ativa: ", event.key)
        player.x += 1
    }

    if (event.key == 'ArrowLeft' && player.x - 1 >= 0)  {
        console.log("tecla ativa: ", event.key)
        player.x -= 1
    }
}

```

Funcionando! O player não passa da tela do canva, não 
deu erro, commit e mandar para a produção, certo?
NÂO! Consegue ver o problema??

E as responsábilidades de cada camada? foram para onde???
Isso não tá NADA bom! existe parte SENSÍVEL do código exposta 
para qualquer um ver e tentar alterar!

Bom, queremos ser melhores do que isso! Afinal esses detalhes
serão o que iram nos distinguir das IAs, nós como desenvolve-
dores não podemos nos permitir cometer esse tipo de erro! (que
já cometi algumas vezes!), mas estou estudando para evoluir!!

"Dentro da camada responsável por capturar o input do usuário tem
uma regra de negócio do JOGO! Misturado ali dentro, turma! Isso não
dói no ouvido de vocês? Se a gente deixar a implementação ir por essa direção, 
daqui a pouco a gente  está colocando detalhes da camada de apresentação,
dentro da camada de input... Se no meio dessa massaroca aparecer um BUG
em como um pixel está sendo renderizado na camada de apresentação, as vezez
isso pode está conectado de uma forma mega torta com a camada de network
e turma isso não tem nada haver!" - Filipe Deschamps

Causando dificuldades para implementar testes unitáiros e resolução
de BUGS futuros. Deixando a manutenção um INFERNO! Para solucionar
esse problema iremos aprender um novo design pattern!

na próxima parte:

 <a>Anterior</a>  | <a>Próximo</a>