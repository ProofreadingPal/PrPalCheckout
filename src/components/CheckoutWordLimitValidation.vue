<template>
    <div class="validation" v-if="turnaround && numberWords > 0">
        <p>We're sorry but your document has {{numberWords}} words which is too many words for your selected turnaround speed. Please see our word limits below and choose a turnaround speed that is accepted.</p>
        <ul>
            <li>Please email us for documents over {{maxLimit}} words</li>
            <li
            v-for="turnaround in turnarounds"
            :key="turnaround.key">
                {{ turnaround.FriendlyName }} turnaround {{ turnaround.WordLimit }} word limit
            </li>
        </ul>
    </div>
</template>

<script>
export default {
    props: {
        turnaround: [Object, Boolean],
        turnarounds: [Array, Boolean],
        numberWords: [Number, Boolean, String],
        maxLimit: [Number, Boolean, String],
    },
}
</script>