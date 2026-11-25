// Memórias iniciais de exemplo (você pode trocar pelos links das suas fotos!)
const memoriasIniciais = [
    {
        id: 1,
        titulo: "Primeiro Dia de Terceirão",
        categoria: "eventos",
        imagem: "https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&w=600&q=80",
        descricao: "A ficha ainda não tinha caído que era o nosso último ano juntos.",
        curtidas: 24
    },
    {
        id: 2,
        titulo: "Aula Vaga no Pátio",
        categoria: "sala",
        imagem: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=600&q=80",
        descricao: "Aquele momento clássico fingindo que estávamos estudando para o vestibular.",
        curtidas: 19
    },
    {
        id: 3,
        titulo: "Viagem de Formatura",
        categoria: "viagens",
        imagem: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80",
        descricao: "O melhor fim de semana da história dessa turma!",
        curtidas: 35
    }
];

const recadosIniciais = [
    { autor: "Miga da turma", texto: "Vou sentir muita falta das nossas crises de riso no fundo da sala!" },
    { autor: "Representante", texto: "Sobrevivemos aos simulados! Sucesso pra todo mundo na faculdade." }
];

// Carregar dados do LocalStorage ou usar os iniciais
let memorias = JSON.parse(localStorage.getItem('memoriasTerceirao')) || memoriasIniciais;
let recados = JSON.parse(localStorage.getItem('recadosTerceirao')) || recadosIniciais;

const muralEl = document.getElementById('mural-memorias');
const listaRecadosEl = document.getElementById('lista-recados');

// Renderizar Polaroids
function renderizarMemorias(filtro = 'todas') {
    muralEl.innerHTML = '';

    const filtradas = filtro === 'todas' 
        ? memorias 
        : memorias.filter(m => m.categoria === filtro);

    filtradas.forEach(memoria => {
        const card = document.createElement('article');
        card.className = 'polaroid';
        card.innerHTML = `
            <img src="${memoria.imagem}" alt="${memoria.titulo}">
            <h3>${memoria.titulo}</h3>
            <p>${memoria.descricao}</p>
            <button class="btn-curtir" onclick="curtirMemoria(${memoria.id})">
                ❤️ ${memoria.curtidas}
            </button>
        `;
        muralEl.appendChild(card);
    });
}

// Função de curtir
window.curtirMemoria = function(id) {
    const item = memorias.find(m => m.id === id);
    if (item) {
        item.curtidas++;
        salvarDados();
        const categoriaAtiva = document.querySelector('.filtro-btn.active').dataset.categoria;
        renderizarMemorias(categoriaAtiva);
    }
};

// Filtros
document.querySelectorAll('.filtro-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelector('.filtro-btn.active').classList.remove('active');
        btn.classList.add('active');
        renderizarMemorias(btn.dataset.categoria);
    });
});

// Modal de Nova Memória
const modal = document.getElementById('modal-memoria');
document.getElementById('btn-nova-memoria').addEventListener('click', () => modal.classList.remove('hidden'));
document.getElementById('fechar-modal').addEventListener('click', () => modal.classList.add('hidden'));

document.getElementById('form-memoria').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const novaMemoria = {
        id: Date.now(),
        titulo: document.getElementById('titulo-memoria').value,
        categoria: document.getElementById('categoria-memoria').value,
        imagem: document.getElementById('imagem-memoria').value,
        descricao: document.getElementById('descricao-memoria').value,
        curtidas: 1
    };

    memorias.unshift(novaMemoria);
    salvarDados();
    renderizarMemorias();
    e.target.reset();
    modal.classList.add('hidden');
});

// Recados da Cápsula do Tempo
function renderizarRecados() {
    listaRecadosEl.innerHTML = '';
    recados.forEach(recado => {
        const postIt = document.createElement('div');
        postIt.className = 'post-it';
        postIt.innerHTML = `
            <p>"${recado.texto}"</p>
            <strong>— ${recado.autor}</strong>
        `;
        listaRecadosEl.appendChild(postIt);
    });
}

document.getElementById('form-recado').addEventListener('submit', (e) => {
    e.preventDefault();
    const autor = document.getElementById('autor-recado').value;
    const texto = document.getElementById('texto-recado').value;

    recados.unshift({ autor, texto });
    salvarDados();
    renderizarRecados();
    e.target.reset();
});

function salvarDados() {
    localStorage.setItem('memoriasTerceirao', JSON.stringify(memorias));
    localStorage.setItem('recadosTerceirao', JSON.stringify(recados));
}

// Inicializar página
renderizarMemorias();
renderizarRecados();
