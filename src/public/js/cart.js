const nPedido = document.getElementById('nPedido')
const btnEmptyCart = document.getElementById('emptyCart')
const btnDeleteProd = document.querySelectorAll('.btnDeleteProd')
const btnPurchase = document.querySelectorAll('#btnPurchase')
const cartEmptyTrue = document.getElementById('cartEmptyTrue')
const cartEmptyFalse = document.getElementById('cartEmptyFalse')
const noCartDiv = document.getElementById('noCartDiv')
const changeCart = document.getElementById('ChangeCart')

async function deleteProdCart(productID, pedidoID) {
    await fetch(`/api/carts/${pedidoID}/product/${productID}`, { method: 'DELETE' })
}

async function emptyCart(pedidoID) {
    const response = await fetch(`/api/carts/${pedidoID}`, {
        method: 'PUT'
    })

    if (!response.ok) {
        Toastify({
            text: "Carrito ya vacio",
            duration: 3000,
            style: {
                background: "linear-gradient(to right, #741032, #e71e1e)",
            }
        }).showToast();
    } else {
        setTimeout(() => {
            location.reload()
        }, 200);
    }
}



btnDeleteProd.forEach((btn) => {
    const pedidoID = nPedido.getAttribute('pedido-id')
    btn.addEventListener('click', () => {
        const productID = btn.getAttribute('product-id')
        deleteProdCart(productID, pedidoID)
        setTimeout(() => {
            location.reload()
        }, 200);
    })
})

if (btnEmptyCart) {
    btnEmptyCart.addEventListener('click', () => {
        const pedidoID = nPedido.getAttribute('pedido-id')
        emptyCart(pedidoID)
    })
}

const cookies = document.cookie.split(';')
const cookieCart = cookies.find((ck) =>{ 
    return ck.startsWith('cartEmpty') || ck.startsWith(' cartEmpty')
}).split("=")[1]


if (cartEmptyFalse || cartEmptyTrue) {
    if (cookieCart == 'true') {
        cartEmptyFalse.style.display = 'none'
        btnEmptyCart.style.display = 'none'
    } else if (cookieCart == 'false') {
        cartEmptyTrue.style.display = 'none'
    }
}


const cookieNoCart = cookies.find((ck) => {
    return ck.startsWith('noCart') || ck.startsWith(' noCart')
}).split("=")[1]


if (cookieNoCart && cookieNoCart == 'false') {
    if (noCartDiv) {
        noCartDiv.style.display = 'none'
    }
}

if (changeCart) {
   changeCart.addEventListener('click',async (e)=>{
    e.preventDefault()
    await fetch('http://localhost:8080/api/changeCart',{
        method: 'POST'
    })
    window.location.href ="http://localhost:8080/api/carts"
    
   }) 
}