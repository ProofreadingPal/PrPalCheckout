<template>
    <div class="formRow container" v-if="CustomerCheckoutOptions[type]">
        <div class="col col_2_of_2">
            <label class="formLabel" v-html="labelTitle"></label><br />
            <input
                type="checkbox"
                :name="type"
                style="width: 20px;"
                :checked="type == SelectedData.customerOrderType"
                :value="type"
                @change="customerOptionUpdate(type)"
            />
            <span v-html="checkOption"></span>
            <div
                class="formWritingStyleAlert step3RightTxtNote"
                v-html="Description"
            ></div>
        </div>
        <div class="clearAll"></div>
    </div>
</template>

<script>
export default {
    props: {
        SelectedData: Object,
        CustomerCheckoutOptions: Object,
        type: String,
    },
    computed: {
        labelTitle: function() {
            if (this.type == 'liteplus') {
                return 'Dedicated Team Proofreading, Editing, and Commentary + Lite <sup style="color: #e87b17;">new</sup>';
            } else if (this.type == 'prof1reader') {
                return 'Dedicated Team Proofreading, Editing, and Commentary (Formerly 1.0)';
            } else if (this.type == 'proflitereader') {
                return 'ProofreadingPal Lite';
            }
            return '';
        },
        checkOption: function() {
            if (this.type == 'liteplus') {
                return 'Make this a Dedicated Team Proofreading, Editing, and Commentary + Lite order <sup style="color: #e87b17;">new</sup>';
            } else if (this.type == 'prof1reader') {
                return 'Make this a Dedicated Team Proofreading, Editing, and Commentary (Formerly 1.0) order';
            } else if (this.type == 'proflitereader') {
                return 'Make this a ProofreadingPal Lite order';
            }
            return '';
        },
        Description: function() {
            if (this.type == 'liteplus') {
                return 'Dedicated Team Proofreading, Editing, and Commentary + Lite is a special feature only given to certain customers.';
            } else if (this.type == 'prof1reader') {
                return 'Dedicated Team Proofreading, Editing, and Commentary (Formerly 1.0) is a special feature only given to certain customers. Only one proofreader will be used on Dedicated Team Proofreading, Editing, and Commentary (Formerly 1.0) orders. Dedicated Team Proofreading, Editing, and Commentary (Formerly 1.0) is designed for high-volume customers whom are looking to maintain consistency with their projects.';
            } else if (this.type == 'proflitereader') {
                return `ProofreadingPal Lite is a special service given to only certain customers. One proofreader is used on ProofreadingPal Lite orders, and the proofreader will do very little sentence structure and clarity editing. The proofreader will limit their efforts to just proofreading for grammar, spelling, and punctuation. ProofreadingPal Lite is designed for the high-volume customer who's looking for a skilled proofreader to put the final polishing on their work.`;
            }
            return '';
        }
    },
    methods: {
        customerOptionUpdate(type) {
            if(this.SelectedData.customerOrderType == type) {
                type = '';
            }
            this.$emit('customerOptionUpdate', type);
        }
    },
};
</script>
