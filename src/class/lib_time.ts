class TM {
    // hora formateada
    static horaFormateada(): string {
        const now = new Date();
        const formattedTime = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        return formattedTime;
    };

    // fecha formateada
    static fechaFormateada(): string {
        const now = new Date();
        const day = String(now.getDate()).padStart(2, '0');
        const month = String(now.getMonth() + 1).padStart(2, '0'); // Los meses empiezan desde 0
        const year = now.getFullYear();

        return `${day}/${month}/${year}`;
    }
}