<template>
  <div v-if="isDataLoadFailed">
    Error in loading data.
  </div>
  <div v-else-if="!isDataLoaded">
    Loading...
  </div>
  <div v-else>
    <div v-if="editMode">
      <input type="button" value="View" @click="setEditMode(false)" />
    </div>
    <div v-else>
      <input type="button" value="Edit" @click="setEditMode(true)" />
    </div>
    <br />
    <br />

    <div v-if="!editMode && sections.length === 0">
      No valid sections found.
    </div>
    <div v-else>
      <div v-for="(sectionInfo, index) in sections">
        <SectionDisplay v-if="!editMode" :sectionInfo="sectionInfo" />
        <SectionForm v-if="editMode" :sectionInfo="sectionInfo" @sectionDeleted="deleteSection" :sectionIndex="index"
          @sectionUpdated="updateSection" @newSectionDeleted="deleteNewSection" />
      </div>
    </div>
    <div v-if="editMode">
      <div v-for="(sectionInfo, index) in newSections">
        <SectionForm :sectionInfo="sectionInfo" @sectionDeleted="deleteSection" :sectionIndex="index"
          v-bind:isNewSection="true" @sectionUpdated="updateSection" @newSectionDeleted="deleteNewSection"
          @newSectionAdded="postNewSection" />
      </div>
      <input type="button" value="+" @click="addNewSection()" />
    </div>

    <br />
    <br />
    <br />
    <br />
    <br />
    <div>
      Secret Key:
      <input type="text" id="secretKey" />
      &nbsp;&nbsp;
      <input type="button" value="Decrypt" @click="decryptDataAndLoadIntoSections()" />
      <p>
        <router-link to="/login">Logout</router-link>
      </p>
    </div>
  </div>
</template>

<script>
import { webService, HttpMethod } from '../_services';
import { _crypto } from '../_helpers';
import SectionDisplay from '../components/SectionDisplay.vue';
import SectionForm from '../components/SectionForm.vue';

export default {
  data() {
    return {
      _data: [], // backend data
      sections: [], // decrypted _data
      newSections: [], // to hold new sections not yet added to backend
      editMode: false,
      isDataLoaded: false,
      isDataLoadFailed: false,
    };
  },
  created() {
    this.loadData();
  },
  methods: {
    /**
     * Loads data from the backend and stores into this._data.
     * Sets isDataLoaded and isDataLoadFailed accordingly.
     */
    loadData() {
      webService.req(HttpMethod.GET, '/data/')
        .then(data => {
          this._data = data;
          this.isDataLoaded = true;
          this.isDataLoadFailed = false;
          console.log("Data Loaded");
        })
        .catch(error => {
          this.isDataLoaded = true;
          this.isDataLoadFailed = true;
          console.error(error.message);
        });
    },
    /**
     * Decrypts this._data and loads it into this.sections.
     * Each section will have 'id', 'name' and 'creds'.
     * 'id' is the section ID in DB.
     * 'name' will be an encrypted string.
     * 'creds' will be a list of lists, each list has two encrypted string each.
     */
    decryptDataAndLoadIntoSections() {
      this.sections = _crypto.decryptDataToSectionsList(this._data);
    },
    /**
     * Sets this.editMode with the provided value.
     * @param {Boolean} value: editMode value to set
     */
    setEditMode(value) {
      this.editMode = value;
    },
    /**
     * Add a new empty section to this.newSections.
     * This is supposed to show an empty SectionForm in the UI.
     */
    addNewSection() {
      this.newSections.push({
        'name': '',
        'creds': [],
      });
    },
    /**
     * Encrypts the given sectionInfo, posts to backend to create new section.
     * Updates this._data if successful.
     * Removes the entry from given index in this.newSections if successful.
     * @param {Object} sectionInfo: data to create new section
     * @param {Integer} index: index in this.newSections
     */
    postNewSection(sectionInfo, index) {
      try {
        const content = _crypto.encryptSectionInfoToContent(sectionInfo);
        webService.req(HttpMethod.POST, "/data/", { "content": content })
          .then(data => {
            console.log(data); // TODO: Show something else here like a pop-up
            this.newSections.splice(index, 1);
            this._data.push(data);
            this.decryptDataAndLoadIntoSections();
          })
          .catch(error => {
            console.error(error.message); // TODO: Show something else here like a pop-up
          });
      } catch (error) {
        console.error(error.message); // TODO: Show something else here like a pop-up
      }
    },
    /**
     * Encrypts the given sectionInfo, posts to backend to update the section.
     * The section is found from given index in this.sections
     * Updates this._data if successful.
     * @param {Integer} index: index in this.sections
     * @param {Object} updatedSectionInfo: new data for the section
     */
    updateSection(index, updatedSectionInfo) {
      const id = this.sections[index]['id'];

      try {
        const content = _crypto.encryptSectionInfoToContent(updatedSectionInfo);
        webService.req(HttpMethod.PATCH, `/data/${id}/`, { "content": content })
          .then(data => {
            console.log(data); // TODO: Show something else here like a pop-up

            // Update this._data with the new content
            const _index = this.findIndex(id);
            if (_index !== -1) {
              this._data[_index].content = content;
              this.decryptDataAndLoadIntoSections();
            }
          })
          .catch(error => {
            console.error(error.message); // TODO: Show something else here like a pop-up
          });
      } catch (error) {
        console.error(error.message); // TODO: Show something else here like a pop-up
      }
    },
    /**
     * Sends delete request to backend for the section in the given index in this.sections.
     * Removes the entry from this._data if successful.
     * @param {Integer} index: index in this.sections
     */
    deleteSection(index) {
      const id = this.sections[index]['id'];

      webService.req(HttpMethod.DELETE, `/data/${id}/`)
        .then(data => {
          console.log(data); // TODO: Show something else here like a pop-up

          // Remove the entry from this._data
          const _index = this.findIndex(id);
          if (_index !== -1) {
            this._data.splice(_index, 1);
            this.decryptDataAndLoadIntoSections();
          }
        })
        .catch(error => {
          console.error(error.message); // TODO: Show something else here like a pop-up
        });
    },
    /**
     * Deletes the element in the given index from this.newSections
     * @param {Integer} index: index in this.newSections
     */
    deleteNewSection(index) {
      this.newSections.splice(index, 1);
    },
    /**
     * Finds and returns the index of given section in this._data.
     * The section is identified by the id param.
     * @param {Integer} id: Section ID in DB
     */
    findIndex(id) {
      return this._data.findIndex(obj => {
        return obj.id === id;
      });
    },
  },
  components: { SectionDisplay, SectionForm },
};
</script>
