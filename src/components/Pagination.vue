<template>
    <div>
        <span>Show rows:</span>
        <select v-model="ShowRows" @change="updateLimit($event)">
            <option :value="opt" v-for="opt in PaginationOptions" :key="opt">{{
                opt
            }}</option>
        </select> &nbsp;
        <i
            class="fas fa-angle-double-left paginationArrow"
            v-if="CurrentPage != 1"
            @click="updateCurrentPage($event,-1)"
        ></i>  
        &nbsp;<span v-if="PagesNumber != 0"
            >{{ CurrentPage }} of {{ PagesNumber }}</span
        >
        &nbsp; 
        <i
            class="fas fa-angle-double-right paginationArrow"
            v-if="CurrentPage < PagesNumber"
            @click="updateCurrentPage($event,1)"
        ></i>
    </div>
</template>

<script>
export default {
    data() {
        return {
            ShowRows: 10 // Show 10 rows by default
        };
    },
    props: {
        CurrentPage: Number,
        PagesNumber: Number,
        PaginationOptions: Array
    },
    computed: {},
    methods: {
        updateLimit(event) {
            this.$emit('limit', event.target.value);
        },
        updateCurrentPage(event,val) {
            this.$emit('current', val);
        }
    }
};
</script>

<style lang="scss" scoped>
.paginationArrow {
    cursor: pointer;
}
.paginationArrow:hover {
    opacity: 0.7;
}
.separator {
    width: 8px;
    display: inline-block;
}
</style>
