<template>
    <div class="speedsSelect">
        <h4>Select turnaround speed</h4>

        <div class="turnaroundsBlock" v-if="singleConditionMet()">
            <h3>
                <i class="fas fa-user"></i> One Proofreader
                <span
                    >(One professional proofreader will proofread and edit your
                    document)</span
                >
            </h3>
            <CheckoutTurnaroundRow
                v-for="(turnaround, index) in turnarounds"
                :key="turnaround.key"
                :iterator="index"
                :turnaround="turnaround"
                :SelectedData="SelectedData"
                :flatOnBoard=flatOnBoard
                :singleAvailable="singleConditionMet()"
                :single="true"
                :stepActive="stepActive"
                :bestdealamount="bestDealVal"
                @turnaroundPrice="checkBestDeal($event)"
                @turnaroundUpdate="$emit('turnaroundUpdate', $event)"
            />

            <div class="clearAll"></div>
        </div>
        <div class="turnaroundsBlock">
            <h3 v-if="this.SelectedData.customerOrderType != 'prof1reader' && this.SelectedData.customerOrderType != 'proflitereader'">
                <i class="fas fa-user-friends"></i> Two proofreaders
                <span
                    >(Two professional proofreaders will proofread and edit your
                    document)</span
                >
            </h3>
            <h3 v-else>
                <i class="fas fa-user"></i> One Proofreader
                <span
                    >(One professional proofreader will proofread and edit your
                    document)</span
                >
            </h3>

            <CheckoutTurnaroundRow
                v-for="(turnaround, index) in turnarounds"
                :key="turnaround.key"
                :iterator="index"
                :turnaround="turnaround"
                :SelectedData="SelectedData"
                :flatOnBoard=flatOnBoard
                :singleAvailable="singleConditionMet()"
                :single="false"
                :stepActive="stepActive"
                :bestdealamount="bestDealVal"
                @turnaroundPrice="checkBestDeal($event)"
                @turnaroundUpdate="$emit('turnaroundUpdate', $event)"
            />
            <div class="clearAll"></div>
        </div>
    </div>
</template>

<script>
import CheckoutTurnaroundRow from '@/components/CheckoutTurnaroundRow.vue';
export default {
    components: {
        CheckoutTurnaroundRow
    },
    data() {
        return {
            bestDealVal: 100000
        };
    },
    props: {
        turnarounds: Array,
        SelectedData: Object,
        flatOnBoard: Boolean,
        stepActive: String,
    },
    created: function() {
        //console.log(this.turnaroundSelected);
    },
    methods: {
        checkBestDeal(val) {
            if(this.bestDealVal > val) {
               this.bestDealVal = val;
            }
        },
        singleConditionMet() {
            if(this.SelectedData.customerOrderType){
                return false;
            } else if(this.SelectedData.numberWords) {
                const numwords = this.SelectedData.numberWords;
                if(numwords > 3000) {
                    return true;
                }
            }
            return false;
        },
    }
};
</script>

<style>
.turnaroundsBlock {
    margin-top: 25px;
}
</style>
