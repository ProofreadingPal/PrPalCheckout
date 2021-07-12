<template>
    <div>
        <label class="formLabel">In house style guide {{ order }}</label>

        <div class="fileUploadDiv" v-show="fileUrl">
            <a :href="siteUrl + fileUrl">{{ fileName }}</a><br />
            <a
                href="javascript:void(0)"
                @click="deleteFile()"
                style="color: red;padding-left:10px;"
                >[Delete]</a
            >
        </div>

        <transition name="fade">
        <div style="position:relative;" v-show="uploading">
            <div
                id="load_div9"
                style="display:none; position:absolute;  top: -23px;"
            >
                <img
                    :src="siteUrl + '/imgs/indicator.gif'"
                    alt=""
                    width="42"
                    height="28"
                />
                Please wait while your document uploads.
            </div>
        </div>
        </transition>

        <div class="fileUploadDiv" v-show="!uploading">
            <input
                class="formFileUploade1"
                type="file"
                name="file_path9"
                ref="file"
                id="file_path9"
                @change="handleFileUpload()"
            />
            <div class="step3RightTxtNote">
                (*File size should not be more than 10 MB)
            </div>

            <transition name="fade">
                <div class="fileError" v-show="!validFile">
                    <p>
                        Only .doc, .docx and .pdf files are allowed to upload.
                    </p>
                </div>
            </transition>

            <transition name="fade">
                <div class="fileSuccess" v-show="uploadedFile">
                    <p>Style guide is updated!</p>
                </div>
            </transition>

            <transition name="fade">
                <div class="fileSuccess" v-show="deletedFile">
                    <p>Style guide is deleted!</p>
                </div>
            </transition>

            <transition name="fade">
                <div class="fileError" v-show="errors">
                    <p>{{ errors }}</p>
                </div>
            </transition>
        </div>
    </div>
</template>
<script>
import axios from 'axios';

export default {
    props: {
        url: String,
        name: String,
        order: Number
    },
    data() {
        return {
            file: '',
            errors: '',
            fileName: '',
            fileUrl: '',
            uploading: false,
            validFile: true,
            uploadedFile: false,
            deletedFile: false,
        };
    },
    watch: {
        url: function() {
            this.fileUrl = this.url;
        },
        name: function() {
            this.fileName = this.name;
        }
    },
    methods: {
        turnErrorsOff() {
            this.errors = '';
            this.uploadedFile = '';
            this.deletedFile = '';
        },
        handleFileUpload() {
            this.turnErrorsOff();
            this.file = this.$refs.file.files[0];
            const extension = this.getFileExtension(this.file.name);
            this.checkIfValidFileType(extension);
            if(this.file.size > 25*1024*1024) {
                // maximum allowed 25 mb
                this.errors = 'Maximum file size allowed is 25 MB';
            } else if (this.checkIfValidFileType(extension)) {
                this.validFile = true;
                this.uploadFile();
            } else {
                this.validFile = false;
            }
        },
        deleteFile() {
            this.turnErrorsOff();
            const formData = new FormData();
            formData.append('order', this.order);
            formData.append('user_id', this.userId);
            formData.append('action', 'delete');
            axios
            .post(
                this.siteUrl + 'account/API/styleGuideUpload.php',
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }
            ).then(response => {
                if (response.data.errors) {
                    this.errors = response.data.errors;
                } else {
                    this.fileUrl = '';
                    this.fileName = '';
                    this.deletedFile = true;
                }
                this.uploading = false;
            });
        },
        uploadFile() {
            this.uploading = true;
            const formData = new FormData();
            formData.append('file', this.file);
            formData.append('order', this.order);
            formData.append('user_id', this.userId);
            axios
            .post(
                this.siteUrl + 'account/API/styleGuideUpload.php',
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }
            )
            .then(response => {
                console.log(response.data);
                if (response.data.errors) {
                    this.errors = response.data.errors;
                } else {
                    this.fileUrl = response.data.url;
                    this.fileName = response.data.name;
                    console.log(this.fileUrl);
                    this.uploadedFile = true;
                }
                this.uploading = false;
            });
        },
        checkIfValidFileType(ext) {
            const validTypes = ['doc', 'docx', 'pdf'];
            if (validTypes.includes(ext)) {
                return true;
            }
            return false;
        },
        getFileExtension(file) {
            const re = /(?:\.([^.]+))?$/;
            const ext = re.exec(file)[1];
            return ext;
        }
    }
};
</script>

<style lang="scss" scoped>
.fileUploadDiv {
    overflow: hidden;
    margin-right: 20px;
}
.fileError {
    margin: 10px 20px 15px 0;
    padding: 10px 15px 10px 15px;
    background-color: #faebec;
    border: #d8b5b7 1px solid;
    p {
        margin: 0;
        color: #ae101c;
        font-size: 13px;
    }
}
.fileSuccess {
    margin: 10px 20px 15px 0;
    padding: 10px 15px 10px 15px;
    background-color: #f2faeb;
    border: #c5d8b5 1px solid;
    p {
        margin: 0;
        color: #4e841d;
        font-size: 13px;
    }
}
</style>
