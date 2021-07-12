<template>
    <header ref="mainHeader" id="mainHeader" class="mainHeader container">
        <div ref="darkOverlay" id="darkOverlay" class="darkOverlay"></div>
        <a :href="siteUrl + 'index.php'" id="logo"
            ><img
                :src="siteUrl + 'imgs/layout/proofreadingpal-logo.svg'"
                alt=""
                width="216"
                height="28"
        /></a>
        <a href="javascript:void(0)" class="menuHamburger" @click="showMenu()">
            <span></span>
            <span></span>
            <span></span>
        </a>
        <nav ref="mainNavigation" id="mainNavigation" class="mainNavigation">
            <div class="closeButtonHolder">
                <button class="closeButton" @click="showMenu()">
                    <i class="fa fa-close"></i>
                </button>
            </div>
            <div class="navItemParent" @click="showSubMenu($event)">
                <a href="javascript:void(0)" class="navItem">Services</a>
                <div class="subMenu container">
                    <div class="submenuCol">
                        <a :href="siteUrl + 'free-sample-proofread.php'"
                            >Get a Free Sample</a
                        >
                        <a :href="siteUrl + 'proofreading-services.php'"
                            >Proofreading Services</a
                        >
                        <a :href="siteUrl + 'business-proofreading.php'"
                            >Business Proofreading</a
                        >
                        <a :href="siteUrl + 'resume-proofreading.php'"
                            >Resume Proofreading</a
                        >
                        <a :href="siteUrl + 'academic-proofreading.php'"
                            >Academic Proofreading</a
                        >
                    </div>
                    <div class="submenuCol">
                        <a :href="siteUrl + 'student-proofreading.php'"
                            >Student Proofreading</a
                        >
                        <a :href="siteUrl + 'essay-proofreading.php'"
                            >Essay Proofreading</a
                        >
                        <a :href="siteUrl + 'book-manuscript-proofreading.php'"
                            >Books and Manuscripts</a
                        >
                        <a :href="siteUrl + 'english-translation.php'"
                            >Translation Partner</a
                        >
                        <a
                            :href="
                                siteUrl + 'thesis-dissertation-proofreading.php'
                            "
                            >Thesis and Dissertation</a
                        >
                    </div>
                </div>
            </div>
            <a :href="siteUrl + 'pricing.php'" class="navItem">Pricing</a>
            <div class="navItemParent" @click="showSubMenu($event)">
                <a href="javascript:void(0)" class="navItem">About</a>
                <div class="subMenu container">
                    <div class="submenuCol">
                        <a :href="siteUrl + 'free-sample-proofread.php'"
                            >Get a Free Sample</a
                        >
                        <a :href="siteUrl + 'about-proofreadingpal.php'"
                            >About ProofreadingPal</a
                        >
                        <a :href="siteUrl + 'satisfaction-guarantee.php'"
                            >100% Satisfaction Guarantee</a
                        >
                        <a :href="siteUrl + 'reviews.php'">Customer Reviews</a>
                        <a :href="siteUrl + 'two-proofreader-model.php'"
                            >Two-Proofreader Model</a
                        >
                    </div>
                    <div class="submenuCol">
                        <a
                            :href="
                                siteUrl +
                                    'about-proofreadingpal.php#proofreaders'
                            "
                            >Meet Our Proofreaders</a
                        >
                        <a :href="siteUrl + 'proofreading-pulse/'"
                            >ProofreadingPal Blog</a
                        >
                    </div>
                </div>
            </div>

            <a :href="siteUrl + 'reviews.php'" class="navItem">Reviews</a>
            <a :href="siteUrl + 'faq.php'" class="navItem">FAQs</a>
            <div class="navItemParent" @click="showSubMenu($event)">
                <a href="javascript:void(0)" class="navItem"
                    >Customer Service</a
                >
                <div class="subMenu subMenuRight container">
                    <div class="submenuCol">
                        <a :href="siteUrl + 'customer-support.php'">Customer Service</a>
                        <a :href="siteUrl + 'faq.php'">Frequently Asked Questions</a>
                        <a :href="siteUrl + 'proofreading-career-opportunities.php'">Career Opportunities</a>
                        <a :href="siteUrl + 'feedback.php'">Feedback</a>
                    </div>
                </div>
            </div>
            <div v-if="logedIn" class="navItemParent" @click="showSubMenu($event)">
                <a href="javascript:void(0)" class="navItem"
                    >{{formData.Email}}</a
                >
                <div class="subMenu accountDropdown">
                    <div class="actionArrow"></div>
                    <div class="actionInfo">
                        <h4>{{formData.FullName}}</h4>
                        <p>{{formData.Email}}</p>
                        <h5>{{formData.CustomerType}}</h5>
                    </div>
                    <div class="actionLinks">
                        <a
                            :href="siteUrl + 'account/'"
                            class="button button-light"
                            >Control Panel</a
                        >
                        <a
                            :href="siteUrl + 'account/logout.php'"
                            class="button button-light"
                            >Logout</a
                        >
                        <div class="clearAll"></div>
                    </div>
                </div>
            </div>
            <a v-if="!logedIn" :href="siteUrl + 'account/login.php'" class="navItem">Login</a>
            <a v-if="!logedIn" :href="siteUrl + 'check-orders.php'" class="navItem">Order Status</a>
        </nav>
    </header>
</template>

<script>
import axios from 'axios';

export default {
    data() {
        return {
            formData:{},
            logedIn: false,
        };
    },
    mounted: function() {
        this.getShortAccountData();
    },
    methods: {
        getShortAccountData() {
            const apiUniqueNumber = Math.ceil(Math.random()*1000000);
            const userData = { id: this.userId, action: 'getShortAccountData' };
            axios
                .post(
                    this.siteUrl + 'account/API/AccountData.php?apiUnique=' + apiUniqueNumber + '&v=1',
                    userData
                )
                .then(response => {
                    if (response.data.error) {
                        this.Auth(response.data.error);
                        this.logedIn = false;
                    } else {
                        this.formData = response.data;
                        this.logedIn = true;
                    }
                })
        },
        showMenu() {
            this.$refs.mainNavigation.classList.toggle("mainNavigationVisible");
            this.$refs.darkOverlay.classList.toggle("darkOverlayActive");
            this.$refs.mainHeader.classList.toggle("stickyMobile");
        },
        showSubMenu(obj) {
            obj.currentTarget.classList.toggle("navItemActive");
        }
    }
};
</script>
