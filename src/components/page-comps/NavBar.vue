<template>
  <v-app-bar :scroll-behavior="scrollBehavior" :color="this.inlive ? 'teal-darken-4' : 'purple-darken-4'" elevation="4">
    <v-app-bar-title @click="this.$router.push('/')" class="cursor-pointer">
      <span v-if="!inlive && logged_in">COACH VIEW</span>
      <span v-if="!inlive && !logged_in">PokeBlog</span>
      <span v-if="inlive">{{ trainer_name }}</span>
    </v-app-bar-title>
    <v-btn
        v-if="inlive"
        to="/"
        text="Combates"/>
    <v-menu v-if="inlive">
      <template v-slot:activator="{props}">
        <v-btn
            v-if="inlive"
            v-bind="props"
            text="DEBUG"/>
      </template>
      <v-list>
        <v-list-item key="1">
          <v-btn v-on:click="empty_slot">EMPTY SLOT</v-btn>
        </v-list-item>
        <v-list-item key="2">
          <v-btn v-on:click="add_pkmn_save">add pkmn save</v-btn>
        </v-list-item>
        <v-list-item key="3">
          <v-btn v-on:click="edit_pkmn">edit pkmn save</v-btn>
        </v-list-item>
        <v-list-item key="5">
          <v-btn v-on:click="edit_pkmn2">edit pkmn live</v-btn>
        </v-list-item>
        <v-list-item key="4">
          <v-btn v-on:click="boost_pkmn">edit pkmn boosts</v-btn>
        </v-list-item>
      </v-list>
    </v-menu>
    <v-btn
        v-if="logged_in"
        variant="text"
        @click="download_save"
        text="Descargar Save"/>
    <v-btn
        v-if="logged_in"
        to="/boxes"
        text="Cajas"/>
    <v-btn
        v-if="logged_in"
        to="/team"
        text="Equipo"/>
    <v-btn
        v-if="logged_in"
        to="/wildcards"
        text="Comodines"/>
    <v-spacer></v-spacer>
    <v-btn
        v-if="logged_in"
        @click="log_off"
        text="Cerrar Sesión"/>
    <CoinsComponent
        v-if="logged_in"
        :coins="this.economy"/>
  </v-app-bar>
</template>

<script>
import CoinsComponent from '@/components/page-comps/CoinsComponent';
import {session, emitter} from "@/stores";
import {useGameStore} from "@/stores/app";

export default {
  name: "NavBar",
  components: {
    CoinsComponent,
  },
  props: {
    scrollBehavior: {
      type: String,
      required: false
    },
  },
  computed: {
    store() {
      return useGameStore()
    },
    inlive() {
      return this.store.in_live
    },
    trainer_name() {
      return this.store.trainer_name
    }
  },
  data() {
    const token = localStorage.getItem('api_token');
    return {
      economy: parseInt(localStorage.getItem('coins') || 0),
      logged_in: token && token.length > 0
    }
  },
  methods: {
    add_pkmn_save() {
      window.electron.sendMessage('pkm', {
        level: 'save',
        effect: 'add',
        reward: 1
      });
    },
    empty_slot() {
      window.electron.sendMessage('pkm', {
        level: 'ram',
        effect: 'clean',
        slot: 0
      });
    },
    edit_pkmn() {
      window.electron.sendMessage('pkm', {
        level: 'save',
        effect: 'edit',
        slot: 2,
        new_data: {
          ability: 17
        }
      });
    },
    edit_pkmn2() {
      window.electron.sendMessage('pkm', {
        level: 'ram',
        effect: 'edit',
        slot: 2,
        new_data: {
          ability: 17
        }
      });
    },
    boost_pkmn() {
      window.electron.sendMessage('pkm', {
        level: 'ram',
        effect: 'boosts',
        slot: 0,
        boosts: {
          special_attack: 2
        }
      });
    },
    download_save() {
      session.get(`/api/trainers/last_save/`, {
        responseType: 'arraybuffer'
      }).then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `main.save`); //or any other extension
        link.click();
      })
    },
    switch_display(display_name) {
      this.$router.push(`/${display_name}`)
    },
    log_off() {
      localStorage.removeItem('api_token');
      localStorage.removeItem('trainer_id');
      localStorage.removeItem('coins');
      this.$router.push('/login')
    }
  },
  mounted() {
    if (!this.logged_in && this.$route.name !== '/login') {
      this.log_off();
    }

    emitter.on('coins_updated', (data) => {
      this.economy = data;
    })

    if (this.$route.name === '/login' && this.logged_in) {
      this.$router.push('/');
    }
  },
}
</script>

<style scoped>

</style>
