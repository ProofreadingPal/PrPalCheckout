<template>
    <div class="onsaleCountdown" v-if="Onsale">
        <strong>{{Onsale.Percent}}% off sale</strong> ends in
        <vue-countdown :time="Onsale.TimeLeft * 1000" v-slot="{ hours, minutes, seconds }">
            {{ hours | leadingZero }}:{{ minutes | leadingZero }}:{{ seconds | leadingZero }}
        </vue-countdown>
    </div>
</template>
<script>
import VueCountdown from '@chenfengyuan/vue-countdown';
export default {
    components: {
        VueCountdown,
    },
    props: {
        Onsale: [Object, Boolean],
    },
    filters: {
        leadingZero: function (value) {
            if (value < 10) {
                return "0"+ value;
            }
            return value;
        }
    }
}
</script>