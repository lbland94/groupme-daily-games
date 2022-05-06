<template>
  <div class="gdg-score flex col justify-c">
    <div class="flex row gdg-s-h">
      <div class="gdg-s-user">
        {{ score?.user }}
      </div>
      <div class="gdg-s-time">
        {{ time }}
      </div>
    </div>
    <div class="gdg-s-msg">
      {{ score?.source }}
    </div>
  </div>
</template>

<script lang="ts">
import { Score } from '@/api/modules/scoreboard/scoreboardApi.interfaces';
import dayjs from '@/utils/dayjs';
import { defineComponent, PropType } from 'vue';

export default defineComponent({
  name: 'GdgScore',
  components: {},
  props: {
    score: {
      type: Object as PropType<Score>,
      required: true,
    },
  },
  computed: {
    time() {
      return dayjs.unix(this.score.timestamp).format('h:mm a, MMM D');
    },
  },
});
</script>

<style lang="scss">
.gdg-score {
  padding: 3rem;
  min-width: 50vw;
  max-width: 760px;
  max-height: 80vh;
  box-sizing: border-box;

  .gdg-s-h {
    justify-content: space-between;
    margin-bottom: 3rem;
  }

  .gdg-s-msg {
    white-space: pre-wrap;
    overflow-y: auto;
    font-size: 2rem;
    display: inline-block;
    text-align: center;
  }

  @include media-smaller(xs) {
    min-width: none;
    max-width: none;
    max-height: none;
    width: 100vw;
    height: 100vh;
  }
}
</style>
