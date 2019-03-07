<style scoped>
  .expand-row{
    margin-bottom: 16px;
  }
</style>
<template>
  <div>
    <Row>
      <Col span="12">
        <span class="expand-key">发表时间: </span>
        <span class="expand-value">{{ row.summary }}</span>
      </Col>
      <Col span="12">
        <span class="expand-key">阅读量: </span>
        <span class="expand-value">{{ row.summary }}</span>
      </Col>
    </Row>
    <Row class="expand-row">
      <Col span="24">
        <span class="expand-key">摘要: </span>
        <span class="expand-value">{{ row.summary }}</span>
      </Col>
    </Row>
    <Row class="expand-row">
      <Col span="24">
        <span class="expand-key">内容: </span>
        <span class="expand-value">{{ row.content }}</span>
      </Col>
    </Row>
  </div>
</template>
<script>
export default {
  props: {
    row: Object
  },
  data () {
    return {
    }
  },
  methods: {
    // handleSuccess (res, file) {
    //   console.log('handleFormatError' + file)
    //   file.url = 'https://o5wwk8baw.qnssl.com/7eb99afb9d5f317c912f08b5212fd69a/avatar'
    //   file.name = '7eb99afb9d5f317c912f08b5212fd69a'
    // },
    // handleFormatError (file) {
    //   console.log('handleFormatError' + file)
    //   this.$Notice.warning({
    //     title: 'The file format is incorrect',
    //     desc: 'File format of ' + file.name + ' is incorrect, please select jpg or png.'
    //   })
    // },
    // handleMaxSize (file) {
    //   console.log('handleMaxSize' + file)
    //   this.$Notice.warning({
    //     title: 'Exceeding file size limit',
    //     desc: 'File  ' + file.name + ' is too large, no more than 2M.'
    //   })
    // },
    // handleBeforeUpload () {
    //   const check = this.uploadList.length < 5
    //   if (!check) {
    //     this.$Notice.warning({
    //       title: 'Up to five pictures can be uploaded.'
    //     })
    //   }
    //   return check
    // }
  }
}
</script>

<style>
.demo-upload-list{
  display: inline-block;
  width: 60px;
  height: 60px;
  text-align: center;
  line-height: 60px;
  border: 1px solid transparent;
  border-radius: 4px;
  overflow: hidden;
  background: #fff;
  position: relative;
  box-shadow: 0 1px 1px rgba(0,0,0,.2);
  margin-right: 4px
}
.demo-upload-list img{
  width: 100%;
  height: 100%
}
.demo-upload-list-cover{
  display: none;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0,0,0,.6)
}
.demo-upload-list:hover .demo-upload-list-cover{
  display: block;
}
.demo-upload-list-cover i{
  color: #fff;
  font-size: 20px;
  cursor: pointer;
  margin: 0 2px
}
</style>
