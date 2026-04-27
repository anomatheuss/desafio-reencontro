# Reencontro 🤝

![NodeJS](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)

## 1. Apresentação da Ideia
O **Reencontro** é uma plataforma solidária desenvolvida para conectar famílias separadas durante desastres naturais, mais especificamente enchentes. A aplicação permite cadastrar pessoas desaparecidas, registrar avistamentos e atualizar os status para "Encontrado" de forma centralizada, ágil e focada na colaboração da comunidade.

## 2. Problema Escolhido (Caso 3 - Pessoas Desaparecidas)
Durante enchentes severas, a comunicação e as vias de acesso são frequentemente interrompidas, resultando em centenas de pessoas desencontradas de seus entes queridos. A falta de um sistema centralizado faz com que as informações se percam em redes sociais, dificultando o rastreio, o resgate e o reencontro das famílias.

## 3. Solução Proposta
A plataforma oferece uma interface intuitiva onde qualquer pessoa pode:
- Cadastrar detalhes vitais sobre pessoas desaparecidas (nome, características, roupa, último local visto).
- Registrar novos "avistamentos", ajudando a mapear os últimos passos e localizações das vítimas.
- Informar e celebrar o reencontro através da marcação do status "Encontrado".
Tudo isso é amparado por uma API RESTful ágil e um banco de dados relacional robusto.

## 4. Estrutura do Sistema
A aplicação é dividida em duas partes principais que se comunicam via API:
- **Frontend:** Construído com HTML5, CSS3 e Vanilla JavaScript (sem frameworks). O design é responsivo e otimizado para celulares, focado na fácil usabilidade e clareza durante momentos de emergência.
- **Backend:** Desenvolvido em Node.js com o framework Express. Fornece os endpoints necessários para o tráfego das informações.
- **Banco de Dados:** Utiliza PostgreSQL para garantir a consistência dos dados das pessoas e o histórico dos avistamentos.

## 5. Como rodar o projeto localmente

**Pré-requisitos:**
- Node.js (v14+ recomendado)
- PostgreSQL instalado e rodando

**Passo a passo:**

1. **Inicie e estruture o Banco de Dados**
   - Acesse o seu terminal do PostgreSQL (`psql`) e crie o banco de dados:
     ```sql
     CREATE DATABASE reencontro;
     ```
   - Execute o script contido em `backend/src/config/schema.sql` para criar as tabelas necessárias e seus relacionamentos.

2. **Configure e inicie o Backend**
   - Navegue até a pasta do backend:
     ```bash
     cd backend
     ```
   - Instale as dependências:
     ```bash
     npm install
     ```
   - Renomeie o arquivo `.env.example` para `.env` e preencha com as credenciais do seu PostgreSQL local.
   - Inicie o servidor em modo de desenvolvimento:
     ```bash
     npm run dev
     ```
   - O servidor rodará em `http://localhost:3000`.

3. **Inicie o Frontend**
   - Abra um novo terminal na pasta raiz do projeto.
   - Sirva os arquivos HTML usando um pacote como o `http-server`:
     ```bash
     npx http-server ./frontend -p 8080
     ```
   - Acesse `http://localhost:8080` no seu navegador para utilizar o sistema.

## 6. Variáveis de ambiente necessárias
As seguintes variáveis devem estar presentes no seu arquivo `/backend/.env`:

```env
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=sua_senha_do_banco
DB_NAME=reencontro
```

## 7. Endpoints da API

| Método | Rota | Descrição |
| :--- | :--- | :--- |
| **GET** | `/health` | Verifica se o servidor da API está online |
| **POST** | `/api/pessoas` | Cadastra uma nova pessoa desaparecida |
| **GET** | `/api/pessoas` | Lista pessoas com status "desaparecido" (aceita os query params `?nome=` e `?local=` para filtros) |
| **GET** | `/api/pessoas/:id` | Retorna os detalhes completos de uma pessoa específica e o seu histórico de avistamentos |
| **PATCH** | `/api/pessoas/:id/encontrado` | Atualiza o status da pessoa para "encontrado" e oculta ela das buscas ativas |
| **DELETE**| `/api/pessoas/:id` | Deleta permanentemente o registro de uma pessoa e todos os seus avistamentos em cascata |
| **POST** | `/api/avistamentos` | Registra a informação visual ("avistamento") no cadastro de uma pessoa desaparecida |
