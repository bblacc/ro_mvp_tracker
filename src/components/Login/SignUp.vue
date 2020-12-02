<template>
  <form @submit.prevent>
    <v-text-field prepend-icon="mdi-account" label="Nickname" v-model.trim="signupForm.name" type="text" id="name" />
    <v-text-field prepend-icon="mdi-email" v-model.trim="signupForm.email" type="text" label="Email Address" id="email2" />
    <v-text-field
      prepend-icon="mdi-key"
      v-model.trim="signupForm.password"
      type="password"
      label="Password"
      id="password2"
    />
    <v-card-actions>
      <v-btn
        depressed
        color="primary"
        :disabled="signupForm.email && signupForm.name && signupForm.password === ''"
        @click="signup"
        class="v-btn"
      >Sign Up</v-btn>
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
const fb = require("../../firebaseConfig.js");
export default {
  methods: {
    signup() {
      this.alert = false;
      this.error = "";
      fb.auth
        .createUserWithEmailAndPassword(
          this.signupForm.email,
          this.signupForm.password
        )
        .then(credential => {
          this.$store.commit("setCurrentUser", credential.user);
          fb.usersCollection
            .doc(credential.user.uid)
            .set({
              name: this.signupForm.name
            })
            .then(() => {
              this.$store.dispatch("fetchUserProfile");
              this.$router.push("/dashboard");
            })
            .catch(err => {
              this.error = err;
              this.alert = true;
              this.signupForm = {
                name: "",
                email: "",
                password: ""
              };
            });
        })
        .catch(err => {
          this.error = err;
          this.alert = true;
          this.signupForm = {
            name: "",
            email: "",
            password: ""
          };
        });
    }
  },
  data() {
    return {
      signupForm: {
        name: "",
        email: "",
        password: ""
      },
      error: "",
      alert: false
    };
  }
};
</script>