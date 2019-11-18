<!-- 频道列表子组件 -->
<template>
  <el-form-item label="频道列表：" prop="channel_id">
    <el-select v-model="channel_id" placeholder="请选择">
      <el-option
        v-for="item in channelList"
        :key="item.id"
        :label="item.name"
        :value="item.id"
      >
      </el-option>
    </el-select>
  </el-form-item>
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
      channelList: [], // 频道列表
      channel_id: '' // 频道
    }
  },
  props: {
    cid: {
      default: 0
    }
  },
  // 监听属性 类似于data概念
  computed: {},
  // 监控data中的数据变化
  watch: {
    channel_id: function (v1, v2) {
      this.$emit('slt', v1)
    },
    cid: function (v1, v2) {
      this.channel_id = v1
    }
  },
  // 方法集合
  methods: {
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
</style>
