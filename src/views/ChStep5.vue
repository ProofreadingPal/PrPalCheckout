<template>
    <div v-if="CheckoutData">
        <div class="checkoutFormHolder">
            <h2 class="tipHeadstep5">Success - Thank you for your order.</h2>
            <div class="step5Container">
                Dear {{ SelectedData.firstName }}
                {{ SelectedData.lastName }},<br /><br />Thanks for your
                order.<br /><br />
                Please print this page for your records. We will send you an
                email confirmation shortly.<br />
                Be sure to add
                <a href="mailto:order@proofreadingpal.com"
                    >order@proofreadingpal.com</a
                >
                to your safe senders list to ensure proper delivery. You can
                also check the status of your order and download completed
                orders using our
                <a href="/check-orders.php">Order Status</a> link which is
                located in the upper left corner of our website.<br /><br />
                If you have further questions about your order please feel free
                to contact us.
                <br /><br />
                Phone: 888-833-8385<br />
                Email:
                <a href="mailto:contact@proofreadingpal.com"
                    >contact@proofreadingpal.com</a
                >
            </div>
        </div>

        <div class="checkoutHeading">
            <h2
                class="formHeader"
                v-if="SelectedDataChild.customerType == 'corporate'"
            >
                Order Summary:
            </h2>
            <h2 class="formHeader" v-else>Order/Billing Summary:</h2>
        </div>

        <div class="checkoutFormHolder">
            <!-- billing info start -->
            <div v-if="SelectedDataChild.customerType != 'corporate'">
                <div class="formRow container">
                    <div class="col col-2">
                        <label class="formLabel">Payment Type:</label>
                    </div>
                    <div class="col col-2">
                        {{ paymentType() }}
                    </div>
                    <div class="clearAll"></div>
                </div>

                <div
                    v-if="SelectedData.billingData.paymentType == 'Credit Card'"
                >
                    <div class="formRow container">
                        <div class="col col-2">
                            <label class="formLabel">Credit Card:</label>
                        </div>
                        <div class="col col-2">
                            {{ SelectedData.billingData.creditCardType }}
                        </div>
                        <div class="clearAll"></div>
                    </div>

                    <div class="formRow container">
                        <div class="col col-2">
                            <label class="formLabel">Card Number:</label>
                        </div>
                        <div class="col col-2">
                            {{ SelectedData.billingData.creditCardNumber }}
                        </div>
                        <div class="clearAll"></div>
                    </div>
                    <div class="formRow container">
                        <div class="col col-2">
                            <label class="formLabel">Expiration Date:</label>
                        </div>
                        <div class="col col-2">
                            {{ SelectedData.billingData.expirationDate.mm }} /
                            {{ SelectedData.billingData.expirationDate.yy }}
                        </div>
                        <div class="clearAll"></div>
                    </div>
                </div>

                <div class="formRow container" v-else>
                    <div class="col col-2">
                        <label class="formLabel">Paypal Transaction ID:</label>
                    </div>
                    <div class="col col-2">
                        {{ SelectedData.invoice }}
                    </div>
                    <div class="clearAll"></div>
                </div>
            </div>
            <!-- billing info end -->

            <div class="formRow container">
                <div class="col col-2">
                    <label class="formLabel">Turnaround Speed:</label>
                </div>
                <div class="col col-2">
                    <span v-html="turnaroundSpeedDesc()"></span>
                </div>
                <div class="clearAll"></div>
            </div>

            <div class="formRow container">
                <div class="col col-2">
                    <label class="formLabel">Number of Words:</label>
                </div>
                <div class="col col-2">
                    {{ SelectedData.numberWords }}
                </div>
                <div class="clearAll"></div>
            </div>

            <div class="formRow container">
                <div class="col col-2">
                    <label class="formLabel">Project ID:</label>
                </div>
                <div class="col col-2">
                    {{ SelectedData.OrderId }}
                </div>
                <div class="clearAll"></div>
            </div>

            <div v-if="totals.totalOptions">
                <div class="formRow container" v-if="totals.totalOptions.length">
                    <div class="col col-2">
                        <label class="formLabel">Subtotal:</label>
                    </div>
                    <div class="col col-2">
                        <span
                            style="font-weight:bold;text-decoration:line-through;"
                            >${{ totals.amount }}</span
                        >
                    </div>
                    <div class="clearAll"></div>
                </div>

                <div
                    v-for="total in totals.totalOptions"
                    :key="total.ID"
                    class="formRow container containerSub containerSubIn formRowHO containerHO"
                >
                    <div class="col col-2">
                        <label class="formLabel">{{ total.label }}:</label>
                    </div>
                    <div class="col col-2">
                        {{ total.sign }}${{ total.amount }}
                    </div>
                    <div class="clearAll"></div>
                </div>
            </div>
            <div class="formRow container formRow containerTotal">
                <div class="col col-2">
                    <label class="formLabel"
                        ><strong style="font-weight:bold;font-size:20px;"
                            >Total:</strong
                        ></label
                    >
                </div>
                <div class="col col-2">
                    <span style="font-weight:bold;font-size:20px;"
                        >${{ totals.total }}</span
                    >
                </div>
                <div class="clearAll"></div>
            </div>
            <CheckoutMinAmountMessage
                :SelectedData="SelectedData"
                v-if="SelectedData.minAmountUsed"
            />
        </div>
    </div>
</template>

<script>
import CheckoutExtendedDeadlineFunctions from '@/components/CheckoutExtendedDeadlineFunctions.vue';
import CheckoutMinAmountMessage from '@/components/CheckoutMinAmountMessage.vue';
export default {
    mixins: [CheckoutExtendedDeadlineFunctions],
    components: {
        CheckoutMinAmountMessage,
    },
    data() {
        return {
            SelectedDataChild: this.SelectedData
        };
    },
    props: {
        CheckoutData: Object,
        SelectedData: Object,
        totals: [Object, Boolean]
    },
    mounted: function() {
        this.$nextTick(function() {
            this.$emit('loaded', true);
        });
    },
    created: function() {
        if (this.SelectedDataChild.customerType == 'corporate') {
            window.ga('ec:setAction','checkout', {
                'step': 5,
                'option': this.SelectedData.turnaround.FriendlyName + ' turnaround'
            });
            window.ga('send', 'pageview', this.siteUrl + 'checkout/step5Cor');
        } else {
            window.ga('ec:setAction','checkout', {
                'step': 7,
                'option': this.SelectedData.turnaround.FriendlyName + ' turnaround'
            });
            window.ga('send', 'pageview', this.siteUrl + 'checkout/step5');
        }
        window.ga('ec:addProduct', {               // Provide product details in an productFieldObject.
            'id': this.SelectedData.turnaround.ID,                   // Product ID (string).
            'name': this.SelectedData.turnaround.Name, // Product name (string).
            'category': this.SelectedData.selectedWritingStyle.name,  // Product category (string).
            'variant' : this.getOrderType(),          
            'price': this.totals.total,                 // Product price (currency).
            'quantity': 1                     // Product quantity (number).
        });
        window.ga('ec:setAction', 'purchase', {          // Transaction details are provided in an actionFieldObject.
            'id': this.SelectedData.invoice,                         // (Required) Transaction id (string).
            'revenue': this.totals.total                     // Revenue (currency).
        });
        window.ga('send', 'pageview');
    },
    methods: {
        getOrderType() {
            if (this.SelectedData.customerOrderType) {
                if (this.SelectedData.customerOrderType == 'prof1reader') {
                    return 'DTPE and C';
                } else if (
                    this.SelectedData.customerOrderType == 'proflitereader'
                ) {
                    return 'Lite';
                } else if (this.SelectedData.customerOrderType == 'liteplus') {
                    return 'DTPE and C plus Lite';
                }
            } else {
                if (this.SelectedData.singleOption) {
                    return 'Premium One Proofreader';
                }
            }
            return 'Premium Two Proofreaders';
        },
        paymentType() {
            if (this.SelectedDataChild.customerType == 'corporate') {
                return 'corporate';
            }
            return this.SelectedData.billingData.paymentType;
        },
        turnaroundSpeedDesc() {
            let proofType = '';
            if(this.SelectedData.singleOption || this.SelectedData.customerOrderType == 'prof1reader' || this.SelectedData.customerOrderType == 'proflitereader') {
                proofType = '<br /><i class="fas fa-user"></i> One Proofreader';
            } else {
                proofType = '<br /><i class="fas fa-user-friends"></i> Two Proofreaders';
            }
            let extended = '';
            if(this.ifExtended()) {
                extended = '('+this.calculateExtendedDeadlinePrint()+' turnaround)';
            }
            
            return this.SelectedData.turnaround.FriendlyName+' turnaround '+extended+proofType;
        }
    }
};
</script>
