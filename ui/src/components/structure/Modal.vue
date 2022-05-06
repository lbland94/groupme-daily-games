<template>
  <div>
    <div
      class="gdg-modal--bg cursor--pointer"
      @click.prevent="!data?.ignoreBgClick ? $emit('close', data?.id) : () => {}"
    ></div>
    <div class="gdg-modal">
      <component
        v-if="data?.component"
        :is="data?.component"
        v-bind="data?.componentAttr"
        v-on="data?.componentListeners"
        :class="data?.componentClasses"
        @close="$emit('close', data?.id)"
      />
      <div v-else class="gdg-modal--default">
        <h3 v-if="data?.title" class="gdg-modal--title">{{ data?.title }}</h3>
        <p v-if="data?.body" class="gdg-modal--body">{{ data?.body }}</p>
        <div class="gdg-modal--button-container">
          <button
            class="gdg-modal--button"
            v-if="data?.mainButton"
            @click.prevent="primary"
          >
            {{ data?.mainButton }}
          </button>
          <button
            class="gdg-modal--button"
            v-if="data?.secondaryButton"
            @click.prevent="secondary"
            light
          >
            {{ data?.secondaryButton }}
          </button>
        </div>
      </div>

      <button
        class="gdg-close-button clear-btn cursor--pointer"
        v-if="data?.closeButton"
        @click.prevent="$emit('close', data?.id)"
      >
        <Icon name="close" />
      </button>
    </div>
  </div>
</template>
<script lang="ts">
import { ModalConfig } from '@/store/modules/ui/ui.interfaces';
import { defineComponent, PropType } from 'vue';
import Icon from '@/components/atoms/Icon.vue';
import ScoreDisplay from '@/components/molecules/ScoreDisplay.vue';

export default defineComponent({
  name: 'GdgModal',
  components: { Icon, ScoreDisplay },
  props: {
    data: {
      type: Object as PropType<ModalConfig>,
      default: Object,
    },
  },
  setup(props, ctx) {
    function primary() {
      ctx.emit('close', props.data?.id);
      ctx.emit('primary');
    }
    function secondary() {
      ctx.emit('close', props.data?.id);
      ctx.emit('secondary');
    }

    return {
      primary,
      secondary,
    };
  },
});
</script>

<style lang="scss">
.gdg-modal--bg {
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  z-index: 0;
  background-color: var(--gdg-color-black);
  opacity: 0.4;
  pointer-events: all;
}

.gdg-modal {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  background-color: var(--gdg-color-background--lighten-5);
  pointer-events: all;
  box-shadow: 0 3px 8px 4px rgba(0, 0, 0, 40%);

  .gdg-modal--default {
    padding: 30px 10px 10px;
    display: flex;
    flex-direction: column;
    gap: 5px;
    max-width: 480px;
    max-height: 90vh;
  }

  .gdg-modal--title {
    margin-top: -10px;
    font-size: 24px;
  }

  .gdg-modal--body {
    font-size: 18px;
    overflow-y: auto;
  }

  .gdg-modal--button-container {
    display: flex;
    flex-direction: column;
    margin: 0 auto;
    gap: 5px;
  }

  @include media-smaller(xs) {
    .gdg-modal--default {
      min-width: 90vw;
    }
  }
}
</style>
