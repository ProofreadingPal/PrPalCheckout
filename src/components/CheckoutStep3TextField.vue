<template>
<div class="col col-2">
    <label class="formLabel">{{label}}</label>
    <input
        type="text"
        :placeholder="label"
        class="formText"
        v-model="value"
        @input="$emit('updatedField',value)"
    />
</div>
</template>

<script>
export default {
    props: {
        label: String,
        valueField: String,
    },
    data() {
        return {
            value: this.valueField,
        };
    },
}
</script>