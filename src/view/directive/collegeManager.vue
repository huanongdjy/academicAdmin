<template>
  <div>
    <Button type="primary" class="mybutton" @click="addCol">新增学院</Button>
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
      >
      <Form ref="formCustom" :model="formCustom" :rules="ruleCustom" :label-width="80">
        <FormItem label="名称" prop="college_name">
          <Input type="text" v-model="formCustom.college_name"></Input>
        </FormItem>
        <FormItem label="描述" prop="description">
          <Input type="text" v-model="formCustom.description"></Input>
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
import { getColleges, addCollege, deleteCollege, updateCollege, searchCollege } from '@/myapi/collegeManager'
export default {
  data () {
    const validateCollege_name = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入学院名称'))
      } else {
        callback()
      }
    }
    const validateDescription = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入类型的描述'))
      } else {
        callback()
      }
    }
    return {
      formCustom: {
        college_name: '',
        description: ''
      },
      title: '',
      tomethod: '',
      searchValue: '',
      ruleCustom: {
        college_name: [
          { validator: validateCollege_name, trigger: 'blur' }
        ],
        description: [
          { validator: validateDescription, trigger: 'blur' }
        ]
      },
      modal: false,
      pageSize: 10,
      total: 0,
      currentPage: 1,
      tableData1: [],
      tableColumns1: [
        {
          title: '学院名称',
          key: 'college_name'
        },
        {
          title: '描述',
          key: 'description'
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
    changePage (index) {
      getColleges(10, index).then(res => {
        let data = res.data.page
        if (res.data.resultCode === '200') {
          this.tableData1 = []
          data.list.forEach(element => {
            this.tableData1.push(element)
          })
          this.total = data.total
          this.currentPage = data.pageNum
        } else if (res.data.resultCode === '400') {
          this.$Message.info(res.data.message)
        }
      })
    },
    show (index) {
      this.modal = true
      let data = this.tableData1[index]
      this.formCustom.college_name = data.college_name
      this.formCustom.description = data.description
      this.formCustom.college_id = data.college_id
      this.title = '学院信息编辑'
      this.tomethod = 'update'
    },
    remove (index) {
      deleteCollege(this.tableData1[index].college_id).then(res => {
        if (res.data.resultCode === 200) {
          this.$Message.info(res.data.message)
          // this.tableData1.splice(index, 1)
          this.changePage(this.currentPage)
        } else if (res.data.resultCode === '400') {
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
            updateCollege(this.formCustom).then(res => {
              if (res.data.resultCode === '200') {
                this.$Message.info(res.data.message)
                this.changePage(this.currentPage)
              } else if (res.data.resultCode === '400') {
                this.$Message.info(res.data.message)
              }
            })
          } else if (this.tomethod === 'add') {
            addCollege(this.formCustom).then(res => {
              if (res.data.resultCode === '200') {
                this.$Message.info(res.data.message)
                this.changePage(this.currentPage)
              } else if (res.data.resultCode === '400') {
                this.$Message.info(res.data.message)
              }
            })
          }
          this.modal = false
        }
      })
    },
    cancel () {
      this.modal = false
    },
    addCol () {
      this.modal = true
      this.formCustom.college_name = ''
      this.formCustom.description = ''
      this.title = '新增学院'
      this.tomethod = 'add'
    },
    mysearch () {
      searchCollege(this.searchValue).then(res => {
        if (res.data.resultCode === 200 && !(res.data.essays.length === 0)) {
          this.tableData1 = []
          res.data.essays.forEach(item => {
            this.tableData1.push(item)
          })
        } else if (res.data.resultCode === '400') {
          this.$Message.info(res.data.message)
        } else {
          this.$Message.info('该类型名称不存在')
        }
      })
    }
  },
  created () {
    getColleges(10, 1).then(res => {
      let data = res.data.page
      if (res.data.resultCode === '200') {
        data.list.forEach(element => {
          this.tableData1.push(element)
        })
        this.total = data.total
        this.currentPage = data.pageNum
      } else if (res.data.resultCode === '400') {
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
