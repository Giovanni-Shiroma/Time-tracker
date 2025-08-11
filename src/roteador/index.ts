import Projetos from "@/views/Projetos.vue";
import Tarefas from "@/views/Tarefas.vue";
import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";
import Formulario from "@/views/Projetos/Formulario.vue"
import Lista from "@/views/Projetos/Lista.vue"
import Login from "@/views/Login.vue";
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import Profile from "@/views/Profile.vue";
import SignIn from "@/views/Login/SignIn.vue";
import Register from "@/views/Login/Register.vue";
import Recover from "@/views/Login/Recover.vue";

const rotas: RouteRecordRaw[] = [
    {
        path: '/',
        name: 'Tarefas',
        component: Tarefas,
        meta: { requiresAuth: true },
    },
    {
        path: '/profile',
        name: 'Profile',
        component: Profile,
        meta: { requiresAuth: true },
    },
    {
        path: '/projetos',
        component: Projetos,
        children: [
            {
                path: '',
                name: 'Projetos',
                component: Lista
            },
            {
                path: 'novo',
                name: 'Novo projeto',
                component: Formulario
            },
            {
                path: ':id',
                name: 'Editar projeto',
                component: Formulario,
                props: true
            }
        ],
        meta: { requiresAuth: true },
    },
    {
        path: '/login',
        component: Login,
        children: [
            {
                path: '',
                name: 'Login',
                component: SignIn,
            },
            {
                path: 'register',
                name: 'Register',
                component: Register,
            },
                        {
                path: 'recover',
                name: 'Recover',
                component: Recover,
            },
        ],
        meta: { requiresAuth: false },
    },
];

const roteador = createRouter({
    history: createWebHashHistory(),
    routes: rotas
});

roteador.beforeEach((to, from, next) => {
    const requiresAuth = to.matched.some(record => record.meta.requiresAuth);

    if (!requiresAuth) {
        return next(); // rota pública, pode acessar
    }

    const auth = getAuth();

    // Garantir que a verificação só aconteça 1 vez
    const unsubscribe = onAuthStateChanged(auth, (user) => {
        unsubscribe(); // evita múltiplas execuções

        if (user) {
            next(); // usuário autenticado, permite acesso
        } else {
            next('/login'); // redireciona para login
        }
    });
});


export default roteador;