<template>
  <v-dialog v-model="download_dialog" persistent max-width="500">
    <v-card>
      <template v-slot:title>
        <h3>Cargando Evento</h3>
      </template>
      <template v-slot:text>
        <p>{{download_data.message}}</p>
        <v-progress-linear :model-value="download_data.progress" striped height="25" color="deep-purple-accent-4">
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
  name: "DownloadDialog",
  props: {
    download_data: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      download_dialog: true
    }
  }
}
</script>

<style scoped>

</style>