<template>
  <div>
    <Row :gutter="20" style="margin-left: 1px; margin-right: 100px;">
      <slot>数据分析时间范围：</slot><Select v-model="model" style="width:100px;margin-left: 10px;margin-right: 10px" transfer-class-name="selectClass" @on-change="changeoption">
        <Option v-for="item in list" :value="item.value" :key="item.value" >{{ item.label }}</Option>
      </Select>
      <slot >开始时间：</slot><TimePicker :value="begTime" format="yyyy-MM-dd" placeholder="请选择时间" style="width: 168px;margin-right: 10px"></TimePicker>
      <slot >结束时间：</slot><TimePicker :value="endTime" format="yyyy-MM-dd" placeholder="请选择时间" style="width: 168px"></TimePicker>
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
        // {
        //   value: '其他',
        //   label: '其他'
        // }
      ],
      begTime: '',
      endTime: '',
      inforCardData: [
        { title: '总阅读量', icon: 'md-locate', count: 232, color: '#19be6b' },
        { title: '新增文章', icon: 'md-add', count: 803, color: '#2d8cf0' },
        { title: '举办活动', icon: 'md-walk', count: 142, color: '#ff9900' }
        // { title: '分享统计', icon: 'md-share', count: 657, color: '#ed3f14' },
        // { title: '新增互动', icon: 'md-chatbubbles', count: 12, color: '#E46CBB' },
        // { title: '新增页面', icon: 'md-map', count: 14, color: '#9A66E4' }
      ],
      pieData: [
        { value: 335, name: '直接访问' },
        { value: 310, name: '邮件营销' },
        { value: 234, name: '联盟广告' },
        { value: 135, name: '视频广告' },
        { value: 1548, name: '搜索引擎' }
      ]
      // barData: {
      //   Mon: 13253,
      //   Tue: 34235,
      //   Wed: 26321,
      //   Thu: 12340,
      //   Fri: 24643,
      //   Sat: 1322,
      //   Sun: 1324
      // }
    }
  },
  mounted () {
    //
  },
  methods: {
    changeoption (value) {
      console.log(value)
      if (value === '其他') {

      }
    },
    timeChange () {

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
    console.log(this.getToday())
    console.log(this.getPrevMonth())
    console.log(this.getPrevWeek())
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
