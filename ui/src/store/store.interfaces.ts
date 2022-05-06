import { Score } from '@/api/modules/scoreboard/scoreboardApi.interfaces';
import { AsyncStatus } from '@/types/RequestState';
import { CommitOptions, DispatchOptions, Store as VuexStore } from 'vuex';
import { RootStoreActions, RootStoreGetters, RootStoreMutations } from './';
import { UiStoreModuleType } from '@/store/modules/ui/ui.interfaces';

export interface RootState {
  scoreboard: {
    [date: string]: Score[];
  };
  selectedDate: string;
  selectedGame: string;
  scoreboardCallStatus: AsyncStatus;
}

export type RootStoreType<S = RootState> = Omit<
  VuexStore<S>,
  'commit' | 'getters' | 'dispatch'
> & {
  commit<
    K extends keyof typeof RootStoreMutations,
    P extends Parameters<typeof RootStoreMutations[K]>[1]
  >(
    key: K,
    payload?: P,
    options?: CommitOptions
  ): ReturnType<typeof RootStoreMutations[K]>;
} & {
  getters: {
    [K in keyof typeof RootStoreGetters]: ReturnType<typeof RootStoreGetters[K]>;
  };
} & {
  dispatch<K extends keyof typeof RootStoreActions>(
    key: K,
    payload?: Parameters<typeof RootStoreActions[K]>[1],
    options?: DispatchOptions
  ): ReturnType<typeof RootStoreActions[K]>;
};

export type StoreType = RootStoreType & UiStoreModuleType;
