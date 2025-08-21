<template>
    <header>
        <div class="div-logo">
            <img src="../assets/logo.png" alt="" class="logo">
        </div>

        <!-- Nome do usuário -->
        <div v-if="userName" class="mt-3 mb-4 has-text-white">
            <h1 class="has-text-white">Olá, {{ userName }}!</h1>
        </div>

        <!-- Botão de alternar tema -->
        <button class="button is-hidden" @click="alterarTema">
            <span class="icon mr-1">
                <svg v-if="modoDarkAtivo" xmlns="http://www.w3.org/2000/svg" width="20" fill="none" viewBox="0 0 24 24"
                    stroke-width="1.5" stroke="currentColor" class="size-6">
                    <path stroke-linecap="round" stroke-linejoin="round"
                        d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
                </svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" width="20" fill="none" viewBox="0 0 24 24"
                    stroke-width="1.5" stroke="currentColor" class="size-6">
                    <path stroke-linecap="round" stroke-linejoin="round"
                        d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" />
                </svg>
            </span>
            {{ textoBotao }}
        </button>
        <!-- Menu -->
        <nav class="navbar-nav mt-5">
            <ul>
                <li>
                    <router-link to="/" class="link">
                        <i class="fas fa-tasks"></i>
                        tarefas
                    </router-link>
                    <router-link to="/projetos" class="link">
                        <i class="fas fa-project-diagram"></i>
                        projetos
                    </router-link>
                    <router-link to="/profile" class="link">
                        <i class="fas fa-user"></i>
                        meu perfil
                    </router-link>

                    <button @click="deslogar" class="button is-danger is-outlined"
                        :class="load ? 'is-loading' : ''">Sair</button>
                </li>
            </ul>
        </nav>
    </header>
</template>

<script lang="ts">
import { getAuth, signOut, onAuthStateChanged } from 'firebase/auth';
import { defineComponent, ref, onMounted, computed } from 'vue';

export default defineComponent({
    name: 'BarraLateral',
    emits: ['aoTemaAlterado'],
    setup(_, { emit }) {
        const modoDarkAtivo = ref(false);
        const userName = ref<string | null>(null);
        const load = ref(false);

        const alterarTema = () => {
            modoDarkAtivo.value = !modoDarkAtivo.value;
            emit('aoTemaAlterado', modoDarkAtivo.value);
        };

        const deslogar = async () => {
            const auth = getAuth();
            try {
                load.value = true;
                await signOut(auth);
                window.location.href = '/login';
            } catch (error) {
                console.error('Erro ao deslogar:', error);
            }
        };

        onMounted(() => {
            const auth = getAuth();
            onAuthStateChanged(auth, (user) => {
                if (user) {
                    userName.value = user.displayName || user.email || 'Usuário';
                } else {
                    userName.value = null;
                }
            });
        });

        return {
            modoDarkAtivo,
            alterarTema,
            deslogar,
            userName,
            textoBotao: computed(() => (modoDarkAtivo.value ? 'Lightmode' : 'Darkmode')),
            load,
        };
    }
});
</script>

<style scoped>
header {
    padding: 1rem;
    background: #2E4A62;
    width: 100%;
    height: 100vh;
    text-align: center;
}

@media only screen and (max-width: 768px) {
    header {
        padding: 2.5rem;
        height: auto;
    }
}

.navbar-nav li {
    margin: 8px 0;
    display: flex;
    flex-direction: column;
    gap: 14px;
    align-items: center;
    width: 100%;
}

.link {
    color: #ffffff;
    padding-bottom: 2px;
}

.link:hover {
    color: #FAF0CA;
}



.link.router-link-active {
    color: #FAF0CA;
    border-bottom: 1px solid;
}

.logo {
    height: 250px;
}

@media (max-width: 1024px) {
    .logo {
        height: 200px;
    }
}
</style>