<template>
  <q-page class="flex justify-center q-pa-md">
    <div class="row" v-if="isDataLoadFailed">Error in loading data.</div>
    <div class="row" v-else-if="!isDataLoaded">Loading...</div>
    <div class="column" style="width: 100%" v-else>
      <div class="row">
        <div class="row col-9 items-center">
          <div class="col-xs-6 col-sm-8 col-md-10 q-mr-xs">
            <q-input
              rounded
              outlined
              type="password"
              label="Secret Key"
              v-model="inputSecretKey"
              for="secretKey"
            />
          </div>
          <div class="row col items-center" v-if="sections.length === 0">
            <q-icon class="col" size="xl" name="lock" color="dark" />
            <q-btn
              class="col"
              size="md"
              push
              label="Unlock"
              color="primary"
              @click="decryptDataAndLoadIntoSections()"
              :disabled="!inputSecretKey"
              aria-label="Unlock data"
            />
          </div>
          <div class="row col items-center" v-else>
            <q-icon class="col" size="xl" name="lock_open" color="red" />
            <q-btn
              class="col"
              size="md"
              push
              label="Lock"
              color="primary"
              @click="lockSections()"
              aria-label="Lock data"
            />
          </div>
        </div>
        <div class="row col-3 justify-end">
          <div v-if="editMode">
            <q-btn
              size="lg"
              push
              icon="visibility"
              color="primary"
              @click="setEditMode(false)"
              aria-label="Switch to view mode"
            />
          </div>
          <div v-else>
            <q-btn
              size="lg"
              push
              icon="edit"
              color="primary"
              @click="setEditMode(true)"
              aria-label="Switch to edit mode"
            />
          </div>
        </div>
      </div>

      <div class="row q-mt-md" v-if="!editMode && sections.length === 0">
        No valid sections found.
      </div>
      <div class="row q-mt-xl justify-center" v-if="editMode">
        <q-btn
          color="primary"
          size="md"
          label="add new section"
          @click="addNewSection()"
          aria-label="Add a new section"
        />
      </div>
      <div class="row" v-if="editMode">
        <div
          class="col-xs-12 col-sm-10 col-md-8 col-lg-6 col-6"
          v-for="(sectionInfo, index) in newSections"
          :key="index"
        >
          <SectionForm
            :sectionInfo="sectionInfo"
            @sectionDeleted="deleteSection"
            :sectionIndex="index"
            v-bind:isNewSection="true"
            @sectionUpdated="updateSection"
            @newSectionDeleted="deleteNewSection"
            @newSectionAdded="postNewSection"
          />
        </div>
      </div>
      <div class="row" v-if="sections.length !== 0">
        <template v-if="!editMode">
          <div
            class="col-xs-12 col-md-6 col-lg-4"
            v-for="(sectionInfo, index) in sections"
            :key="index"
          >
            <SectionDisplay :sectionInfo="sectionInfo" />
          </div>
        </template>
        <template v-else>
          <div
            class="col-xs-12 col-sm-10 col-md-8 col-lg-6 col-6"
            v-for="(sectionInfo, index) in sections"
            :key="-1 * index"
          >
            <SectionForm
              :sectionInfo="sectionInfo"
              @sectionDeleted="deleteSection"
              :sectionIndex="index"
              @sectionUpdated="updateSection"
              @newSectionDeleted="deleteNewSection"
            />
          </div>
        </template>
      </div>
    </div>
  </q-page>
</template>

<script>
import { webService, HttpMethod } from "../_services";
import { _crypto } from "../_helpers";
import SectionDisplay from "../components/SectionDisplay.vue";
import SectionForm from "../components/SectionForm.vue";

export default {
  data() {
    return {
      backendData: [], // backend data
      sections: [], // decrypted backendData
      newSections: [], // to hold new sections not yet added to backend
      inputSecretKey: "", // for q-input model binding
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
     * Loads data from the backend and stores into this.backendData.
     * Sets isDataLoaded and isDataLoadFailed accordingly.
     */
    loadData() {
      webService
        .req(HttpMethod.GET, "/data/")
        .then((data) => {
          this.backendData = data;
          this.isDataLoaded = true;
          this.isDataLoadFailed = false;
          console.log("Data Loaded");
        })
        .catch((error) => {
          this.isDataLoaded = true;
          this.isDataLoadFailed = true;
          console.error(error.message);
        });
    },
    /**
     * Decrypts this.backendData and loads it into this.sections.
     * Each section will have 'id', 'name' and 'creds'.
     * 'id' is the section ID in DB.
     * 'name' will be an encrypted string.
     * 'creds' will be a list of lists, each list has two encrypted string each.
     */
    decryptDataAndLoadIntoSections() {
      this.sections = _crypto.decryptDataToSectionsList(this.backendData);
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
        name: "",
        creds: [],
      });
    },
    /**
     * Encrypts the given sectionInfo, posts to backend to create new section.
     * Updates this.backendData if successful.
     * Removes the entry from given index in this.newSections if successful.
     * @param {Object} sectionInfo: data to create new section
     * @param {Integer} index: index in this.newSections
     */
    postNewSection(sectionInfo, index) {
      try {
        const content = _crypto.encryptSectionInfoToContent(sectionInfo);
        webService
          .req(HttpMethod.POST, "/data/", { content: content })
          .then((data) => {
            console.log(data); // TODO: Show something else here like a pop-up
            this.newSections.splice(index, 1);
            this.backendData.push(data);
            this.decryptDataAndLoadIntoSections();
          })
          .catch((error) => {
            console.error(error.message); // TODO: Show something else here like a pop-up
          });
      } catch (error) {
        console.error(error.message); // TODO: Show something else here like a pop-up
      }
    },
    /**
     * Encrypts the given sectionInfo, posts to backend to update the section.
     * The section is found from given index in this.sections
     * Updates this.backendData if successful.
     * @param {Integer} index: index in this.sections
     * @param {Object} updatedSectionInfo: new data for the section
     */
    updateSection(index, updatedSectionInfo) {
      const id = this.sections[index]["id"];

      try {
        const content = _crypto.encryptSectionInfoToContent(updatedSectionInfo);
        webService
          .req(HttpMethod.PATCH, `/data/${id}/`, { content: content })
          .then((data) => {
            console.log(data); // TODO: Show something else here like a pop-up

            // Update this.backendData with the new content
            const _index = this.findIndex(id);
            if (_index !== -1) {
              this.backendData[_index].content = content;
              this.decryptDataAndLoadIntoSections();
            }
          })
          .catch((error) => {
            console.error(error.message); // TODO: Show something else here like a pop-up
          });
      } catch (error) {
        console.error(error.message); // TODO: Show something else here like a pop-up
      }
    },
    /**
     * Sends delete request to backend for the section in the given index in this.sections.
     * Removes the entry from this.backendData if successful.
     * @param {Integer} index: index in this.sections
     */
    deleteSection(index) {
      const id = this.sections[index]["id"];

      webService
        .req(HttpMethod.DELETE, `/data/${id}/`)
        .then((data) => {
          console.log(data); // TODO: Show something else here like a pop-up

          // Remove the entry from this.backendData
          const _index = this.findIndex(id);
          if (_index !== -1) {
            this.backendData.splice(_index, 1);
            this.decryptDataAndLoadIntoSections();
          }
        })
        .catch((error) => {
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
     * Finds and returns the index of given section in this.backendData.
     * The section is identified by the id param.
     * @param {Integer} id: Section ID in DB
     */
    findIndex(id) {
      return this.backendData.findIndex((obj) => {
        return obj.id === id;
      });
    },
    /**
     * Locks the currently opened sections
     * Resets this.inputSecretKey to clear secret key input
     */
    lockSections() {
      this.inputSecretKey = "";
      document.getElementById("secretKey").value = "";
      this.decryptDataAndLoadIntoSections();
    },
  },
  components: { SectionDisplay, SectionForm },
};
</script>
