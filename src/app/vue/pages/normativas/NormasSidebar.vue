<template>
  <div>
    <v-text-field
      v-model="localQuery"
      variant="solo"
      prepend-inner-icon="mdi-magnify"
      placeholder="Search in document..."
      clearable
      class="mb-3"
      @update:model-value="emitQuery"
      :loading="loading"
    />

    <v-subheader class="text-caption">Sections</v-subheader>
    <v-list nav density="compact">
      <v-list-item
        v-for="s in sections"
        :key="s.id"
        :title="s.title"
        :active="s.id === activeSectionId"
        @click="$emit('select-section', s.id)"
      />
    </v-list>
  </div>
</template>

<script>
import { ref, watch, defineComponent } from 'vue'

export default defineComponent({
  name: 'NormasSidebar',
  props: {
    sections: { type: Array, required: true }, 
    activeSectionId: { type: String, default: null },
    query: { type: String, default: '' },
    loading: { type: Boolean, default: false }
  },
  emits: ['update:query', 'select-section'],
  setup(props, { emit }) {
    const localQuery = ref(props.query)
    watch(() => props.query, q => (localQuery.value = q))
    const emitQuery = () => emit('update:query', localQuery.value)
    return { localQuery, emitQuery }
  }
})
</script>
