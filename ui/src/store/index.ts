import { ActionContext, createStore } from 'vuex';
import { RootState, StoreType } from './store.interfaces';
import VuexPersistence from 'vuex-persist';
import { AsyncStatus, RequestHelper } from '@/types/RequestState';
import { Score } from '@/api/modules/scoreboard/scoreboardApi.interfaces';
import { api } from '@/api/api';
import dayjs from '@/utils/dayjs';
import { MAX_PAST_DAYS } from './store.const';
import { ui } from './modules/ui/ui';

const sessionPersistence = new VuexPersistence({
  storage: window.localStorage,
  modules: [],
});

const defaultState = () => ({
  scoreboard: {},
  selectedDate: '',
  selectedGame: '',
  scoreboardCallStatus: AsyncStatus.IDLE,
});

export const RootStoreState: () => RootState = defaultState;

export const RootStoreMutations = {
  addScoreboardForDate(
    state: RootState,
    { scoreboard, date }: { scoreboard: RootState['scoreboard'][string]; date: string }
  ) {
    state.scoreboard[date] = scoreboard;
  },
  setScoreboard(state: RootState, scoreboard: RootState['scoreboard']) {
    state.scoreboard = scoreboard;
  },
  resetScoreboard(state: RootState) {
    state.scoreboard = defaultState().scoreboard;
  },
  setDate(state: RootState, date: string) {
    state.selectedDate = date;
  },
  setGame(state: RootState, game: string) {
    state.selectedGame = game;
  },
  setScoreboardCallStatus(state: RootState, status: RootState['scoreboardCallStatus']) {
    state.scoreboardCallStatus = status;
  },
};

export const RootStoreActions = {
  async fetchScoreboard(
    { dispatch, commit, state }: ActionContext<RootState, RootState>,
    date: string
  ) {
    const requestHelper = new RequestHelper<Score[]>();
    const promise = requestHelper.start(api.scoreboard.fetchScoreboard(date));
    commit('setScoreboardCallStatus', requestHelper.status);
    const response = await promise;
    commit('setScoreboardCallStatus', requestHelper.status);
    if (response.success) {
      commit('addScoreboardForDate', { scoreboard: response.data, date });
    }
    if (!state.selectedDate) {
      dispatch('selectDate', date);
    }
  },
  async selectOtherDate(
    { state, dispatch, commit, getters }: ActionContext<RootState, RootState>,
    offset: number
  ) {
    const today = dayjs().startOf('day');
    const date = state.selectedDate
      ? dayjs(state.selectedDate, 'YYYY-MM-DD').startOf('day')
      : today.clone();
    const offsetDate = date.clone().add(offset, 'days');

    if (
      !offsetDate.isAfter(today) &&
      Math.abs(offsetDate.diff(today, 'days')) <= MAX_PAST_DAYS
    ) {
      const dateStr = offsetDate.format('YYYY-MM-DD');
      if (!state.scoreboard[dateStr]) {
        await dispatch('fetchScoreboard', dateStr);
      }
      commit('setDate', dateStr);
    }
    if (!getters.games.includes(state.selectedGame)) {
      dispatch('selectFirstGame');
    }
  },
  selectDate({ dispatch, commit }: ActionContext<RootState, RootState>, date: string) {
    commit('setDate', date);
    dispatch('selectFirstGame');
  },
  selectFirstGame({ commit, getters }: ActionContext<RootState, RootState>) {
    commit('setGame', (getters.games && getters.games.length && getters.games[0]) || '');
  },
  selectOtherGame(
    { commit, getters }: ActionContext<RootState, RootState>,
    offset: number
  ) {
    commit('setGame', getters.games[(getters.gameIndex + offset) % getters.games.length]);
  },
};

export const RootStoreGetters = {
  selectedScoreboard(state: RootState) {
    if (!state.selectedDate) return [];
    return state.scoreboard[state.selectedDate];
  },
  selectedGame(state: RootState, getters: { selectedScoreboard: Score[] }) {
    if (!state.selectedGame) return [];
    return getters.selectedScoreboard.filter((s) => s.game === state.selectedGame);
  },
  games(state: RootState, getters: { selectedScoreboard: Score[] }) {
    return getters.selectedScoreboard
      .reduce((arr, s) => {
        if (!arr.includes(s.game)) {
          arr.push(s.game);
        }
        return arr;
      }, [] as string[])
      .sort(
        (a, b) =>
          getters.selectedScoreboard.filter((s) => s.game === b).length -
          getters.selectedScoreboard.filter((s) => s.game === a).length
      );
  },
  gameIndex(state: RootState, getters: { games: string[] }) {
    return getters.games.indexOf(state.selectedGame);
  },
  dateEdges(state: RootState) {
    const today = dayjs().startOf('day');
    const date = state.selectedDate
      ? dayjs(state.selectedDate, 'YYYY-MM-DD').startOf('day')
      : today.clone();
    const earliest = today.clone().subtract(MAX_PAST_DAYS, 'days');

    return {
      first: date.isSame(earliest),
      last: date.isSame(today),
    };
  },
};

export const store = createStore({
  state: RootStoreState,
  mutations: RootStoreMutations,
  actions: RootStoreActions,
  getters: RootStoreGetters,
  modules: {
    ui,
  },
  plugins: [sessionPersistence.plugin],
}) as StoreType;

export function useStore() {
  return store as StoreType;
}

export default store;
