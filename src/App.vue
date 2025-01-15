<template>
  <v-container fluid>
    <MainAppComponent :trainer_name="trainer_name" :game_data="game_data" :inlive="game_data !== null"/>
    <UpdateDialog :update_data="update_data" v-if="update_dialog"/>
  </v-container>
</template>

<script>
import MainAppComponent from '@/components/offline-app/MainAppComponent';
import UpdateDialog from '@/components/offline-app/UpdateDialog';


export default {
  name: 'App',
  components: {
    MainAppComponent,
    UpdateDialog
  },
  data() {
    return {
      game_data: null,
      trainer_name: 'MARYBLOG',
      update_dialog: false,
      update_data: {
        progress: 69,
        version: '0.0.0'
      }
    }
  },
  created() {
    window.electron.onDataReceived('updated_game_data', async (event, data) => {
      this.game_data = data;
      for (let slot = 0; slot < this.game_data.your_data.team.length; slot++) {
        let mote = this.game_data.your_data.team[slot].mote;
        let coach_data = await fetch(`https://pokemon.para-mada.com/coach_data/${this.trainer_name}/${mote}`).then((res) => res.json())
        if (coach_data) {
          this.game_data.your_data.team[slot].coach_data = coach_data;
        } else {
          this.game_data.your_data.team[slot].coach_data = {
            data: {
              notes: ''
            }
          }
        }
      }
    });
    window.electron.onDataReceived('update-progress', (event, data) => {
      if (!this.update_dialog) {
        this.update_dialog = true;
      }
      this.update_data = data;
    })

    window.electron.onDataReceived('trainer_name', (event, trainer_name) => {
      this.trainer_name = trainer_name;
    })
    window.electron.startComms()
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

body {
  background-repeat: no-repeat;
  background-size: cover;
}

* {
  cursor: default;
}
</style>
