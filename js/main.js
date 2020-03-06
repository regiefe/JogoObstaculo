function main() {
    ALTURA  = window.innerHeight
    LARGURA = window.innerWidth

    if(LARGURA >= 500){
        LARGURA = 600;
        ALTURA = 600;
    }

    canvas = document.createElement("canvas")
    canvas.width = LARGURA
    canvas.height = ALTURA
    canvas.style.border = "1px solid #000"

    ctx = canvas.getContext("2d")
    document.body.appendChild(canvas)
    document.addEventListener("mousedown", clique)

    estadoAtual = estados.jogar
    roda()
}
