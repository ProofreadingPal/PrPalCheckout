<template>
<section class="breadcrumbs">
    <div class="breadcrumbsIn container conPaddingS conWidth">
        <div class="breadCrumbItem" v-for="breadcrumb in breadcrumbs" v-bind:key="breadcrumb.id">
            <a :href="siteUrl" v-if="breadcrumb.title === 'Home'">Home</a>
            <router-link :to="breadcrumb.link" v-else-if="breadcrumb.link">{{ breadcrumb.title }}</router-link>
            <span v-if="breadcrumb.link"> / </span>
            <span v-else-if="breadcrumb.title !== 'Home'">{{ breadcrumb.title }}</span>
        </div>
    </div>
</section>   
</template>

<script>
export default {
    props: {
        breadcrumbs : Array
    }
}
</script>

<style scoped>
.breadCrumbItem {
    display: inline;
}
</style>