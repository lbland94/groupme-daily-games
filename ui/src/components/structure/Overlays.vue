<template>
  <div class="gdg-overlays">
    <TransitionGroup name="fade">
      <FullscreenOverlay
        v-for="fullscreen in fullscreens"
        :key="fullscreen.id"
        :data="fullscreen"
        @close="closeOverlay"
      />
    </TransitionGroup>
    <TransitionGroup name="fade">
      <Modal
        v-for="modal in modals"
        :key="modal.id"
        :data="modal"
        @close="closeOverlay"
        v-on="modal.modalListeners || {}"
      />
    </TransitionGroup>
    <TransitionGroup name="drawer-slide" :duration="200">
      <Drawer
        v-for="drawer in drawers"
        :key="drawer.id"
        :data="drawer"
        @close="closeOverlay"
      />
    </TransitionGroup>
  </div>
</template>
<script lang="ts">
import { useStore } from '@/store';
import { computed, defineComponent } from 'vue';
import FullscreenOverlay from './FullscreenOverlay.vue';
import Modal from './Modal.vue';
import Drawer from './Drawer.vue';
import {
  DrawerConfig,
  FullscreenOverlayConfig,
  ModalConfig,
} from '@/store/modules/ui/ui.interfaces';

export default defineComponent({
  name: 'GdgOverlays',
  components: {
    FullscreenOverlay,
    Modal,
    Drawer,
  },
  setup() {
    const store = useStore();

    const fullscreens = computed(() => {
      return store.state.ui.overlays.filter(
        (o) => o.type === 'fullscreen'
      ) as FullscreenOverlayConfig[];
    });

    const modals = computed(() => {
      return store.state.ui.overlays.filter((o) => o.type === 'modal') as ModalConfig[];
    });

    const drawers = computed(() => {
      return store.state.ui.overlays.filter((o) => o.type === 'drawer') as DrawerConfig[];
    });

    function closeOverlay(id: string) {
      store.dispatch('ui/closeOverlay', id);
    }

    return {
      fullscreens,
      modals,
      drawers,
      closeOverlay,
    };
  },
});
</script>

<style lang="scss">
.gdg-overlays {
  position: fixed;
  width: 100vw;
  height: 100vh;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  z-index: 1;

  .gdg-close-button {
    position: absolute;
    right: 0;
    top: 0;
    padding: 10px;
  }
}
</style>
