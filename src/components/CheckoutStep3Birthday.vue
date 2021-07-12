<template>
    <div class="col col-2">
        <label class="formLabel">{{ label }}</label>
        <div class="birthdayField">
            <input
                type="text"
                class="formText"
                v-model="value.mm"
                maxlength="2"
                placeholder="mm"
                @change="updateBirthday(value)"
            />
             / 
            <input
                type="text"
                class="formText"
                v-model="value.dd"
                maxlength="2"
                placeholder="dd"
                @change="updateBirthday(value)"
            />
             / 
            <input
                type="text"
                class="formText"
                v-model="value.yy"
                maxlength="2"
                placeholder="yy"
                @change="updateBirthday(value)"
            />
        </div>
        <div class="step3RightTxtNote">
            (Your birth date will be used for accessing completed document.)
        </div>
    </div>
</template>

<script>
export default {
    props: {
        label: String,
        valueField: [Object, String],
    },
    data() {
        return {
            value: this.valueField
        };
    },
    methods: {
        updateBirthday(value) {
            if(value.mm) {
                this.value.mm = this.zeroForce(value.mm);
            }
            if(value.dd) {
                this.value.dd = this.zeroForce(value.dd);
            }
            if(value.yy) {
                this.value.yy = this.zeroForce(value.yy);
            }
            this.$emit('updatedField', value);
        },
        zeroForce(value){
            return ('00'+value).slice(-2);
        }
    },
};
</script>
