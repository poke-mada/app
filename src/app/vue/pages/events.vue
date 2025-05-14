<template>
  <v-layout>
    <v-main>
      <v-row class="mt-16 pl-2 pr-2">
        <v-col>
          <PkCard>
            <template v-slot:title>
              <v-alert type="success" class="p-0">
                <template v-slot:prepend>
                </template>
                <span>
                  Eventos
                </span>
              </v-alert>
            </template>
            <template v-slot:default>
              <v-row>
                <v-col>
                  <v-row v-for="(event, index) in available_events" :key="index">
                    <v-alert>
                      <template v-slot:title>
                        <v-alert-title>{{ event.game_mod.mod_name }}</v-alert-title>
                      </template>
                      <template v-slot:append>
                        <v-btn text="Unirse" @click="join_event(event.id)"/>
                      </template>
                    </v-alert>
                  </v-row>
                </v-col>
                <v-divider vertical/>
                <v-col>
                </v-col>
              </v-row>
            </template>
          </PkCard>
        </v-col>
      </v-row>
    </v-main>
  </v-layout>
</template>

<script>
import {session} from "@/stores";
import PkCard from "@/app/vue/components/custom-comps/pk-card";


export default {
  name: 'EventsAppPage',
  components: {
    PkCard
  },
  data() {
    return {
      available_events: []
    }
  },
  async mounted() {
    await this.load_events();
  },
  methods: {
    async load_events() {
      const response = await session.get('/api/events/list_available/');
      this.available_events = response.data;
    },
    join_event(event_id) {
      const event_data = {
        event_id: event_id,
        token: localStorage.getItem('api_token')
      };
      window.electron.sendMessage('event', event_data);
    }
  }
}

</script>
