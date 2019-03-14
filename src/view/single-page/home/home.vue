<template>
  <div>
    <Row :gutter="20" style="margin-left: 1px; margin-right: 100px;">
      <slot>数据分析时间范围：</slot><Select v-model="model" style="width:100px;margin-left: 10px;margin-right: 10px" transfer-class-name="selectClass" @on-change="changeoption">
        <Option v-for="item in list" :value="item.value" :key="item.value" >{{ item.label }}</Option>
      </Select>
      <slot >开始时间：</slot><DatePicker type="date" @on-change='changeBegTime' format="yyyy-MM-dd" placeholder="请选择时间" style="width: 168px;margin-right: 10px"></DatePicker>
      <slot >结束时间：</slot><DatePicker type="date" @on-change='changeEndTime' format="yyyy-MM-dd" placeholder="请选择时间" style="width: 168px"></DatePicker>
      <Button type="primary" @click="changeDate">确认</Button>
    </Row>
    <Row :gutter="20" style="margin-top: 10px;">
      <i-col :xs="12" :md="8" :lg="4" v-for="(infor, i) in inforCardData" :key="`infor-${i}`" style="height: 120px;padding-bottom: 10px;">
        <infor-card shadow :color="infor.color" :icon="infor.icon" :icon-size="36">
          <count-to :end="infor.count" count-class="count-style"/>
          <p>{{ infor.title }}</p>
        </infor-card>
      </i-col>
    </Row>
    <Row :gutter="20" style="margin-top: 10px;">
      <i-col :md="24" :lg="8" style="margin-bottom: 20px;">
        <Card shadow>
          <chart-pie style="height: 300px;" :value="pieData" text="活动"></chart-pie>
        </Card>
      </i-col>
      <i-col :md="24" :lg="8" style="margin-bottom: 20px;">
        <Card shadow>
          <chart-pie style="height: 300px;" :value="pieData" text="成果"></chart-pie>
        </Card>
      </i-col>
      <!-- <i-col :md="24" :lg="16" style="margin-bottom: 20px;">
        <Card shadow>
          <chart-bar style="height: 300px;" :value="barData" text="每周用户活跃量"/>
        </Card>
      </i-col> -->
    </Row>
    <Row>
      <Card shadow>
        <lineChart style="height: 310px;"/>
      </Card>
    </Row>
  </div>
</template>

<script>
import InforCard from '_c/info-card'
import CountTo from '_c/count-to'
import { ChartPie, ChartBar } from '_c/charts'
import lineChart from './lineChart.vue'
import { getInforCardData, getPieData } from '@/myapi/analysis'
export default {
  name: 'home',
  components: {
    InforCard,
    CountTo,
    ChartPie,
    ChartBar,
    lineChart
  },
  data () {
    return {
      model: '今日',
      list: [
        {
          value: '今日',
          label: '今日'
        },
        {
          value: '一周',
          label: '一周'
        },
        {
          value: '一个月',
          label: '一个月'
        }
      ],
      begTime: '12',
      endTime: '',
      inforCardData: [
        { title: '总阅读量', icon: 'md-locate', count: 0, color: '#19be6b' },
        { title: '新增成果', icon: 'md-add', count: 0, color: '#2d8cf0' },
        { title: '举办活动', icon: 'md-walk', count: 0, color: '#2d8cf0' },
        { title: '参加活动人数', icon: 'md-man', count: 0, color: '#2d8cf0' }
        // { title: '分享统计', icon: 'md-share', count: 657, color: '#ed3f14' },
        // { title: '新增互动', icon: 'md-chatbubbles', count: 12, color: '#E46CBB' },
        // { title: '新增页面', icon: 'md-map', count: 14, color: '#9A66E4' }
      ],
      pieData: []
    }
  },
  mounted () {
    //
  },
  methods: {
    changeoption (value) {
      console.log(value)
    },
    changeDate () {
      getPieData(this.begTime, this.endTime).then(res => {
        let data = res.data
        if (data.resultCode === 200) {
          let i = 0
          res.data.list.forEach(element => {
            this.inforCardData[i].count = element
            i = i + 1
          })
        }
      })
    },
    changeBegTime (e) {
      this.begTime = e
    },
    changeEndTime (e) {
      this.endTime = e
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
    getPrevMonth () {
      var nowdate = new Date()
      // 获取系统前一个月的时间
      var y = nowdate.getFullYear()
      var m = nowdate.getMonth()
      var d = nowdate.getDate()
      m = m < 10 ? '0' + m : m
      d = d < 10 ? ('0' + d) : d
      return y + '-' + m + '-' + d
    },
    getPrevWeek () {
      var nowdate = new Date()
      // 获取系统前一个星期的时间
      var y = nowdate.getFullYear()
      var m = nowdate.getMonth() + 1
      var d = nowdate.getDate() - 7
      m = m < 10 ? '0' + m : m
      d = d < 10 ? ('0' + d) : d
      return y + '-' + m + '-' + d
    }
  },
  created () {
    let thedate = this.getToday()
    let aftdate = this.getAfterDay()
    getInforCardData(thedate, aftdate).then(res => {
      let data = res.data
      if (data.resultCode === 200) {
        let i = 0
        res.data.list.forEach(element => {
          this.inforCardData[i].count = element
          i = i + 1
        })
      }
    })
    getPieData(thedate, aftdate).then(res => {
      let data = res.data
      data.forEach(item => {
        this.pieData.push({ 'value': item.value, 'name': item.name })
      })
      console.log(this.pieData)
    })
  }
}
</script>

<style lang="less">
.count-style{
  font-size: 50px;
}
.selectClass{
  color: rgb(0, 0, 0);
}
</style>
