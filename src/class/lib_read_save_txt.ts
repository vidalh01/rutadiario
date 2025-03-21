export class TXT {

    static cargar(fileInput: any) {
        // Verificar si hay archivos seleccionados antes de proceder
        if (!fileInput?.files?.length) {
            console.log("No se ha seleccionado ningún archivo.");
            return;
        }

        // Función que maneja la lectura del archivo
        const readFile = () => {
            const file = fileInput.files[0]; // Obtener el primer archivo

            const reader = new FileReader(); // Instanciar un nuevo FileReader

            reader.onload = () => {
                let fileContent = reader.result as string; // El contenido del archivo
                console.log(fileContent); // Mostrar el contenido del archivo
            };

            reader.onerror = (error) => {
                console.error("Error al leer el archivo", error);
            };

            // Leer el archivo como texto
            reader.readAsText(file);
        };

        readFile(); // Llamar a la función para leer el archivo
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