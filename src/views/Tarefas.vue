<template>
  <Formulario @aoSalvarTarefa="salvarTarefa" />
  <div v-if="loading" class="box has-text-centered loader-bg">
    <button class="loader-button button is-loading is-white is-large" disabled></button>
  </div>
  <div v-else class="lista">
    <Box v-if="listaEstaVazia">
      Você não está muito produtivo hoje :(
    </Box>

    <div v-else class="field">
      <p class="control has-icons-left">
        <input v-model="filtro" class="input" type="text" placeholder="Digite para filtrar" />
        <span class="icon is-small is-left">
          <i class="fas fa-search"></i>
        </span>
      </p>
    </div>
    <Tarefa v-for="(tarefa, index) in tarefas" :key="index" :tarefa="tarefa" @aoTarefaClicada="selecionarTarefa" />
    <ModalModel v-if="tarefaSelecionada" :mostrar="true">
      <template v-slot:cabecalho>
        <p class="modal-card-title">Editando uma tarefa</p>
        <button @click="fecharModal" class="delete" aria-label="close"></button>
      </template>
      <template v-slot:corpo>
        <div class="field">
          <label for="descricaoDaTarefa" class="label">
            Descrição
          </label>
          <input type="text" class="input" v-model="tarefaSelecionada.descricao" id="descricaoDaTarefa" />
        </div>
      </template>
      <template v-slot:rodape>
        <div class="buttons">
          <button @click="alterarTarefa" class="button is-success">Salvar alterações</button>
          <button @click="fecharModal" class="button">Cancelar</button>
        </div>
      </template>
    </ModalModel>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue';
import Formulario from '../components/Formulario.vue';
import Tarefa from '../components/Tarefa.vue'
import ITarefa from '../interfaces/ITarefas'
import Box from '../components/Box.vue'
import ModalModel from '../components/ModalModel.vue'
import { useStore } from '@/store';
import { ALTERAR_TAREFA, CADASTRAR_TAREFA, OBTER_PROJETOS, OBTER_TAREFAS } from '@/store/tipo-acoes';

export default defineComponent({
  name: 'App',
  components: {
    Formulario,
    Tarefa,
    Box,
    ModalModel
  },
  data() {
    return {
      tarefaSelecionada: null as ITarefa | null,
    }
  },
  methods: {
    salvarTarefa(tarefa: ITarefa): void {
      this.store.dispatch(CADASTRAR_TAREFA, tarefa)
    },

    selecionarTarefa(tarefa: ITarefa) {
      this.tarefaSelecionada = tarefa
    },

    fecharModal() {
      this.tarefaSelecionada = null;
    },

    alterarTarefa() {
      this.store.dispatch(ALTERAR_TAREFA, this.tarefaSelecionada)
        .then(() => this.fecharModal());
    }
  },
  computed: {
    listaEstaVazia(): boolean {
      return this.store.state.tarefa.tarefas.length === 0;
    },
  },

  setup() {
    const store = useStore()
    const loading = ref(true);

    store.dispatch(OBTER_TAREFAS).then(() => {
      loading.value = false
    })
    store.dispatch(OBTER_PROJETOS)
    const filtro = ref('')

    const tarefas = computed(() => {
      return store.state.tarefa.tarefas.filter((t: any) =>
        t.descricao.toLowerCase().includes(filtro.value.toLowerCase())
      )
    })

    return {
      loading,
      tarefas,
      store,
      filtro,
    }
  }
});
</script>

<style scoped>
.loader-bg {
  background: transparent;
  box-shadow: none;
}

.loader-button {
  background-color: transparent !important;
}
</style>