# 🛍️ Vitrine de Produtos

> Projeto fullstack de vitrine de produtos com backend em **Node.js + TypeScript + SQLite** e frontend em **React + Vite**.

---

## 📋 Índice

- [Visão Geral](#-visão-geral)
- [Stack](#-stack)
- [Arquitetura](#-arquitetura)
- [Estrutura de Pastas](#-estrutura-de-pastas)
- [Banco de Dados](#-banco-de-dados)
- [API — Endpoints](#-api--endpoints)
- [Como Rodar](#-como-rodar)

---

## 🌐 Visão Geral

Aplicação de vitrine de produtos com:

- Navegação por **categorias** (Casa, Vestuário, Jardim, Eletrônicos, Mobile)
- **Mega-menu** de Vestuário com sub-grupos Masculino / Feminino / Infantil e peças específicas
- **Slider** de subcategorias com imagens
- **Busca** em tempo real por nome e descrição
- Grid de produtos com imagens, preço, estoque e tipo de disponibilidade

---

## 🛠️ Stack

| Camada     | Tecnologia                          |
|------------|-------------------------------------|
| Backend    | Node.js · TypeScript · Express 5    |
| Banco      | SQLite (`sqlite` + `sqlite3`)       |
| Runtime    | `tsx watch` (hot reload)            |
| Frontend   | React 18 · Vite 5 · TypeScript      |
| Estilo     | CSS-in-JS inline (sem dependências) |

---

## 🏗️ Arquitetura

### Backend — padrão MVC com DAO

```
Request
  └── routes/index.ts          ← valida entrada, instancia Entity
        └── controllers/       ← delega ao DAO, devolve resposta
              └── dao/         ← queries SQL parametrizadas
                    └── Connection.ts  ← abre conexão SQLite
```

**Fluxo de dados:**

```
Route  →  new Entity(data)  →  Controller  →  DAO  →  SQLite
  ↑                                                       ↓
  └───────────────── JSON response ◄─────────────────────┘
```

- **Entity** valida os dados no construtor — se inválido, lança `Error` antes de chegar ao DAO
- **DAO** estende `Connection`, exportado como singleton
- **Connection** armazena `this.db` como `Promise<Database>`, aguardada em cada método

### Frontend — componentes React

```
App.tsx
  ├── Header.tsx        ← navbar dark, mega-menu dropdown, busca
  ├── Slider.tsx        ← carrossel de subcategorias com imagens
  └── ProdutoCard.tsx   ← card com imagem, preço, badge disponibilidade
```

**Proxy Vite:** todas as chamadas `/api/*` são redirecionadas para `http://localhost:3335`, evitando CORS.

---

## 📁 Estrutura de Pastas

```
projeto_vitrine/
│
├── backend/
│   ├── src/
│   │   └── server.ts              # entrada Express, registra middlewares e router
│   ├── routes/
│   │   └── index.ts               # todos os endpoints da API
│   ├── controllers/
│   │   ├── ControllerProduto.ts
│   │   └── ControllerCategoria.ts
│   ├── dao/
│   │   ├── Connection.ts          # classe base com abertura do SQLite
│   │   ├── ProdutoDao.ts
│   │   └── CategoriaDao.ts
│   ├── Entities/
│   │   ├── Produto.ts             # valida nome, valor, quantidade, tipo
│   │   └── Categoria.ts           # valida nome
│   ├── infra/
│   │   └── vitrine.db             # banco SQLite (gitignored)
│   ├── .env                       # PORT e DATABASE_PATH
│   ├── package.json
│   └── tsconfig.json
│
└── frontend/
    ├── src/
    │   ├── App.tsx                # estado global, fetch, handlers
    │   ├── main.tsx               # entry point React
    │   └── components/
    │       ├── Header.tsx         # navbar + mega-menu + busca
    │       ├── Slider.tsx         # carrossel de subcategorias
    │       ├── ProdutoCard.tsx    # card individual de produto
    │       └── FiltroCategoria.tsx
    ├── index.html
    ├── vite.config.ts             # proxy /api → backend
    ├── tsconfig.json
    └── package.json
```

---

## 🗄️ Banco de Dados

### Diagrama de tabelas

```
categorias                     subcategorias
──────────────────             ──────────────────────
id  INT  PK                    id  INT  PK
nome  TEXT                     nome  TEXT
id_categoria  INT → categorias id_categoria INT → categorias
(auto-referência p/ sub-grupos)

produto                        categoria_produto
──────────────────             ──────────────────────
id  INT  PK                    id  INT  PK
nome  TEXT                     id_produto  INT → produto
descricao  TEXT                id_categoria INT → subcategorias
valor  REAL
quantidade  INT
tipo_disponibilidade  INT
imagem_url  TEXT
```

### Hierarquia de categorias

```
Casa          → Sala · Cozinha · Quarto
Vestuário
  ├── Masculino  → Calças · Camisetas · Camisas · Shorts
  ├── Feminino   → Calças · Blusas · Vestidos · Saias
  └── Infantil   → Calças · Camisetas · Vestidos · Conjuntos
Jardim        → Plantas · Ferramentas
Eletrônicos   → Notebooks · Monitores · Periféricos
Mobile        → Smartphones · Tablets · Acessórios
```

---

## 🔌 API — Endpoints

| Método | Rota                           | Descrição                              |
|--------|--------------------------------|----------------------------------------|
| GET    | `/produtos`                    | Lista todos os produtos                |
| GET    | `/produtos/:id`                | Busca produto por ID                   |
| POST   | `/produtos`                    | Cria produto (valida via Entity)       |
| GET    | `/produtos/categoria/:id`      | Produtos de uma subcategoria           |
| GET    | `/busca?q=termo`               | Busca por nome ou descrição            |
| GET    | `/categorias`                  | Lista todas as categorias              |
| GET    | `/subcategorias`               | Lista todas as subcategorias           |
| GET    | `/subcategorias/genero/:catId` | Subcategorias de um sub-grupo          |

---

## 🚀 Como Rodar

### Pré-requisitos

- Node.js 18+
- SQLite3 instalado

### Backend

```bash
cd backend
npm install
npm run dev
# Servidor em http://localhost:3335
```

### Frontend

```bash
cd frontend
npm install
npm run dev
# App em http://localhost:5173
```

### Variáveis de ambiente — `backend/.env`

```env
PORT=3335
DATABASE_PATH=infra/vitrine.db
```

---

<p align="center">Desenvolvido durante as aulas de Node.js · ADA Tech 2026</p>
