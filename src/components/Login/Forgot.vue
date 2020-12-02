<template>
  <form @submit.prevent>
    <div v-if="!passwordResetSuccess">
      <p>Get an e-mail to reset your password.</p>
      <v-text-field
        prepend-icon="mdi-email"
        v-model.trim="passwordForm.email"
        type="text"
        label="Email Address"
        id="email3"
      />
      <v-card-actions>
        <v-btn :disabled="passwordForm.email === ''" @click="resetPassword" class="v-btn">Submit</v-btn>
      </v-card-actions>
    </div>
    <div v-else>
      <h3>Email sent</h3>
      <p>Check your emails to reset your password.</p>
    </div>
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
    resetPassword() {
      this.alert = false;
      this.error = "";
      fb.auth
        .sendPasswordResetEmail(this.passwordForm.email)
        .then(() => {
          this.passwordResetSuccess = true;
          this.passwordForm.email = "";
        })
        .catch(err => {
          this.error = err;
          this.alert = true;
          this.passwordForm = {
            email: ""
          };
        });
    }
  },
  data() {
    return {
      passwordForm: {
        email: ""
      },
      alert: false,
      error: "",
      passwordResetSuccess: false
    };
  }
};
</script>