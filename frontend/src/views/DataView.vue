<template>
  <div>
    <p>
      <router-link to="/login">Logout</router-link>
    </p>
    <p>
      <div v-for="item in data">
        <p>{{item.content}}</p>
      </div>
    </p>
  </div>
</template>

<script>
import { webService } from '../_services';

export default {
  data() {
    return {
      data: [],
    }
  },
  created() {
    this.loading = true;
    webService.get('/data/').then(data => {
      this.data = data;
    });
  }
};
</script>
