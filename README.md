<p align="center">
  <img src="https://img.shields.io/badge/Status-Em%20Desenvolvimento-yellow?style=for-the-badge" alt="Status" />
  <img src="https://img.shields.io/badge/Licença-MIT-green?style=for-the-badge" alt="Licença" />
</p>

# 🚗 WebCarros — Marketplace de Veículos

Plataforma web de classificados de veículos com **Firebase** como backend e **painel interativo** para gerenciamento de anúncios. Cadastre, visualize e entre em contato com vendedores via WhatsApp. Desenvolvido por **Samuel Gomes da Silva**.

<p align="center">
  <img src="https://img.shields.io/badge/React-19.2.0-61DAFB?style=flat&logo=react&logoColor=white" />
  <img src="https://img.shields.io/badge/TypeScript-5.9.3-3178C6?style=flat&logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/Vite-7.2.2-646CFF?style=flat&logo=vite&logoColor=white" />
  <img src="https://img.shields.io/badge/Firebase-12.5.0-FFCA28?style=flat&logo=firebase&logoColor=black" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-4.1.17-38B2AC?style=flat&logo=tailwind-css&logoColor=white" />
</p>

---

## 📋 Índice

- [Visão Geral](#-visão-geral)
- [Stack Tecnológica](#-stack-tecnológica)
- [Modelo de Dados](#-modelo-de-dados)
- [Funcionalidades](#-funcionalidades)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Pré-requisitos](#-pré-requisitos)
- [Instalação e Configuração](#-instalação-e-configuração)
- [Executando o Projeto](#-executando-o-projeto)
- [Serviços Firebase](#-serviços-firebase)
- [Variáveis de Ambiente](#-variáveis-de-ambiente)
- [Fluxo da Aplicação](#-fluxo-da-aplicação)
- [Documentação Detalhada](#-documentação-detalhada)
- [Licença](#-licença)
- [Autor](#-autor)

---

## 🎯 Visão Geral

O **WebCarros** é uma aplicação web completa de marketplace de veículos, composta por uma SPA React que consome os serviços do Firebase:

| Serviço             | Função                                                             |
| ------------------- | ------------------------------------------------------------------ |
| **Firebase Auth**   | Cadastro e autenticação de usuários com email/senha                |
| **Cloud Firestore** | Banco de dados NoSQL para armazenar anúncios de veículos           |
| **Cloud Storage**   | Armazenamento de imagens dos veículos (até 7 por anúncio, 5MB max) |

### Fluxo de Operação

```
  👤 USUÁRIO (Web)                                🔥 FIREBASE (Backend)
  ┌─────────────┐                                ┌─────────────────────┐
  │  React SPA  │ ──── Firebase SDK (Auth) ───── │  Authentication     │
  │  (Vite)     │ ──── Firebase SDK (Firestore)─ │  Cloud Firestore    │
  │             │ ──── Firebase SDK (Storage) ──  │  Cloud Storage      │
  └─────────────┘                                └─────────────────────┘
```

---

## 🚀 Stack Tecnológica

| Tecnologia          | Versão  | Função                             |
| ------------------- | ------- | ---------------------------------- |
| React               | 19.2.0  | Biblioteca de UI                   |
| TypeScript          | 5.9.3   | Tipagem estática                   |
| Vite                | 7.2.2   | Build tool com HMR                 |
| Tailwind CSS        | 4.1.17  | Estilização utility-first          |
| React Router        | 7.9.5   | Roteamento SPA                     |
| React Hook Form     | 7.66.0  | Formulários performáticos          |
| Zod                 | 4.1.12  | Validação de schemas               |
| @hookform/resolvers | 5.2.2   | Integração Zod ↔ React Hook Form  |
| Firebase            | 12.5.0  | Auth, Firestore e Storage          |
| Swiper              | 12.0.3  | Carrossel de imagens touch-enabled |
| React Hot Toast     | 2.6.0   | Notificações toast                 |
| Lucide React        | 0.553.0 | Ícones SVG                         |
| UUID                | 13.0.0  | Geração de identificadores únicos  |
| ESLint              | 9.39.1  | Linter de código                   |
| Prettier            | 3.6.2   | Formatação automática              |

---

## 🗄️ Modelo de Dados

A aplicação utiliza o Cloud Firestore (NoSQL) com a seguinte estrutura:

```
┌──────────────────────────────────────┐
│       collectionCars (Firestore)     │
├──────────────────────────────────────┤
│ id           auto-generated (PK)     │
│ carName      String                  │
│ model        String                  │
│ value        String                  │
│ year         String                  │
│ kilometers   String                  │
│ city         String                  │
│ description  String                  │
│ whatsApp     String                  │
│ owner_id     String (Firebase UID)   │
│ created      Timestamp               │
│ images[]     Array<ImageObject>      │
└──────────────────────────────────────┘

┌──────────────────────────────────────┐
│          ImageObject                 │
├──────────────────────────────────────┤
│ uid          String (UUID v4)        │
│ name         String                  │
│ url          String (download URL)   │
└──────────────────────────────────────┘
```

### Relacionamentos

| Relação                             | Tipo | Descrição                                 |
| ----------------------------------- | ---- | ----------------------------------------- |
| Firebase Auth User → collectionCars | 1:N  | Cada usuário possui zero ou mais anúncios |

### Campos Importantes

| Campo      | Descrição                                                      |
| ---------- | -------------------------------------------------------------- |
| `owner_id` | UID do Firebase Auth — vincula o carro ao usuário proprietário |
| `created`  | Timestamp usado para ordenação (mais recentes primeiro)        |
| `images`   | Array de objetos com `uid`, `name` e `url` pública do Storage  |
| `whatsApp` | Número com 10-11 dígitos, sem formatação                       |

---

## ⚙️ Funcionalidades

### 🌍 Área Pública

- Listagem de todos os veículos cadastrados com imagens, preço, ano e km
- Página dedicada de detalhes com carrossel de imagens (Swiper) e modal de zoom
- Contato direto com vendedor via WhatsApp (link `wa.me` pré-formatado)
- Campo de busca por nome (em desenvolvimento)

### 🔐 Autenticação

- Cadastro de usuários com email/senha via Firebase Auth
- Login com persistência automática de sessão (`onAuthStateChanged`)
- Guard de rotas protegidas (redirect automático para `/login`)
- Logout com limpeza de sessão

### 🚗 Gerenciamento de Anúncios

- Dashboard pessoal com listagem dos carros do usuário
- Cadastro de novo veículo com formulário validado (Zod + React Hook Form)
- Upload de até 7 imagens por anúncio (máx. 5MB cada)
- Preview local das imagens antes do envio
- Exclusão de anúncio com remoção automática das imagens do Storage

### 🎨 Experiência do Usuário

- Interface responsiva (mobile, tablet, desktop)
- Loading states com spinners animados
- Lazy loading de imagens com placeholder
- Notificações toast (sucesso/erro, 3 segundos, top-right)
- Animações suaves de hover e transição

---

## 📁 Estrutura do Projeto

```
WebCarros/
│
├── 📄 README.md                  ← Você está aqui
├── 📄 CONTEXT.md                 ← Documentação técnica completa
├── 📄 ENDPOINTS.md               ← Documentação dos serviços Firebase
├── 📄 LICENSE                    ← Licença MIT
├── 📄 .env.example               ← Template de variáveis de ambiente
│
├── 📂 public/                    ← Arquivos estáticos
│
└── 📂 src/                       ← Código-fonte
    ├── App.tsx                   ← Rotas da aplicação (createBrowserRouter)
    ├── main.tsx                  ← Entry point (AuthProvider + Toaster + Router)
    ├── index.css                 ← Estilos globais (Tailwind + body background)
    ├── assets/
    │   └── logo.svg              ← Logo do WebCarros
    ├── components/
    │   ├── container/
    │   │   └── index.tsx         ← Container responsivo (max-w-7xl)
    │   ├── header/
    │   │   └── index.tsx         ← Header com logo e ícone de auth
    │   └── layout/
    │       └── index.tsx         ← Layout wrapper (Header + Outlet)
    ├── contexts/
    │   ├── authContext.tsx        ← Interface do contexto de autenticação
    │   └── authContextProvider.tsx ← Provider com Auth Firebase
    ├── pages/
    │   ├── home/                 ← 🏠 Listagem pública de carros
    │   │   └── index.tsx
    │   ├── login/                ← 🔐 Login e cadastro
    │   │   ├── index.tsx
    │   │   ├── schema.ts
    │   │   ├── signin/index.tsx
    │   │   └── signup/index.tsx
    │   ├── dashboard/            ← 📊 Painel do usuário (meus carros)
    │   │   ├── index.tsx
    │   │   ├── components/
    │   │   │   ├── inputForm.tsx
    │   │   │   └── sidebar.tsx
    │   │   └── new/              ← ➕ Cadastro de novo carro
    │   │       ├── index.tsx
    │   │       └── schema.ts
    │   └── detail/               ← 🔍 Detalhes do carro + WhatsApp
    │       ├── index.tsx
    │       └── components/
    │           └── imageModal.tsx
    ├── routes/
    │   └── private.tsx           ← Guard para rotas autenticadas
    └── services/
        └── firebase/
            └── index.ts          ← Configuração Firebase (Auth, Firestore, Storage)
```

---

## 📋 Pré-requisitos

Antes de começar, certifique-se de ter instalado:

| Requisito           | Versão Mínima | Verificar Instalação                |
| ------------------- | :-----------: | ----------------------------------- |
| **Node.js**         |     18.x      | `node --version`                    |
| **npm** ou **yarn** |       —       | `npm --version` / `yarn --version`  |
| **Git**             |       —       | `git --version`                     |
| **Conta Firebase**  |       —       | https://console.firebase.google.com |

---

## 🔧 Instalação e Configuração

### 1. Clone o repositório

```bash
git clone https://github.com/samuelgomes0309/WebCarros.git
cd WebCarros
```

### 2. Instale as dependências

```bash
# Usando npm
npm install

# Usando yarn (recomendado)
yarn install
```

### 3. Configure o Firebase

#### a) Criar Projeto no Firebase

1. Acesse [Firebase Console](https://console.firebase.google.com)
2. Clique em **"Adicionar projeto"**
3. Habilite os seguintes serviços:
   - **Authentication** → Email/Password
   - **Firestore Database** → Modo de produção (ou teste)
   - **Storage** → Modo de produção (ou teste)

#### b) Obter Credenciais

1. No Firebase Console → **Configurações do Projeto** (⚙️)
2. Role até **"Seus apps"** → Selecione o ícone **</>** (Web)
3. Registre o app e copie as credenciais de `firebaseConfig`

#### c) Configurar Variáveis de Ambiente

```bash
cp .env.example .env
```

Edite o arquivo `.env`:

```env
VITE_API_KEY="sua_api_key_real"
VITE_AUTH_DOMAIN="seu-projeto.firebaseapp.com"
VITE_PROJECT_ID="seu-projeto-id"
VITE_STORAGE_BUCKET="seu-projeto.firebasestorage.app"
VITE_MESSAGING_SENDER_ID="123456789012"
VITE_APP_ID="1:123456789012:web:abc123def456"
```

> ⚠️ **IMPORTANTE**: Nunca commite o arquivo `.env` real. Apenas o `.env.example` deve estar no repositório.

#### d) Configurar Regras de Segurança (Recomendado)

**Firestore Rules** — Acesse Firestore Database → Rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /collectionCars/{carId} {
      allow read: if true;
      allow create: if request.auth != null && request.resource.data.owner_id == request.auth.uid;
      allow update, delete: if request.auth != null && resource.data.owner_id == request.auth.uid;
    }
  }
}
```

**Storage Rules** — Acesse Storage → Rules:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /images/{userId}/{imageId} {
      allow read: if true;
      allow write: if request.auth != null
                   && request.auth.uid == userId
                   && request.resource.size < 5 * 1024 * 1024
                   && request.resource.contentType.matches('image/.*');
      allow delete: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

---

## ▶️ Executando o Projeto

```bash
# Modo desenvolvimento
yarn dev
# ou
npm run dev
```

A aplicação estará acessível em `http://localhost:5173` 🚀

### Scripts Disponíveis

| Script              | Comando        | Descrição                                         |
| ------------------- | -------------- | ------------------------------------------------- |
| **Desenvolvimento** | `yarn dev`     | Inicia servidor de desenvolvimento com hot reload |
| **Build**           | `yarn build`   | Compila TypeScript e cria build de produção       |
| **Preview**         | `yarn preview` | Preview do build de produção localmente           |
| **Lint**            | `yarn lint`    | Análise de código com ESLint                      |

---

## 🔥 Serviços Firebase

### Configuração (`src/services/firebase/index.ts`)

```typescript
const app = initializeApp(firebaseConfig);
const auth = getAuth(app); // Authentication
const db = getFirestore(app); // Cloud Firestore
const storage = getStorage(app); // Cloud Storage

export { auth, db, storage };
```

### Operações Principais

| Operação                 | Serviço   | Função Firebase                  | Página      |
| ------------------------ | --------- | -------------------------------- | ----------- |
| Criar usuário            | Auth      | `createUserWithEmailAndPassword` | Login       |
| Login                    | Auth      | `signInWithEmailAndPassword`     | Login       |
| Logout                   | Auth      | `signOut`                        | Dashboard   |
| Persistência de sessão   | Auth      | `onAuthStateChanged`             | AuthContext |
| Listar todos os carros   | Firestore | `getDocs` + `orderBy`            | Home        |
| Listar carros do usuário | Firestore | `getDocs` + `where`              | Dashboard   |
| Buscar carro por ID      | Firestore | `getDoc`                         | Detail      |
| Criar carro              | Firestore | `addDoc`                         | Novo Carro  |
| Deletar carro            | Firestore | `deleteDoc`                      | Dashboard   |
| Upload de imagem         | Storage   | `uploadBytes` + `getDownloadURL` | Novo Carro  |
| Deletar imagem           | Storage   | `deleteObject`                   | Dashboard   |

---

## ⚙️ Variáveis de Ambiente

| Variável                   | Obrigatória | Descrição                    |
| -------------------------- | ----------- | ---------------------------- |
| `VITE_API_KEY`             | ✅          | API Key do Firebase          |
| `VITE_AUTH_DOMAIN`         | ✅          | Domínio de autenticação      |
| `VITE_PROJECT_ID`          | ✅          | ID do projeto Firebase       |
| `VITE_STORAGE_BUCKET`      | ✅          | Bucket do Cloud Storage      |
| `VITE_MESSAGING_SENDER_ID` | ✅          | ID do remetente de mensagens |
| `VITE_APP_ID`              | ✅          | ID da aplicação no Firebase  |

> 💡 **Nota:** Todas as variáveis usam prefixo `VITE_` (obrigatório no Vite). Uso no código: `import.meta.env.VITE_API_KEY`.

---

## 🔄 Fluxo da Aplicação

### Usuário Não Autenticado

```
  Página Inicial (/) ──── Listar carros públicos
        │
  Detalhes (/cardetail/:id) ──── Ver fotos + contato WhatsApp
        │
  Login (/login) ──── Fazer login ou criar conta
```

### Usuário Autenticado

```
  Dashboard (/dashboard) ──── Ver meus anúncios + Excluir
        │
  Novo Carro (/dashboard/new) ──── Cadastrar veículo + Upload imagens
        │
  Logout ──── Encerrar sessão → Redireciona para /login
```

---

## 📚 Documentação Detalhada

| Documento                      | Descrição                                                |
| ------------------------------ | -------------------------------------------------------- |
| [CONTEXT.md](./CONTEXT.md)     | Arquitetura, componentes, fluxos, validação e convenções |
| [ENDPOINTS.md](./ENDPOINTS.md) | Operações Firebase: Auth, Firestore, Storage e regras    |

---

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

## 👤 Autor

Desenvolvido por **[Samuel Gomes](https://github.com/samuelgomes0309)**

---

## 🙏 Agradecimentos

- Firebase pela infraestrutura backend
- Comunidade React e TypeScript
- Tailwind CSS pela facilidade de estilização
- Todos os contribuidores open-source das bibliotecas utilizadas

---
