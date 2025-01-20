<template>
  <v-row>
    <v-col>
      <v-card>
        <template v-slot:text>
          <v-autocomplete label="Entrenadores" :items="trainers" item-value="name" item-title="streamer_name"
                          v-model="selected_trainer" @update:modelValue="select_trainer"/>
        </template>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import {session} from "@/stores";

export default {
  name: "CoachingSelectionPanel",
  emits: ['trainer_selected'],
  data() {
    return {
      selected_trainer: '',
      trainers: [],
    }
  },
  updated() {
    session.get('/api/trainers/list_trainers/').then((response) => {
      this.trainers = response.data
    });
  },
  created() {
    session.get('/api/trainers/list_trainers/').then((response) => {
      this.trainers = response.data
    });
  },
  methods: {
    select_trainer(trainer_name) {
      this.$emit('trainer_selected', trainer_name)
    }
  }
}
</script>

<style scoped>

</style>