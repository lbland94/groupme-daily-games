<template>
  <router-view />
  <Overlays />
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Overlays from '@/components/structure/Overlays.vue';

export default defineComponent({
  name: 'GdgApp',
  components: {
    Overlays,
  },
});
</script>

<style lang="scss">
@import '@/scss/root.scss';

html,
body {
  width: 100vw;
  height: 100vh;
  padding: 0;
  margin: 0;
  background-color: var(--gdg-color-background);
  color: var(--gdg-color-font);
}
</style>
