<template>
    <div id="app">
        <Header />
        <div class="sectionPageTitle">
            <div class="container conPaddingT conWidth">
                <h1 class="pageTitle">Checkout</h1>
            </div>
        </div>
        <Breadcrumbs :breadcrumbs="breadcrumbs" />
        <section class="pageContent">
            <CheckoutSteps
                :steps="steps"
                :stepActive="stepActive"
                :userType="userType"
                @moveToStep="moveToStep($event)"
            />
            <CheckoutRegisterPopup
                :SelectedData="SelectedData"
                v-if="stepActive == 'step5'"
            />
            <div class="container conPaddingS conWidth">
                <Loader v-if="isLoading" />
                <div class="col col-left">
                    <transition name="fade">
                        <ConfirmExtendedDeadline
                            :SelectedData="SelectedData"
                            :stepActive="stepActive"
                            v-if="dataLoaded"
                            @updateCheckoutData="updateCheckoutData($event)"
                            @cleanError="errors=false"
                        />
                    </transition>
                    <transition name="fade">
                        <ConfirmFlatDiscountUnavailable
                            :SelectedData="SelectedData"
                            :stepActive="stepActive"
                            v-if="dataLoaded"
                            @updateCheckoutData="updateCheckoutData($event)"
                            @cleanError="errors=false"
                        />
                    </transition>
                    <transition name="fade">
                        <CheckoutErrorMessages :errors="errors" v-if="errors && !isLoading" />
                    </transition>
                    <transition name="fade">
                        <CheckoutHolidayMessage
                            v-if="
                                CheckoutData.Holiday &&
                                    stepActive == 'step4' &&
                                    !isLoading
                            "
                            @updateCheckoutData="updateCheckoutData($event)"
                            :holidayDataProp="CheckoutData.Holiday"
                            :turnaroundProp="SelectedData.turnaround"
                            :CheckoutDataProp="CheckoutData"
                            :SelectedDataProp="SelectedData"
                            :totalsProp="totals"
                        />
                    </transition>
                    <transition name="fade">
                        <CheckoutWordLimitValidation
                            :turnaround="SelectedData.turnaround"
                            :turnarounds="CheckoutData.Turnarounds"
                            :numberWords="SelectedData.numberWords"
                            :maxLimit="CheckoutData.Turnarounds[0].WordLimit"
                            v-if="wordLimitMet && !isLoading"
                        />
                    </transition>
                    <OnsaleCountdown :Onsale="CheckoutData.Onsale" v-if="CheckoutData.Onsale != false && !isLoading && stepActive != 'step5'" />
                    <div
                        class="formBlock formBlockCheckout"
                        v-show="!isLoading"
                    >
                        <transition name="fade">
                            <router-view
                                @loaded="turnOffLoader"
                                @updateCheckoutData="updateCheckoutData($event)"
                                @customerOptionUpdate="
                                    updateCustomerOption($event)
                                "
                                @moveToStep="moveToStep($event)"
                                @quoteSent="quoteSent = true;SelectedData.liveTracking = true;SelectedData.liveTrackingTime = $event"
                                @livetracking="SelectedData.liveTracking = true;SelectedData.liveTrackingTime = $event"
                                :CheckoutData="CheckoutData"
                                :SelectedData="SelectedData"
                                :stepActive="stepActive"
                                :totals="totals"
                                :onePercentDeal="onePercentDeal"
                                :upgradeTurnaround="upgradeTurnaround"
                                :turnaroundPrice="turnPrice"
                            />
                        </transition>
                    </div>
                    <OnsaleCountdown :Onsale="CheckoutData.Onsale" v-if="CheckoutData.Onsale != false && !isLoading && stepActive != 'step5'" />
                </div>
                <div class="col col-right">
                    <RightTotal
                        :totals="totals"
                        :turnaround="SelectedData.turnaround"
                        :CheckoutData="CheckoutData"
                        :minAmountUsed="SelectedData.minAmountUsed"
                        :turnaroundPrice="turnPrice"
                        v-show="stepActive != 'step1'"
                    />
                    <CheckoutRightColumn />
                </div>
            </div>
        </section>
        <div class="alignCenter" style="font-size:12px;padding:15px 0;">
            © 2010 - {{ Currentyear }} ProofreadingPal LLC - All Rights
            Reserved.
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import Header from '@/components/Header.vue'; // @ is an alias to /src
import Breadcrumbs from '@/components/Breadcrumbs.vue';
import CheckoutSteps from '@/components/CheckoutSteps.vue';
import CheckoutRightColumn from '@/components/CheckoutRightColumn.vue';
import RightTotal from '@/components/RightTotal.vue';
import Loader from '@/components/Loader.vue';
import CheckoutPricesFunctions from '@/components/CheckoutPricesFunctions.vue';
import CheckoutStep1Validation from '@/components/CheckoutStep1Validation.vue';
import CheckoutStep2Validation from '@/components/CheckoutStep2Validation.vue';
import CheckoutStep3Validation from '@/components/CheckoutStep3Validation.vue';
import CheckoutStep4Validation from '@/components/CheckoutStep4Validation.vue';
import CheckoutErrorMessages from '@/components/CheckoutErrorMessages.vue';
import CheckoutWordLimitValidation from '@/components/CheckoutWordLimitValidation.vue';
import CheckoutUpgradeFunctions from '@/components/CheckoutUpgradeFunctions.vue';
import CheckoutHolidayMessage from '@/components/CheckoutHolidayMessage.vue';
import ConfirmExtendedDeadline from '@/components/ConfirmExtendedDeadline.vue';
import ConfirmFlatDiscountUnavailable from '@/components/ConfirmFlatDiscountUnavailable.vue';
import CheckoutRegisterPopup from '@/components/CheckoutRegisterPopup.vue';
import TestPrefil from '@/components/TestPrefil.vue';
import OnsaleCountdown from '@/components/OnsaleCountdown.vue';

export default {
    mixins: [
        CheckoutPricesFunctions,
        CheckoutStep1Validation,
        CheckoutStep2Validation,
        CheckoutStep3Validation,
        CheckoutStep4Validation,
        CheckoutUpgradeFunctions,
        TestPrefil
    ],
    components: {
        Header,
        Breadcrumbs,
        CheckoutSteps,
        CheckoutRightColumn,
        RightTotal,
        Loader,
        CheckoutErrorMessages,
        CheckoutWordLimitValidation,
        CheckoutHolidayMessage,
        ConfirmExtendedDeadline,
        ConfirmFlatDiscountUnavailable,
        CheckoutRegisterPopup,
        OnsaleCountdown,
    },
    data: function() {
        return {
            breadcrumbs: [
                {title: 'Home', link: '/'},
                {title: 'Checkout',}
            ],
            routeName: this.$route.name,
            apiUniqueNumber: Math.ceil(Math.random()*1000000),
            isLoading: true,
            errors: false,
            wordLimitMet: false,
            pageSubTitle: '',
            Currentyear: new Date().getFullYear(), // for copyrights in footer
            dataLoaded: false,
            firstLoad: true,
            movingStepsActive: false,
            steps: {
                step1: { completed: false },
                step2: { completed: false },
                step3: { completed: false },
                step4: { completed: false },
                step5: { completed: false }
            },
            stepActive: 'step1',
            preselectTurnaround: false,
            quoteCode: false,
            CheckoutData: {},
            SelectedData: {
                liveTracking: false,
                liveTrackingTime: 0,
                savedData: false,
                quoteSent: false,
                customerType: '',
                minAmountUsed: false,
                totalBeforeMinAmount: 0,
                quoteRequest: false,
                turnaround: {},
                singleOption: false,
                singleDiscount: 0,
                holidayOptions: {
                    totalBefore: false
                },
                customerOrderType: '',
                numberWords: '',
                fileUploaded: '',
                selectedWritingStyle: false,
                englishType: 'US English',
                description: '',
                firstName: '',
                lastName: '',
                address1: '',
                address2: '',
                city: '',
                state: '',
                zip: '',
                country: '',
                birthday: { mm: '', dd: '', yy: '' },
                confirmBirthday: { mm: '', dd: '', yy: '' },
                email: '',
                confirmEmail: '',
                cell: '',
                styleGuide: '',
                billingData: {
                    paymentType: '',
                    creditCardType: '',
                    creditCardNumber: '',
                    cvv2Number: '',
                    expirationDate: { mm: '', yy: '' }
                },
                couponData: {
                    couponCode: ''
                },
                FlatDiscountConfirm: false
            }
        };
    },
    created: function() {
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');
        const invoice = urlParams.get('invoice');
        const PayerID = urlParams.get('PayerID');
        const act = urlParams.get('act');
        const id = urlParams.get('id');
        const code = urlParams.get('code');
        if (id) {
            if (id > 0) {
                this.preselectTurnaround = id;
            }
        }
        if (code) {
            this.quoteCode = code;
        }
        if (token) {
            this.SelectedData.PaypalExpress = {};
            this.SelectedData.PaypalExpress.token = token;
            this.SelectedData.invoice = invoice;
            this.SelectedData.PaypalExpress.PayerID = PayerID;
            this.SelectedData.PaypalExpress.act = act;
        } else {
            this.SelectedData.invoice = new Date().getTime();
            //this.SelectedData.invoice = 1621520875206;
            this.$router.push({ name: 'Step 1' });
        }
        //throw new Error('Error text.');
        //console.log(act);
        //this.testDataPrefill();
    },
    mounted: function() {
        // get all necessary checkout data
        this.load();
    },
    watch: {
        $route(to) {
            this.routeName = to.name;
            this.isLoading = true;
        },
        dataLoaded: function() {
            if (this.dataLoaded) {
                if (this.SelectedData.PaypalExpress) {
                    this.getSavedData(this.SelectedData.PaypalExpress.token, this.SelectedData.PaypalExpress.act);
                }
            }
        }
    },
    computed: {
        totals: function() {
            if (
                this.SelectedData.numberWords > 0 &&
                this.turnPrice
            ) {
                // get starting amount
                let amount = this.pricePerTurnaround(
                    this.turnPrice,
                    this.SelectedData.singleOption
                );
                amount = this.checkMinimalAmount(amount);
                const object = {};
                object.amount = amount;
                let total = amount;

                // get other options like surcharges, coupons ...
                object.totalOptions = this.getTotalOptions(amount);
                const totalOptions = object.totalOptions;
                totalOptions.map(function(value) {
                    total = value.total;
                });
                total = parseFloat(total);
                object.total = total.toFixed(2);
                return object;
            }
            return false;
        },
        turnPrice: function() {
            if (this.SelectedData.numberWords > 0) {
                const smallProjectLimit = parseInt(this.SelectedData.turnaround.SmallProjectLimit);
                if (
                this.SelectedData.numberWords <= smallProjectLimit 
                && this.SelectedData.turnaround.SmallProjectAvailable == 'yes'
                ) {
                    return this.SelectedData.turnaround.SmallProjectPrice;
                } else {
                    return this.SelectedData.turnaround.Price;
                }
            }
            return false;
        },
        userType: function() {
            if (this.CheckoutData.AccountData) {
                return this.CheckoutData.AccountData.CustomerType;
            }
            return '';
        },
        onePercentDeal: function() {
            if (
                this.SelectedData.turnaround.SingleAvailable &&
                !this.SelectedData.singleOption &&
                this.singleConditionMet()
            ) {
                const percent = this.getSingleDiscount() * 100;
                return percent;
            }
            return false;
        }
    },
    methods: {
        load() {
            this.getData();
        },
        singleConditionMet() {
            if (this.SelectedData.customerOrderType) {
                return false;
            } else if (this.SelectedData.numberWords) {
                const numwords = this.SelectedData.numberWords;
                if (numwords > 3000) {
                    return true;
                }
            }
            return false;
        },
        turnOffLoader() {
            if (this.dataLoaded) {
                setTimeout(() => (this.isLoading = false), 500);
            }
        },
        updateCheckoutData(object) {
            for (const value in object) {
                this.SelectedData[value] = object[value];
            }
            let numWords = parseInt(this.SelectedData.numberWords);
            if(isNaN(numWords)) {
                numWords = '';
            }
            this.SelectedData.numberWords = numWords;
            if(this.SelectedData.singleOption) {
                this.SelectedData.singleDiscount = this.getSingleDiscount();
            } else {
                this.SelectedData.singleDiscount = 0;
            }
            
            this.checkWordLimit();
            this.setTurnaroundsAvailability();
        },
        setTurnaroundsAvailability() {
            const turnarounds = this.CheckoutData.Turnarounds;
            for (const value in turnarounds) {
                const WordLimit = parseInt(turnarounds[value].WordLimit);
                if (this.SelectedData.numberWords > WordLimit) {
                    this.CheckoutData.Turnarounds[value].Disabled = true;
                } else {
                    this.CheckoutData.Turnarounds[value].Disabled = false;
                }
            }
        },
        checkWordLimit() {
            const WordLimit = parseInt(this.SelectedData.turnaround.WordLimit);
            if (this.SelectedData.numberWords > WordLimit) {
                this.wordLimitMet = true;
            } else {
                this.wordLimitMet = false;
            }
        },
        updateCustomerOption(event) {
            this.SelectedData.customerOrderType = event;
            window.scrollTo(0, 0);
            this.getData();
        },
        getSavedData(token, act) {
            this.isLoading = true;
            const email = this.SelectedData.email
            axios
                .get(
                    this.siteUrl +
                        'checkout/API/SavedDataPull.php?apiUnique='+this.apiUniqueNumber+'&token=' +
                        token +'&ACT='+act+'&email='+email
                )
                .then(response => {
                    console.log(response.data);
                    if (response.data.SelectedData != 'false') {
                        const PaypalExpress = this.SelectedData.PaypalExpress;
                        this.SelectedData = response.data.SelectedData;
                        this.SelectedData.PaypalExpress = PaypalExpress;
                        if (PaypalExpress.act == 'ret') {
                            this.stepActive = 'step4';
                            this.steps.step1.completed = true;
                            this.steps.step2.completed = true;
                            this.steps.step3.completed = true;
                            this.steps.step4.completed = true;
                            //this.$router.push({ name: 'Step 4' });
                            this.proceedPayment();
                            
                        } else if (PaypalExpress.act == 'cancel') {
                            this.stepActive = 'step3';
                            this.steps.step2.completed = true;
                            this.$router.push({ name: 'Step 3' });
                            this.isLoading = false;
                        }
                    } else {
                        this.SelectedData.PaypalExpress = false;
                        this.SelectedData.invoice = new Date().getTime();
                    }
                });
        },
        getData() {
            this.isLoading = true;
            let preselectCustomerOption = 'yes';
            if (this.SelectedData.PaypalExpress || !this.firstLoad) {
                preselectCustomerOption = false;
            }
            axios
                .get(
                    this.siteUrl +
                        'checkout/API/CheckoutData.php?apiUnique='+this.apiUniqueNumber+'&preselectCustomerOption=' +
                        preselectCustomerOption +
                        '&code=' +
                        this.quoteCode +
                        '&customerOption=' +
                        this.SelectedData.customerOrderType
                )
                .then(response => {
                    this.CheckoutData = response.data;
                    console.log(response.data);
                    if (this.preselectTurnaround) {
                        for (const value in this.CheckoutData.Turnarounds) {
                            if (
                                this.CheckoutData.Turnarounds[value].ID ==
                                this.preselectTurnaround
                            ) {
                                this.SelectedData.turnaround = this.CheckoutData.Turnarounds[
                                    value
                                ];
                            }
                        }
                    }
                    if (this.CheckoutData.CustomerCheckoutOptions) {
                        if (
                            this.CheckoutData.CustomerCheckoutOptions[
                                'preselect'
                            ]
                        ) {
                            this.SelectedData.customerOrderType = this.CheckoutData.CustomerCheckoutOptions[
                                'preselect'
                            ];
                        }
                    }

                    if (this.CheckoutData.QuoteCache) {
                        const QuoteCache = this.CheckoutData.QuoteCache;
                        this.SelectedData.firstName = QuoteCache.FirstName;
                        this.SelectedData.lastName = QuoteCache.LastName;
                        this.SelectedData.email = QuoteCache.Email;
                        this.SelectedData.cell = QuoteCache.Cell;
                        this.SelectedData.numberWords = QuoteCache.NumberWords;
                    }
                    if (this.CheckoutData.AccountData) {
                        const accData = this.CheckoutData.AccountData;
                        this.SelectedData.ID = accData.Id;
                        this.SelectedData.customerType = accData.CustomerType;
                        this.SelectedData.firstName = accData.FirstName;
                        this.SelectedData.lastName = accData.LastName;
                        this.SelectedData.address1 = accData.Address1;
                        this.SelectedData.address2 = accData.Address2;
                        this.SelectedData.city = accData.City;
                        this.SelectedData.state = accData.State;
                        this.SelectedData.zip = accData.Zip;
                        this.SelectedData.country = accData.Country;
                        this.SelectedData.birthday.mm = accData.BirthdayMonth;
                        this.SelectedData.birthday.dd = accData.BirthdayDay;
                        this.SelectedData.birthday.yy = accData.BirthdayYear;
                        this.SelectedData.confirmBirthday.mm =
                            accData.BirthdayMonth;
                        this.SelectedData.confirmBirthday.dd =
                            accData.BirthdayDay;
                        this.SelectedData.confirmBirthday.yy =
                            accData.BirthdayYear;
                        this.SelectedData.email = accData.Email;
                        this.SelectedData.confirmEmail = accData.Email;
                        this.SelectedData.cell = accData.Cell;
                        this.SelectedData.credit = accData.Credit;
                        const styleGuide = [];
                        if (accData.StyleGuide) {
                            styleGuide.push(accData.StyleGuide);
                        }
                        if (accData.StyleGuide2) {
                            styleGuide.push(accData.StyleGuide2);
                        }
                        if (accData.StyleGuide3) {
                            styleGuide.push(accData.StyleGuide3);
                        }
                        if (accData.StyleGuide4) {
                            styleGuide.push(accData.StyleGuide4);
                        }
                        if (accData.StyleGuide5) {
                            styleGuide.push(accData.StyleGuide5);
                        }
                        this.CheckoutData.StyleGuide = styleGuide;
                    }
                    this.dataLoaded = true;
                    this.firstLoad = false;
                    setTimeout(() => (this.isLoading = false), 500);
                });
        },
        checkHoliday() {
            axios
                .get(
                    this.siteUrl + 'checkout/API/CheckoutData.php?apiUnique='+this.apiUniqueNumber+'&check=Holiday'
                )
                .then(response => {
                    //console.log(response.data);
                    this.CheckoutData.Holiday = response.data.Holiday;
                });
        },
        moveToStep(steps) {
            if(this.movingStepsActive) {
                return;
            }
            this.movingStepsActive = true;
            const from = steps[0];
            let to = steps[1];
            let ret = true;
            // always validate 1st step
            if (this.validateStep1()) {
                this.steps.step1.completed = true;
                ret = true;
            } else {
                ret = false;
                to = 1;
            }
            if (from == 2 && ret) {
                if (this.validateStep2()) {
                    this.steps.step2.completed = true;
                    ret = true;
                } else {
                    ret = false;
                    to = 2;
                }
            }
            if (from == 3 && ret) {
                if (this.validateStep3()) {
                    this.steps.step3.completed = true;
                    ret = true;
                } else {
                    ret = false;
                    to = 3;
                }
            }
            if (from == 4 && ret) {
                if (this.validateStep4()) {
                    this.steps.step4.completed = true;
                    ret = true;
                } else {
                    ret = false;
                    to = 4;
                }
            }
            if (ret) {
                if (to == 1) {
                    this.stepActive = 'step1';
                    if (this.$route.name != 'Step 1') {
                        this.$router.push({ name: 'Step 1' });
                    }
                } else if (to == 2) {
                    if(this.steps.step1.completed == true) {
                        this.stepActive = 'step2';
                        if (this.$route.name != 'Step 2') {
                            this.$router.push({ name: 'Step 2' });
                        }
                    }
                } else if (to == 3) {
                    if(this.steps.step2.completed == true) {
                        this.stepActive = 'step3';
                        if (this.$route.name != 'Step 3') {
                            this.$router.push({ name: 'Step 3' });
                        }
                    }
                } else if (to == 4) {
                    if(this.userType == 'corporate') {
                        this.steps.step3.completed = true
                    }
                    if(this.steps.step3.completed == true) {
                        this.checkHoliday();
                        this.stepActive = 'step4';
                        if (this.$route.name != 'Step 4') {
                            this.$router.push({ name: 'Step 4' });
                        }
                    }
                } else if (to == 5) {
                    if(this.steps.step4.completed == true) {
                        this.stepActive = 'step5';
                        if (this.$route.name != 'Step 5') {
                            this.$router.push({ name: 'Step 5' });
                        }
                    }
                }
            }
            window.scrollTo(0, 0);
            this.movingStepsActive = false;
        }
    }
};
</script>

<style lang="scss">
// transition css
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.7s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
    opacity: 0;
}
// /transition css
.onsaleCountdown {
    font-size: 22px;
    text-align: left;
    padding: 5px 15px;
    margin-top: 10px;
    color: #414141;
    font-weight: normal;
    background: #f5fae8;
    margin-bottom: 20px;
}
.formBlock{
    margin-bottom: 20px;
}
.formRow .button {
    margin-bottom: 10px;
}
.secureRight img {
    margin-left: 4px;
}
</style>
