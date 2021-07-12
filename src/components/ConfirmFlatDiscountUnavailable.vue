<template>
    <div class="validation1"
        v-if="ifExtended() && SelectedData.turnaround.ID == 25" 
        v-bind:class="{
            validationShrink: shrinkedMessage,
            validation1Hide: stepActive == 'step1'
        }">
        <i class="fas fa-plus-circle validationBoxIcon" @click="shrinkedMessage=!shrinkedMessage"></i>
        <i class="fas fa-minus-circle validationBoxIcon" @click="shrinkedMessage=!shrinkedMessage"></i>
        <h5>The Limited-time offer is no longer available.</h5>
        <div class="validationText">
            <p style="font-size:12px;">The Limited-time offer is no longer available because ProofreadingPal received a *FLAT RATE* order. <br />Our current *FLAT RATE* price of <strong>${{SelectedData.turnaround.Price}} per word ({{SelectedData.turnaround.Price*100}} cents)</strong> will be calculated on this order.</p>
        </div>
        <div id="confirmExtended" style="font-weight:bold;">
            <span v-if="confirmedDeadline">You confirmed that you agree with the updated price.</span>
            <div v-else>
                <input type="checkbox" v-model="confirmedDeadline" @change="confirmExtended()" name="confirm_extended" value="yes"  /> Please confirm you agree with the updated price.
            </div>
        </div>
    </div>
</template>

<script>
export default {
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
            selectData.FlatDiscountConfirmed = this.confirmedDeadline;
            this.shrinkedMessage = true;
            this.$emit('updateCheckoutData', selectData); 
            this.$emit('cleanError'); 
        },
        ifExtended() {
            if(this.SelectedData.FlatDiscountConfirm) {
                return true;
            }
            return false;
        }
    }
}
</script>
<style lang="scss" scoped>
.validation1{display: block;}
.validation1Hide{display: none;}
</style>