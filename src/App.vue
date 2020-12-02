<template>
  <v-app>
  <Navigation v-if="currentUser"></Navigation>
  <v-content>
    <router-view />
  </v-content>
  </v-app>
</template>

<script>
import {mapState} from 'vuex'
import Navigation from './components/Navigation';

export default {
  name: 'App',

  components: {
    Navigation,
  },
  computed: {
    ...mapState(['currentUser'])
  },
  data: () => ({
    //
  }),
};
</script>
