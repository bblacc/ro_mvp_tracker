import Vue from 'vue'
import Vuex from 'vuex'
const fb = require('../firebaseConfig.js')

Vue.use(Vuex)

fb.auth.onAuthStateChanged(user => {
  if (user) {
    store.commit('setCurrentUser', user)
    store.dispatch('fetchUserProfile')

    fb.usersCollection.doc(user.uid).collection('mvps').onSnapshot(querySnapshot => {
      let mvpArray = []
      querySnapshot.forEach(doc => {
        let mvp = doc.data()
        mvp.ref = doc.ref.id
        mvpArray.push(mvp)
      })
      store.commit('setMVPs', mvpArray)
    })
  }
})

export const store = new Vuex.Store({
  state: {
    currentUser: null,
    userProfile: {},
    mvps: []
  },
  mutations: {
    setCurrentUser(state, val) {
      state.currentUser = val
    },
    setUserProfile(state, val) {
      state.userProfile = val
    },
    setMVPs(state, val) {
      state.mvps = val
    }
  },
  actions: {
    fetchUserProfile({ commit, state }) {
      fb.usersCollection.doc(state.currentUser.uid).get().then(res => {
        commit('setUserProfile', res.data())
      }).catch(err => {
        console.log(err)
      })
    },
    clearData({ commit }) {
      commit('setCurrentUser', null)
      commit('setUserProfile', {})
      commit('setMVPs', [])
    }
  },
  modules: {
  }
})