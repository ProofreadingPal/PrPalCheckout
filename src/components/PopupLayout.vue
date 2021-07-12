<template>
    <transition name="fade">
    <div>
        <div class="popupBg" id="popupBg"></div>
        
        <div
            class="registerPop"
            id="registerPop"
            style="background:#3c82b5;position:fixed;top:80px;"
        >
            <a
                href="javascript:void(0)"
                class="closeBtn"
                @click="hidePopup"
                ><span>close X</span></a
            >
            <h3>Download your file(s)</h3>
            <div class="downloadInside">
                <div id="downloadBox" v-html="PopupContent">
                </div>
            </div>
        </div>
    </div>
    </transition>
</template>

<script>
export default {
    methods: {
        hidePopup() {
            this.$emit('closed')
        }
    }
}
</script>