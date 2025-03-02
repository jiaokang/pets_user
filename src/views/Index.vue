<template>
  <div class="index-container">
    <el-card class="index-card">
      <div class="index-header">
        <img src="@/assets/logo.png" alt="Logo" class="logo">
        <h2>宠物健康管理</h2>
      </div>
      
      <div class="welcome-message">
        <p>欢迎回来，<span class="username">{{ username }}</span>！</p>
        <p class="subtitle">您可以在这里管理您的宠物健康记录</p>
      </div>
      
      <div class="modules-container">
        <!-- 我的宠物模块 -->
        <div class="module-card" @click="navigateTo('pets')">
          <div class="module-content">
            <i class="el-icon-pet"></i>
            <h3>我的宠物</h3>
            <p>查看和管理您的宠物信息</p>
          </div>
        </div>
        
        <!-- 添加疫苗记录模块 -->
        <div class="module-card" @click="navigateTo('vaccine')">
          <div class="module-content">
            <i class="el-icon-vaccine"></i>
            <h3>添加疫苗记录</h3>
            <p>记录您的宠物疫苗接种情况</p>
          </div>
        </div>
        
        <!-- 添加驱虫记录模块 -->
        <div class="module-card" @click="navigateTo('deworming')">
          <div class="module-content">
            <i class="el-icon-medicine"></i>
            <h3>添加驱虫记录</h3>
            <p>记录您的宠物驱虫情况</p>
          </div>
        </div>
      </div>
      
      <div class="user-actions">
        <el-button type="text" icon="el-icon-setting" @click="navigateTo('settings')">
          设置
        </el-button>
        <el-button type="text" icon="el-icon-switch-button" @click="handleLogout">
          退出登录
        </el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
import { logout } from '@/api/auth'

export default {
  name: 'Index',
  data() {
    return {
      username: '用户',
      loading: false
    }
  },
  created() {
    // 从本地存储或其他地方获取用户名
    const storedUsername = localStorage.getItem('nickName')
    if (storedUsername) {
      this.username = storedUsername
    }
  },
  methods: {
    navigateTo(route) {
      console.log(route)
      // 导航到相应的页面
      this.$router.push(`/${route}`)
    },
    async handleLogout() {
      try {
        this.loading = true
        await logout()
        
        // 清除本地存储的token和用户信息
        localStorage.removeItem('token')
        localStorage.removeItem('username')
        
        this.$message.success('退出登录成功')
        
        // 跳转到登录页
        this.$router.push('/login')
      } catch (error) {
        this.$message.error(error.message || '退出登录失败，请重试')
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style scoped>
.index-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
  animation: fadeIn 0.5s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.index-card {
  width: 100%;
  max-width: 800px;
  padding: 30px;
  border-radius: 16px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  animation: slideUp 0.5s ease-out;
}

@keyframes slideUp {
  from {
    transform: translateY(30px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.index-header {
  text-align: center;
  margin-bottom: 40px;
}

.logo {
  width: 100px;
  height: 100px;
  margin-bottom: 20px;
  animation: bounce 2s infinite;
}

@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

.index-header h2 {
  color: #303133;
  font-size: 32px;
  margin: 0;
  font-weight: 600;
  background: linear-gradient(45deg, #409EFF, #764ba2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.welcome-message {
  text-align: center;
  margin-bottom: 40px;
}

.welcome-message .username {
  font-weight: bold;
  color: #409EFF;
  font-size: 20px;
}

.welcome-message .subtitle {
  color: #606266;
  margin-top: 8px;
  font-size: 16px;
}

.modules-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 25px;
  margin-bottom: 40px;
}

.module-card {
  height: 200px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border-radius: 12px;
  border: none;
  overflow: hidden;
  background: white;
}

.module-card:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
}

.module-content {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 25px;
  text-align: center;
  position: relative;
  z-index: 1;
}

.module-content::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(45deg, rgba(102, 126, 234, 0.05), rgba(118, 75, 162, 0.05));
  z-index: -1;
  transition: opacity 0.3s ease;
  opacity: 0;
}

.module-card:hover .module-content::before {
  opacity: 1;
}

.module-content i {
  font-size: 48px;
  margin-bottom: 20px;
  color: #409EFF;
  transition: transform 0.3s ease;
}

.module-card:hover .module-content i {
  transform: scale(1.1);
}

/* Custom icons with more pet-related designs */
.el-icon-pet:before {
  content: "🐾";
}

.el-icon-vaccine:before {
  content: "💉";
}

.el-icon-medicine:before {
  content: "💊";
}

.module-content h3 {
  font-size: 20px;
  margin: 0 0 12px;
  color: #303133;
  font-weight: 600;
}

.module-content p {
  color: #606266;
  margin: 0;
  font-size: 14px;
  line-height: 1.5;
}

.user-actions {
  display: flex;
  justify-content: center;
  gap: 30px;
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
}

.user-actions .el-button {
  padding: 12px 24px;
  font-size: 16px;
  transition: all 0.3s ease;
}

.user-actions .el-button:hover {
  transform: translateY(-2px);
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .index-card {
    padding: 20px;
  }

  .modules-container {
    grid-template-columns: 1fr;
    gap: 15px;
  }

  .module-card {
    height: 160px;
  }

  .module-content i {
    font-size: 36px;
  }

  .module-content h3 {
    font-size: 18px;
  }

  .welcome-message .username {
    font-size: 18px;
  }

  .index-header h2 {
    font-size: 28px;
  }
}
</style> 