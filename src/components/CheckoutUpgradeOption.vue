<template>
    <div class="formRow container">
        <p class="upsellMessage" v-if="!upgraded">
            <span style="vertical-align:middle;">
                <input
                    type="checkbox"
                    v-model="upgraded"
                    @change="$emit('upgrade', [upgradeTurnaround.turnaround, 'up'])"
                    style="width: auto;padding]: 0; margin-right: 6px; vertical-align:middle;"
                />
            </span>
            <span id="upgrade_message"
                >Upgrade to
                {{ upgradeTurnaround.turnaround.FriendlyName }} turnaround for
                only an extra ${{ upgradeTurnaround.diff }}</span
            ><br />
            <span
                id="upsellOvernight"
                style="vertical-align:middle; font-weight: normal; font-size: 12px;line-height:18px;display:none;"
            >
                This additional amount to upgrade to
                <span id="upov_speed"></span> reflects a % surcharge on top of
                our regular <span id="upov_speed2"></span> rates because
                <span id="upov_speed1"></span> orders of
                <span id="upov_words"></span> words or more submitted during the
                hours of <span id="upov_from"></span> and
                <span id="upov_to"></span> CT are subject to an overnight
                surcharge fee of %.<br />
            </span>
            <span
                style="vertical-align:middle; font-weight: normal; font-size: 12px;line-height:18px;display:none;"
            >
                This amount reflects <span id="upsellPercent">xx%</span> coupon
                code.
            </span>
        </p>
        <p v-else>
            <span
                style="vertical-align:middle; color: #014e81; font-weight: normal; font-size: 14px;"
            >
                <a
                    href="javascript:void(0)"
                    @click="downgrade()"
                    style="color: #014e81!important;"
                    >Change back to
                    {{ backTurnaround.FriendlyName }} turnaround</a
                >
            </span>
        </p>
    </div>
</template>

<script>
export default {
    data() {
        return {
            upgraded: false,
            backTurnaround: false
        };
    },
    mounted: function() {
        this.setBackTurnaround();
    },
    props: {
        upgradeTurnaround: [Object, Boolean],
        turnaround: [Object, Boolean]
    },
    methods: {
        setBackTurnaround() {
            this.backTurnaround = this.turnaround;
        },
        downgrade() {
            this.upgraded = false;
            this.$emit('upgrade', [this.backTurnaround, 'down']);
        },
    }
};
</script>
