<template>
  <div>
    <p>
      <router-link to="/login">Logout</router-link>
    </p>
    <p>
      <div v-for="item in data">
        <p>{{item.id}}. {{item.content}}</p>
      </div>
    </p>
    <p>
      <input type="button" @click="testPost()" value="Create Post"/><br/>
      <input type="button" @click="testPatch()" value="Update Post"/><br/>
      <input type="button" @click="testDelete()" value="Delete Post"/>
    </p>
  </div>
</template>

<script>
import { webService, HttpMethod } from '../_services';

export default {
  data() {
    return {
      data: [],
    }
  },
  created() {
    this.loading = true;
    webService.req(HttpMethod.GET, '/data/').then(data => {
      this.data = data;
    });
  },
  methods: {
    testPost() {
      webService.req(HttpMethod.POST, '/data/', {'content':'test_content_from_ajax'}).then(data => {
        console.log(data);
      });
    },
    testPatch() {
      webService.req(HttpMethod.PATCH, '/data/19/', {'content':'test_content_from_ajax_patched'}).then(data => {
        console.log(data);
      });
    },
    testDelete() {
      webService.req(HttpMethod.DELETE, '/data/13/').then(data => {
        console.log(data);
      });
    },
  },
};
</script>