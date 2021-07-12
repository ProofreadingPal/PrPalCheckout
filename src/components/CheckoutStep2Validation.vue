<script>
import axios from 'axios';
export default {
    methods: {
        validateStep2() {
            const data = this.SelectedData;
            const errors = [];
            if(!data.fileUploaded) {
                errors.push('Upload Your Document');
            }
            if(!data.description) {
                errors.push('Please enter a description of the document you are uploading. The maximum amount of text allowed is 2,000 characters.');
            } else if(data.description.length > 2000 || data.description.length < 3) {
                errors.push('Please enter a description of the document you are uploading. The maximum amount of text allowed is 2,000 characters.');
            }
            if(data.extendedTurnaround && !this.SelectedData.PaypalExpress && this.SelectedData.turnaround.ID != 11) {
                if(data.extendedTurnaround.Available && !data.extendedTurnaround.Confirmed) {
                    errors.push('Please confirm you agree with the extended deadline.');
                }
            }
            if(data.FlatDiscountConfirm && data.turnaround.ID == 25) {
               if(!data.FlatDiscountConfirmed) {
                    errors.push('Please confirm you agree with the updated price.');
                } 
            }
            
            if(errors.length) {
                this.errors = errors;
                return false;
            }
            if(!this.CheckoutData.CustomerCheckoutOptions.FlatOnBoard && this.SelectedData.turnaround.ID == 25 && !this.SelectedData.FlatChecked2) {
                this.checkIfFlatOnBoard()
                return false;
            } else {
                this.errors = false;
                return true;
            }
        },
        checkIfFlatOnBoard() {
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
                    let CustomerType = false;
                    if(this.CheckoutData.AccountData) {
                        CustomerType = this.CheckoutData.AccountData.CustomerType;
                    }
                    if(CustomerType == 'corporate') {
                        this.moveToStep([2, 4]);
                    } else {
                        this.moveToStep([2, 3]);
                    } 
                });
        },
    }
}
</script>