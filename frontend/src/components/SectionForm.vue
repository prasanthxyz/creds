<template>
  <div>
    <q-input rounded outlined type="text" label="Section Name" v-model="sectionInfo.name" />
    <div v-for="(cred, index) in sectionInfo.creds" class="row">
      <q-input type="text" v-model="cred[0]" dense />
      <q-input type="text" v-model="cred[1]" dense />
      <q-btn color="deep-orange" size="sm" @click="deleteSectionEntry(index)" label="X" />
    </div>
  </div>
  <div class="row" style="justify-content:space-around">
    <q-btn color="primary" size="sm" label="Add entry" @click="createSectionEntry()" />
    <q-btn v-if="true || isSectionUpdated()" color="secondary" size="sm" @click="handleSave()" label="Save" />
    <q-btn color="deep-orange" size="sm" @click="handleDelete()" label="Delete Section" />
  </div>
  <hr />
  <br />
  <br />
</template>

<script>
import _ from 'lodash';

export default {
  props: ['sectionInfo', 'isNewSection', 'sectionIndex'],
  emits: ['newSectionAdded', 'sectionUpdated', 'sectionDeleted', 'newSectionDeleted'],
  data() {
    return {
      originalSectionInfo: {},
    };
  },
  mounted() {
    this.originalSectionInfo = _.cloneDeep(this.sectionInfo);
  },
  methods: {
    handleSave() {
      if (this.isNewSection) {
        this.$emit('newSectionAdded', this.sectionInfo, this.sectionIndex);
        return;
      }

      this.$emit('sectionUpdated', this.sectionIndex, this.sectionInfo);
    },
    handleDelete() {
      if (this.isNewSection) {
        this.$emit('newSectionDeleted', this.sectionIndex);
        return;
      }

      this.$emit('sectionDeleted', this.sectionIndex);
    },
    createSectionEntry() {
      this.sectionInfo.creds.push(["", ""]);
    },
    deleteSectionEntry(index) {
      this.sectionInfo.creds.splice(index, 1);
    },
    isSectionUpdated() {
      return !_.isEqual(this.sectionInfo, this.originalSectionInfo);
    },
  }
};
</script>
