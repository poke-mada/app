<template>
  <div class="mt-2 ml-2">
    <div class="card-border-wrapper" style="width: 99%">
      <div class="card-inner-border">
        <v-card class="custom-frame">
          <template v-slot:prepend>
            <slot name="prepend"></slot>
          </template>
          <template v-slot:title>
            <slot name="title"></slot>
          </template>
          <template v-slot:text>
            <slot name="text"></slot>
          </template>
          <template v-slot:actions>
            <slot name="actions"></slot>
          </template>
          <slot></slot>
        </v-card>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "PkCard"
}
</script>

<style scoped>
.card-border-wrapper {
  background-color: white; /* Borde exterior */
  padding: 4px; /* Grosor del borde exterior */
  border-radius: 16px; /* Redondeo exterior */
  display: inline-block;
}

.card-inner-border {
  background-color: black; /* Fondo principal */
  padding: 4px; /* Grosor del borde interior */
  border-radius: 12px; /* Redondeo interior ligeramente menor */
  box-sizing: border-box;
}

.custom-frame {
  background-color: rgba(10, 8, 2, 1); /* Casi negro */
  border-radius: 8px;
  color: white;
  padding: 16px;
}

</style>