<template>
  <main>
    <div class="card mb-4 shadow-lg border border-secondary" v-if="movement">
      <div class="row h-75">
        <span class="center">{{ movement.move_name }}</span>
      </div>
      <div class="row h-25 justify-content-end">
        <img class="col-2" height="20px" width="20px" :src="`./assets/types/${movement.type}.png`" :alt="movement.type">
        <img class="col-2" height="20px" width="20px" :src="`./assets/categories/${movement.category}.png`" :alt="movement.category">
        <img class="col-2" height="20px" width="20px" :src="`./assets/modifiers/modifier12.png`" :alt="movement.type">
        <span class="col-1 badge bg-info">x2</span>
        <span class="col-1 badge bg-danger">x4</span>
      </div>
    </div>
  </main>
</template>

<script>

export default {
  name: "MovementCard",
  props: {
    movement: {
      type: Object,
      required: true
    },
  }
}
</script>

<style scoped>

</style>