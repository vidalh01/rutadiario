export class TXT {

    static cargar(event: Event): Promise<any> {
        return new Promise((resolve, reject) => {
            const file = (event.target as HTMLInputElement).files?.[0];

            if (file) {
                const reader = new FileReader();

                reader.onload = () => {
                    const fileContent = reader.result as string;
                    resolve(fileContent);
                };

                reader.readAsText(file);
            } else {
                reject("No se ha seleccionado ningún archivo");
            }
        });
    }

    /**
     * 
     * @param xData es una variable array que sera transformada a texto
     */

    static descargar(xData: any[]) {
        // text a text
        let parseTExt = JSON.stringify(xData)

        // fecha
        function fecha(): string {
            const now = new Date();
            const day = String(now.getDate()).padStart(2, '0');
            const month = String(now.getMonth() + 1).padStart(2, '0'); // Los meses empiezan desde 0
            const year = now.getFullYear();

            return `${day}-${month}-${year}`;
        }

        // archivo txt y nombre
        const blob = new Blob([parseTExt], { type: "text/plain" });
        const url = URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = `rutadiario ${fecha()}.txt`;
        a.click();

        URL.revokeObjectURL(url);
    }
}