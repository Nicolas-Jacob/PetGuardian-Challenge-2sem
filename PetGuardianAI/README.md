# Vídeo YouTube

https://www.youtube.com/watch?v=vu3WBKNJnTE

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

### 🏠 Tela Inicial

- Entrada do aplicativo
- Acesso às funcionalidades do sistema

### 🐾 Cadastro de Pet

Permite cadastrar:

- Nome
- Espécie
- Idade

Possui:

- Validação dos campos
- Verificação de dados inválidos
- Preview em tempo real
- Cadastro de múltiplos pets

### 📋 Dashboard

Permite:

- Visualizar informações dos pets cadastrados
- Navegar entre funcionalidades
- Exibir múltiplos pets

### 🏥 Histórico Clínico

Permite:

- Criar novas ações clínicas
- Selecionar um pet específico
- Registrar vacinas
- Registrar consultas
- Registrar exames
- Visualizar histórico individual de cada pet

### 🤖 Chat IA Simulado

Possui respostas automáticas sobre:

- Vacinação
- Alimentação
- Hidratação
- Banhos
- Consultas veterinárias
- Vômitos
- Cansaço
- Falta de apetite
- Perguntas frequentes

### 💾 Persistência Local

Utilizando AsyncStorage:

- Salvar múltiplos pets
- Recuperar pets cadastrados
- Salvar históricos clínicos
- Restaurar dados após reiniciar o aplicativo

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

:contentReference[oaicite:0]{index=0}

Verificar instalação:

```bash
node -v
npm -v
```

---

### Expo Go

Instalar no celular o aplicativo Expo Go.

Android:

:contentReference[oaicite:1]{index=1}

iOS:

:contentReference[oaicite:2]{index=2}

---

# 💻 Como executar o projeto

## 1 Clonar o repositório

```bash
git clone https://github.com/2TDSPX/challenge12-guardianpet.git
```

---

## 2 Entrar na pasta do projeto

```bash
cd challenge12-guardianpet/PetGuardianAI
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

# 👨‍💻 Integrantes

### Nícolas de Oliveira Jacob
RM: 564205
Turma: 2TDPX


### João Victor Vendramente
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