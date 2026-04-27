// Base URL verificada - O backend roda na 3000
const API_URL = 'http://localhost:3000/api';

// Elementos da DOM
const grid = document.getElementById('results-grid');
const loader = document.getElementById('loader');
const searchForm = document.getElementById('search-form');
const fabAdd = document.getElementById('fab-add');
const modalCadastro = document.getElementById('modal-cadastro');
const modalDetalhes = document.getElementById('modal-detalhes');
const formCadastro = document.getElementById('form-cadastro');
const formAvistamento = document.getElementById('form-avistamento');
const btnEncontrado = document.getElementById('btn-encontrado');
const toast = document.getElementById('toast');

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    carregarPessoas();
    configurarEventos();
});

function configurarEventos() {
    // Busca
    searchForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const nome = document.getElementById('search-nome').value;
        const local = document.getElementById('search-local').value;
        carregarPessoas(nome, local);
    });

    // Abrir Modal de Cadastro
    fabAdd.addEventListener('click', () => abrirModal(modalCadastro));
    
    // Fechar modais
    document.querySelectorAll('.close-btn').forEach(btn => {
        btn.addEventListener('click', () => fecharModal(document.getElementById(btn.dataset.modal)));
    });

    // Fechar clicando fora
    window.addEventListener('click', (e) => {
        if(e.target === modalCadastro) fecharModal(modalCadastro);
        if(e.target === modalDetalhes) fecharModal(modalDetalhes);
    });

    // Submits dos formulários
    formCadastro.addEventListener('submit', handleCadastro);
    formAvistamento.addEventListener('submit', handleAvistamento);
    
    // Botão Encontrado
    btnEncontrado.addEventListener('click', marcarComoEncontrado);
}

// ==========================================
// FUNÇÕES DE COMUNICAÇÃO COM A API (FETCH)
// ==========================================

async function carregarPessoas(nome = '', local = '') {
    grid.innerHTML = '';
    loader.classList.remove('hidden');
    
    try {
        const queryParams = new URLSearchParams();
        if (nome) queryParams.append('nome', nome);
        if (local) queryParams.append('local', local);
        
        const response = await fetch(`${API_URL}/pessoas?${queryParams.toString()}`);
        if (!response.ok) throw new Error('Falha ao buscar dados');
        
        const dados = await response.json();
        renderizarCards(dados);
    } catch (error) {
        mostrarToast('⚠️ Erro ao conectar com o servidor.');
        console.error(error);
    } finally {
        loader.classList.add('hidden');
    }
}

function renderizarCards(pessoas) {
    if (pessoas.length === 0) {
        grid.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 3rem; background: var(--white); border-radius: var(--radius); border: 2px dashed var(--border);">
                <i class="fa-regular fa-folder-open" style="font-size: 3rem; color: var(--gray); margin-bottom: 1rem;"></i>
                <h3 style="color: var(--dark);">Nenhum registro encontrado</h3>
                <p style="color: var(--gray);">Tente buscar por outros termos.</p>
            </div>
        `;
        return;
    }

    pessoas.forEach(p => {
        const isEncontrado = p.status === 'encontrado';
        const card = document.createElement('div');
        card.className = `card ${isEncontrado ? 'encontrado' : ''}`;
        
        const dataStr = p.data_desaparecimento 
            ? new Date(p.data_desaparecimento).toLocaleDateString('pt-BR', {timeZone: 'UTC'}) 
            : 'Não informada';
            
        // Se a pessoa não tiver foto, gera um avatar com as iniciais do nome
        const fotoUrl = p.foto_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(p.nome)}&background=random&color=fff&size=400&font-size=0.33`;

        card.innerHTML = `
            <img src="${fotoUrl}" alt="Foto de ${p.nome}" class="card-image">
            <div class="card-header">
                <div class="card-title">${p.nome}</div>
                <span class="badge badge-${p.status}">${p.status.toUpperCase()}</span>
            </div>
            <div class="card-body">
                ${p.idade ? `<p><i class="fa-solid fa-user"></i> ${p.idade} anos</p>` : ''}
                <p><i class="fa-solid fa-location-dot"></i> <strong>Visto em:</strong> ${p.local_desaparecimento}</p>
                <p><i class="fa-regular fa-calendar"></i> <strong>Data:</strong> ${dataStr}</p>
            </div>
            <div class="card-footer">
                <button class="btn btn-secondary btn-block" onclick="abrirDetalhes('${p.id}')">
                    <i class="fa-solid fa-eye"></i> Ver Detalhes
                </button>
            </div>
        `;
        grid.appendChild(card);
    });
}

// Abre o modal e carrega os detalhes
window.abrirDetalhes = async function(id) {
    abrirModal(modalDetalhes);
    document.querySelector('.detalhes-body').classList.add('hidden'); // Esconde corpo até carregar
    
    try {
        const response = await fetch(`${API_URL}/pessoas/${id}`);
        if (!response.ok) throw new Error('Não foi possível carregar os detalhes');
        
        const pessoa = await response.json();
        
        // Preenche dados da pessoa
        document.getElementById('det-nome').textContent = pessoa.nome;
        document.getElementById('det-contato-nome').textContent = pessoa.nome_contato;
        document.getElementById('det-contato-tel').textContent = pessoa.telefone_contato ? `(${pessoa.telefone_contato})` : '';
        
        const badge = document.getElementById('det-status');
        badge.textContent = pessoa.status.toUpperCase();
        badge.className = `badge badge-${pessoa.status}`;
        
        document.getElementById('det-idade').textContent = pessoa.idade ? `${pessoa.idade} anos` : 'Não informada';
        document.getElementById('det-local').textContent = pessoa.local_desaparecimento;
        
        const dataObj = pessoa.data_desaparecimento ? new Date(pessoa.data_desaparecimento) : null;
        document.getElementById('det-data').textContent = dataObj ? dataObj.toLocaleDateString('pt-BR', {timeZone: 'UTC'}) : 'Não informada';
        
        document.getElementById('det-descricao').textContent = pessoa.descricao || 'Sem descrição cadastrada.';
        
        // Renderiza Avistamentos
        const aviList = document.getElementById('avistamentos-list');
        aviList.innerHTML = '';
        if (pessoa.avistamentos && pessoa.avistamentos.length > 0) {
            pessoa.avistamentos.forEach(a => {
                const dataLocal = new Date(a.data_avistamento).toLocaleString('pt-BR');
                aviList.innerHTML += `
                    <div class="avistamento-item">
                        <h5><i class="fa-solid fa-location-crosshairs"></i> ${a.local_avistamento}</h5>
                        <p style="color: var(--gray); font-size: 0.85rem; margin-bottom: 8px;"><i class="fa-regular fa-clock"></i> ${dataLocal}</p>
                        <p>${a.descricao_avistamento || 'Nenhuma descrição adicional.'}</p>
                        <p style="margin-top: 10px; font-size: 0.9rem;">
                            <strong>Avisado por:</strong> ${a.nome_informante || 'Anônimo'} ${a.telefone_informante ? `- ${a.telefone_informante}`:''}
                        </p>
                    </div>
                `;
            });
        } else {
            aviList.innerHTML = '<p class="text-muted">Nenhum avistamento registrado para esta pessoa.</p>';
        }

        // Configura visibilidade do formulário de avistamento (Esconde se já foi encontrado)
        const isEncontrado = pessoa.status === 'encontrado';
        document.getElementById('avi-pessoa-id').value = pessoa.id;
        document.getElementById('form-avistamento-container').classList.toggle('hidden', isEncontrado);
        
        // Configura botão de "Encontrado"
        btnEncontrado.dataset.id = pessoa.id;
        btnEncontrado.classList.toggle('hidden', isEncontrado);

        // Mostra conteúdo carregado
        document.querySelector('.detalhes-body').classList.remove('hidden');

    } catch (error) {
        mostrarToast('Erro ao carregar detalhes');
        fecharModal(modalDetalhes);
    }
}

// POST - Cadastrar Pessoa
async function handleCadastro(e) {
    e.preventDefault();
    const btn = formCadastro.querySelector('button');
    btn.disabled = true;
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Salvando...';

    const dados = {
        nome: document.getElementById('cad-nome').value,
        idade: document.getElementById('cad-idade').value || null,
        data_desaparecimento: document.getElementById('cad-data').value || null,
        local_desaparecimento: document.getElementById('cad-local').value,
        foto_url: document.getElementById('cad-foto').value || null,
        descricao: document.getElementById('cad-descricao').value,
        nome_contato: document.getElementById('cad-contato-nome').value,
        telefone_contato: document.getElementById('cad-contato-tel').value
    };

    try {
        const response = await fetch(`${API_URL}/pessoas`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dados)
        });

        if (response.ok) {
            mostrarToast('✅ Registro criado com sucesso!');
            fecharModal(modalCadastro);
            formCadastro.reset();
            carregarPessoas(); // Atualiza a tela
        } else {
            const err = await response.json();
            mostrarToast(`❌ Erro: ${err.error || 'Falha ao salvar'}`);
        }
    } catch (error) {
        mostrarToast('❌ Erro de conexão com o servidor');
    } finally {
        btn.disabled = false;
        btn.innerHTML = 'Salvar Registro';
    }
}

// POST - Registrar Avistamento
async function handleAvistamento(e) {
    e.preventDefault();
    const id = document.getElementById('avi-pessoa-id').value;
    const btn = formAvistamento.querySelector('button');
    btn.disabled = true;
    
    const dados = {
        pessoa_id: id,
        local_avistamento: document.getElementById('avi-local').value,
        data_avistamento: document.getElementById('avi-data').value,
        descricao_avistamento: document.getElementById('avi-descricao').value,
        nome_informante: document.getElementById('avi-nome').value,
        telefone_informante: document.getElementById('avi-tel').value
    };

    try {
        const response = await fetch(`${API_URL}/avistamentos`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dados)
        });

        if (response.ok) {
            mostrarToast('✅ Avistamento registrado! Obrigado por ajudar.');
            formAvistamento.reset();
            abrirDetalhes(id); // Recarrega o modal para mostrar o novo avistamento
        } else {
            const err = await response.json();
            mostrarToast(`❌ Erro: ${err.error || 'Falha ao enviar'}`);
        }
    } catch (error) {
        mostrarToast('❌ Erro ao enviar avistamento');
    } finally {
        btn.disabled = false;
    }
}

// PATCH - Marcar como Encontrado
async function marcarComoEncontrado() {
    const id = btnEncontrado.dataset.id;
    if (!confirm('Você tem certeza absoluta que deseja marcar essa pessoa como ENCONTRADA?')) return;

    try {
        const response = await fetch(`${API_URL}/pessoas/${id}/encontrado`, { 
            method: 'PATCH' 
        });
        
        if (response.ok) {
            mostrarToast('🎉 Que notícia maravilhosa! Status atualizado.');
            abrirDetalhes(id); // Recarrega o modal
            carregarPessoas(); // Recarrega a grade
        } else {
            mostrarToast('❌ Erro ao atualizar status');
        }
    } catch (error) {
        mostrarToast('❌ Erro de comunicação');
    }
}

// ==========================================
// FUNÇÕES AUXILIARES DE UI
// ==========================================

function abrirModal(modalElement) {
    modalElement.classList.add('active');
}

function fecharModal(modalElement) {
    modalElement.classList.remove('active');
}

function mostrarToast(msg) {
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => {
        toast.classList.remove('show');
    }, 4000);
}
