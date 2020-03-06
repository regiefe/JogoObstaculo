let  canvas, ctx, ALTURA, LARGURA, frames = 0, maxPulos = 3, velocidade = 12, estadoAtual,

estados = {
    jogar: 0,
    jogando: 1,
    perdeu:2,
},

chao = {
    y: 550,
    altura:50,
    cor: "#e8da78",

    desenha: function(){
        ctx.fillStyle = this.cor
        ctx.fillRect( 0, this.y, LARGURA, this.altura )
    },
},

bloco = {
    x: 50,
    y: 0,
    altura:50,
    largura:50,
    cor: "#ff9239",
    gravidade: 1.6,
    velocidade: 0,
    forcaDoPulo:23.6 ,
    qntPulos: 0,
    score: 0,

    atualiza:function(){
        this.velocidade += this.gravidade
        this.y += this.velocidade

        if( this.y > chao.y - this.altura && estadoAtual != estados.perdeu  ){
            this.y = chao.y - this.altura 
            this.qntPulos =  0    
            this.velocidade = 0
        }
    },

    pula: function (){
        if(this.qntPulos < maxPulos){
            this.velocidade = -this.forcaDoPulo
            this.qntPulos++
        }
    },

    reset: function (){
        this.velocidade = 0
        this.y  = 0
        this.scorre = 0
    },

    desenha: function(){
        ctx.fillStyle = this.cor
        ctx.fillRect( this.x, this.y, this.altura, this.largura )
    },
}

obstaculos = {
    _obs: [],
    cores: ["#ffbc1c", "#ff1c1c", "#ff85e1", "#52a7ff", "#78ff4d"],
    tempoInsere: 0,

    insere: function() {
        this._obs.push({
            x: LARGURA,
            largura: 50,
            altura: 30 + Math.floor(120 * Math.random()),
            cor: this.cores[Math.floor(5 * Math.random())],
        })
        this.tempoInsere = 30 + Math.floor(22 * Math.random())
    },
    atualiza: function() {
        if(this.tempoInsere ==  0)
            this.insere()
        else
            this.tempoInsere--

        for(var i = 0, tam = this._obs.length; i < tam; i++){
            var obs = this._obs[i]
            obs.x -= velocidade

            if( bloco.x < obs.x + obs.largura &&
                bloco.x + bloco.largura >= obs.x &&
                bloco.y + bloco.altura >= chao.y - obs.altura)
                estadoAtual = estados.perdeu

            else if(obs.x == 0)
                bloco.score++

            else if(obs.x <= -obs.largura){
                this._obs.splice(i, 1)
                tam--
                i--
            }
        }
    },
    limpa: function(){
        this._obs = []
    },

    desenha: function() {
        for(var i = 0, tam = this._obs.length; i < tam; i++) {
            var obs = this._obs[i]
            ctx.fillStyle = obs.cor
            ctx.fillRect(obs.x, chao.y - obs.altura, obs.largura, obs.altura)
        }
    },
}

function clique(){
    if(estadoAtual == estados.jogando)
        bloco.pula()

    else if(estadoAtual == estados.jogar)
        estadoAtual = estados.jogando

    else if(estadoAtual == estados.perdeu && bloco.y >= 2 * ALTURA){
        estadoAtual = estados.jogar
        obstaculos.limpa()
        bloco.reset()
    }
}
function roda(){

    atualiza()
    desenha()

    window.requestAnimationFrame(roda)
}
function atualiza(){
    frames++
    bloco.atualiza()
    if ( estadoAtual == estados.jogando)
        obstaculos.atualiza()
}

function desenha() {
    ctx.fillStyle = "#80daff"
    ctx.fillRect(0, 0, LARGURA, ALTURA)

    ctx.fillStyle = "#fff"
    ctx.font = "50px Arial"
    ctx.fillText( bloco.score, 30, 68 )


    switch (estadoAtual){

        case estados.jogar:
            ctx.fillStyle = "green"
            ctx.fillRect(LARGURA / 2 - 50, ALTURA / 2 - 50, 100, 100)
            break
        case estados.perdeu:
            ctx.fillStyle = "red"
            ctx.fillRect(LARGURA / 2 - 50, ALTURA / 2 - 50, 100, 100)

            ctx.save()
            ctx.translate(LARGURA / 2, ALTURA / 2)
            ctx.fillStyle = "#fff"

            if(bloco.score < 10)
                ctx.fillText(bloco.score, -13, 19)
            else if(bloco.score >= 10 && bloco.score < 100) 
                ctx.fillText(bloco.score, -26, 19)
            else
                ctx.fillText(bloco.score, -39, 19)

            ctx.restore()
            break
        case estados.jogando:
            obstaculos.desenha()
            break
    }

    chao.desenha()
    bloco.desenha()
}

main()
