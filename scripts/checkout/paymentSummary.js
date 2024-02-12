import {cart} from '../../data/cart.js';
import { getProduct } from '../../data/products.js';
import { deliveryOptions, getDeliveryOption } from '../../data/deliveryOptions.js';
import { formatCurrency } from '../utils/money.js';


export function renderPaymentSummary() {
    let productPriceCents = 0;
    let shippingPriceCents = 0;

    cart.forEach((cartItem) => {
        const product = getProduct(cartItem.productId);
        productPriceCents += product.priceCents * cartItem.quantity;

        const deliveryOption = getDeliveryOption(cartItem.deliveryOptionId);
        shippingPriceCents += deliveryOption.priceCents;
    });

    const totalBeforeTaxCents = productPriceCents + shippingPriceCents;
    const taxCents = totalBeforeTaxCents * 0.1;
    const totalCents = totalBeforeTaxCents + taxCents;

    let cartQuantity = 0;
    cart.forEach((cartItem) => {
        cartQuantity += cartItem.quantity;
    })

    const paymentSummaryHTML = `
    <div class="order-summary-title">Order Summary</div>
        <div class="order-summary-row">
            <div>Items (${cartQuantity}):</div>
            <div class="order-summary-price">
                $${formatCurrency(productPriceCents)}</div>
        </div>
        <div class="order-summary-row">
            <div>Shipping &amp; handling:</div>
            <div class="order-summary-price">
                $${formatCurrency(shippingPriceCents)}</div>
        </div>
        
        <div class="order-summary-row subtotal-row">
            <div>Total before tax:</div>
            <div class="order-summary-price order-price-subtotal">
                $${formatCurrency(totalBeforeTaxCents)}</div>
        </div>
        <div class="order-summary-row">
            <div>Estimated tax (10%):</div>
            <div class="order-summary-price">
            $${formatCurrency(taxCents)}</div>
        </div>
        
        <div class="order-summary-row total-row">
            <div>Order total:</div>
            <div class="order-summary-price">
            $${formatCurrency(totalCents)}</div>
        </div>
        <div class="use-paypal">
            Use PayPal
            <input class="paypal-checkbox"
            type="checkbox">
        </div>
        <button class="place-order-btn">Place your order</button>`

        document.querySelector('.js-payment-summary')
            .innerHTML = paymentSummaryHTML;
}