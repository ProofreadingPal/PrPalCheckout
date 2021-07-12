import Vue from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios'
import VueAxios from 'vue-axios'
Vue.config.productionTip = true
Vue.config.errorHandler = function (err) {
    const currentUrl = window.location.href;
    const formData = new FormData();
    formData.append('err', err.toString());
    formData.append('currentUrl', currentUrl);
    axios
    .post('https://local.proofreadingpal.com/checkout/API/CheckoutLogs.php',
        formData,
        {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }
    );
}
Vue.mixin({
  data: function() {
    return {
      siteUrl:process.env.NODE_ENV === 'production'
        ? '/' //  /dev1/
        : 'https://local.proofreadingpal.com/',      
      userId: localStorage.authUser,
      loading: false,
    }
  },
  methods: {
    Auth(error) {
        if(error == 'forbidden') {
            //window.location.replace("/account/login.php");
            // allow access for guests on checkout
        }
    }
  }
})

Vue.use(VueAxios, axios)


new Vue({
    router, 
    render: h => h(App)
}).$mount('#app')
