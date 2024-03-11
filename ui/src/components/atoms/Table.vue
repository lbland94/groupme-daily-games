<template>
  <div
    class="gdg-flex-table"
    :style="{
      gridTemplateColumns: `repeat(${headers.length}, auto)`,
    }"
  >
    <div
      v-for="(header, i) in headers"
      :key="`${header}_${i}`"
      @click.prevent="sort(header)"
      class="gdg-t-head"
      :class="{
        'text-center': i > 0 && i < headers.length - 1,
        'text-left': i === 0,
        'text-right': i === headers.length - 1,
      }"
    >
      {{ formatHeader(header) }}
    </div>
    <template v-for="(r, i) in sortedContent" :key="`row_${i}`">
      <div
        v-for="(col, j) in headers"
        :key="`row_${i}_${col}_${j}`"
        class="gdg-t-col"
        :title="r.hover"
        @click.prevent="showDetailsModal(r.score)"
        :class="{
          'text-center': j > 0 && j < headers.length - 1,
          'text-left': j === 0,
          'text-right': j === headers.length - 1,
        }"
      >
        {{ r.data[col].value }}
      </div>
      <div class="gdg-t-h-line" v-if="i < sortedContent.length - 1"></div>
    </template>
  </div>
</template>

<script lang="ts">
import { Score } from '@/api/modules/scoreboard/scoreboardApi.interfaces';
import { useStore } from '@/store';
import { defineComponent, PropType } from 'vue';

export default defineComponent({
  name: 'GdgTable',
  props: {
    content: {
      type: Array as PropType<
        Array<{
          hover?: string;
          data: Record<string, { value: string | number | boolean; sortVal?: number }>;
          score: Score;
        }>
      >,
      default: Array,
    },
    excludedFields: {
      type: Array as PropType<Array<string>>,
      default: Array,
    },
    headers: {
      type: Array as PropType<Array<string>>,
      default: Array,
    },
    defaultSortField: {
      type: String,
      default: '',
    },
  },
  watch: {
    defaultSortField() {
      this.sortField = this.defaultSortField;
      this.sortAsc = true;
    },
    content() {
      this.sortField = this.defaultSortField;
      this.sortAsc = true;
    },
  },
  data: () => ({
    sortField: '',
    sortAsc: true,
    store: useStore(),
  }),
  mounted() {
    this.sortField = this.defaultSortField;
  },
  computed: {
    sortedContent() {
      return [...this.content].sort((a, b) => {
        let modifier = 1;
        if (!this.sortAsc) modifier = -1;
        if (
          a.data[this.sortField].sortVal !== undefined &&
          b.data[this.sortField].sortVal !== undefined
        ) {
          if (a.data[this.sortField].sortVal! < b.data[this.sortField].sortVal!)
            return -1 * modifier;
          if (a.data[this.sortField].sortVal! > b.data[this.sortField].sortVal!)
            return 1 * modifier;
        } else {
          if (a.data[this.sortField].value < b.data[this.sortField].value)
            return -1 * modifier;
          if (a.data[this.sortField].value > b.data[this.sortField].value)
            return 1 * modifier;
        }
        return 0;
      });
    },
  },
  methods: {
    formatHeader(fieldName: string) {
      return fieldName
        .replace(/_/g, ' ')
        .replace(/[A-Z]/g, (match) => {
          return ` ${match.toLowerCase()}`;
        })
        .trim();
    },
    sort(fieldName: string) {
      if (this.excludedFields.includes(fieldName)) return;

      if (fieldName === this.sortField) {
        this.sortAsc = !this.sortAsc;
      } else {
        this.sortAsc = true;
      }
      this.sortField = fieldName;
    },
    showDetailsModal(score: Score) {
      this.store.dispatch('ui/openOverlay', {
        type: 'modal',
        id: '1234',
        closeButton: true,
        component: 'ScoreDisplay',
        componentAttr: {
          score,
        },
      });
    },
  },
});
</script>

<style lang="scss">
.gdg-flex-table {
  width: 100%;
  display: grid;
  justify-content: space-between;
  gap: 4px;

  .gdg-t-head {
    cursor: pointer;
    margin-bottom: 1rem;
    border-bottom: 1px solid var(--gdg-color-white--darken-10);
    text-align: center;
    font-weight: bold;
  }

  .gdg-t-col {
    padding-bottom: 1rem;
    font-size: 1.1rem;
  }

  .gdg-t-h-line {
    grid-column: 1 / -1;
    height: 1px;
    background: var(--gdg-color-white--darken-10);
    margin-bottom: 1rem;
  }
}
</style>
