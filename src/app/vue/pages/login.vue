<template>
  <LoginComponentPanel @login="this.$router.push('/')"/>
</template>

<script>
import LoginComponentPanel from "@/app/vue/components/page-comps/LoginComponentPanel";

export default {
  name: 'LoginPage',
  components: {
    LoginComponentPanel
  },
  data() {
    return {}
  },
}

</script>
