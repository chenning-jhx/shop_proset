<template>
  <div class="login-container">
      <login-box />
  </div>
</template>

<script>
import LoginBox from "./LoginBox";

export default {
  name: "Login",
  components: {
    LoginBox,
  },
};
</script>

<style scoped>
.login-container {
  height: 100%;
  background-color: #2b4b6b;
}
</style>
