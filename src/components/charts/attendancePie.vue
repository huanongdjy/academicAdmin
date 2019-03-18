<template>
  <div ref="dom" class="charts chart-pie"></div>
</template>

<script>
import echarts from 'echarts'
import tdTheme from './theme.json'
import { on, off } from '@/libs/tools'
import { getEssayPieData } from '@/myapi/analysis'
echarts.registerTheme('tdTheme', tdTheme)
export default {
  name: 'ChartPie',
  props: {
    value: Array,
    text: String,
    subtext: String
  },
  data () {
    return {
      dom: null,
      tip: ''
    }
  },
  methods: {
    resize () {
      this.dom.resize()
    },
    getToday () {
      var nowdate = new Date()
      // 获取系统今日日期
      var y = nowdate.getFullYear()
      var m = nowdate.getMonth() + 1
      var d = nowdate.getDate()
      m = m < 10 ? '0' + m : m
      d = d < 10 ? ('0' + d) : d
      return y + '-' + m + '-' + d
    },
    getAfterDay () {
      var nowdate = new Date()
      // 获取系统今日日期
      var y = nowdate.getFullYear()
      var m = nowdate.getMonth() + 1
      var d = nowdate.getDate() + 1
      m = m < 10 ? '0' + m : m
      d = d < 10 ? ('0' + d) : d
      return y + '-' + m + '-' + d
    },
    setOption () {
      let option = {}
      let legend = []
      this.dom.hideLoading()
      legend = this.value.map(_ => _.name)// 左上角值
      option = {
        title: {
          text: this.text,
          subtext: this.subtext,
          x: 'center'
        },
        tooltip: {
          trigger: 'item',
          formatter: function (params) {
            return params.data.tip
          }
        },
        legend: {
          orient: 'vertical',
          left: 'left',
          data: legend
        },
        series: [
          {
            type: 'pie',
            radius: '55%',
            center: ['50%', '60%'],
            data: this.value,
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      }
      this.dom = echarts.init(this.$refs.dom, 'tdTheme')
      this.dom.setOption(option)
      on(window, 'resize', this.resize)
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.dom = echarts.init(this.$refs.dom, 'tdTheme')
      this.dom.showLoading()
      // let legend = []
      // let option = {}
      let thedate = this.getToday()
      let aftdate = this.getAfterDay()
      getEssayPieData(thedate, aftdate).then(res => {
        setTimeout(() => {
          let data = res.data
          this.value.splice(0, this.value.length)
          data.forEach(item => {
            this.value.push({ 'value': item.value, 'name': item.name, 'tip': item.tip })
          })
          this.setOption(this.value)
        }, 1000)
      })
    })
  },
  // computed: {
  //   valuechange () {
  //     return this.value
  //   }
  // },
  watch: {
    value: {
      handler (newValue, oldValue) {
        if (this.dom) {
          if (newValue) {
            this.setOption()
          } else {
            this.setOption()
          }
        }
      },
      immediate: true,
      deep: true
    }
  },
  beforeDestroy () {
    off(window, 'resize', this.resize)
  }
  // created () {
  //   console.log('created')
  //   console.log(this.value)
  // }
}
</script>
