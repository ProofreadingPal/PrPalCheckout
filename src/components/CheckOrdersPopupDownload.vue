<script>
import PopupLayout from '@/components/PopupLayout.vue';
import axios from 'axios';

export default {
    extends: PopupLayout,
    data() {
        return {
            PopupContent: ''
        };
    },
    props: {
        OrderId: Number
    }, 
    mounted: function() {
        this.loadPopupContent();
    },
    methods: {
        loadPopupContent() {
            const projectData = {
                id: this.OrderId,
                action: 'getDownloadBox'
            };
            axios
                .post(
                    this.siteUrl + 'account/API/AccountData.php?v=1',
                    projectData
                )
                .then(response => {
                    if (response.data.error) {
                        this.errors = response.data.message;
                    } else {
                        this.PopupContent = response.data;
                    }
                })
        }
    }
};
</script>
