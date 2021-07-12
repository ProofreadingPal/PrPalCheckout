<template>
    <div class="creditBox" v-if="credit">
        <div class="creditBoxValue">
            <span class="creditInfo">Credits</span><br />
            <span class="creditValue">${{CreditValue}}*</span>
        </div>
        <p>
            *This credit will be applied to your next order as long as you're
            logged into your account when placing the order.
        </p>
        <div class="clearAll"></div>
    </div>
</template>

<script>
export default {
    props: {
        credit: Number
    },
    computed: {
        CreditValue: function () {
            let creditvalu = this.credit/100;
            creditvalu = creditvalu.toFixed(2);
            return creditvalu
        }
    }
}
</script>

<style lang="scss" scoped>
.creditBox {
    float: right;
    width: 340px;
    font-size: 13px;
    font-weight: normal;
    line-height: 18px;
    color: #6b5846;
    background-color:#f2faeb;border:#c5d8b5 1px solid;
    padding: 20px;
    margin-bottom: 20px;
    @media only screen and (max-width: 660px) {
        float: none;
        width: auto;
    }

    .creditBoxValue {
        float: right;
        width: 80px;
        text-align: center;
        color: #409213;
        padding: 6px 10px;
        border: 2px solid #409213;
        text-align: center;

        .creditInfo {
            font-size: 10px;
            text-transform: uppercase;
        }
        .creditValue {
            font-size: 18px;
            font-weight: bold;
        }
    }
}
</style>
