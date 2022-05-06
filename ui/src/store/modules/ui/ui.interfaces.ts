import { Component } from 'vue';
import { CommitOptions, DispatchOptions, Store as VuexStore } from 'vuex';
import { UiStoreActions, UiStoreGetters, UiStoreMutations } from './ui';

export interface OverlayConfig {
  id: string;
  type: 'drawer' | 'modal' | 'fullscreen';
  component?: string | Component;
  componentAttr?: Record<string, any>;
  componentListeners?: any;
  componentClasses?: Record<string, boolean> | string;
  closeButton?: boolean;
  zIndex?: number;
  ignoreBgClick?: boolean;
}

export interface DrawerConfig extends OverlayConfig {
  type: 'drawer';
  edge?: 'right' | 'left' | 'bottom' | DrawerMqEdge;
}

export interface DrawerMqEdge {
  md: string;
  sm?: string;
  xs?: string;
}

export interface ModalConfig extends OverlayConfig {
  type: 'modal';
  title?: string;
  body?: string;
  mainButton?: string;
  secondaryButton?: string;
  modalListeners?: any;
}

export interface FullscreenOverlayConfig extends OverlayConfig {
  type: 'fullscreen';
}

export interface UiState {
  overlays: OverlayConfig[];
}

type UiNamespace<N extends string> = `ui/${N}`;

export type UiStoreModuleType<S = UiState> = Omit<
  VuexStore<S>,
  'commit' | 'getters' | 'dispatch' | 'state'
> & {
  commit<
    K extends keyof typeof UiStoreMutations,
    P extends Parameters<typeof UiStoreMutations[K]>[1]
  >(
    key: UiNamespace<K>,
    payload?: P,
    options?: CommitOptions
  ): ReturnType<typeof UiStoreMutations[K]>;
} & {
  getters: {
    [K in keyof typeof UiStoreGetters as UiNamespace<K>]: ReturnType<
      typeof UiStoreGetters[K]
    >;
  };
} & {
  dispatch<K extends keyof typeof UiStoreActions>(
    key: UiNamespace<K>,
    payload?: Parameters<typeof UiStoreActions[K]>[1],
    options?: DispatchOptions
  ): ReturnType<typeof UiStoreActions[K]>;
} & {
  state: {
    ui: {
      [K in keyof UiState]: UiState[K];
    };
  };
};
