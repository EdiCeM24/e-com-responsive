$(document).ready(function() {
    // cache jquery selector
    const $menuCartElement = $('.menu-cart');
    const $cartItemsElement = $('.cart-list');
    const $cartElement = $('.cart');
    const $mainElement = $('.main');
    // initialize on empty cart
    let cart = [];

    // function to add product to the cart
    function addToCart(productElement) {
        const $productElement = $(productElement);
        const productId = $productElement.data('product');
        const productName = $productElement.find('.product-title').text();
        const productPrice = parseFloat($productElement.find('.product-price').text().replace('$',''));
        const productImage = $productElement.find('.product-img').attr('src');

        let existingItem = cart.find(item => item.id === productId);

        if(existingItem) {
            existingItem.quantity += 1; // increment quantity if item exists
        } else {
            const newItem = {
                id: productId,
                name: productName,
                price: productPrice,
                image: productImage,
                quantity: 1
            };
            //Add new item to the cart
            cart.push(newItem);
        }
        // update cart count
        updateCartCount();
        // Rerender cart items
        renderCartItems();
    }
    // function to update the cart count displayed in the menu cart
    function updateCartCount() {
        const itemCount = cart.reduce((count, item) => count + item.quantity,0)
        $menuCartElement.find('.cart-count').text(itemCount);
    }

    // Function to render the items on the cart
    function renderCartItems() {
        // clear the cart items container
        $cartItemsElement.empty();

        if(cart.length === 0) {
            // display image of empty when the cart is empty
            $cartItemsElement.html (`
                <div class="cart-empty">
                  <img src="images/empty.svg" alt="">
                  <p>Your cart is empty</p>
                </div>  
            `)
        } else {
            // iterate through the cart and display each item
            $.each(cart, function (index, item) { 
                 const $cartItemElement = $('<div class="cart-item"></div>');
                 $cartItemElement.html(`
                    <img class="cart-item-img" src="${item.image}" alt="${item.name}"/>
                    <div class="cart-item-desc">
                       <div class="cart-item-title">${item.name}</div>
                       <div class="cart-item-quantity">
                         <button class="change-quantity" data-id="${item.id}" data-action="decrement">-</button>
                         ${item.quantity}
                         <button class="change-quantity" data-id="${item.id}" data-action="increment">+</button>
                       </div>
                    </div>
                    <div class="cart-item-price">$${(item.price * item.quantity).toFixed(2)}</div>
                    <button class="cart-item-remove" data-id="${item.id}" data-action="increment"><i class='bx bx-trash'></i></button>
                 `)
                 $cartItemsElement.append($cartItemElement);
            });
        }
        // update the order summary.
        updateOrderSummary();
    }

    // function to update the order summary (subtotal, tax and total)
    function updateOrderSummary() {
        const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity,0)
        const tax = subtotal * 0.10; // we assume the tax 10%.
        const total = subtotal + tax;

        $('#total-price .cart-amount-value').text(`$${subtotal.toFixed(2)}`);
        $('#tax .cart-amount-value').text(`$${tax.toFixed(2)}`);
        $('#final-price .cart-amount-value').text(`$${total.toFixed(2)}`);

    }

    $('.add-to-cart').on('click', function() {
        const productElement = $(this).closest('.product');
        addToCart(productElement);
    });

    // Event Listener for changing the Quantity of the cart item
    $cartItemsElement.on('click', '.change-quantity', function() {
        const itemId = $(this).data('id');
        const action = $(this).data('action');
        const item = cart.find(item => item.id === itemId);

        if(action === 'increment') {
            item.quantity += 1;
        } else if(action === 'decrement' && item.quantity > 1) {
            item.quantity -= 1;
        }

        // update cart count
        updateCartCount();
        // rerender cart items
        renderCartItems();
    });

     // Event listener for removing the cart item
     $cartItemsElement.on('click', '.cart-item-remove', function() {
        const itemId = $(this).data('id');
        cart = cart.filter(item => item.id !== itemId);
        // update cart count
        updateCartCount();
        // rerender cart items
        renderCartItems();
    });

    // Event listener for toggling the cart view
    $menuCartElement.on('click', function() {
        $cartElement.toggleClass('collapsed');
        $mainElement.toggleClass('expanded', $cartElement.hasClass('collapsed'));
    });

    renderCartItems(); //initial render of cart items
   
});









// Additional functionality to cart section.
const dem = document.querySelector('.cart');

dem.addEventListener('click', () => {
    dem.classList.add('fend');
});




// if(item.quantity === 0) {
//     // remove item from cart if quantity is 0
//     cart = cart.filter(item => item.id !== itemId);
//     // update cart count
//     updateCartCount();
// }