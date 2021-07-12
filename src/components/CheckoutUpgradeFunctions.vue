<script>
export default {
    computed: {
        upgradeTurnaround: function() {
            let upgradeIndex = 0;
            const obj = {};
            for (const value in this.CheckoutData.Turnarounds) {
                
                if(upgradeIndex == 1 && this.CheckoutData.Turnarounds[value].ID != 25 && this.CheckoutData.Turnarounds[value].ID != 15) {
                    obj.turnaround = this.CheckoutData.Turnarounds[value];
                    const Wlimit = parseInt(obj.turnaround.WordLimit);
                    if(Wlimit > this.SelectedData.numberWords) {
                        obj.total = this.getTotalByTurnaround(obj.turnaround);
                        obj.diff = obj.total - parseFloat(this.totals.total);
                        obj.diff = obj.diff.toFixed(2);
                        return obj;
                    }
                }
                if(this.CheckoutData.Turnarounds[value].ID == this.SelectedData.turnaround.ID) {
                    upgradeIndex = 1;
                }
            }
            return false;
        }
    }
}
</script>