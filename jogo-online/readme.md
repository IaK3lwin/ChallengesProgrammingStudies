# Jogo online
Esse projeto também foi criado pelo Filipe Deschamps (todos os creditos vai para ele). Estou apenas documentando minha tentativa de melhorar como programador.

## Overview 

O jogo será composto por um **cliente** e um **servidor** que
é bem comum, é importatante notar que para um mesmo servidor você
pode e deve conectar a vários clientes.

![Imagem]('![alt text](https://res.cloudinary.com/dyvfesbzn/image/upload/v1761653241/Drawing_2_3_betpbq.png)')

## Responsabilidades do jogo

- Apresentação : onde vai aparecer de fato as coisas na tela;
- jogo;
- Inputs;
- Networking.


### Apresentação
   Camada responável apenas pela exibição de gráficos, somos
seres bem visuais e achamos que tudo que a gente vê está condensado apenas ali. Mas não, uma impressora não sabe escrever um artigo com normas ortogrâficas (nem eu aparentimente). A impressora só tem como papel imprimir o que foi escrito. Um arquivo word que está dentro de seu computador. 

### jogo

  E se a camada de apresentação só tem a responsabilidade de
exibir os gráficos do jogo, como ele sabe que deve redesenhar algo? É aí que entra a camada de jogo(Lógica + dados).
  É a camada que guarda todas as informações do jogo, que guarda
o **estado do jogo**, Porém essa camada guarda de forma "abstrata".  Como isso é um projeto simples, o Filipe optou por juntar lógica com dados para simplificar o projeto. Lógica/regras de negócio são as ações que o jogo consegue fazer seja aperta um botão e ele andar para baixo etc... 

### Inputs
  Essa camada captura as ações do jogador, sem essa camada o jogo
não aconteceria, uma camada simples, porém importante! 

### Networking
  É ela a responsável por **sincronizar** todo mundo com o server
permitindo que o jogo seja atualizado a todo momento.

## <a href="./docs/umDosConceitosMaisImportantesSobreProgramacao.md">Um dos conceitos mais importantes na programação!</a>

  Nessa vídeo ele explica um dos paradigmas importantes para a programação o **Separation of
concerns**

## <a href="./docs/testeDoCodigoRuim.md">Teste do código mal feito (Quero ver você passar!)</a>
Nessa parte iremos começa o desenvolvimento da camada de input de forma bem... inadequada,
para conseguir enchergar os problemas e ir resolvendo eles! E também criaremos a primeira 
regra de negócio do jogo. 

referência: [video do filipe](https://youtu.be/RJvktZnZn6A)

## <a href="./docs/VoceNuncaMaisVaiConseguirLerUmCodigoDaMesmaForma.md">Você nunca mais vai conseguir ler um código da mesma forma...</a>

Nesse cápitulo iremos aprender um **novo design pattern** chamado **observer** e além
irá aprender um pouco sobre engenharia de sortware e conceitos como desacoplamento e acoplamento. 


## <a href="" >Um Júnior já deveria saber como reduzir a quantidade de ifs de um código (e você, sabe?)</a>