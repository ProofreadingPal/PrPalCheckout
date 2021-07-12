<script>
export default {
    methods: {
        testDataPrefill() {
            this.SelectedData.numberWords = 1155;
            this.SelectedData.fileUploaded = {
            "name": "1617054059_S86017sample.docx", 
            "url": "/php_uploads/2021/03/1617054059_S86017sample.docx" 
            };
            this.SelectedData.selectedWritingStyle = { 
            "name": "cds", 
            "friendly": "Chicago Documentation Style", 
            "description": "Most history instructors and some humanities instructors require you to document sources with footnotes or endnotes based on The Chicago Manual of Style, 17th ed. (2017). When you use Chicago-style notes, you will usually be asked to include a bibliography at the end of your paper." 
            };
            this.SelectedData.description = 'fsdf sf sdf sdfsdf sd';
            this.SelectedData.firstName = 'fsdf';
            this.SelectedData.lastName = 'fsdf';
            this.SelectedData.email = 'ivanob83@gmail.com';
            this.SelectedData.quoteRequest = false;
            this.preselectTurnaround = 25;
            /*{
                quoteSent: false,
                customerType: '',
                minAmountUsed: false,
                totalBeforeMinAmount: 0,
                quoteRequest: false,
                turnaround: {},
                singleOption: false,
                customerOrderType: '',
                numberWords: 1000,
                fileUploaded: '',
                selectedWritingStyle: false,
                englishType: 'US English',
                description: '',
                firstName: '',
                lastName: '',
                address1: '',
                address2: '',
                city: '',
                state: '',
                zip: '',
                country: '',
                birthday: { mm: '', dd: '', yy: '' },
                confirmBirthday: { mm: '', dd: '', yy: '' },
                email: '',
                confirmEmail: '',
                cell: '',
                styleGuide: '',
                billingData: {
                    paymentType: '',
                    creditCardType: '',
                    creditCardNumber: '',
                    cvv2Number: '',
                    expirationDate: { mm: '', yy: '' }
                },
                couponData: {
                    couponCode: ''
                }
            }*/
        },
    },
}
</script>