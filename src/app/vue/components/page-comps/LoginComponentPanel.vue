<template>
  <v-row class="h-100 w-100 mt-4" justify="center" align="center">
    <v-spacer/>
    <v-col class="d-flex justify-center">
      <v-card class="vcard-pkm" elevation="6" width="450" max-width="800" style="border-radius: 20px">
        <!-- Header -->
        <div class="divCardSup pa-5 d-flex justify-center align-center mb-4" style="border-radius: 20px 20px 0 0">
          <h3 class="textNoticias" style="text-transform: capitalize;">Inicia sesión</h3>
        </div>

        <!-- Form -->
        <v-card-text class="pt-0">
          <v-form ref="formRef" v-model="formOk" fast-fail @submit.prevent="log_in">
            <v-row>
              <v-col cols="12">
                <v-text-field
                  name="username"
                  variant="outlined"
                  v-model.trim="username"
                  label="Usuario"
                  hint="Usuario"
                  clearable
                  :rules="general_rules"
                  autocomplete="username"
                  autofocus
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
                  :type="showPass ? 'text' : 'password'"
                  :append-inner-icon="showPass ? 'mdi-eye-off' : 'mdi-eye'"
                  @click:append-inner="showPass = !showPass"
                  :rules="general_rules"
                  autocomplete="current-password"
                  @keyup.enter="log_in"
                >
                  <template #prepend>
                    <svg-icon type="mdi" :path="key_path" />
                  </template>
                </v-text-field>
              </v-col>
            </v-row>

            <!-- Errores del backend -->
            <v-row v-if="request.non_field_errors?.length">
              <v-col cols="12">
                <v-alert color="error" variant="tonal" density="comfortable">
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
                <v-btn
                  class="gradient-btn"
                  :loading="loading"
                  :disabled="!formOk || !username || !password"
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
import { getAxios, login_session } from "@/stores";
import SvgIcon from "@jamescoyle/vue-icon";
import { mdiKey, mdiAccount } from "@mdi/js";
import { useGameStore } from "@/stores/app";

export default {
  name: "LoginComponentPanel",
  components: { SvgIcon },
  data() {
    return {
      loading: false,
      formOk: false,
      showPass: false,
      general_rules: [
        v => (v !== null && v !== undefined && String(v).trim() !== "") || "Requerido",
      ],
      user_path: mdiAccount,
      key_path: mdiKey,
      username: "",
      password: "",
      request: { non_field_errors: [] },
    };
  },
  computed: {
    store: () => useGameStore(),
    logged_in() {
      const token = this.store.api_token;
      return token && token.length > 0;
    },
  },
  mounted() {
    // si ya hay sesión, fuera de login
    if (this.logged_in) this.$router.push("/");
  },
  methods: {
    async log_in() {
      // valida local antes de llamar API
      const ok = await this.$refs.formRef?.validate();
      if (!ok?.valid) return;

      this.loading = true;
      this.request.non_field_errors = [];

      try {
        // 1) Login
        const { data } = await login_session.post("/user/login/", {
          username: this.username,
          password: this.password,
        });

        // 2) Guarda token en store
        this.store.login(this.username, data.token);

        // 3) Config inicial del usuario
        const config = { headers: { Authorization: `Token ${data.token}` } };
        const trainer_response = await getAxios().get("/api/trainers/get_profile", config);
        this.store.set_profile_data(trainer_response.data);
        this.store.set_my_trainer_id(trainer_response.data.trainer_id);

        // 4) Informa a proceso Electron (si existe)
        if (window?.electron?.sendMessage) {
          window.electron.sendMessage("store", { token: data.token });
        }

        // 5) Redirige al home; el shell/sockets se inician por el watcher en App.vue
        this.$router.push("/");
      } catch (err) {
        // muestra errores de backend si vienen en ese formato
        this.request = err?.response?.data || { non_field_errors: ["Error de autenticación"] };
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style scoped>
</style>
