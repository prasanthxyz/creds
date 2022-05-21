<template>
  <q-page class="flex items-center column q-mt-xl">
    <div class="row text-h3 q-pb-md">Login</div>
    <div class="column" style="width: 35%">
      <div class="row">
        <div class="col">
          <q-input dense type="text" v-model="username" label="Username" />
        </div>
      </div>
      <div class="row justify-end text-red" v-show="submitted && !username">
        Username is required
      </div>
      <div class="row q-mt-sm">
        <div class="col">
          <q-input dense type="password" v-model="password" label="Password" />
        </div>
      </div>
      <div class="row justify-end text-red" v-show="submitted && !password">
        Password is required
      </div>
      <div class="row col q-mt-lg justify-between">
        <q-btn
          style="width: 16em"
          color="primary"
          size="sm"
          :disabled="loading"
          label="Login"
          @click="loginSubmit"
          v-show="!loading"
          aria-label="Login"
        />
        <q-btn
          style="width: 16em"
          color="secondary"
          size="sm"
          :disabled="loading"
          label="Go to sign up page"
          @click="gotoSignup"
          v-show="!loading"
          aria-label="Go to sign up page"
        />
      </div>
      <div class="row justify-center">
        <img
          v-show="loading"
          src="data:image/gif;base64,R0lGODlhEAAQAPIAAP///wAAAMLCwkJCQgAAAGJiYoKCgpKSkiH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAACwAAAAAEAAQAAADMwi63P4wyklrE2MIOggZnAdOmGYJRbExwroUmcG2LmDEwnHQLVsYOd2mBzkYDAdKa+dIAAAh+QQJCgAAACwAAAAAEAAQAAADNAi63P5OjCEgG4QMu7DmikRxQlFUYDEZIGBMRVsaqHwctXXf7WEYB4Ag1xjihkMZsiUkKhIAIfkECQoAAAAsAAAAABAAEAAAAzYIujIjK8pByJDMlFYvBoVjHA70GU7xSUJhmKtwHPAKzLO9HMaoKwJZ7Rf8AYPDDzKpZBqfvwQAIfkECQoAAAAsAAAAABAAEAAAAzMIumIlK8oyhpHsnFZfhYumCYUhDAQxRIdhHBGqRoKw0R8DYlJd8z0fMDgsGo/IpHI5TAAAIfkECQoAAAAsAAAAABAAEAAAAzIIunInK0rnZBTwGPNMgQwmdsNgXGJUlIWEuR5oWUIpz8pAEAMe6TwfwyYsGo/IpFKSAAAh+QQJCgAAACwAAAAAEAAQAAADMwi6IMKQORfjdOe82p4wGccc4CEuQradylesojEMBgsUc2G7sDX3lQGBMLAJibufbSlKAAAh+QQJCgAAACwAAAAAEAAQAAADMgi63P7wCRHZnFVdmgHu2nFwlWCI3WGc3TSWhUFGxTAUkGCbtgENBMJAEJsxgMLWzpEAACH5BAkKAAAALAAAAAAQABAAAAMyCLrc/jDKSatlQtScKdceCAjDII7HcQ4EMTCpyrCuUBjCYRgHVtqlAiB1YhiCnlsRkAAAOwAAAAAAAAAAAA=="
        />
      </div>
      <div class="row justify-center q-mt-md text-red" v-if="error">
        {{ error }}
      </div>
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
    loginSubmit() {
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
          if (error && error.message) {
            this.error = "Something went wrong.";
          } else {
            this.error = error;
          }
          this.loading = false;
        }
      );
    },
    gotoSignup() {
      router.push("/signup");
    },
  },
};
</script>
