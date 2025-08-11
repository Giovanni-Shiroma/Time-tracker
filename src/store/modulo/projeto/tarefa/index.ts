import { Module } from 'vuex';
import ITarefa from '@/interfaces/ITarefas';
import { Estado } from '@/store';
import {
  DEFINIR_TAREFAS,
  CADASTRAR_TAREFA,
  OBTER_TAREFAS,
  ALTERAR_TAREFA,
  DELETAR_TAREFA
} from '@/store/tipo-acoes';
import {
  ALTERA_TAREFA,
  ADICIONA_TAREFA,
  REMOVER_TAREFA
} from '@/store/tipo-mutacoes';

import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  doc,
  query,
  where,
  deleteDoc
} from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { db } from '@/services/firebaseconfig';

export interface EstadoTarefa {
  tarefas: ITarefa[];
}

export const tarefa: Module<EstadoTarefa, Estado> = {
  state: () => ({
    tarefas: []
  }),

  mutations: {
    [DEFINIR_TAREFAS](state, tarefas: ITarefa[]) {
      state.tarefas = tarefas;
    },

    [ALTERA_TAREFA](state, tarefa: ITarefa) {
      const index = state.tarefas.findIndex(t => t.id === tarefa.id);
      if (index !== -1) state.tarefas[index] = tarefa;
    },

    [ADICIONA_TAREFA](state, tarefa: ITarefa) {
      state.tarefas.push(tarefa);
    },

    [REMOVER_TAREFA](state, id: string) {
      state.tarefas = state.tarefas.filter(t => t.id !== id);
    },
  },

  actions: {
    async [CADASTRAR_TAREFA]({ commit }, tarefa: ITarefa) {
      const auth = getAuth();
      const user = auth.currentUser;

      if (!user) throw new Error('Usuário não autenticado');

      const docRef = await addDoc(collection(db, 'tarefas'), {
        descricao: tarefa.descricao,
        duracaoEmSegundos: tarefa.duracaoEmSegundos,
        projeto: tarefa.projeto,
        userId: user.uid
      });

      const novaTarefa: ITarefa = {
        id: docRef.id,
        descricao: tarefa.descricao,
        duracaoEmSegundos: tarefa.duracaoEmSegundos,
        projeto: tarefa.projeto,
        userId: user.uid
      };

      commit(ADICIONA_TAREFA, novaTarefa);
    },

    async [OBTER_TAREFAS]({ commit }, filtro: string) {
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) throw new Error('Usuário não autenticado');

      const tarefasRef = collection(db, 'tarefas');
      const q = query(tarefasRef, where('userId', '==', user.uid));
      const snapshot = await getDocs(q);

      let tarefas = snapshot.docs.map(doc => ({
        id: doc.id,
        ...(doc.data() as Omit<ITarefa, 'id'>)
      })) as ITarefa[];

      // Filtro por descrição
      if (filtro) {
        tarefas = tarefas.filter(t =>
          t.descricao.toLowerCase().includes(filtro.toLowerCase())
        );
      }

      commit(DEFINIR_TAREFAS, tarefas);
    },

    async [ALTERAR_TAREFA]({ commit }, tarefa: ITarefa) {
      const tarefaRef = doc(db, 'tarefas', tarefa.id);

      await updateDoc(tarefaRef, {
        descricao: tarefa.descricao,
        duracaoEmSegundos: tarefa.duracaoEmSegundos,
        projeto: tarefa.projeto
      });

      commit(ALTERA_TAREFA, tarefa);
    },

    async [DELETAR_TAREFA]({ commit }, id: string) {
      try {
        const tarefaRef = doc(db, 'tarefas', id);
        await deleteDoc(tarefaRef);
        commit(REMOVER_TAREFA, id);
      } catch (error) {
        console.error('Erro ao deletar tarefa:', error);
        throw error;
      }
    },

  }
};
