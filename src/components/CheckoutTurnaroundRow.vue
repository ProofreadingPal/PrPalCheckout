<template>
    <div
        class="selectRow"
        v-if="turnaround.Available"
        v-show="turnaround.SingleAvailable || !single"
        v-bind:class="{
            selectRowSelected: turnaround.ID == SelectedData.turnaround.ID,
            onSaleOption:
                turnaround.OnsaleActive && !turnaround.OvernightAllowed,
            overnightOption: turnaround.OvernightAllowed,
            flatOption: !flatOnBoard && (turnaround.Name == '2-4_hour'),
            disabledTurnaround: turnaround.Disabled || turnaround.TimeDisabled,
        }"
        @click="turnaroundUpdate(turnaround, single)"
    >
        <p class="left">
            <input
                type="radio"
                name="turnaroundspeeds"
                :value="turnaround.ID"
                :checked="
                    turnaround.ID == SelectedData.turnaround.ID && checkedField()
                "
                :disabled="turnaround.Disabled || turnaround.TimeDisabled"
            />
            {{ turnaround.FriendlyName | shortFriendlyTurnaround }}
            turnaround
            <span class="flatRateSpan" v-if="turnaround.Name == '2-4_hour' || turnaround.Name == '4-7_day'"
                ><i class="fa fa-star" ></i>&nbsp;
                <span>FLAT RATE</span>&nbsp;
                <i class="fa fa-star" ></i>&nbsp;
            </span>
            <span v-if="stepActive!='step1'">
            {{ dollarPrice(turnaroundPrice, single) }} per word ({{
                centPrice(turnaroundPrice, single)
            }}
            cents) 
            </span>
            <span
                v-if="
                    turnaroundPrice <= bestdealamount &&
                    ((singleAvailable && single) ||
                    (!singleAvailable && !single)) && 
                    stepActive!='step1'
                "
                style="color:#709902;font-weight:bold;font-size:14px;vertical-align:middle;"
            >
                &nbsp; <i class="fa fa-star" style="font-size:10px;"></i>
                <span>Best Deal</span>
                <i class="fa fa-star" style="font-size:10px;"></i>
            </span>
        </p>

        <p class="right rightPrice linethrough" v-if="SelectedData.numberWords > 0 && stepActive!='step1'">
            ${{ pricePerTurnaround(turnaroundPrice, single) }}
        </p>
        <p
                v-if="turnaround.OnsaleActive && !turnaround.OvernightAllowed && stepActive=='step1'"
                class="onSaleRow right"
                style="font-size:12px;text-align:right;float:right;"
            >
                On sale until {{ turnaround.OnsaleTimeTo }}
        </p>
        <div class="clearAll"></div>

        <div class="overnightSurchargeRow" v-if="turnaround.OvernightAllowed">
            <p class="left" style="font-size:12px;">
                Orders over {{ turnaround.OvernightWordLimit }} words from
                {{ turnaround.OvernightTimeRange }} receive
                {{ turnaround.OvernightPrice }}% surcharge.
            </p>
            <p class="right" v-if="SelectedData.numberWords > 0 &&  stepActive!='step1'">
                ${{
                    percentbasedAmount(
                        turnaround.OvernightPrice,
                        pricePerTurnaround(turnaroundPrice, single),
                        '+'
                    )
                }}
            </p>
            <div class="clearAll"></div>
        </div>
        
        <div
            v-if="turnaround.OnsaleActive && !turnaround.OvernightAllowed && stepActive!='step1'"
            class="onSaleRow right"
        >
            <p class="right" style="width:80px;text-align:right;" v-if="SelectedData.numberWords > 0 ">
                ${{
                    percentbasedAmount(
                        turnaround.OnsalePercent,
                        pricePerTurnaround(turnaroundPrice, single),
                        '-'
                    )
                }}
            </p>
            <p
                class="left"
                style="font-size:12px;text-align:right;float:right;"
            >
                On sale until {{ turnaround.OnsaleTimeTo }}
            </p>
            <div class="clearAll"></div>
        </div>

        <div
            class="flatRow"
            v-if="!flatOnBoard && turnaround.Name == '2-4_hour'"
        >
            <p
                class="right"
                style="width:80px;text-align:right;color: #648801;font-weight: bold;font-size: 16px;"
                id="selectFlatRowRight<?php echo $speedid; ?>"
                v-if="SelectedData.numberWords > 0 && stepActive!='step1'"
            >
                ${{ pricePerTurnaround(turnaround.FlatDiscount, single) }}
            </p>
            <p
                class="left"
                style="font-size:12px;text-align:right;color: #648801;float:right;font-weight:bold;"
                id="limitedFlat"
                v-if="stepActive!='step1' && !flatOnBoard"
            >
                Limited-time offer until ProofreadingPal receives next *2 to 4 hour FLAT
                RATE* order.
            </p>
            <div class="clearAll"></div>
        </div>
        <div v-if="turnaround.Name == '2-4_hour'">
            <p class="left" style="font-size:12px;">
                <span class="flatRateRed">*2 to 4 hour FLAT RATE*</span> is available for purchase Monday–Friday from 8
                a.m.–4 p.m. CT.
            </p>
        </div>

        <!-- 4 to 7 flat -->
        <div v-if="turnaround.Name == '4-7_day'">
            <p class="left" style="font-size:12px;">
                <span class="flatRateRed">*4 to 7 day FLAT RATE*</span> is available for purchase 24/7 through {{turnaround.AvailableTo}}
            </p>
        </div>
        <!-- /4 to 7 flat -->

        <div class="clearAll"></div>
    </div>
</template>

<style>
.overnightOption .rightPrice {
    text-decoration: line-through;
    opacity: 0.7;
}
</style>

<script>
import CheckoutPricesFunctions from "@/components/CheckoutPricesFunctions.vue";
export default {
    extends: CheckoutPricesFunctions,
    data() {
        return {
            numWords: this.SelectedData.numberWords
        };
    },
    props: {
        turnaround: Object,
        SelectedData: Object,
        single: Boolean,
        singleAvailable: Boolean,
        iterator: Number,
        flatOnBoard: Boolean,
        stepActive: String,
        bestdealamount: [Number, String, Boolean],
    },
    filters: {
        shortFriendlyTurnaround: function (value) {
            value = value.replace(" *FLAT RATE*", "");
            return value;
        }
    },
    computed: {
        turnaroundPrice: function() {
            if (this.SelectedData.numberWords > 0) {
                const smallProjectLimit = parseInt(this.turnaround.SmallProjectLimit);
                if (
                this.SelectedData.numberWords <= smallProjectLimit 
                && this.turnaround.SmallProjectAvailable == 'yes'
                ) {
                    return this.turnaround.SmallProjectPrice;
                } else {
                    return this.turnaround.Price;
                }
            }
            return false;
        }
    },
    created: function() {
        this.$emit('turnaroundPrice', this.turnaroundPrice);
    },
    watch: { 
        turnaroundPrice: function() {
            this.$emit('turnaroundPrice', this.turnaroundPrice);
        }
    },
    methods: {
        turnaroundUpdate(turn, type) {
            if(turn.Disabled || turn.TimeDisabled) {
                return false;
            }
            const SelectedData = this.SelectedData;
            SelectedData.turnaround = turn;
            SelectedData.singleOption = type;

            this.$emit('turnaroundUpdate', SelectedData);
        },
        checkedField() {
            if (this.SelectedData.singleOption && this.single) {
                return true;
            } else if (!this.SelectedData.singleOption && !this.single) {
                return true;
            }
            return false;
        },
    }
};
</script>

<style>
.disabledTurnaround{
    opacity: .7;
}
</style>
<style scoped>
.flatRateSpan i {
	line-height: 10px;
	font-size: 11px;
	position: relative;
    vertical-align: middle;
}
</style>
