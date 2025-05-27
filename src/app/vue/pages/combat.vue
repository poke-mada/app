<template>
  <v-layout>
    <v-main>
      <v-row class="mt-2 pl-2 pr-2">
        <v-col>
          <LiveCombatPanel />
        </v-col>
      </v-row>
    </v-main>
  </v-layout>
</template>

<script>
import LiveCombatPanel from "@/app/vue/components/page-comps/LiveCombatPanel";


export default {
  name: 'CombatAppPage',
  data() {
    const token = localStorage.getItem('api_token');
    return {
      logged_in: token && token.length > 0,
      economy: parseInt(localStorage.getItem('coins') || 0) || 0,
      inlive: false,
      trainer_name: '',
    }
  },
  components: {
    LiveCombatPanel,
  },
  mounted() {
  }
}

</script>
