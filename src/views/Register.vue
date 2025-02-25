<template>
  <div class="register-container">
    <el-card class="register-card">
      <div class="register-header">
        <img src="@/assets/logo.png" alt="Logo" class="logo">
        <h2>用户注册</h2>
      </div>
      
      <el-form :model="registerForm" :rules="registerRules" ref="registerForm" class="register-form">
        <el-form-item prop="username">
          <el-input
            v-model="registerForm.username"
            prefix-icon="el-icon-user"
            placeholder="请输入用户名">
          </el-input>
        </el-form-item>
        
        <el-form-item prop="email">
          <el-input
            v-model="registerForm.email"
            prefix-icon="el-icon-message"
            placeholder="请输入邮箱">
          </el-input>
        </el-form-item>
        
        <el-form-item prop="password">
          <el-input
            v-model="registerForm.password"
            prefix-icon="el-icon-lock"
            type="password"
            placeholder="请输入密码"
            show-password>
          </el-input>
        </el-form-item>
        
        <el-form-item prop="confirmPassword">
          <el-input
            v-model="registerForm.confirmPassword"
            prefix-icon="el-icon-lock"
            type="password"
            placeholder="请确认密码"
            show-password>
          </el-input>
        </el-form-item>
        
        <el-form-item prop="code">
          <div class="verification-code">
            <el-input
              v-model="registerForm.code"
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
        
        <el-form-item class="agreement">
          <el-checkbox v-model="registerForm.agreement">
            我已阅读并同意
            <el-link type="primary">用户协议</el-link>
            和
            <el-link type="primary">隐私政策</el-link>
          </el-checkbox>
        </el-form-item>
        
        <el-button type="primary" class="register-button" :loading="loading" @click="handleRegister">
          注册
        </el-button>
        
        <div class="login-link">
          已有账号？<el-link type="primary" @click="$router.push('/login')">立即登录</el-link>
        </div>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { register, sendEmailCode } from '@/api/auth'

export default {
  name: 'Register',
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
    
    const validatePassword = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入密码'))
      } else if (value.length < 6 || value.length > 20) {
        callback(new Error('密码长度在 6 到 20 个字符'))
      } else {
        if (this.registerForm.confirmPassword) {
          this.$refs.registerForm.validateField('confirmPassword')
        }
        callback()
      }
    }
    
    const validateConfirmPassword = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.registerForm.password) {
        callback(new Error('两次输入密码不一致'))
      } else {
        callback()
      }
    }
    
    return {
      isCodeSending: false,
      countdown: 60,
      timer: null,
      loading: false,
      
      registerForm: {
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        code: '',
        agreement: false
      },
      
      registerRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
        ],
        email: [
          { required: true, trigger: 'blur', validator: validateEmail }
        ],
        password: [
          { required: true, trigger: 'blur', validator: validatePassword }
        ],
        confirmPassword: [
          { required: true, trigger: 'blur', validator: validateConfirmPassword }
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
    async handleRegister() {
      try {
        await this.$refs.registerForm.validate()
        
        if (!this.registerForm.agreement) {
          this.$message.warning('请阅读并同意用户协议和隐私政策')
          return
        }
        
        this.loading = true
        
        // 调用注册API
        const response = await register({
          username: this.registerForm.username,
          email: this.registerForm.email,
          password: this.registerForm.password,
          code: this.registerForm.code
        })
        
        // 注册成功处理
        this.$message.success('注册成功，即将跳转到登录页面')
        
        // 延迟跳转到登录页面
        setTimeout(() => {
          this.$router.push('/login')
        }, 1500)
      } catch (error) {
        this.$message.error(error.message || '注册失败，请重试')
        console.error('注册失败:', error)
      } finally {
        this.loading = false
      }
    },
    
    async sendVerificationCode() {
      if (this.isCodeSending) return
      
      this.$refs.registerForm.validateField('email', async (error) => {
        if (error) return
        
        try {
          this.isCodeSending = true
          this.countdown = 60
          
          // 调用发送验证码API
          await sendEmailCode(this.registerForm.email, 'register')
          
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
.register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.register-card {
  width: 100%;
  max-width: 420px;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.register-header {
  text-align: center;
  margin-bottom: 30px;
}

.logo {
  width: 80px;
  height: 80px;
  margin-bottom: 16px;
}

.register-header h2 {
  color: #303133;
  font-size: 24px;
  margin: 0;
}

.register-form {
  margin-top: 20px;
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

.agreement {
  margin: 20px 0;
}

.register-button {
  width: 100%;
  height: 40px;
  font-size: 16px;
  margin-bottom: 20px;
}

.login-link {
  text-align: center;
  color: #606266;
}

/* 响应式调整 */
@media (max-width: 480px) {
  .register-card {
    margin: 0;
    border-radius: 0;
  }
}
</style> 