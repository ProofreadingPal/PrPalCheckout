<template>
    <div>
        <div class="formRow container">
            <div class="col col-2">
                <input
                    type="radio"
                    name="paymentType"
                    value="Credit Card"
                    style="width: auto;"
                    v-model="value.paymentType"
                    @change="$emit('updatedField', value)"
                />
                <img
                    :src="siteUrl + 'imgs/credit-cards.png'"
                    alt="cc payment"
                    width="163"
                    height="23"
                />
            </div>
            <div class="col col-2">
                <input
                    type="radio"
                    name="paymentType"
                    value="Paypal"
                    style="vertical-align:text-top;width: auto;"
                    v-model="value.paymentType"
                    @change="$emit('updatedField', value)"
                />
                <img
                    :src="siteUrl + 'imgs/paypal-payment.png'"
                    alt="paypal payment"
                    width="56"
                    height="17"
                    style="vertical-align:text-top;"
                />
            </div>
            <div class="clearAll"></div>
        </div>

        <!-- card info -->
        <transition name="fade" v-if="value.paymentType!='Paypal'">
        <div>
            <div class="formRow container">
                <div class="col col-2">
                    <label class="formLabel">Credit Type</label>
                    <select
                        class="formSelect"
                        v-model="value.creditCardType"
                        @change="$emit('updatedField', value)"
                    >
                        <option value="" selected="selected"
                            >Select Credit Type</option
                        >
                        <option value="Amex">American Express</option>
                        <option value="Discover">Discover</option>
                        <option value="MasterCard">MasterCard</option>
                        <option value="Visa">Visa</option>
                    </select>
                </div>
                <div class="col col-2">
                    <label class="formLabel">Credit Card Number</label>
                    <input
                        class="formText"
                        type="text"
                        placeholder="Card Number"
                        v-model="value.creditCardNumber"
                        @change="$emit('updatedField', value)"
                    />
                    <div class="step3RightTxtNote">
                        (* Enter your credit card number without dashes or
                        spaces)
                    </div>
                </div>
                <div class="clearAll"></div>
            </div>

            <div class="formRow container">
                <div class="col col-2">
                    <label class="formLabel">Security Code</label>
                    <input
                        class="formText"
                        type="text"
                        placeholder="Security Code"
                        v-model="value.cvv2Number"
                        @change="$emit('updatedField', value)"
                    />
                    <div class="step3RightTxtNote">
                        (This fraud prevention code has various names. The
                        three-digit card security code (CSC) is typically
                        located on the back of your card above your signature to
                        the right of the signature strip. For American Express
                        the four-digit number is printed on the front of the
                        card above and to the right of the embossed account
                        number.)
                    </div>
                </div>
                <div class="col col-2">
                    <label class="formLabel">Expiration Date</label>
                    <div class="cardDate">
                        <select
                            class="formSelect"
                            style="width:140px;margin-right:15px"
                            v-model="value.expirationDate.mm"
                            @change="$emit('updatedField', value)"
                        >
                            <option value="">Month</option>
                            <option value="1">January - 01</option>
                            <option value="2">February - 02</option>
                            <option value="3">March - 03</option>
                            <option value="4">April - 04</option>
                            <option value="5">May - 05</option>
                            <option value="6">June - 06</option>
                            <option value="7">July - 07</option>
                            <option value="8">August - 08</option>
                            <option value="9">September - 09</option>
                            <option value="10">October - 10</option>
                            <option value="11">November - 11</option>
                            <option value="12">December - 12</option>
                        </select>
                        <select
                            class="formSelect"
                            style="width:100px;"
                            v-model="value.expirationDate.yy"
                            @change="$emit('updatedField', value)"
                        >
                            <option value="">Year</option>
                            <option value="2021">2021</option>
                            <option value="2022">2022</option>
                            <option value="2023">2023</option>
                            <option value="2024">2024</option>
                            <option value="2025">2025</option>
                            <option value="2026">2026</option>
                            <option value="2027">2027</option>
                            <option value="2028">2028</option>
                            <option value="2029">2029</option>
                            <option value="2030">2030</option>
                        </select>
                    </div>
                </div>
                <div class="clearAll"></div>
            </div>
        </div>
        </transition>

        <div v-else>
           <p style="color: #333;vertical-align:text-top;">Before you complete your order, you will be redirected to the PayPal site. At PayPal, once you approve your PayPal payment, you will return to the order success page.</p> 
        </div>

    </div>
</template>

<script>
export default {
    props: {
        valueField: [Object, String]
    },
    data() {
        return {
            value: this.valueField
        };
    }
};
</script>
