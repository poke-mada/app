<template>
  <v-dialog v-model="update_dialog" persistent max-width="500">
    <v-card>
      <template v-slot:title>
        <h3>Nueva version {{ update_data.version }} encontrada!</h3>
      </template>
      <template v-slot:text>
        <p>Descargando actualizacion {{ update_data.version }}</p>
        <v-progress-linear :model-value="update_data.progress" striped height="25">
          <template v-slot:default="{ value }">
            <strong>{{ Math.ceil(value) }}%</strong>
          </template>
        </v-progress-linear>
      </template>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "UpdateDialog",
  props: {
    update_data: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      update_dialog: true
    }
  }
}
</script>

<style scoped>

</style>