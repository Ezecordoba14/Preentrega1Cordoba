
const btnCart = document.querySelectorAll(".btnCart")
const cartSelect = document.querySelectorAll('.cartSelect')
const desableBtn = document.querySelectorAll('.desableBtn')
const btnUse = document.querySelectorAll('.btnUse')
const btnDeleteCart = document.querySelectorAll('.btnDeleteCart')
const btnNewCart = document.getElementById('btnNewCart')


function getCartId() {
    btnUse.forEach((btn) => {
        const getCartId = localStorage.getItem('cartId')


        btn.addEventListener('click', () => {
            const cartID = btn.getAttribute('cart-id')
            localStorage.setItem('cartId', cartID)

            if (!getCartId) {
                Toastify({
                    text: "Pedido seleccionado!",
                    duration: 3000
                }).showToast();
            } else {
                Toastify({
                    text: "Pedido cambiado!",
                    duration: 3000
                }).showToast();
            }
        })
    })
}
getCartId()

async function addCart(productID, getCartId) {
    const quantity = document.getElementById(`quantity${productID}`).value

    try {
        const addProduct = await fetch(`/api/carts/${getCartId}/product/${productID}`, {
            method: 'POST',
            body: JSON.stringify({ quantity }),
            headers: {
                "Content-Type": "application/json",
            }
        })
        if (addProduct.ok) {
            Toastify({
                text: "Producto agregado",
                duration: 3000,
                destination: `http://localhost:8080/api/carts/${getCartId}`,
            }).showToast();
        } else {
            Toastify({
                text: "Producto sin stock",
                duration: 3000,
                style: {
                    background: "linear-gradient(to right, #741032, #e71e1e)",
                }
            }).showToast();
        }

    } catch (error) {
        console.error('Error al agregar el producto  ' + error)
    }
}

async function postCart() {
    await fetch('/api/carts', {
        method: 'POST'
    })
}

async function deleteCart(cartID) {
    await fetch(`/api/carts/${cartID}`, { method: 'DELETE' })
}


if (btnNewCart) {
    btnNewCart.addEventListener('click', () => {
        Swal.fire({
            title: "Está seguro de abrir un nuevo pedido?",
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Si, estoy seguro"
        }).then((result) => {
            if (result.isConfirmed) {
                postCart()
                Swal.fire({
                    title: "Creado!",
                    text: "Su nuevo pedido lo esta esperando!",
                    icon: "success"
                })
                setTimeout(() => {
                    location.reload()
                }, 500);
            }
        });
    })
}

if (btnDeleteCart) {
    btnDeleteCart.forEach((btn) => {
        const cartID = btn.getAttribute('cart-id')
        btn.addEventListener('click', () => {

            Swal.fire({
                title: "Está seguro de eliminar el pedido?",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Si, estoy seguro"
            }).then((result) => {
                if (result.isConfirmed) {
                    deleteCart(cartID)
                    Swal.fire({
                        title: "Eliminado!",
                        text: "Su nuevo pedido ha sido eliminado!",
                        icon: "success"
                    })
                    setTimeout(() => {
                        location.reload()
                    }, 500);
                }
            });
        })

    })
}

if (btnCart) {
    btnCart.forEach((btn) => {
        const productID = btn.getAttribute('productId');
        const getCartId = localStorage.getItem('cartId')
        btn.addEventListener('click', () => {
            addCart(productID, getCartId)
        })
    })
}




