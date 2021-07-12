<template>
    <div v-if="showPopup">
        <div class="popupBg" id="popupBg"></div>
        <!-- registration box -->
        <div class="registerPop" id="registerPop">
            <h3>
                Create a secure ProofreadingPal account now, and you will
                receive a <strong>$5 credit</strong> on your next order!
            </h3>
            <ul>
                <li>Save time submitting new orders</li>
                <li>Earn customer loyalty discounts</li>
                <li>Track your orders online</li>
                <li>View your order history</li>
            </ul>
            <div
                class="validation"
                style="display:block;padding:5px;width:338px;"
                v-if="errors"
            >
                <h5>Warning:</h5>
                <h6>
                    Please fill in the following field(s) before you proceed
                    with registration:
                </h6>
                <ul v-show="errors.length">
                    <li v-for="error in errors" :key="error.key">{{error}}</li>
                </ul>
            </div>
            <div
                class="validation1"
                style="display:block;padding:5px;width:338px;"
                v-if="success"
            >
                <h5>Message:</h5>
                <h6>
                    Registration done succesfully! <br /><a :href="siteUrl + 'account/login.php'">Click here to login</a>.
                </h6>
            </div>

            <div class="registerPopForm">

                <div class="formRow">
                    <label class="formLabel">Email-Username:</label>
                    <span class="emailregister" >{{SelectedData.email}}</span>
                    <div class="clearAll"></div>
                </div>
                <div class="formRow">
                    <input
                        type="password"
                        class="formText"
                        style="width: 100%;"
                        v-model="Password"
                        placeholder="Password"
                    />
                </div>
                <div class="formRow">
                    <input
                        type="password"
                        style="width: 100%;"
                        class="formText"
                        v-model="ConfirmPassword"
                        placeholder="Confirm Password"
                    />
                </div>
                <div class="formRow">
                    <input
                        class="button button-blue"
                        type="submit"
                        value="Register"
                        @click="validateRegistration()"
                    />
                    <a
                        href="javascript:void(0)"
                        class="button button-light"
                        @click="hidePopup=true"
                        >No thanks</a
                    >
                    <div class="clearAll"></div>
                </div>
            </div>
        </div>
        <!-- /registration box -->
    </div>
</template>

<script>
import axios from 'axios';
export default {
    data: function() {
        return {
            hidePopup: true,
            Password: '',
            ConfirmPassword: '',
            errors: false,
            success: false,
        }
    },
    computed: {
        showPopup: function() {
            if(this.hidePopup) {
                return false;
            }
            if(this.SelectedData.customerType) {
                if(this.SelectedData.customerType == 'corporate' || this.SelectedData.customerType == 'account') {
                    return false;
                }
            }
            return true;
        }
    },
    mounted: function() {
        this.ifEmailExist();
    },
    props: {
        SelectedData: [Object, Boolean]
    },
    methods: {
        validateRegistration() {
            const errors = [];
            if(!this.Password) {
                 errors.push('Password');
            }
            if(this.Password != this.ConfirmPassword) {
                errors.push('Password Doesn\'t Match');
            }
            if(errors.length) {
                this.errors = errors;
                console.log(errors);
                return false;
            } else {
                this.errors = false;
                this.createAccount();
            }
        },
        ifEmailExist() {
            axios
                .get(this.siteUrl + 'checkout/API/RegisterCredit.php?checkEmail='+this.SelectedData.email)
                .then(response => {
                    if (response.data.status == 'true' || response.data.status == true) {
                        this.hidePopup = true;
                    } else {
                        this.hidePopup = false;
                    }
                })
        },
        createAccount() {
            const formData = new FormData();
            let birthday = '';
            birthday = this.SelectedData.birthday.mm + "/" + this.SelectedData.birthday.dd + "/" + this.SelectedData.birthday.yy;
            formData.append('firstName', this.SelectedData.firstName);
            formData.append('lastName', this.SelectedData.lastName);
            formData.append('address1', this.SelectedData.address1);
            formData.append('address2', this.SelectedData.address2);
            formData.append('city', this.SelectedData.city);
            formData.append('state', this.SelectedData.state);
            formData.append('zip', this.SelectedData.zip);
            formData.append('country', this.SelectedData.country);
            formData.append('email', this.SelectedData.email);
            formData.append('birthday', birthday);
            formData.append('cell', this.SelectedData.cell);
            formData.append('password', this.Password);
            formData.append('orderId', this.SelectedData.OrderId);
            
            axios
                .post(this.siteUrl + 'checkout/API/RegisterCredit.php',
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
                    if(data.status=='ERROR') {
                        const errors = [];
                        errors.push(data.error);
                        this.errors = errors;
                    } else if(data.status=='SUCCESS') {
                        this.success = true;
                    }
                });
        },
    }
}
</script>

<style lang="scss" scoped>
.registerPop .validation ul li, .registerPop .validation ul li::before {
    color: #841D25;
}
.validation1 h6 {
    padding-bottom: 10px;
    color: #000000;
    font-weight: normal;
    font-size: 16px;
    margin: 0 0 15px 0;
}
.validation1 a {
    color: #4e841d;
}
</style>
