<template>
  <span class="material-icons gdg-icon">{{ name }}</span>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'GdgIcon',
  props: {
    name: {
      type: String,
      default: '',
    },
  },
});
</script>

<style lang="scss">
.gdg-icon {
  max-width: 1em;
  overflow: hidden;
  font-size: inherit;
  display: block;
}
</style>
