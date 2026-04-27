-- Enum para o status da pessoa
CREATE TYPE status_pessoa AS ENUM ('desaparecido', 'encontrado');

-- Tabela de pessoas desaparecidas
CREATE TABLE pessoas_desaparecidas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome VARCHAR(255) NOT NULL,
    idade INTEGER,
    descricao TEXT,
    foto_url VARCHAR(1000),
    local_desaparecimento VARCHAR(255) NOT NULL,
    data_desaparecimento TIMESTAMP,
    nome_contato VARCHAR(255),
    telefone_contato VARCHAR(50),
    status status_pessoa DEFAULT 'desaparecido',
    created_at TIMESTAMP DEFAULT NOW()
);

-- Tabela de avistamentos
CREATE TABLE avistamentos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pessoa_id UUID REFERENCES pessoas_desaparecidas(id) ON DELETE CASCADE,
    local_avistamento VARCHAR(255) NOT NULL,
    data_avistamento TIMESTAMP,
    descricao_avistamento TEXT,
    nome_informante VARCHAR(255),
    telefone_informante VARCHAR(50),
    created_at TIMESTAMP DEFAULT NOW()
);

-- Índices para buscas rápidas
CREATE INDEX idx_pessoas_nome ON pessoas_desaparecidas(nome);
CREATE INDEX idx_pessoas_status ON pessoas_desaparecidas(status);
