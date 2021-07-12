<script>
import axios from 'axios';
import Loader from '@/components/Loader.vue';
export default {
    components: {
        Loader
    },
    data() {
        return {
            isLoading: false,
            success: false,
            errors: []
        };
    },
    mounted: function() {
        this.$nextTick(function() {
            this.$emit('loaded', true);
        });
        this.getAccountData();
    },
    methods: {
        validEmail: function(email) {
            const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return re.test(email);
        },
        getAccountData: function() {
            const userData = { id: this.userId, action: 'get' };
            axios
                .post(
                    this.siteUrl + 'account/API/AccountData.php?v=1',
                    userData
                )
                .then(response => {
                    if (response.data.error) {
                        this.Auth(response.data.error);
                    } else {
                        this.formData = response.data;
                    }
                })
                .catch(error => console.log(error));
        },
        updateAccountData: function() {
            this.isLoading = true;
            const userData = {
                id: this.userId,
                action: 'updateAccountData',
                userPost: this.formData
            };
            axios
                .post(
                    this.siteUrl + 'account/API/AccountData.php?v=1',
                    userData
                )
                .then(response => {
                    if (response.data.error) {
                        this.Auth(response.data.error);
                    } else {
                        //console.log(response.data);
                        this.formData = response.data;
                        this.success = true;
                        setTimeout(() => (this.success = false), 3000);
                    }
                    setTimeout(() => (this.isLoading = false), 300);
                })
                .catch(error => console.log(error));
        },
        getDigitalValue: function(val)  {
            return val.replace(/[^\d.]/g,'');
        }
    }
};
</script>

<style lang="scss" scoped>
.formLabelEmpty {
    height: 24px;
}
.validation1{
    display: inherit;
}
</style>
