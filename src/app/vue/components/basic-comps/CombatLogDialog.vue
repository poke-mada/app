<template>
    <v-dialog :model-value="modelValue" @update:model-value="$emit('update:modelValue', false)">
        <v-row>
            <v-spacer @click="close" />
            <v-col>
                <v-card max-height="75vh">
                    <v-data-table-virtual hide-default-footer disable-sort height="55vh" density="comfortable"
                        :headers="headers" :items="moveLog" />
                </v-card>
            </v-col>
            <v-spacer @click="close" />
        </v-row>
    </v-dialog>
</template>

<script>
export default {
    name: "CombatLogDialog",
    props: {
        modelValue: Boolean,
        moveLog: Array
    },
    emits: ['update:modelValue'],
    data() {
        return {
            headers: [{ title: 'Movement', align: 'start', key: 'key', value: 'message' }]
        }
    },
    methods: {
        close() {
            this.$emit('update:modelValue', false);
        }
    }
}
</script>
