<template>
    <div v-if="CheckoutData">
        <Loader v-if="isLoading" />
        <div class="checkoutHeading">
            <div class="checkoutInfo">
                <p>Calculate your price.</p>
            </div>
            <div class="checkoutTotal">
                <p>{{ SelectedTurnaroundText }}</p>
            </div>
        </div>
        <div class="checkoutFormHolder" v-show="!isLoading">
            <div class="formRow container">
                <div class="col col_2_of_2">
                    <CheckoutSelectSpeeds
                        v-if="CheckoutData.Turnarounds"
                        :turnarounds="CheckoutData.Turnarounds"
                        :flatOnBoard="
                            CheckoutData.CustomerCheckoutOptions.FlatOnBoard
                        "
                        :SelectedData="SelectedData"
                        @turnaroundUpdate="$emit('updateCheckoutData', $event)"
                    />
                </div>
            </div>
            <div
                class="formRow container"
                
            >
                <div class="blueFormRow">
                    <div class="col col-2">
                        <CheckoutUpload
                            @fileUploaded="
                                (SelectedDataChild.fileUploaded = $event),
                                    $emit(
                                        'updateCheckoutData',
                                        SelectedDataChild
                                    )
                            "
                            :fileUploaded="SelectedData.fileUploaded"
                        />
                    </div>
                </div>
            </div>
            <div
                class="formRow container"
                
            >
                <div style="margin-bottom:15px;">
                    <label class="formLabel">Document Description</label>
                    <textarea
                        class="formTextarea"
                        v-model="SelectedDataChild.description"
                        @input="$emit('updateCheckoutData', SelectedDataChild)"
                    ></textarea>
                    <div class="step3RightTxtNote">
                        (max 2,000 characters)
                    </div>
                </div>
                <div class="clearAll"></div>
            </div>

            <div class="formRow container">
                <div class="col col-2">
                    <label class="formLabel">Enter Word Count</label>
                    <input
                        type="text"
                        class="formText"
                        :value="SelectedData.numberWords"
                        readonly="readonly"
                    />
                </div>
                <div class="col col-2">
                    <label class="formLabel">Coupon Code</label>
                    <div class="couponCodeField">
                        <input type="text" class="formText" v-model="coupon" />
                        <transition name="fade">
                            <div class="fileError" v-if="couponError">
                                <p>{{ couponError }}</p>
                            </div>
                        </transition>
                        <transition name="fade">
                            <div class="fileSuccess" v-if="couponSuccess">
                                <p>
                                    Your coupon code is valid and will be
                                    calculated on step "Confirm" of checkout.
                                </p>
                            </div>
                        </transition>
                        <a href="javascript:void(0)" @click="couponCode(false)"
                            >Apply Code</a
                        >
                    </div>
                </div>
            </div>

            <div class="formRow container">
                <div class="col col_2_of_2">
                    <a
                        href="javascript:void(0)"
                        class="button button-blue"
                        @click="stepProceed()"
                        >Proceed to Payment Page</a
                    >
                    <McafeeSecureBadge />
                </div>
            </div>

            <div class="formRow container">
                <div class="col col_2_of_2">
                    <div
                        v-if="onePercentDeal"
                        style="background:#f2f9ee;border:2px solid #6f9802;padding:10px;color:#648900;font-size:16px;font-weight:bold;"
                    >
                        Save <strong>{{ onePercentDeal }}</strong
                        >% and choose a One Proofreader option above.
                    </div>
                </div>
                <div class="clearAll"></div>
            </div>
        </div>
    </div>
</template>
<script>
import axios from 'axios';
import CheckoutSelectSpeeds from '@/components/CheckoutSelectSpeeds.vue';
import CheckoutUpload from '@/components/CheckoutUpload.vue';
import CheckoutPricesFunctions from '@/components/CheckoutPricesFunctions.vue';
import McafeeSecureBadge from '@/components/McafeeSecureBadge.vue';
import Loader from '@/components/Loader.vue';
export default {
    mixins: [
        CheckoutPricesFunctions,
    ],
    components: {
        CheckoutSelectSpeeds,
        CheckoutUpload,
        McafeeSecureBadge,
        Loader
    },
    computed: {
        SelectedTurnaroundText: function() {
            if (this.SelectedData.turnaround) {
                return (
                    this.SelectedData.turnaround.FriendlyName +
                    ' turnaround, ' +
                    this.dollarPrice(this.turnaroundPrice, this.SelectedData.singleOption) +
                    ' per word (' +
                    this.centPrice(this.turnaroundPrice, this.SelectedData.singleOption) +
                    ' cents)'
                );
            }
            return 'Select turnaround speed.';
        }
    },
    created: function() {
        window.ga('ec:setAction','checkout', {
            'step': 2,
            'option': this.SelectedData.turnaround.FriendlyName + ' turnaround'
        });
        window.ga('send', 'pageview', this.siteUrl + 'checkout/step2');
    },
    data: function() {
        return {
            CouponData: Object,
            couponError: false,
            couponSuccess: false,
            isLoading: false,
            coupon: this.SelectedData.couponData.couponCode,
            SelectedDataChild: this.SelectedData
        };
    },
    props: {
        CheckoutData: Object,
        SelectedData: Object,
        onePercentDeal: [Boolean, String, Number],
        turnaroundPrice: [Boolean, String, Number],
    },
    mounted: function() {
        this.$nextTick(function() {
            this.$emit('loaded', true);
        });
        if (!this.SelectedData.quoteSent && this.SelectedData.quoteRequest) {
            this.sendQuote(true);
        } else if(!this.SelectedData.liveTracking) {
            this.sendQuote(false);
        }
        this.SelectedData.FlatChecked2 = false;
    },
    methods: {
        sendQuote(quote) {
            const formData = new FormData();
            formData.append('firstName', this.SelectedDataChild.firstName);
            formData.append('lastName', this.SelectedDataChild.lastName);
            formData.append('email', this.SelectedDataChild.email);
            formData.append('cell', this.SelectedDataChild.cell);
            if(!quote) {
                formData.append('doc', this.SelectedDataChild.fileUploaded.url);
            } else {
                formData.append('doc', 'quote');
            }
            
            formData.append('doc_dec', this.SelectedDataChild.description);
            formData.append(
                'wstyle',
                this.SelectedDataChild.selectedWritingStyle.name
            );
            formData.append('englishType', this.SelectedDataChild.englishType);
            formData.append(
                'turnaroundspeeds',
                this.SelectedDataChild.turnaround.ID
            );
            formData.append('numberWords', this.SelectedDataChild.numberWords);
            axios
                .post(this.siteUrl + 'checkout/API/SendQuote.php', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                })
                .then(response => {
                    if(quote) {
                            window.ga('send', {
                            hitType: 'event',
                            eventCategory: 'quickquote',
                            eventAction: 'click',
                            eventLabel: 'Quick Quote',
                            eventValue: 1
                        });
                        this.$emit('quoteSent', response.data);
                    } else {
                        this.$emit('livetracking', response.data);
                    }
                    console.log(response.data);
                });
        },
        stepProceed() {
            if (
                this.coupon &&
                !this.couponError &&
                !this.CouponData.couponData.couponCode
            ) {
                this.couponCode(true);
            } else {
                let CustomerType = false;
                if (this.CheckoutData.AccountData) {
                    CustomerType = this.CheckoutData.AccountData.CustomerType;
                }
                if (CustomerType == 'corporate') {
                    this.$emit('moveToStep', [2, 4]);
                } else {
                    this.$emit('moveToStep', [2, 3]);
                }
            }
        },
        couponCode(goToNext) {
            this.isLoading = true;
            this.couponError = false;
            this.couponSuccess = false;
            const formData = new FormData();
            formData.append('coupon', this.coupon);
            formData.append('turnaroundId', this.SelectedData.turnaround);
            formData.append('amount', 20.0);
            formData.append('firstName', this.SelectedData.firstName);
            formData.append('lastName', this.SelectedData.lastName);
            formData.append('email', this.SelectedData.email);
            formData.append('phone', this.SelectedData.phone);
            formData.append('acid', this.userId);
            axios
                .post(this.siteUrl + 'checkout/API/CouponData.php', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                })
                .then(response => {
                    if (response.data.error) {
                        this.couponError = response.data.error;
                        this.CouponData.couponData = {};
                    } else {
                        this.CouponData.couponData = response.data;
                        this.couponSuccess = true;
                        if (!goToNext) {
                            setTimeout(
                                () => (this.couponSuccess = false),
                                3000
                            );
                        }
                    }
                    this.$emit('updateCheckoutData', this.CouponData);
                    this.dataLoaded = true;
                    this.isLoading = false;
                    if (goToNext) {
                        setTimeout(
                            () => this.$emit('moveToStep', [2, 3]),
                            1000
                        );
                    }
                });
        }
    }
};
</script>

<style lang="scss" scoped>
.fileUploadDiv {
    overflow: hidden;
    margin-right: 20px;
}
.fileError {
    margin: 10px 20px 15px 0;
    padding: 10px 15px 10px 15px;
    background-color: #faebec;
    border: #d8b5b7 1px solid;
    p {
        margin: 0;
        color: #ae101c;
        font-size: 13px;
    }
}
.fileSuccess {
    margin: 10px 20px 15px 0;
    padding: 10px 15px 10px 15px;
    background-color: #f2faeb;
    border: #c5d8b5 1px solid;
    p {
        margin: 0;
        color: #4e841d;
        font-size: 13px;
    }
}
.blueFormRow {
    background-color: #fff;
    border-radius: 5px;
    float: left;
    width: 100%;
    padding: 0;
}
</style>
