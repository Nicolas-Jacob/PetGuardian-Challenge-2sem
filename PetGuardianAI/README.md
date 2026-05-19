# 🐾 PetGuardian AI

Aplicativo mobile desenvolvido em React Native com Expo para acompanhamento preventivo de pets, permitindo cadastro, histórico clínico e interação com um chat inteligente.

---

# 📖 Descrição do Projeto

O PetGuardian AI foi desenvolvido com o objetivo de auxiliar tutores no acompanhamento preventivo da saúde de seus animais de estimação.

O aplicativo oferece uma experiência simples e intuitiva, permitindo registrar informações dos pets, consultar históricos clínicos e utilizar um chat inteligente que fornece recomendações preventivas.

O sistema foi criado visando melhorar a organização dos cuidados dos animais e facilitar o acesso rápido às informações.

---

# 🚀 Funcionalidades do Sistema

O aplicativo possui as seguintes funcionalidades:

### 🔐 Login

- Tela inicial do aplicativo
- Entrada para o sistema

### 🐾 Cadastro de Pet

Permite cadastrar:

- Nome
- Espécie
- Idade

Possui:

- Validação dos campos
- Verificação de dados inválidos
- Preview em tempo real

### 📋 Dashboard

Permite:

- Visualizar informações do pet cadastrado
- Navegar entre as funcionalidades

### 🏥 Histórico Clínico

Permite visualizar:

- Vacinação
- Consultas veterinárias
- Exames preventivos

### 🤖 Chat IA Simulado

Possui respostas automáticas para perguntas relacionadas a:

- Vacinas
- Alimentação
- Hidratação
- Recomendações preventivas

### 💾 Persistência Local

Utilizando AsyncStorage:

- Salvar dados do pet
- Buscar dados salvos
- Remover informações

---

# 🛠 Tecnologias Utilizadas

Tecnologias usadas no desenvolvimento:

- React Native
- Expo
- TypeScript
- Expo Router
- AsyncStorage
- React Hooks
- StyleSheet

---

# 📂 Estrutura do Projeto

```bash
PetGuardianAI/
│
├── src/
│   │
│   ├── app/
│   │   ├── _layout.tsx
│   │   ├── index.tsx
│   │   ├── login.tsx
│   │   ├── home.tsx
│   │   ├── addPet.tsx
│   │   ├── history.tsx
│   │   └── chat.tsx
│   │
│   ├── components/
│   │   ├── CustomButton.tsx
│   │   └── PetCard.tsx
│   │
│   ├── constants/
│   │   └── colors.ts
│   │
│   └── storage/
│       └── storage.ts
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

Download:

https://nodejs.org/

Verificar instalação:

```bash
node -v
npm -v
```

---

### Expo Go

Instalar no celular o app Expo Go:

Android:

https://play.google.com/store/apps/details?id=host.exp.exponent

iOS:

https://apps.apple.com/app/expo-go/id982107779

---

# 💻 Como executar o projeto

## 1 Clonar o repositório

```bash
git clone LINK_DO_REPOSITORIO
```

---

## 2 Entrar na pasta do projeto

```bash
cd PetGuardianAI
```

---

## 3 Instalar dependências

```bash
npm install
```

---

## 4 Iniciar projeto

```bash
npx expo start
```

---

## 5 Executar no celular

Abrir aplicativo Expo Go.

Escanear QR Code exibido no terminal.

---

# 👨‍💻 Integrantes

### Nícolas de Oliveira Jacob

RM: 564205

Turma: 2TDPX

---

### João Victor Vendramente

RM: 563665

Turma: 2TDSPV

---

### Gabriel Ambrósio Saraiva

RM: 566552

Turma: 2TDSPV

---

### Vinicius Romaguera Cardozo

RM: 562308

Turma: 2TDPX

---

### Yuri Fuzinatto Garzoli Barreto

RM: 56140

Turma: 2TDSPX

---