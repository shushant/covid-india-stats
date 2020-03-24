<template>
  <v-layout row wrap>
    <v-flex xs3>
      <v-text-field
        append-icon="search"
        label="Filter"
        single-line
        hide-details
        @input="filterSearch"
      ></v-text-field>
    </v-flex>

    <v-flex xl12>
      <v-dialog v-model="loading" hide-overlay persistent width="300">
        <v-card color="primary" dark>
          <v-card-text>
            Please stand by
            <v-progress-linear indeterminate color="white" class="mb-0">
            </v-progress-linear>
          </v-card-text>
        </v-card>
      </v-dialog>

      <v-data-table
        v-model="selected"
        :search="filters"
        :custom-filter="customFilter"
        :headers="headers"
        :items="rows"
        :pagination.sync="pagination"
        select-all
        item-key="state"
        class="elevation-1"
        :rows-per-page-items="[-1]"
        :hide-actions="true"
      >
        <template slot="headers" slot-scope="props">
          <tr>
            <th
              v-for="header in props.headers"
              :key="header.text"
              :class="[
                'column sortable',
                pagination.descending ? 'desc' : 'asc',
              ]"
              @click="changeSort(header.value)"
            >
              <v-icon small>arrow_upward</v-icon>
              {{ header.text }}
            </th>
          </tr>
        </template>
        <template slot="items" slot-scope="props">
          <tr
            :active="props.selected"
            @click="props.selected = !props.selected"
          >
            <td class="text-xs-right">{{ props.item.state }}</td>
            <td class="text-xs-right">{{ props.item.confirmed_india }}</td>
            <td class="text-xs-right">{{ props.item.confirmed_foreign }}</td>
            <td class="text-xs-right">{{ props.item.cured }}</td>
            <td class="text-xs-right">{{ props.item.death }}</td>
          </tr>
        </template>
      </v-data-table>
    </v-flex>
  </v-layout>
</template>

<script>
export default {
  data: () => ({
    loading: false,
    filters: {
      search: "",
    },
    pagination: {
      sortBy: "death",
    },
    selected: [],
    headers: [
      {
        text: "STATE/UT",
        value: "state",
      },
      {
        text: "Confirmed(Indian National)",
        value: "confirm_indian",
      },
      {
        text: "Confirmed( Foreign National )",
        value: "confirm_foreign",
      },
      {
        text: "Cured",
        value: "cured",
      },
      {
        text: "Death",
        value: "death",
      },
    ],
    rows: [],
  }),

  methods: {
    customFilter(items, filters, filter, headers) {
      const cf = new this.$filters(items, filters, filter, headers);

      cf.registerFilter("search", function (searchWord, items) {
        if (searchWord.trim() === "") return items;

        return items.filter((item) => {
          return item.state.toLowerCase().includes(searchWord.toLowerCase());
        }, searchWord);
      });

      return cf.runFilters();
    },
    toggleAll() {
      if (this.selected.length) {
        this.selected = [];
      } else {
        this.selected = this.rows.slice();
      }
    },
    changeSort(column) {
      if (this.pagination.sortBy === column) {
        this.pagination.descending = !this.pagination.descending;
      } else {
        this.pagination.sortBy = column;
        this.pagination.descending = false;
      }
    },

    filterSearch(val) {
      this.filters = this.$filters.updateFilters(this.filters, { search: val });
    },

    pullReports() {
      this.loading = true;
      fetch(`/analytics`)
        .then((res) => {
          res
            .json()
            .then((json) => {
              // console.log(json)
              this.rows = json;
              this.loading = false;
            })
            .catch((err) => {
              this.loading = false;
              console.log(err);
            });
        })
        .catch((err) => {
          this.loading = false;
          console.log(err);
        });
    },
  },

  filters: {},
  created: function () {
    this.pullReports();
  },
};
</script>
