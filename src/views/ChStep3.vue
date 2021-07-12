<template>
    <div v-if="CheckoutData">
        <div class="checkoutHeading">
            <h2 class="formHeader">Personal Information</h2>
        </div>
        <!-- personal info -->
        <div class="checkoutFormHolder">
            <div class="formRow container">
                <CheckoutStep3TextField
                    :label="'First Name'"
                    :valueField="SelectedData.firstName"
                    @updatedField="
                        (changedAccData = true),
                        (SelectedDataChild.firstName = $event),
                            $emit('updateCheckoutData', SelectedDataChild)
                    "
                />
                <CheckoutStep3TextField
                    :label="'Last Name'"
                    :valueField="SelectedData.lastName"
                    @updatedField="
                        (changedAccData = true),
                        (SelectedDataChild.lastName = $event),
                            $emit('updateCheckoutData', SelectedDataChild)
                    "
                />
                <div class="clearAll"></div>
            </div>

            <div class="formRow container">
                <CheckoutStep3TextField
                    :label="'Address Line 1'"
                    :valueField="SelectedData.address1"
                    @updatedField="
                        (changedAccData = true),
                        (SelectedDataChild.address1 = $event),
                            $emit('updateCheckoutData', SelectedDataChild)
                    "
                />
                <CheckoutStep3TextField
                    :label="'Address Line 2'"
                    :valueField="SelectedData.address2"
                    @updatedField="
                        (changedAccData = true),
                        (SelectedDataChild.address2 = $event),
                            $emit('updateCheckoutData', SelectedDataChild)
                    "
                />
                <div class="clearAll"></div>
            </div>

            <div class="formRow container">
                <CheckoutStep3TextField
                    :label="'City'"
                    :valueField="SelectedData.city"
                    @updatedField="
                        (changedAccData = true),
                        (SelectedDataChild.city = $event),
                            $emit('updateCheckoutData', SelectedDataChild)
                    "
                />
                <div class="col col-2">
                    <label class="formLabel">State</label>
                    <FormFieldState
                        :selectedval="SelectedData.state"
                        @input="
                            (changedAccData = true),
                            (SelectedDataChild.state = $event),
                                $emit('updateCheckoutData', SelectedDataChild)
                        "
                    />
                </div>
                <div class="clearAll"></div>
            </div>

            <div class="formRow container">
                <CheckoutStep3TextField
                    :label="'Postal/Zip Code'"
                    :valueField="SelectedData.zip"
                    @updatedField="
                        (changedAccData = true),
                        (SelectedDataChild.zip = $event),
                            $emit('updateCheckoutData', SelectedDataChild)
                    "
                />
                <div class="col col-2">
                    <label class="formLabel">Country</label>
                    <FormFieldCountry
                        :selectedval="SelectedData.country"
                        @input="
                            (changedAccData = true),
                            (SelectedDataChild.country = $event),
                                $emit('updateCheckoutData', SelectedDataChild)
                        "
                    />
                </div>
                <div class="clearAll"></div>
            </div>

            <div class="formRow container">
                <CheckoutStep3TextField
                    :label="'Cell/Phone'"
                    :valueField="SelectedData.cell"
                    @updatedField="
                        (changedAccData = true),
                        (SelectedDataChild.cell = $event),
                            $emit('updateCheckoutData', SelectedDataChild)
                    "
                />
                <div class="clearAll"></div>
            </div>

            <div class="formRow container">
                <CheckoutStep3Birthday
                    :label="'Birthday'"
                    :valueField="SelectedData.birthday"
                    @updatedField="
                        (changedAccData = true),
                        (SelectedDataChild.birthday = $event),
                            $emit('updateCheckoutData', SelectedDataChild)
                    "
                />
                <CheckoutStep3Birthday
                    :label="'Confirm Birthdate'"
                    :valueField="SelectedData.confirmBirthday"
                    @updatedField="
                        (SelectedDataChild.confirmBirthday = $event),
                            $emit('updateCheckoutData', SelectedDataChild)
                    "
                />
                <div class="clearAll"></div>
            </div>

            <div class="formRow container">
                <CheckoutStep3TextField
                    :label="'Email'"
                    :valueField="SelectedData.email"
                    @updatedField="
                        (SelectedDataChild.email = $event),
                            $emit('updateCheckoutData', SelectedDataChild)
                    "
                />
                <CheckoutStep3TextField
                    :label="'Confirm Email'"
                    :valueField="SelectedData.confirmEmail"
                    @updatedField="
                        (SelectedDataChild.confirmEmail = $event),
                            $emit('updateCheckoutData', SelectedDataChild)
                    "
                />
                <div class="clearAll"></div>
            </div>

            <div class="formHeader" v-if="showSaveData()">
                <span>
                    <input 
                        type="checkbox" 
                        v-model="SelectedDataChild.savedData"
                        @change="$emit('updateCheckoutData', SelectedDataChild)"
                        style="width:10px;vertical-align:middle;" /> &nbsp; 
                    <span style="vertical-align:middle;font-size:17px;">Save personal information above for future orders</span>
                </span>
            </div>

        </div>

        <div class="checkoutHeading">
            <h2 class="formHeader">Billing Information</h2>
        </div> 

        <div class="checkoutFormHolder">

            <!-- billing info -->
            <CheckoutBillingFields
                :valueField="SelectedData.billingData"
                @updatedField="
                    (SelectedDataChild.billingData = $event),
                        $emit('updateCheckoutData', SelectedDataChild)
                "
            />

            <div class="formRow container">
                <a
                    href="javascript:void(0)"
                    class="button button-blue"
                    @click="$emit('moveToStep', [3, 4])"
                    >Proceed to Confirm</a
                >
                <McafeeSecureBadge />
            </div>
        </div>
    </div>
</template>
<script>
import McafeeSecureBadge from '@/components/McafeeSecureBadge.vue';
import CheckoutStep3TextField from '@/components/CheckoutStep3TextField.vue';
import CheckoutStep3Birthday from '@/components/CheckoutStep3Birthday.vue';
import CheckoutBillingFields from '@/components/CheckoutBillingFields.vue';
import FormFieldState from '@/components/FormFieldState.vue';
import FormFieldCountry from '@/components/FormFieldCountry.vue';
export default {
    components: {
        McafeeSecureBadge,
        CheckoutStep3TextField,
        CheckoutStep3Birthday,
        CheckoutBillingFields,
        FormFieldState,
        FormFieldCountry
    },
    data() {
        return {
            SelectedDataChild: this.SelectedData,
            changedAccData: false
        };
    },
    created: function() {
        window.ga('ec:setAction','checkout', {
            'step': 3,
            'option': this.SelectedData.turnaround.FriendlyName + ' turnaround'
        });
        window.ga('send', {
            hitType: 'event',
            eventCategory: 'checkoutstep3',
            eventAction: 'click',
            eventLabel: 'Checkout Step 3',
            eventValue: 1
        });
        window.ga('send', 'pageview', this.siteUrl + 'checkout/step3');
    },
    props: {
        CheckoutData: Object,
        SelectedData: Object
    },
    mounted: function() {
        this.$nextTick(function() {
            this.$emit('loaded', true);
        });
    },
    methods: {
        showSaveData() {
            if(!this.isAccountDataMissing() && this.CheckoutData.AccountData && this.changedAccData) {
            
                if(this.CheckoutData.AccountData.CustomerType == 'account') {
                    return true;
                }
            }
            return false;
        },
        isAccountDataMissing() {
            if(this.CheckoutData.AccountData) {
                const acData = this.CheckoutData.AccountData;
                if(acData.CustomerType == 'account') {
                    let ret = false;
                    if(acData.FirstName == '') {
                        ret = true;
                    }
                    if(acData.LastName == '') {
                        ret = true;
                    }
                    if(acData.Address1 == '') {
                        ret = true;
                    }
                    if(acData.City == '') {
                        ret = true;
                    }
                    if(acData.State == '') {
                        ret = true;
                    }
                    if(acData.Zip == '') {
                        ret = true;
                    }
                    if(acData.Country == '') {
                        ret = true;
                    }
                    if(acData.BirthdayMonth == '') {
                        ret = true;
                    }
                    if(ret == true) {
                        this.SelectedDataChild.savedData = true;
                        this.$emit('updateCheckoutData', this.SelectedDataChild);
                    }
                    return ret;
                }
            }
            return false;
        }
    },
};
</script>
