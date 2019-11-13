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
                    placeholder="请输入手机号"><i slot="prefix"
               class="el-icon-phone"></i></el-input>
        </el-form-item>
        <el-form-item prop="code">
          <el-input v-model="loginForm.code"
                    placeholder="请输入验证码"><i slot="prefix"
               class="el-icon-s-comment"></i>
          </el-input>
        </el-form-item>
        <!-- <el-form-item>
          <div id="captcha-box"></div>
        </el-form-item> -->
        <el-form-item prop="agreement"
                      style="margin-bottom:0">
          <el-checkbox label="我已阅读并同意用户协议和隐私条款"
                       name="type"
                       v-model="loginForm.agreement"></el-checkbox>
        </el-form-item>
        <el-form-item>
          <el-button type="primary"
                     style="width:100%;margin-top:15px;"
                     :loading="isactive"
                     :disabled="isactive"
                     @click="login">立即登录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>

</template>

<script>
// @ is an alias to /src
import '@/assets/js/gt.js'
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
      isactive: false, // loading加载
      caObj: null,
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
        if (valid) {
          if (this.caObj !== null) {
            return this.caObj.verify()
          }
          this.isactive = true
          this.$http.get(`/captchas/${this.loginForm.mobile}`)
            .then(res => {
              // 请检测data的数据结构， 保证data.gt, data.challenge, data.success有值
              var data = res.data.data
              window.initGeetest({
                // 以下配置参数来自服务端 SDK
                gt: data.gt,
                challenge: data.challenge,
                offline: !data.success,
                new_captcha: true,
                product: 'bind',
                lang: 'ja'
              }, captchaObj => {
                // 这里可以调用验证实例 captchaObj 的实例方法
                captchaObj.onReady(() => {
                  // 当验证框出现时，按钮恢复可点击状态
                  captchaObj.verify()
                  this.caObj = captchaObj
                  this.isactive = false
                }).onSuccess(() => {
                  this.loginChe()
                })
              })
            })
        }
      })
    },
    loginChe () {
      // 格式正确的话，发送请求验证账号密码

      this.$http.post('/authorizations', this.loginForm)
        .then((res) => {
          let data = res.data
          if (data.message === 'OK') {
            window.localStorage.setItem('user', JSON.stringify(data.data))
            this.$router.push({ name: 'wel' })
          }
        })
        .catch(err => console.log('网络不稳定哦，请稍后再试~' + err))
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
