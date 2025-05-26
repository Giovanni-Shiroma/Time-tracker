<template>
  <main class="columns is-gapless is-multiline" :class="{ 'modo-escuro': modoDarkAtivo }">
    <div class="column is-one-quarter">
      <BarraLateral @aoTemaAlterado="trocarTema" />
    </div>
    <div class="column is-three-quarter conteudo">
      <Notificacoes />
      <router-view></router-view>
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
  --bg-primario: #fff;
  --texto-primeiro: #000;
}

main.modo-escuro {
  --bg-primario: #2b2d42;
  --texto-primeiro: #ddd;
}

.conteudo {
  background-color: var(--bg-primario);
}
</style>
