<template>
  <div>
    <Button type="primary" class="mybutton" @click="addRole">新增类型</Button>
    <Input search placeholder="请输入名称" class="search" v-model="searchValue" @on-search="mysearch">
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
      width="535px">
      <Form ref="formCustom" :model="formCustom" :rules="ruleCustom" :label-width="80">
        <FormItem label="名称" prop="identity_name">
          <Input type="text" v-model="formCustom.identity_name"></Input>
        </FormItem>
        <FormItem label="权限" prop="description">
           <Transfer
            :data="menuList"
            :target-keys="targetKeys1"
            :titles="titles"
            :render-format="render1"
            @on-change="handleChange1">
          </Transfer>
          <!-- <Input type="text" v-model="formCustom.access"></Input> -->
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="text" size="large" @click="cancel">取消</Button>
        <Button type="primary" size="large"  @click="ok">确定</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import { getRoles, searchRole, deleteRole, updateRole, addRole } from '@/myapi/roleManager'
import { getMenuList } from '@/myapi/menuManager'
// import { localRead } from '@/libs/util'
export default {
  data () {
    const validateIdentity_name = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入角色名称'))
      } else {
        callback()
      }
    }
    const validateAccess = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请选择角色权限'))
      } else {
        callback()
      }
    }
    return {
      formCustom: {
        identity_name: '',
        access: ''
      },
      titles: ['未拥有菜单权限', '已拥有菜单权限'],
      title: '',
      tomethod: '',
      searchValue: '',
      ruleCustom: {
        identity_name: [
          { validator: validateIdentity_name, trigger: 'blur' }
        ],
        access: [
          { validator: validateAccess, trigger: 'blur' }
        ]
      },
      modal: false,
      pageSize: 10,
      total: 0,
      currentPage: 1,
      tableData1: [],
      tableColumns1: [
        {
          title: '角色名称',
          key: 'identity_name'
        },
        {
          title: '权限',
          key: 'access'
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
      ],
      menuList: [],
      targetKeys1: []
    }
  },
  methods: {
    render1 (item) {
      return item.label
    },
    handleChange1 (newTargetKeys, direction, moveKeys) {
      this.targetKeys1 = newTargetKeys
    },
    changePage (index) {
      getRoles(10, index).then(res => {
        let data = res.data.page
        if (res.data.resultCode === '200') {
          this.tableData1 = []
          data.list.forEach(element => {
            this.tableData1.push(element)
          })
          this.total = data.total
          this.currentPage = data.pageNum
        } else if (res.data.resultCode === 400) {
          this.$Message.info(res.data.message)
        }
      })
    },
    show (index) {
      let data = this.tableData1[index]
      this.formCustom.identity_name = data.identity_name
      // this.formCustom.access = data.access
      let temaccess = data.access.substring(1, data.access.length - 1).split(',')
      let redata = this.menuList.filter(function (item) {
        let ret = false
        for (let i = 0; i < temaccess.length; i++) {
          if (JSON.stringify(item.key) === temaccess[i]) {
            ret = true
          }
        }
        // return data.access.indexOf(JSON.stringify(item.key)) > -1
        return ret
      })
        .map(item => item.key)
      this.targetKeys1 = redata
      this.formCustom.identity_id = data.identity_id
      this.title = '角色信息编辑'
      this.tomethod = 'update'
      this.modal = true
    },
    remove (index) {
      deleteRole(this.tableData1[index].identity_id).then(res => {
        if (res.data.resultCode === 200) {
          this.$Message.info(res.data.message)
          // this.tableData1.splice(index, 1)
          this.changePage(this.currentPage)
        } else if (res.data.resultCode === 400) {
          this.$Message.info(res.data.message)
        } else {
          this.$Message.info('删除类型失败')
        }
      })
    },
    ok () {
      this.$refs['formCustom'].validate(valid => {
        if (valid) {
          if (this.tomethod === 'update') {
            this.formCustom.access = JSON.stringify(this.targetKeys1)
            updateRole(this.formCustom).then(res => {
              this.$Message.info(res.data.message)
              this.changePage(this.currentPage)
            })
          } else if (this.tomethod === 'add') {
            this.formCustom.access = JSON.stringify(this.targetKeys1)
            addRole(this.formCustom).then(res => {
              this.$Message.info(res.data.message)
              this.changePage(this.currentPage)
            })
          }
          this.modal = false
        }
      })
    },
    cancel () {
      this.modal = false
    },
    addRole () {
      this.modal = true
      this.formCustom.identity_name = ''
      this.formCustom.access = ''
      this.title = '新增角色'
      this.tomethod = 'add'
    },
    mysearch () {
      searchRole(this.searchValue).then(res => {
        if (res.data.resultCode === 200 && !(res.data.essays.length === 0)) {
          this.tableData1 = []
          res.data.essays.forEach(item => {
            this.tableData1.push(item)
          })
        } else if (res.data.resultCode === 400) {
          this.$Message.info(res.data.message)
        } else {
          this.$Message.info('该角色名称不存在')
        }
      })
    }
  },
  created () {
    getRoles(10, 1).then(res => {
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
    getMenuList().then(res => {
      let data = res.menuList
      data.forEach(element => {
        this.menuList.push({ key: element.menu_id, label: element.label })
      })
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
