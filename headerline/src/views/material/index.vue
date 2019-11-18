<!-- 素材管理 -->
<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span>素材管理</span>
      <el-upload
        style="float: right; padding: 3px 0"
        action="http://ttapi.research.itcast.cn/mp/v1_0/user/images"
        :headers="setToken"
        name="image"
        :show-file-list="false"
        :on-success="onSuccess"
      >
        <el-button size="small" type="primary">上传图片</el-button>
      </el-upload>
    </div>
    <!--匿名插槽，卡片主体内容-->
    <div class="text item">
      <ul class="clearfix">
        <li class="image-box" v-for="item in imageList" :key="item.id">
          <img :src="item.url" alt />
          <div class="image-bot">
            <el-button
              type="success"
              icon="el-icon-star-off"
              circle
            ></el-button>
            <el-button type="danger" icon="el-icon-delete" circle></el-button>
          </div>
        </li>
      </ul>
      <div class="text item">
        <el-pagination layout="prev, pager, next" :total="50"> </el-pagination>
      </div>
    </div>
  </el-card>
</template>

<script>
// 这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
// 例如：import 《组件名称》 from '《组件路径》';

export default {
  // import引入的组件需要注入到对象中才能使用
  components: {},
  data () {
    // 这里存放数据
    return {
      imageList: [], // 已有素材列表信息
      // 获得素材图片的条件信息
      querycdt: {
        collect: false,
        page: 1,
        per_page: 20
      }
    }
  },
  // 监听属性 类似于data概念
  computed: {
    setToken () {
      let token = JSON.parse(window.localStorage.getItem('user')).token
      return { Authorization: 'Bearer ' + token }
    }
  },
  // 监控data中的数据变化
  watch: {},
  // 方法集合
  methods: {
    onSuccess () {
      this.$message.success('上传图片成功') // 提示
      this.getImageList() // 刷新
    },
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
    }
  },
  // 生命周期 - 创建完成（可以访问当前this实例）
  created () {
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
.image-box {
  list-style: none;
  width: 200px;
  height: 200px;
  background-color: #fff;
  margin: 10px;
  float: left;
  border: 1px solid #eee;
  img {
    width: 200px;
    height: 140px;
  }
  .image-bot {
    width: 200px;
    height: 60px;
    line-height: 60px;
    text-align: center;
  }
}
.clearfix::after {
  display: block;
  content: "";
  clear: both;
}
.el-pagination {
  display: flex;
  justify-content: center;
}
</style>
