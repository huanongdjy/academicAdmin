<template>
  <div>
    <Button type="primary" class="mybutton" @click="addAchievement">新增成果</Button>
    <Table :columns="columns" :data="data1"></Table>
    <div style="margin: 10px;overflow: hidden">
      <div style="float: right;">
        <Page :total="total" :current="currentPage" @on-change="changePage"></Page>
      </div>
    </div>
    <Modal title="成果信息编辑" v-model="visibleUpdate" @on-ok="ok" @on-cancel="cancel">
      <Form :model="formItem" :label-width="80">
        <FormItem label="成果名称">
          <Input v-model="formItem.title" placeholder="Enter something..."></Input>
        </FormItem>
        <FormItem label="成员">
          <Input v-model="formItem.member" placeholder="Enter something..."></Input>
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
              <DatePicker type="date" placeholder="Select date" v-model="formItem.date"></DatePicker>
            </Col>
            <Col span="1" style="text-align: center" class="mycolum">-</Col>
            <Col span="11">
              <TimePicker type="time" placeholder="Select time" v-model="formItem.time"></TimePicker>
            </Col>
          </Row>
        </FormItem>
        <FormItem label="类型">
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
        <FormItem label="内容">
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
          <div class="demo-upload-list" v-for="item in uploadList" :key="item.url">
            <img :src="'http://localhost:8083/uploaded/'+ item.url">
            <div class="demo-upload-list-cover">
              <Icon type="ios-eye-outline" @click.native="handleView(item.url)"></Icon>
              <Icon type="ios-trash-outline" @click.native="handleRemove(item)"></Icon>
            </div>
          </div>
          <Upload
            ref="upload"
            :on-success="handleSuccess"
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
    </Modal>
    <Modal title="View Image" v-model="visible">
      <img :src="'http://localhost:8083/uploaded/' + viewUrl " v-if="visible" style="width: 100%">
    </Modal>
  </div>
</template>
<script>
import expandRow from './table-expand.vue'
import { getAchievement, updateAchievement, deletePhotos } from '@/myapi/achievementManager'
export default {
  components: { expandRow },
  data () {
    return {
      currentPage: 1,
      total: 0,
      visibleUpdate: false,
      visible: false,
      uploadList: [],
      viewUrl: '',
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
      data1: []
    }
  },
  methods: {
    changePage (index) {
      getAchievement(10, index, 'achievements').then(res => {
        let data = res.data.page
        if (res.data.resultCode === '200') {
          data.list.forEach(element => {
            this.data1.push(element)
          })
          this.total = data.total
          this.currentPage = data.pageNum
        }
      })
    },
    show (index) {
      this.visibleUpdate = true
      console.log(this.data1[index])
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
        console.log(item)
        this.formItem.photoList.push(item)
      })
      console.log('this.formItem.photoList')
      console.log(this.formItem.photoList)
    },
    ok () {
      this.uploadList.forEach(item => {
        this.formItem.photoList.push(item)
      })
      // this.formItem.photoList.push(this.uploadList)
      // console.log(this.formItem.photoList)
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
      this.uploadList = []
    },
    cancel () {
      deletePhotos(this.uploadList).then(res => {
        if (res.data.warn) {
          console.log(res.data.warn)
          this.$Message.warning(res.data.message)
        }
      })
      this.uploadList = []
    },
    addAchievement () {
      console.log('xin')
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
      console.log(this.uploadList)
    },
    handleFormatError (event, file) {
      console.log('handleFormatError')
      console.log(file.name)
      console.log(file.url)
      this.$Notice.warning({
        title: 'The file format is incorrect',
        desc: 'File format of ' + file.name + ' is incorrect, please select jpg or png.'
      })
    },
    handleMaxSize (file) {
      console.log('handleMaxSize' + file)
      this.$Notice.warning({
        title: 'Exceeding file size limit',
        desc: 'File  ' + file.name + ' is too large, no more than 2M.'
      })
    },
    handleBeforeUpload () {
      const check = this.uploadList.length < 5
      if (!check) {
        this.$Notice.warning({
          title: 'Up to five pictures can be uploaded.'
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
</style>
