<template>
  <div>
    <Table :columns="columns" :data="data1"></Table>
    <div style="margin: 10px;overflow: hidden">
      <div style="float: right;">
        <Page :total="total" :current="currentPage" @on-change="changePage"></Page>
      </div>
    </div>
  </div>
</template>
<script>
import expandRow from './table-expand.vue'
import { getAchievement } from '@/myapi/achievementManager'
export default {
  components: { expandRow },
  data () {
    return {
      currentPage: 1,
      total: 0,
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
