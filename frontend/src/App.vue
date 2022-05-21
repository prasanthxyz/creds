<template>
  <q-layout view="hhh lpR fFf">
    <q-header elevated>
      <q-toolbar>
        <q-avatar>
          <q-btn flat round dense icon="key" aria-label="Avatar" />
        </q-avatar>
        <q-toolbar-title>Key Master</q-toolbar-title>
        <q-btn
          v-show="!isPublicPath()"
          @click="$router.replace('/login')"
          flat
          round
          dense
          icon="logout"
          aria-label="Log out"
        />
      </q-toolbar>
    </q-header>
    <q-page-container>
      <RouterView />
    </q-page-container>
  </q-layout>
</template>

<script>
import { RouterView } from "vue-router";
import { publicPages } from "./router";
export default {
  methods: {
    isPublicPath() {
      return publicPages.includes(this.$router.currentRoute.value.name);
    },
  },
  components: [RouterView],
};
</script>
