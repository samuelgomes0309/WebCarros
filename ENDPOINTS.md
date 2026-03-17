# � ENDPOINTS — WebCarros (Firebase SDK)

Documentação completa de todas as operações com os serviços Firebase utilizadas no sistema de marketplace de veículos.

> **Backend:** Firebase (BaaS) — Authentication, Cloud Firestore, Cloud Storage
> **SDK:** `firebase@12.5.0`
> **Autenticação:** Firebase Auth (gerenciada automaticamente pelo SDK)

---

## 📋 Índice

- [Firebase Authentication](#-firebase-authentication)
  - [Criar Usuário (Sign Up)](#1-criar-usuário-sign-up)
  - [Login (Sign In)](#2-login-sign-in)
  - [Logout (Sign Out)](#3-logout-sign-out)
  - [Observador de Sessão](#4-observador-de-sessão)
  - [Atualizar Perfil](#5-atualizar-perfil)
- [Cloud Firestore](#-cloud-firestore)
  - [Criar Carro](#1-criar-carro)
  - [Listar Todos os Carros (Home)](#2-listar-todos-os-carros-home)
  - [Listar Carros do Usuário (Dashboard)](#3-listar-carros-do-usuário-dashboard)
  - [Buscar Carro por ID (Detalhes)](#4-buscar-carro-por-id-detalhes)
  - [Deletar Carro](#5-deletar-carro)
- [Cloud Storage](#-cloud-storage)
  - [Upload de Imagem](#1-upload-de-imagem)
  - [Deletar Imagem](#2-deletar-imagem)
- [Integrações Externas](#-integrações-externas)
- [Regras de Segurança](#-regras-de-segurança)
- [Tratamento de Erros](#-tratamento-de-erros)

---

## 🔐 Firebase Authentication

---

### 1. Criar Usuário (Sign Up)

Cria uma nova conta de usuário com email e senha.

- **Função:** `createUserWithEmailAndPassword` + `updateProfile`
- **Arquivo:** `src/contexts/authContextProvider.tsx`

#### Parâmetros

```typescript
{
	email: string; // Email do usuário
	password: string; // Senha do usuário
	name: string; // Nome (salvo via updateProfile)
}
```

#### Implementação

```typescript
const response = await createUserWithEmailAndPassword(auth, email, password);
await updateProfile(response.user, { displayName: name });
```

#### Retorno — Sucesso

```typescript
{
	user: {
		uid: string; // ID único do usuário
		email: string; // Email cadastrado
		displayName: string; // Nome definido via updateProfile
	}
}
```

#### Erros

| Código                       | Descrição                           |
| ---------------------------- | ----------------------------------- |
| `auth/email-already-in-use`  | Email já cadastrado no sistema      |
| `auth/invalid-email`         | Formato de email inválido           |
| `auth/operation-not-allowed` | Método de autenticação desabilitado |
| `auth/weak-password`         | Senha muito fraca                   |

---

### 2. Login (Sign In)

Autentica um usuário existente com email e senha.

- **Função:** `signInWithEmailAndPassword`
- **Arquivo:** `src/contexts/authContextProvider.tsx`

#### Parâmetros

```typescript
{
	email: string; // Email do usuário
	password: string; // Senha do usuário
}
```

#### Implementação

```typescript
const response = await signInWithEmailAndPassword(auth, email, password);
setUser({
	uid: response.user.uid,
	email: response.user.email ?? email,
	name: response.user.displayName ?? "",
});
```

#### Retorno — Sucesso

```typescript
{
	user: {
		uid: string;
		email: string;
		displayName: string;
	}
}
```

#### Erros

| Código                | Descrição                     |
| --------------------- | ----------------------------- |
| `auth/user-not-found` | Usuário não existe            |
| `auth/wrong-password` | Senha incorreta               |
| `auth/invalid-email`  | Formato de email inválido     |
| `auth/user-disabled`  | Conta desabilitada pelo admin |

---

### 3. Logout (Sign Out)

Encerra a sessão do usuário autenticado.

- **Função:** `signOut`
- **Arquivo:** `src/contexts/authContextProvider.tsx`

#### Implementação

```typescript
await signOut(auth);
setUser(null);
```

#### Retorno

`void` — Sessão encerrada, estado do usuário limpo.

---

### 4. Observador de Sessão

Listener que monitora mudanças no estado de autenticação (login, logout, refresh de token).

- **Função:** `onAuthStateChanged`
- **Arquivo:** `src/contexts/authContextProvider.tsx`

#### Implementação

```typescript
useEffect(() => {
	const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
		if (currentUser) {
			setUser({
				email: currentUser.email ?? "",
				uid: currentUser.uid,
				name: currentUser.displayName ?? "",
			});
		} else {
			setUser(null);
		}
		setLoadingAuth(false);
	});
	return () => unsubscribe();
}, []);
```

#### Callback

```typescript
currentUser: User | null; // null se não autenticado
```

> **Nota:** Este listener é registrado uma vez no mount do `AuthContextProvider` e mantém a sessão persistida automaticamente pelo Firebase.

---

### 5. Atualizar Perfil

Atualiza informações do perfil do usuário (chamado após o cadastro).

- **Função:** `updateProfile`
- **Arquivo:** `src/contexts/authContextProvider.tsx`

#### Parâmetros

```typescript
{
  displayName?: string;  // Nome de exibição
  photoURL?: string;     // URL da foto de perfil (não utilizado)
}
```

#### Implementação

```typescript
await updateProfile(response.user, { displayName: name });
```

#### Retorno

`void`

---

## 🗄️ Cloud Firestore

### Collection: `collectionCars`

Armazena todos os anúncios de carros da plataforma.

#### Estrutura do Documento

```json
{
	"carName": "BMW 320I",
	"model": "Sport 2.0 Turbo",
	"value": "95000",
	"year": "2017/2018",
	"kilometers": "45000",
	"city": "São Paulo - SP",
	"description": "Carro em excelente estado, revisões em dia...",
	"whatsApp": "11987654321",
	"owner_id": "abc123xyz789",
	"created": "2026-03-10T10:30:00.000Z",
	"images": [
		{
			"uid": "550e8400-e29b-41d4-a716-446655440000",
			"name": "bmw-frente.jpg",
			"url": "https://firebasestorage.googleapis.com/..."
		}
	]
}
```

| Campo         | Tipo      | Obrigatório | Descrição                                |
| ------------- | --------- | ----------- | ---------------------------------------- |
| `carName`     | string    | ✅          | Nome do carro (ex: `"BMW 320I"`)         |
| `model`       | string    | ✅          | Modelo específico                        |
| `value`       | string    | ✅          | Preço do veículo                         |
| `year`        | string    | ✅          | Ano (ex: `"2017/2018"`)                  |
| `kilometers`  | string    | ✅          | Quilometragem                            |
| `city`        | string    | ✅          | Cidade + Estado (ex: `"São Paulo - SP"`) |
| `description` | string    | ✅          | Descrição detalhada do veículo           |
| `whatsApp`    | string    | ✅          | Número de contato (10-11 dígitos)        |
| `owner_id`    | string    | ✅          | UID do Firebase Auth (dono do anúncio)   |
| `created`     | Timestamp | ✅          | Data de criação (`new Date()`)           |
| `images`      | array     | ✅          | Array de objetos `{ uid, name, url }`    |

---

### 1. Criar Carro

Adiciona um novo documento de carro à collection.

- **Função:** `addDoc`
- **Arquivo:** `src/pages/dashboard/new/index.tsx`
- **Autenticação:** ✅ Requerida

#### Implementação

```typescript
const docData: CarProps = {
	owner_id: user?.uid,
	images: uploadedImages,
	created: new Date(),
	...data,
};

const ref = collection(db, "collectionCars");
await addDoc(ref, docData);
```

#### Retorno — Sucesso

```typescript
DocumentReference {
  id: string;  // ID auto-gerado do documento
}
```

> **Nota:** Antes de criar o documento, todas as imagens são uploadeadas em paralelo para o Storage. O array `images` contém as URLs públicas resultantes.

---

### 2. Listar Todos os Carros (Home)

Retorna todos os carros ordenados por data de criação (mais recentes primeiro).

- **Função:** `getDocs` + `query` + `orderBy`
- **Arquivo:** `src/pages/home/index.tsx`
- **Autenticação:** ❌ Não requerida

#### Query

```typescript
const q = query(collection(db, "collectionCars"), orderBy("created", "desc"));
const querySnapshot = await getDocs(q);
```

- **Collection:** `collectionCars`
- **Ordenação:** `created` descendente
- **Filtros:** Nenhum (listagem pública)

#### Retorno — Sucesso

```typescript
ItemCarProps[]  // Array de todos os carros
```

#### Índice Necessário

| Campo     | Ordem      |
| --------- | ---------- |
| `created` | Descending |

---

### 3. Listar Carros do Usuário (Dashboard)

Retorna apenas os carros cadastrados pelo usuário autenticado.

- **Função:** `getDocs` + `query` + `where`
- **Arquivo:** `src/pages/dashboard/index.tsx`
- **Autenticação:** ✅ Requerida

#### Query

```typescript
const q = query(
	collection(db, "collectionCars"),
	where("owner_id", "==", user.uid)
);
const querySnapshot = await getDocs(q);
```

- **Collection:** `collectionCars`
- **Filtro:** `owner_id == userId`

#### Retorno — Sucesso

```typescript
ItemCarProps[]  // Array de carros do usuário
```

#### Índice Necessário

| Campo      | Tipo  |
| ---------- | ----- |
| `owner_id` | Campo |

---

### 4. Buscar Carro por ID (Detalhes)

Retorna um carro específico pelo ID do documento.

- **Função:** `getDoc` + `doc`
- **Arquivo:** `src/pages/detail/index.tsx`
- **Autenticação:** ❌ Não requerida

#### Parâmetros

```typescript
{
	id: string; // ID do documento no Firestore
}
```

#### Implementação

```typescript
const docRef = doc(db, "collectionCars", id);
const response = await getDoc(docRef);

if (!response.exists()) {
	nav("/dashboard");
	return;
}

setCar(response.data() as ItemCarProps);
```

#### Retorno — Sucesso

```typescript
DocumentSnapshot {
  exists(): boolean;
  data(): ItemCarProps;
}
```

#### Erros

| Situação                 | Ação                             |
| ------------------------ | -------------------------------- |
| Documento não encontrado | Redireciona para `/dashboard`    |
| ID não fornecido na URL  | Toast de erro + redirecionamento |

---

### 5. Deletar Carro

Remove um documento de carro do Firestore e todas as imagens associadas do Storage.

- **Função:** `deleteDoc` + `deleteObject` (em paralelo)
- **Arquivo:** `src/pages/dashboard/index.tsx`
- **Autenticação:** ✅ Requerida

#### Implementação

```typescript
const docRef = doc(db, "collectionCars", car.id);
await Promise.all([
	deleteDoc(docRef),
	...car.images.map((img) => {
		return deleteObject(ref(storage, `images/${currentUser}/${img.uid}`));
	}),
]);
```

#### Fluxo

```
1. Remove documento do Firestore (deleteDoc)
2. Remove cada imagem do Storage (deleteObject) — em paralelo
3. Toast de sucesso
4. Remove carro do estado local (setCarList)
```

#### Retorno

`void` — Documento e imagens removidos atomicamente via `Promise.all`.

---

## 📦 Cloud Storage

### Estrutura de Armazenamento

```
/images/
  /{userId}/
    /{imageUid}          ← Arquivo de imagem com UUID v4
```

**Exemplo:**

```
/images/
  /abc123xyz789/
    /550e8400-e29b-41d4-a716-446655440000
    /660f9511-f30c-52e5-b827-557766551111
```

---

### 1. Upload de Imagem

Faz upload de uma imagem para o Storage e retorna a URL pública.

- **Função:** `uploadBytes` + `getDownloadURL`
- **Arquivo:** `src/pages/dashboard/new/index.tsx`
- **Autenticação:** ✅ Requerida

#### Validações (Client-side)

| Validação  | Regra                        | Mensagem de Erro                                     |
| ---------- | ---------------------------- | ---------------------------------------------------- |
| Quantidade | Máximo 7 imagens por anúncio | `"Você atingiu o limite de 7 imagens..."`            |
| Formato    | Apenas `image/*`             | `"Formato inválido. Apenas imagens são permitidas."` |
| Tamanho    | Máximo 5MB                   | `"Imagem muito grande. Máximo permitido: 5MB."`      |

#### Implementação

```typescript
async function handleUpload(image: File) {
	if (!user?.uid) return;
	const currentUser = user.uid;
	const uidImage = v4();
	const storageRef = ref(storage, `images/${currentUser}/${uidImage}`);
	await uploadBytes(storageRef, image);
	const downloadUrl = await getDownloadURL(storageRef);
	return {
		uid: uidImage,
		name: image.name,
		url: downloadUrl,
	};
}
```

#### Retorno — Sucesso

```typescript
{
	uid: string; // UUID v4 da imagem
	name: string; // Nome original do arquivo
	url: string; // URL pública do Firebase Storage
}
```

#### Erros

| Código                 | Descrição                 |
| ---------------------- | ------------------------- |
| `storage/unauthorized` | Sem permissão para upload |
| `storage/canceled`     | Upload cancelado          |
| `storage/unknown`      | Erro desconhecido         |

---

### 2. Deletar Imagem

Remove uma imagem do Storage (chamado junto com a exclusão do carro).

- **Função:** `deleteObject`
- **Arquivo:** `src/pages/dashboard/index.tsx`
- **Autenticação:** ✅ Requerida

#### Implementação

```typescript
await deleteObject(ref(storage, `images/${currentUser}/${img.uid}`));
```

#### Retorno

`void`

#### Erros

| Código                     | Descrição                  |
| -------------------------- | -------------------------- |
| `storage/object-not-found` | Imagem não existe          |
| `storage/unauthorized`     | Sem permissão para deletar |

---

## 🌐 Integrações Externas

### WhatsApp API (Web)

Abre conversa no WhatsApp Web com mensagem pré-formatada.

- **Arquivo:** `src/pages/detail/index.tsx`

#### Implementação

```typescript
function handleSendMsg() {
	const phone = car?.whatsApp?.replace(/\D/g, "");
	const message = `Olá, tenho interesse no ${car?.carName}`;

	if (!phone) {
		toast.error("Telefone inválido.");
		return;
	}

	window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`);
}
```

#### URL Gerada

```
https://wa.me/11987654321?text=Ol%C3%A1%2C%20tenho%20interesse%20no%20BMW%20320I
```

| Parâmetro | Tipo   | Descrição                                    |
| --------- | ------ | -------------------------------------------- |
| `phone`   | string | Número com dígitos apenas (sem + ou espaços) |
| `text`    | string | Mensagem pré-formatada (URL encoded)         |

#### Comportamento

- **Desktop:** Abre WhatsApp Web em nova aba
- **Mobile:** Abre app do WhatsApp (se instalado) ou WhatsApp Web

---

## 🔒 Regras de Segurança

### Firestore Rules (Recomendadas)

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /collectionCars/{carId} {
      allow read: if true;
      allow create: if request.auth != null
                    && request.resource.data.owner_id == request.auth.uid;
      allow update: if request.auth != null
                    && resource.data.owner_id == request.auth.uid;
      allow delete: if request.auth != null
                    && resource.data.owner_id == request.auth.uid;
    }
  }
}
```

### Storage Rules (Recomendadas)

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
      allow delete: if request.auth != null
                    && request.auth.uid == userId;
    }
  }
}
```

---

## 🚨 Tratamento de Erros

### Padrão de Error Handling

Todas as operações seguem este padrão:

```typescript
try {
	const result = await someFirebaseOperation();
	toast.success("Operação realizada com sucesso!");
} catch (error: any) {
	console.log(error.message);
	toast.error(error.message);
}
```

### Erros Comuns

| Código do Erro              | Serviço   | Descrição            | Ação             |
| --------------------------- | --------- | -------------------- | ---------------- |
| `auth/email-already-in-use` | Auth      | Email já cadastrado  | Toast de erro    |
| `auth/wrong-password`       | Auth      | Senha incorreta      | Toast de erro    |
| `auth/user-not-found`       | Auth      | Usuário não existe   | Toast de erro    |
| `permission-denied`         | Firestore | Sem permissão        | Toast de erro    |
| `not-found`                 | Firestore | Documento não existe | Redirecionamento |
| `storage/unauthorized`      | Storage   | Sem permissão        | Toast de erro    |
| `storage/object-not-found`  | Storage   | Imagem não existe    | Toast de erro    |

---

## 📊 Resumo de Operações por Página

| Página      | Serviço   | Operação                 | Método         | Auth |
| ----------- | --------- | ------------------------ | -------------- | ---- |
| Home        | Firestore | Listar todos os carros   | `getDocs`      | ❌   |
| Detail      | Firestore | Buscar carro por ID      | `getDoc`       | ❌   |
| Detail      | WhatsApp  | Abrir conversa           | `window.open`  | ❌   |
| Dashboard   | Firestore | Listar carros do usuário | `getDocs`      | ✅   |
| Dashboard   | Firestore | Deletar carro            | `deleteDoc`    | ✅   |
| Dashboard   | Storage   | Deletar imagens          | `deleteObject` | ✅   |
| Novo Carro  | Storage   | Upload de imagens        | `uploadBytes`  | ✅   |
| Novo Carro  | Firestore | Criar documento          | `addDoc`       | ✅   |
| AuthContext | Auth      | Criar usuário            | `createUser`   | ❌   |
| AuthContext | Auth      | Login                    | `signIn`       | ❌   |
| AuthContext | Auth      | Logout                   | `signOut`      | ✅   |
| AuthContext | Auth      | Observar sessão          | `onAuthState`  | —    |

---
