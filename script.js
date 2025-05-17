// Database simulation
        let products = [
            {
                id: '1',
                name: 'Wireless Headphones',
                price: 99.99,
                description: 'Noise-cancelling wireless headphones with 30hr battery life',
                image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop'
            },
            {
                id: '2',
                name: 'Smart Watch',
                price: 199.99,
                description: 'Fitness tracking and notifications on your wrist',
                image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop'
            },
            {
                id: '3',
                name: 'Bluetooth Speaker',
                price: 59.99,
                description: 'Portable speaker with 20hr playtime',
                image: 'https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=500&auto=format&fit=crop'
            }
        ];

        let cart = [];
        let orders = [];
        let selectedPaymentMethod = 'credit_card';

        // DOM Elements
        const roleSelection = document.getElementById('role-selection');
        const buyerView = document.getElementById('buyer-view');
        const sellerView = document.getElementById('seller-view');
        const cartView = document.getElementById('cart-view');
        const checkoutView = document.getElementById('checkout-view');
        const confirmationView = document.getElementById('confirmation-view');
        const productList = document.getElementById('product-list');
        const cartItems = document.getElementById('cart-items');
        const cartCount = document.getElementById('cart-count');
        const cartCount2 = document.getElementById('cart-count-2');
        const cartTotal = document.getElementById('cart-total');
        const checkoutSubtotal = document.getElementById('checkout-subtotal');
        const checkoutTotal = document.getElementById('checkout-total');
        const sellerProducts = document.getElementById('seller-products');
        const productForm = document.getElementById('product-form');
        const imageUploadArea = document.getElementById('image-upload-area');
        const imagePreview = document.getElementById('image-preview');
        const productImageInput = document.getElementById('product-image');
        const heroSection = document.getElementById('hero-section');

        // Navigation buttons
        document.getElementById('buyer-btn').addEventListener('click', () => {
            heroSection.classList.remove('hidden');
            roleSelection.classList.add('hidden');
            buyerView.classList.remove('hidden');
            renderProducts();
            updateCartCount();
        });

        document.getElementById('seller-btn').addEventListener('click', () => {
            heroSection.classList.remove('hidden');
            roleSelection.classList.add('hidden');
            sellerView.classList.remove('hidden');
            renderSellerProducts();
        });

        document.getElementById('back-to-role').addEventListener('click', () => {
            heroSection.classList.add('hidden');
            buyerView.classList.add('hidden');
            roleSelection.classList.remove('hidden');
        });

        document.getElementById('back-to-role-seller').addEventListener('click', () => {
            heroSection.classList.add('hidden');
            sellerView.classList.add('hidden');
            roleSelection.classList.remove('hidden');
        });

        document.getElementById('view-cart-btn').addEventListener('click', () => {
            buyerView.classList.add('hidden');
            cartView.classList.remove('hidden');
            renderCart();
        });

        document.getElementById('back-to-products').addEventListener('click', () => {
            cartView.classList.add('hidden');
            buyerView.classList.remove('hidden');
        });

        document.getElementById('checkout-btn').addEventListener('click', () => {
            cartView.classList.add('hidden');
            checkoutView.classList.remove('hidden');
            updateCheckoutTotals();
        });

        document.getElementById('back-to-cart').addEventListener('click', () => {
            checkoutView.classList.add('hidden');
            cartView.classList.remove('hidden');
        });

        document.getElementById('complete-payment-btn').addEventListener('click', () => {
            // Create order
            const order = {
                id: orders.length + 1,
                products: [...cart],
                total: calculateCartTotal(),
                paymentMethod: selectedPaymentMethod,
                createdAt: new Date().toLocaleDateString(),
                status: 'completed'
            };
            orders.push(order);
            
            // Clear cart
            cart = [];
            updateCartCount();
            
            // Show confirmation
            checkoutView.classList.add('hidden');
            confirmationView.classList.remove('hidden');
        });

        document.getElementById('continue-shopping-btn').addEventListener('click', () => {
            confirmationView.classList.add('hidden');
            buyerView.classList.remove('hidden');
        });

        // Payment method selection
        document.querySelectorAll('.payment-method').forEach(method => {
            method.addEventListener('click', () => {
                document.querySelectorAll('.payment-method').forEach(m => {
                    m.classList.remove('active');
                });
                
                method.classList.add('active');
                selectedPaymentMethod = method.dataset.method;
            });
        });

        // Image upload
        imageUploadArea.addEventListener('click', () => {
            productImageInput.click();
        });

        productImageInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    imageUploadArea.classList.add('hidden');
                    imagePreview.classList.remove('hidden');
                    imagePreview.innerHTML = `
                        <img src="${event.target.result}" alt="Preview" class="w-full h-48 object-cover rounded-lg">
                        <button id="change-image-btn" class="btn btn-outline w-full mt-3">
                            Change Image
                        </button>
                    `;
                    
                    document.getElementById('change-image-btn').addEventListener('click', () => {
                        imagePreview.classList.add('hidden');
                        imageUploadArea.classList.remove('hidden');
                        productImageInput.value = '';
                    });
                };
                reader.readAsDataURL(file);
            }
        });

        // Product form submission
        productForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const name = document.getElementById('product-name').value;
            const price = parseFloat(document.getElementById('product-price').value);
            const description = document.getElementById('product-description').value;
            let image = '';
            
            if (productImageInput.files[0]) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    image = event.target.result;
                    addProduct(name, price, description, image);
                };
                reader.readAsDataURL(productImageInput.files[0]);
            } else {
                addProduct(name, price, description, image);
            }
        });

        // Helper functions
        function addProduct(name, price, description, image) {
            const newProduct = {
                id: (products.length + 1).toString(),
                name,
                price,
                description,
                image
            };
            
            products.push(newProduct);
            renderSellerProducts();
            productForm.reset();
            imageUploadArea.classList.remove('hidden');
            imagePreview.classList.add('hidden');
            productImageInput.value = '';
        }

        function renderProducts() {
            productList.innerHTML = '';
            
            if (products.length === 0) {
                productList.innerHTML = '<p class="text-center text-gray-500 col-span-3 py-10">No products available</p>';
                return;
            }
            
            products.forEach(product => {
                const productCard = document.createElement('div');
                productCard.className = 'card';
                productCard.innerHTML = `
                    ${product.image ? 
                        `<img src="${product.image}" alt="${product.name}" class="product-image">` : 
                        `<div class="image-placeholder">No Image</div>`}
                    <div class="card-body">
                        <h3 class="font-bold text-lg mb-2">${product.name}</h3>
                        <p class="text-gray-600 mb-2">${product.description}</p>
                        <p class="font-bold text-indigo-600">Rs:${product.price.toFixed(2)}</p>
                    </div>
                    <div class="card-footer">
                        <button class="btn btn-primary w-full add-to-cart" data-id="${product.id}">
                            Add to Cart
                        </button>
                    </div>
                `;
                
                productList.appendChild(productCard);
            });
            
            // Add event listeners to "Add to Cart" buttons
            document.querySelectorAll('.add-to-cart').forEach(button => {
                button.addEventListener('click', (e) => {
                    const productId = e.target.dataset.id;
                    const product = products.find(p => p.id === productId);
                    if (product) {
                        cart.push(product);
                        updateCartCount();
                        // Add animation feedback
                        e.target.textContent = 'Added!';
                        e.target.classList.add('btn-secondary');
                        setTimeout(() => {
                            e.target.textContent = 'Add to Cart';
                            e.target.classList.remove('btn-secondary');
                        }, 1000);
                    }
                });
            });
        }

        function renderSellerProducts() {
            sellerProducts.innerHTML = '';
            
            if (products.length === 0) {
                sellerProducts.innerHTML = '<p class="text-center text-gray-500 py-10">No products added yet</p>';
                return;
            }
            
            products.forEach(product => {
                const productCard = document.createElement('div');
                productCard.className = 'card';
                productCard.innerHTML = `
                    <div class="flex">
                        ${product.image ? 
                            `<img src="${product.image}" alt="${product.name}" class="w-24 h-24 object-cover">` : 
                            `<div class="w-24 h-24 bg-gray-200 flex items-center justify-center text-gray-400">No Image</div>`}
                        <div class="p-4 flex-grow">
                            <h3 class="font-bold text-lg mb-1">${product.name}</h3>
                            <p class="text-gray-600 mb-2">Rs:${product.price.toFixed(2)}</p>
                            <p class="text-sm text-gray-500">${product.description.substring(0, 50)}...</p>
                        </div>
                    </div>
                `;
                
                sellerProducts.appendChild(productCard);
            });
        }

        function renderCart() {
            cartItems.innerHTML = '';
            
            if (cart.length === 0) {
                cartItems.innerHTML = '<p class="text-center text-gray-500 py-10">Your cart is empty</p>';
                cartTotal.textContent = '0.00';
                document.getElementById('checkout-btn').disabled = true;
                return;
            }
            
            cart.forEach((product, index) => {
                const cartItem = document.createElement('div');
                cartItem.className = 'cart-item';
                cartItem.innerHTML = `
                    <div class="flex items-center gap-4">
                        ${product.image ? 
                            `<img src="${product.image}" alt="${product.name}" class="cart-item-image">` : 
                            `<div class="cart-item-image bg-gray-200 flex items-center justify-center text-gray-400">No Image</div>`}
                        <div>
                            <h3 class="font-medium">${product.name}</h3>
                            <p class="text-gray-600">Rs:${product.price.toFixed(2)}</p>
                        </div>
                    </div>
                    <button class="btn btn-danger remove-from-cart" data-index="${index}">
                        Remove
                    </button>
                `;
                
                cartItems.appendChild(cartItem);
            });
            
            // Add event listeners to "Remove" buttons
            document.querySelectorAll('.remove-from-cart').forEach(button => {
                button.addEventListener('click', (e) => {
                    const index = parseInt(e.target.dataset.index);
                    cart.splice(index, 1);
                    renderCart();
                    updateCartCount();
                });
            });
            
            cartTotal.textContent = `Rs:${calculateCartTotal().toFixed(2)}`;
            document.getElementById('checkout-btn').disabled = false;
        }

        function calculateCartTotal() {
            return cart.reduce((total, product) => total + product.price, 0);
        }

        function updateCartCount() {
            const count = cart.length;
            cartCount.textContent = `${count} item${count !== 1 ? 's' : ''}`;
            cartCount2.textContent = `${count} item${count !== 1 ? 's' : ''}`;
        }

        function updateCheckoutTotals() {
            const subtotal = calculateCartTotal();
            checkoutSubtotal.textContent = `Rs:${subtotal.toFixed(2)}`;
            checkoutTotal.textContent = `Rs:${subtotal.toFixed(2)}`;
        }

        // Initialize
        updateCartCount();