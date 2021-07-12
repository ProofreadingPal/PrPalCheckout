<template>
    <div id="uploadBox" style="margin-bottom:15px;">
        <label class="formLabel">Upload Your Document</label>
        <transition name="fade">
        <div style="position:relative;" v-show="uploading">
            <div
                style="position:absolute;  top: -23px;"
            >
                <img
                    :src="siteUrl + 'imgs/indicator.gif'"
                    alt=""
                    width="42"
                    height="28"
                />
                Please wait while your document uploads.
            </div>
        </div>
        </transition>

        <div v-show="!uploading">
            <input
                class="formFileUploade"
                type="file"
                ref="file"
                @change="handleFileUpload()"
            />
            <div class="step3RightTxtNote">
                (*File size should not be more than 25 MB)<br />
                <span style="vertical-align:middle;"
                    >Supported file types:</span
                >
                <img
                    :src="siteUrl + 'imgs/2015/file-types.png'"
                    alt="File Types"
                    style="width:44px;height:26px;vertical-align:middle;"
                />
            </div>

            <div style="word-break: break-all;" v-show="fileUrl">
                Your Document Has Been Uploaded :
                <a :href="siteUrl.slice(0, -1) + fileUrl">{{ fileName }}</a>
            </div>
            
            <transition name="fade">
                <div class="fileError" v-show="!validFile">
                    <p>
                        Only .doc, .docx and .pdf files are allowed to upload.
                    </p>
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
    data() {
        return {
            file: '',
            errors: '',
            fileName: this.fileUploaded.name,
            fileUrl: this.fileUploaded.url,
            uploading: false,
            validFile: true,
            uploadedFile: false,
        };
    },
    props: {
        fileUploaded: [Object, Boolean]
    },
    created: function() {
        /*if(this.fileName) {
            this.uploadedFile = true;
        }*/
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
        uploadFile() {
            this.uploading = true;
            const formData = new FormData();
            formData.append('file', this.file);
            axios
            .post(
                this.siteUrl + 'checkout/API/checkoutUpload.php',
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }
            )
            .then(response => {
                if (response.data.errors) {
                    this.errors = response.data.errors;
                } else {
                    this.fileUrl = response.data.url;
                    this.fileName = response.data.name;
                    this.uploadedFile = true;
                    this.$emit('fileUploaded', response.data);
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
        },
    },
}
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
