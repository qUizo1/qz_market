const categories = [
    {
        name: "Food",
        products: [
            { name: "Bread", price: 5, image: "assets/items/burger.png", itemCode: "bread" },
            { name: "Donut", price: 6, image: "assets/items/burger.png", itemCode: "donut" },
            { name: "Tacos", price: 7, image: "assets/items/burger.png", itemCode: "tacos" },
            { name: "Sandwich", price: 6, image: "assets/items/burger.png", itemCode: "sandwich" },
            { name: "Kebab", price: 15, image: "assets/items/burger.png", itemCode: "kebab" },
            { name: "Bread", price: 5, image: "assets/items/burger.png", itemCode: "bread" },
            { name: "Donut", price: 6, image: "assets/items/burger.png", itemCode: "donut" },
            { name: "Tacos", price: 7, image: "assets/items/burger.png", itemCode: "tacos" },
            { name: "Sandwich", price: 6, image: "assets/items/burger.png", itemCode: "sandwich" },
            { name: "Kebab", price: 15, image: "assets/items/burger.png", itemCode: "kebab" },
            { name: "Peach", price: 4, image: "assets/items/burger.png", itemCode: "peach" }
        ]
    },
    {
        name: "Drinks",
        products: [
            { name: "Water", price: 3, image: "assets/items/burger.png", itemCode: "water" },
            { name: "Milk", price: 4, image: "assets/items/burger.png", itemCode: "milk" },
            { name: "Coffee", price: 5, image: "assets/items/burger.png", itemCode: "coffee" },
            { name: "Tea", price: 4, image: "assets/items/burger.png", itemCode: "tea" },
            { name: "Orange Juice", price: 6, image: "assets/items/burger.png", itemCode: "orangejuice" },
            { name: "Water", price: 3, image: "assets/items/burger.png", itemCode: "water" },
            { name: "Milk", price: 4, image: "assets/items/burger.png", itemCode: "milk" },
            { name: "Coffee", price: 5, image: "assets/items/burger.png", itemCode: "coffee" },
            { name: "Tea", price: 4, image: "assets/items/burger.png", itemCode: "tea" },
            { name: "Orange Juice", price: 6, image: "assets/items/burger.png", itemCode: "orangejuice" },
            { name: "Vodka", price: 12, image: "assets/items/burger.png", itemCode: "vodka" }
        ]
    }
];

function renderCategories() {
    const categoriesContainer = document.getElementById('categories');
    categories.forEach((category, index) => {
        const categoryDiv = document.createElement('div');
        categoryDiv.className = 'category';
        categoryDiv.textContent = category.name;
        categoryDiv.onclick = () => selectCategory(index);
        categoriesContainer.appendChild(categoryDiv);
    });
}

let cart = [];

function renderProducts(categoryIndex) {
    const productsContainer = document.getElementById('products');
    productsContainer.innerHTML = '';
    const category = categories[categoryIndex];
    category.products.forEach((product, index) => {
        const productDiv = document.createElement('div');
        productDiv.className = 'product';
        productDiv.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <div class="product-name">${product.name}</div>
            <div class="product-price">$${product.price}</div>
            <div class="product-bottom">
                <button onclick="addToCart(${categoryIndex}, ${index})">Add to Cart</button>
                <div class="quantity-selector">
                    <button onclick="changeQuantity(${categoryIndex}, ${index}, -1)">-</button>
                    <span id="qty-${categoryIndex}-${index}">1</span>
                    <button onclick="changeQuantity(${categoryIndex}, ${index}, 1)">+</button>
                </div>
            </div>
        `;
        productsContainer.appendChild(productDiv);
    });
}

let quantities = {};

function changeQuantity(categoryIndex, productIndex, delta) {
    const key = `${categoryIndex}-${productIndex}`;
    if (!quantities[key]) quantities[key] = 1;
    quantities[key] = Math.max(1, quantities[key] + delta);
    document.getElementById(`qty-${categoryIndex}-${productIndex}`).textContent = quantities[key];
}

function addToCart(categoryIndex, productIndex) {
    const product = categories[categoryIndex].products[productIndex];
    const key = `${categoryIndex}-${productIndex}`;
    const qty = quantities[key] || 1;
    const existingItem = cart.find(item => item.itemCode === product.itemCode);
    if (existingItem) {
        existingItem.quantity += qty;
    } else {
        cart.push({ ...product, quantity: qty });
    }
    quantities[key] = 1;
    document.getElementById(`qty-${categoryIndex}-${productIndex}`).textContent = 1;
    renderCart();
}

function removeFromCart(index) {
    if (cart[index].quantity > 1) {
        cart[index].quantity--;
    } else {
        cart.splice(index, 1);
    }
    renderCart();
}

function renderCart() {
    const cartItemsContainer = document.getElementById('cart-items');
    cartItemsContainer.innerHTML = '';
    let total = 0;
    cart.forEach((item, index) => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'cart-item';
        itemDiv.innerHTML = `
            <div class="cart-item-name">${item.name} x${item.quantity}</div>
            <div class="cart-item-price">$${item.price * item.quantity}</div>
            <button onclick="removeFromCart(${index})">-</button>
        `;
        cartItemsContainer.appendChild(itemDiv);
        total += item.price * item.quantity;
    });
    document.getElementById('total').textContent = total;
}

function selectCategory(index) {
    document.querySelectorAll('.category').forEach(cat => cat.classList.remove('active'));
    document.querySelectorAll('.category')[index].classList.add('active');
    renderProducts(index);
}

document.addEventListener('DOMContentLoaded', () => {
    renderCategories();
    if (categories.length > 0) {
        selectCategory(0);
    }

    document.querySelector('.checkout-btn').addEventListener('click', function() {
        if (cart.length > 0) {
            fetch(`https://qz_market/purchase`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ cart: cart })
            });
        }
    });

    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            fetch(`https://qz_market/close`, {
                method: 'POST'
            });
            document.body.style.display = 'none';
        }
    });
});

window.addEventListener('message', function(event) {
    if (event.data.action === 'open') {
        document.body.style.display = 'block';
    } else if (event.data.action === 'purchaseSuccess') {
        cart = [];
        renderCart();
    } else if (event.data.action === 'purchaseFail') {
    }
});