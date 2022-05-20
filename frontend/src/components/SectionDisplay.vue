<template>
  <div class="column">
    <div class="text-h4 q-mt-lg q-ml-sm">{{ sectionInfo.name }}</div>
    <q-table class="q-ma-sm" :columns="columns" :rows="rows" hide-header hide-bottom />
  </div>
</template>

<script>
export default {
  props: ['sectionInfo'],
  data() {
    return {
      columns: [
        {
          name: 'key',
          label: 'key',
          align: 'left',
          field: row => row.key,
          style: 'width:50%',
        },
        {
          name: 'value',
          label: 'value',
          align: 'left',
          field: row => row.value,
          style: 'width:50%',
        },
      ],
      rows: [],
    };
  },
  mounted() {
    this.rows = this.sectionInfo.creds
      .map((cred) => {
        return { 'key': cred[0], 'value': cred[1] };
      });
  },
};
</script>
