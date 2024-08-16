import { fileURLToPath } from 'url'
import { dirname } from 'path'
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)


export default __dirname


export async function getData() {
    const response = await fetch('http://localhost:8080/api/carts')
    console.log(response);
    
}


