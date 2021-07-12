<template>
    <div>
        <label class="formLabel">Writing Style</label>
        <div class="step3RightTxtNote">
            Select a writing style for our editors to apply. Click the selection
            for an explanation.
        </div>

        <div v-if="writingStyles.length">
            <div v-for="writingStyle in writingStyles" :key="writingStyle.key">
                <input
                    type="radio"
                    name="wstyle"
                    :value="writingStyle.name"
                    :checked="writingStyle.name==selectedWritingStyle.name"
                    @change="updateWritingStyle(writingStyle)"
                />
                {{ writingStyle.friendly }}
            </div>
        </div>

        <transition name="fade">
        <div
            class="formWritingStyleAlert"
            v-show="isSelectedWritingStyle()"
        >
            <strong>{{selectedWritingStyle.friendly}}</strong><br />{{selectedWritingStyle.description}}
        </div>
        </transition>
    </div>
</template>

<script>
export default {
    props: {
        selectedWritingStyle: [Object, Boolean],
    },
    data() {
        return {
            value: this.selectedWritingStyle,
            writingStyles: [
                {
                    name: 'mla',
                    friendly: 'Modern Language Association (MLA)',
                    description: `The MLA style, which is set forth in the MLA Handbook for Writers of Research Papers (8th ed.), is most commonly used to write papers and cite sources within the liberal arts and humanities.`
                },
                {
                    name: 'apa',
                    friendly: 'American Psychological Association (APA)',
                    description: `The APA style, which is set forth in the 7th edition of the APA manual, is commonly used to cite sources within the social sciences.`
                },
                {
                    name: 'cds',
                    friendly: 'Chicago Documentation Style',
                    description: `Most history instructors and some humanities instructors require you to document sources with footnotes or endnotes based on The Chicago Manual of Style, 17th ed. (2017). When you use Chicago-style notes, you will usually be asked to include a bibliography at the end of your paper.`
                },
                {
                    name: 'bos',
                    friendly: 'CSE Style: Biology and Other Sciences',
                    description: `Though scientific publications document sources in similar ways, the details of presenting source information vary from journal to journal. Often publications provide prospective authors with style sheets that outline formats for presenting sources. Before submitting an article to a scientific publication, you should request its style sheet. If one is not available, examine a copy of the publication to see how sources are documented. When writing for a science course, check with your instructor about how to cite and list your sources.`
                },
                {
                    name: 'be',
                    friendly: 'Business Editing',
                    description: `ProofreadingPal offers business proofreading for newsletters, enewsletters, web sites, emails, memos, business proposals, grants, sales contracts, brochures, flyers, and other formal business documents. Our professional editors correct grammatical errors, including punctuation, capitalization, verb tense, spelling, and sentence structure.`
                },
                {
                    name: 'psa',
                    friendly:
                        'Personal Statement, Application Essay, Resume, or Cover Letter',
                    description: `Personal Statement, Application Essay, Resume, or Cover Letter. Select this option if you are submitting a personal statement, application essay, resume, or cover letter.`
                },
                {
                    name: 'ows',
                    friendly: 'Other Writing Style',
                    description: `Please use the document description area below to describe the style or method you would like ProofreadingPal to use. Select this option if you are submitting a book, magazine or anything not listed above.`
                }
            ]
        };
    },
    methods: {
        updateWritingStyle(writingStyle) {
            this.$emit('updateWritingStyle', writingStyle);
        },
        isSelectedWritingStyle() {
            if(this.selectedWritingStyle) {
                return true;
            }
            return false;
        }
    }
};
</script>
