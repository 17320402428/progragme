<!--  -->
<template>
  <el-container>
    <el-aside :width="isCollapse?'65px': '200px'">
      <el-menu default-active="1-4-1"
               class="el-menu-vertical-demo"
               background-color="#323745"
               text-color="#fff"
               router
               :collapse="isCollapse">
        <el-menu-item index="/index">
          <i class="el-icon-menu"></i>
          <span slot="title">首页</span>
        </el-menu-item>
        <el-submenu index="2">
          <template slot="title">
            <i class="el-icon-menu"></i>
            <span slot="title">内容管理</span>
          </template>
          <el-menu-item-group>
            <el-menu-item index="/artadd">发布文章</el-menu-item>
            <el-menu-item index="/article">文章列表</el-menu-item>
            <el-menu-item index="2-3">评论列表</el-menu-item>
            <el-menu-item index="2-4">素材管理</el-menu-item>
          </el-menu-item-group>
        </el-submenu>
        <el-menu-item index="3">
          <i class="el-icon-menu"></i>
          <span slot="title">粉丝管理</span>
        </el-menu-item>
        <el-menu-item index="4">
          <i class="el-icon-menu"></i>
          <span slot="title">账户管理</span>
        </el-menu-item>

      </el-menu>
    </el-aside>
    <!-- header -->
    <el-container>
      <!--头部标签 -->
      <el-header>
        <div class="lt">
          <i class="el-icon-s-fold"
             @click="isCollapse=!isCollapse"></i>
          <span>江苏传智播客教育科技股份有限公司</span>
        </div>
        <div class="rt">
          <el-input placeholder="请输入搜索的文章内容"
                    class="inp"
                    v-model="input4">
            <i slot="prefix"
               class="el-input__icon el-icon-search"></i>
          </el-input>
          <span class="message">消息</span>
          <el-dropdown>
            <span class="el-dropdown-link">
              <img :src="photo"
                   alt=""
                   width="40">
              <span class="user_name">伊丽莎白·奥尔森</span><i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>个人信息</el-dropdown-item>
              <el-dropdown-item>GitHub地址</el-dropdown-item>
              <el-dropdown-item @click.native="logout">退出</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </el-header>
      <!--头部标签 -->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
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
      input4: '',
      isCollapse: false
    }
  },
  // 监听属性 类似于data概念
  computed: {
    name () {
      return JSON.parse(window.localStorage.getItem('user')).name
    },
    photo () {
      return JSON.parse(window.localStorage.getItem('user')).photo
    }
  },
  // 监控data中的数据变化
  watch: {},
  // 方法集合
  methods: {
    logout () {
      this.$confirm('确认退出吗?', '退出', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        window.localStorage.clear()
        this.$router.push('/')
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    }
  },
  // 生命周期 - 创建完成（可以访问当前this实例）
  created () {

  },
  // 生命周期 - 挂载完成（可以访问DOM元素）
  mounted () {

  },
  beforeCreate () { }, // 生命周期 - 创建之前
  beforeMount () { }, // 生命周期 - 挂载之前
  beforeUpdate () { }, // 生命周期 - 更新之前
  updated () { }, // 生命周期 - 更新之后
  beforeDestroy () { }, // 生命周期 - 销毁之前
  destroyed () { }, // 生命周期 - 销毁完成
  activated () { } // 如果页面有keep-alive缓存功能，这个函数会触发
}
</script>
<style lang="less" scoped>
.el-aside {
  background-color: rbg(50, 54, 47);
  color: #333;
  .el-menu {
    height: 100%;
  }
}
//主体
.el-main {
  background-color: rbg(50, 54, 47);
  color: #333;
}

.el-container {
  margin-bottom: 40px;
  height: 100%;
  .el-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .lt {
      width: 40%;
      height: 60px;
      line-height: 60px;
    }
    .rt {
      width: 50%;
      height: 60px;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      .inp {
        width: 300px;
      }
      .el-dropdown {
        .el-dropdown-link {
          display: flex;
          align-items: center;
          vertical-align: middle;
        }
      }
      .message {
        padding: 0 10px;
      }
    }
  }
}
</style>
