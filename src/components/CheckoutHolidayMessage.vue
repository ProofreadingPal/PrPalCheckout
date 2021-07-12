<template>
    <div class="holiday_Msg" v-if="showHoliday()">
        ProofreadingPal has determined from
        <strong
            >{{ holidayData.HolidayStartFriendly }} to
            {{ holidayData.HolidayEndFriendly }}</strong
        >
        as a holiday period because of
        <strong>({{ holidayData.HolidayExplanation }})</strong>.
        <span v-if="ifHolidayIsNow()">
            <span v-if="holidayTurnaroundAvailability()"
                >You are making an order within our designated holiday
                period.</span
            >
            <span v-else
                >You are making a {{ turnaround.FriendlyName }} order within our
                designated holiday period, and we do not allow
                {{ turnaround.FriendlyName }} orders during holiday
                periods.</span
            >
        </span>
        <span v-else>
            <span v-if="holidayTurnaroundAvailability()"
                >You are making an order with a turnaround speed and/or deadline
                that falls within or crosses over into a portion of our
                <strong>({{ holidayData.HolidayExplanation }})</strong> holiday
                period.</span
            >
            <span v-else
                >You are making a {{ turnaround.FriendlyName }} order that falls
                within or crosses over our designated holiday period, and we do
                not allow {{ turnaround.FriendlyName }} orders during holiday
                periods.</span
            >
        </span>
        <p>
            <span
                style="vertical-align:middle; color: #444; font-weight: normal; font-size: 13px;"
            >
                <strong
                    style="vertical-align:middle; font-weight: bold; font-size: 13px;line-height:18px;"
                    >Please select from the available options below to
                    proceed.</strong
                ><br />
            </span>

            <!-- 1.Option no surcharge -->
            <span class="holidayOption">
                <input
                    type="radio"
                    name="holidayOpt"
                    value="back-after"
                    v-model="holidayOption"
                    style="width: auto;padding: 0; margin-right: 6px; vertical-align:middle;"
                />
                <span class="holiday_message" style="vertical-align:middle;"
                    >Do not pay a surcharge and get document back at
                    {{ projectBackTime() }}</span
                >
            </span>

            <!-- 2. Upgrade option -->
            <span class="holidayOption" v-if="upgradeOption">
                <input
                    type="radio"
                    name="holidayOpt"
                    value="upgrade"
                    v-model="holidayOption"
                    style="width: auto;padding: 0; margin-right: 6px; vertical-align:middle;"
                />
                <span class="holiday_message" style="vertical-align:middle;"
                    >Upgrade turnaround speed to {{upgradeOption.upgradeSpeed.FriendlyName}} turnaround for an extra ${{upgradeOption.upgradeDiff}} and get your document back before ({{ holidayData.HolidayExplanation }}) holiday period begins</span
                >
            </span>
            
            <!-- 3. First Available if not available current one -->
            <span class="holidayOption" v-if="firstAvailable">
                <input
                    type="radio"
                    name="holidayOpt"
                    value="surcharge-change"
                    v-model="holidayOption"
                    style="width: auto;padding: 0; margin-right: 6px; vertical-align:middle;"
                />
                <span class="holiday_message" style="vertical-align:middle;"
                    >Change my order to a ({{firstAvailable.turnaround.FriendlyName}} turnaround) order. The total price will be an amount of ${{firstAvailable.total}} ({{ holidayData.HolidayExplanation }} surcharge included)</span
                >
            </span>

            <!-- 4. Keep same for an extra charge -->
            <span class="holidayOption" v-if="extraCharge">
                <input
                    type="radio"
                    name="holidayOpt"
                    value="surcharge-keep-same"
                    v-model="holidayOption"
                    style="width: auto;padding: 0; margin-right: 6px; vertical-align:middle;"
                />
                <span class="holiday_message" style="vertical-align:middle;"
                    >Keep the same turnaround for an extra <span id="holidaySameSpeed">${{extraCharge.extraCharge}}</span> ({{ holidayData.HolidayExplanation }} surcharge included) and get document back at {{extraCharge.backTime}}</span
                >
            </span>
        </p>
    </div>
</template>

<script>
import CheckoutPricesFunctions from '@/components/CheckoutPricesFunctions.vue';
import CheckoutHolidayPricesFunctions from '@/components/CheckoutHolidayPricesFunctions.vue';
export default {
    mixins: [
        CheckoutPricesFunctions,
        CheckoutHolidayPricesFunctions,
    ],
    data: function() {
        return {
            holidayShow: true,
            holidayOption: false,
            holidayRequired: true,
            holidayDat: false,
            turnaround: false,
            CheckoutData: false,
            SelectedData: false,
            totals: false,
            dataUpdated: false,
            prevTurnaround: false,
        };
    },
    computed: {
        startDate: function() {
            //return parseInt(this.holidayData.HolidayStart) * 1000;
            const dated = new Date(this.holidayData.HolidayStartJs);
            return dated;
        },
        upgradeOption: function() {
            const options = {};
            options.upgradeSpeed = this.holidayUpgrade();
            if(!options.upgradeSpeed) {
                return false;
            }
            options.upgradeDiff = this.getTotalByTurnaround(options.upgradeSpeed) - this.totals.total;
            options.upgradeDiff = options.upgradeDiff.toFixed(2);
            return options;
        },
        firstAvailable: function() {
            if(!this.holidayTurnaroundAvailability()) {
                const options = {};
                options.turnaround = this.getFirstAvailableSpeed();
                // getTotalByTurnaround function second parameter true mean get total without holiday surcharge
                options.total = this.getTotalByTurnaround(options.turnaround, true);
                options.extraCharge = this.getHolidayExtraCharge(options.turnaround, options.total);
                options.extraCharge = parseFloat(options.extraCharge);
                options.total += options.extraCharge;
                options.total = options.total.toFixed(2);
                return options;
            }
            return false;
        },
        extraCharge: function() {
            if(this.holidayTurnaroundAvailability()) {
                const options = {};
                // get project back time like no holiday
                const ignoreHoliday = true;
                options.backTime = this.projectBackTime(ignoreHoliday);
                options.extraCharge = this.getHolidayExtraCharge();
                return options;
            }
            return false;
        },
    },
    watch: {
        holidayOption: function(val) {
            const obj = {};
            obj.value = false;
            const selectData = this.SelectedData;
            switch(val) {
                case 'back-after':
                    this.holidayRequired = false;
                    if(this.prevTurnaround) {
                         obj.turnaround = this.prevTurnaround;
                    }
                    break;
                case 'upgrade':
                    this.prevTurnaround = selectData.turnaround;
                    obj.turnaround = this.upgradeOption.upgradeSpeed;
                    this.holidayRequired = false;
                    break;
                case 'surcharge-change':
                    this.prevTurnaround = selectData.turnaround;
                    obj.turnaround = this.firstAvailable.turnaround;
                    obj.surcharge = this.firstAvailable.extraCharge;
                    this.holidayRequired = false;
                    break;
                case 'surcharge-keep-same':
                    obj.surcharge = this.extraCharge.extraCharge;
                    this.holidayRequired = false;
                    break;
            }
            obj.value = val;
            obj.Required = this.holidayRequired;
            selectData.holidayOptions = obj;
            if(obj.turnaround) {
                selectData.turnaround = obj.turnaround;
            }
            this.$emit('updateCheckoutData', selectData);
        }
    },
    props: {
        holidayDataProp: [Object, Boolean],
        turnaroundProp: [Object, Boolean],
        CheckoutDataProp: [Object, Boolean],
        SelectedDataProp: [Object, Boolean],
        totalsProp: [Object, Boolean]
    },
    created: function() {
        if(!this.dataUpdated) {
            this.holidayData = this.holidayDataProp;
            this.turnaround = this.turnaroundProp;
            this.CheckoutData = this.CheckoutDataProp;
            this.SelectedData = this.SelectedDataProp;
            this.totals = this.totalsProp;
            this.dataUpdated = true;
        }
    },
    methods: {
        showHoliday() {
            const selectData = this.SelectedData;
            if (this.ifHolidayIsNow() || this.ifTurnaroundGoesInsideHoliday()) {
                selectData.holidayOptions.Required = this.holidayRequired;
                this.$emit('updateCheckoutData', selectData);
                return true;
            }
            selectData.holidayOptions.Required = false;
            return false;
        },
        ifHolidayIsNow() {
            if (this.ifHolidayTurnaroundExcluded()) {
                return false;
            } else if (
                this.holidayData.CurrentTime >= this.holidayData.HolidayStart &&
                this.holidayData.CurrentTime < this.holidayData.HolidayEnd
            ) {
                return true;
            }
            return false;
        },
        ifHolidayTurnaroundExcluded() {
            if (this.holidayData.HolidayExcluded.includes(this.turnaround.HypenName)) {
                return true;
            }
            return false;
        },
        holidayTurnaroundAvailability(turnaround) {
            if(!turnaround) {
                turnaround = this.turnaround;
            }
            if (
                !this.holidayData.HolidaySpeed.includes(
                    turnaround.HypenName
                )
            ) {
                return false;
            }
            return true;
        },
        ifTurnaroundAvailable(turnaround) {
            if(this.holidayTurnaroundAvailability(turnaround) && turnaround.WordLimit > parseInt(this.SelectedData.numberWords)) {
                return true;
            } else {
                return false;	
            }
        },
        ifTurnaroundGoesInsideHoliday() {
            const CurrentTime = parseInt(this.holidayData.CurrentTime);
            const HolidayStart = parseInt(this.holidayData.HolidayStart);
            const HolidayEnd = parseInt(this.holidayData.HolidayEnd);
            const turnaroundLength = this.getTurnaroundLength(
                this.turnaround.Name
            );
            if (this.ifHolidayTurnaroundExcluded()) {
                return false;
            } else if (this.ifHolidayIsNow()) {
                return true;
            } else if (
                CurrentTime + turnaroundLength > HolidayStart &&
                CurrentTime < HolidayEnd
            ) {
                return true;
            } else {
                return false;
            }
        },
        holidayUpgrade() {
            const CurrentTime = parseInt(this.holidayData.CurrentTime);
            const HolidayStart = parseInt(this.holidayData.HolidayStart);
            //const curamount = parseInt(this.totals.total);
            const documentWords = parseInt(this.SelectedData.numberWords);
            const timeLeftUntilHoliday = HolidayStart - CurrentTime;
            const turnarounds = this.CheckoutData.Turnarounds;
            let speedLength = 0;
            let selectedSpeed = false;
            //$word_limit[] = get_word_limit();
            for (const val in turnarounds) {
                const tempLength = this.getTurnaroundLength(
                    turnarounds[val].Name
                );
                // check if turnaround will be finished before holiday
                if (tempLength < timeLeftUntilHoliday) {
                    // sort by longest turnaround
                    if (tempLength > speedLength) {
                        if (turnarounds[val].WordLimit >= documentWords) {
                            speedLength = tempLength;
                            selectedSpeed = turnarounds[val];
                        }
                    }
                }
            }
            if (selectedSpeed) {
                return selectedSpeed;
            }
            return false;
        },
        reversedArr(items) {
            return items.slice().reverse()
        },
        getFirstAvailableSpeed() {
            const turnarounds = this.CheckoutData.Turnarounds;
            const reversedSpeeds = this.reversedArr(turnarounds);
            for(const val in reversedSpeeds) {
                if(this.ifTurnaroundAvailable(reversedSpeeds[val])) {
                    return reversedSpeeds[val];
                } 	
            }
            return false;
        },
        projectBackTime(ignoreHoliday) {
            const tempLength = this.getTurnaroundLength(this.turnaround.Name);
            const HolidayEnd = new Date(this.holidayData.HolidayEndJs);
            const HolidayStart = new Date(this.holidayData.HolidayStartJs);
            const CurrentTime = new Date(this.holidayData.CurrentTimeJs);
            let BackTime = '';
            if(ignoreHoliday) {
                BackTime = CurrentTime.getTime() + tempLength * 1000;
            } else if (this.ifHolidayIsNow()) {
                BackTime = HolidayEnd.getTime() + tempLength * 1000;
            } else {
                BackTime =
                    HolidayEnd.getTime() + tempLength * 1000 -  (HolidayStart.getTime() - CurrentTime.getTime());
            }
            BackTime = new Date(BackTime);
            return this.getFriendlyDate(BackTime);
        },
        getFriendlyDate(date) {
            const monthNames = [
                'January',
                'February',
                'March',
                'April',
                'May',
                'June',
                'July',
                'August',
                'September',
                'October',
                'November',
                'December'
            ];
            return (
                this.formatAMPM(date) +
                ' on ' +
                monthNames[date.getMonth()] +
                ' ' +
                date.getDate() +
                ', ' +
                date.getFullYear()
            );
        },
        formatAMPM(date) {
            let hours = date.getHours();
            let minutes = date.getMinutes();
            const ampm = hours >= 12 ? 'p.m.' : 'a.m.';
            hours = hours % 12;
            hours = hours ? hours : 12; // the hour '0' should be '12'
            minutes = minutes < 10 ? '0' + minutes : minutes;
            const strTime = hours + ':' + minutes + ' ' + ampm + ' CT';
            return strTime;
        },
        getTurnaroundLength(turnaroundName) {
            const turnValues = turnaroundName.split('_');
            const timeUnit = turnValues[1];
            const timeVal = turnValues[0];
            let adVal = 0;
            if (timeUnit == 'minute') {
                adVal = 60;
            } else if (timeUnit == 'hour') {
                adVal = 60 * 60;
            } else if (timeUnit == 'day') {
                adVal = 60 * 60 * 24;
            }
            if (timeVal == '2-4') {
                return 4 * 60 * 60;
            } else {
                return timeVal * adVal;
            }
        }
    }
};
</script>
<style lang="scss" scoped>
.holiday_Msg {
    background-color: #fff;
}
</style>
