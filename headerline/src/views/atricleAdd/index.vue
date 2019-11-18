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
            <el-radio-button :label="-1">自动</el-radio-button>
            <el-radio-button :label="0">无图</el-radio-button>
            <el-radio-button :label="1">单图</el-radio-button>
            <el-radio-button :label="3">三图</el-radio-button>
          </el-radio-group>
          <ul class="clearfix">
            <li
              class="uploadbox"
              @click="showDialog"
              v-for="item in covernum"
              :key="item"
            >
              <span>点击图标选择图片</span>
              <img
                v-if="addForm.cover.images[item - 1]"
                :src="addForm.cover.images[item - 1]"
                alt
              />
              <div v-else class="el-icon-picture-outline"></div>
            </li>
          </ul>
        </el-form-item>
        <channel-com @slt="selectHandler"></channel-com>
        <el-form-item>
          <el-button type="primary" @click="addAtr(false)">发布</el-button>
          <el-button @click="addAtr(true)">存入草稿</el-button>
        </el-form-item>
      </el-form>
      <el-dialog
        title="素材图片"
        :visible.sync="dialogVisible"
        width="60%"
      >
        <!--后添加的用于展示素材图片的标签-->
        <ul class="clearfix">
          <li class="image-box" v-for="item in imageList" :key="item.id" @click="clkImage">
            <img :src="item.url" alt="没有图片" />
          </li>
        </ul>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
// 这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
// 例如：import 《组件名称》 from '《组件路径》';
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import ChannelCom from '@/components/channel.vue'
// 按需引入引入主组件模块
import { quillEditor } from 'vue-quill-editor'
export default {
  name: 'addAtricle',
  // import引入的组件需要注入到对象中才能使用
  components: {
    quillEditor,
    ChannelCom
  },
  data () {
    // 这里存放数据
    return {
      imageList: [], // 素材图片列表
      // 获取素材图片的条件参数
      querycdt: {
        collect: false, // 非收藏图片
        page: 1,
        per_page: 12
      },
      dialogVisible: false, // 对话框显示开关
      channelList: [], // 文章频道
      addForm: {
        title: '', // 标题
        content: '', // 内容
        cover: {
          type: 1, // 几图
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
  computed: {
    covernum () {
      // 设置选择框 个数 与 type的值 一致
      if (this.addForm.cover.type > 0) {
        return this.addForm.cover.type
      }
      return 0
    }
  },
  // 监控data中的数据变化
  watch: {},
  // 方法集合
  methods: {
    clkImage (evt) {
      // 把其他项目的边框高亮效果去除
      let lis = document.querySelectorAll('.image-box')
      for (var i = 0; i < lis.length; i++) {
        lis[i].style.border = ''
      }
      // console.log(evt) // MouseEvent对象
      // console.log(evt.target) // img的dom对象
      // 获得当前触发事件的img的父节点对象，即li标签
      // evt.target.parentNode
      // 设置当前项目有高亮效果
      evt.target.parentNode.style.border = '2px solid red'
    },
    // 获取素材图片列表
    getImageList () {
      let pro = this.$http.get('/user/images', { params: this.querycdt })
      pro
        .then(result => {
          if (result.data.message === 'OK') {
            this.imageList = result.data.data.results
          }
        })
        .catch(err => {
          return this.$message.error('获得素材图片列表错误:' + err)
        })
    },
    // 显示素材对话框
    showDialog () {
      this.dialogVisible = true // 设置为true
    },
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
          this.$http
            .post('/articles', this.addForm, { params: { draft: flag } })
            .then(res => {
              this.$message.success('添加成功！')
              this.$router.push('/article')
            })
            .catch(err => {
              return this.$message.error('添加失败' + err)
            })
        }
      })
    },
    selectHandler (arg) {
      this.addForm.channel_id = arg
    }
  },
  // 生命周期 - 创建完成（可以访问当前this实例）
  created () {
    this.getChannelList()
    this.getImageList()
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
.uploadbox {
  list-style: none;
  width: 200px;
  height: 200px;
  margin: 10px;
  float: left;
  cursor: pointer;
  border: 1px solid #eee;
  span {
    width: 200px;
    height: 50px;
    line-height: 50px;
    display: block;
    text-align: center;
  }
  div {
    width: 200px;
    height: 150px;
    font-size: 100px;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #fff;
  }
  img {
    width: 200px;
    height: 150px;
  }
}
// 对话框素材图片列表相关css样式
.image-box {
  list-style: none;
  width: 200px;
  height: 140px;
  background-color: #fff;
  margin: 10px;
  float: left;
  border: 1px solid #eee;
  cursor: pointer;
  box-sizing: border-box;
  img {
    width: 100%;
    height: 100%;
  }
}
.clearfix:after {
  clear: both;
  display: block;
  content: "";
}
</style>
