<template>
  <Formulario @aoSalvarTarefa="salvarTarefa" />
  <div class="lista">
    <Tarefa v-for="(tarefa, index) in tarefas" :key="index" :tarefa="tarefa" />
    <Box v-if="listaEstaVazia">
      Você não está muito produtivo hoje :(
    </Box>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Formulario from '../components/Formulario.vue';
import Tarefa from '../components/Tarefa.vue'
import ITarefa from '../interfaces/ITarefas'
import Box from '../components/Box.vue'
import { useStore } from '@/store';
import { ADICIONA_TAREFA } from '@/store/tipo-mutacoes';

export default defineComponent({
  name: 'App',
  components: {
    Formulario,
    Tarefa,
    Box
  },
  data() {
    return {
    }
  },
  computed: {
    listaEstaVazia(): boolean {
      return this.store.state.tarefas.length === 0;
    },

    tarefas(): ITarefa[] {
      return this.store.state.tarefas;
    }
  },
  methods: {
    salvarTarefa(tarefa: ITarefa) {
      this.store.commit(ADICIONA_TAREFA, {
        descricao: tarefa.descricao,
        duracaoEmSegundos: tarefa.duracaoEmSegundos.toString(), // se necessário
        projeto: tarefa.projeto
      });
    },
  },
  setup() {
    const store = useStore()
    return {
      store,
    }
  }
});
</script>