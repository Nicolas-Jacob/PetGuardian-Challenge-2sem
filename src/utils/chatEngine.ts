import { HistoryRecord, Pet } from "../types";
import { formatReminder, parseReminderDateTime } from "./dateTime";

export type ChatDataStatus = "loading" | "error" | "ready";

export interface ChatContext {
    pets: Pet[];
    history: HistoryRecord[];
    now: Date;
    dataStatus: ChatDataStatus;
}

const MAX_REMINDERS = 5;
const MAX_SUMMARY_RECORDS = 3;
const FALLBACK_PET_NAME = "seu pet";

// ---------------------------------------------------------------- respostas genéricas
// Motor original da tela de chat, com os mesmos textos e a mesma ordem de prioridade.
// Recebe a pergunta já em minúsculas (com acentos), exatamente como antes.
function getGenericReply(question: string): string {

    if (question.includes("vacina") || question.includes("vacinar")) {
        return "As vacinas ajudam a prevenir doenças graves. Filhotes costumam receber várias doses nos primeiros meses de vida e depois reforços periódicos.";
    } else if (
        question.includes("ração") ||
        question.includes("alimentação") ||
        question.includes("comida")
    ) {
        return "Uma alimentação equilibrada é fundamental. Utilize rações adequadas para idade, porte e necessidades específicas do pet.";
    } else if (question.includes("água") || question.includes("hidrat")) {
        return "Água limpa deve estar disponível o tempo todo. A hidratação ajuda no funcionamento dos órgãos e na saúde geral do pet.";
    } else if (
        question.includes("sem comer") ||
        question.includes("não come") ||
        question.includes("apetite")
    ) {
        return "Perda de apetite pode ocorrer por diversos motivos. Observe outros sintomas e procure orientação veterinária se persistir.";
    } else if (
        question.includes("vomitando") ||
        question.includes("vômito")
    ) {
        return "Vômitos ocasionais podem acontecer, mas episódios repetidos podem indicar problemas digestivos ou outras condições.";
    } else if (
        question.includes("veterinário") ||
        question.includes("consulta")
    ) {
        return "Consultas preventivas ajudam a identificar problemas antes que se tornem graves. A frequência pode variar conforme a idade do pet.";
    } else if (question.includes("banho")) {
        return "A frequência do banho depende da raça, tipo de pelo e rotina do pet. Banhos excessivos podem remover a proteção natural da pele.";
    } else if (
        question.includes("cansado") ||
        question.includes("sono")
    ) {
        return "Cansaço pode ser normal após atividades físicas, mas mudanças frequentes de comportamento merecem atenção.";
    }

    return "Não encontrei uma resposta específica. Recomendamos acompanhamento veterinário periódico.";
}

// ---------------------------------------------------------------- normalização
export function normalizeText(text: string): string {
    return text
        .toLowerCase()
        .normalize("NFD")
        .replace(/[̀-ͯ]/g, "")
        .replace(/\s+/g, " ")
        .trim();
}

function escapeRegExp(text: string): string {
    return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// Palavra/expressão inteira: não casa "rex" dentro de "rexona"
function containsWord(normalized: string, term: string): boolean {
    if (!term) return false;
    return new RegExp(`(^|[^a-z0-9])${escapeRegExp(term)}($|[^a-z0-9])`).test(normalized);
}

function containsAny(normalized: string, terms: string[]): boolean {
    return terms.some((term) => normalized.includes(term));
}

// ---------------------------------------------------------------- intenções com dados
type DataIntent = "pets" | "reminders" | "vaccine" | "summary" | "age";

const INTENT_TRIGGERS: [DataIntent, string[]][] = [
    ["pets", ["meus pets", "quais pets", "quantos pets", "meus animais"]],
    ["reminders", ["proximo lembrete", "proxima vacina", "proxima consulta", "meus lembretes", "o que tenho agendado"]],
    ["vaccine", ["ultima vacina", "quando foi a vacina", "vacinas do", "vacinas da", "vacinou"]],
    ["summary", ["historico", "ultimos registros", "resumo", "o que foi registrado"]],
    ["age", ["quantos anos tem", "idade do", "idade da"]]
];

const VACCINE_TERMS = ["vacin", "antirrabica", "raiva", "gripe canina", "giardia"];
const VACCINE_CODES = ["v4", "v8", "v10", "v12"];

function detectIntent(normalized: string): DataIntent | null {
    for (const [intent, triggers] of INTENT_TRIGGERS) {
        if (containsAny(normalized, triggers)) return intent;
    }
    return null;
}

// Nome mais longo vence quando mais de um casa (ex.: "Rexona" sobre "Rex")
function findMentionedPet(normalized: string, pets: Pet[]): Pet | null {

    let best: Pet | null = null;
    let bestLength = 0;

    for (const pet of pets) {
        const name = normalizeText(pet.name ?? "");

        if (name.length > bestLength && containsWord(normalized, name)) {
            best = pet;
            bestLength = name.length;
        }
    }

    return best;
}

type PetResolution = { pet: Pet } | { reply: string };

function resolvePet(normalized: string, pets: Pet[]): PetResolution {

    if (pets.length === 0) return { reply: noPetsReply() };

    const mentioned = findMentionedPet(normalized, pets);

    if (mentioned) return { pet: mentioned };
    if (pets.length === 1) return { pet: pets[0] };

    return { reply: `De qual pet você quer saber? Seus pets: ${pets.map((pet) => pet.name).join(", ")}.` };
}

function noPetsReply(): string {
    return "Você ainda não tem pets cadastrados. Cadastre o primeiro na tela inicial para eu poder consultar os dados dele.";
}

function formatAge(age: unknown): string {
    if (typeof age !== "number" || !Number.isFinite(age)) return "idade não informada";
    return age === 1 ? "1 ano" : `${age} anos`;
}

function describeDate(date: unknown): string {
    return typeof date === "string" && date.trim() ? date.trim() : "data não informada";
}

// Data digitada (dd/mm/aaaa) quando válida; senão createdAt. Nunca lança com formato estranho.
function recordTime(record: HistoryRecord): number {
    const parsed = typeof record.date === "string" ? parseReminderDateTime(record.date, "00:00") : null;
    if (parsed) return parsed.getTime();
    return createdTime(record);
}

function createdTime(record: HistoryRecord): number {
    return typeof record.createdAt === "number" && Number.isFinite(record.createdAt) ? record.createdAt : 0;
}

function sortMostRecentFirst(records: HistoryRecord[]): HistoryRecord[] {
    return [...records].sort((a, b) =>
        recordTime(b) - recordTime(a) || createdTime(b) - createdTime(a)
    );
}

function isVaccineRecord(record: HistoryRecord): boolean {
    const description = normalizeText(record.description ?? "");
    return containsAny(description, VACCINE_TERMS) || VACCINE_CODES.some((code) => containsWord(description, code));
}

function petsReply(pets: Pet[]): string {

    if (pets.length === 0) return noPetsReply();

    const lines = pets.map((pet) => `• ${pet.name} (${pet.species || "espécie não informada"}, ${formatAge(pet.age)})`);
    const count = pets.length === 1 ? "Você tem 1 pet cadastrado:" : `Você tem ${pets.length} pets cadastrados:`;

    return `${count}\n${lines.join("\n")}`;
}

function remindersReply(normalized: string, context: ChatContext): string {

    const mentioned = findMentionedPet(normalized, context.pets);
    const petNames = new Map(context.pets.map((pet) => [pet.id, pet.name]));
    const now = context.now.getTime();

    const upcoming = context.history
        .filter((record): record is HistoryRecord & { reminderAt: number } =>
            typeof record.reminderAt === "number" && record.reminderAt > now
        )
        .filter((record) => !mentioned || record.petId === mentioned.id)
        .sort((a, b) => a.reminderAt - b.reminderAt);

    if (upcoming.length === 0) {
        return mentioned
            ? `${mentioned.name} não tem lembretes futuros agendados. Você pode criar um ao registrar uma ação no Histórico Clínico.`
            : "Você não tem lembretes futuros agendados. Você pode criar um ao registrar uma ação no Histórico Clínico.";
    }

    const shown = upcoming.slice(0, MAX_REMINDERS);
    const lines = shown.map((record) =>
        `• ${petNames.get(record.petId) ?? FALLBACK_PET_NAME}: ${record.description} em ${formatReminder(record.reminderAt)}`
    );
    const header = mentioned ? `Próximos lembretes de ${mentioned.name}:` : "Seus próximos lembretes:";
    const extra = upcoming.length > shown.length ? `\n(e mais ${upcoming.length - shown.length} depois desses)` : "";

    return `${header}\n${lines.join("\n")}${extra}`;
}

function vaccineReply(pet: Pet, history: HistoryRecord[]): string {

    const vaccines = sortMostRecentFirst(
        history.filter((record) => record.petId === pet.id && isVaccineRecord(record))
    );

    if (vaccines.length === 0) {
        return `Não há vacina registrada para ${pet.name}. Você pode registrar uma em Histórico Clínico.`;
    }

    const latest = vaccines[0];

    return `A última vacina registrada de ${pet.name} foi "${latest.description}" (${describeDate(latest.date)}).`;
}

function summaryReply(pet: Pet, history: HistoryRecord[]): string {

    const records = sortMostRecentFirst(history.filter((record) => record.petId === pet.id));

    if (records.length === 0) {
        return `${pet.name} ainda não tem registros no Histórico Clínico.`;
    }

    const shown = records.slice(0, MAX_SUMMARY_RECORDS);
    const lines = shown.map((record) => `• ${record.description} (${describeDate(record.date)})`);
    const header = shown.length === 1
        ? `Último registro de ${pet.name}:`
        : `Últimos ${shown.length} registros de ${pet.name}:`;

    return `${header}\n${lines.join("\n")}`;
}

function ageReply(pet: Pet): string {
    return typeof pet.age === "number" && Number.isFinite(pet.age)
        ? `${pet.name} tem ${formatAge(pet.age)}.`
        : `A idade de ${pet.name} não foi informada no cadastro.`;
}

function dataReply(intent: DataIntent, normalized: string, context: ChatContext): string {

    if (context.dataStatus === "loading") {
        return "Ainda estou carregando seus dados. Tente de novo em instantes.";
    }

    if (context.dataStatus === "error") {
        return "Não foi possível carregar seus dados agora. Verifique sua conexão e tente novamente.";
    }

    if (intent === "pets") return petsReply(context.pets);
    if (intent === "reminders") return remindersReply(normalized, context);

    const resolution = resolvePet(normalized, context.pets);

    if ("reply" in resolution) return resolution.reply;

    if (intent === "vaccine") return vaccineReply(resolution.pet, context.history);
    if (intent === "summary") return summaryReply(resolution.pet, context.history);

    return ageReply(resolution.pet);
}

// ---------------------------------------------------------------- entrada pública
// Função pura: decide a resposta a partir da mensagem e dos dados recebidos.
export function generateChatReply(message: string, context: ChatContext): string {

    const text = typeof message === "string" ? message.trim() : "";
    const normalized = normalizeText(text);
    const intent = detectIntent(normalized);

    if (intent) return dataReply(intent, normalized, context);

    return getGenericReply(text.toLowerCase());
}
