const btnAdicionarTarefa = document.querySelector(".app__button--add-task");
const formularioAdicionarTarefa = document.querySelector(".app__form-add-task");
const textarea = document.querySelector(".app__form-textarea");
const ulTarefas = document.querySelector(".app__section-task-list");
const descricaoDaTarefa = document.querySelector(".app__section-active-task-description");
const btnRemoverTarefasConcluidas = document.querySelector("#btn-remover-concluidas");
const btnRemoverTodasAsTarefas = document.querySelector("#btn-remover-todas");

let tarefas = JSON.parse(localStorage.getItem("tarefas")) || [];
let tarefaSelecionada = null;
let liDaTarefaSelecionada = null;

function atualizarTarefas() {
    localStorage.setItem("tarefas", JSON.stringify(tarefas));
}

function criarListaDeTarefas(tarefa) {
    const li = document.createElement("li");
    li.classList.add("app__section-task-list-item");
    const svg = document.createElement("svg");
    svg.innerHTML = `<svg class="app__section-task-icon-status" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="12" cy="12" r="12" fill="#FFF"></circle>
                        <path d="M9 16.1719L19.5938 5.57812L21 6.98438L9 18.9844L3.42188 13.4062L4.82812 12L9 16.1719Z" fill="#01080E"></path>
                    </svg>`;

    const paragrafo = document.createElement("p");
    paragrafo.classList.add("app__section-task-list-item-description");
    paragrafo.textContent = tarefa.descricao;

    const botao = document.createElement("button");
    botao.classList.add("app_button-edit");
    const imagemDoBotao = document.createElement("img");
    imagemDoBotao.setAttribute("src", "/imagens/edit.png");
    botao.append(imagemDoBotao);

    botao.onclick = () => {
        let novaDescricao = prompt("Informe a nova terefa:");
        if (novaDescricao) {
            paragrafo.textContent = novaDescricao;
            tarefa.descricao = novaDescricao;
            atualizarTarefas();
        }
    }

    li.append(svg);
    li.append(paragrafo);
    li.append(botao);

    if (tarefa.completa) {
        li.classList.add("app__section-task-list-item-complete");
        botao.setAttribute("disabled", "disabled");
    } else {
        li.onclick = () => {

            descricaoDaTarefa.textContent = tarefa.descricao;

            document.querySelectorAll(".app__section-task-list-item-active").forEach(elemento => {
                elemento.classList.remove("app__section-task-list-item-active");
            })

            if (tarefaSelecionada == tarefa) {
                descricaoDaTarefa.textContent = "";
                tarefaSelecionada = null;
                liDaTarefaSelecionada = null;
                return;
            }

            tarefaSelecionada = tarefa;
            liDaTarefaSelecionada = li;
            li.classList.add("app__section-task-list-item-active");

        }
    }

    return li;
}

btnAdicionarTarefa.addEventListener("click", () => {
    formularioAdicionarTarefa.classList.toggle("hidden");
})

formularioAdicionarTarefa.addEventListener("submit", (evento) => {
    evento.preventDefault();
    const tarefa = {
        descricao: textarea.value
    }
    tarefas.push(tarefa);
    const elementoTarefa = criarListaDeTarefas(tarefa);
    ulTarefas.append(elementoTarefa);
    atualizarTarefas();
    textarea.value = "";
    formularioAdicionarTarefa.classList.toggle("hidden");
})

tarefas.forEach(tarefa => {
    const elementoTarefa = criarListaDeTarefas(tarefa);
    ulTarefas.append(elementoTarefa);
});

document.addEventListener("FocoFinalizado", () => {
    if (tarefaSelecionada && liDaTarefaSelecionada) {
        liDaTarefaSelecionada.classList.remove("app__section-task-list-item-active");
        liDaTarefaSelecionada.classList.add("app__section-task-list-item-complete");
        liDaTarefaSelecionada.querySelector("button").setAttribute("disabled", "disabled");
        tarefaSelecionada.completa = true;
        atualizarTarefas();
    }
})

const removerTarefas = (somenteTarefasCompletas) => {
    let seletor = somenteTarefasCompletas ? ".app__section-task-list-item-complete" : ".app__section-task-list-item";

    document.querySelectorAll(seletor).forEach(el => {
        el.remove();
    })
    tarefas = somenteTarefasCompletas ? tarefas.filter(elemento => !elemento.completa) : [];
    atualizarTarefas();
}
btnRemoverTarefasConcluidas.onclick = () => removerTarefas(true);
btnRemoverTodasAsTarefas.onclick = () => removerTarefas(false);