<template>
  <div>
    <Input search placeholder="请输入活动名称" class="search" v-model="searchValue" @on-search="mysearch">
      <Icon type="ios-search" slot="suffix" />
    </Input>
    <br/>
    <br/>
    <Table :columns="columns" :data="data1"></Table>
    <div style="margin: 10px;overflow: hidden">
      <div style="float: right;">
        <Page :total="total" :current="currentPage" @on-change="changePage"></Page>
      </div>
    </div>
    <Modal title="活动终结" v-model="visibleSummarize" width="1000px">
      <Form ref="outcomeForm" :label-width="100" :model="outcomeForm" :rules="outVaild">
        <FormItem label="标题" prop="title">
          <Input v-model="outcomeForm.title"  :readonly="true"></Input>
        </FormItem>
        <FormItem>
          <quillEditor v-model="outcomeForm.content"
            ref="myQuillEditor"
            :options="editorOption">
          </quillEditor>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="text" size="large" @click="cancel">取消</Button>
        <Button type="primary" size="large"  @click="commitOutCome">确定</Button>
      </div>
    </Modal>
    <Modal title="View Image" v-model="visible">
      <img :src="url + 'uploaded/' + viewUrl " v-if="visible" style="width: 100%">
    </Modal>
  </div>
</template>
<script>
import expandRow from './essay-expand.vue'
import { getEssays, deleteEssay, searchEssays, changeEssayToshow } from '@/myapi/essayManager'
import { addOutcome, getOutcome } from '@/myapi/outcome'
import { getAllType } from '@/myapi/typeManager'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import { quillEditor, Quill } from 'vue-quill-editor'
import { container, ImageExtend, QuillWatch } from 'quill-image-extend-module'
import httpurl from '@/config/httpURL'
import { getToken } from '@/libs/util'
Quill.register('modules/ImageExtend', ImageExtend)
export default {
  components: {
    expandRow,
    quillEditor
  },
  data () {
    const validateContent = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入内容'))
      } else {
        callback()
      }
    }
    return {
      url: httpurl,
      updatemethod: 'update',
      addmethod: 'add',
      searchValue: '',
      currentPage: 1,
      total: 0,
      visibleSummarize: false,
      visibleUpdate: false,
      visibleAdd: false,
      visible: false,
      uploadList: [],
      viewUrl: '',
      tomethod: '',
      columns: [
        {
          type: 'expand',
          width: 50,
          render: (h, params) => {
            // console.log(params.row)
            return h(expandRow, {
              props: {
                row: params.row
              }
            })
          }
        },
        {
          title: '名称',
          key: 'title'
        },
        {
          title: '举办人',
          key: 'organizer'
        },
        {
          title: '举办时间',
          key: 'hold_time',
          render: (h, params) => {
            return h('div', params.row.hold_time.slice(0, 10))
          }
        },
        {
          title: '地点',
          key: 'location'
        },
        {
          title: '可容纳人数/实际出席人数',
          key: 'number',
          render: (h, params) => {
            return h('div', params.row.planned_attendance + '/' + params.row.actual_attendance)
          }
        },
        {
          title: '所需资金',
          key: 'fund'
        },
        {
          title: '是否对外展示',
          key: 'action',
          width: 100,
          align: 'center',
          render: (h, params) => {
            return h('i-switch', {
              props: {
                value: params.row.toshow
                // disabled: !params.row.online
              },
              on: {
                input: function (event) {
                  if (event) {
                    params.row.toshow = true
                  } else {
                    params.row.toshow = false
                  }
                },
                'on-change': () => {
                  this._changeToshow(params.row.id, params.row.toshow)
                }
              }
            })
          }
        },
        {
          title: '操作',
          key: 'action',
          width: 200,
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
                    this.outcome(params.index)
                  }
                }
              }, '活动总结')
            ])
          }
        }
      ],
      data1: [],
      typeList: [],
      outcomeForm: {
        id: '',
        title: '',
        content: '',
        photoList: []
      },
      token: getToken(),
      outVaild: {
        content: [
          { validator: validateContent, trigger: 'blur' }
        ]
      },
      editorOption: {
        modules: {
          ImageExtend: {
            loading: true,
            name: 'file',
            size: 2,
            action: this.url + 'uploadPhoto',
            response: (res) => {
              this.uploadList.push({ 'url': res.url })
              return this.url + 'uploaded/' + res.url
            },
            headers: (xhr) => {
              xhr.withCredentials = true
              xhr.setRequestHeader('Authorization', this.token)
            }
          },
          toolbar: {
            container: container,
            handlers: {
              'image': function () {
                QuillWatch.emit(this.quill.id)
              }
            }
          }
        }
      }
    }
  },
  methods: {
    _changeToshow (id, toshow) {
      changeEssayToshow(id, toshow).then(res => {
        this.$Message.warning(res.data.message)
      })
    },
    changePage (index) {
      getEssays(10, index, 'oldactivity').then(res => {
        let data = res.data.page
        this.data1 = []
        if (res.data.resultCode === '200') {
          data.list.forEach(element => {
            this.data1.push(element)
          })
          this.total = data.total
          this.currentPage = data.pageNum
        } else if (res.data.resultCode === 400) {
          this.$Message.info(res.data.message)
        }
      })
    },
    updatePage () {
      getEssays(10, this.currentPage, 'oldactivity').then(res => {
        let data = res.data.page
        this.data1 = []
        if (res.data.resultCode === '200') {
          data.list.forEach(element => {
            this.data1.push(element)
          })
          this.total = data.total
          this.currentPage = data.pageNum
        } else if (res.data.resultCode === 400) {
          this.$Message.info(res.data.message)
        }
      })
    },
    mysearch () {
      searchEssays(this.searchValue).then(res => {
        if (res.data.resultCode === 200 && !(res.data.essays.length === 0)) {
          this.data1 = []
          res.data.essays.forEach(item => {
            this.data1.push(item)
          })
        } else if (res.data.resultCode === 400) {
          this.$Message.info(res.data.message)
        } else {
          this.$Message.info('该活动名不存在')
        }
      })
    },
    show (index) {
      this.visibleUpdate = true
      this.tomethod = 'update'
      this.editValue.id = this.data1[index].id
      this.editValue.title = this.data1[index].title
      this.editValue.theme = this.data1[index].theme
      this.editValue.summary = this.data1[index].summary
      this.editValue.location = this.data1[index].location
      this.editValue.fund = this.data1[index].fund
      this.editValue.organizer = this.data1[index].organizer
      this.editValue.planned_attendance = this.data1[index].planned_attendance
      this.editValue.type_id = this.data1[index].type_id
      this.editValue.date = this.data1[index].hold_time.slice(0, 10)
      this.editValue.time = this.data1[index].hold_time.slice(11, 19)
      this.editValue.content = this.data1[index].content
      if (!(this.data1[index].photoList === 0)) {
        this.data1[index].photoList.forEach(item => {
          this.editValue.photoList.push(item)
        })
      }
    },
    outcome (index) {
      this.outcomeForm.id = this.data1[index].id
      this.outcomeForm.title = this.data1[index].title
      getOutcome(this.outcomeForm.id).then(res => {
        if (res.data.resultCode === 200) {
          this.outcomeForm.content = res.data.outcome
          this.visibleSummarize = true
        } else if (res.data.resultCode === 400) {
          this.$Message.info(res.data.message)
        }
      })
    },
    remove (index) {
      deleteEssay(this.data1[index].id).then(res => {
        if (res.data.resultCode === 200) {
          this.$Message.info(res.data.message)
          // this.tableData1.splice(index, 1)
          this.changePage(this.currentPage)
        } else if (res.data.resultCode === 400) {
          this.$Message.info(res.data.message)
        } else {
          this.$Message.info('删除活动失败')
        }
      })
    },
    add () {
      this.visibleAdd = true
      this.tomethod = 'add'
      this.editValue.id = ''
      this.editValue.title = ''
      this.editValue.theme = ''
      this.editValue.summary = ''
      this.editValue.location = ''
      this.editValue.fund = ''
      this.editValue.organizer = ''
      this.editValue.planned_attendance = ''
      this.editValue.type_id = ''
      this.editValue.date = ''
      this.editValue.time = ''
      this.editValue.content = ''
      this.editValue.photoList = []
    },
    cancel () {
      this.visibleAdd = false
      this.visibleUpdate = false
      this.visibleSummarize = false
      this.uploadList = []
    },
    commitOutCome () {
      this.$refs['outcomeForm'].validate(vaild => {
        if (vaild) {
          if (!(this.uploadList.length === 0)) {
            this.uploadList.forEach(item => {
              this.outcomeForm.photoList.push(item)
            })
          }
          addOutcome(this.outcomeForm).then(res => {
            getEssays(10, 1, 'oldactivity').then(res => {
              let data = res.data.page
              if (res.data.resultCode === '200') {
                this.data1 = []
                data.list.forEach(element => {
                  this.data1.push(element)
                })
                this.total = data.total
                this.currentPage = data.pageNum
              } else if (res.data.resultCode === 400) {
                this.$Message.info(res.data.message)
              }
            })
            this.cancel()
            this.$Message.info(res.data.message)
          })
        }
      })
    }
  },
  created () {
    getEssays(10, 1, 'oldactivity').then(res => {
      let data = res.data.page
      if (res.data.resultCode === '200') {
        data.list.forEach(element => {
          this.data1.push(element)
        })
        this.total = data.total
        this.currentPage = data.pageNum
      } else if (res.data.resultCode === 400) {
        this.$Message.info(res.data.message)
      }
    })
    getAllType().then(res => {
      if (res.data.resultCode === '200') {
        let data = res.data
        data.typeList.forEach(item => {
          this.typeList.push(item)
        })
      } else if (res.data.resultCode === 400) {
        this.$Message.info(res.data.message)
      }
    })
  }
}
</script>
<style>
/* .mycolum{
  margin-left: -24px
} */
.mybutton {
  margin-bottom: 10px
}
.search {
  width: 200px;
  /* float: right */
}
</style>
