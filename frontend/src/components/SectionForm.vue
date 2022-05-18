<template>
  <div>
    <input type="text" v-model="sectionInfo.name" />
    <br />
    <hr />
    <div v-for="(cred, index) in sectionInfo.creds">
      <input type="text" v-model="cred[0]" />
      :
      <input type="text" v-model="cred[1]" />
      &nbsp;&nbsp;&nbsp;&nbsp;
      <input type="button" @click="deleteSectionEntry(index)" value="Delete" />
    </div>
    <input type="button" value="Add entry" @click="createSectionEntry()" />
  </div>
  <div>
    <input type="button" @click="handleSave()" value="Save" />
  </div>
  <div>
    <input type="button" @click="handleDelete()" value="Delete Section" />
  </div>
  <hr />
  <br />
  <br />
</template>

<script>
export default {
  props: ['sectionInfo', 'isNewSection', 'sectionIndex'],
  emits: ['newSectionAdded', 'sectionUpdated', 'sectionDeleted', 'newSectionDeleted'],
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
  }
};
</script>
