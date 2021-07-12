<template>
    <p style="margin-top: 5px;float:left;">
        Filter by year:
        <select
            class="selectField"
            v-model="FilteredYear"
            @change="filteryear($event)"
        >
            <option v-for="year in years" :key="year">{{year}}</option>
        </select>
    </p>
</template>

<script>
export default {
    data() {
        return {
            FilteredYear: new Date().getFullYear(), // Current year as default filter
            
        };
    },
    computed : {
        years () {
            // Return years array starting from 2010 for select filter
            const year = new Date().getFullYear()
            return Array.from({length: year - 2009}, (value, index) => 2010 + index)
        }
    },
    methods: {
        filteryear(event) {
            this.$emit('year', event.target.value);
        },
    },
}
</script>
