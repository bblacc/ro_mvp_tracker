<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
            <v-row>
              <div v-for="mvp in mvps" :key="mvp.Name">
                <v-col cols="12" v-if="mvp.Respawn != null && mvp.Respawn != '' && mvp.Respawn >= 0 ">
                  <v-card class="mx-auto" min-width="400px" min-height="200px">
                    <div class="d-flex flex-no-wrap justify-space-between">
                    <div>
                        <v-card-title class="headline" v-text="mvp.Name"></v-card-title>
                        <v-card-subtitle>Spawning in {{mvp.Respawn}} (+ {{mvp.Offtime}}) minutes.</v-card-subtitle>
                        <v-card-text><p>{{mvp.RespawnFormatted}}</p><p>Map: {{mvp.Map}} {{mvp.Coordinates}}</p><v-btn depressed @click="copy(mvp.Map, mvp.Coordinates)"><v-icon left >mdi-content-copy</v-icon>Copy</v-btn></v-card-text>
                    </div>
                    <v-avatar class="ma-3" size="125">
                     <v-img v-if="mvp.img_url != ''" :src="require('../assets/img/' + mvp.img_url)" contain></v-img>
                     <v-img v-else src="../assets/img/na.png" contain></v-img>
                    </v-avatar>
                    </div>
                  </v-card>
                </v-col>
              </div>
            </v-row>
      </v-col>
    </v-row>
    <v-snackbar v-model="snackbar" :timeout="2000" top color="green darken-4">
      {{message}}
      <v-btn text @click="snackbar = false">Close</v-btn>
    </v-snackbar>
    <v-row>
      <v-col cols="12">
    <!--   <v-btn text @click="resetTimers()">Reset Timers</v-btn> -->
    <!--    <v-btn text @click="runTimer()">Update Timers</v-btn> -->
    How's your day, {{userProfile.name}}? :)
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <v-data-table
          hide-default-footer
          disable-pagination
          :sort-by="['Name']"
          :sort-desc="[false]"
          :headers="headers"
          :items="mvps"
          :search="search"
          :loading="loading"
          loading-text="Loading... Please wait"
        >
          <template v-slot:[`item.Actions`]="{item}">
          <v-icon
            small
            @click="deleteItem(item)"
          >
            mdi-delete
          </v-icon>
        </template>
          <template v-slot:[`item.Name`]="props">
            <v-edit-dialog
              :return-value.sync="props.item.Name"
              large
              persistent
              @save="save(props.item, 'Name')"
              @cancel="cancel"
              @open="open"
            >
              <div>{{props.item.Name}}</div>
              <template v-slot:input>
                <v-text-field
                  v-model="nameUpdate"
                  :label="props.item.Name"
                  single-line
                  counter
                  autofocus
                ></v-text-field>
              </template>
            </v-edit-dialog>
          </template>
          <template v-slot:[`item.Coordinates`]="props">
            <v-edit-dialog
              :return-value.sync="props.item.Coordinates"
              large
              persistent
              @save="save(props.item, 'Coordinates')"
              @cancel="cancel"
              @open="open"
            >
              <div>{{props.item.Coordinates}}</div>
              <template v-slot:input>
                <v-text-field
                  v-model="props.item.Coordinates"
                  label="Edit Coordinates"
                  single-line
                  counter
                  autofocus
                ></v-text-field>
              </template>
            </v-edit-dialog>
          </template>
          <template v-slot:[`item.Death`]="props">
            <v-edit-dialog
              :return-value.sync="props.item.Death"
              large
              persistent
              @save="save(props.item, 'Death')"
              @cancel="cancel"
              @open="open"
            >
              <div>{{props.item.Death}}</div>
              <template v-slot:input>
                <v-text-field
                  type="number"
                  v-model="props.item.Death"
                  label="Edit time of death"
                  single-line
                  counter
                  autofocus
                ></v-text-field>
              </template>
            </v-edit-dialog>
          </template>
          <template v-slot:[`item.Map`]="props">
            <v-edit-dialog
              :return-value.sync="props.item.Map"
              large
              persistent
              @save="save(props.item, 'Map')"
              @cancel="cancel"
              @open="open"
            >
              <div>{{props.item.Map}}</div>
              <template v-slot:input>
                <v-text-field
                  v-model="props.item.Map"
                  :rules="[max25chars]"
                  label="Edit"
                  single-line
                  counter
                  autofocus
                ></v-text-field>
              </template>
            </v-edit-dialog>
          </template>
          <template v-slot:top>
            <v-toolbar flat>
              <v-toolbar-title>MVP Spawns</v-toolbar-title>
              <v-divider class="mx-4" inset vertical />
              <v-text-field
                v-model="search"
                append-icon="mdi-magnify"
                label="Search"
                single-line
                hide-details
              ></v-text-field>
              <v-spacer />
              <v-dialog v-model="dialog" max-width="500px">
                <template v-slot:activator="{on}">
                  <v-btn depressed color="primary" v-on="on">New MVP</v-btn>
                </template>
                <v-card>
                  <v-card-title>Add a new MVP</v-card-title>
                  <v-card-text>
                    <form @submit.prevent>
                      <v-text-field
                        required
                        label="MVP Name*"
                        placeholder="Moonlight Flower"
                        v-model.trim="mvp.Name"
                      ></v-text-field>
                      <v-text-field
                        required
                        label="MVP Map*"
                        placeholder="pay_dun04"
                        v-model.trim="mvp.Map"
                      ></v-text-field>
                      <v-text-field
                        label="MVP Coordinates"
                        placeholder="120, 110"
                        v-model.trim="mvp.Coordinates"
                      ></v-text-field>
                      <v-text-field
                        type="number"
                        required
                        label="MVP Spawn Time (minutes)*"
                        v-model.trim="mvp.Spawntime"
                        placeholder="60"
                      ></v-text-field>
                      <v-text-field
                        type="number"
                        required
                        label="MVP Spawn Buffer (minutes)*"
                        v-model.trim="mvp.Offtime"
                        placeholder="10"
                      ></v-text-field>
<!--                       <v-text-field
                        type="text"
                        required
                        label="MVP Image URL"
                        v-model.trim="mvp.img_url"
                        placeholder="xyz.com/MVP_Picture.jpeg"
                      ></v-text-field> -->
                      <v-btn
                        :disabled="mvp.Name && mvp.Map && mvp.Offtime && mvp.Spawntime == ''"
                        @click="createMVP"
                        class="button"
                      >Add</v-btn>
                    </form>
                  </v-card-text>
                </v-card>
              </v-dialog>
              <v-divider class="mx-4" inset vertical />
              <v-btn depressed color="error" @click="resetTimers">Reset Timers</v-btn>
              <v-divider class="mx-4" inset vertical />
              <v-btn depressed color="error" @click="deleteDB" class="button">Reset Database</v-btn>
            </v-toolbar>
          </template>
        </v-data-table>
      </v-col>
    </v-row>
  </v-container>
</template>


<script>
import moment from "moment";
import { mapState } from "vuex";
import store from "../store/index.js";
const fb = require("../firebaseConfig.js");
const mvplist = require("../assets/mvplist.json");

export default {
  data() {
    return {
      mvp: {
        Name: "",
        Map: "",
        Offtime: "",
        Coordinates: "",
        Spawntime: "",
        Death: 0,
        ref: "",
        img_url: ""
      },
      nameUpdate: "",
      snack: false,
      snackColor: "",
      snackText: "",
      max25chars: v => v.length <= 25 || "Input too long!",
      loading: false,
      dialog: false,
      user: "no user",
      message: "",
      snackbar: false,
      search: "",
      headers: [
        { text: "MVP", align: "left", sortable: true, value: "Name" },
        { text: "Map", align: "left", sortable: false, value: "Map" },
        {
          text: "Coordinates",
          align: "left",
          sortable: false,
          value: "Coordinates"
        },
        {
          text: "Death (mins ago)",
          align: "left",
          sortable: false,
          value: "Death"
        },
        {
          text: "Respawn (in mins)",
          align: "left",
          sortable: false,
          value: "Respawn"
        },
        {
          text: "Respawn Time",
          align: "left",
          sortable: false,
          value: "RespawnFormatted"
        },
        {
          text: "Time Buffer (mins)",
          align: "left",
          sortable: false,
          value: "Offtime"
        },
       // {text: "Dead?",value: "Dead"},
        {text: "", value: "actions", sortable: false}
      ]
    };
  },
  computed: {
    ...mapState(["userProfile", "currentUser", "posts", "mvps"]),
  },
  mounted() {
    setTimeout(() => {
      if (this.mvps.length === 0) {
       this.buildDB();
      } else {
           this.runTimer();
        setInterval(() => {
           this.runTimer();
        }, 60000);
      }
    }, 1500);
  },
  methods: {
    runTimer() {
      this.mvps.forEach(mvp => {
        if (mvp.Dead === true) {
          const difference = -moment().diff(mvp.TimeOfSpawn, "minutes");
          fb.usersCollection
            .doc(this.currentUser.uid)
            .collection("mvps")
            .doc(mvp.ref)
            .update({
              Death: moment().diff(mvp.TimeOfDeath, "minutes"),
              Respawn: difference
            });
          if (moment().diff(mvp.TimeOfSpawn, "minutes") > 0) {
            fb.usersCollection
              .doc(this.currentUser.uid)
              .collection("mvps")
              .doc(mvp.ref)
              .update({
                Dead: false,
                Death: null,
                Respawn: null,
                RespawnFormatted: "",
                TimeOfDeath: "",
                TimeOfSpawn: ""
              });
            mvp.Dead = false;
          }
        }
      });
    },
    deleteDB() {
      if (confirm("This will delete EVERY entry and reload the database with standard MVPs. Are you sure?")) {
      this.loading = true;
      const path = fb.usersCollection.doc(this.currentUser.uid).collection("mvps");
          this.mvps.forEach((mvp, index) => {
            path.doc(mvp.ref).delete()
          });
        this.message = "Database deleted. Please refresh the page."
        this.snackbar = true
        this.loading = false
      } else {
        this.message = "Deletion aborted."
        this.snackbar = true
      }
    },
    copy(map, coords){
      const warp = "@warp " + map + " " + coords
      this.$copyText(warp).then(() => {
        this.message = "Copied! Paste with CTRL+V."
        this.snackbar = true
      })
    },
    resetTimers() {
      this.loading = true;
      if (confirm("This will set ALL MVP spawn timers back to 0. Are you sure?")) {
      const path = fb.usersCollection.doc(this.currentUser.uid).collection("mvps");
      const loop = new Promise((resolve, reject) => {
        this.mvps.forEach((mvp, index) => {
          path.doc(mvp.ref).update({
            Dead: false,
            Death: null,
            Respawn: null,
            RespawnFormatted: "",
            TimeOfDeath: "",
            TimeOfSpawn: ""
          }).then(() => {if (index === this.mvps.length -1) resolve(); });
        })
      });
      loop.then(() => {this.message = "Timers reset."; this.snackbar = true; this.loading = false;})
      } else {
        this.message = "Reset aborted."
        this.snackbar = true
      }
    },
    buildDB() {
      this.loading = true;
      mvplist.forEach(mvp => {
        fb.usersCollection
          .doc(this.currentUser.uid)
          .collection("mvps")
          .add({
            Name: mvp.Name,
            Coordinates: mvp.Coords,
            Map: mvp.Map,
            Offtime: mvp.Offtime,
            Spawntime: mvp.Spawntime,
            Death: mvp.Death,
            img_url: mvp.img_url
          });
      });
      this.loading = false;
    },
    createMVP() {
      fb.usersCollection
        .doc(this.currentUser.uid)
        .collection("mvps")
        .add({
          Name: this.mvp.Name,
          Map:  this.mvp.Map,
          Offtime: this.mvp.Offtime,
          Coordinates: (this.mvp.Coordinates !== undefined) ? this.mvp.Coordinates : "",
          Spawntime: this.mvp.Spawntime,
          img_url: (this.mvp.img_url !== undefined) ? this.mvp.img_url : ""
        })
        .then(res => {
          this.mvp.ref = res.id;
          this.snackbar = true;
          this.message =
            "Succesfully added the following MVP: " + this.mvp.Name;
          this.dialog = false;
          this.mvp = {};
        })
        .catch(err => {
          this.message = "Error: " + err;
          this.snackbar = true;
        });
    },
    save(prop, key) {
      if (key === "Name") {
        prop.Name = this.nameUpdate;
        this.nameUpdate = "";
      }
      if (key === "Death") {
        fb.usersCollection
        .doc(this.currentUser.uid)
        .collection("mvps")
        .doc(prop.ref)
        .update({
          [key]: prop[key],
          Dead: (prop.Death != null || prop.Death != '') ? true : false,
          TimeOfDeath: (prop.TimeOfDeath != '' || prop.TimeOfDeath != undefined) ? moment().subtract(prop.Death, "minutes").format() : '',
          TimeOfSpawn: (prop.TimeOfSpawn != '' || prop.TimeOfDeath != undefined) ? moment().add(prop.Spawntime - prop.Death, 'minutes').format() : '',
          RespawnFormatted: (prop.TimeOfSpawn != '' || prop.TimeOfDeath != undefined) ? moment().add(prop.Spawntime - prop.Death, 'minutes').format("HH:mm:ss, MMMM Do YYYY") : '',
        }).then(() => {
          this.snackbar = true;
          this.message = "Saved.";
          this.runTimer();
        })
      } else {
       fb.usersCollection
        .doc(this.currentUser.uid)
        .collection("mvps")
        .doc(prop.ref)
        .update({
          [key]: prop[key],
        })
        .then(() => {
          this.snackbar = true;
          this.message = "Saved.";
          if (prop.Dead === true) {
            this.runTimer();
          }
        })
        }; 
    },
    cancel() {},
    open() {},
    deleteItem (item) {
        if (confirm('Are you sure you want to delete this MVP?', item.Name)) {
          fb.usersCollection.doc(this.currentUser.uid).collection("mvps").doc(item.ref).delete().then(() => {
            this.message = "MVP successfully deleted"
            this.snackbar = true
          })
          } else {
            this.message = "Deletion aborted"
            this.snackbar = true
          }
    }
  }
};
</script>