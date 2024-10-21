const socket = io()
const txtName = document.getElementById('nameProduct')
const txtId = document.getElementById('idProduct')
const txtDescript = document.getElementById('descriptProduct')
const txtCode = document.getElementById('codeProduct')
const txtPrice = document.getElementById('priceProduct')
const txtStock = document.getElementById('stockProduct')
const txtCategory = document.getElementById('categoryProduct')
const btnNewProduct = document.getElementById('newProduct')
const productsLogs = document.getElementById('productsLogs')

const cookies = document.cookie.split(';')
let rol = cookies.find((ck) => {
    const ck1 = ck.startsWith('rol')
    if (!ck1) {
        const ck2 = ck.startsWith(' rol')
        return ck2
    }
})
if (rol != undefined) {
    rol = rol.split('=')[1]
}

if (rol && rol != 'admin' || !rol) {
    btnNewProduct.setAttribute("disabled", "")
}



btnNewProduct.addEventListener('click', (e) => {
    e.preventDefault()
    
    
    let product = {
        name: txtName.value,
        description: txtDescript.value,
        code: txtCode.value,
        price: txtPrice.value,
        stock: txtStock.value,
        category: txtCategory.value
    }


    fetch('products',{
        method: 'POST',
        body: JSON.stringify(product),
        headers: {
            "Content-Type": "application/json",
            },
    })
    .then((resp)=>{
        if (resp.ok) {
            Toastify({
                text: "Producto creado",
                duration: 3000,
            }).showToast();
            setTimeout(() => {
                location.reload()
            }, 500);
        }else{
            Toastify({
                text: "No se ha podido crear",
                duration: 3000,
                style: {
                    background: "linear-gradient(to right, #741032, #e71e1e)",
                }
            }).showToast();
        }
    })
    .catch((error) => console.error("Errorrrr:", error))
})



socket.on('productLogs', (data) => {
    let message = ""
    data.forEach(prod => {
        message = message + `
        <h3>producto: ${prod.name}</h3>
        <p>id: ${prod.id}</p>
        <p>precio: ${prod.price}</p>
        <p>categoria: ${prod.category}</p>
        <button type="button" btn-id="${prod.id}" onclick="deleteProd(event)" >Borrar</button>
        `
        productsLogs.innerHTML = message
    });
})


function deleteProd(event) {
            const pId = event.target.getAttribute ("btn-id")


        fetch(`products/${pId}`,{
            method:"DELETE"
        }).then((resp)=>{socket.emit('delete', resp)})
}