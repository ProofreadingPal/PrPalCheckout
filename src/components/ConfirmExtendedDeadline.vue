<template>
    <div class="validation1"
        v-if="ifExtended()" 
        v-bind:class="{
            validationShrink: shrinkedMessage,
            validation1Hide: stepActive == 'step1' || stepActive == 'step5'
        }">
        <i class="fas fa-plus-circle validationBoxIcon" @click="shrinkedMessage=!shrinkedMessage" v-if="SelectedData.turnaround.ID != 11"></i>
        <i class="fas fa-minus-circle validationBoxIcon" @click="shrinkedMessage=!shrinkedMessage" v-if="SelectedData.turnaround.ID != 11"></i>
        <h5>Project will be back in <strong>{{calculateExtendedDeadlinePrint()}}</strong>.</h5>
        <div class="validationText" v-if="SelectedData.turnaround.ID != 11">
            <p style="font-size:12px;">You've chosen {{SelectedData.turnaround.FriendlyName}} turnaround, and ProofreadingPal has a {{SelectedData.turnaround.WordLimitBase}} word limit for {{SelectedData.turnaround.FriendlyName}} turnaround. Your {{SelectedData.numberWords}} word count is outside of our limit for {{SelectedData.turnaround.FriendlyName}} turnaround, but we can have this project back to you in {{calculateExtendedDeadlinePrint()}}.<br /></p>
        </div>
        <div id="confirmExtended" style="font-weight:bold;">
            <span v-if="confirmedDeadline && SelectedData.turnaround.ID != 11">You confirmed that you agree with extended deadline.</span>
            <div v-else-if="SelectedData.turnaround.ID != 11">
                <input type="checkbox" v-model="confirmedDeadline" @change="confirmExtended()" name="confirm_extended" value="yes"  /> Please confirm you agree with the extended deadline.
            </div>
        </div>
    </div>
</template>

<script>
import CheckoutExtendedDeadlineFunctions from '@/components/CheckoutExtendedDeadlineFunctions.vue';
export default {
    mixins: [
        CheckoutExtendedDeadlineFunctions
    ],
    data: function() {
        return {
           confirmedDeadline: false,
           shrinkedMessage: false,
        }
    },
    props: {
        SelectedData: Object,
        stepActive: String,
    },
    methods: {
        confirmExtended() {
            const selectData = this.SelectedData;
            selectData.extendedTurnaround.Confirmed = this.confirmedDeadline;
            this.shrinkedMessage = true;
            this.$emit('updateCheckoutData', selectData); 
            this.$emit('cleanError'); 
        },
    }
}
</script>
<style lang="scss" scoped>
.validation1{display: block;}
.validation1Hide{display: none;}
</style>