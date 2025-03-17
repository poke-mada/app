<template>
  <v-row class="h-100 w-100 mt-4" justify="center" align="center">
    <v-spacer/>
    <v-col>
      <v-card>
        <template v-slot:title>
          <v-card-title>
            <h3>Inicia sesión</h3>
          </v-card-title>
        </template>
        <template v-slot:text>
          <v-sheet>
            <v-form fast-fail @submit.prevent="log_in">
              <v-row>
                <v-col cols="12">
                  <v-text-field name="username" variant="outlined" v-model="username" label="Usuario" hint="Usuario" clearable
                                :rules="general_rules">
                    <template v-slot:prepend>
                      <svg-icon type="mdi" :path="user_path"></svg-icon>
                    </template>
                  </v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field name="password" variant="outlined" v-model="password" label="Contraseña" clearable type="password"
                                :rules="general_rules">
                    <template v-slot:prepend>
                      <svg-icon type="mdi" :path="key_path"></svg-icon>
                    </template>
                  </v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col sm='12' md="12">
                  <v-btn variant="outlined" :loading="loading" text="Iniciar Sesión" type="submit" block/>
                </v-col>
              </v-row>
            </v-form>
          </v-sheet>
        </template>
      </v-card>
    </v-col>
    <v-spacer/>
  </v-row>
</template>

<script>
import {login_session, session} from "@/stores";
import SvgIcon from '@jamescoyle/vue-icon';
import {mdiKey, mdiAccount} from '@mdi/js';

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
        non_field_errors: ['asdasdasda']
      }
    }
  },
  methods: {
    log_in() {
      this.loading = true;
      login_session.post('/user/login/', {
        username: this.username,
        password: this.password
      }).then(async (response) => {
        localStorage.setItem('api_token', response.data.token);
        let trainer_response;

        try {
          trainer_response = await session.get(`api/trainers/get_trainer/`);
        } catch (e) {
          trainer_response = await session.get(`api/trainers/get_coached_trainer/`);
        } finally {
          localStorage.setItem('trainer_id', trainer_response.data.id)
          this.$router.push('/');
        }
      }).catch((error_response) => {
        console.log(error_response)
        this.request = error_response.response
      })
    }
  }
}
</script>

<style scoped>

</style>
