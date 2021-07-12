<template>
    <div class="formRow container formRow">
        <div class="formFileUploadNote">(*Your word count creates a total price of "<b>${{SelectedData.totalBeforeMinAmount}}</b>" which is less than our minimum ${{SelectedData.turnaround.Min}} fee. We have a minimum of ${{SelectedData.turnaround.Min}} for {{SelectedData.turnaround.FriendlyName}} turnaround service. Your order has been increased to our minimum fee of ${{SelectedData.turnaround.Min}})'</div>
    </div>
</template>

<script>
export default {
    props: {
        SelectedData: [Object, Boolean]
    }
}
</script>

<style lang="scss" scoped>
.formFileUploadNote {
    font-weight: normal; 
    font-size: 12px;
}
</style>