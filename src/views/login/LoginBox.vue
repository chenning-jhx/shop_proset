<template>
  <div class="login_box">
    <!-- LOGO -->
    <div class="login_img">
      <img src="~/assets/image/logo.png" alt="" />
    </div>
    <!-- 登录表单 -->
    <el-form ref="login_form" :model="login_form" :rules="login_rules" label-width="0px" class="login_form">
      <!-- 用户名 -->
      <el-form-item prop="username">
        <el-input v-model="login_form.username" prefix-icon="iconfont icon-user"></el-input>
      </el-form-item>
      <!-- 密码 -->
      <el-form-item prop="password">
        <el-input v-model="login_form.password" prefix-icon="iconfont icon-3702mima" type="password"></el-input>
      </el-form-item>
      <!-- 登录按钮 -->
      <el-form-item class="login-button">
        <el-button type="primary" @click="login">登录</el-button>
        <el-button type="info" @click="reset">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "LoginBox",
  data() {
      return {
          login_form: {
              username: 'admin',
              password: '123456'
          },
          login_rules: {
              username: [
                 { required: true, message: '请输入用户名', trigger: 'blur' },
                 { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
              ],
              password: [
                 { required: true, message: '请输入密码', trigger: 'blur' },
                 { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
              ]
          }
      }
  },
  methods: {
      reset() {
          this.$refs.login_form.resetFields();
      },
      login() {
          this.$refs.login_form.validate(async valid => {
            //   console.log(valid)
            if(!valid) return;
            const { data: res } = await this.$http.post("login", this.login_form);
            if (res.meta.status !== 200) return this.$message.error("登录失败！");
            this.$message.success("登录成功")

            // 保存token到sessionStorage中
            window.sessionStorage.setItem('token', res.data.token)
            this.$router.push('/home')
          })
      }
  }
};
</script>

<style scoped>
.login_box {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 450px;
  height: 300px;
  background-color: #fff;
}

.login_img {
  position: absolute;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 10px;
  width: 130px;
  height: 130px;
  background-color: #fff;
  border: 1px solid #eee;
  border-radius: 50%;
}

.login_img img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: #eee;
}

.login_form {
    position: absolute;
    bottom: 0;
    padding: 0 10px;
    width: 100%;
}

.login-button {
    display: flex;
    justify-content: flex-end;
}
</style>