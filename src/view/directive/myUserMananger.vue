<template>
  <div>
    <Button type="primary" class="mybutton" @click="addUser">新增用户</Button>
    <Input search placeholder="请输入用户名" class="search" v-model="searchValue" @on-search="mysearch">
      <Icon type="ios-search" slot="suffix" />
    </Input>
    <Table border :data="tableData1" :columns="tableColumns1">
    </Table>
    <div style="margin: 10px;overflow: hidden">
      <div style="float: right;">
        <Page :total="total" :current="currentPage" @on-change="changePage"></Page>
      </div>
    </div>
    <Modal
      v-model="modal"
      :title="title"
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
          <select v-model="formCustom.identity">
            <option value="1">管理员</option>
            <option value="2">系统管理员</option>
          </select>
        </FormItem>
        <FormItem label="邮箱" prop="mailbox">
          <Input type="text" v-model="formCustom.mailbox"></Input>
        </FormItem>
        <!-- <FormItem>
          <Button type="primary" @click="handleSubmit('formCustom')">Submit</Button>
          <Button @click="handleReset('formCustom')" style="margin-left: 8px">Reset</Button>
        </FormItem> -->
      </Form>
      <div slot="footer">
        <Button type="text" size="large" @click="cancel">取消</Button>
        <Button type="primary" size="large"  @click="ok">确定</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import { getUsers, updateUser, addUser, searchUser, deleteUser } from '@/myapi/userMananger'
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
        identity: 2,
        mailbox: ''
      },
      title: '',
      tomethod: '',
      searchValue: '',
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
          key: 'username'
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
              }, '编辑'),
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
    changePage (index) {
      getUsers(10, index).then(res => {
        let data = res.data.page
        if (res.data.resultCode === '200') {
          this.tableData1 = []
          data.list.forEach(element => {
            this.tableData1.push(element)
          })
          this.total = data.total
          this.currentPage = data.pageNum
        }
      })
      // The simulated data is changed directly here, and the actual usage scenario should fetch the data from the server
      // this.tableData1 =
    },
    show (index) {
      this.modal = true
      let data = this.tableData1[index]
      this.formCustom.username = data.username
      this.formCustom.identity = data.identity.identity_id
      this.formCustom.password = data.password
      this.formCustom.mailbox = data.mailbox
      this.title = '用户信息编辑'
      this.tomethod = 'update'
    },
    remove (index) {
      deleteUser(this.tableData1[index].username).then(res => {
        if (res.data.resultCode === 200) {
          this.$Message.info(res.data.message)
          // this.tableData1.splice(index, 1)
          this.changePage(this.currentPage)
        } else if (res.data.resultCode === 400) {
          this.$Message.info(res.data.message)
        } else {
          this.$Message.info('删除用户失败')
        }
      })
    },
    ok () {
      this.$refs['formCustom'].validate(valid => {
        if (valid) {
          if (this.tomethod === 'update') {
            updateUser(this.formCustom).then(res => {
              this.$Message.info(res.data.message)
            })
          } else if (this.tomethod === 'add') {
            addUser(this.formCustom).then(res => {
              this.$Message.info(res.data.message)
            })
          }
          this.modal = false
        }
      })
    },
    cancel () {
      this.modal = false
    },
    addUser () {
      this.modal = true
      this.formCustom.username = ''
      this.formCustom.identity = 1
      this.formCustom.password = ''
      this.formCustom.mailbox = ''
      this.title = '新增用户'
      this.tomethod = 'add'
    },
    mysearch () {
      searchUser(this.searchValue).then(res => {
        if (res.data.resultCode === 200) {
          this.tableData1 = []
          this.tableData1.push(res.data.user)
        } else if (res.data.resultCode === 400) {
          this.$Message.info(res.data.message)
        } else {
          this.$Message.info('该用户名不存在')
        }
      })
    }
  },
  created () {
    getUsers(10, 1).then(res => {
      let data = res.data.page
      if (res.data.resultCode === '200') {
        data.list.forEach(element => {
          this.tableData1.push(element)
        })
        this.total = data.total
        this.currentPage = data.pageNum
      } else if (res.data.resultCode === 400) {
        this.$Message.info(res.data.message)
      }
    })
  }
}
</script>

<style>
  .mybutton {
    margin-bottom: 10px
  }
  .search {
    width: 200px;
    float: right
  }
</style>
