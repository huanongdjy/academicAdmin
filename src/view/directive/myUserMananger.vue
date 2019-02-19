<template>
  <div>
    <Table border :data="tableData1" :columns="tableColumns1">
    </Table>
    <div style="margin: 10px;overflow: hidden">
      <div style="float: right;">
        <Page :total="total" :current="currentPage" @on-change="changePage"></Page>
      </div>
    </div>
    <Modal
      v-model="modal"
      title="Common Modal dialog box title"
      @on-ok="ok"
      >
      <Form ref="formCustom" :model="formCustom" :rules="ruleCustom" :label-width="80">
        <FormItem label="用户名" prop="username">
          <Input type="text" v-model="formCustom.username"></Input>
        </FormItem>
        <FormItem label="密码" prop="password">
          <Input type="text" v-model="formCustom.password"></Input>
        </FormItem>
        <!-- <FormItem label="确认密码" prop="passwdCheck">
          <Input type="password" v-model="formCustom.passwdCheck"></Input>
        </FormItem> -->
        <!-- <FormItem label="角色" prop="identity">
          <Input type="text" v-model="formCustom.identity"></Input>
        </FormItem> -->
        <FormItem label="角色">
          <Select v-model="formCustom.identity">
            <Option value="1">管理员</Option>
            <Option value="2">系统管理员</Option>
          </Select>
        </FormItem>
        <FormItem label="邮箱" prop="mailbox">
          <Input type="text" v-model="formCustom.mailbox"></Input>
        </FormItem>
        <!-- <FormItem>
          <Button type="primary" @click="handleSubmit('formCustom')">Submit</Button>
          <Button @click="handleReset('formCustom')" style="margin-left: 8px">Reset</Button>
        </FormItem> -->
      </Form>
    </Modal>
  </div>
</template>

<script>
import { getUsers, updateUser } from '@/api/userMananger'
export default {
  data () {
    const validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else {
        // if (this.formCustom.passwdCheck !== '') {
        //   // 对第二个密码框单独验证
        //   this.$refs.formCustom.validateField('passwdCheck')
        // }
        callback()
      }
    }
    // const validatePassCheck = (rule, value, callback) => {
    //   if (value === '') {
    //     callback(new Error('Please enter your password again'))
    //   } else if (value !== this.formCustom.passwd) {
    //     callback(new Error('The two input passwords do not match!'))
    //   } else {
    //     callback()
    //   }
    // }
    const validateIdentity = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('Please enter your password again'))
      } else {
        callback()
      }
    }
    const validateUsername = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入用户名'))
      } else {
        callback()
      }
    }
    const validateMailbox = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入邮箱'))
      } else {
        var reg = /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
        if (!reg.test(value)) {
          callback(new Error('请输入有效的邮箱'))
        } else {
          callback()
        }
      }
    }
    return {
      formCustom: {
        username: '',
        password: '',
        // passwdCheck: '',
        identity: '',
        mailbox: ''
      },
      ruleCustom: {
        username: [
          { validator: validateUsername, trigger: 'blur' }
        ],
        password: [
          { validator: validatePass, trigger: 'blur' }
        ],
        // passwdCheck: [
        //   { validator: validatePassCheck, trigger: 'blur' }
        // ],
        identity: [
          { validator: validateIdentity, trigger: 'blur' }
        ],
        mailbox: [
          { validator: validateMailbox, trigger: 'blur' }
        ]
      },
      modal: false,
      pageSize: 10,
      total: 0,
      currentPage: 1,
      tableData1: [],
      tableColumns1: [
        {
          title: '用户名',
          key: 'userName'
        },
        {
          title: '角色',
          key: 'identity',
          render: (h, params) => {
            return h('div', params.row.identity.access)
          }
        },
        {
          title: '邮箱',
          key: 'mailbox'
        },
        {
          title: '操作',
          key: 'action',
          width: 150,
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h('Button', {
                props: {
                  type: 'primary',
                  size: 'small'
                },
                style: {
                  marginRight: '5px'
                },
                on: {
                  click: () => {
                    this.show(params.index)
                  }
                }
              }, '查看'),
              h('Button', {
                props: {
                  type: 'error',
                  size: 'small'
                },
                on: {
                  click: () => {
                    this.remove(params.index)
                  }
                }
              }, '删除')
            ])
          }
        }
      ]
    }
  },
  methods: {
    formatDate (date) {
      const y = date.getFullYear()
      let m = date.getMonth() + 1
      m = m < 10 ? '0' + m : m
      let d = date.getDate()
      d = d < 10 ? ('0' + d) : d
      return y + '-' + m + '-' + d
    },
    changePage () {
      // The simulated data is changed directly here, and the actual usage scenario should fetch the data from the server
      this.tableData1 = this.mockTableData1()
    },
    show (index) {
      this.modal = true
      let data = this.tableData1[index]
      this.formCustom.username = data.userName
      this.formCustom.identity = data.identity.identity_id
      console.log(this.formCustom.identity)
      this.formCustom.password = data.password
      this.formCustom.mailbox = data.mailbox
    },
    remove (index) {
      this.tableData1.splice(index, 1)
    },
    ok () {
      updateUser(this.formCustom)
      this.$Message.info('Clicked ok')
    }
    // cancel () {
    //   this.$Message.info('Clicked cancel')
    // }
  },
  created () {
    getUsers(10, 1).then(res => {
      let data = res.data.page
      if (res.data.resultCode === '200') {
        data.list.forEach(element => {
          this.tableData1.push(element)
        })
        this.currentPage = data.size
        this.currentPage = data.pageNum
      }
    })
  }
}
</script>
