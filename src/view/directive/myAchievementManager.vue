<template>
  <div>
    <Button type="primary" class="mybutton" @click="add">新增成果</Button>
    <Input search placeholder="请输入成果名称" class="search" v-model="searchValue" @on-search="mysearch">
      <Icon type="ios-search" slot="suffix" />
    </Input>
    <Table :columns="columns" :data="data1"></Table>
    <div style="margin: 10px;overflow: hidden">
      <div style="float: right;">
        <Page :total="total" :current="currentPage" @on-change="changePage"></Page>
      </div>
    </div>
    <Modal title="成果信息编辑" v-model="visibleUpdate">
      <Form :model="formItem" :label-width="80" :rules="ruleValid" ref="formItem">
        <FormItem label="成果名称" prop="title">
          <Input v-model="formItem.title" placeholder="请输入..."></Input>
        </FormItem>
        <FormItem label="成员" prop="member">
          <Input v-model="formItem.member" placeholder="请输入..."></Input>
        </FormItem>
        <FormItem label="显示权重">
          <select v-model="formItem.ordering">
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
            <option value="6">6</option>
            <option value="7">7</option>
            <option value="8">8</option>
            <option value="9">9</option>
            <option value="10">10</option>
          </select>
        </FormItem>
        <FormItem label="获取时间">
          <Row>
            <Col span="11">
              <FormItem prop="date">
                <DatePicker type="date" placeholder="选中日期" v-model="formItem.date"></DatePicker>
              </FormItem>
            </Col>
            <Col span="1" style="text-align: center" class="mycolum">-</Col>
            <Col span="11">
              <FormItem prop="time">
                <TimePicker type="time" placeholder="选择时间" v-model="formItem.time"></TimePicker>
              </FormItem>
            </Col>
          </Row>
        </FormItem>
        <FormItem label="类型" prop="type_id">
          <select v-model="formItem.type_id">
            <option value="1">类型A</option>
          </select>
        </FormItem>
        <!-- <FormItem label="Radio">
          <RadioGroup v-model="formItem.radio">
            <Radio label="male">Male</Radio>
            <Radio label="female">Female</Radio>
          </RadioGroup>
        </FormItem> -->
        <FormItem label="是否显示">
          <i-switch v-model="formItem.toshow" size="large">
            <span slot="open">On</span>
            <span slot="close">Off</span>
          </i-switch>
        </FormItem>
        <!-- <FormItem label="Slider">
          <Slider v-model="formItem.slider" range></Slider>
        </FormItem> -->
        <FormItem label="内容" prop="content">
          <Input v-model="formItem.content" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="Enter something..."></Input>
        </FormItem>
        <FormItem label="图片">
          <div class="demo-upload-list" v-for="item in formItem.photoList" :key="item.url">
            <img :src="'http://localhost:8083/uploaded/'+ item.url">
            <div class="demo-upload-list-cover">
              <Icon type="ios-eye-outline" @click.native="handleView(item.url)"></Icon>
              <Icon type="ios-trash-outline" @click.native="handleRemove(item)"></Icon>
            </div>
          </div>
          <div class="demo-upload-list" v-for="i in uploadList" :key="i.url">
            <img :src="'http://localhost:8083/uploaded/'+ i.url">
            <div class="demo-upload-list-cover">
              <Icon type="ios-eye-outline" @click.native="handleView(i.url)"></Icon>
              <Icon type="ios-trash-outline" @click.native="handleRemove(i)"></Icon>
            </div>
          </div>
          <Upload
            ref="upload"
            :on-success="handleSuccess"
            :show-upload-list="false"
            :format="['jpg','jpeg','png']"
            :max-size="2048"
            :on-format-error="handleFormatError"
            :on-exceeded-size="handleMaxSize"
            :before-upload="handleBeforeUpload"
            multiple
            type="drag"
            action="http://localhost:8083/uploadPhoto"
            style="display: inline-block;width:58px;">
            <div style="width: 58px;height:58px;line-height: 58px;">
                <Icon type="ios-camera" size="20"></Icon>
            </div>
          </Upload>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="text" size="large" @click="cancel">取消</Button>
        <Button type="primary" size="large"  @click="ok">确定</Button>
      </div>
    </Modal>
    <Modal title="新增成果" v-model="visibleAdd" >
      <Form :model="formAdd" :label-width="80" :rules="ruleValid" ref="formAdd">
        <FormItem label="成果名称" prop="title">
          <Input v-model="formAdd.title" placeholder="请输入..."></Input>
        </FormItem>
        <FormItem label="成员" prop="member">
          <Input v-model="formAdd.member" placeholder="请输入..."></Input>
        </FormItem>
        <FormItem label="显示权重" prop="ordering">
          <select v-model="formAdd.ordering">
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
            <option value="6">6</option>
            <option value="7">7</option>
            <option value="8">8</option>
            <option value="9">9</option>
            <option value="10">10</option>
          </select>
        </FormItem>
        <FormItem label="获取时间" prop="date time">
          <Row>
            <Col span="11">
              <FormItem prop="date">
                <DatePicker type="date" placeholder="选择日期" v-model="formAdd.date"></DatePicker>
              </FormItem>
            </Col>
            <Col span="1" style="text-align: center" class="mycolum">-</Col>
            <Col span="11">
              <FormItem prop="time">
                <TimePicker type="time" placeholder="选择时间" v-model="formAdd.time"></TimePicker>
              </FormItem>
            </Col>
          </Row>
        </FormItem>
        <FormItem label="类型"  prop="type_id">
          <select v-model="formAdd.type_id">
            <option value="1">类型A</option>
          </select>
        </FormItem>
        <!-- <FormItem label="Radio">
          <RadioGroup v-model="formItem.radio">
            <Radio label="male">Male</Radio>
            <Radio label="female">Female</Radio>
          </RadioGroup>
        </FormItem> -->
        <FormItem label="是否显示">
          <i-switch v-model="formAdd.toshow" size="large">
            <span slot="open">On</span>
            <span slot="close">Off</span>
          </i-switch>
        </FormItem>
        <!-- <FormItem label="Slider">
          <Slider v-model="formItem.slider" range></Slider>
        </FormItem> -->
        <FormItem label="内容" prop="content">
          <Input v-model="formAdd.content" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入..."></Input>
        </FormItem>
        <!-- <FormItem label="已上传图片" v-if="formAdd.photoList.length > 0">
          <div class="demo-upload-list" v-for="item in formAdd.photoList" :key="item.url">
            <img :src="'http://localhost:8083/uploaded/'+ item.url">
            <div class="demo-upload-list-cover">
              <Icon type="ios-eye-outline" @click.native="handleView(item.url)"></Icon>
              <Icon type="ios-trash-outline" @click.native="handleRemove(item)"></Icon>
            </div>
          </div>
        </FormItem> -->
        <FormItem label="上传图片">
          <div class="demo-upload-list" v-for="i in uploadList" :key="i.url">
            <img :src="'http://localhost:8083/uploaded/'+ i.url">
            <div class="demo-upload-list-cover">
              <Icon type="ios-eye-outline" @click.native="handleView(i.url)"></Icon>
              <Icon type="ios-trash-outline" @click.native="handleRemove(i)"></Icon>
            </div>
          </div>
          <Upload
            ref="upload"
            :on-success="handleSuccess"
            :show-upload-list="false"
            :format="['jpg','jpeg','png']"
            :max-size="2048"
            :on-format-error="handleFormatError"
            :on-exceeded-size="handleMaxSize"
            :before-upload="handleBeforeUpload"
            multiple
            :headers = "header"
            type="drag"
            action="http://localhost:8083/uploadPhoto"
            style="display: inline-block;width:58px;">
            <div style="width: 58px;height:58px;line-height: 58px;">
                <Icon type="ios-camera" size="20"></Icon>
            </div>
          </Upload>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="text" size="large" @click="cancel">取消</Button>
        <Button type="primary" size="large"  @click="ok">确定</Button>
      </div>
    </Modal>
    <Modal title="View Image" v-model="visible">
      <img :src="'http://localhost:8083/uploaded/' + viewUrl " v-if="visible" style="width: 100%">
    </Modal>
  </div>
</template>
<script>
import expandRow from './table-expand.vue'
import { getToken } from '@/libs/util'
import { getAchievement, updateAchievement, deletePhotos, addAchievement, deleteAchievement, searchaChievement } from '@/myapi/achievementManager'
export default {
  components: { expandRow },
  data () {
    const validateTitle = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入名称'))
      } else {
        callback()
      }
    }
    const validateMember = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入成员'))
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
    // const validateOrdering = (rule, value, callback) => {
    //   if (value === '') {
    //     callback(new Error('请输入名称'))
    //   } else {
    //     callback()
    //   }
    // }
    const validateType_id = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请选中类型'))
      } else {
        callback()
      }
    }
    return {
      searchValue: '',
      currentPage: 1,
      total: 0,
      visibleUpdate: false,
      visibleAdd: false,
      visible: false,
      uploadList: [],
      viewUrl: '',
      tomethod: '',
      formAdd: {
        id: '', // 为了存储图片，对应id
        title: '',
        member: '',
        content: '',
        photoList: [],
        // acquisitiondate : '', // 获取时间
        time: '', // data + time = acquisitiondate
        date: '',
        ordering: '10', // 显示权重
        toshow: true, // 是否显示
        type_id: '' // 类型ID
      },
      formItem: {
        id: '', // 为了存储图片，对应id
        title: '',
        member: '',
        content: '',
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
      columns: [
        {
          type: 'expand',
          width: 50,
          render: (h, params) => {
            console.log(params.row)
            return h(expandRow, {
              props: {
                row: params.row
              }
            })
          }
        },
        {
          title: '成果名称',
          key: 'title'
        },
        {
          title: '成员',
          key: 'member'
        },
        {
          title: '获取时间',
          key: 'acquisitiondate',
          render: (h, params) => {
            return h('div', params.row.acquisitiondate.slice(0, 10))
          }
        },
        {
          title: '是否对外展示',
          key: 'action',
          width: 150,
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
                'on-change': function () {
                  // _this.functionFun() // 方法自定义
                }
              }
            })
          }
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
      data1: [],
      ruleValid: {
        title: [
          { validator: validateTitle, trigger: 'blur' }
        ],
        member: [
          { validator: validateMember, trigger: 'blur' }
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
        // ordering: [
        //   { validator: validateOrdering, trigger: 'blur' }
        // ],
        // toshow: [
        //   { validator: validateToshow, trigger: 'blur' }
        // ],
        type_id: [
          { validator: validateType_id, trigger: 'blur' }
        ]
      },
      header: {
        Authorization: getToken()
      }
    }
  },
  methods: {
    changePage (index) {
      getAchievement(10, index, 'achievements').then(res => {
        let data = res.data.page
        this.data1 = []
        if (res.data.resultCode === '200') {
          data.list.forEach(element => {
            this.data1.push(element)
          })
          this.total = data.total
          this.currentPage = data.pageNum
        }
      })
    },
    mysearch () {
      searchaChievement(this.searchValue).then(res => {
        if (res.data.resultCode === 200 && !(res.data.achievements.length === 0)) {
          this.data1 = []
          res.data.achievements.forEach(item => {
            this.data1.push(item)
          })
        } else {
          this.$Message.info('该成果名不存在')
        }
      })
    },
    show (index) {
      this.visibleUpdate = true
      this.tomethod = 'update'
      this.formItem.id = this.data1[index].id
      this.formItem.title = this.data1[index].title
      this.formItem.member = this.data1[index].member
      this.formItem.toshow = this.data1[index].toshow
      this.formItem.content = this.data1[index].content
      this.formItem.date = this.data1[index].acquisitiondate.substring(0, 10)
      this.formItem.time = this.data1[index].acquisitiondate.substring(11, 19)
      this.formItem.ordering = this.data1[index].ordering
      this.formItem.type_id = this.data1[index].type_id
      this.formItem.photoList = []
      this.data1[index].photoList.forEach(item => {
        this.formItem.photoList.push(item)
      })
    },
    remove (index) {
      deleteAchievement(this.data1[index].id).then(res => {
        console.log(res.data.resultCode === 200)
        if (res.data.resultCode === 200) {
          this.$Message.info(res.data.message)
          // this.tableData1.splice(index, 1)
          this.changePage(this.currentPage)
        } else {
          this.$Message.info('删除成果失败')
        }
      })
    },
    ok () {
      // console.log(this.tomethod)
      if (this.tomethod === 'add') {
        this.$refs['formAdd'].validate(vaild => {
          if (vaild) {
            this.uploadList.forEach(item => {
              this.formAdd.photoList.push(item)
            })
            addAchievement(this.formAdd).then(res => {
              if (res.data.resultCode === 200) {
                this.data1 = []
                getAchievement(10, this.currentPage, 'achievements').then(res1 => {
                  let data = res1.data.page
                  if (res1.data.resultCode === '200') {
                    data.list.forEach(element => {
                      this.data1.push(element)
                    })
                    this.total = data.total
                    this.currentPage = data.pageNum
                  }
                })
                this.$Message.info(res.data.message)
              }
            })
            this.visibleAdd = false
            this.uploadList = []
          } else {
            return false
          }
        })
      } else if (this.tomethod === 'update') {
        this.$refs['formItem'].validate(vaild => {
          if (vaild) {
            this.uploadList.forEach(item => {
              this.formItem.photoList.push(item)
            })
            updateAchievement(this.formItem).then(res => {
              if (res.data.resultCode === 200) {
                this.data1 = []
                getAchievement(10, this.currentPage, 'achievements').then(res1 => {
                  let data = res1.data.page
                  if (res1.data.resultCode === '200') {
                    data.list.forEach(element => {
                      this.data1.push(element)
                    })
                    this.total = data.total
                    this.currentPage = data.pageNum
                  }
                })
                this.$Message.info(res.data.message)
              }
            })
            this.visibleUpdate = false
            this.uploadList = []
          } else {
            return false
          }
        })
      }
      // this.formItem.photoList.push(this.uploadList)
      // console.log(this.formItem.photoList)
    },
    cancel () {
      deletePhotos(this.uploadList).then(res => {
        if (res.data.warn) {
          // console.log(res.data.warn)
          this.$Message.warning(res.data.message)
        }
      })
      this.visibleAdd = false
      this.visibleUpdate = false
      this.uploadList = []
    },
    add () {
      this.visibleAdd = true
      this.tomethod = 'add'
    },
    handleView (url) {
      this.viewUrl = url
      this.visible = true
    },
    handleRemove (file) {
      const fileList = this.$refs.upload.fileList
      this.$refs.upload.fileList.splice(fileList.indexOf(file), 1)
    },
    handleSuccess (res, file) {
      this.uploadList.push({ 'url': res.url })
      // console.log(this.uploadList)
    },
    handleFormatError (event, file) {
      this.$Notice.warning({
        title: '格式错误',
        desc: '文件格式： ' + file.name + ' 不是正确的格式，请选中jpg、jpeg、png等格式图片。'
      })
    },
    handleMaxSize (file) {
      this.$Notice.warning({
        title: '图片过大',
        desc: '文件最大为2m.'
      })
    },
    handleBeforeUpload () {
      const check = this.uploadList.length < 10
      if (!check) {
        this.$Notice.warning({
          title: '最多上传10张图片.'
        })
      }
      return check
    }
  },
  created () {
    getAchievement(10, this.currentPage, 'achievements').then(res => {
      let data = res.data.page
      if (res.data.resultCode === '200') {
        data.list.forEach(element => {
          this.data1.push(element)
        })
        this.total = data.total
        this.currentPage = data.pageNum
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
