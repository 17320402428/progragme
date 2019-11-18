<!-- 账户管理 -->
<template>
  <el-card class="box-card">
    <!--命名插槽，头部内容设置-->
    <div slot="header" class="clearfix">
      <span>账户信息</span>
    </div>
    <!--匿名插槽，卡片主体内容-->
    <div class="text item cardbody">
      <div class="lt">
        <el-form
          ref="accountFormRef"
          :model="accountForm"
          label-width="100px"
          :rules="accountFormRules"
        >
          <el-form-item label="名称" prop="name">
            <el-input v-model="accountForm.name"></el-input>
          </el-form-item>
          <el-form-item label="手机">
            <el-input v-model="accountForm.mobile" disabled></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="accountForm.email"></el-input>
          </el-form-item>
          <el-form-item label="简介">
            <el-input v-model="accountForm.intro"></el-input>
          </el-form-item>
          <el-form-item label="头像">
            <el-upload
              action=""
              :show-file-list="false"
              :http-request="httpRequest"
            >
              <img
                v-if="accountForm.photo"
                :src="accountForm.photo"
                class="avatar"
                width="200"
                height="200"
              />
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="editAccount()"
              >更新账户</el-button
            >
          </el-form-item>
        </el-form>
      </div>
      <div class="">
        <!--
          class="avatar-uploader" 设置组件样式
          action="https://jsonplaceholder.typicode.com/posts/" // 服务器端接收图片的地址
          :show-file-list="false" // 是否以列表形式显示上传好的图片
          :on-success="handleAvatarSuccess" // 图片上传成功的回调处理
          :before-upload="beforeAvatarUpload" // 图片上传之前的回调处理
          :http-request="httpRequest" 自定义上传行为，本身会覆盖默认的，此时action已经失效
        -->
      </div>
    </div>
  </el-card>
</template>

<script>
// 这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
// 例如：import 《组件名称》 from '《组件路径》';
import bus from '../../utils/bus.js'
export default {
  name: 'Account',
  // import引入的组件需要注入到对象中才能使用
  components: {},
  data () {
    // 这里存放数据
    return {
      accountForm: {
        id: '', // id
        name: '', // 名称
        mobile: '', // 手机号码
        email: '', // 邮箱
        intro: '', // 简介
        photo: '' // 照片
      },
      accountFormRules: {
        name: [
          { required: true, message: '名字必填' },
          // 后端要求title长度介于1-7个字符
          {
            min: 1,
            max: 7,
            message: '名字长度介于1-7个字符之间'
          }
        ],
        email: [
          { required: true, message: '邮箱必填' },
          { type: 'email', message: '邮箱格式不正确' }
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
    // 获取用户信息
    getUserInFo () {
      this.$http
        .get('/user/profile')
        .then(res => {
          let data = res.data
          if (data.message === 'OK') {
            this.accountForm = data.data
          }
        })
        .catch(err => {
          this.$message.error = err
        })
    },
    // 修改用户信息
    editAccount () {
      this.$http
        .patch('user/profile', this.accountForm)
        .then(res => {
          if (res.data.message === 'OK') {
            bus.$emit('upAccountName', this.accountForm.name)
            this.$message.success('修改账号信息成功')
            bus.$emit('upAccountPhoto', this.accountForm.photo)
          }
        })
        .catch(err => {
          this.$message.error('修改失败', err)
        })
    },
    // 修改用户头像
    httpRequest (resource) {
      let fd = new FormData()
      fd.append('photo', resource.file)
      this.$http
        .patch('/user/photo', fd)
        .then(res => {
          this.accountForm.photo = res.data.data.photo
        })
        .catch(err => {
          this.$message.error('上传失败', err)
        })
    }
  },
  // 生命周期 - 创建完成（可以访问当前this实例）
  created () {
    this.getUserInFo()
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
.cardbody {
  display: flex;
  #lt {
    width: 40%;
    background-color: pink;
  }
  #rt {
    width: 30%;
    background-color: lightgreen;
  }
  .el-form-item /deep/ .el-input__inner {
    width: 400px;
  }
}
</style>
