<template>
  <div>
    <Button type="primary" class="mybutton" @click="add">新增文章</Button>
    <Input search placeholder="请输入成果名称" class="search" v-model="searchValue" @on-search="mysearch">
      <Icon type="ios-search" slot="suffix" />
    </Input>
    <Table :columns="columns" :data="data1"></Table>
    <div style="margin: 10px;overflow: hidden">
      <div style="float: right;">
        <Page :total="total" :current="currentPage" @on-change="changePage"></Page>
      </div>
    </div>
    <Modal title="新增文章" v-model="visibleAdd" >
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
import { getEssays, deleteEssay, searchaEssays } from '@/myapi/essayManager'
export default {
  components: { expandRow },
  data () {
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
          title: '名称',
          key: 'title'
        },
        {
          title: '举办人',
          key: 'member'
        },
        {
          title: '举办时间',
          key: 'acquisitiondate',
          render: (h, params) => {
            return h('div', params.row.acquisitiondate.slice(0, 10))
          }
        },
        {
          title: '地点',
          key: 'member'
        },
        {
          title: '可容纳人数/实际出席人数',
          key: 'member',
          render: (h, params) => {
            return h('div', params.row.acquisitiondate.slice(0, 10))
          }
        },
        {
          title: '所需资金',
          key: 'member'
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
    mysearch () {
      searchaEssays(this.searchValue).then(res => {
        console.log(res)
        if (res.data.resultCode === 200) {
          this.tableData1 = []
          this.tableData1.push(res.data.user)
        } else {
          this.$Message.info('该文章名不存在')
        }
      })
    },
    // show (index) {
    //   this.visibleUpdate = true
    //   this.tomethod = 'update'
    //   this.formItem.id = this.data1[index].id
    //   this.formItem.title = this.data1[index].title
    //   this.formItem.member = this.data1[index].member
    //   this.formItem.toshow = this.data1[index].toshow
    //   this.formItem.content = this.data1[index].content
    //   this.formItem.date = this.data1[index].acquisitiondate.substring(0, 10)
    //   this.formItem.time = this.data1[index].acquisitiondate.substring(11, 19)
    //   this.formItem.ordering = this.data1[index].ordering
    //   this.formItem.type_id = this.data1[index].type_id
    //   this.formItem.photoList = []
    //   this.data1[index].photoList.forEach(item => {
    //     this.formItem.photoList.push(item)
    //   })
    // },
    remove (index) {
      deleteEssay(this.data1[index].id).then(res => {
        console.log(res.data.resultCode === 200)
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
    },
    cancel () {
    },
    ok () {
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
