# PetGuardian AI

## 🎥 Vídeo de apresentação

[LINK DO VAI SER INSERIDO AINDA]

## 📦 Versão publicada

- Firebase App Distribution: [LINK DO FIREBASE APP DISTRIBUTION SERA INSERIDO AINDA]
- Commit de referência: [HASH SERA INSERIDO AINDA]

---

# 📖 Descrição do projeto

**Problema:** tutores de animais de estimação têm dificuldade em acompanhar a saúde preventiva dos pets. Vacinas, consultas e exames ficam espalhados em papéis e na memória, e retornos importantes acabam esquecidos.

**Solução:** um aplicativo mobile em React Native com Expo em que cada tutor tem sua própria conta e registra seus pets e o histórico clínico de cada um. Os dados ficam no Firebase (Authentication e Firestore), o app agenda lembretes por notificação local para retornos, vacinas e consultas, e um Chat de Cuidados responde dúvidas básicas e consulta os dados do próprio usuário.

---

# 🚀 Funcionalidades

### Autenticação

- Cadastro de conta com e-mail e senha ([register.tsx](src/app/register.tsx))
- Login com e-mail e senha ([login.tsx](src/app/login.tsx))
- Sessão persistente entre aberturas do app, usando AsyncStorage como persistência do Firebase Auth ([firebaseConfig.ts](src/services/firebaseConfig.ts))
- Logout pelo botão "Sair" da tela inicial ([home.tsx](src/app/home.tsx))
- Proteção de rotas: sem sessão, o usuário é levado ao login; com sessão, não acessa login e cadastro ([_layout.tsx](src/app/_layout.tsx))
- Mensagens de erro do Firebase traduzidas para português ([AuthContext.tsx](src/contexts/AuthContext.tsx))

### Pets

- Cadastrar pet com nome, espécie e idade ([addPet.tsx](src/app/addPet.tsx))
- Listar os pets do tutor na tela inicial ([home.tsx](src/app/home.tsx))
- Editar os dados de um pet ([editPet/[id].tsx](src/app/editPet/%5Bid%5D.tsx))
- Excluir um pet, com confirmação. A exclusão também apaga o histórico clínico do pet e cancela os lembretes dos registros apagados; se algum registro não puder ser apagado, o pet não é excluído ([usePets.ts](src/hooks/usePets.ts))
- Formulário compartilhado entre cadastro e edição ([PetForm.tsx](src/components/PetForm.tsx))

### Histórico clínico por pet

- Escolher o pet ([history/index.tsx](src/app/history/index.tsx))
- Listar os registros do pet ([history/[petId]/index.tsx](src/app/history/%5BpetId%5D/index.tsx))
- Criar registro (vacina, consulta, exame) com descrição, data e lembrete opcional ([history/[petId]/create.tsx](src/app/history/%5BpetId%5D/create.tsx))
- Editar registro ([history/[petId]/edit/[recordId].tsx](src/app/history/%5BpetId%5D/edit/%5BrecordId%5D.tsx))
- Excluir registro, com confirmação
- Formulário compartilhado entre criação e edição ([HistoryRecordForm.tsx](src/components/HistoryRecordForm.tsx))

### Lembretes por notificação local

- Ao salvar um registro com data e hora de lembrete, o app agenda uma notificação local para esse momento ([useHistory.ts](src/hooks/useHistory.ts), [notificationService.ts](src/services/notificationService.ts))
- A permissão de notificação só é pedida na hora de agendar, nunca na abertura do app
- Ao editar: se o lembrete mudou, o antigo é cancelado e o novo é agendado; se foi removido, é cancelado; se só a descrição mudou, a notificação é reagendada com o texto novo
- Ao excluir o registro, o lembrete é cancelado
- Ao sair da conta, os lembretes agendados são cancelados e os já exibidos são removidos da bandeja ([AuthContext.tsx](src/contexts/AuthContext.tsx))
- Ao entrar, os lembretes futuros do usuário são restaurados a partir do Firestore, no máximo 50 ([reminderSyncService.ts](src/services/reminderSyncService.ts), [useReminderSync.ts](src/hooks/useReminderSync.ts))
- Tocar na notificação abre o histórico do pet com o registro destacado, com o app aberto, em segundo plano ou fechado ([useNotificationNavigation.ts](src/hooks/useNotificationNavigation.ts))

### Chat de Cuidados

Tela de chat ([chat.tsx](src/app/chat.tsx)) com o motor de respostas em [chatEngine.ts](src/utils/chatEngine.ts).

- Responde dúvidas básicas por **regras de palavras-chave** (vacinação, alimentação, hidratação, apetite, vômito, consultas, banho e cansaço), com respostas pré-escritas
- Consulta os **dados reais do usuário** logado ([useChatData.ts](src/hooks/useChatData.ts)): lista de pets, próximos lembretes, última vacina registrada, resumo do histórico e idade de um pet
- Atalhos rápidos: "Meus pets", "Próximo lembrete", "Última vacina" e "Resumo do histórico" ([ChatSuggestions.tsx](src/components/ChatSuggestions.tsx))
- **Não é inteligência artificial:** não usa nenhum modelo de linguagem. Quando a pergunta não corresponde a nenhuma regra, devolve uma resposta padrão sugerindo acompanhamento veterinário

### Tema claro e escuro

- Por padrão o app segue o tema do sistema; o botão no topo da tela inicial alterna manualmente entre claro e escuro ([ThemeContext.tsx](src/contexts/ThemeContext.tsx), [home.tsx](src/app/home.tsx))
- A escolha é salva no aparelho (AsyncStorage) e restaurada ao abrir o app
- Todas as telas usam as paletas de [colors.ts](src/constants/colors.ts)

### Sobre o App

- Mostra a versão do app e o hash do commit Git da versão, lidos em tempo de execução ([about.tsx](src/app/about.tsx))
- O hash é calculado no [app.config.js](app.config.js) (detalhes em "Como gerar o APK")

---

# 🛠 Tecnologias

- [React Native](https://reactnative.dev/) `0.88.0`
- [React](https://react.dev/) `19.3.0`
- [Expo SDK](https://expo.dev/) `58`
- [Expo Router](https://docs.expo.dev/router/introduction/) `58.0.25` (rotas tipadas)
- [expo-notifications](https://docs.expo.dev/versions/latest/sdk/notifications/) `58.1.6` (notificações locais)
- [expo-constants](https://docs.expo.dev/versions/latest/sdk/constants/) `58.0.13` (versão e hash na tela Sobre o App)
- [Firebase JS SDK](https://firebase.google.com/) `12.18.0` (Authentication e Firestore)
- [TanStack Query](https://tanstack.com/query/latest) `5.102.8` (cache e mutações)
- [AsyncStorage](https://github.com/react-native-async-storage/async-storage) `2.2.0` (sessão do Firebase Auth e preferência de tema)
- [TypeScript](https://www.typescriptlang.org/) `6.0.3`
- [ESLint (eslint-config-expo)](https://docs.expo.dev/guides/using-eslint/) `58.0.4`

---

# 🧱 Arquitetura

| Pasta | Responsabilidade |
|---|---|
| `src/app/` | Telas e rotas (Expo Router); só usam hooks e componentes |
| `src/components/` | Componentes visuais reutilizáveis (botões, cards, formulários) |
| `src/hooks/` | Hooks de dados com TanStack Query e hooks de comportamento (tema, sincronização de lembretes, navegação por notificação) |
| `src/services/` | Acesso ao Firebase (Firestore via CRUD genérico) e às notificações (expo-notifications) |
| `src/contexts/` | Estado global de autenticação e de tema |
| `src/utils/` | Funções puras: datas, validação de formulários, lembretes e motor do chat |
| `src/types/` | Tipos de domínio (Pet, HistoryRecord) e declarações de tipos |
| `src/constants/` | Paletas de cores, espaçamento e tipografia |

```
src/
├── app/
│   ├── editPet/
│   │   └── [id].tsx
│   ├── history/
│   │   ├── [petId]/
│   │   │   ├── edit/
│   │   │   │   └── [recordId].tsx
│   │   │   ├── create.tsx
│   │   │   └── index.tsx
│   │   └── index.tsx
│   ├── _layout.tsx
│   ├── about.tsx
│   ├── addPet.tsx
│   ├── chat.tsx
│   ├── home.tsx
│   ├── index.tsx
│   ├── login.tsx
│   └── register.tsx
├── components/
│   ├── BackButton.tsx
│   ├── ChatSuggestions.tsx
│   ├── CustomButton.tsx
│   ├── EmptyState.tsx
│   ├── FormInput.tsx
│   ├── HistoryRecordCard.tsx
│   ├── HistoryRecordForm.tsx
│   ├── PetCard.tsx
│   ├── PetForm.tsx
│   └── ReminderFields.tsx
├── constants/
│   ├── colors.ts
│   ├── spacing.ts
│   └── typography.ts
├── contexts/
│   ├── AuthContext.tsx
│   └── ThemeContext.tsx
├── hooks/
│   ├── createResourceHooks.ts
│   ├── useChatData.ts
│   ├── useHistory.ts
│   ├── useNotificationNavigation.ts
│   ├── usePets.ts
│   ├── useReminderSync.ts
│   └── useThemedStyles.ts
├── services/
│   ├── firebaseConfig.ts
│   ├── firestoreCrud.ts
│   ├── historyService.ts
│   ├── notificationService.ts
│   ├── petsService.ts
│   └── reminderSyncService.ts
├── types/
│   ├── firebase-auth.d.ts
│   └── index.ts
└── utils/
    ├── chatEngine.ts
    ├── dateTime.ts
    ├── historyRecordValidation.ts
    ├── petValidation.ts
    └── reminder.ts
```

---

# 💻 Pré-requisitos e como executar

### Pré-requisitos

- [Node.js](https://nodejs.org/) e npm (`node -v` e `npm -v` para conferir)
- Aplicativo **Expo Go** no celular, compatível com o **Expo SDK 58**, que é o SDK do projeto. Versões do Expo Go para outro SDK não abrem o projeto.
  - Android: [Google Play](https://play.google.com/store/apps/details?id=host.exp.exponent)
  - iOS: [App Store](https://apps.apple.com/app/expo-go/id982107779)

### Passos

```bash
git clone https://github.com/Nicolas-Jacob/PetGuardian-Challenge-2sem.git
cd PetGuardian-Challenge-2sem
npm install --legacy-peer-deps
npx expo start
```

Depois, abra o Expo Go e escaneie o QR Code exibido no terminal.

A flag `--legacy-peer-deps` é necessária: o `package-lock.json` foi gerado com ela, e sem ela o npm tenta adicionar um `react-dom` incompatível com a versão do React do projeto (e o `npm ci` falha).

### Solução de problemas

**"You are signed in to Expo Go as X, but not signed in to Expo CLI"**: o Expo Go do celular está logado numa conta Expo, mas o terminal não. Saia da conta no Expo Go (Perfil → Sair) ou rode `npx expo login` no computador com a mesma conta.

---

# 🔥 Configuração do Firebase

O projeto já vem configurado para um projeto Firebase existente em [firebaseConfig.ts](src/services/firebaseConfig.ts). Para rodar o app com esse projeto, não é preciso criar nada.

O que o app usa:

- **Authentication** com o provedor **E-mail/senha**
- **Firestore** com os dados em `users/{uid}/pets` e `users/{uid}/history`
- **Regras de segurança** em [firestore.rules](firestore.rules): cada usuário só lê e grava dentro de `users/{seu uid}`
- **Índice composto** para a consulta do histórico de um pet ([historyService.ts](src/services/historyService.ts)), que filtra por `petId` e ordena por `createdAt`:
  - coleção: `history`
  - campos: `petId` (crescente) e `createdAt` (decrescente)

  Sem esse índice, a consulta falha: a tela de histórico do pet mostra "Não foi possível carregar o histórico" e a exclusão de pets também falha, porque ela usa a mesma consulta.

### Usando outro projeto Firebase

1. Crie um projeto no [console do Firebase](https://console.firebase.google.com/) e registre um app Web para obter a configuração.
2. Substitua os valores de `firebaseConfig` em [firebaseConfig.ts](src/services/firebaseConfig.ts).
3. Em Authentication, ative o provedor **E-mail/senha**.
4. Crie o banco do **Firestore**.
5. Publique as regras de [firestore.rules](firestore.rules), colando o conteúdo em Firestore → Regras ou com a Firebase CLI (`firebase deploy --only firestore:rules`, usando o [firebase.json](firebase.json) do projeto).
6. Em Firestore → Índices, crie o índice composto descrito acima.

---

# 📲 Como gerar o APK

A configuração de build está em [eas.json](eas.json) e [app.config.js](app.config.js) (pacote Android `com.petguardianai.app`).

1. Instale a EAS CLI (fora do projeto) e entre na sua conta Expo:

   ```bash
   npm install -g eas-cli
   eas login
   ```

2. Na primeira vez, vincule o projeto à conta com `eas init`. Como a configuração é dinâmica (`app.config.js`), o comando pode pedir para adicionar o `projectId` manualmente em `extra.eas`.
3. Faça commit de todas as alterações e gere o APK com o perfil `preview` (distribuição interna, `buildType: "apk"`):

   ```bash
   eas build --platform android --profile preview
   ```

4. Ao final, o EAS mostra o link para baixar o APK.

**versionCode:** o `eas.json` usa `appVersionSource: "local"`, ou seja, a versão vem do `app.config.js`. Aumente `android.versionCode` a cada novo APK enviado para distribuição.

**Hash do commit na tela Sobre o App:** o `app.config.js` define o hash nesta ordem:

1. `EAS_BUILD_GIT_COMMIT_HASH`, variável que o EAS Build define na nuvem com o hash do commit compilado
2. `APP_COMMIT_HASH`, se definida manualmente
3. `git rev-parse --short=7 HEAD`, com o sufixo `-dirty` se houver alterações não commitadas
4. `dev`, se nada disso estiver disponível

Sempre são usados 7 caracteres.

### Distribuição pelo Firebase App Distribution

1. No console do Firebase, registre um app **Android** com o pacote `com.petguardianai.app`, se ainda não existir.
2. Em **App Distribution**, envie o APK gerado pelo EAS.
3. Adicione os testadores (e-mails ou grupos) e distribua a versão.
4. Os testadores recebem um convite por e-mail com as instruções para instalar o APK.

---

# 🔔 Como testar as notificações

1. Entre no app, cadastre um pet e abra **Histórico Clínico** → pet → **Nova Ação Clínica**.
2. Preencha a descrição e, em **Lembrete**, a data de hoje e um horário alguns minutos à frente (o lembrete precisa ser no futuro).
3. Toque em **Salvar** e permita as notificações quando o sistema pedir. O app confirma com "Lembrete agendado para dd/mm/aaaa HH:mm", e o card do registro passa a mostrar "🔔 Lembrete".
4. No horário:
   - com o app aberto, a notificação aparece como banner;
   - com o app em segundo plano ou fechado, ela aparece como notificação do sistema.
5. Tocar na notificação abre o histórico do pet com o registro destacado.

Observações:

- No Android, o horário pode atrasar alguns minutos em aparelhos que adiam alarmes para economizar bateria.
- No Expo Go para Android, o console mostra avisos sobre notificações push (remotas). Eles são esperados: o app usa apenas notificações locais, que funcionam no Expo Go.

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
