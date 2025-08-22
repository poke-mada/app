<template>
  <MainPage v-if="!profile.is_admin"/>
  <StaffPage v-else/>
</template>

<script>
import MainPage from "@/app/vue/pages/MainPage";
import {useGameStore} from "@/stores/app";
import StaffPage from "@/app/vue/pages/staff/StaffPage";
import {getAxios} from "@/stores";

export default {
  name: "MainAppPage",
  components: {
    StaffPage,
    MainPage,
  },
  computed: {
    store: () => {
      return useGameStore();
    },
    emulator_on() {
      return this.store ? this.store.emulator_on : null
    },
    api_token() {
      return this.store ? this.store.api_token : null;
    },
    logged_in() {
      return this.api_token && this.api_token.length > 0;
    },
    profile() {
      return this.store ? this.store.profile_data : null;
    }
  },
  async mounted() {
    if (!this.logged_in) {
      this.$router.push('/login')
    }
    const trainer_response = await getAxios().get('/api/trainers/get_profile');
    this.store.set_profile_data(trainer_response.data)
    this.store.set_my_trainer_id(trainer_response.data.trainer_id)

  },
};
</script>
