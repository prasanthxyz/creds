<template>
  <div class="column q-mt-xl">
    <div class="row">
      <q-input class="col-xs-11 col-sm-9 col-md-7 col-lg-5 col-5" rounded outlined type="text" label="Section Name"
        v-model="sectionInfo.name" />
    </div>
    <div v-for="(cred, index) in sectionInfo.creds" class="row items-end">
      <div class="col-xs-5 col-sm-4 col-md-3 col-lg-2 col-2">
        <q-input label="key" type="text" v-model="cred[0]" dense />
      </div>
      <div class="col-xs-5 col-sm-4 col-md-3 col-lg-2 col-2">
        <q-input label="value" type="text" v-model="cred[1]" dense />
      </div>
      <div class="col-1">
        <q-btn push flat color="black" icon="delete" size="md" @click="deleteSectionEntry(index)" />
      </div>
    </div>
    <div class="row q-mt-md">
      <div class="row col-xs-11 col-sm-9 col-md-7 col-lg-5 col-5 justify-between">
        <div>
          <q-btn class="q-mr-md" color="primary" size="sm" label="Add entry" @click="createSectionEntry()" />
          <q-btn v-if="isSectionUpdated()" color="secondary" size="sm" @click="handleSave()" label="Save" />
        </div>
        <div>
          <q-btn color="red-10" size="sm" @click="handleDelete()" label="Delete Section" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { _dataValidator } from '../_helpers';
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

      this.sectionInfo['creds'] = _dataValidator.removeInvalidEntries(this.sectionInfo)['creds'];
      if (this.isSectionUpdated()) {
        this.$emit('sectionUpdated', this.sectionIndex, this.sectionInfo);
      }
    },
    handleDelete() {
      if (!confirm(`Are you sure you want to delete ${this.sectionInfo.name || 'this new section'}?`)) {
        return;
      }

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
