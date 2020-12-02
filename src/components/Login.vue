<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" lg="12">
        <h1 class="text-center display-3">Ragnarok Toolkit</h1>
        <h3 class="subtitle-1 text-center"></h3>
      </v-col>
    </v-row>
    <v-row justify="center">
      <v-col cols="12" lg="3">
      <v-card>
        <v-card-text>
      <div v-if="loginBool === true">
        <SignIn />
      </div>
      <div v-if="createBool === true">
        <SignUp />
      </div>
      <div v-if="forgotBool === true">
        <Forgot />
      </div>
        </v-card-text>
      </v-card>
    <div class="text-center">
      <span  v-if="loginBool === false" ><a @click="login">Back to Login</a></span>
      <span  v-if="createBool === false && forgotBool === false"><a @click="create">Create an account</a> | </span>
      <span v-if="forgotBool === false && createBool === false"><a @click="forgot">Reset Password</a></span>
    </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
</style>

<script>
const fb = require("../firebaseConfig.js");
import SignIn from './Login/SignIn'
import SignUp from './Login/SignUp'
import Forgot from './Login/Forgot'

export default {
  components: {
    SignIn,
    SignUp,
    Forgot
  },
  methods: {
    login(){
      this.loginBool = true
      this.createBool = false
      this.forgotBool = false
    },
    create(){
      this.loginBool = false
      this.createBool = true
      this.forgotBool = false
    },
    forgot(){
      this.loginBool = false
      this.createBool = false
      this.forgotBool = true
    }
  },
  data() {
    return {
      passwordForm: {
        email: ""
      },
      loginBool: true,
      createBool: false,
      forgotBool: false
    };
  }
};
</script>