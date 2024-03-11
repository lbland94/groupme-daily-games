<template>
  <div class="qa-fullscreen-overlay">
    <component
      v-if="data?.component"
      :is="data?.component"
      v-bind="data?.componentAttr"
      v-on="data?.componentListeners || {}"
      @close="$emit('close', data?.id)"
    />
    <button
      class="qa-close-button clear-btn cursor--pointer"
      v-if="data?.closeButton"
      @click.prevent="$emit('close', data?.id)"
    >
      <Icon name="close" />
    </button>
  </div>
</template>
<script lang="ts">
import { FullscreenOverlayConfig } from '@/store/modules/ui/ui.interfaces';
import { defineComponent, PropType } from 'vue';
import Icon from '@/components/atoms/Icon.vue';

export default defineComponent({
  name: 'QaFullscreenOverlay',
  props: {
    data: {
      type: Object as PropType<FullscreenOverlayConfig>,
      default: Object,
    },
  },
  components: { Icon },
});
</script>

<style lang="scss">
.qa-fullscreen-overlay {
  width: 100%;
  height: 100%;
  pointer-events: all;
  position: absolute;
  left: 0;
  top: 0;
  background-color: var(--qa-color-white);
}
</style>
