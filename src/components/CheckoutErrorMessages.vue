<template>
    <div class="validation">
        <h5>Attention:</h5>
        <h6>Please fill in the following field(s) before you proceed to the next step:</h6>
        <ul>
            <li v-for="error in errors" :key="error.key">{{error}}</li>
        </ul>
    </div>
</template>

<script>
export default {
    props: {
        errors: [Array, Boolean]
    }
}
</script>