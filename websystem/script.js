document.addEventListener("DOMContentLoaded", function() {

    function isUserLoggedIn() {
        return !!localStorage.getItem('loggedInUser');
    }

    function updateLoginIcon() {
        const loginIcon = document.getElementById('loginser');
        if (loginIcon) {
            console.log("Checking user login status...");
            console.log("Is user logged in?", isUserLoggedIn());
            if (isUserLoggedIn()) {
                loginIcon.classList.remove('mdi-account');
                loginIcon.classList.add('mdi-logout-variant');
                loginIcon.onclick = function() {
                    logout();
                };
            } else {
                loginIcon.classList.remove('mdi-logout-variant');
                loginIcon.classList.add('mdi-account');
                loginIcon.onclick = function() {
                    window.location.href = "login.html";
                };
            }
        }
    }

    // Call the updateLoginIcon function after DOM content is loaded
    updateLoginIcon();

    // Function to register a new user
    function register() {
        const username = document.getElementById("usern").value;
        const password = document.getElementById("myInput1").value;
        const confirmPassword = document.getElementById("myInput2").value;

        if (username === "" || password === "" || confirmPassword === "") {
            alert("Fill the field");
            return;
        }

        if (password !== confirmPassword) {
            alert("Passwords do not match");
            return;
        }

        if (localStorage.getItem(username)) {
            alert("Username already exists");
            return;
        }

        const user = {
            username: username,
            password: password
        };

        localStorage.setItem(username, JSON.stringify(user));
        alert("Sign Up Successfully, Proceed to Log In");
        window.location.href = "login.html";
    }

    // Function to log in the user
    function login() {
        const username = document.getElementById("users").value;
        const password = document.getElementById("pass").value;

        if (username === "" || password === "") {
            alert("Fill the field");
            return;
        }

        const storedUser = JSON.parse(localStorage.getItem(username));
        if (!storedUser) {
            alert("Username does not exist");
        } else if (storedUser.password !== password) {
            alert("Wrong password");
        } else {
            localStorage.setItem('loggedInUser', username);
            updateLoginIcon();
            alert("Log in Successfully");
            window.location.href = "Shop Page.html";
        }
    }

    function togglePasswordVisibility() {
        const passwordField1 = document.getElementById("myInput1");
        const passwordField2 = document.getElementById("myInput2");
        if (passwordField1.type === "password") {
            passwordField1.type = "text";
            passwordField2.type = "text";
        } else {
            passwordField1.type = "password";
            passwordField2.type = "password";
        }
    }

    // Attach functions to window object to be accessible in HTML onclick attributes
    window.register = register;
    window.login = login;
    window.isUserLoggedIn = isUserLoggedIn;
    window.updateLoginIcon = updateLoginIcon;
    window.togglePasswordVisibility = togglePasswordVisibility;
    window.logout = logout; // Ensure logout function is also accessible

    let cartCount = 0;
    let cartTotal = 0;
    let cartItems = [];

    function addToCart(price, name, weight) {
        if (!isUserLoggedIn()) {
            alert("You need to log in first to add items to your cart.");
            return;
        }

        cartCount++;
        const totalPrice = price + weight;
        cartTotal += totalPrice;
        cartItems.push({ name, price, weight, totalPrice });
        updateCartCount();
        updateCartTotal();
        updateCartItems();
        saveCart();
    }

    function updateCartCount() {
        const cartCountElement = document.getElementById('cart-count');
        if (cartCountElement) {
            cartCountElement.textContent = cartCount;
        }
    }

    function getStarRating(stars) {
        let starHTML = '';
        for (let i = 0; i < stars; i++) {
            starHTML += '<i class="mdi mdi-star"></i>';
        }
        return starHTML;
    }

    function updateCartTotal() {
        const cartTotalElement = document.getElementById('cart-total');
        if (cartTotalElement) {
            cartTotalElement.textContent = cartTotal.toFixed(2);
        }
    }

    function addToCartFromPopover() {
        const weightSelect = document.getElementById('weight-select');
        const weight = parseFloat(weightSelect.options[weightSelect.selectedIndex].dataset.price);
        const basePrice = parseFloat(document.getElementById('popover-price').dataset.basePrice);
        const name = document.getElementById('popover-title').textContent;
        hidePopover();
        addToCart(basePrice, name, weight);
    }

    function updateCartItems() {
        const cartItemsContainer = document.getElementById('cart-items');
        if (cartItemsContainer) {
            cartItemsContainer.innerHTML = '';
            cartItems.forEach(item => {
                const cartItem = document.createElement('div');
                cartItem.classList.add('cart-item');
                cartItem.innerHTML = `<span>${item.name}</span><span>P${item.totalPrice.toFixed(2)}</span>`;
                cartItemsContainer.appendChild(cartItem);
            });
        }
    }

    function showPopover(element) {
        const popoverOverlay = document.getElementById('popover-overlay');
        const popoverTitle = document.getElementById('popover-title');
        const popoverImg = document.getElementById('popover-img');
        const popoverStars = document.getElementById('popover-stars');
        const popoverDescription = document.getElementById('popover-description');
        const popoverPrice = document.getElementById('popover-price');
        const weightSelect = document.getElementById('weight-select');

        popoverTitle.textContent = element.getAttribute('data-name');
        popoverImg.src = element.getAttribute('data-img');
        popoverStars.innerHTML = getStarRating(element.getAttribute('data-stars'));
        popoverDescription.textContent = element.querySelector('.des h5').textContent;
        popoverPrice.textContent = element.querySelector('.des h2').textContent;
        popoverPrice.dataset.basePrice = parseFloat(element.getAttribute('data-price'));
        weightSelect.value = "5";
        popoverOverlay.style.display = 'block';
    }

    function updatePrice() {
        const weightSelect = document.getElementById('weight-select');
        const price = parseFloat(weightSelect.options[weightSelect.selectedIndex].dataset.price);
        const basePrice = parseFloat(document.getElementById('popover-price').dataset.basePrice);
        document.getElementById('popover-price').textContent = "P" + (basePrice + price).toFixed(2);
    }

    function hidePopover() {
        const popoverOverlay = document.getElementById('popover-overlay');
        popoverOverlay.style.display = 'none';
    }

    function checkout() {
        if(cartItems.length === 0 || cartCount === 0 || cartTotal === 0){
            alert('You don\'t have any items in the cart to checkout');
        } else {
            alert('All the items are already delivered');
            clearCart();
        }
    }

    document.querySelectorAll('.pro').forEach(pro => {
        pro.addEventListener('click', () => showPopover(pro));
    });

    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', (e) => {
            e.stopPropagation();
            const price = parseFloat(button.closest('.pro').getAttribute('data-price'));
            const name = button.closest('.pro').getAttribute('data-name');
            addToCart(price, name, 0);
        });
    });

    function clearCart() {
        cartItems = [];
        cartCount = 0;
        cartTotal = 0;
        updateCartCount();
        updateCartTotal();
        updateCartItems();
        saveCart();
    }

    function toggleCartSidebar() {
        const userstname = document.getElementById('usersname');
        if (userstname) {
            userstname.textContent = localStorage.getItem('loggedInUser');
        }

        const cartSidebar = document.getElementById('cart-sidebar');
        if (cartSidebar) {
            if (cartSidebar.style.display === 'block') {
                cartSidebar.style.display = 'none';
            } else {
                cartSidebar.style.display = 'block';
            }
        }
    }

    function loadCart() {
        const storedCartItems = localStorage.getItem('cartItems');
        const storedCartCount = localStorage.getItem('cartCount');
        const storedCartTotal = localStorage.getItem('cartTotal');

        if (storedCartItems) {
            cartItems = JSON.parse(storedCartItems);
            cartCount = parseInt(storedCartCount, 10);
            cartTotal = parseFloat(storedCartTotal);
            updateCartCount();
            updateCartTotal();
            updateCartItems();
        }
    }

    window.addEventListener('load', loadCart);

    function saveCart() {
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
        localStorage.setItem('cartCount', cartCount.toString());
        localStorage.setItem('cartTotal', cartTotal.toFixed(2));
    }

    // Function to log out the user
    function logout() {
        localStorage.removeItem('loggedInUser');
    updateLoginIcon(); // Update the UI after logout
    alert('You have been logged out.');
    window.location.href = "proj1.html";
    }

    function performSearch() {
        const searchInput = document.getElementById('searchInput').value.toLowerCase();
        const products = document.querySelectorAll('.pro');

        products.forEach(product => {
            const productName = product.getAttribute('data-name').toLowerCase();
            if (productName.includes(searchInput)) {
                product.style.display = 'block';
            } else {
                product.style.display = 'none';
            }
        });
    }

    // Attach functions to window object to be accessible in HTML onclick attributes
    window.addToCart = addToCart;
    window.addToCartFromPopover = addToCartFromPopover;
    window.hidePopover = hidePopover;
    window.checkout = checkout;
    window.clearCart = clearCart;
    window.updatePrice = updatePrice;
    window.toggleCartSidebar = toggleCartSidebar;
    window.performSearch = performSearch;
});
