<template>
  <div>
    <Row :gutter="20" style="margin-left: 1px; margin-right: 100px;">
      <div v-if="accessCollege === '0'">
      <slot>学院范围：</slot><Select v-model="college_model" style="width:100px;margin-left: 10px;margin-right: 10px" transfer-class-name="selectClass" @on-change="changeCollege">
        <Option v-for="item in collegeList" :value="item.college_id" :key="item.college_id" >{{ item.college_name }}</Option>
      </Select>
      <br/>
      <br/>
      </div>
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
          <chart-attendance-pie style="height: 300px;" :college_id="college_id" :value="pieData" text="学术活动"></chart-attendance-pie>
        </Card>
      </i-col>
      <i-col :md="24" :lg="8" style="margin-bottom: 20px;">
        <Card shadow>
          <achievement-pie style="height: 300px;" :college_id="college_id" :value="achievementPieData" text="成果"></achievement-pie>
        </Card>
      </i-col>
    </Row>
    <!-- <Row>
      <Card shadow>
        <lineChart style="height: 310px;"/>
      </Card>
    </Row> -->
  </div>
</template>

<script>
import InforCard from '_c/info-card'
import CountTo from '_c/count-to'
import { ChartAttendancePie, ChartBar, achievementPie } from '_c/charts'
import { getAllCollege } from '@/myapi/collegeManager'
// import lineChart from './lineChart.vue'
import { getInforCardData, getEssayPieData, getAchievementPieData } from '@/myapi/analysis'
export default {
  name: 'home',
  components: {
    InforCard,
    CountTo,
    ChartAttendancePie,
    ChartBar,
    achievementPie
    // lineChart
  },
  data () {
    return {
      model: '今日之内',
      college_model: '0',
      list: [
        {
          value: '今日之内',
          label: '今日之内'
        },
        {
          value: '一周之内',
          label: '一周之内'
        },
        {
          value: '一个月之内',
          label: '一个月之内'
        }
      ],
      accessCollege: this.$store.getters.getCollege_id,
      collegeList: [{
        college_name: '全部学院',
        college_id: '0'
      }],
      college_id: this.$store.getters.getCollege_id,
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
      pieData: [],
      achievementPieData: []
    }
  },
  mounted () {
    //
  },
  methods: {
    changeoption (value) {
      let today = this.getToday()
      if (value === '今日之内') {
        let aftdate = this.getAfterDay()
        this._getInforCardData(today, aftdate)
        this._getAttendanceNumPieData(today, aftdate)
        this._getAchievementPieData(today, aftdate)
        this.begTime = today
        this.endTime = aftdate
      } else if (value === '一周之内') {
        let prevweek = this.getPrevWeek()
        this._getInforCardData(prevweek, today)
        this._getAttendanceNumPieData(prevweek, today)
        this._getAchievementPieData(prevweek, today)
        this.begTime = prevweek
        this.endTime = today
      } else if (value === '一个月之内') {
        let prevMonth = this.getPrevMonth()
        this._getInforCardData(prevMonth, today)
        this._getAttendanceNumPieData(prevMonth, today)
        this._getAchievementPieData(prevMonth, today)
        this.begTime = prevMonth
        this.endTime = today
      }
    },
    changeCollege (value) {
      this.college_id = value
      this._getInforCardData(this.begTime, this.endTime)
      this._getAttendanceNumPieData(this.begTime, this.endTime)
      this._getAchievementPieData(this.begTime, this.endTime)
    },
    changeDate () {
      if (this.endTime > this.begTime) {
        this._getInforCardData(this.begTime, this.endTime)
        this._getAttendanceNumPieData(this.begTime, this.endTime)
        this._getAchievementPieData(this.begTime, this.endTime)
      } else {
        this.$Message.warning('结束日期要大于开始日期')
      }
    },
    _getInforCardData (begTime, endTime) {
      getInforCardData(this.college_id, begTime, endTime).then(res => {
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
    _getAttendanceNumPieData (begTime, endTime) {
      getEssayPieData(this.college_id, begTime, endTime).then(res => {
        let data = res.data
        this.pieData.splice(0, this.pieData.length)
        data.forEach(element => {
          this.pieData.push({ 'value': element.value, 'name': element.name, 'tip': element.tip })
        })
      })
    },
    _getAchievementPieData (begTime, endTime) {
      getAchievementPieData(this.college_id, begTime, endTime).then(res => {
        let data = res.data
        this.achievementPieData.splice(0, this.achievementPieData.length)
        data.forEach(element => {
          this.achievementPieData.push({ 'value': element.value, 'name': element.name, 'tip': element.tip })
        })
      })
    },
    changeBegTime (e) {
      this.begTime = e
    },
    changeEndTime (e) {
      this.endTime = e
      if (this.endTime <= this.begTime) {
        this.$Message.warning('结束日期要大于开始日期')
      }
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
    this.begTime = this.getToday()
    this.endTime = this.getAfterDay()
    getInforCardData(this.college_id, this.begTime, this.endTime).then(res => {
      let data = res.data
      if (data.resultCode === 200) {
        let i = 0
        res.data.list.forEach(element => {
          this.inforCardData[i].count = element
          i = i + 1
        })
      }
    })
    getAllCollege().then(res => {
      let data = res.data
      data.collegeList.forEach(item => {
        this.collegeList.push(item)
      })
    })
    // getPieData(thedate, aftdate).then(res => {
    //   let data = res.data
    //   data.forEach(item => {
    //     this.pieData.push({ 'value': item.value, 'name': item.name })
    //   })
    // })
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
