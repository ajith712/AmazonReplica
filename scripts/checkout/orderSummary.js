import {cart,removeFromCart,calculateCartQuantity,
    updateQuantity,updateDeliveryOption} from '../../data/cart.js';
    import {products, getProduct} from '../../data/products.js'
    import {formatCurrency} from '../utils/money.js';
    import dayjs from 'https://unpkg.com/dayjs@1.11.10/esm/index.js';
    import { deliveryOptions,getDeliveryOption } from '../../data/deliveryOptions.js'; 
    import { renderPaymentSummary } from './paymentSummary.js';
    
    export function renderOrderSummary(){
        let cartSummaryHTML = '';
    
        cart.forEach((cartItem) => {
            const productId = cartItem.productId;
    
            const matchingProduct = getProduct(productId);
    
            const deliveryOptionId = cartItem.deliveryOptionId;
    
            const deliveryOption = getDeliveryOption(deliveryOptionId);
    
            const today = dayjs();
                const deliveyDate = today.add(
                    deliveryOption.deliveryDays,
                    'days'
                );
    
                const dateString = deliveyDate.format('dddd, MMMM D');
    
        cartSummaryHTML += `
        <div class="cart-products-container js-cart-products-container-${matchingProduct.id}">
        <div class="delivery-date">Delivery date: ${dateString}</div>
            <div class="cart-product-details">
            <img class="product-img" src="${matchingProduct.image}">
                <div class="item-details">  
                    <div class="item-name">${matchingProduct.name}</div>
                        <div class="item-price">$${formatCurrency(matchingProduct.priceCents)}</div>
                            <div class="item-quantity">
                                <span>Quantity: 
                                    <span class="quantity-label
                                    js-quantity-label-${matchingProduct.id}">${cartItem.quantity}</span>
                                </span>
                                <span id = "js-cart-update-link" class="cart-update-link js-cart-update-link"
                                data-product-id="${matchingProduct.id}">
                                    Update
                                </span>
                                <input class = "js-quantity-input
                                js-quantity-input-${matchingProduct.id}"
                                value = "${cartItem.quantity}" 
                                type = "number">
                                <span class = "js-cart-save-link" data-product-id="${matchingProduct.id}">
                                    Save
                                </span>
                                <span class="cart-delete-link js-delete-link"
                                data-product-id="${matchingProduct.id}">
                                    Delete
                                </span>
                            </div>
                </div>
    
            <div class="delivery-option-container">
            <div class="delivery-option-title">Choose a delivery option:</div>
            ${deliveryOptionHTML(matchingProduct, cartItem)}    
            </div>
        </div>
        </div>`
        })
    
        function deliveryOptionHTML(matchingProduct, cartItem){
            let html = '';
            deliveryOptions.forEach((deliveryOption) => {
                const today = dayjs();
                const deliveyDate = today.add(
                    deliveryOption.deliveryDays,
                    'days'
                );
    
                const dateString = deliveyDate.format('dddd, MMMM D');
                const priceString = 
                            deliveryOption.priceCents === 0 
                            ? 'FREE' : `$${formatCurrency(deliveryOption.priceCents)} - Shipping`;
    
                const isChecked = deliveryOption.id === cartItem.deliveryOptionId;            
    
                html += `
                <div class="delivery-option">
                        <input type="radio" ${isChecked ? 'checked' : ''} 
                        class="option-radio-check js-delivery-option"
                        data-product-id="${matchingProduct.id}"
                        data-delivery-option-id="${deliveryOption.id}"
                        name = "delivery-option-${matchingProduct.id}">
                        <div>
                            <div class="option-delivery-date">${dateString}</div>
                            <div class="delivery-price">${priceString}</div>
                        </div>
                </div>
                `
            });
    
            return html;
        }
    
        document.querySelector('.js-order-list').innerHTML = cartSummaryHTML;
    
        document.querySelectorAll('.js-delete-link')
            .forEach((link) => {
                link.addEventListener('click', () => {
                    const productId = link.dataset.productId;
                    removeFromCart(productId);
                    
                    //const container = document.querySelector(`.js-cart-products-container-${productId}`);
                    //container.remove();
                    updateCartQuantity();
                    renderOrderSummary();    
                    renderPaymentSummary();
                });
            });
    
        function updateCartQuantity() {
            const cartQuantity = calculateCartQuantity();
            document.querySelector('.js-items-text').innerHTML = `${cartQuantity} items`;
        }
    
        updateCartQuantity();
    
        document.querySelectorAll('.js-cart-update-link')
        .forEach((link) => {
            link.addEventListener('click', () => {
                const productId = link.dataset.productId;
                
                const container = document.querySelector(`.js-cart-products-container-${productId}`);
                
                container.classList.add("is-editing-quantity");
                
            })
        })
    
        document.querySelectorAll('.js-cart-save-link')
        .forEach((link) => {
            link.addEventListener('click', () => {
                const productId = link.dataset.productId;
    
                const container = document.querySelector(`.js-cart-products-container-${productId}`);
                
                container.classList.remove("is-editing-quantity");
    
                const inputQuantity = document.querySelector('.js-quantity-input');
    
                const newQuantity = Number(inputQuantity.value);
    
                if(newQuantity <= 0 || newQuantity >=1000){
                    alert("The quantity must with in 1 to 1000!!!");
                    return;
                }
    
                updateQuantity(productId,newQuantity);
    
                const quantityLabel = document.querySelector(`.js-quantity-label-${productId}`);
    
                quantityLabel.innerHTML = newQuantity;
    
                updateCartQuantity();
                renderOrderSummary();
                renderPaymentSummary();
            });
        });
    
        document.querySelectorAll('.js-delivery-option')
        .forEach((element) => {
            element.addEventListener('click', () => {
                const {productId, deliveryOptionId} = element.dataset;
                updateDeliveryOption(productId, deliveryOptionId);
                renderOrderSummary();
                renderPaymentSummary();
            });
        });
    }    