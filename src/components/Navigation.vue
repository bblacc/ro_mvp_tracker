<template>
<div>
  <v-navigation-drawer
      v-model="drawer"
      app
      clipped
    >
      <v-list dense>
        <v-list-item
          v-for="item in items"
          :key="item.text"
          :to="item.url"
          link
        >
          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>
              {{ item.text }}
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item @click="logout">
        <v-list-item-action>
            <v-icon>mdi-logout</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>
              Log out
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
       <!-- <v-subheader>EXTERNAL LINKS</v-subheader> -->
      </v-list>
    </v-navigation-drawer>
    <v-app-bar
      app
      clipped-left
      color="primary"
      dense
      class="white--text"
    >
      <v-app-bar-nav-icon class="white--text" @click.stop="drawer = !drawer" />
      <v-icon
        class="mx-4 white--text"
        large
      >
        mdi-progress-wrench
      </v-icon>
      <v-toolbar-title class="mr-12 align-center">
        <span class="title">Ragnarok Toolkit</span>
      </v-toolbar-title>
    </v-app-bar>
    </div>
</template>

<script>
    const fb = require('../firebaseConfig.js')
    export default {
        methods: {
            logout() {
                fb.auth.signOut().then(() => {
                    this.$store.dispatch('clearData')
                    this.$router.push('/login')
                }).catch(err => {
                    console.log(err)
                })
            }
        },
            data: () => ({
      drawer: null,
      items: [
      //  { icon: 'mdi-view-dashboard', text: "Dashboard", url: 'dashboard'},
        { icon: 'mdi-crown', text: 'MVP Tracker' , url: 'mvptracker'},
        { icon: 'mdi-help', text: 'About' , url: 'about'},
        { icon: 'mdi-security', text: 'Privacy Policy' , url: 'privacy'},
      //  { icon: 'mdi-cog', text: 'Settings', url: 'settings' },
      ]
    })
    }
</script>