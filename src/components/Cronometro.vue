<template>
    <section>
        <div class="is-flex ">
            <svg  xmlns="http://www.w3.org/2000/svg" width="24" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                stroke="currentColor" class="size-6">
                <path stroke-linecap="round" stroke-linejoin="round"
                    d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
            <strong class="display ml-2">
                {{ tempoDecorrido }}
            </strong>
        </div>
    </section>
</template>


<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
    name: 'CronometroTempo',
    props: {
        tempoEmSegundos: {
            type: Number,
            default: 0
        }
    },
    computed: {
        tempoDecorrido(): string {
            return new Date(this.tempoEmSegundos * 1000).toISOString().substr(11, 8)
        }
    },
})
</script>


<style>
.display {
    color: var(--texto-primario);
}
</style>