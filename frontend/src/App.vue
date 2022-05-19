<script setup>
import { RouterView } from "vue-router";
</script>

<template>
  <q-layout>
    <q-header>
      <q-toolbar>
        <q-avatar>
          <q-btn flat round dense icon="key" />
        </q-avatar>
        <q-toolbar-title>Key Master</q-toolbar-title>
        <q-btn @click="$router.replace('/login')" flat round dense icon="logout" />
      </q-toolbar>
    </q-header>
    <q-page-container>
      <RouterView />
    </q-page-container>
  </q-layout>
</template>
