<template>
  <div>
    <Button type="primary" class="mybutton" @click="add">新增文章</Button>
    <Input search placeholder="请输入文章名称" class="search" v-model="searchValue" @on-search="mysearch">
      <Icon type="ios-search" slot="suffix" />
    </Input>
    <Table :columns="columns" :data="data1"></Table>
    <div style="margin: 10px;overflow: hidden">
      <div style="float: right;">
        <Page :total="total" :current="currentPage" @on-change="changePage"></Page>
      </div>
    </div>
    <Modal title="新增文章" v-model="visibleAdd" >
      <editor ref="myeditor" @changeVisible="changeVisible" :tomethod="addmethod"></editor>
      <div slot="footer">
        <Button type="text" size="large" @click="cancel">取消</Button>
        <Button type="primary" size="large"  @click="ok">确定</Button>
      </div>
    </Modal>
    <Modal title="编辑文章" v-model="visibleUpdate" >
      <editor ref="myeditor" @changeVisible="changeVisible" @updatePage="updatePage" :editValue="editValue" :tomethod="updatemethod"></editor>
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
import expandRow from './essay-expand.vue'
import editor from './editor.vue'
import { getEssays, deleteEssay, searchEssays } from '@/myapi/essayManager'
import { getAllType } from '@/myapi/typeManager'
export default {
  components: {
    expandRow,
    editor
  },
  data () {
    return {
      updatemethod: 'update',
      addmethod: 'add',
      searchValue: '',
      currentPage: 1,
      total: 0,
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
      }
    }
  },
  methods: {
    changePage (index) {
      getEssays(10, index, 'activity').then(res => {
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
    updatePage () {
      getEssays(10, this.currentPage, 'activity').then(res => {
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
      searchEssays(this.searchValue).then(res => {
        if (res.data.resultCode === 200 && !(res.data.essays.length === 0)) {
          this.data1 = []
          res.data.essays.forEach(item => {
            this.data1.push(item)
          })
        } else {
          this.$Message.info('该文章名不存在')
        }
      })
    },
    show (index) {
      console.log(this.data1[index].location)
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
      this.data1[index].photoList.forEach(item => {
        this.editValue.photoList.push(item)
      })
    },
    remove (index) {
      deleteEssay(this.data1[index].id).then(res => {
        if (res.data.resultCode === 200) {
          this.$Message.info(res.data.message)
          // this.tableData1.splice(index, 1)
          this.changePage(this.currentPage)
        } else {
          this.$Message.info('删除文章失败')
        }
      })
    },
    add () {
      this.visibleAdd = true
    },
    cancel () {
      this.visibleAdd = false
      this.visibleUpdate = false
    },
    ok () {
      this.$refs.myeditor.handleSubmit()
    },
    changeVisible (bol) {
      this.visibleAdd = bol
      this.visibleUpdate = bol
    }
  },
  created () {
    getEssays(10, 1, 'activity').then(res => {
      let data = res.data.page
      if (res.data.resultCode === '200') {
        data.list.forEach(element => {
          this.data1.push(element)
        })
        this.total = data.total
        this.currentPage = data.pageNum
      }
    })
    getAllType().then(res => {
      let data = res.data
      typeList = data // 添加文章获取类型
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
