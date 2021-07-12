<template>
    <div class="formRow container formWritingStyleAlert">
        <div class="">
            <div style="margin-bottom:15px;">
                <p class="alertexplanationP">
                    In Microsoft Word, go to the Review tab or Tools menu, and
                    select Word Count.
                </p>
                <p class="alertexplanationP">
                    To automatically count the number of words in your document,
                    copy and paste the text into the box below.
                </p>
                <textarea
                    class="formTextarea"
                    :value="Message"
                    @keyup="charCount($event)"
                ></textarea>
                <div
                    class="step3RightTxtNote alignRight"
                    style="padding-top: 5px;"
                >
                    The text you enter above will not be stored online.
                    <a
                        href="javascript:void(0)"
                        class="clearButton"
                        @click="(Message = ''), $emit('helperCount', '')"
                        >Clear</a
                    >
                </div>
            </div>
        </div>
        <div class="clearAll"></div>
        <i
            class="fa fa-times closeButton"
            id="closeWordsBox"
            @click="$emit('hideHelper')"
        ></i>
    </div>
</template>
<script>
export default {
    data() {
        return {
            Message: ''
        };
    },
    methods: {
        charCount(event) {
            this.Message = event.target.value;
            const mess = this.Message;
            let messageLength = mess.match(/\b[-?(\w+)?]+\b/gi);
            messageLength = messageLength.length;
            this.$emit('helperCount', messageLength);
        }
    }
};
</script>
<style lang="scss" scoped>
.formWritingStyleAlert {
    position:relative;
    padding-right: 35px;
}
</style>
