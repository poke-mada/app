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
              Inventario de premios
                </span>
              </v-alert>
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
          </PkCard>
        </v-col>
      </v-row>
    </v-main>
  </v-layout>
</template>

<script>
<<<<<<< Updated upstream
import {session} from "@/stores";
import PkCard from "@/app/vue/components/custom-comps/pk-card";

=======
import {getAxios} from "@/stores";
>>>>>>> Stashed changes

export default {
  name: 'RewardsAppPage',
  components: {
    PkCard
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
<<<<<<< Updated upstream
      const response = await session.get('/api/trainers/get_rewards/');
=======
      const response = await getAxios().get('/api/trainers/get_rewards/');
      console.log("Respuesta Buzon: ", this.available_rewards);
>>>>>>> Stashed changes
      this.available_rewards = response.data;
    },
    claim_reward(bundle_id) {
      const bundle_data = {
        bundle_id: bundle_id,
        token: localStorage.getItem('api_token')
      };
      console.log(bundle_data);
      window.electron.sendMessage('reward', bundle_data);
    }
  }
}

</script>
