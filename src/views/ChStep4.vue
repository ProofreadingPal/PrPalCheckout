<template>
    <div v-if="CheckoutData">
        <div class="checkoutHeading" v-if="SelectedDataChild.customerType != 'corporate' && SelectedDataChild.customerType != 'account'">
            <h2 class="formHeader">Personal Information</h2>
        </div>

        <!-- personal info start -->
        <div class="checkoutFormHolder" v-if="SelectedDataChild.customerType != 'corporate' && SelectedDataChild.customerType != 'account'">
            <div class="formRow container">
                <div class="col col-2">
                    <label class="formLabel">Name:</label>
                </div>
                <div class="col col-2">
                    {{SelectedData.firstName}} {{SelectedData.lastName}}
                </div>
                <div class="clearAll"></div>
            </div>

            <div class="formRow container">
                <div class="col col-2">
                    <label class="formLabel">Email:</label>
                </div>
                <div class="col col-2">
                    {{SelectedData.email}}
                </div>
                <div class="clearAll"></div>
            </div>

            <div class="formRow container">
                <div class="col col-2">
                    <label class="formLabel">Cell/Phone:</label>
                </div>
                <div class="col col-2">
                    {{SelectedData.cell}}
                </div>
                <div class="clearAll"></div>
            </div>

            <div class="formRow container">
                <div class="col col-2">
                    <label class="formLabel">Address:</label>
                </div>
                <div class="col col-2">
                    {{SelectedData.address1}}, {{SelectedData.address2}}<br>
                    {{SelectedData.city}}, {{SelectedData.state}} {{SelectedData.zip}}<br>
                    {{SelectedData.country}}
                </div>
                <div class="clearAll"></div>
            </div>
        </div>

        <div class="checkoutHeading">
            <h2 class="formHeader">Order Summary</h2>
        </div>
        <!-- billing info start -->
        <div class="checkoutFormHolder">

            <div class="formRow container">
                <div class="col col-2">
                    <label class="formLabel">Payment Type:</label>
                </div>
                <div class="col col-2">
                    {{paymentType()}}
                </div>
                <div class="clearAll"></div>
            </div>

            <div v-if="SelectedData.billingData.paymentType == 'Credit Card'">
                <div class="formRow container">
                    <div class="col col-2">
                        <label class="formLabel">Credit Card:</label>
                    </div>
                    <div class="col col-2">
                        {{SelectedData.billingData.creditCardType}}
                    </div>
                    <div class="clearAll"></div>
                </div>

                <div class="formRow container">
                    <div class="col col-2">
                        <label class="formLabel">Card Number:</label>
                    </div>
                    <div class="col col-2">
                        {{SelectedData.billingData.creditCardNumber}}
                    </div>
                    <div class="clearAll"></div>
                </div>
                <div class="formRow container">
                    <div class="col col-2">
                        <label class="formLabel">Expiration Date:</label>
                    </div>
                    <div class="col col-2">
                        {{SelectedData.billingData.expirationDate.mm}} / {{SelectedData.billingData.expirationDate.yy}}
                    </div>
                    <div class="clearAll"></div>
                </div>
            </div>

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
                    {{SelectedData.numberWords}}
                </div>
                <div class="clearAll"></div>
            </div>
            <div v-if="totals.totalOptions">
                <div class="formRow container" v-if="totals.totalOptions.length">
                    <div class="col col-2">
                        <label class="formLabel">Subtotal:</label>
                    </div>
                    <div class="col col-2">
                        <span style="font-weight:bold;text-decoration:line-through;">${{totals.amount}}</span>
                    </div>
                    <div class="clearAll"></div>
                </div>

                <div v-for="total in totals.totalOptions" :key="total.ID" class="formRow container containerSub containerSubIn formRowHO containerHO">
                    <div class="col col-2">
                        <label class="formLabel">{{total.label}}:</label>
                    </div>
                    <div class="col col-2">
                        {{total.sign}}${{total.amount}}
                    </div>
                    <div class="clearAll"></div>
                </div>

            </div>
            <div class="formRow container formRow containerTotal">
                <div class="col col-2">
                    <label class="formLabel"><strong style="font-weight:bold;font-size:20px;">Total:</strong></label>
                </div>
                <div class="col col-2">
                    <span style="font-weight:bold;font-size:20px;">${{totals.total}}</span>
                </div>
                <div class="clearAll"></div>
            </div>

            <CheckoutUpgradeOption 
                :upgradeTurnaround=upgradeTurnaround
                :turnaround=SelectedData.turnaround
                v-if="upgradeTurnaround && !SelectedData.singleOption"
                @upgrade="upgrade($event)"
             />

            <CheckoutMinAmountMessage 
                :SelectedData=SelectedData
                v-if="SelectedData.minAmountUsed"
            />

            <div class="formRow container">
                <a
                    href="javascript:void(0)"
                    class="button button-blue"
                    @click="$emit('moveToStep', [4, 5])"
                    >Submit Order</a
                >
                <McafeeSecureBadge />
            </div>
        </div>

    </div>
</template>

<script>
import McafeeSecureBadge from '@/components/McafeeSecureBadge.vue';
import CheckoutMinAmountMessage from '@/components/CheckoutMinAmountMessage.vue';
import CheckoutUpgradeOption from '@/components/CheckoutUpgradeOption.vue';
import CheckoutExtendedDeadlineFunctions from '@/components/CheckoutExtendedDeadlineFunctions.vue';
export default {
    mixins: [
        CheckoutExtendedDeadlineFunctions
    ],
    components: {
        McafeeSecureBadge,
        CheckoutMinAmountMessage,
        CheckoutUpgradeOption,
    },
    data() {
        return {
            SelectedDataChild: this.SelectedData
        };
    },
    props: {
        CheckoutData: Object,
        SelectedData: Object,
        totals:[Object, Boolean],
        upgradeTurnaround:[Object, Boolean],
    },
    created: function() {
        window.ga('ec:setAction','checkout', {
            'step': 4,
            'option': this.SelectedData.turnaround.FriendlyName + ' turnaround'
        });
        window.ga('send', 'pageview', this.siteUrl + 'checkout/step4');
    },
    mounted: function() {
        this.$nextTick(function() {
            this.$emit('loaded', true);
        });
        this.SelectedData.FlatChecked4 = false;
    },
    methods: {
        upgrade(turnaround) {
           this.SelectedData.turnaround = turnaround[0];
           this.SelectedData.upgrade = turnaround[1];
           this.$emit('updateCheckoutData', this.SelectedData)
        },
        paymentType() {
            if(this.SelectedDataChild.customerType == 'corporate') {
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