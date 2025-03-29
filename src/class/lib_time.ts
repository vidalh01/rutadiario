
export class TM {
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

    // dias de la semana
    static diasSemana(): string {
        const diasSemana = ["Domingo", "Lunes", "Martes", "Miercoles", "Jueves", "Viernes", "Sabado"];
        const fecha = new Date(); // Fecha actual
        const diaNombre = diasSemana[fecha.getDay()]; // Obtiene el nombre del día
        return diaNombre
    }
}