# Vídeo YouTube

[LINK DO VIDEO SERA COLOCADO FUTURAMENTE]

# 🐾 PetGuardian AI

Aplicativo mobile desenvolvido em React Native com Expo para acompanhamento preventivo de pets, com autenticação real, cadastro e histórico clínico sincronizados na nuvem via Firebase.

---

# 📖 Descrição do Projeto

O PetGuardian AI foi desenvolvido para ajudar tutores a organizar o acompanhamento preventivo da saúde de seus animais de estimação.

Cada tutor possui sua própria conta, com dados isolados dos demais usuários. Através do app é possível cadastrar pets, registrar e consultar o histórico clínico de cada um (vacinas, consultas, exames) e tirar dúvidas rápidas sobre cuidados básicos em um chat de orientação.

Todos os dados de pets e histórico clínico são armazenados no Firebase Firestore, sincronizados em tempo real entre sessões, e vinculados à conta autenticada do tutor.

---

# 🚀 Funcionalidades do Sistema

### 🔐 Autenticação

- Cadastro de conta com e-mail e senha ([register.tsx](src/app/register.tsx))
- Login com e-mail e senha ([login.tsx](src/app/login.tsx))
- Sessão persistida entre reaberturas do app (Firebase Auth + AsyncStorage como camada de persistência)
- Logout ([home.tsx](src/app/home.tsx))
- Proteção de rotas: usuários não autenticados são redirecionados automaticamente para o login, e usuários autenticados não acessam as telas de login/cadastro ([_layout.tsx](src/app/_layout.tsx))
- Mensagens de erro do Firebase traduzidas para português ([AuthContext.tsx](src/contexts/AuthContext.tsx))

### 🐾 Cadastro e Gestão de Pets

- Cadastrar um novo pet, com validação dos campos ([addPet.tsx](src/app/addPet.tsx))
- Listar todos os pets do tutor autenticado ([home.tsx](src/app/home.tsx))
- Editar os dados de um pet existente ([editPet/[id].tsx](src/app/editPet/%5Bid%5D.tsx))
- Excluir um pet, com confirmação ([home.tsx](src/app/home.tsx))
- Dados sincronizados com o Firestore (coleção `users/{uid}/pets`), com atualização automática da lista após qualquer alteração

### 🏥 Histórico Clínico

- Selecionar um pet para ver seu histórico ([history/index.tsx](src/app/history/index.tsx))
- Listar os registros clínicos daquele pet ([history/[petId]/index.tsx](src/app/history/%5BpetId%5D/index.tsx))
- Criar um novo registro (vacina, consulta, exame) ([history/[petId]/create.tsx](src/app/history/%5BpetId%5D/create.tsx))
- Editar um registro existente ([history/[petId]/edit/[recordId].tsx](src/app/history/%5BpetId%5D/edit/%5BrecordId%5D.tsx))
- Excluir um registro, com confirmação
- Cada registro fica vinculado ao pet pelo seu ID (coleção `users/{uid}/history`), não mais pelo nome do pet

### 💬 Chat

Tela de chat com respostas automáticas sobre cuidados básicos ([chat.tsx](src/app/chat.tsx)).

**Importante:** hoje esse chat funciona por correspondência de palavras-chave em um conjunto fixo de perguntas frequentes (vacinação, alimentação, hidratação, apetite, vômito, consultas, banho, cansaço) — **não é uma IA/LLM real**, é um mecanismo de regras que devolve uma resposta pré-escrita quando reconhece um termo na pergunta. Perguntas fora desse conjunto recebem uma resposta genérica sugerindo acompanhamento veterinário.

---

# 🛠 Tecnologias Utilizadas

- [React Native](https://reactnative.dev/) `0.86`
- [Expo](https://expo.dev/) SDK `57`
- [TypeScript](https://www.typescriptlang.org/) `6.0`
- [Expo Router](https://docs.expo.dev/router/introduction/) (rotas tipadas, incluindo rotas dinâmicas aninhadas)
- [Firebase](https://firebase.google.com/) — Authentication (e-mail/senha) e Firestore (banco de dados)
- [TanStack Query](https://tanstack.com/query/latest) (`@tanstack/react-query`) — cache, sincronização e mutações contra o Firestore
- [@react-native-async-storage/async-storage](https://github.com/react-native-async-storage/async-storage) — persistência local da sessão do Firebase Auth
- [ESLint](https://eslint.org/) (`eslint-config-expo`)

---

# 📂 Estrutura do Projeto

```bash
challenge12-guardianpet/
│
├── src/
│   │
│   ├── app/
│   │   ├── _layout.tsx
│   │   ├── index.tsx
│   │   ├── login.tsx
│   │   ├── register.tsx
│   │   ├── home.tsx
│   │   ├── addPet.tsx
│   │   ├── editPet/
│   │   │   └── [id].tsx
│   │   ├── history/
│   │   │   ├── index.tsx
│   │   │   └── [petId]/
│   │   │       ├── index.tsx
│   │   │       ├── create.tsx
│   │   │       └── edit/
│   │   │           └── [recordId].tsx
│   │   └── chat.tsx
│   │
│   ├── components/
│   │   ├── BackButton.tsx
│   │   ├── CustomButton.tsx
│   │   ├── EmptyState.tsx
│   │   ├── HistoryRecordCard.tsx
│   │   └── PetCard.tsx
│   │
│   ├── constants/
│   │   ├── colors.ts
│   │   ├── spacing.ts
│   │   └── typography.ts
│   │
│   ├── contexts/
│   │   └── AuthContext.tsx
│   │
│   ├── hooks/
│   │   ├── createResourceHooks.ts
│   │   ├── usePets.ts
│   │   └── useHistory.ts
│   │
│   ├── services/
│   │   ├── firebaseConfig.ts
│   │   ├── firestoreCrud.ts
│   │   ├── petsService.ts
│   │   └── historyService.ts
│   │
│   └── types/
│       ├── index.ts
│       └── firebase-auth.d.ts
│
├── package.json
├── tsconfig.json
├── app.json
└── README.md
```

---

# ⚙️ Instalações Necessárias

Antes de iniciar, é necessário possuir instalado:

### Node.js

Download: [nodejs.org](https://nodejs.org/)

Verificar instalação:

```bash
node -v
npm -v
```

---

### Expo Go

Instale no celular a versão mais recente do aplicativo **Expo Go** — este projeto usa o **Expo SDK 57**, então o Expo Go instalado precisa suportar essa versão do SDK (versões desatualizadas do Expo Go não conseguem abrir o projeto).

Android: [Google Play](https://play.google.com/store/apps/details?id=host.exp.exponent)

iOS: [App Store](https://apps.apple.com/app/expo-go/id982107779)

---

# 💻 Como executar o projeto

## 1 Clonar o repositório

```bash
git clone https://github.com/2TDSPX/challenge12-guardianpet.git
```

---

## 2 Entrar na pasta do projeto

```bash
cd challenge12-guardianpet
```

---

## 3 Instalar dependências

```bash
npm install --legacy-peer-deps
```

---

## 4 Iniciar o projeto

```bash
npx expo start -c
```

---

## 5 Executar no celular

- Abrir o aplicativo Expo Go
- Escanear o QR Code exibido no terminal
- Aguardar carregamento do aplicativo

---

> **Nota:** o projeto já vem com um projeto Firebase configurado em [src/services/firebaseConfig.ts](src/services/firebaseConfig.ts) (Authentication + Firestore). Não é necessário criar um novo projeto no Firebase para rodar a aplicação — basta seguir os passos acima.

---

# 🛠 Solução de problemas

### "You are signed in to Expo Go as X, but not signed in to Expo CLI"

Esse aviso aparece quando o **Expo Go do celular está logado** numa conta Expo, mas o terminal que rodou `npx expo start` **não está logado**. Duas formas de resolver:

- **Deslogar o Expo Go no celular** (Perfil → Sair) — sem estar logado, o app abre o projeto direto pela rede local, sem checar conta nenhuma.
- Ou rodar `npx expo login` no computador entrando com a mesma conta que está logada no celular.

---

# 👨‍💻 Integrantes

### Nícolas de Oliveira Jacob
RM: 564205
Turma: 2TDPX

### João Victor Vendramento
RM: 563665
Turma: 2TDSPV

### Gabriel Ambrósio Saraiva
RM: 566552
Turma: 2TDSPV

### Vinicius Romaguera Cardozo
RM: 562308
Turma: 2TDPX

### Yuri Fuzinatto Garzoli Barreto
RM: 561450
Turma: 2TDSPX