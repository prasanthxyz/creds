<template>
  <q-page class="flex items-center column q-mt-xl">
    <div class="row text-h3 q-pb-md">Login</div>
    <div class="column" style="width: 35%">
      <div class="row">
        <div class="col">
          <q-input dense type="text" v-model="username" label="Username" />
        </div>
      </div>
      <div class="row justify-end" v-show="submitted && !username">
        Username is required
      </div>
      <div class="row q-mt-sm">
        <div class="col">
          <q-input dense type="password" v-model="password" label="Password" />
        </div>
      </div>
      <div class="row justify-end" v-show="submitted && !password">
        Password is required
      </div>
      <div class="row">
        <div class="row col q-mt-lg justify-center">
          <q-btn
            color="primary"
            size="sm"
            :disabled="loading"
            label="Login"
            @click="handleSubmit"
            v-show="!loading"
          />
          <img
            v-show="loading"
            src="data:image/gif;base64,R0lGODlhEAAQAPIAAP///wAAAMLCwkJCQgAAAGJiYoKCgpKSkiH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAACwAAAAAEAAQAAADMwi63P4wyklrE2MIOggZnAdOmGYJRbExwroUmcG2LmDEwnHQLVsYOd2mBzkYDAdKa+dIAAAh+QQJCgAAACwAAAAAEAAQAAADNAi63P5OjCEgG4QMu7DmikRxQlFUYDEZIGBMRVsaqHwctXXf7WEYB4Ag1xjihkMZsiUkKhIAIfkECQoAAAAsAAAAABAAEAAAAzYIujIjK8pByJDMlFYvBoVjHA70GU7xSUJhmKtwHPAKzLO9HMaoKwJZ7Rf8AYPDDzKpZBqfvwQAIfkECQoAAAAsAAAAABAAEAAAAzMIumIlK8oyhpHsnFZfhYumCYUhDAQxRIdhHBGqRoKw0R8DYlJd8z0fMDgsGo/IpHI5TAAAIfkECQoAAAAsAAAAABAAEAAAAzIIunInK0rnZBTwGPNMgQwmdsNgXGJUlIWEuR5oWUIpz8pAEAMe6TwfwyYsGo/IpFKSAAAh+QQJCgAAACwAAAAAEAAQAAADMwi6IMKQORfjdOe82p4wGccc4CEuQradylesojEMBgsUc2G7sDX3lQGBMLAJibufbSlKAAAh+QQJCgAAACwAAAAAEAAQAAADMgi63P7wCRHZnFVdmgHu2nFwlWCI3WGc3TSWhUFGxTAUkGCbtgENBMJAEJsxgMLWzpEAACH5BAkKAAAALAAAAAAQABAAAAMyCLrc/jDKSatlQtScKdceCAjDII7HcQ4EMTCpyrCuUBjCYRgHVtqlAiB1YhiCnlsRkAAAOwAAAAAAAAAAAA=="
          />
        </div>
      </div>
      <div class="row justify-center q-mt-md" v-if="error">{{ error }}</div>
    </div>
  </q-page>
</template>

<script>
import router from "../router";
import { userService } from "../_services";

export default {
  data() {
    return {
      username: "",
      password: "",
      submitted: false,
      loading: false,
      returnUrl: "",
      error: "",
    };
  },
  created() {
    // reset login status
    userService.logout();

    // get return url from route parameters or default to '/'
    this.returnUrl = this.$route.query.returnUrl || "/";
  },
  methods: {
    handleSubmit() {
      this.error = "";
      this.submitted = true;
      const { username, password } = this;

      // stop here if form is invalid
      if (!(username && password)) {
        return;
      }

      this.loading = true;
      userService.login(username, password).then(
        () => router.push(this.returnUrl),
        (error) => {
          this.error =
            error === "Bad Request"
              ? "Invalid credentials."
              : "Something went wrong.";
          this.loading = false;
        }
      );
    },
  },
};
</script>
