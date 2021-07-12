<template>
    <div v-if="CheckoutData">
        <div class="checkoutHeading">
            <div class="checkoutInfo">
                <p>Submit Your Document</p>
            </div>

            <div class="checkoutTotal">
                <p>{{SelectedTurnaroundText}}</p>
            </div>
        </div>

        <div class="checkoutFormHolder">
            <div class="formRow container">
                <div class="col col_2_of_2">
                    <CheckoutSelectSpeeds
                        v-if="CheckoutData.Turnarounds"
                        :turnarounds="CheckoutData.Turnarounds"
                        :flatOnBoard="CheckoutData.CustomerCheckoutOptions.FlatOnBoard"
                        :SelectedData="SelectedData"
                        :stepActive="stepActive"
                        @turnaroundUpdate="$emit('updateCheckoutData', $event)"
                    />
                </div>
            </div>

            <CheckoutCustomerOptions
                v-if="CheckoutData.CustomerCheckoutOptions"
                type="prof1reader"
                :CustomerCheckoutOptions="CheckoutData.CustomerCheckoutOptions"
                :SelectedData="SelectedData"
                @customerOptionUpdate="$emit('customerOptionUpdate', $event)"
            />

            <CheckoutCustomerOptions
                v-if="CheckoutData.CustomerCheckoutOptions"
                type="proflitereader"
                :CustomerCheckoutOptions="CheckoutData.CustomerCheckoutOptions"
                :SelectedData="SelectedData"
                @customerOptionUpdate="$emit('customerOptionUpdate', $event)"
            />

            <CheckoutCustomerOptions
                v-if="CheckoutData.CustomerCheckoutOptions"
                type="liteplus"
                :CustomerCheckoutOptions="CheckoutData.CustomerCheckoutOptions"
                :SelectedData="SelectedData"
                @customerOptionUpdate="$emit('customerOptionUpdate', $event)"
            />

            <div class="formRow container">
                <div class="col col-2" v-if="this.CheckoutData.StyleGuide && this.CheckoutData.StyleGuide.length">
                    <label class="formLabel">Style Guide</label>
                    <select v-model="SelectedDataChild.styleGuide" class="formSelect">
                        <option value="">Select Style Guide</option>
                        <option v-for="(styleGuide, index) in this.CheckoutData.StyleGuide" :key="styleGuide.key" :value="index+1">{{styleGuide.name}}</option>
                    </select>
                </div>
                <div class="col col-2">
                    <label class="formLabel">English Type</label>
                    <select
                        name="english_type"
                        class="formSelect"
                        v-model="SelectedDataChild.englishType"
                        @change="$emit('updateCheckoutData', SelectedDataChild)"
                    >
                        <option value="US English">US English</option>
                        <option value="Canadian English">Canadian English</option>
                        <option value="UK English">UK English</option>
                    </select>
                </div>
                <div class="clearAll"></div>
            </div>

            <div class="formRow container">
                <div class="col col_2_of_2">
                    <label class="formLabel">Grammar</label>
                    <p>
                        ProofreadingPal corrects grammatical errors, including
                        spelling, punctuation, capitalization, and verb tense.
                        ProofreadingPal will also edit your document for
                        sentence structure, clarity, and style.
                    </p>
                </div>
                <div class="clearAll"></div>
            </div>

            <div class="formRow container">
                <div class="col col_2_of_2">
                    <CheckoutWritingStyle
                        @updateWritingStyle="
                            (SelectedDataChild.selectedWritingStyle = $event),
                                $emit('updateCheckoutData', SelectedDataChild)
                        "
                        :selectedWritingStyle="
                            SelectedData.selectedWritingStyle
                        "
                    />
                </div>
                <div class="clearAll"></div>
            </div>

            <div class="formRow container">
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
                            v-if="!SelectedDataChild.quoteRequest"
                        />
                        <div id="quoteDiv">
                            <input
                                type="checkbox"
                                v-model="SelectedDataChild.quoteRequest"
                                @change="$emit('updateCheckoutData', SelectedDataChild)"
                            />
                            I am only looking for a quote<br /><br />
                        </div>
                    </div>

                    <div class="col col-2">
                        <label class="formLabel">Enter Word Count</label>

                        <input
                            type="text"
                            class="formText"
                            v-model="SelectedDataChild.numberWords"
                            @input="$emit('updateCheckoutData', SelectedDataChild)"
                        /><br />
                        <a
                            href="javascript:void(0)"
                            class="step3RightTxtNote"
                            @click="showNumWordsHelper = !showNumWordsHelper"
                            ><i class="fa fa-question-circle"></i> Find your
                            word count</a
                        >
                    </div>
                </div>
            </div>

            <transition name="fade">
                <CheckoutNumberWordsHelper
                    v-if="showNumWordsHelper"
                    :showNumWordsHelper="showNumWordsHelper"
                    @hideHelper="showNumWordsHelper = false"
                    @helperCount="SelectedData.numberWords = $event"
                />
            </transition>

            <div class="formRow container" v-if="SelectedDataChild.customerType == 'corporate' || SelectedDataChild.customerType == 'account'">
                <div class="col col-2">
                    <label class="formLabel">Project Identification (optional)</label>
                    <div class="step3RightTxtNote">Use this field to enter helpful project identification information for your internal records (i.e., customer name/number, purchase order number, or other unique project-related info).</div>
                    <input type="text" class="formText" v-model="SelectedDataChild.identification"
                            @input="$emit('updateCheckoutData', SelectedDataChild)" />
                </div>
                <div class="clearAll"></div>
            </div>

            <div class="formRow container" v-if="!SelectedDataChild.quoteRequest">
                <div class="">
                    <div id="descBox" style="margin-bottom:15px;">
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
                </div>
                <div class="clearAll"></div>
            </div>
            <div v-if="SelectedDataChild.customerType != 'corporate'">
                <div class="formHeader">Document Contact Information</div>
                <p class="corporatePrices" id="quoteMessage" style="display:none;">
                    A quote will be emailed to you after you click the button below.
                </p>
                <div class="formRow container">
                    <div class="col col-2">
                        <input
                            type="text"
                            placeholder="*First Name"
                            class="formText"
                            v-model="SelectedDataChild.firstName"
                            @input="$emit('updateCheckoutData', SelectedDataChild)"
                        />
                    </div>
                    <div class="col col-2">
                        <input
                            type="text"
                            placeholder="Last Name"
                            class="formText"
                            v-model="SelectedDataChild.lastName"
                            @input="$emit('updateCheckoutData', SelectedDataChild)"
                        />
                    </div>
                    <div class="clearAll"></div>
                </div>
                <div class="formRow container">
                    <div class="col col-2">
                        <input
                            type="text"
                            placeholder="Email"
                            class="formText"
                            v-model="SelectedDataChild.email"
                            @input="$emit('updateCheckoutData', SelectedDataChild)"
                        />
                    </div>
                    <div class="col col-2">
                        <input
                            type="text"
                            placeholder="Cell/Phone"
                            class="formText"
                            v-model="SelectedDataChild.cell"
                            @input="$emit('updateCheckoutData', SelectedDataChild)"
                        />
                    </div>
                    <div class="clearAll"></div>
                </div>
            </div>

            <div style="clear:both"></div>
            <div class="formRow container">
                <a
                    href="javascript:void(0)"
                    class="button button-blue"
                    @click="$emit('moveToStep', [1,2])"
                    >Proceed to Calculate Price Page</a
                >
                <McafeeSecureBadge />
            </div>
        </div>
    </div>
</template>

<script>
import CheckoutSelectSpeeds from '@/components/CheckoutSelectSpeeds.vue';
import CheckoutCustomerOptions from '@/components/CheckoutCustomerOptions.vue';
import CheckoutWritingStyle from '@/components/CheckoutWritingStyle.vue';
import CheckoutUpload from '@/components/CheckoutUpload.vue';
import CheckoutNumberWordsHelper from '@/components/CheckoutNumberWordsHelper.vue';
import McafeeSecureBadge from '@/components/McafeeSecureBadge.vue';
export default {
    components: {
        CheckoutSelectSpeeds,
        CheckoutCustomerOptions,
        CheckoutWritingStyle,
        CheckoutUpload,
        CheckoutNumberWordsHelper,
        McafeeSecureBadge,
    },
    props: {
        CheckoutData: Object,
        SelectedData: Object,
        stepActive: String,
    },
    computed: {
        SelectedTurnaroundText: function() {
            if(this.SelectedData.turnaround.ID) {
                return this.SelectedData.turnaround.FriendlyName + ' turnaround';
            }
            return 'Select turnaround speed.';
        }
    },
    created: function() {
        let turnaround = '';
        if(this.SelectedData.turnaround.FriendlyName) {
            turnaround = this.SelectedData.turnaround.FriendlyName + ' turnaround';
        } else {
           turnaround = '48 hour turnaround'; 
        }
        window.ga('ec:setAction','checkout', {
            'step': 1,
            'option': turnaround
        });
        window.ga('send', 'pageview', this.siteUrl + 'checkout/step1');
    },
    data() {
        return {
            showNumWordsHelper: false,
            SelectedDataChild: this.SelectedData
        };
    },
    mounted: function() {
        this.$nextTick(function() {
            this.$emit('loaded', true);
        });
    },
    methods: {}
};
</script>

<style>
.checkoutTotal p {
    margin: 0;
}
</style>
