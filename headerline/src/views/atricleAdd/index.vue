<!-- 发布文章 -->
<template>
  <div class="">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>发表文章</span>
      </div>
      <el-form
        ref="form"
        :model="addForm"
        label-width="120px"
        :rules="addRules"
      >
        <el-form-item label="文章标题：" prop="title">
          <el-input
            v-model="addForm.title"
            placeholder="文章名称"
            width="60px;"
          ></el-input>
        </el-form-item>
        <el-form-item label="文章内容：" prop="content">
          <quill-editor v-model="addForm.content" ref="myQuillEditor">
          </quill-editor>
        </el-form-item>
        <el-form-item label="文章封面：">
          <el-radio-group v-model="addForm.cover.type">
            <el-radio-button label="-1">自动</el-radio-button>
            <el-radio-button label="1">无图</el-radio-button>
            <el-radio-button label="0">单图</el-radio-button>
            <el-radio-button label="3">三图</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="文章频道：" prop="channel_id">
          <el-select v-model="addForm.channel_id" placeholder="请选择">
            <el-option
              v-for="item in channelList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-divider></el-divider>
        <el-form-item>
          <el-button type="primary" @click="addAtr(false)">发布</el-button>
          <el-button @click="addAtr(true)">存入草稿</el-button>
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
// 按需引入引入主组件模块
import { quillEditor } from 'vue-quill-editor'
export default {
  name: 'addatricle',
  // import引入的组件需要注入到对象中才能使用
  components: {
    quillEditor
  },
  data () {
    // 这里存放数据
    return {
      channelList: [], // 文章频道
      addForm: {
        title: '', // 标题
        conent: '', // 内容
        cover: {
          type: 0, // 几图
          images: [] // 数组存放路径(需为数组)
        },
        channel_id: '' // 文章所属频道
      },
      addRules: {
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
  computed: {},
  // 监控data中的数据变化
  watch: {},
  // 方法集合
  methods: {
    // 获得频道
    getChannelList () {
      this.$http
        .get('/channels')
        .then(res => {
          let data = res.data
          if (data.message === 'OK') {
            this.channelList = data.data.channels
          }
        })
        .catch(err => {
          console.log('错误' + err)
        })
    },
    // 添加文章
    addAtr (flag) {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.$http.post('/articles', this.addForm, { params: { draft: flag } })
            .then(res => {
              this.$message.success('添加成功！')
              this.$router.push('/article')
            })
            .catch(err => {
              return this.$message.error('添加失败' + err)
            })
        }
      })
    }
  },
  // 生命周期 - 创建完成（可以访问当前this实例）
  created () {
    this.getChannelList()
  },
  // 生命周期 - 挂载完成（可以访问DOM元素）
  mounted () {},
  beforeCreate () {}, // 生命周期 - 创建之前
  beforeMount () {}, // 生命周期 - 挂载之前
  beforeUpdate () {}, // 生命周期 - 更新之前
  updated () {}, // 生命周期 - 更新之后
  beforeDestroy () {}, // 生命周期 - 销毁之前
  destroyed () {}, // 生命周期 - 销毁完成
  activated () {} // 如果页面有keep-alive缓存功能，这个函数会触发
}
</script>
<style lang="less" scoped>
//@import url(); 引入公共css类
.el-form-item /deep/ .ql-editor {
  height: 200px;
}
</style>
