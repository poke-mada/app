<template>
  <NavBar scroll-behavior="hide"/>
  <v-layout>
    <v-main>
      <v-row class="mt-16 pl-2 pr-2">
        <v-col>
          <v-card border>
            <template v-slot:title>
              Inventario de premios
            </template>
            <template v-slot:default>
              <v-row>
                <v-col>
                  <v-row v-for="(bundle, index) in available_rewards" :key="index">
                    <v-alert>
                      <template v-slot:title>
                        <v-alert-title>{{ bundle.name }}</v-alert-title>
                      </template>
                      <template v-slot:append>
                        <v-btn text="Reclamar" @click="claim_reward(bundle.id)"/>
                      </template>
                    </v-alert>
                  </v-row>
                </v-col>
                <v-divider vertical/>
                <v-col>

                </v-col>
              </v-row>
            </template>
          </v-card>
        </v-col>
      </v-row>
    </v-main>
  </v-layout>
</template>

<script>
import NavBar from "@/components/page-comps/NavBar";
import {session} from "@/stores";


export default {
  name: 'RewardsAppPage',
  components: {
    NavBar
  },
  data() {
    return {
      available_rewards: []
    }
  },
  async mounted() {
    await this.load_rewards();
  },
  methods: {
    async load_rewards() {
      const response = await session.get('/api/trainers/get_rewards/');
      this.available_rewards = response.data;
    },
    claim_reward(bundle_id) {
      window.electron.sendMessage('reward', bundle_id);
    }
  }
}

</script>
