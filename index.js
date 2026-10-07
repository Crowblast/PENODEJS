import process from 'process';

const args = process.argv.slice(2);
const API_URL = 'https://fakestoreapi.com/products';

async function main() {

    if (args.length === 0) {
        console.error("Por favor, ingrese un comando. Ejemplo: npm run start GET products");
        return;
    }

    // Usando Destructuring y el operador rest
    const [commandRaw, target, ...restArgs] = args;
    const command = commandRaw.toUpperCase();

    if (command === 'GET') {
        if (!target || !target.startsWith('products')) return console.error('Objetivo faltante o inválido, ej. products');

        try {
            // Método replace de string para extraer la ruta específica si está presente
            const endpoint = target === 'products' ? '' : target.replace('products', '');
            const response = await fetch(`${API_URL}${endpoint}`);
            const data = await response.json();
            console.log(data);
        }
        catch (error) {
            console.error('Error obteniendo los datos:', error.message);
        }

    }

    else if (command === 'POST') {
        if (target !== 'products') return console.error('El comando POST espera... "products"');

        // Destructuring del resto del array de argumentos
        const [title, priceStr, category] = restArgs;
        const price = parseFloat(priceStr);

        if (!title || isNaN(price) || !category) {
            return console.error('Argumentos faltantes o inválidos. Uso: POST products <title> <price> <category>');
        }

        const newProduct = { title, price, category };

        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newProduct)
            });
            const data = await response.json();
            // Object spread para combinar los datos devueltos solo como demostración del tip
            const finalProduct = { ...data, _status: 'Creado exitosamente en la API' };
            console.log(finalProduct);
        }
        catch (error) {
            console.error('Error creando el producto:', error.message);
        }
    }

    else if (command === 'DELETE') {
        if (!target || !target.startsWith('products/')) {
            return console.error('El comando DELETE espera... "products/<productId>"');
        }

        // Métodos de string y array para separar el texto del string
        const [, productId] = target.split('/');

        if (!productId) return console.error('Falta el ID del producto en el comando DELETE.');

        try {
            const response = await fetch(`${API_URL}/${productId}`, {
                method: 'DELETE'
            });
            const data = await response.json();
            console.log('Producto eliminado:', data);
        }
        catch (error) {
            console.error('Error eliminando el producto:', error.message);
        }
    }

    else {
        console.error(`Comando desconocido: ${command}`);
    }
}

main();
