<template>
    <section>
        <router-link :to="`/projetos/novo`" class="button">
            <span class="icon is-small">
                <i class="fas fa-plus"></i>
            </span>
            <span>Novo projeto</span>
        </router-link>
        <table class="table is-fullwidth mt-2">
            <thead>
                <tr>
                    <th>Nome</th>
                    <th class="has-text-right">Ações</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="projeto in projetos" :key="projeto.id">
                    <td>{{ projeto.name }}</td>
                    <td class="has-text-right">
                        <router-link :to="`/projetos/${projeto.id}`" class="button">
                            <span class="icon is-small">
                                <i class="fas fa-pencil-alt"></i>
                            </span>
                        </router-link>
                        <button class="button ml-2 is-danger" @click="excluir(projeto.id)">
                            <span class="icon is-small">
                                <i class="fas fa-trash"></i>
                            </span>
                        </button>
                    </td>
                </tr>
            </tbody>
        </table>
    </section>
</template>

<script lang="ts">
import { useStore } from '@/store';
import { OBTER_PROJETOS, REMOVE_PROJETO } from '@/store/tipo-acoes';
import { computed, defineComponent } from 'vue';

export default defineComponent({
    // eslint-disable-next-line vue/multi-word-component-names
    name: 'Lista',
    methods: {
        excluir(id: string) {
            this.store.dispatch(REMOVE_PROJETO, id);
        }
    },
    setup() {
        const store = useStore();
        const projetos = computed(() => store.state.projeto.projetos);

        // carregar os projetos só se ainda não estiverem carregados
        if (!projetos.value.length) {
            store.dispatch(OBTER_PROJETOS).catch((err) => {
                console.error('Erro ao carregar projetos:', err);
            });
        }

        return {
            projetos,
            store
        };
    }
})
</script>

<style scoped>
.table {
    background-color: var(--bg-primario);
}

.table td {
    color: var(--texto-primario);
}

.table th {
    color: var(--texto-primario);
}
</style>