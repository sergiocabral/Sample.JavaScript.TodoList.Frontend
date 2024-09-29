const API_URL = "http://localhost:3000";

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

    elTarefaItem.appendChild(elTarefaDescricao);
    elTarefaItem.appendChild(elTarefaStatus);
    elTarefaItem.appendChild(elTarefaApagar);

    elTarefas.appendChild(elTarefaItem);
  });
}

async function carregarTarefas() {
  try {
    const response = await fetch(`${API_URL}/tarefas`);

    if (response.ok) {
      tarefas = await response.json();
      montarListaDeTarefas(tarefas);
    } else {
      console.error("Erro ao carregar as tarefas:", response.statusText);
    }
  } catch (error) {
    console.error("Erro na requisição:", error);
  }
}

async function adicionarNovaTarefa(descricao) {
  try {
    const response = await fetch(
      `${API_URL}/tarefa`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          descricao: descricao,
          completa: false
        })
      });

    if (response.ok) {
      elNovaTarefaDescricao.value = '';
      await carregarTarefas();
    } else {
      console.error('Erro ao adicionar tarefa:', response.statusText);
    }
  } catch (error) {
    console.error('Erro na requisição:', error);
  }
}

async function definirStatusDaTarefa(id, completa) {
  try {
    const response = await fetch(
      `${API_URL}/tarefa/${id}/${completa ? 'completa' : 'incompleta'}`, {
        method: 'PATCH',
      });

    if (response.ok) {
      await carregarTarefas();
    } else {
      console.error('Erro ao atualizar tarefa:', response.statusText);
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

window.onload = carregarTarefas;
