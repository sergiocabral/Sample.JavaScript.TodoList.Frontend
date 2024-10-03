const STORAGE_KEY = "tarefas"

const elTitulo = document.querySelector("h1");
const elFiltro = document.getElementById("filtro");
const elTarefas = document.getElementById("tarefas");
const elNovaTarefaDescricao = document.getElementById("nova-tarefa");
const elAdicionarNovaTarefa = document.getElementById("adicionar-nova-tarefa");

let tarefas = [];

function montarListaDeTarefas(tarefas) {
  elTarefas.innerHTML = "";
  tarefas.forEach((tarefa) => {
    const elTarefaItem = document.createElement("li");
    elTarefaItem.classList.add(tarefa.completa ? "completa" : "pendente");

    const elTarefaDescricao = document.createElement("span");
    elTarefaDescricao.classList.add("descricao");
    elTarefaDescricao.textContent = tarefa.descricao;

    const elTarefaStatus = document.createElement("span");
    elTarefaStatus.classList.add("status");
    elTarefaStatus.textContent = tarefa.completa ? "Feita" : "A Fazer";

    const elTarefaApagar = document.createElement("button");
    elTarefaApagar.classList.add("apagar");
    elTarefaApagar.textContent = "Apagar";

    elTarefaItem.addEventListener('click', () => definirStatusDaTarefa(tarefa.id, !tarefa.completa));
    elTarefaApagar.addEventListener('click', event => {
      event.stopPropagation();
      apagarTarefa(tarefa.id);
    });

    elTarefaItem.appendChild(elTarefaDescricao);
    elTarefaItem.appendChild(elTarefaStatus);
    elTarefaItem.appendChild(elTarefaApagar);

    elTarefas.appendChild(elTarefaItem);
  });
}

async function carregarTarefas() {
  try {
    tarefas = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]');
    montarListaDeTarefas(tarefas);
  } catch (error) {
    console.error("Erro na requisição:", error);
  }
}

async function adicionarNovaTarefa(descricao) {
  try {
    tarefas = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]');
    tarefas.push({
      id: Date.now(),
      descricao: descricao,
      completa: false
    })
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tarefas))
    elNovaTarefaDescricao.value = '';
    await carregarTarefas();
  } catch (error) {
    console.error('Erro na requisição:', error);
  }
}

async function apagarTarefa(id) {
  try {
    tarefas = JSON.parse(localStorage.getItem('tarefas') ?? '[]');
    const index = tarefas.findIndex(tarefa => tarefa.id == id)
    if (index >= 0) {
      tarefas.splice(index, 1)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tarefas))
      await carregarTarefas();
    }
  } catch (error) {
    console.error('Erro na requisição:', error);
  }
}

async function definirStatusDaTarefa(id, completa) {
  try {
    tarefas = JSON.parse(localStorage.getItem('tarefas') ?? '[]');
    const index = tarefas.findIndex(tarefa => tarefa.id == id)
    if (index >= 0) {
      tarefas[index].completa = completa
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tarefas))
      await carregarTarefas();
    }
  } catch (error) {
    console.error('Erro na requisição:', error);
  }
}

elFiltro.addEventListener('input', (event) => {
  const filtro = event.target.value.toLowerCase();
  const tarefasFiltradas = tarefas.filter(task => task.descricao.toLowerCase().includes(filtro));
  montarListaDeTarefas(tarefasFiltradas);
});

elAdicionarNovaTarefa.addEventListener('click', async () => {
  const novaTarefaDescricao = elNovaTarefaDescricao.value.trim();
  if (novaTarefaDescricao !== '') {
    adicionarNovaTarefa(novaTarefaDescricao);
  }
});

elTitulo.addEventListener('click', (event) => {
  document.body.attributes["data-theme"].value = document.body.attributes["data-theme"].value !== 'light' ? 'light' : 'dark';
});

window.onload = carregarTarefas;
