WebCarros

🚀 Visão Geral do Projeto

O WebCarros é uma aplicação web desenvolvida para ser uma plataforma de classificados de veículos, permitindo aos usuários visualizar, cadastrar e gerenciar anúncios de carros. O projeto é construído com uma stack moderna de desenvolvimento web, utilizando React e TypeScript para o frontend, e o Firebase como solução backend-as-a-service para autenticação, banco de dados (Firestore) e armazenamento de imagens (Storage).

✨ Tecnologias Utilizadas

Este projeto foi desenvolvido utilizando as seguintes tecnologias:

Categoria
Tecnologia
Descrição
Frontend
React
Biblioteca JavaScript para construção da interface de usuário.
Linguagem
TypeScript
Superset do JavaScript que adiciona tipagem estática, melhorando a manutenibilidade e a qualidade do código.
Build Tool
Vite
Ferramenta de build rápida e moderna para desenvolvimento frontend.
Estilização
Tailwind CSS
Framework CSS utility-first para construção rápida de designs customizados.
Backend/DB
Firebase
Utilizado para Autenticação (getAuth), Banco de Dados (Firestore - getFirestore) e Armazenamento de Imagens (getStorage).
Roteamento
React Router
Gerenciamento de rotas e navegação na aplicação.
Formulários
React Hook Form & Zod
Solução eficiente para gerenciamento de estado de formulários e validação de esquema.
Notificações
React Hot Toast
Biblioteca para exibir notificações de sucesso, erro e informação.
Carrossel
Swiper
Biblioteca moderna para criação de carrosséis e sliders.


⚙️ Funcionalidades Principais

O sistema oferece as seguintes funcionalidades:

•
Autenticação de Usuário: Login e cadastro de novos usuários.

•
Visualização de Anúncios: Página inicial com listagem de veículos.

•
Detalhes do Veículo: Página dedicada com informações completas e carrossel de imagens.

•
Cadastro de Veículos: Formulário para usuários autenticados anunciarem seus carros.

•
Dashboard do Usuário: Área para gerenciar os anúncios cadastrados.

•
Rotas Protegidas: Separação de rotas públicas e privadas (autenticadas).

🛠️ Instalação e Configuração

Para rodar o projeto localmente, siga os passos abaixo:

Pré-requisitos

Certifique-se de ter o Node.js (versão 18+) e o yarn (ou npm/pnpm) instalados em sua máquina.

1. Clonar o Repositório

Bash


git clone https://github.com/samuelgomes0309/WebCarros.git
cd WebCarros


2. Instalar Dependências

Utilize o gerenciador de pacotes de sua preferência:

Bash


# Usando yarn (recomendado pelo lock file )
yarn install

# Ou usando npm
npm install

# Ou usando pnpm
pnpm install


3. Configuração do Firebase

O projeto utiliza o Firebase para todas as operações de backend. Você precisará criar um projeto no Firebase Console e obter suas credenciais.

Crie um arquivo .env na raiz do projeto e adicione as seguintes variáveis de ambiente:

Plain Text


VITE_API_KEY="SUA_API_KEY"
VITE_AUTH_DOMAIN="SEU_AUTH_DOMAIN"
VITE_PROJECT_ID="SEU_PROJECT_ID"
VITE_STORAGE_BUCKET="SEU_STORAGE_BUCKET"
VITE_MESSAGING_SENDER_ID="SEU_MESSAGING_SENDER_ID"
VITE_APP_ID="SEU_APP_ID"



Atenção: Certifique-se de habilitar os serviços de Authentication (e-mail/senha), Firestore Database e Storage no seu projeto Firebase.

4. Rodar a Aplicação

Inicie o servidor de desenvolvimento:

Bash


yarn dev
# ou npm run dev
# ou pnpm dev


A aplicação estará acessível em http://localhost:5173 (ou outra porta indicada pelo Vite ).

