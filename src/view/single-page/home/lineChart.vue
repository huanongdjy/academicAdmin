<template>
    <div ref="dom"></div>
</template>

<script>
import echarts from 'echarts'
import { on, off } from '@/libs/tools'
import { getLineChart } from '@/myapi/analysis'
export default {
  name: 'serviceRequests',
  data () {
    return {
      dom: null
    }
  },
  methods: {
    resize () {
      this.dom.resize()
    }
  },
  mounted () {
    const option = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          label: {
            backgroundColor: '#6a7985'
          }
        }
      },
      grid: {
        top: '3%',
        left: '1.2%',
        right: '1%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: [
        {
          type: 'category',
          boundaryGap: false,
          data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
        }
      ],
      yAxis: [
        {
          type: 'value'
        }
      ],
      series: []
    }
    this.$nextTick(() => {
      this.dom = echarts.init(this.$refs.dom)
      this.dom.showLoading()
      var nowdate = new Date()
      // 获取系统今日日期
      var y = nowdate.getFullYear()
      var m = nowdate.getMonth() + 1
      var d = nowdate.getDate() + 1
      m = m < 10 ? '0' + m : m
      d = d < 10 ? ('0' + d) : d
      var time0 = y + '-' + m + '-' + (d - 7)
      var time1 = y + '-' + m + '-' + (d - 6)
      var time2 = y + '-' + m + '-' + (d - 5)
      var time3 = y + '-' + m + '-' + (d - 4)
      var time4 = y + '-' + m + '-' + (d - 3)
      var time5 = y + '-' + m + '-' + (d - 2)
      var time6 = y + '-' + m + '-' + (d - 1)
      var time7 = y + '-' + m + '-' + d
      getLineChart(time0, time1, time2, time3, time4, time5, time6, time7).then(res => {
        setTimeout(() => {
          res.data.forEach(item => {
            // item.data.forEach(element => {
            //   option.series.push({
            //     'data': element
            //   })
            // })
            option.series.push({
              'data': item.data,
              'type': 'line',
              'stack': '总量',
              'areaStyle': {
                'normal': {
                  'color': '#2d8cf0'
                }
              },
              'name': item.name
            })
          })
          this.dom.hideLoading()
          this.dom.setOption(option)
          on(window, 'resize', this.resize)
        }, 2000)
      })
    })
  },
  beforeDestroy () {
    off(window, 'resize', this.resize)
  }
}
</script>
