# � CONTEXTO TÉCNICO — WebCarros

Documento de referência técnica do sistema de marketplace de veículos. Descreve a arquitetura, componentes, fluxos, validação, tema e convenções do projeto. Desenvolvido por **Samuel Gomes da Silva**.

---

## 📋 Índice

- [Visão Geral](#-visão-geral)
- [Stack Tecnológica](#-stack-tecnológica)
- [Arquitetura](#-arquitetura)
- [Roteamento e Guards](#-roteamento-e-guards)
- [Autenticação (AuthContext)](#-autenticação-authcontext)
- [Integração Firebase](#-integração-firebase)
- [Modelo de Dados](#-modelo-de-dados)
- [Páginas da Aplicação](#-páginas-da-aplicação)
- [Componentes Reutilizáveis](#-componentes-reutilizáveis)
- [Validação de Formulários](#-validação-de-formulários)
- [Tema e Estilização](#-tema-e-estilização)
- [Variáveis de Ambiente](#-variáveis-de-ambiente)
- [Convenções e Padrões](#-convenções-e-padrões)

---

## 🎯 Visão Geral

O **WebCarros** é uma SPA (Single Page Application) em React que utiliza o Firebase como backend (BaaS). A interface permite cadastro, login, publicação de anúncios de veículos, visualização de carros, contato via WhatsApp e gerenciamento de anúncios — tudo com design responsivo.

### Domínios da aplicação

| Domínio          | Responsabilidade                                                   |
| ---------------- | ------------------------------------------------------------------ |
| **Autenticação** | Cadastro, login, persistência de sessão, logout                    |
| **Home**         | Listagem pública de todos os carros cadastrados                    |
| **Dashboard**    | Painel do usuário para gerenciar seus anúncios (listar e excluir)  |
| **Novo Carro**   | Formulário de criação de anúncio com upload de imagens             |
| **Detalhes**     | Visualização completa de um carro com carrossel e contato WhatsApp |

---

## 🚀 Stack Tecnológica

| Camada       | Tecnologia          | Versão  | Papel                                             |
| ------------ | ------------------- | ------- | ------------------------------------------------- |
| UI           | React               | 19.2.0  | Renderização de componentes e gerenciamento de UI |
| Linguagem    | TypeScript          | 5.9.3   | Tipagem estática e segurança em desenvolvimento   |
| Build        | Vite                | 7.2.2   | Bundler, dev server com HMR ultrarrápido          |
| Estilização  | Tailwind CSS        | 4.1.17  | Classes utilitárias CSS com tema customizado      |
| Ícones       | Lucide React        | 0.553.0 | Ícones SVG como componentes React                 |
| Carrossel    | Swiper              | 12.0.3  | Carrossel de imagens touch-enabled                |
| Formulários  | React Hook Form     | 7.66.0  | Gerenciamento performático de formulários         |
| Validação    | Zod                 | 4.1.12  | Schemas de validação TypeScript-first             |
| Resolvers    | @hookform/resolvers | 5.2.2   | Integração Zod ↔ React Hook Form                 |
| Roteamento   | React Router DOM    | 7.9.5   | Navegação entre páginas (SPA)                     |
| BaaS         | Firebase            | 12.5.0  | Authentication, Firestore e Storage               |
| Notificações | React Hot Toast     | 2.6.0   | Toast notifications para feedback ao usuário      |
| UUID         | uuid                | 13.0.0  | Geração de identificadores únicos para imagens    |
| Lint         | ESLint              | 9.39.1  | Linter para qualidade e padronização do código    |
| Formatação   | Prettier            | 3.6.2   | Formatador automático de código                   |

---

## 🏗️ Arquitetura

### Visão Geral do Fluxo

```
┌─────────────────────────────────────────────────┐
│               Ação do Usuário                   │
└───────────────────┬─────────────────────────────┘
                    │
┌───────────────────▼─────────────────────────────┐
│              React Router                       │
│  Resolve a rota e aplica o Guard (Private)      │
└───────────────────┬─────────────────────────────┘
                    │
┌───────────────────▼─────────────────────────────┐
│              Página (Page)                      │
│  Renderiza layout (Header + Conteúdo)           │
│  Gerencia estado local e chama o Firebase       │
└───────────────────┬─────────────────────────────┘
                    │
┌───────────────────▼─────────────────────────────┐
│     AuthContext / Firebase SDK (services/)      │
│  Context para dados do usuário                  │
│  SDKs para Auth, Firestore e Storage            │
└───────────────────┬─────────────────────────────┘
                    │
┌───────────────────▼─────────────────────────────┐
│           Firebase (Google Cloud)                │
│  Processa a requisição e retorna resposta       │
└─────────────────────────────────────────────────┘
```

### Estrutura de Camadas

| Camada          | Diretório            | Responsabilidade                                          |
| --------------- | -------------------- | --------------------------------------------------------- |
| **Entrada**     | `main.tsx`           | Monta providers (AuthContext, Toaster) e o RouterProvider |
| **Roteamento**  | `App.tsx`, `routes/` | Define rotas e aplica guard de autenticação               |
| **Páginas**     | `pages/`             | Composição de layout, estado local e chamadas ao Firebase |
| **Componentes** | `components/`        | Elementos de UI reutilizáveis (Header, Container, Layout) |
| **Contexto**    | `contexts/`          | Estado global da aplicação (autenticação)                 |
| **Serviços**    | `services/`          | Configuração e exportação do Firebase SDK                 |

### Ponto de Entrada (`main.tsx`)

```typescript
createRoot(document.getElementById("root")!).render(
  <AuthContextProvider>
    <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
    <RouterProvider router={router} />
  </AuthContextProvider>
);
```

- `AuthContextProvider` envolve toda a aplicação, tornando os dados de autenticação acessíveis em qualquer componente
- `Toaster` provê notificações toast globais (top-right, 3s de duração)
- `RouterProvider` inicializa o sistema de rotas do React Router

---

## 🛣️ Roteamento e Guards

### Definição das Rotas (`App.tsx`)

O roteamento é definido com `createBrowserRouter` do React Router DOM v7:

| Rota             | Guard     | Layout | Componente  | Descrição                              |
| ---------------- | --------- | ------ | ----------- | -------------------------------------- |
| `/`              | —         | ✅     | `Home`      | Listagem pública de todos os carros    |
| `/cardetail/:id` | —         | ✅     | `Detail`    | Detalhes completos de um carro         |
| `/dashboard`     | `Private` | ✅     | `Dashboard` | Painel do usuário (meus anúncios)      |
| `/dashboard/new` | `Private` | ✅     | `NewDash`   | Formulário de cadastro de novo carro   |
| `/login`         | —         | ❌     | `Login`     | Telas de login e cadastro (sem header) |

### Guard de Rota

#### `Private`

Protege rotas que exigem autenticação:

```
1. Verifica loadingAuth → exibe spinner de carregamento
2. Verifica signed → se false, redireciona para /login
3. Se autenticado → renderiza children
```

---

## 🔐 Autenticação (AuthContext)

### Visão Geral

O `AuthContext` é o contexto global que gerencia todo o estado de autenticação da aplicação. Ele é provido pelo `AuthContextProvider` e consumido via `useContext(AuthContext)`.

### Interface do Contexto

```typescript
interface AuthContextData {
	user: UserProps | null; // Dados do usuário logado (ou null)
	signed: boolean; // true se o usuário está autenticado
	loadingAuth: boolean; // true enquanto valida a sessão
	handleSignIn: (data: SignInData) => Promise<boolean>;
	handleSignUp: (data: SignUpData) => Promise<boolean>;
	logOut: () => Promise<void>;
}
```

### Interface do Usuário

```typescript
interface UserProps {
	uid: string;
	email: string;
	name: string;
}
```

### Fluxo Completo de Autenticação

```
1. App carrega → AuthContextProvider monta
      │
2. useEffect registra onAuthStateChanged
      │
3. Firebase Auth verifica sessão ativa
      │
4a. Se não há sessão → setUser(null), loadingAuth = false
      │
4b. Se há sessão → seta user com dados do currentUser
      │
5. loadingAuth = false → guard libera a navegação
```

### Métodos

#### `handleSignUp(data: SignUpData): Promise<boolean>`

1. Chama `createUserWithEmailAndPassword(auth, email, password)`
2. Chama `updateProfile(user, { displayName: name })` para salvar o nome
3. Seta `user` no estado com `uid`, `email` e `name`
4. Retorna `true` se tudo OK, `false` em caso de erro
5. Exibe toast de erro em caso de falha

#### `handleSignIn(data: SignInData): Promise<boolean>`

1. Chama `signInWithEmailAndPassword(auth, email, password)`
2. Seta `user` no estado com `uid`, `email` e `displayName`
3. Retorna `true` se OK, `false` em caso de erro

#### `logOut(): Promise<void>`

1. Chama `signOut(auth)` do Firebase
2. Seta `user` como `null`
3. Guard redireciona para `/login`

### Persistência de Sessão

O Firebase Auth gerencia a sessão automaticamente via `onAuthStateChanged`. Não há necessidade de gerenciar tokens manualmente no `localStorage` — o SDK mantém a sessão ativa internamente.

| Ação               | Comportamento                                       |
| ------------------ | --------------------------------------------------- |
| Login bem-sucedido | Firebase persiste sessão automaticamente            |
| Logout             | `signOut(auth)` limpa a sessão                      |
| App recarrega      | `onAuthStateChanged` restaura o usuário autenticado |

---

## 🔥 Integração Firebase

### Configuração (`services/firebase/index.ts`)

```typescript
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };
```

**Serviços utilizados:**

| Serviço         | Instância | Função                                |
| --------------- | --------- | ------------------------------------- |
| Authentication  | `auth`    | Cadastro e login de usuários          |
| Cloud Firestore | `db`      | Banco de dados NoSQL para os carros   |
| Cloud Storage   | `storage` | Armazenamento de imagens dos veículos |

### Estrutura de Armazenamento

```
Firebase Storage:
└── images/
    └── {userId}/
        └── {imageUid}            ← Arquivo de imagem com UUID

Cloud Firestore:
└── collectionCars/
    └── {autoGeneratedId}/
        ├── carName       (string)
        ├── model         (string)
        ├── value         (string)
        ├── year          (string)
        ├── kilometers    (string)
        ├── city          (string)
        ├── description   (string)
        ├── whatsApp      (string)
        ├── owner_id      (string)
        ├── created       (timestamp)
        └── images[]      (array de objetos)
```

### Operações por Página

| Página      | Operação Firebase                          | Quando                             |
| ----------- | ------------------------------------------ | ---------------------------------- |
| Home        | `getDocs` + `orderBy("created", "desc")`   | Ao montar o componente             |
| Dashboard   | `getDocs` + `where("owner_id", "==", uid)` | Ao montar o componente             |
| Dashboard   | `deleteDoc` + `deleteObject` (imagens)     | Ao clicar em excluir carro         |
| Novo Carro  | `uploadBytes` + `getDownloadURL`           | Ao submeter o formulário (imagens) |
| Novo Carro  | `addDoc` na collection `collectionCars`    | Ao submeter o formulário (dados)   |
| Detalhes    | `getDoc` por ID do documento               | Ao montar o componente             |
| AuthContext | `createUserWithEmailAndPassword`           | No cadastro                        |
| AuthContext | `signInWithEmailAndPassword`               | No login                           |
| AuthContext | `onAuthStateChanged`                       | Ao carregar a app (validar sessão) |

---

## 🗄️ Modelo de Dados

### Documento Firestore: `collectionCars`

```
┌──────────────────────────────────────┐
│          collectionCars              │
├──────────────────────────────────────┤
│ id           (auto-generated PK)     │
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

### Interfaces TypeScript

```typescript
interface ItemCarProps {
	id: string;
	carName: string;
	model: string;
	value: string;
	year: string;
	kilometers: string;
	city: string;
	description: string;
	whatsApp: string;
	owner_id: string;
	images: {
		uid: string;
		name: string;
		url: string;
	}[];
}

type FirestoreCar = Omit<ItemCarProps, "id">;
```

### Campos Importantes

| Campo      | Descrição                                                         |
| ---------- | ----------------------------------------------------------------- |
| `owner_id` | UID do Firebase Auth — vincula o carro ao usuário que o cadastrou |
| `created`  | `new Date()` — usado para ordenação (mais recentes primeiro)      |
| `images`   | Array de objetos com `uid`, `name` e `url` pública do Storage     |
| `value`    | String representando o preço (ex: `"210.000"`)                    |
| `whatsApp` | Número com 10-11 dígitos, sem formatação                          |

### Índices Necessários no Firestore

| Índice                  | Campo      | Ordem      | Usado em  |
| ----------------------- | ---------- | ---------- | --------- |
| Ordenação por data      | `created`  | Descending | Home      |
| Filtro por proprietário | `owner_id` | —          | Dashboard |

---

## 📄 Páginas da Aplicação

### Login (`pages/login/`)

Página que alterna entre dois sub-componentes: **SignIn** e **SignUp**.

#### Estrutura

- `index.tsx` — Controla o estado `isLogin` que determina qual formulário exibir
- `signin/index.tsx` — Formulário de login (email + senha)
- `signup/index.tsx` — Formulário de cadastro (nome + email + senha)
- `schema.ts` — Schemas Zod (`signInSchema`, `signUpSchema`)

#### Fluxo do Login

```
1. Usuário preenche email e senha
2. Zod valida os campos (signInSchema)
3. Se válido → handleSignIn(data) via AuthContext
4. Se Firebase retorna sucesso → toast de sucesso → nav("/dashboard")
5. Se Firebase retorna erro → toast de erro
```

#### Fluxo do Cadastro

```
1. Usuário preenche nome, email e senha
2. Zod valida os campos (signUpSchema)
3. Se válido → handleSignUp(data) via AuthContext
4. handleSignUp cria o usuário e atualiza o perfil
5. Se sucesso → toast de sucesso → nav("/dashboard")
6. Se erro → toast de erro
```

> **Nota:** Ao montar tanto o SignIn quanto o SignUp, o método `logOut()` é chamado automaticamente via `useEffect`, garantindo que o usuário não esteja logado ao acessar a tela de login.

---

### Home (`pages/home/`)

Página inicial pública da aplicação. Exibe todos os carros cadastrados na plataforma.

#### Estado Local

| Estado       | Tipo             | Descrição                                |
| ------------ | ---------------- | ---------------------------------------- |
| `carList`    | `ItemCarProps[]` | Lista de todos os carros                 |
| `loading`    | `boolean`        | Loading durante carregamento inicial     |
| `loadImages` | `string[]`       | IDs de imagens já carregadas (lazy load) |

#### Fluxo de Carregamento

```
1. Componente monta → useEffect
2. Chama handleSearchCars()
3. Query: getDocs(collectionCars, orderBy("created", "desc"))
4. Mapeia documentos para ItemCarProps[]
5. Atualiza carList
```

#### Funcionalidades

- Grid responsivo de cards (1 coluna mobile, 2 tablet, 3 desktop)
- Lazy loading de imagens com spinner placeholder
- Campo de busca (UI presente, funcionalidade em desenvolvimento)
- Mensagem "Nenhum carro registrado" com CTA para cadastro ou login

---

### Dashboard (`pages/dashboard/`)

Painel do usuário autenticado. Exibe apenas os carros cadastrados pelo usuário.

#### Estado Local

| Estado       | Tipo             | Descrição                    |
| ------------ | ---------------- | ---------------------------- |
| `carList`    | `ItemCarProps[]` | Lista dos carros do usuário  |
| `loading`    | `boolean`        | Loading durante carregamento |
| `loadImages` | `string[]`       | IDs de imagens já carregadas |

#### Fluxo de Carregamento

```
1. Componente monta → useEffect
2. Chama handleSearchMyCars()
3. Query: getDocs(collectionCars, where("owner_id", "==", user.uid))
4. Mapeia documentos para ItemCarProps[]
5. Atualiza carList
```

#### Fluxo de Exclusão

```
1. Usuário clica no ícone de lixeira (Trash) em um card
2. handleDeleteCar(car) → executa em paralelo:
   a) deleteDoc(docRef) — remove documento do Firestore
   b) deleteObject(...) — remove cada imagem do Storage
3. Toast de sucesso → remove carro do estado local
```

#### Componentes Internos

| Componente         | Arquivo       | Descrição                                       |
| ------------------ | ------------- | ----------------------------------------------- |
| `SidebarDashboard` | `sidebar.tsx` | Barra de navegação: Dashboard, Novo carro, Sair |

---

### Novo Carro (`pages/dashboard/new/`)

Formulário completo para cadastro de novos anúncios de veículos.

#### Estado Local

| Estado         | Tipo              | Descrição                           |
| -------------- | ----------------- | ----------------------------------- |
| `focus`        | `string \| null`  | Campo com foco ativo (para estilos) |
| `pictures`     | `PicturesProps[]` | Imagens selecionadas com preview    |
| `pictureError` | `boolean`         | True se nenhuma imagem foi anexada  |

#### Fluxo de Upload de Imagens

```
1. Usuário seleciona imagem via input type="file"
2. Validações client-side:
   a) Máximo 7 imagens
   b) Formato: apenas image/*
   c) Tamanho: máximo 5MB
3. Gera UUID + preview local (URL.createObjectURL)
4. Adiciona ao estado pictures[]
```

#### Fluxo de Submissão

```
1. Validação Zod (dashSchema) dos campos do formulário
2. Verifica se há pelo menos 1 imagem
3. Upload paralelo de todas as imagens (Promise.all):
   a) uploadBytes → Firebase Storage em images/{userId}/{uuid}
   b) getDownloadURL → obtém URL pública
4. Monta objeto CarProps com dados + imagens + owner_id + created
5. addDoc na collection collectionCars
6. Toast de sucesso → reset do formulário e imagens
```

#### Campos do Formulário

| Campo         | Tipo   | Validação                                |
| ------------- | ------ | ---------------------------------------- |
| `carName`     | string | Obrigatório                              |
| `model`       | string | Obrigatório                              |
| `value`       | string | Obrigatório, não negativo, número válido |
| `year`        | string | Obrigatório                              |
| `kilometers`  | string | Obrigatório                              |
| `city`        | string | Obrigatório                              |
| `description` | string | Obrigatório                              |
| `whatsApp`    | string | Obrigatório, regex `^(\d{10,11})$`       |

#### Componentes Internos

| Componente | Arquivo         | Descrição                                              |
| ---------- | --------------- | ------------------------------------------------------ |
| `Input`    | `inputForm.tsx` | Input genérico com label, foco visual e integração RHF |

---

### Detalhes do Carro (`pages/detail/`)

Página de visualização completa de um carro específico.

#### Estado Local

| Estado          | Tipo             | Descrição                                  |
| --------------- | ---------------- | ------------------------------------------ |
| `car`           | `ItemCarProps`   | Dados do carro                             |
| `loading`       | `boolean`        | Loading durante carregamento               |
| `loadImages`    | `string[]`       | UIDs de imagens já carregadas              |
| `slidesPerView` | `number`         | Quantidade de slides visíveis no carrossel |
| `modalVisible`  | `boolean`        | Controla exibição do modal de imagem       |
| `modalImageUrl` | `string \| null` | URL da imagem exibida no modal             |

#### Fluxo de Carregamento

```
1. Componente monta → useEffect observa param id
2. Chama handleSearchCar()
3. getDoc(collectionCars, id)
4. Se não encontrado → redireciona para /dashboard
5. Configura slidesPerView (1 se 1 imagem, 2.1 se múltiplas)
6. Seta car com os dados do documento
```

#### Funcionalidades

- Carrossel Swiper com navegação, paginação e scrollbar
- Modal de imagem em tela cheia ao clicar em qualquer foto
- Exibição completa: nome, preço, modelo, cidade, ano, descrição, telefone
- Botão "Enviar mensagem WhatsApp" com link `wa.me` e mensagem pré-formatada

#### Componentes Internos

| Componente   | Arquivo          | Descrição                                                |
| ------------ | ---------------- | -------------------------------------------------------- |
| `ImageModal` | `imageModal.tsx` | Modal overlay com imagem em tela cheia e botão de fechar |

---

## 🎨 Componentes Reutilizáveis

### Header (`components/header/`)

- Logo clicável que redireciona para Home (`/`)
- Ícone condicional baseado no estado de autenticação:
  - `LogInIcon` → se não autenticado (redireciona para `/login`)
  - `UserCircle` → se autenticado (redireciona para `/dashboard`)
- Aguarda `loadingAuth` antes de renderizar ícones

### Container (`components/container/`)

- Wrapper de conteúdo com `max-w-7xl`, centralizado e responsivo
- Padding lateral consistente (`px-4`)

### Layout (`components/layout/`)

- Compõe a estrutura: `<Header />` + `<Outlet />`
- Usado em todas as rotas exceto `/login`

---

## ✅ Validação de Formulários

### Estratégia

Todos os formulários utilizam **Zod** + **React Hook Form** com `@hookform/resolvers`:

| Formulário | Schema         | Campos                                                                               |
| ---------- | -------------- | ------------------------------------------------------------------------------------ |
| Sign In    | `signInSchema` | `email`, `password`                                                                  |
| Sign Up    | `signUpSchema` | `name`, `email`, `password`                                                          |
| Novo Carro | `dashSchema`   | `carName`, `model`, `value`, `year`, `kilometers`, `city`, `description`, `whatsApp` |

### Feedback Visual

- Campos com erro: `outline-1 outline-red-500` + mensagem em vermelho
- Campos com foco: `outline outline-blue-400`
- Mensagens em português BR

---

## 🎨 Tema e Estilização

### Tailwind CSS

A estilização é feita com Tailwind CSS v4 (plugin Vite):

```css
/* index.css */
@import "tailwindcss";

body {
	background-color: #e5e7eb; /* gray-200 */
}
```

### Paleta de Cores Utilizada

| Elemento            | Cor                | Uso                           |
| ------------------- | ------------------ | ----------------------------- |
| Fundo da aplicação  | `bg-gray-200`      | Body / fundo geral            |
| Cards e formulários | `bg-white`         | Superfícies elevadas          |
| Sidebar Dashboard   | `bg-red-500`       | Fundo da barra de navegação   |
| Botões primários    | `bg-zinc-900`      | Login, Cadastro, Submit       |
| Botão WhatsApp      | `bg-green-700`     | Contato via WhatsApp          |
| Botão busca         | `bg-red-500`       | Busca na Home                 |
| Erro                | `text-red-500`     | Mensagens de validação        |
| Foco                | `outline-blue-400` | Campos de formulário com foco |

### Padrões de Animação

| Animação                  | Uso                            |
| ------------------------- | ------------------------------ |
| `animate-spin`            | Spinner de carregamento        |
| `animate-bounce`          | Texto "Carregando..."          |
| `animate-pulse`           | Estado de submissão (botões)   |
| `hover:scale-*`           | Hover em botões, cards e links |
| `transition duration-300` | Transições suaves gerais       |

---

## ⚙️ Variáveis de Ambiente

| Variável                   | Obrigatória | Descrição                              |
| -------------------------- | ----------- | -------------------------------------- |
| `VITE_API_KEY`             | ✅          | API Key do Firebase                    |
| `VITE_AUTH_DOMAIN`         | ✅          | Domínio de autenticação                |
| `VITE_PROJECT_ID`          | ✅          | ID do projeto Firebase                 |
| `VITE_STORAGE_BUCKET`      | ✅          | Bucket do Cloud Storage                |
| `VITE_MESSAGING_SENDER_ID` | ✅          | ID do remetente de mensagens           |
| `VITE_APP_ID`              | ✅          | ID da aplicação registrada no Firebase |

> **Nota:** Todas as variáveis usam prefixo `VITE_` para serem expostas no código client-side pelo Vite. Uso no código: `import.meta.env.VITE_API_KEY`.

---

## 📐 Convenções e Padrões

### Nomenclatura

| Contexto            | Padrão      | Exemplo                           |
| ------------------- | ----------- | --------------------------------- |
| Componentes         | PascalCase  | `Header`, `NewDash`, `ImageModal` |
| Funções handler     | camelCase   | `handleSignIn`, `handleDeleteCar` |
| Interfaces          | PascalCase  | `ItemCarProps`, `LoginProps`      |
| Variáveis de estado | camelCase   | `loadingAuth`, `carList`          |
| Schemas Zod         | camelCase   | `signInSchema`, `dashSchema`      |
| Env vars            | UPPER_SNAKE | `VITE_API_KEY`, `VITE_PROJECT_ID` |

### Gerenciamento de Estado

| Tipo     | Solução         | Uso                                    |
| -------- | --------------- | -------------------------------------- |
| Global   | Context API     | Autenticação (`AuthContext`)           |
| Local    | `useState`      | Cada página/componente individualmente |
| Derivado | Cálculos inline | `signed: !!user`                       |

### Tratamento de Erros

- `try-catch` em todas as operações assíncronas
- `console.log(error.message)` para debug no console
- `toast.error(error.message)` para feedback ao usuário
- Redirecionamentos como fallback (ex: carro não encontrado → `/dashboard`)

### Carregamento e UX

- Spinner em tela cheia durante carregamento inicial de dados
- Spinner inline para lazy loading de imagens individuais
- Texto "Carregando..." com `animate-bounce`
- Toasts: `top-right`, duração 3 segundos
- Botões desabilitados durante submissão (`disabled:bg-gray-200`)

---

## 🚀 Fluxo de Usuário Completo

### Usuário Não Autenticado

1. Acessa Home (`/`)
2. Vê listagem de carros públicos
3. Clica em um carro → detalhes + WhatsApp
4. Clica em "Login" no header → tela de autenticação
5. Pode se cadastrar ou fazer login

### Usuário Autenticado

1. Após login → redirecionado para `/dashboard`
2. Vê seus carros cadastrados
3. Pode excluir carros (imagens + doc)
4. Clica em "Novo carro" → formulário de cadastro
5. Faz upload de imagens + preenche formulário
6. Submete → carro salvo no Firestore
7. Volta para dashboard → carro aparece na listagem
8. Clica em um carro → visualiza detalhes
9. Pode fazer logout → volta para Home

---

## 🔧 Melhorias Futuras / TODOs

### Funcionalidades Pendentes

1. **Busca funcional:** Implementar filtro por nome na Home
2. **Edição de anúncios:** Permitir editar carros existentes
3. **Filtros avançados:** Por ano, preço, cidade, km
4. **Paginação:** Carregar carros em lotes (lazy loading)
5. **Favoritos:** Usuários salvarem carros de interesse
6. **Perfil do usuário:** Editar nome, foto, trocar senha
7. **Verificação de email:** Confirmar email após cadastro
8. **Recuperação de senha:** "Esqueci minha senha"
9. **Compartilhamento:** Botões para redes sociais
10. **SEO:** Meta tags, sitemap, dados estruturados

### Melhorias Técnicas

1. **Loading skeletons:** Substituir spinners por skeletons
2. **Infinite scroll:** Na Home em vez de carregar todos
3. **Otimização de imagens:** Compressão e redimensionamento antes do upload
4. **Cache de imagens:** Service Worker para carregamento offline
5. **Testes:** Unitários (Jest) e E2E (Playwright)
6. **Tratamento de erros:** Error boundaries
7. **Acessibilidade:** ARIA labels, navegação por teclado
8. **Internacionalização:** Suporte a múltiplos idiomas
9. **Analytics:** Google Analytics ou similar
10. **Monitoramento:** Sentry para tracking de erros

### Segurança

1. **Firestore Rules:** Validar permissões no backend
2. **Storage Rules:** Impedir uploads maliciosos
3. **Rate limiting:** Prevenir abuso de APIs
4. **Sanitização:** XSS protection em inputs
5. **HTTPS only:** Forçar HTTPS em produção

---

## 📦 Dependências Principais

### Produção

- `react` + `react-dom`: 19.2.0
- `react-router`: 7.9.5 (roteamento)
- `firebase`: 12.5.0 (backend completo)
- `react-hook-form`: 7.66.0 (formulários)
- `zod`: 4.1.12 (validação)
- `react-hot-toast`: 2.6.0 (notificações)
- `swiper`: 12.0.3 (carrossel)
- `lucide-react`: 0.553.0 (ícones)
- `tailwindcss`: 4.1.17 (estilização)
- `uuid`: 13.0.0 (geração de IDs)

### Desenvolvimento

- `typescript`: 5.9.3
- `vite`: 7.2.2
- `eslint` + plugins (linting)
- `prettier` (formatação)

---

## 🏁 Scripts Disponíveis

```bash
npm run dev      # Servidor de desenvolvimento (Vite)
npm run build    # Build de produção (TypeScript + Vite)
npm run lint     # Análise de código (ESLint)
npm run preview  # Preview do build de produção
```

---

## 📝 Notas Adicionais

### Considerações de Performance

- **Bundle size:** Monitorar tamanho do bundle (Firebase é pesado)
- **Code splitting:** Vite já faz automaticamente por rota
- **Lazy loading:** Imagens carregam sob demanda
- **Memoization:** Considerar `useMemo`/`useCallback` em componentes complexos

### Responsividade

- **Mobile-first:** TailwindCSS facilita design responsivo
- **Breakpoints:** sm, md, lg, xl utilizados
- **Grid adaptativo:** 1 coluna (mobile) → 2 (tablet) → 3 (desktop)

### Compatibilidade

- **Navegadores modernos:** Chrome, Firefox, Safari, Edge (últimas 2 versões)
- **React 19:** Requer suporte a features modernas do JS

---
