<template>
  <v-row class="h-100 w-100 mt-4" justify="center" align="center">
    <v-spacer/>
    <v-col class="d-flex justify-center">
      <v-card
        class="vcard-pkm"
        elevation="6"
        width="450"
        max-width="800"
        style="border-radius: 20px"
      >
        <div
          class="divCardSup pa-5 d-flex justify-center align-center mb-4"
          style="border-radius: 20px 20px 0 0"
        >
          <h3 class="textNoticias" style="text-transform: capitalize;">
            Inicia sesión
          </h3>
        </div>

        <!-- Contenido -->
        <v-card-text class="pt-0">
          <v-form fast-fail @submit.prevent="log_in">
            <v-row>
              <v-col cols="12">
                <v-text-field
                  name="username"
                  variant="outlined"
                  v-model="username"
                  label="Usuario"
                  hint="Usuario"
                  clearable
                  :rules="general_rules"
                >
                  <template #prepend>
                    <svg-icon type="mdi" :path="user_path" />
                  </template>
                </v-text-field>
              </v-col>

              <v-col cols="12">
                <v-text-field
                  name="password"
                  variant="outlined"
                  v-model="password"
                  label="Contraseña"
                  clearable
                  type="password"
                  :rules="general_rules"
                >
                  <template #prepend>
                    <svg-icon type="mdi" :path="key_path" />
                  </template>
                </v-text-field>
              </v-col>
            </v-row>

            <!-- Errores del backend -->
            <v-row v-if="request.non_field_errors && request.non_field_errors.length > 0">
              <v-col cols="12">
                <v-alert color="error" variant="tonal">
                  <ul class="ma-0">
                    <li v-for="i in request.non_field_errors" :key="i">
                      <span class="text-danger">{{ i }}</span>
                    </li>
                  </ul>
                </v-alert>
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="12">
                <!-- Usa tu clase de botón si la tienes (opcional) -->
                <v-btn
                  class="gradient-btn"
                  :loading="loading"
                  text="Iniciar Sesión"
                  type="submit"
                  block
                />
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
      </v-card>
    </v-col>
    <v-spacer/>
  </v-row>
</template>

<script>
import {getAxios, login_session} from "@/stores";
import SvgIcon from '@jamescoyle/vue-icon';
import {mdiKey, mdiAccount} from '@mdi/js';
import {useGameStore} from "@/stores/app";

export default {
  name: "LoginComponentPanel",
  emits: ['login'],
  components: {
    SvgIcon
  },
  data() {
    return {
      loading: false,
      general_rules: [
        value => value.trim() !== '',
      ],
      user_path: mdiAccount,
      key_path: mdiKey,
      username: '',
      password: '',
      request: {
        non_field_errors: []
      }
    }
  },
  computed: {
    store: () => useGameStore(),
    logged_in() {
      const token = this.store.api_token;
      return token && token.length > 0;
    }
  },
  mounted() {
    if (this.logged_in) {
      this.$router.push('/')
    }
  },
  methods: {
    async log_in() {
      this.loading = true;
      try {
        const response = await login_session.post('/user/login/', {
          username: this.username,
          password: this.password
        }).catch(reason => {
          this.loading = false;
          console.log(reason.response.data)
          this.request = reason.response.data
        });

        window.electron.sendMessage('store', {
          token: response.data.token
        });

        const config = {
          headers: {Authorization: `Token ${response.data.token}`},
        };
        const trainer_response = await getAxios().get('/api/trainers/get_profile', config);
        this.store.set_profile_data(trainer_response.data)
        this.store.set_my_trainer_id(trainer_response.data.trainer_id)
        this.store.login(this.username, response.data.token)
        this.$router.push('/');
      } catch (error_response) {
        this.loading = false;
      }
    }
  }
}
</script>

<style scoped>

</style>
