<template>
<Form ref="editValue" :label-width="100" :model="editValue">
  <FormItem>
    <quillEditor v-model="val"
      ref="myQuillEditor"
      :options="editorOption">
    </quillEditor>
  </FormItem>
  <FormItem>
    <Button type="primary" @click="handleSubmit('formValidate')">提交</Button>
    <Button @click="handleReset('formValidate')" style="margin-left: 8px">重置</Button>
  </FormItem>
</Form>
</template>

<script>
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
// import { Script } from "vm"
import { quillEditor, Quill } from 'vue-quill-editor'
import { container, ImageExtend, QuillWatch } from 'quill-image-extend-module'
import { getToken } from '@/libs/util'
Quill.register('modules/ImageExtend', ImageExtend)
export default {
  components: {
    quillEditor
  },
  data () {
    return {
      val: '',
      editValue: {},
      token: getToken(),
      editorOption: {
        modules: {
          ImageExtend: {
            loading: true,
            name: 'file',
            size: 2,
            action: 'http://localhost:8083/uploadPhoto',
            response: (res) => {
              return 'http://localhost:8083/uploaded/' + res.url
            },
            headers: (xhr) => {
              xhr.withCredentials = true
              xhr.setRequestHeader('Authorization', this.token)
            }
          },
          toolbar: {
            container: container,
            handlers: {
              'image': function () {
                QuillWatch.emit(this.quill.id)
              }
            }
          }
        }
      }
    }
  }
}
</Script>
