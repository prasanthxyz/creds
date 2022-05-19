<template>
  <div class="column">
    <div class="col-12" style="margin-top:2rem; font-size:2rem; padding-bottom:0.4rem">{{ sectionInfo.name }}</div>
    <div class="row">
      <div class="col-12 col-md-5 col-sm-6">
        <q-table :columns="columns" :rows="rows" hide-header hide-bottom />
      </div>
    </div>
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
