<template>
  <div class="gdg-home">
    <div class="flex row align-c gdg-h-header">
      <button class="gdg-h-prev clear-btn" v-if="!first" @click.prevent="selectDate(-1)">
        <Icon name="chevron_left" />
      </button>
      <span v-else />
      <h2 class="gdg-s-title">{{ dateDisplay }}</h2>
      <button class="gdg-h-next clear-btn" v-if="!last" @click.prevent="selectDate(1)">
        <Icon name="chevron_right" />
      </button>
      <span v-else />
    </div>
    <Scoreboard
      class="relative"
      :game="selectedGame"
      :first="gameIndex === 0"
      :last="gameIndex === games?.length - 1"
      :scores="selectedGameScoreboard"
      @next="selectOtherGame(1)"
      @prev="selectOtherGame(-1)"
    >
      <Spinner v-if="scoreboardCallStatus === 'AWAITING'" class="absolute-center" />
    </Scoreboard>
  </div>
</template>

<script lang="ts">
import { useStore } from '@/store';
import { defineComponent } from 'vue';
import Scoreboard from '@/components/molecules/Scoreboard.vue';
import Icon from '@/components/atoms/Icon.vue';
import dayjs from '@/utils/dayjs';
import Spinner from '@/components/atoms/Spinner.vue';

export default defineComponent({
  name: 'GdgHome',
  components: { Scoreboard, Icon, Spinner },
  async mounted() {
    await this.store.dispatch(
      'fetchScoreboard',
      (this.$route.query?.date as string | undefined) || this.date.format('YYYY-MM-DD')
    );
  },
  data: () => ({
    today: dayjs().startOf('day'),
    store: useStore(),
  }),
  methods: {
    async selectDate(offset: number) {
      await this.store.dispatch('selectOtherDate', offset);
      this.updateRoute();
    },
    async updateRoute() {
      this.$router.push({ query: { date: this.date.format('YYYY-MM-DD') } });
    },
    selectOtherGame(offset: number) {
      this.store.dispatch('selectOtherGame', offset);
    },
  },
  computed: {
    date() {
      const selectedDate = this.store.state.selectedDate;
      if (selectedDate) {
        return dayjs(selectedDate, 'YYYY-MM-DD');
      }
      return this.today.clone();
    },
    scoreboardCallStatus() {
      return this.store.state.scoreboardCallStatus;
    },
    gameIndex() {
      return this.store.getters['gameIndex'];
    },
    selectedGame: {
      get() {
        return this.store.state.selectedGame;
      },
      set(game: string) {
        this.store.commit('setGame', game);
      },
    },
    first() {
      return this.store.getters['dateEdges'].first;
    },
    last() {
      return this.store.getters['dateEdges'].last;
    },
    dateDisplay() {
      return this.date.format('MMMM D, YYYY');
    },
    scoreboard() {
      const store = useStore();
      return store.state.scoreboard;
    },
    games() {
      return this.store.getters['games'];
    },
    selectedGameScoreboard() {
      return this.store.getters['selectedGame'];
    },
  },
});
</script>

<style lang="scss">
.gdg-home {
  position: relative;
  padding: 1rem;

  .gdg-h-header {
    padding-bottom: 1rem;
    max-width: 800px;
    margin: 0 auto;
    justify-content: space-between;
  }

  .gdg-h-prev,
  .gdg-h-next {
    font-size: 2rem;
  }
}
</style>
