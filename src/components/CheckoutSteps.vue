<template>
    <div class="container conPaddingS conWidth">
        <div class="checkoutSteps container">
            <div
                v-for="step in stepsArr"
                :key="step.key"
                class="checkoutStep"
                :class="[
                    { checkoutStepDone: steps[step.index].completed },
                    { checkoutStepActive: stepActive == step.name },
                    { checkoutStepHide: step.name == 'step3' &&  userType == 'corporate'}
                ]"
                :id="step.id"
                @click="moveToStep(step.move)"
            >
                <i class="stepLine"></i>
                <i class="stepCircle"></i>
                <span class="stepTitle">{{step.label}}</span>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data: function() {
        return {
            stepsArr: [
                { name: 'step1', label: 'Submit Document', id: 'checkoutStep1', move: [0, 1], index: 'step1' },
                { name: 'step2', label: 'Calculate Price', id: false, move: [0, 2], index: 'step2' },
                { name: 'step3', label: 'Payment', id: false, move: [0, 3], index: 'step3' },
                { name: 'step4', label: 'Confirm', id: false, move: [0, 4], index: 'step4' },
                { name: 'step5', label: 'Success', id: 'checkoutStep5', move: false, index: 'step5' }
            ]
        };
    },
    props: {
        steps: [Object, String],
        stepActive: String,
        userType: [Boolean, String],
    },
    methods: {
        moveToStep(move) {
            if(move && this.stepActive != 'step5') {
                this.$emit('moveToStep', move);
            }
        }
    }
};
</script>

<style>
.checkoutStep {
    opacity: .7;
}
.checkoutStepActive, .checkoutStepDone {
	opacity: 1;	
}
.checkoutStepHide {
    display: none;
}
</style>
