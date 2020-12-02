<template>
  <form @submit.prevent>
    <div>
      <v-text-field
       prepend-icon="mdi-email"
       label="E-Mail"
       v-model.trim="loginForm.email"
       type="text" id="email1" />
      <v-text-field
        prepend-icon="mdi-key"
        v-model.trim="loginForm.password"
        type="password"
        label="Password"
        id="password1"
      />
    </div>
    <v-card-actions>
      <v-btn
        depressed
        color="primary"
        @click="login"
        :disabled="loginForm.email && loginForm.password === ''"
        class="v-btn"
      >Log In</v-btn>
    </v-card-actions>
    <v-alert
      outlined
      class="alert"
      color="red lighten-2"
      dark
      dismissible
      v-if="error !== ''"
      v-model="alert"
    >{{error}}</v-alert>
  </form>
</template>

<script>
const fb = require("../../firebaseConfig");
export default {
  methods: {
    login() {
      this.alert = false;
      this.error = "";
      fb.auth
        .signInWithEmailAndPassword(
          this.loginForm.email,
          this.loginForm.password
        )
        .then(user => {
          this.$store.commit("setCurrentUser", user.user);
          this.$store.dispatch("fetchUserProfile");
          this.$router.push("/dashboard");
        })
        .catch(err => {
          this.error = err;
          this.alert = true;
          this.loginForm = {
            name: "",
            email: "",
          };
        });
    }
  },
  data() {
    return {
      loginForm: {
        email: "",
        password: ""
      },
      error: "",
      alert: false
    };
  }
};
</script>