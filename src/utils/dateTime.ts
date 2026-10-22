function pad(value: number): string {
    return String(value).padStart(2, "0");
}

export function maskDate(text: string): string {

    const digits = text.replace(/\D/g, "").slice(0, 8);

    if (digits.length <= 2) return digits;
    if (digits.length <= 4) return `${digits.slice(0, 2)}/${digits.slice(2)}`;

    return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
}

export function maskTime(text: string): string {

    const digits = text.replace(/\D/g, "").slice(0, 4);

    if (digits.length <= 2) return digits;

    return `${digits.slice(0, 2)}:${digits.slice(2)}`;
}

export function parseReminderDateTime(dateStr: string, timeStr: string): Date | null {

    const dateMatch = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(dateStr.trim());
    const timeMatch = /^(\d{2}):(\d{2})$/.exec(timeStr.trim());

    if (!dateMatch || !timeMatch) return null;

    const day = Number(dateMatch[1]);
    const month = Number(dateMatch[2]);
    const year = Number(dateMatch[3]);
    const hours = Number(timeMatch[1]);
    const minutes = Number(timeMatch[2]);

    if (hours > 23 || minutes > 59) return null;

    const result = new Date(year, month - 1, day, hours, minutes, 0, 0);

    // Rejeita datas que o Date "corrige" sozinho, como 31/02
    if (
        result.getFullYear() !== year ||
        result.getMonth() !== month - 1 ||
        result.getDate() !== day
    ) {
        return null;
    }

    return result;
}

export function splitReminder(timestamp: number): { date: string; time: string } {

    const value = new Date(timestamp);

    return {
        date: `${pad(value.getDate())}/${pad(value.getMonth() + 1)}/${value.getFullYear()}`,
        time: `${pad(value.getHours())}:${pad(value.getMinutes())}`
    };
}

export function formatReminder(timestamp: number): string {

    const { date, time } = splitReminder(timestamp);

    return `${date} ${time}`;
}
