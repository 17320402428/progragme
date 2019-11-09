<template>
  <div id="home-contatiner">
    <div class="home">
      <img src="./logo_index.png"
           alt="">
      <el-form :model="loginForm"
               ref="ruleForm"
               :rules="loginRules">
        <el-form-item prop="mobile">
          <el-input v-model="loginForm.mobile"
                    placeholder="请输入手机号"></el-input>
        </el-form-item>
        <el-form-item prop="code">
          <el-input v-model="loginForm.code"
                    placeholder="请输入验证码"></el-input>
        </el-form-item>
        <el-form-item prop="agreement">
          <el-checkbox label="我已阅读并同意用户协议和隐私条款"
                       name="type"
                       v-model="loginForm.agreement"></el-checkbox>
        </el-form-item>
        <el-form-item>
          <el-button type="primary"
                     style="width:100%;margin-top:15px;"
                     @click="login">立即登录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>

</template>

<script>
// @ is an alias to /src

export default {
  name: 'home',
  components: {
  },
  data () {
    var checkAgreement = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('亲，请先同意协议哦~'))
      } else {
        callback()
      }
    }
    return {
      loginForm: {
        mobile: '15122223333', // 手机号
        code: '246810', // 验证码
        agreement: true // 协议勾选
      },
      loginRules: {
        mobile: [
          { required: true, message: '请输入手机号码' },
          { pattern: /^1[35789]\d{9}$/, message: '手机号码格式不对' }
        ],
        code: [
          { required: true, message: '请输入验证码' }
        ],
        agreement: [
          { validator: checkAgreement }
        ]
      }
    }
  },
  methods: {
    login () {
      this.$refs.ruleForm.validate((valid) => {
        // 格式正确的话，发送请求验证账号密码
        if (valid) {
          this.$http.post('/authorizations', this.loginForm)
            .then((res) => { let data = res.data; if (data.message === 'OK') { window.localStorage.setItem('user', JSON.stringify(data.data)); this.$router.push({ name: 'index' }) } })
            .catch((err) => { console.log('网络不稳定哦，请稍后再试~') })
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
#home-contatiner {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-image: url("./login_bg.jpg");
  background-size: cover;
  .home {
    width: 400px;
    height: 340px;
    background: #fff;
    text-align: center;
    img {
      width: 35%;
      margin: 20px 0;
    }
    .el-form {
      width: 75%;
      margin: 0 auto;
    }
  }
}
</style>
