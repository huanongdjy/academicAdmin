<template>
  <div>
    <Input search placeholder="请输入名称" class="search" v-model="searchValue" @on-search="mysearch">
      <Icon type="ios-search" slot="suffix" />
    </Input>
    <br/>
    <br/>
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
        <FormItem label="菜单名称" prop="title">
          <Input type="text" v-model="formCustom.title"></Input>
        </FormItem>
        <FormItem label="权限" prop="access">
          <select v-model="formCustom.access">
            <option value="sysadmin">sysadmin</option>
            <option value="admin">admin</option>
          </select>
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
import { getMenusWithPage, updateMenu, searchMenu } from '@/myapi/menuManager'
export default {
  data () {
    const validateTitle = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入菜单名称'))
      } else {
        callback()
      }
    }
    const validateAccess = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请选择权限'))
      } else {
        callback()
      }
    }
    return {
      formCustom: {
        title: '',
        access: '',
        parent_id: ''
      },
      title: '',
      tomethod: '',
      searchValue: '',
      ruleCustom: {
        title: [
          { validator: validateTitle, trigger: 'blur' }
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
          title: '菜单名称',
          key: 'title'
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
              }, '编辑')
            ])
          }
        }
      ]
    }
  },
  methods: {
    changePage (index) {
      getMenusWithPage(10, index).then(res => {
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
      this.modal = true
      let data = this.tableData1[index]
      this.formCustom.title = data.title
      this.formCustom.access = data.access
      this.formCustom.menu_id = data.menu_id
      this.formCustom.parent_id = data.parent_id
      this.title = '菜单信息编辑'
      this.tomethod = 'update'
    },
    ok () {
      this.$refs['formCustom'].validate(valid => {
        if (valid) {
          if (this.tomethod === 'update') {
            updateMenu(this.formCustom).then(res => {
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
    mysearch () {
      searchMenu(this.searchValue).then(res => {
        if (res.data.resultCode === 200 && !(res.data.essays.length === 0)) {
          this.tableData1 = []
          res.data.essays.forEach(item => {
            this.tableData1.push(item)
          })
        } else if (res.data.resultCode === 400) {
          this.$Message.info(res.data.message)
        } else {
          this.$Message.info('该菜单名称不存在')
        }
      })
    }
  },
  created () {
    getMenusWithPage(10, 1).then(res => {
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
  }
</style>
