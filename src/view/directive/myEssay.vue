<template>
  <div>
    <Button type="primary" class="mybutton" @click="add">新增活动</Button>
    <Input search placeholder="请输入活动名称" class="search" v-model="searchValue" @on-search="mysearch">
      <Icon type="ios-search" slot="suffix" />
    </Input>
    <Table :columns="columns" :data="data1"></Table>
    <div style="margin: 10px;overflow: hidden">
      <div style="float: right;">
        <Page :total="total" :current="currentPage" @on-change="changePage"></Page>
      </div>
    </div>
    <Modal title="新增活动" v-model="visibleAdd" width="1000px">
      <Form ref="editValue" :label-width="100" :model="editValue" :rules="ruleValid">
        <FormItem label="标题" prop="title">
          <Input v-model="editValue.title" placeholder="请输入..."></Input>
        </FormItem>
        <FormItem label="类型" prop="type_id">
          <Select v-model="editValue.type_id">
            <Option v-for="type in typeList" :key="type.type_id" :value="type.type_id">{{ type.type_name }}</Option>
          </Select>
        </FormItem>
        <FormItem label="摘要" prop="summary">
          <Input v-model="editValue.summary" placeholder="请输入..."></Input>
        </FormItem>
        <FormItem label="举办者" prop="organizer">
          <Input v-model="editValue.organizer" placeholder="请输入..."></Input>
        </FormItem>
        <FormItem label="举办地点" prop="location">
          <Input v-model="editValue.location" placeholder="请输入..."></Input>
        </FormItem>
        <FormItem label="举办时间">
          <Row>
            <Col span="11">
              <FormItem prop="date">
                <DatePicker type="date" placeholder="选中日期" v-model="editValue.date"></DatePicker>
              </FormItem>
            </Col>
            <Col span="1" style="text-align: center" class="mycolum">-</Col>
            <Col span="11">
              <FormItem prop="time">
                <TimePicker type="time" placeholder="选择时间" v-model="editValue.time"></TimePicker>
              </FormItem>
            </Col>
          </Row>
        </FormItem>
        <FormItem label="所需资金" prop="fund">
          <Input v-model="editValue.fund" placeholder="请输入..."></Input>
        </FormItem>
        <FormItem label="容纳人数" prop="planned_attendance">
          <Input v-model="editValue.planned_attendance" placeholder="请输入..."></Input>
        </FormItem>
        <FormItem>
          <quillEditor v-model="editValue.content"
            ref="myQuillEditor"
            :options="editorOption">
          </quillEditor>
        </FormItem>
        <FormItem>
          <!-- <Button type="primary" @click="handleSubmit()">提交</Button>
          <Button @click="handleReset('formValidate')" style="margin-left: 8px">重置</Button> -->
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="text" size="large" @click="cancel">取消</Button>
        <Button type="primary" size="large"  @click="ok">确定</Button>
      </div>
    </Modal>
    <Modal title="编辑活动" v-model="visibleUpdate" width="1000px">
      <Form ref="editValue" :label-width="100" :model="editValue" :rules="ruleValid">
        <FormItem label="标题" prop="title">
          <Input v-model="editValue.title" placeholder="请输入..."></Input>
        </FormItem>
        <FormItem label="类型" prop="type_id">
          <Select v-model="editValue.type_id">
            <Option v-for="type in typeList" :key="type.type_id" :value="type.type_id">{{ type.type_name }}</Option>
          </Select>
        </FormItem>
        <FormItem label="摘要" prop="summary">
          <Input v-model="editValue.summary" placeholder="请输入..."></Input>
        </FormItem>
        <FormItem label="举办者" prop="organizer">
          <Input v-model="editValue.organizer" placeholder="请输入..."></Input>
        </FormItem>
        <FormItem label="举办地点" prop="location">
          <Input v-model="editValue.location" placeholder="请输入..."></Input>
        </FormItem>
        <FormItem label="举办时间">
          <Row>
            <Col span="11">
              <FormItem prop="date">
                <DatePicker type="date" placeholder="选中日期" v-model="editValue.date"></DatePicker>
              </FormItem>
            </Col>
            <Col span="1" style="text-align: center" class="mycolum">-</Col>
            <Col span="11">
              <FormItem prop="time">
                <TimePicker type="time" placeholder="选择时间" v-model="editValue.time"></TimePicker>
              </FormItem>
            </Col>
          </Row>
        </FormItem>
        <FormItem label="所需资金" prop="fund">
          <Input v-model="editValue.fund" placeholder="请输入..."></Input>
        </FormItem>
        <FormItem label="容纳人数" prop="planned_attendance">
          <Input v-model="editValue.planned_attendance" placeholder="请输入..."></Input>
        </FormItem>
        <FormItem>
          <quillEditor v-model="editValue.content"
            ref="myQuillEditor"
            :options="editorOption"
            @focus="onEditorFocus">
          </quillEditor>
        </FormItem>
        <FormItem>
          <!-- <Button type="primary" @click="handleSubmit()">提交</Button>
          <Button @click="handleReset('formValidate')" style="margin-left: 8px">重置</Button> -->
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="text" size="large" @click="cancel">取消</Button>
        <Button type="primary" size="large"  @click="ok">确定</Button>
      </div>
    </Modal>
    <Modal title="View Image" v-model="visible">
      <img :src="httpurl + 'uploaded/' + viewUrl " v-if="visible" style="width: 100%">
    </Modal>
  </div>
</template>
<script>
import expandRow from './essay-expand.vue'
import { getEssays, deleteEssay, searchEssays, addEssay, updateEssay, changeEssayToshow } from '@/myapi/essayManager'
import { getAllType } from '@/myapi/typeManager'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import httpurl from '@/config/httpURL'
import { quillEditor, Quill } from 'vue-quill-editor'
import { container, ImageExtend, QuillWatch } from 'quill-image-extend-module'
import { getToken } from '@/libs/util'
Quill.register('modules/ImageExtend', ImageExtend)
export default {
  components: {
    expandRow,
    quillEditor
  },
  data () {
    const validateTitle = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入名称'))
      } else {
        callback()
      }
    }
    const validateSummary = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入摘要'))
      } else {
        callback()
      }
    }
    const validateContent = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入内容'))
      } else {
        callback()
      }
    }
    const validateTime = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请选择时间'))
      } else {
        callback()
      }
    }
    const validateDate = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入日期'))
      } else {
        callback()
      }
    }
    const validateType_id = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请选择类型'))
      } else {
        callback()
      }
    }
    const validateLocation = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入举办地点'))
      } else {
        callback()
      }
    }
    const validateFund = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入举办所需资金'))
      } else if (!/^[a-z0-9]+$/.test(value)) {
        callback(new Error('请输入数字'))
      } else {
        callback()
      }
    }
    const validateOrganizer = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入举办者'))
      } else {
        callback()
      }
    }
    const validatePlanned_attendance = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('可容纳人数'))
      } else if (!/^[a-z0-9]+$/.test(value)) {
        callback(new Error('请输入数字'))
      } else {
        callback()
      }
    }
    return {
      httpurl: httpurl,
      updatemethod: 'update',
      addmethod: 'add',
      searchValue: '',
      currname: 'name1',
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
      data1: [],
      typeList: [],
      editValue: {
        id: '', // 为了存储图片，对应id
        title: '',
        member: '',
        content: '',
        organizer: '',
        location: '',
        photoList: [],
        // acquisitiondate : '', // 获取时间
        time: '', // data + time = acquisitiondate
        date: '',
        ordering: '10', // 显示权重
        toshow: true, // 是否显示
        type_id: '' // 类型ID
        // radio: 'male',
        // checkbox: [],
        // slider: [20, 50],
        // textarea: ''
      },
      outcomeForm: {
        id: '',
        title: '',
        content: '',
        photoList: []
      },
      token: getToken(),
      ruleValid: {
        title: [
          { validator: validateTitle, trigger: 'blur' }
        ],
        summary: [
          { validator: validateSummary, trigger: 'blur' }
        ],
        content: [
          { validator: validateContent, trigger: 'blur' }
        ],
        time: [
          { validator: validateTime, trigger: 'blur' }
        ],
        date: [
          { validator: validateDate, trigger: 'blur' }
        ],
        type_id: [
          { validator: validateType_id, trigger: 'blur' }
        ],
        location: [
          { validator: validateLocation, trigger: 'blur' }
        ],
        fund: [
          { validator: validateFund, trigger: 'blur' }
        ],
        organizer: [
          { validator: validateOrganizer, trigger: 'blur' }
        ],
        planned_attendance: [
          { validator: validatePlanned_attendance, trigger: 'blur' }
        ]
      },
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
            // size: 2,
            action: this.httpurl + 'uploadPhoto',
            response: (res) => {
              this.uploadList.push({ 'url': res.url })
              return this.httpurl + 'uploaded/' + res.url
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
    onEditorFocus (val) {
      console.log(this.$refs.myQuillEditor.quill.selection.savedRange.index)
      let range = val.getSelection()
      if (range) {
        if (range.length === 0) {
          console.log('User cursor is at index', range.index)
          this.length = range.index
        } else {
          var text = val.getText(range.index, range.length)
          console.log('User has highlighted: ', text)
          this.length = range.index
        }
      } else {
        this.length = val.getText().length
      }
      console.log(this.length)
    },
    changePage (index) {
      getEssays(10, index, 'newactivity').then(res => {
        let data = res.data.page
        this.data1 = []
        if (res.data.resultCode === '200') {
          data.list.forEach(element => {
            this.data1.push(element)
          })
          this.total = data.total
          this.currentPage = data.pageNum
        } else if (res.data.resultCode === '400') {
          this.$Message.info(res.data.message)
        }
      })
    },
    updatePage () {
      getEssays(10, this.currentPage, 'newactivity').then(res => {
        let data = res.data.page
        this.data1 = []
        if (res.data.resultCode === '200') {
          data.list.forEach(element => {
            this.data1.push(element)
          })
          this.total = data.total
          this.currentPage = data.pageNum
        } else if (res.data.resultCode === '400') {
          this.$Message.info(res.data.message)
        }
      })
    },
    mysearch () {
      this.name = 'name3'
      searchEssays(this.searchValue).then(res => {
        if (res.data.resultCode === 200 && !(res.data.essays.length === 0)) {
          this.data1 = []
          res.data.essays.forEach(item => {
            this.data1.push(item)
          })
        } else if (res.data.resultCode === '400') {
          this.$Message.info(res.data.message)
        } else {
          this.$Message.info('该活动名不存在')
        }
      })
    },
    // changeTab (name) {
    //   this.currentPage = 1
    //   this.data1 = []
    //   if (name === 'name1') {
    //     getEssays(10, 1, 'newactivity').then(res => {
    //       let data = res.data.page
    //       if (res.data.resultCode === '200') {
    //         this.data1 = []
    //         data.list.forEach(element => {
    //           this.data1.push(element)
    //         })
    //         this.total = data.total
    //         this.currentPage = data.pageNum
    //       }
    //     })
    //   } else if (name === 'name2') {
    //     getEssays(10, 1, 'oldactivity').then(res => {
    //       let data = res.data.page
    //       if (res.data.resultCode === '200') {
    //         this.data1 = []
    //         data.list.forEach(element => {
    //           this.data1.push(element)
    //         })
    //         this.total = data.total
    //         this.currentPage = data.pageNum
    //       }
    //     })
    //   } else if (name === 'name3') {
    //     getEssays(10, 1, 'activity').then(res => {
    //       let data = res.data.page
    //       if (res.data.resultCode === '200') {
    //         this.data1 = []
    //         data.list.forEach(element => {
    //           this.data1.push(element)
    //         })
    //         this.total = data.total
    //         this.currentPage = data.pageNum
    //       }
    //     })
    //   }
    // },
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
      this.visibleSummarize = true
      this.outcomeForm.id = this.data1[index].id
      this.outcomeForm.title = this.data1[index].title
      this.outcomeForm.content = ''
    },
    remove (index) {
      deleteEssay(this.data1[index].id).then(res => {
        if (res.data.resultCode === 200) {
          this.$Message.info(res.data.message)
          // this.tableData1.splice(index, 1)
          this.changePage(this.currentPage)
        } else if (res.data.resultCode === '400') {
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
    ok () {
      this.$refs['editValue'].validate(vaild => {
        if (vaild) {
          if (!(this.uploadList.length === 0)) {
            this.uploadList.forEach(item => {
              this.editValue.photoList.push(item)
            })
          }
          if (this.tomethod === 'add') {
            addEssay(this.editValue).then(res => {
              if (res.data.resultCode === 200) {
                this.data1 = []
                getEssays(10, 1, 'newactivity').then(res => {
                  let data = res.data.page
                  if (res.data.resultCode === '200') {
                    data.list.forEach(element => {
                      this.data1.push(element)
                    })
                    this.total = data.total
                    this.currentPage = data.pageNum
                  } else if (res.data.resultCode === '400') {
                    this.$Message.info(res.data.message)
                  }
                })
                this.$Message.info(res.data.message)
              } else if (res.data.resultCode === '400') {
                this.$Message.info(res.data.message)
              }
            })
          } else if (this.tomethod === 'update') {
            updateEssay(this.editValue).then(res => {
              if (res.data.resultCode === 200) {
                this.data1 = []
                getEssays(10, 1, 'newactivity').then(res => {
                  let data = res.data.page
                  if (res.data.resultCode === '200') {
                    data.list.forEach(element => {
                      this.data1.push(element)
                    })
                    this.total = data.total
                    this.currentPage = data.pageNum
                  } else if (res.data.resultCode === '400') {
                    this.$Message.info(res.data.message)
                  }
                })
                this.$Message.info(res.data.message)
              }
            })
          }
          this.cancel()
          this.updatePage()
          this.uploadList = []
        } else {
          return false
        }
      })
    },
    changeVisible (bol) {
      this.visibleAdd = bol
      this.visibleUpdate = bol
    }
  },
  created () {
    getEssays(10, 1, 'newactivity').then(res => {
      let data = res.data.page
      if (res.data.resultCode === '200') {
        data.list.forEach(element => {
          this.data1.push(element)
        })
        this.total = data.total
        this.currentPage = data.pageNum
      } else if (res.data.resultCode === '400') {
        this.$Message.info(res.data.message)
      }
    })
    getAllType().then(res => {
      if (res.data.resultCode === 200) {
        let data = res.data
        data.typeList.forEach(item => {
          this.typeList.push(item)
        })
      } else if (res.data.resultCode === '400') {
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
  float: right
}
</style>
