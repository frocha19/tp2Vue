import "@babel/polyfill";
import "mutationobserver-shim";
import Vue from "vue";
import "./plugins/bootstrap-vue";
import App from "./App.vue";
import router from "./router";
// Firebase App (the core Firebase SDK) is always required and must be listed first
import * as firebase from "firebase/app";
// Add the Firebase products that you want to use
import "firebase/auth";
import "firebase/firestore";
require("firebase/firestore");

Vue.config.productionTip = false;

// Your web app's Firebase configuration
var firebaseConfig = {
  apiKey: "AIzaSyBKflWT_AZ1pgt6hec5SMY5ZohQTfA_GA4",
  authDomain: "basiccrud-8a755.firebaseapp.com",
  databaseURL: "https://basiccrud-8a755.firebaseio.com",
  projectId: "basiccrud-8a755",
  storageBucket: "basiccrud-8a755.appspot.com",
  messagingSenderId: "433238462433",
  appId: "1:433238462433:web:367710cfa750a594458ca0"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

/* Bind firebase to your Vue instance */
Vue.prototype.$firebase = firebase;

Vue.config.productionTip = false;

new Vue({
  router,
  render: h => h(App)
}).$mount("#app");
