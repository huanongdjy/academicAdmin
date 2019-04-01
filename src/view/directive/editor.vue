
<script>
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
// import { Script } from "vm"
import httpurl from '@/config/httpURL'
import { quillEditor, Quill } from 'vue-quill-editor'
import { container, ImageExtend, QuillWatch } from 'quill-image-extend-module'
import { getToken } from '@/libs/util'
import { addEssay, updateEssay } from '@/myapi/essayManager'
Quill.register('modules/ImageExtend', ImageExtend)
export default {
  components: {
    quillEditor
  },
  props: {
    editValue: {
      type: Object,
      default: function () {
        return {
          id: '',
          title: '',
          theme: '',
          summary: '',
          location: '',
          fund: '',
          organizer: '',
          planned_attendance: '',
          type_id: '',
          date: '',
          time: '',
          ordering: '',
          content: '',
          photoList: []
        }
      }
    },
    tomethod: {
      type: String
    }
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
      url: httpurl,
      uploadList: [],
      // editValue: {
      //   title: '',
      //   theme: '',
      //   summary: '',
      //   location: '',
      //   fund: '',
      //   organizer: '',
      //   planned_attendance: '',
      //   type_id: '',
      //   date: '',
      //   time: '',
      //   content: '',
      //   photoList: []
      // },
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
      token: getToken(),
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
    handleSubmit () {
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
                this.$emit('updatePage')
                this.$Message.info(res.data.message)
              } else if (res.data.resultCode === '400') {
                this.$Message.info(res.data.message)
              }
            })
          } else if (this.tomethod === 'update') {
            updateEssay(this.editValue).then(res => {
              if (res.data.resultCode === 200) {
                this.$emit('updatePage')
                this.$Message.info(res.data.message)
              } else if (res.data.resultCode === '400') {
                this.$Message.info(res.data.message)
              }
            })
          }
          this.uploadList = []
          this.$emit('changeVisible', false)
        } else {
          return false
        }
      })
    }
  }
}
</Script>
