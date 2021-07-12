<script>
export default {
    methods: {
        validateStep1() {
            const data = this.SelectedData;
            const errors = [];
            if(!data.turnaround.ID) {
                errors.push('Turnaround Speed');
            }
            if(!data.selectedWritingStyle) {
                errors.push('Writing Style');
            }
            
            if(!data.numberWords) {
                errors.push('Word Count');
            }
            if(!data.firstName) {
                errors.push('First Name');
            }
            if(!data.lastName) {
                errors.push('Last Name');
            }
            if(!this.validEmail(data.email)) {
                errors.push('Email');
            }
            /*if(!this.validEmail(data.turnaround.TimeDisabled)) {
                errors.push('Email');
            }*/

            if(errors.length) {
                this.errors = errors;
                return false;
            } else {
                this.errors = false;
            }
            if(this.wordLimitMet) {
                return false;
            }
            return true;
        },
        validEmail(email) {
            const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return re.test(email);
        },
    }
}
</script>