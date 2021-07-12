<script>
import axios from 'axios';
export default {
    methods: {
        validateStep4() {
            this.isLoading = true;
            const data = this.SelectedData;
            const errors = [];
            if(data.holidayOptions) {
                if(data.holidayOptions.Required) {
                    errors.push('Please select from the available options below to proceed.');
                }
            }
            if(data.FlatDiscountConfirm && data.turnaround.ID == 25) {
               if(!data.FlatDiscountConfirmed) {
                    errors.push('Please confirm you agree with the updated price.');
                } 
            }
            if(errors.length) {
                this.errors = errors;
                this.isLoading = false;
                return false;
            }
            this.errors = false;
            if(!this.CheckoutData.CustomerCheckoutOptions.FlatOnBoard && this.SelectedData.turnaround.ID == 25 && !this.SelectedData.FlatChecked4) {
                this.checkIfFlatOnBoard4();
                this.isLoading = false;
            } else {
                if(this.CheckoutData.AccountData != 'corporate') {
                    if(this.SelectedData.billingData.paymentType == 'Paypal') {
                        this.preparePaymentExpress();
                    } else {
                        this.proceedPayment();
                    }
                } else {
                    this.proceedPayment();
                }
            }
            return false;
        },
        checkIfFlatOnBoard4() {
            axios
                .get(
                    this.siteUrl +
                        'checkout/API/CheckoutData.php?apiUnique='+this.apiUniqueNumber+'&check=flatOnBoard'
                ).then(response => {
                    this.SelectedData.FlatChecked2 = true;
                    console.log(response.data.status);
                    if(response.data.status == true) {
                        console.log(response.data.status);
                        this.CheckoutData.CustomerCheckoutOptions.FlatOnBoard = response.data.status;
                        this.SelectedData.FlatDiscountConfirm = true;
                        return true;
                    }
                    if(this.CheckoutData.AccountData != 'corporate') {
                        if(this.SelectedData.billingData.paymentType == 'Paypal') {
                            this.preparePaymentExpress();
                        } else {
                            this.proceedPayment();
                        }
                    } else {
                        this.proceedPayment();
                    }
                });
        },
        preparePaymentExpress() {
            const formData = new FormData();
            formData.append('SelectedData', JSON.stringify(this.SelectedData));
            formData.append('totals', JSON.stringify(this.totals));
            axios
                .post(this.siteUrl + 'checkout/API/PaypalExpress.php',
                    formData,
                    {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        }
                    }
                )
                .then(response => {
                    console.log(response.data);
                    const data = response.data;
                    if(data.Status == 'SUCCESS') {
                        window.location.href = data.Url;
                    }
                });
        },
        proceedPayment() {
            const formData = new FormData();
            formData.append('SelectedData', JSON.stringify(this.SelectedData));
            formData.append('totals', JSON.stringify(this.totals));
            formData.append('CheckoutData', JSON.stringify(this.CheckoutData));
            axios
                .post(this.siteUrl + 'checkout/API/OrderProceed.php',
                    formData,
                    {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        }
                    }
                )
                .then(response => {
                    const data = response.data;
                    //console.log(response.data);
                    this.saveLogs(response.data);
                    if(data.Status == 'SUCCESS') {
                        this.SelectedData.OrderId = data.OrderId;
                        this.stepActive = 'step5';
                        this.steps.step5.completed = true;
                        if (this.$route.name != 'Step 5') {
                            this.$router.push({ name: 'Step 5' });
                        }
                    } else if(data.Status == 'ERROR') {
                        if(data.Error == 'holiday error') {
                            this.checkHoliday();
                        } else if(data.Step) {
                            const errors = [];
                            errors.push(data.Errors);
                            this.moveToStep([0,data.Step]);
                            this.errors = errors;
                        }
                    }
                    this.isLoading = false;
                });
        },
        saveLogs(data) {
           const formData = new FormData();
           formData.append('data', JSON.stringify(data)); 
           formData.append('selecteddata', JSON.stringify(this.SelectedData));
           axios
                .post(this.siteUrl + 'checkout/API/OrderLogs.php',
                    formData,
                    {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        }
                    }
                )
        }
    }
}
</script>