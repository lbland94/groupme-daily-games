<template>
  <div>
    <div
      class="qa-drawer--bg cursor--pointer"
      @click.prevent="!data?.ignoreBgClick ? $emit('close', data?.id) : () => {}"
    ></div>
    <div class="qa-drawer" :class="{ [`qa-drawer--${computedEdge}`]: !!computedEdge }">
      <component
        v-if="data?.component"
        :is="data?.component"
        v-bind="data?.componentAttr"
        v-on="data?.componentListeners || {}"
        :class="data?.componentClasses"
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
  </div>
</template>
<script lang="ts">
import { DrawerConfig } from '@/store/modules/ui/ui.interfaces';
import { defineComponent, PropType } from 'vue';
import Icon from '@/components/atoms/Icon.vue';

export default defineComponent({
  name: 'QaDrawer',
  components: { Icon },
  props: {
    data: {
      type: Object as PropType<DrawerConfig>,
      default: Object,
    },
  },
  computed: {
    computedEdge(): string {
      if (typeof this.data?.edge === 'string') {
        return this.data.edge;
      }
      let edge = this.data?.edge?.md;
      if ((this.$mqs.sm || this.$mqs.xs) && this.data?.edge?.sm) {
        edge = this.data?.edge?.sm;
      }
      if (this.$mqs.xs && this.data?.edge?.xs) {
        edge = this.data?.edge?.xs;
      }
      return edge || '';
    },
  },
});
</script>

<style lang="scss">
.qa-drawer--bg {
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  z-index: 0;
  background-color: var(--qa-color-black);
  opacity: 0.2;
  pointer-events: all;
}

.qa-drawer {
  position: absolute;
  pointer-events: all;
  background-color: var(--qa-color-white);

  &.qa-drawer--right {
    top: 0;
    right: 0;
    height: 100%;
    width: 500px;
  }

  &.qa-drawer--left {
    top: 0;
    left: 0;
    height: 100%;
    width: 500px;
  }

  &.qa-drawer--bottom {
    bottom: 0;
    left: 0;
    height: 500px;
    width: 100%;
  }
}

.drawer-slide-enter-active,
.drawer-slide-leave-active {
  .qa-drawer,
  .qa-drawer--bg {
    transition: all 0.2s ease;
  }
}

.drawer-slide-enter-from,
.drawer-slide-leave-to {
  .qa-drawer--bg {
    opacity: 0;
  }

  .qa-drawer--left {
    transform: translateX(-100%);
  }

  .qa-drawer--right {
    transform: translateX(100%);
  }

  .qa-drawer--bottom {
    transform: translateY(100%);
  }
}
</style>
