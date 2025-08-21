<template>
  <main :class="{ 'modo-escuro': modoDarkAtivo }">
    <div class="columns is-gapless is-multiline">
      <div v-if="!$route.path.includes('register') && !$route.path.includes('login')" class="column is-one-quarter">
        <BarraLateral @aoTemaAlterado="trocarTema" />
      </div>
      <div class="column is-three-quarter conteudo">
        <Notificacoes />
        <router-view></router-view>
      </div>
    </div>
  </main>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import BarraLateral from './components/BarraLateral.vue';
import Notificacoes from './components/Notificacoes.vue';

export default defineComponent({
  name: 'App',
  components: {
    BarraLateral,
    Notificacoes,
  },
  data() {
    return {
      modoDarkAtivo: false
    }
  },
  methods: {
    trocarTema(modoDarkAtivo: boolean) {
      this.modoDarkAtivo = modoDarkAtivo
    }
  }
});
</script>

<style>
.lista {
  padding: 1.25rem;
}

main {
  --bg-primario: #C0C2C1;
  --texto-primario: #000;
  font-family: 'Inter', sans-serif;
}

main.modo-escuro {
  --bg-primario: #2b2d42;
  --texto-primario: #ddd;
}

.conteudo {
  background-color: var(--bg-primario);
}


@media (max-width: 768px) {
  .conteudo {
    min-height: 40vh;
  }
}

.select:not(.is-multiple):not(.is-loading)::after {
  border-color: #000000;
}

.select select:focus {
  border-color: #b5b5b5 !important;
  box-shadow: none !important;
}

.input:focus {
  border-color: #b5b5b5 !important;
  box-shadow: none;
}
</style>
