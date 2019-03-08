<template>
<Form ref="editValue" :label-width="100" :model="editValue" :rules="ruleValid">
  <FormItem label="标题" prop="title">
    <Input v-model="editValue.title" placeholder="请输入..."></Input>
  </FormItem>
  <FormItem label="类型" prop="type_id">
    <select v-model="editValue.type_id">
      <option value="1">1</option>
    </select>
  </FormItem>
  <FormItem label="摘要" prop="summary">
    <Input v-model="editValue.summary" placeholder="请输入..."></Input>
  </FormItem>
  <FormItem label="举办者" prop="organizer">
    <Input v-model="editValue.organizer" placeholder="请输入..."></Input>
  </FormItem>
  <FormItem label="举办地点" prop="localtion">
    <Input v-model="editValue.localtion" placeholder="请输入..."></Input>
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
    <Button type="primary" @click="handleSubmit()">提交</Button>
    <Button @click="handleReset('formValidate')" style="margin-left: 8px">重置</Button>
  </FormItem>
</Form>
</template>

<script>
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
// import { Script } from "vm"
import { quillEditor, Quill } from 'vue-quill-editor'
import { container, ImageExtend, QuillWatch } from 'quill-image-extend-module'
import { getToken } from '@/libs/util'
import { addEssay } from '@/myapi/essayManager'
Quill.register('modules/ImageExtend', ImageExtend)
export default {
  components: {
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
    const validateLocaltion = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入举办地点'))
      } else {
        callback()
      }
    }
    const validateFund = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入举办所需资金'))
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
      } else {
        callback()
      }
    }
    return {
      uploadList: [],
      editValue: {
        title: '',
        theme: '',
        summary: '',
        localtion: '',
        fund: '',
        organizer: '',
        planned_attendance: '',
        type_id: '',
        date: '',
        time: '',
        content: '',
        photoList: []
      },
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
        localtion: [
          { validator: validateLocaltion, trigger: 'blur' }
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
      token: getToken(),
      editorOption: {
        modules: {
          ImageExtend: {
            loading: true,
            name: 'file',
            size: 2,
            action: 'http://localhost:8083/uploadPhoto',
            response: (res) => {
              this.uploadList.push({ 'url': res.url })
              return 'http://localhost:8083/uploaded/' + res.url
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
    handleSubmit () {
      console.log('调用')
      this.$refs['editValue'].validate(vaild => {
        if (vaild) {
          console.log('调用tong')
          this.uploadList.forEach(item => {
            this.editValue.photoList.push(item)
          })
          addEssay(this.editValue).then(res => {
            if (res.data.resultCode === 200) {
              // this.data1 = []
              // get(10, this.currentPage, 'achievements').then(res1 => {
              //   let data = res1.data.page
              //   if (res1.data.resultCode === '200') {
              //     data.list.forEach(element => {
              //       this.data1.push(element)
              //     })
              //     this.total = data.total
              //     this.currentPage = data.pageNum
              //   }
              // })
              this.$Message.info(res.data.message)
            }
          })
          this.uploadList = []
        } else {
          return false
        }
      })
    }
  }
}
</Script>
