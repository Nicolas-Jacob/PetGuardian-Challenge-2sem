import { formatReminder, parseReminderDateTime } from "./dateTime";

type ReminderInputResult =
    | { ok: true; reminderAt: number | null }
    | { ok: false; message: string };

// Valida os campos do formulário; data passada só é rejeitada quando o valor mudou
export function resolveReminderInput(
    dateStr: string,
    timeStr: string,
    previousReminderAt?: number | null
): ReminderInputResult {

    const hasDate = dateStr.trim().length > 0;
    const hasTime = timeStr.trim().length > 0;

    if (!hasDate && !hasTime) {
        return { ok: true, reminderAt: null };
    }

    if (!hasDate || !hasTime) {
        return {
            ok: false,
            message: "Preencha a data e a hora do lembrete, ou deixe os dois campos em branco."
        };
    }

    const parsed = parseReminderDateTime(dateStr, timeStr);

    if (!parsed) {
        return {
            ok: false,
            message: "Data ou hora do lembrete inválida. Use o formato dd/mm/aaaa e HH:mm."
        };
    }

    const reminderAt = parsed.getTime();

    if (reminderAt !== previousReminderAt && reminderAt <= Date.now()) {
        return {
            ok: false,
            message: "O lembrete precisa ser em uma data e hora futuras."
        };
    }

    return { ok: true, reminderAt };
}

export function getReminderFeedback(
    successMessage: string,
    result: { reminderRequested: boolean; reminderScheduled: boolean },
    reminderAt: number | null
): { title: string; message: string } {

    if (result.reminderRequested && result.reminderScheduled && reminderAt !== null) {
        return {
            title: "Sucesso",
            message: `${successMessage}\n\nLembrete agendado para ${formatReminder(reminderAt)}`
        };
    }

    if (result.reminderRequested) {
        return {
            title: "Registro salvo",
            message: "Registro salvo, mas não foi possível agendar o lembrete. Verifique se as notificações estão permitidas para o app."
        };
    }

    return { title: "Sucesso", message: successMessage };
}
