<template>
    <Box class="is-flex is-align-items-center">
        <div class="columns task-info">
            <div class="column is-4">
                {{ tarefa?.descricao || 'Tarefa sem descrição' }}
            </div>
            <div class="column is-3">
                {{ tarefa.projeto?.name || 'N/D' }}
            </div>
            <div class="column is-4 cronometro">
                <Cronometro :tempoEmSegundos="tarefa.duracaoEmSegundos" />
            </div>
        </div>
        <div class="is-flex task-timer-actions">
            <div class="mr-4 is-hidden-tablet timer-responsive">
                <Cronometro :tempoEmSegundos="tarefa.duracaoEmSegundos" />
            </div>
            <div class="is-flex task-actions">
                <button class="button ml-2" @click="tarefaClicada">
                    <span class="icon is-small">
                        <i class=" fas fa-pencil-alt"></i>
                    </span>
                </button>
                <button class="button ml-2 is-danger" @click="deletarTarefa(tarefa.id)">
                    <span class="icon is-small">
                        <i class=" fas fa-trash"></i>
                    </span>
                </button>
            </div>
        </div>
    </Box>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import Cronometro from './Cronometro.vue';
import ITarefa from '../interfaces/ITarefas';
import Box from './Box.vue';
import { useStore } from '@/store';

export default defineComponent({
    name: "TarefasList",
    emits: ['aoTarefaClicada'],
    components: {
        Cronometro,
        Box
    },
    props: {
        tarefa: {
            type: Object as PropType<ITarefa>,
            required: true
        }
    },

    setup(props, { emit }) {
        const store = useStore()

        const tarefaClicada = (): void => {
            emit('aoTarefaClicada', props.tarefa)
        }

        async function deletarTarefa(id: string) {
            if (id) {
                await store.dispatch('DELETAR_TAREFA', id);
            } else {
                console.error('Tarefa sem ID, não é possível deletar.');
            }
        }
        return {
            tarefaClicada,
            deletarTarefa,
        }
    },
})
</script>

<style scoped>
.task-info {
    width: 100%;
    margin-bottom: 0px;
    margin-top: 0;
}

.task-actions {
    display: flex;
}

@media (max-width: 768px) {
    .task-info {
        display: flex;
    }

    .task-timer-actions {
        flex-direction: column;
        align-items: end;
    }

    .timer-responsive {
        margin-right: 0 !important;
    }

    .task-actions {
        margin-top: 20px;
    }

}


@media (max-width: 768px) {
    .task-info {
        display: initial;
    }

    .cronometro {
        display: none;
    }
}
</style>