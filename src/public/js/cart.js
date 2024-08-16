const nPedido = document.getElementById('nPedido')
const btnEmptyCart = document.getElementById('emptyCart')
const btnDeleteProd = document.querySelectorAll('.btnDeleteProd')

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