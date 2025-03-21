export class TXT {

    static readFile(event: Event) {

        let fileContent = ""
        const file = (event.target as HTMLInputElement).files?.[0];

        if (!file) return;

        const reader = new FileReader();
        reader.onload = () => {
            fileContent = reader.result as string;
            console.log(fileContent)
        };
        reader.readAsText(file);
    };

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