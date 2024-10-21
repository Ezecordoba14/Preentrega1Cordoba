
const btnCart = document.querySelectorAll(".btnCart")
const cartSelect = document.querySelectorAll('.cartSelect')
const desableBtn = document.querySelectorAll('.desableBtn')
const btnUse = document.querySelectorAll('.btnUse')
const btnDeleteCart = document.querySelectorAll('.btnDeleteCart')
const btnNewCart = document.getElementById('btnNewCart')
const btnAdmin = document.getElementById('btnAdmin')
const cart = document.getElementById('cart')
const btnDeleteProduct = document.querySelectorAll('.btnDeleteProduct')

const cookies = document.cookie.split(';')
let rol = cookies.find((ck) => {
    return ck.startsWith('rol') || ck.startsWith(' rol')
})
if (rol != undefined) {
    rol = rol.split('=')[1]
}

if (btnAdmin) {
    if (rol && rol != 'admin' || !rol) {
        btnAdmin.style.display = "none"
    }
}

function getCartId() {
    const getCartId = localStorage.getItem('cartId')
    if (getCartId == null) {
        localStorage.setItem('cartId', false)
    }
    btnUse.forEach((btn) => {


        btn.addEventListener('click', async () => {
            const cartID = btn.getAttribute('cart-id');

            localStorage.setItem('cartId', cartID)

            await fetch(`http://localhost:8080/api/carts/${cartID}`, {
                method: 'GET'
            })
            window.location.href = `http://localhost:8080/api/carts/${cartID}`
            if (getCartId === false) {
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
        if (getCartId != 'false') {
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
async function deleteProd(prodID) {
    await fetch(`/api/products/${prodID}`, { method: 'DELETE' })
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
                title: "Está seguro de eliminar el producto para siempre?",
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
                        text: "El producto a sido borrado!",
                        icon: "success"
                    })
                    setTimeout(() => {
                        location.reload()
                    }, 600);
                }
            });
        })

    })
}

if (btnCart) {
    const cookies = document.cookie.split(';')
    let rol = cookies.find((ck) => {
        return ck.startsWith('rol') || ck.startsWith(' rol')
    })
    if (rol != undefined) {
        rol = rol.split('=')[1]
    }


    const getCartId = localStorage.getItem('cartId')



    btnCart.forEach((btn) => {



        if (rol && rol === 'admin') {
            btn.setAttribute("disabled", "")
        }
        if (rol == undefined) {
            btn.addEventListener('click', () => {
                window.location.href = '/login'
            })

        } else {
            const productID = btn.getAttribute('productId');
            const getCartId = localStorage.getItem('cartId')
            btn.addEventListener('click', () => {
                if (getCartId == 'false') {
                    window.location.href = '/api/carts'
                }
                addCart(productID, getCartId)
            })
        }

    })
}

if (btnDeleteProduct) {
    btnDeleteProduct.forEach((btn) => {
        if (rol && rol != 'admin' || !rol) {
            btn.style.display = "none"
        }
        const prodID = btn.getAttribute('prodID')
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
                    deleteProd(prodID)
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

if (cart) {
    cart.addEventListener('click', () => {
        const cookies = document.cookie.split(';')
        let cart = cookies.find((ck) => {
            return ck.startsWith('cartID') || ck.startsWith(' cartID')
        })
        if (cart == undefined) {
            window.location.href = "http://localhost:8080/api/carts"
        } else if (cart) {
            window.location.href = `http://localhost:8080/api/carts/${cart.split('=')[1]}`
        }
        
    })
}
