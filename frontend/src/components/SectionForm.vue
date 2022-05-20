<template>
  <div class="column q-mt-xl q-pa-sm">
    <div class="row">
      <q-input
        class="col-12"
        rounded
        outlined
        type="text"
        label="Section Name"
        v-model="displaySectionInfo.name"
      />
    </div>
    <div
      v-for="(cred, index) in displaySectionInfo.creds"
      class="row items-end"
      :key="index"
    >
      <div class="row col-11">
        <div class="col-6">
          <q-input label="key" type="text" v-model="cred[0]" dense />
        </div>
        <div class="col-6">
          <q-input label="value" type="text" v-model="cred[1]" dense />
        </div>
      </div>
      <div class="col-1">
        <q-btn
          push
          flat
          color="black"
          icon="delete"
          size="md"
          @click="deleteSectionEntry(index)"
        />
      </div>
    </div>
    <div class="row q-mt-md">
      <div class="row col-12 justify-between">
        <div>
          <q-btn
            class="q-mr-md"
            color="primary"
            size="sm"
            label="Add entry"
            @click="createSectionEntry()"
          />
          <q-btn
            v-if="isSectionUpdated()"
            color="secondary"
            size="sm"
            @click="handleSave()"
            label="Save"
          />
        </div>
        <div>
          <q-btn
            color="red-10"
            size="sm"
            @click="handleDelete()"
            label="Delete Section"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { _dataValidator } from "../_helpers";
import _ from "lodash";

export default {
  props: ["sectionInfo", "isNewSection", "sectionIndex"],
  emits: [
    "newSectionAdded",
    "sectionUpdated",
    "sectionDeleted",
    "newSectionDeleted",
  ],
  data() {
    return {
      originalSectionInfo: {},
      displaySectionInfo: {},
    };
  },
  mounted() {
    this.originalSectionInfo = _.cloneDeep(this.sectionInfo);
    this.displaySectionInfo = _.cloneDeep(this.sectionInfo);
  },
  methods: {
    handleSave() {
      if (this.isNewSection) {
        this.$emit(
          "newSectionAdded",
          this.displaySectionInfo,
          this.sectionIndex
        );
        return;
      }

      this.displaySectionInfo["creds"] = _dataValidator.removeInvalidEntries(
        this.displaySectionInfo
      )["creds"];
      if (this.isSectionUpdated()) {
        this.$emit(
          "sectionUpdated",
          this.sectionIndex,
          this.displaySectionInfo
        );
      }
    },
    handleDelete() {
      if (
        !confirm(
          `Are you sure you want to delete ${
            this.displaySectionInfo.name || "this new section"
          }?`
        )
      ) {
        return;
      }

      if (this.isNewSection) {
        this.$emit("newSectionDeleted", this.sectionIndex);
        return;
      }

      this.$emit("sectionDeleted", this.sectionIndex);
    },
    createSectionEntry() {
      this.displaySectionInfo.creds.push(["", ""]);
    },
    deleteSectionEntry(index) {
      this.displaySectionInfo.creds.splice(index, 1);
    },
    isSectionUpdated() {
      return !_.isEqual(this.displaySectionInfo, this.originalSectionInfo);
    },
  },
};
</script>
