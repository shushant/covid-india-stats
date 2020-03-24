<template>
    <v-app>
        <v-content>
            <v-container grid-list-md>
                <h2>COVID 19 INDIA Statewise Reports</h2>
                <CovidTable/>
            </v-container>
        </v-content>
    </v-app>
</template>

<script>
  import CovidTable from '@/components/CovidTable'
  export default {
    name: 'App',
    components: {
      CovidTable
    },
    data() {
      return {}
    }
  }
</script>
