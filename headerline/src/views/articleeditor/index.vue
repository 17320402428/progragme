<!-- 修改文章 -->
<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>修改文章</span>
      </div>
      <el-form ref="form" :model="editorForm" label-width="120px" :rules="edorRules">
        <el-form-item label="文章标题：" prop="title">
          <el-input
            v-model="editorForm.title"
            placeholder="文章名称"
            width="60px;"
          ></el-input>
        </el-form-item>
        <el-form-item label="文章内容：" prop="content">
          <quill-editor v-model="editorForm.content" ref="myQuillEditor">
          </quill-editor>
        </el-form-item>
        <el-form-item label="文章封面：">
          <el-radio-group v-model="editorForm.cover.type">
            <el-radio-button :label="-1">自动</el-radio-button>
            <el-radio-button :label="0">无图</el-radio-button>
            <el-radio-button :label="1">单图</el-radio-button>
            <el-radio-button :label="3">三图</el-radio-button>
          </el-radio-group>
        </el-form-item>
          <channel-com @slt="selectHandler" :cid='editorForm.channel_id'></channel-com>
        <el-form-item>
          <el-button type="primary" @click="editarticle(false)">修改</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
// 这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
// 例如：import 《组件名称》 from '《组件路径》';
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import { quillEditor } from 'vue-quill-editor'
import ChannelCom from '@/components/channel.vue'

export default {
  name: 'editorAtricle',
  // import引入的组件需要注入到对象中才能使用
  components: {
    quillEditor,
    ChannelCom

  },
  data () {
    // 这里存放数据
    return {
      channelList: [], // 文章频道
      editorForm: {
        title: '', // 标题
        content: '', // 内容
        cover: {
          type: 1, // 几图
          images: [] // 数组存放路径(需为数组)
        },
        channel_id: '' // 文章所属频道
      },
      edorRules: {
        title: [
          { required: true, trigger: 'blur', message: '标题不可以为空' },
          {
            min: 5,
            max: 30,
            message: '标题长度介于5-30个字符'
          }
        ],
        content: [
          { required: true, trigger: 'blur', message: '内容不可以为空' }
        ],
        channel_id: [
          { required: true, trigger: 'blur', message: '频道不可以为空' }
        ]
      }
    }
  },
  // 监听属性 类似于data概念
  computed: {
  },
  // 监控data中的数据变化
  watch: {},
  // 方法集合
  methods: {
    // 获取对应文章
    editAtr () {
      this.$http.get(`/articles/${this.$route.params.eid}`)
        .then(res => {
          let data = res.data
          if (data.message === 'OK') {
            this.editorForm = data.data
          }
        })
        .catch(err => {
          return this.$message.error('获取文章失败' + err)
        })
    },
    // 修改文章
    editarticle (flag) {
      this.$refs.form.validate(validate => {
        if (validate) {
          this.$http.put(`articles/${this.$route.params.eid}`, this.editorForm, { params: { draft: flag } })
            .then(res => {
              this.$message.success('修改成功！')
              this.$router.push('/article')
            })
            .catch(err => {
              console.log('修改失败' + err)
            })
        }
      })
    },
    selectHandler (arg) {
      this.channel_id = arg
    }
  },
  // 生命周期 - 创建完成（可以访问当前this实例）
  created () {
    this.editAtr()
  }
}
</script>
<style lang="less" scoped>
//@import url(); 引入公共css类
.el-form-item /deep/ .ql-editor {
  height: 200px;
}
</style>
