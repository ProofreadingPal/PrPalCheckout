<script>
export default {
    methods: {
        ifExtended() {
            const WordLimitBase = parseInt(this.SelectedData.turnaround.WordLimitBase);
            const WordLimit = parseInt(this.SelectedData.turnaround.WordLimit);
            const numberWords = this.SelectedData.numberWords;
            const selectData = this.SelectedData;
            const obj = {};
            if(numberWords > WordLimitBase && numberWords <= WordLimit) {
                obj.Available = true;
                obj.Confirmed = this.confirmedDeadline;
                obj.Length = this.calculateExtendedDeadline();
                selectData.extendedTurnaround = obj;
                this.$emit('updateCheckoutData', selectData);
                return true;
            } else if(this.SelectedData.turnaround.ID == 11 && numberWords > 300) {
                //case flat order 30-60 min
                obj.Available = false;
                obj.Confirmed = this.confirmedDeadline;
                obj.Length = this.calculateExtendedDeadline();
                selectData.extendedTurnaround = obj;
                this.$emit('updateCheckoutData', selectData);
                return true;
            }
            obj.Available = false;
            obj.Confirmed = this.confirmedDeadline;
            selectData.extendedTurnaround = obj;
            this.$emit('updateCheckoutData', selectData);
            return false;
        },
        calculateExtendedDeadlinePrint() {
            const numberWords = this.SelectedData.numberWords;
            const WordLimitBase = this.SelectedData.turnaround.WordLimitBase;
            const DividingNumber = this.getDividingNumber(this.SelectedData.turnaround);
            const MinutesLength = this.turnaroundLengthMinutes(this.SelectedData.turnaround);
            let extendedDeadline = (numberWords - WordLimitBase) / DividingNumber + MinutesLength;
            //case flat order 30-60 min
            if(this.SelectedData.turnaround.ID == 11) {
                extendedDeadline = numberWords/DividingNumber;
                extendedDeadline = Math.floor(extendedDeadline);
            }
            let ret = this.turnMinTohourMin(extendedDeadline);
            //case flat order 2-4 hour
            if(this.SelectedData.turnaround.ID == 25) {
                const extendedDeadlineAfter = extendedDeadline + 2*60;
                ret = this.turnMinTohourMin(extendedDeadline) + ' to ' + this.turnMinTohourMin(extendedDeadlineAfter);
            }
            return ret;
            
        },
        calculateExtendedDeadline() {
            const numberWords = this.SelectedData.numberWords;
            const WordLimitBase = this.SelectedData.turnaround.WordLimitBase;
            const DividingNumber = this.getDividingNumber(this.SelectedData.turnaround);
            const MinutesLength = this.turnaroundLengthMinutes(this.SelectedData.turnaround);
            let extendedDeadline = (numberWords - WordLimitBase) / DividingNumber + MinutesLength;
            //case flat order 30-60 min
            if(this.SelectedData.turnaround.ID == 11) {
                extendedDeadline = numberWords/DividingNumber;
                extendedDeadline = Math.floor(extendedDeadline);
            }
            return extendedDeadline;
            
        },
        getDividingNumber(turnaround) {
            switch(turnaround.Name) {
                case '10_hour':
                    return 5;
                case '6_hour':
                    return 5;
                case '2-4_hour':
                    return 5;
                default:
                    return 10;  
            }
        },
        turnMinTohourMin(val) {
            const totalMinutes = parseFloat(val);
            let exactText = '';
            if(totalMinutes > 90) {
                const ehours = Math.floor(totalMinutes / 60);          
                const eminutes = totalMinutes % 60;
                if(eminutes == 0) {
                    exactText = parseInt(ehours) + " hours";
                } else {
                    exactText = parseInt(ehours) + " hours and " + parseInt(eminutes) + " minutes";
                }
            } else {
                exactText = totalMinutes + " minutes";  
            }
            return exactText;
        },
        turnaroundLengthMinutes(turnaround) {
            const turnValues = turnaround.Name.split('_');
            const timeUnit = turnValues[1];
            const timeVal = turnValues[0];
            let adVal = 0;
            if (timeUnit == 'minute') {
                adVal = 1;
            } else if (timeUnit == 'hour') {
                adVal = 60;
            } else if (timeUnit == 'day') {
                adVal = 60 * 24;
            }
            if (timeVal == '2-4') {
                return 2 * 60;
            } else {
                return parseFloat(timeVal) * adVal;
            }
        },
    }
}
</script>