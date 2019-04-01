<template>
  <div style="width: 500px">
    <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
      <FormItem label="用户名" prop="username">
        <Input v-model="formValidate.username" :disabled='bol'></Input>
      </FormItem>
      <FormItem label="密码" prop="password">
        <Input v-model="formValidate.password" placeholder="请输入密码"></Input>
      </FormItem>
      <FormItem label="角色">
        <select v-model="formValidate.identity">
          <option value="1">管理员</option>
          <option value="2">系统管理员</option>
        </select>
      </FormItem>
      <FormItem label="E-mail" prop="mailbox">
        <Input v-model="formValidate.mailbox" placeholder="请输入邮箱"></Input>
      </FormItem>
      <FormItem label="手机号码" prop="phoneNumber">
        <Input v-model="formValidate.phoneNumber" placeholder="请输入手机号码"></Input>
      </FormItem>
      <FormItem>
        <Button type="primary" @click="handleSubmit('formValidate')">提交</Button>
        <Button @click="handleReset('formValidate')" style="margin-left: 8px">重置</Button>
      </FormItem>
    </Form>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { searchUser, updateUser } from '@/myapi/userMananger.js'
export default {
  data () {
    return {
      bol: false,
      formValidate: {
        username: '',
        mailbox: '',
        phoneNumber: '',
        password: '',
        identity: ''
      },
      ruleValidate: {
        username: [
          { required: true, message: '用户名不能为空', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '密码不能为空', trigger: 'blur' }
        ],
        identity: [
          { required: true, message: '请选择角色', trigger: 'change' }
        ],
        phoneNumber: [
          { required: true, message: '手机号码不能为空', trigger: 'blur' }
        ],
        mailbox: [
          { required: true, message: '邮箱不能为空', trigger: 'blur' },
          { type: 'email', message: '请输入有效邮箱', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    ...mapGetters([
      'getUsername'
    ])
  },
  methods: {
    handleSubmit (name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          updateUser(this.formValidate).then(res => {
            this.$Message.info(res.data.message)
          })
        }
      })
    },
    handleReset (name) {
      this.$refs[name].resetFields()
    }
  },
  created () {
    searchUser(this.getUsername).then(res => {
      if (res.data.resultCode === 200) {
        this.formValidate.username = res.data.user.username
        this.formValidate.password = res.data.user.password
        this.formValidate.mailbox = res.data.user.mailbox
        this.formValidate.phoneNumber = res.data.user.phoneNumber
        this.formValidate.identity = res.data.user.identity.identity_id
      } else if (res.data.resultCode === '400') {
        this.$Message.info(res.data.message)
      } else {
        this.$Message.error('获取用户信息失败')
      }
    })
  }
}
</script>
