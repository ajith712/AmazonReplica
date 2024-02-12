import {cart,addToCart,calculateCartQuantity} from '../data/cart.js';
import {products} from '../data/products.js';
import { formatCurrency } from './utils/money.js';



let productsHTML =  '';

products.forEach((product) => {
  productsHTML += `
      <div class="product-container">

        <div class="product-pic">
           <img class="product-img" src="${product.image}"> </div>

        <div class="product-name">
        ${product.name}</div>

        <div class="product-rating-star-container">
         <img class="product-rating-star"
         src="images/rating/rating-${product.rating.stars/10}.png">

        <div class="product-rating-count">
        ${product.rating.count}</div> </div>

        <div class="product-price">$${formatCurrency(product.priceCents)}</div>

        <div class="product-quantity-container">
          <select class="product-quantity-selector js-quantity-selector-${product.id}">
              <option selected value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
              <option value="6">6</option>
              <option value="7">7</option>
              <option value="8">8</option>
              <option value="9">9</option>
              <option value="10">10</option>
            </select></div>

        <div class="js-cart-added-msg js-cart-added-msg-${product.id}">
          <img class="added-img" src="images/main-page-pics/checkmark.png">
          Added
        </div>

        <button class="add-to-cart-button
           js-add-to-cart"
           data-product-id="${product.id}">Add to Cart</button>
      </div>
  `;
})


document.querySelector('.js-products-grid').
innerHTML = productsHTML;

updateCartQuantity();

function updateCartQuantity(){
        const cartQuantity = calculateCartQuantity();
        document.querySelector('.js-cart-quantity').
        innerHTML = cartQuantity;
}

function addedMessage(productId){
  const addedMessage = document.querySelector(`.js-cart-added-msg-${productId}`);

        addedMessage.classList.add('js-cart-added-msg-visible');

        setTimeout( () => {
          addedMessage.classList.remove('js-cart-added-msg-visible')
         },2000);
}



document.querySelectorAll('.js-add-to-cart')
 .forEach((button) => {
     button.addEventListener('click',() => {
          const {productId} = button.dataset;

          addToCart(productId);
          addedMessage(productId);
          updateCartQuantity();
     });
 });
