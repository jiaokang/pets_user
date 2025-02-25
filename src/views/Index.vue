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
        <el-card class="module-card" shadow="hover" @click="navigateTo('pets')">
          <div class="module-content">
            <i class="el-icon-pet"></i>
            <h3>我的宠物</h3>
            <p>查看和管理您的宠物信息</p>
          </div>
        </el-card>
        
        <!-- 添加疫苗记录模块 -->
        <el-card class="module-card" shadow="hover" @click="navigateTo('vaccine')">
          <div class="module-content">
            <i class="el-icon-vaccine"></i>
            <h3>添加疫苗记录</h3>
            <p>记录您的宠物疫苗接种情况</p>
          </div>
        </el-card>
        
        <!-- 添加驱虫记录模块 -->
        <el-card class="module-card" shadow="hover" @click="navigateTo('deworming')">
          <div class="module-content">
            <i class="el-icon-medicine"></i>
            <h3>添加驱虫记录</h3>
            <p>记录您的宠物驱虫情况</p>
          </div>
        </el-card>
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
    const storedUsername = localStorage.getItem('username')
    if (storedUsername) {
      this.username = storedUsername
    }
  },
  methods: {
    navigateTo(route) {
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
}

.index-card {
  width: 100%;
  max-width: 800px;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
}

.index-header {
  text-align: center;
  margin-bottom: 30px;
}

.logo {
  width: 80px;
  height: 80px;
  margin-bottom: 16px;
}

.index-header h2 {
  color: #303133;
  font-size: 28px;
  margin: 0;
}

.welcome-message {
  text-align: center;
  margin-bottom: 30px;
}

.welcome-message .username {
  font-weight: bold;
  color: #409EFF;
}

.welcome-message .subtitle {
  color: #606266;
  margin-top: 5px;
}

.modules-container {
  display: flex;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 30px;
}

.module-card {
  flex: 1;
  height: 180px;
  cursor: pointer;
  transition: transform 0.3s, box-shadow 0.3s;
  border-radius: 8px;
  overflow: hidden;
}

.module-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
}

.module-content {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 20px;
  text-align: center;
}

.module-content i {
  font-size: 40px;
  margin-bottom: 15px;
  color: #409EFF;
}

/* 自定义图标 */
.el-icon-pet:before {
  content: "\e6d3"; /* 使用Element UI的宠物相关图标 */
}

.el-icon-vaccine:before {
  content: "\e705"; /* 使用Element UI的医疗相关图标 */
}

.el-icon-medicine:before {
  content: "\e723"; /* 使用Element UI的药物相关图标 */
}

.module-content h3 {
  font-size: 18px;
  margin: 0 0 10px;
  color: #303133;
}

.module-content p {
  color: #606266;
  margin: 0;
}

.user-actions {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 20px;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .modules-container {
    flex-direction: column;
  }
  
  .module-card {
    height: 120px;
  }
}
</style> 