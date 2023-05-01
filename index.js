import { menuArray } from "./data.js"

const $ = (id) => document.getElementById(id)

const paymentContainer = $("payment-container")
const productFeed = $("product-feed")
const completeOrderBtn = $("complete-order-btn")
const checkoutRequirements = $("checkout-requirement-card")
const payBtn = $("pay-btn")
const paymentForm = $("payment-form")
const closingBlock = $("closing-block")

const ordersArray = []

document.addEventListener("click", handleClick)
renderProducts()

function handleClick(e) {
  const { btn, remove } = e.target.dataset
  if (btn) {
    getOrdersArray(btn)
  } else if (remove) {
    removeFromOrder(remove)
  }
}

function renderProducts() {
  const productHTML = menuArray
    .map(({ imgLink, name, ingredients, price, id }) => `
        <div id="products" class="products">
            <img class="product-img" src="${imgLink}"> 
            <div class="product-description">
                <h2>${name}</h2>
                <p>${ingredients.join(", ")}</p>
                <h3>${"$" + price}</h3>
            </div>
            <div>
            <i class="fa fa-circle-plus fa-2xl icon icon-hover" data-btn ="${id}"></i>
            </div>
        </div>
        <hr class="line">
    `)
    .join("")

  productFeed.innerHTML = productHTML
}

function getOrdersArray(productId) {
  const existingItem = ordersArray.find((order) => order.id === productId)
  const targetItem = menuArray.find((product) => product.id === productId)

  if (existingItem) {
    existingItem.price += targetItem.price
    existingItem.amount++
  } else {
    ordersArray.push({
      name: targetItem.name,
      price: targetItem.price,
      amount: 1,
      id: targetItem.id,
    })
  }
  renderOrders()

  paymentContainer.classList.toggle("hidden", ordersArray.length === 0)
}

function removeFromOrder(productId) {
  const itemIndex = ordersArray.findIndex((order) => order.id === productId)
  ordersArray.splice(itemIndex, 1)
  renderOrders()
  paymentContainer.classList.toggle("hidden", ordersArray.length === 0)
}

function renderOrders() {
  let ordersHtml = ""
  let totalPrice = 0

  for (let { name, amount, id, price } of ordersArray) {
    ordersHtml += `
            <div class="orders-container">
                    <h3 id="order-name">${name}</h3>
                    <h3 class="order-amount">x${amount}</h3>
                    <button class="remove-btn" data-remove=${id}>REMOVE</button>
                    <h2 class="order-price">$${price}</h2>
            </div>
        `
    totalPrice += price * amount
  }

  $("price-total").innerHTML = `$ ${totalPrice}`
  $("your-orders").innerHTML = ordersHtml

  paymentContainer.style.display = ordersArray.length > 0 ? "block" : "none"
}

completeOrderBtn.addEventListener("click", () => {
  checkoutRequirements.style.display = "block"
})

payBtn.addEventListener("click", () => {
  paymentContainer.style.display = "none"
  checkoutRequirements.style.display = "none"
  closingBlock.style.display = "block"
})
