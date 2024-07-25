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



btnNewProduct.addEventListener('click', (e) => {
    e.preventDefault()
    
    
    let product = {
        name: txtName.value,
        description: txtDescript.value,
        code: txtCode.value,
        price: txtPrice.value,
        status: true,
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
    .then((resp)=>socket.emit('message', resp))
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