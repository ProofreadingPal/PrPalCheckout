<script>
export default {
    methods: {
        validateStep3() {
            const data = this.SelectedData;
            const errors = [];
            
            if(!data.firstName) {
                errors.push('First Name');
            }
            if(!data.lastName) {
                errors.push('Last Name');
            }
            if(!data.address1) {
                errors.push('Address');
            }
            if(!data.city) {
                errors.push('City');
            }
            if(!data.state) {
                errors.push('State');
            }
            if(!data.zip) {
                errors.push('Zip');
            }
            if(!data.country) {
                errors.push('Country');
            }
            
            if(
                data.birthday.mm < 1 || 
                data.birthday.mm > 12 ||
                data.birthday.dd < 1 || 
                data.birthday.dd > 31 ||
                data.birthday.yy < 0 || 
                data.birthday.yy > 99
            ) {
                errors.push('Birthday');
            } else if(
                data.birthday.mm != data.confirmBirthday.mm || 
                data.birthday.dd != data.confirmBirthday.dd || 
                data.birthday.yy != data.confirmBirthday.yy
            ) {
                errors.push('Confirm Birthdate');
            }
            if(!data.email) {
                errors.push('Email');
            }
            if(data.email != data.confirmEmail) {
                errors.push('Email Doesn\'t Match');
            }
            if(!data.billingData.paymentType) {
                errors.push('Payment Type');
            } else if(data.billingData.paymentType == 'Credit Card') {
                if(!data.billingData.creditCardType) {
                    errors.push('Credit Card Type');
                }
                if(!data.billingData.creditCardNumber) {
                    errors.push('Credit Card Number');
                }
                if(!data.billingData.cvv2Number) {
                    errors.push('Security Code');
                }
                if(!data.billingData.expirationDate.mm || !data.billingData.expirationDate.yy) {
                    errors.push('Expiration Date');
                }
            }

            if(errors.length) {
                this.errors = errors;
                return false;
            }
            this.errors = false;
            return true;
        }
    }
}
</script>