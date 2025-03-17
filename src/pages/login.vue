<template>
  <NavBar scroll-behavior="elevate"/>
  <v-layout>
    <v-main>
      <LoginComponentPanel @login="this.$router.push('/')"/>
    </v-main>
  </v-layout>
</template>

<script>
import NavBar from "@/components/page-comps/NavBar";
import LoginComponentPanel from "@/components/page-comps/LoginComponentPanel";

export default {
  name: 'LoginPage',
  components: {
    NavBar,
    LoginComponentPanel
  },
  data() {
    return {
    }
  },
}

</script>
