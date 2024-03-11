<template>
  <div class="gdg-scoreboard">
    <div class="flex row align-c gdg-s-head">
      <button class="gdg-s-prev clear-btn" v-if="!first" @click.prevent="$emit('prev')">
        <Icon name="chevron_left" />
      </button>
      <span v-else />
      <h2 class="gdg-s-title">{{ game }}</h2>
      <button class="gdg-s-next clear-btn" v-if="!last" @click.prevent="$emit('next')">
        <Icon name="chevron_right" />
      </button>
      <span v-else />
    </div>
    <GdgTable
      class="gdg-s-score-table"
      :content="tableContent"
      :headers="tableHeaders"
      :default-sort-field="defaultSortField"
    ></GdgTable>
    <slot></slot>
  </div>
</template>

<script lang="ts">
import { Score } from '@/api/modules/scoreboard/scoreboardApi.interfaces';
import { defineComponent, PropType } from 'vue';
import GdgTable from '@/components/atoms/Table.vue';
import Icon from '@/components/atoms/Icon.vue';
import dayjs from '@/utils/dayjs';

function transformScoreInfo(info: Score['info']) {
  const obj: Record<string, { value: string | number | boolean; sortVal?: number }> = {};
  for (const key in info) {
    const tKey = key as keyof Score['info'];
    switch (key) {
      case 'emoji':
      case 'date':
      case 'number':
        break;
      case 'score':
        if (isNaN(Number(info[tKey]))) {
          obj[tKey] = { value: info[tKey], sortVal: Infinity };
        } else {
          obj[tKey] = { value: info[tKey], sortVal: info[tKey] };
        }
        break;
      case 'time': {
        const d = dayjs.duration(info[tKey]);
        obj[tKey] = { value: d.format('m[m] s[s]'), sortVal: d.asMilliseconds() };
        break;
      }
      case 'hardMode':
        if (info[tKey]) {
          obj[tKey] = { value: '✅', sortVal: 0 };
        } else {
          obj[tKey] = { value: '❎', sortVal: 1 };
        }
        break;
      case 'hints':
        obj[tKey] = { value: info[tKey] ? info[tKey] : 0 };
        break;
      default:
        obj[tKey] = { value: info[tKey] };
        break;
    }
  }
  return obj;
}

export default defineComponent({
  name: 'GdgScoreboard',
  components: {
    GdgTable,
    Icon,
  },
  props: {
    first: {
      type: Boolean,
      default: false,
    },
    last: {
      type: Boolean,
      default: false,
    },
    scores: {
      type: Array as PropType<Array<Score>>,
      default: Array,
    },
    game: {
      type: String,
      default: '',
    },
  },
  emits: {
    next: null,
    prev: null,
  },
  computed: {
    defaultSortField() {
      const fields = this.tableContent.reduce((arr, tc) => {
        arr.push(...Object.keys(tc.data));
        return arr;
      }, [] as string[]);
      if (fields.includes('score')) {
        return 'score';
      } else if (fields.includes('time')) {
        return 'time';
      }
      return fields[0];
    },
    tableContent() {
      return this.scores.map((s) => ({
        hover: s.source,
        data: {
          user: {
            value: s.user,
          },
          ...transformScoreInfo(s.info),
          timeOfDay: {
            value: dayjs.unix(s.timestamp).format('h:mm a'),
            sortVal: s.timestamp,
          },
        },
        score: s,
      }));
    },
    tableHeaders() {
      return (
        (this.tableContent.length > 0 &&
          Object.keys(this.tableContent[0].data)
            .filter((h) => !([] as string[]).includes(h))
            .sort((a, b) => {
              const specialHeaders = ['user', 'score', 'time'];
              const aIndex = specialHeaders.indexOf(a);
              const bIndex = specialHeaders.indexOf(b);

              if (aIndex > -1 && bIndex > -1) {
                return aIndex - bIndex;
              } else if (aIndex > -1) {
                return -1;
              } else if (bIndex > -1) {
                return 1;
              }
              return 0;
            })) ||
        []
      );
    },
  },
});
</script>

<style lang="scss">
.gdg-scoreboard {
  padding: 3rem;
  width: 100%;
  box-sizing: border-box;
  max-width: 800px;
  margin: 0 auto;
  border-radius: 0.5rem;
  box-shadow: 0 3px 8px 4px rgba(0, 0, 0, 40%);
  background-color: var(--gdg-color-background--lighten-5);

  .gdg-s-prev,
  .gdg-s-next {
    font-size: 2rem;
  }

  .gdg-s-head {
    padding-bottom: 2rem;
    justify-content: space-between;
  }

  @include media-smaller(xs) {
    padding: 1rem;
  }
}
</style>
