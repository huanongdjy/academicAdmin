<template>
  <Form ref="loginForm" :model="form" :rules="rules" @keydown.enter.native="handleSubmit">
    <Form-Item prop="username">
      <Input v-model="form.username" placeholder="请输入用户名">
        <span slot="prepend">
          <Icon :size="16" type="ios-person"></Icon>
        </span>
      </Input>
    </Form-Item>
    <Form-Item prop="password">
      <Input type="password" v-model="form.password" placeholder="请输入密码">
        <span slot="prepend">
          <Icon :size="14" type="md-lock"></Icon>
        </span>
      </Input>
    </Form-Item>
     <!-- <Form-item prop="gender">
      <Radio-group v-model="form.identity">
        <Radio label="admin">管理员</Radio>
        <Radio label="sysadmin">系统管理员</Radio>
      </Radio-group>
    </Form-item> -->
    <Form-Item>
      <Button @click="handleSubmit" type="primary" long>登录</Button>
    </Form-Item>
  </Form>
</template>
<script>
export default {
  name: 'LoginForm',
  props: {
    userNameRules: {
      type: Array,
      default: () => {
        return [
          { required: true, message: '账号不能为空', trigger: 'blur' }
        ]
      }
    },
    passwordRules: {
      type: Array,
      default: () => {
        return [
          { required: true, message: '密码不能为空', trigger: 'blur' }
        ]
      }
    },
    identityRules: {
      type: Array,
      default: () => {
        return [
          { required: true, message: '请选择身份', trigger: 'change' }
        ]
      }
    }
  },
  data () {
    return {
      form: {
        username: '',
        password: ''
      }
    }
  },
  computed: {
    rules () {
      return {
        username: this.userNameRules,
        password: this.passwordRules
      }
    }
  },
  methods: {
    handleSubmit () {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.$emit('on-success-valid', {
            username: this.form.username,
            password: this.form.password
          })
        }
      })
    }
  }
}
</script>
