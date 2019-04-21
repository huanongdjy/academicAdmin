<style lang="less">
  @import './login.less';
</style>

<template>
  <div class="login">
    <div class="login-con">
      <Card icon="log-in" title="欢迎登录" :bordered="false">
        <div class="form-con">
          <login-form @on-success-valid="handleSubmit"></login-form>
          <p class="login-tip tip" v-show="visible">{{message}}</p>
        </div>
      </Card>
    </div>
  </div>
</template>

<script>
import LoginForm from '_c/login-form'
import { mapActions } from 'vuex'
export default {
  components: {
    LoginForm
  },
  data () {
    return {
      visible: false,
      message: ''
    }
  },
  methods: {
    ...mapActions([
      'handleLogin',
      'getUserInfo'
    ]),
    handleSubmit ({ username, password }) {
      this.handleLogin({ username, password }).then(res => {
        let data = res.data
        if (data.resultCode === 200) {
          this.$router.push({
            name: this.$config.homeName
          })
        } else {
          this.visible = true
          this.message = data.message
        }
        // })
      })
    }
  }
}
</script>

<style>
.tip {
  color: #FF0000;
}
</style>
