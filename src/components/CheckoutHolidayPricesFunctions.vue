<script>
export default {
    methods: {
        getHolidayExtraCharge(turnaround, currentAmount) {
            if(!turnaround) {
                turnaround = this.turnaround;
            }
            if(!currentAmount) {
                currentAmount = this.SelectedData.holidayOptions.totalBefore;
            }
            const increasePercent = parseFloat(this.holidayData.HolidayIncrease) / 100;
            const holMin = parseFloat(this.holidayData.HolidayMin);
            let increaseAmount = currentAmount * increasePercent;
            if(increaseAmount < holMin) {
                increaseAmount = holMin;
            }
            increaseAmount = parseFloat(increaseAmount);
            increaseAmount = increaseAmount.toFixed(2);
            return increaseAmount;
        }
    },
}
</script>