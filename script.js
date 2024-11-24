const html = document.querySelector("html");
const focoBt = document.querySelector(".app__card-button--foco");
const curtoBt = document.querySelector(".app__card-button--curto");
const longoBt = document.querySelector(".app__card-button--longo");
const banner = document.querySelector(".app__image");
const titulo = document.querySelector(".app__title");
const botoes = document.querySelectorAll(".app__card-button");
const startPauseBt = document.querySelector("#start-pause");
const iniciarOuPausarBt = document.querySelector("#start-pause span");
const imgPausarOuComecar = document.querySelector(".app__card-primary-butto-icon");
const tempoNaTela = document.querySelector("#timer");
const musicaFocoInput = document.querySelector("#alternar-musica");
const musica = new Audio("./sons/luna-rise-part-one.mp3")
const musicaIniciar = new Audio("./sons/play.wav");
const musicaPausar = new Audio("./sons/pause.mp3");
const musicaFim = new Audio("./sons/beep.mp3");

const temporizadorFoco = 30;
const temporizadorDescansoCurto = 300;
const temporizadorDescansoLongo = 900;
let tempoDecorridoEmSegundos = temporizadorFoco;
let intervaloId = null;


musica.loop = true;
musicaFocoInput.addEventListener("change", () => {
    if (musica.paused) {
        musica.play();
    } else {
        musica.pause();
    }
})
modoFoco();

function modoFoco() {
    focoBt.addEventListener("click", () => {
        tempoDecorridoEmSegundos = temporizadorFoco;
        alterarContexto("foco");
        focoBt.classList.add("active");
    });

    curtoBt.addEventListener("click", () => {
        tempoDecorridoEmSegundos = temporizadorDescansoCurto;
        alterarContexto("descanso-curto");
        curtoBt.classList.add("active");
    });

    longoBt.addEventListener("click", () => {
        tempoDecorridoEmSegundos = temporizadorDescansoLongo;
        alterarContexto("descanso-longo");
        longoBt.classList.add("active");
    });
}

function alterarContexto(contexto) {
    botoes.forEach(function (contexto) {
        contexto.classList.remove("active");
    });
    mostrarTempo();
    html.setAttribute("data-contexto", contexto);
    banner.setAttribute("src", `./imagens/${contexto}.png`);
    switch (contexto) {
        case "foco":
            titulo.innerHTML = `Otimize sua produtividade,<br>
                <strong class="app__title-strong">mergulhe no que importa.</strong>`
            break;
        case "descanso-curto":
            titulo.innerHTML = `Que tal dar uma respirada?<br>
                <strong class="app__title-strong">Faça uma pausa curta.</strong>`
            break;
        case "descanso-longo":
            titulo.innerHTML = `Hora de voltar à superfície.<br>
            <strong class="app__title-strong">Faça uma pausa longa.</strong>`
        default:
            break;
    }
}

const contagemRegressiva = () => {
    if (tempoDecorridoEmSegundos <= 0) {
        musicaFim.play();
        alert("Tempo finalizado!");
        zerar();
        const focoAtivo = html.getAttribute("data-contexto") == "foco";
        if (focoAtivo) {
            const evento = new CustomEvent("FocoFinalizado")
            document.dispatchEvent(evento);
        }

        return;
    }
    tempoDecorridoEmSegundos -= 1;
    mostrarTempo();
};

startPauseBt.addEventListener("click", iniciarOuPausar);

function iniciarOuPausar() {
    if (intervaloId) {
        zerar()
        musicaPausar.play();

        return;
    }
    musicaIniciar.play();
    intervaloId = setInterval(contagemRegressiva, 1000);
    imgPausarOuComecar.setAttribute("src", "/imagens/pause.png");
    iniciarOuPausarBt.textContent = "Pausar";
}

function zerar() {
    clearInterval(intervaloId);
    iniciarOuPausarBt.textContent = "Começar";
    imgPausarOuComecar.setAttribute("src", "/imagens/play_arrow.png");
    intervaloId = null;
}

function mostrarTempo() {
    const tempo = new Date(tempoDecorridoEmSegundos * 1000);
    const tempoFormatado = tempo.toLocaleTimeString("pt-br", { minute: "2-digit", second: "2-digit" });
    tempoNaTela.innerHTML = `${tempoFormatado}`;
}

mostrarTempo();
