<template>
  <WildcardListComponent :api_token="token"/>
</template>

<script>
import WildcardListComponent from "@/app/vue/components/offline-app/WildcardListComponent";

export default {
  name: 'WildcardsPage',
  components: {
    WildcardListComponent
  },
  data() {
    return {
      economy: parseInt(localStorage.getItem('coins') || 0) || 0,
    }
  },
  computed: {
    token() {
      return localStorage.getItem('api_token')
    }
  }
}

</script>
