<!--suppress JSUnusedGlobalSymbols -->
<template>
  <ShowdownCombatPanel :api_token="token" :trainer_id="trainer_id"/>
</template>

<script>
import ShowdownCombatPanel from "@/app/vue/components/offline-app/showdown/ShowdownCombatPanel";

export default {
  name: 'ShowdownPage',
  components: {
    ShowdownCombatPanel
  },
  data() {
    return {
      economy: parseInt(localStorage.getItem('coins') || 0) || 0,
      trainer_id: parseInt(localStorage.getItem('trainer_id') || 0)
    }
  },
  computed: {
    token() {
      return localStorage.getItem('api_token')
    }
  },
  mounted() {
    window.electron.sendMessage('open-showdown', {
      token: this.token
    });
  }
}

</script>
