<template>
  <div class="login-container">
    <el-card class="login-card">
      <div class="login-header">
        <img src="@/assets/logo.png" alt="Logo" class="logo">
        <h2>欢迎登录</h2>
      </div>
      
      <el-tabs v-model="activeTab" class="login-tabs">
        <el-tab-pane label="账号密码登录" name="account">
          <el-form :model="accountForm" :rules="accountRules" ref="accountForm">
            <el-form-item prop="username">
              <el-input
                v-model="accountForm.username"
                prefix-icon="el-icon-user"
                placeholder="请输入用户名">
              </el-input>
            </el-form-item>
            
            <el-form-item prop="password">
              <el-input
                v-model="accountForm.password"
                prefix-icon="el-icon-lock"
                type="password"
                placeholder="请输入密码"
                show-password>
              </el-input>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        
        <el-tab-pane label="邮箱登录" name="email">
          <el-form :model="emailForm" :rules="emailRules" ref="emailForm">
            <el-form-item prop="email">
              <el-input
                v-model="emailForm.email"
                prefix-icon="el-icon-message"
                placeholder="请输入邮箱">
              </el-input>
            </el-form-item>
            
            <el-form-item prop="code">
              <div class="verification-code">
                <el-input
                  v-model="emailForm.code"
                  prefix-icon="el-icon-key"
                  placeholder="请输入验证码">
                </el-input>
                <el-button 
                  type="primary" 
                  :disabled="isCodeSending"
                  @click="sendVerificationCode">
                  {{ codeButtonText }}
                </el-button>
              </div>
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>
      
      <div class="login-options">
        <el-checkbox v-model="rememberMe">记住我</el-checkbox>
        <el-link type="primary">忘记密码？</el-link>
      </div>
      
      <el-button type="primary" class="login-button" :loading="loading" @click="handleLogin">
        登录
      </el-button>
      
      <div class="register-link">
        还没有账号？<el-link type="primary" @click="$router.push('/register')">立即注册</el-link>
      </div>
    </el-card>
  </div>
</template>

<script>
import { loginByAccount, loginByEmail, sendEmailCode } from '@/api/auth'

export default {
  name: 'Login',
  data() {
    const validateEmail = (rule, value, callback) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!value) {
        callback(new Error('请输入邮箱'))
      } else if (!emailRegex.test(value)) {
        callback(new Error('请输入正确的邮箱格式'))
      } else {
        callback()
      }
    }
    
    return {
      activeTab: 'account',
      rememberMe: false,
      isCodeSending: false,
      countdown: 60,
      timer: null,
      loading: false,
      
      accountForm: {
        username: '',
        password: ''
      },
      emailForm: {
        email: '',
        code: ''
      },
      
      accountRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' }
        ]
      },
      emailRules: {
        email: [
          { required: true, trigger: 'blur', validator: validateEmail }
        ],
        code: [
          { required: true, message: '请输入验证码', trigger: 'blur' },
          { len: 6, message: '验证码长度为 6 位', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    codeButtonText() {
      return this.isCodeSending ? `${this.countdown}秒后重试` : '获取验证码'
    }
  },
  methods: {
    async handleLogin() {
      try {
        this.loading = true
        
        if (this.activeTab === 'account') {
          await this.$refs.accountForm.validate()
          
          // 打印请求信息，帮助调试
          console.log('正在发送登录请求，完整URL:', process.env.VUE_APP_BASE_API + '/api/auth/login')
          
          const response = await loginByAccount({
            username: this.accountForm.username,
            password: this.accountForm.password,
            remember: this.rememberMe
          })
          
          this.handleLoginSuccess(response)
        } else {
          await this.$refs.emailForm.validate()
          
          
          const response = await loginByEmail({
            email: this.emailForm.email,
            code: this.emailForm.code,
            remember: this.rememberMe
          })
          
          this.handleLoginSuccess(response)
        }
      } catch (error) {
        // 增强错误信息显示
        console.error('登录失败详情:', error)
        if (error.response) {
          console.error('状态码:', error.response.status)
          console.error('响应数据:', error.response.data)
        }
        
        this.$message.error(error.message || '登录失败，请重试')
      } finally {
        this.loading = false
      }
    },
    
    handleLoginSuccess(response) {
      console.log(response)
      // 保存token到本地存储
      if (response.data) {
        localStorage.setItem('token', response.data)
        
        // 保存用户名到本地存储
        if (this.activeTab === 'account') {
          localStorage.setItem('username', this.accountForm.username)
        } else {
          localStorage.setItem('username', this.emailForm.email)
        }
      }
      
      // 显示登录成功消息
      this.$message.success('登录成功')
      
      // 跳转到首页
      this.$router.push('/index')
    },
    
    async sendVerificationCode() {
      if (this.isCodeSending) return
      
      this.$refs.emailForm.validateField('email', async (error) => {
        if (error) return
        
        try {
          this.isCodeSending = true
          this.countdown = 60
          
          await sendEmailCode(this.emailForm.email, 'login')
          
          this.$message.success('验证码已发送，请查收邮件')
          
          this.timer = setInterval(() => {
            if (this.countdown > 0) {
              this.countdown--
            } else {
              this.isCodeSending = false
              clearInterval(this.timer)
            }
          }, 1000)
        } catch (error) {
          this.isCodeSending = false
          this.$message.error(error.message || '验证码发送失败，请重试')
        }
      })
    }
  },
  beforeDestroy() {
    if (this.timer) {
      clearInterval(this.timer)
    }
  }
}
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.login-card {
  width: 100%;
  max-width: 420px;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.login-header {
  text-align: center;
  margin-bottom: 30px;
}

.logo {
  width: 80px;
  height: 80px;
  margin-bottom: 16px;
}

.login-header h2 {
  color: #303133;
  font-size: 24px;
  margin: 0;
}

.login-tabs {
  margin-bottom: 20px;
}

.verification-code {
  display: flex;
  gap: 10px;
}

.verification-code .el-input {
  flex: 1;
}

.verification-code .el-button {
  width: 120px;
}

.login-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 20px 0;
}

.login-button {
  width: 100%;
  height: 40px;
  font-size: 16px;
  margin-bottom: 20px;
}

.register-link {
  text-align: center;
  color: #606266;
}

/* 响应式调整 */
@media (max-width: 480px) {
  .login-card {
    margin: 0;
    border-radius: 0;
  }
}
</style> 