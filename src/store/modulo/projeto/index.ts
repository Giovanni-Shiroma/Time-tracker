import { auth, db } from '@/services/firebaseconfig';
import {
    collection,
    addDoc,
    getDocs,
    updateDoc,
    deleteDoc,
    doc,
    query,
    where,
} from 'firebase/firestore';
import { Module } from 'vuex';
import IProjeto from '@/interfaces/IProjeto';
import { Estado } from '@/store';
import {
    OBTER_PROJETOS,
    CADASTRAR_PROJETOS,
    ALTERAR_PROJETOS,
    REMOVE_PROJETO,
} from '@/store/tipo-acoes';
import {
    ADICIONA_PROJETO,
    ALTERA_PROJETO,
    EXCLUIR_PROJETO,
    DEFINIR_PROJETOS,
} from '@/store/tipo-mutacoes';
import { getAuth } from 'firebase/auth';

export interface EstadoProjeto {
    projetos: IProjeto[];
}

export const projeto: Module<EstadoProjeto, Estado> = {
    state: () => ({
        projetos: [],
    }),

    mutations: {
        [ADICIONA_PROJETO](state, projeto: IProjeto) {
            state.projetos.push(projeto);
        },
        [ALTERA_PROJETO](state, projeto: IProjeto) {
            const index = state.projetos.findIndex((p) => p.id === projeto.id);
            if (index !== -1) state.projetos[index] = projeto;
        },
        [EXCLUIR_PROJETO](state, id: string) {
            state.projetos = state.projetos.filter((p) => p.id !== id);
        },
        [DEFINIR_PROJETOS](state, projetos: IProjeto[]) {
            state.projetos = projetos;
        },
    },

    actions: {
        async [OBTER_PROJETOS]({ commit }) {
            const user = auth.currentUser;
            if (!user) return;

            const q = query(collection(db, 'projetos'), where('userId', '==', user.uid));
            const snapshot = await getDocs(q);
            const projetos: IProjeto[] = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            })) as IProjeto[];

            commit(DEFINIR_PROJETOS, projetos);
        },


        async [CADASTRAR_PROJETOS]({ dispatch }, nomeDoProjeto: string) {
            const auth = getAuth();
            const user = auth.currentUser;

            if (!user) {
                throw new Error('Usuário não autenticado');
            }

            await addDoc(collection(db, 'projetos'), {
                name: nomeDoProjeto,
                userId: user.uid,
            });

            dispatch(OBTER_PROJETOS);
        },

        async [ALTERAR_PROJETOS]({ dispatch }, projeto: IProjeto) {
            const ref = doc(db, 'projetos', projeto.id);
            await updateDoc(ref, {
                name: projeto.name,
            });

            // Opcional: recarrega lista
            dispatch(OBTER_PROJETOS);
        },

        async [REMOVE_PROJETO]({ commit }, id: string) {
            await deleteDoc(doc(db, 'projetos', id));
            commit(EXCLUIR_PROJETO, id);
        },
    },
};
