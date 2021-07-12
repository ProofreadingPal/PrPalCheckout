<template>
    <div class="checkoutTotalRight container" v-if="totals">
        <div id="rightovernightTotal">
            <div v-if="totals.totalOptions">

                <div class="container" id="rightSubtotalContainer" v-if="totals.totalOptions.length">
                    <div class="left rightSubTotalTitle">Subtotal:</div>
                    <div class="right rightSubAmount" style="text-decoration:line-through;">${{ totals.amount }}</div>
                </div>
            
            
                <div v-for="total in totals.totalOptions" :key="total.ID"  class="container containerSub">
                    <div class="left rightSubTotalTitle">
                        {{total.label}}:
                    </div>
                    <div class="right rightSubAmount" id="rightFlatTotalAmount">
                        {{total.sign}}${{total.amount}}
                    </div>
                </div>
            </div>
        </div>

        <div
            class="container"
            style="border-top:1px solid #cacaca;margin-top:15px;"
        >
            <div class="left rightTotalTitle">Total:</div>
            <div class="right rightTotalAmount">
                ${{ totals.total }}
            </div>
        </div>
        <div class="formFileUploadNote" v-if="minAmountUsed">(*Your order has been increased to our minimum fee of ${{turnaround.Min}})'</div>
        <p id="dvToalAmount">
            {{ turnaround.FriendlyName }} turnaround,
            {{ dollarPrice(turnaroundPrice) }} per word ({{
                centPrice(turnaroundPrice)
            }}
            cents)
        </p>
    </div>
</template>

<script>
import CheckoutPricesFunctions from '@/components/CheckoutPricesFunctions.vue';
export default {
    extends: CheckoutPricesFunctions,
    data() {
        return {
            showNumWordsHelper: false,
            SelectedDataChild: this.SelectedData
        };
    },
    props: {
        totals: [Object, Boolean],
        turnaround: [Object, Boolean],
        minAmountUsed: [Boolean],
        turnaroundPrice: [String, Boolean],
    }
};
</script>
<style lang="scss" scoped>
.formFileUploadNote {
    font-weight: normal; 
    font-size: 12px;
}
</style>
