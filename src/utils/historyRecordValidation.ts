import { HistoryRecord } from "../types";
import { splitReminder } from "./dateTime";
import { resolveReminderInput } from "./reminder";

export interface HistoryRecordFormValues {
    description: string;
    date: string;
    reminderDate: string;
    reminderTime: string;
}

export interface HistoryRecordFormData {
    description: string;
    date: string;
    reminderAt: number | null;
}

export type HistoryRecordValidationResult =
    | { ok: true; data: HistoryRecordFormData }
    | { ok: false; title: string; message: string };

// Novo registro começa com a data de hoje, como antes
export function emptyHistoryRecordFormValues(): HistoryRecordFormValues {
    return {
        description: "",
        date: new Date().toLocaleDateString("pt-BR"),
        reminderDate: "",
        reminderTime: ""
    };
}

export function historyRecordToFormValues(record: HistoryRecord): HistoryRecordFormValues {

    const reminder = record.reminderAt ? splitReminder(record.reminderAt) : null;

    return {
        description: record.description,
        date: record.date,
        reminderDate: reminder?.date ?? "",
        reminderTime: reminder?.time ?? ""
    };
}

// originalReminderAt: lembrete salvo antes da edição; data passada só é erro se mudou
export function validateHistoryRecordForm(
    { description, date, reminderDate, reminderTime }: HistoryRecordFormValues,
    originalReminderAt?: number | null
): HistoryRecordValidationResult {

    if (!description.trim() || !date.trim()) {
        return { ok: false, title: "Erro", message: "Preencha todos os campos" };
    }

    const reminder = resolveReminderInput(reminderDate, reminderTime, originalReminderAt);

    if (!reminder.ok) {
        return { ok: false, title: "Lembrete inválido", message: reminder.message };
    }

    return {
        ok: true,
        data: {
            description: description.trim(),
            date: date.trim(),
            reminderAt: reminder.reminderAt
        }
    };
}
