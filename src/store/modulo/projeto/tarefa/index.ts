import http from "@/http";
import ITarefa from "@/interfaces/ITarefas";
import { Estado } from "@/store";
import { DEFINIR_TAREFAS, CADASTRAR_TAREFA, OBTER_TAREFAS, ALTERAR_TAREFA } from "@/store/tipo-acoes";
import { ALTERA_TAREFA, ADICIONA_TAREFA } from "@/store/tipo-mutacoes";
import { Module } from "vuex";

export interface EstadoTarefa {
    tarefas: ITarefa[]
}

export const tarefa: Module<EstadoTarefa, Estado> = {
    mutations: {
        [DEFINIR_TAREFAS](state, tarefas: ITarefa[]) {
            state.tarefas = tarefas
        },

        // [ADICIONA_TAREFA](state, payload: ITarefa) {
        //     const tarefa = {
        //         id: new Date().toISOString(),
        //         descricao: payload.descricao,
        //         duracaoEmSegundos: payload.duracaoEmSegundos,
        //         projeto: payload.projeto,
        //     } as ITarefa
        //     state.tarefas.push(tarefa);
        // },

        [ALTERA_TAREFA](state, tarefa: ITarefa) {
            const index = state.tarefas.findIndex(t => t.id == tarefa.id)
            state.tarefas[index] = tarefa
        },

        [ADICIONA_TAREFA](state, payload: ITarefa) {
            state.tarefas.push(payload);
        },

    },
    actions: {
        async [CADASTRAR_TAREFA]({ commit }, tarefa: ITarefa) {
            const resposta = await http.post('/tarefas', tarefa);
            return commit(ADICIONA_TAREFA, resposta.data);
        },


        [OBTER_TAREFAS]({ commit }, filtro: string) {
            let url = 'tarefas'

            if (filtro) {
                url += '?descricao=' + filtro
            }
            http.get(url)
                .then(resposta => commit(DEFINIR_TAREFAS, resposta.data))
        },

        [ALTERAR_TAREFA]({ commit }, tarefa: ITarefa) {
            return http.put(`/tarefas/${tarefa.id}`, tarefa)
                .then(() => commit(ALTERA_TAREFA, tarefa))
        },
    }
}