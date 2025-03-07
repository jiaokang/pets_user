<template>
  <div class="settings-container">
    <el-card class="settings-card">
      <div class="settings-header">
        <div class="header-left">
          <el-button type="text" icon="el-icon-back" @click="$router.push('/index')">返回主页</el-button>
          <h2>系统设置</h2>
        </div>
      </div>

      <div class="settings-content">
        <!-- 通知设置 -->
        <div class="settings-section">
          <h3>通知设置</h3>
          <div class="setting-item">
            <div class="setting-info">
              <span class="setting-title">疫苗接种提醒</span>
              <span class="setting-desc">开启后将在疫苗接种日期前7天提醒</span>
            </div>
            <el-switch v-model="settings.VACCINE_NOTIFY" @change="handleSettingChange('VACCINE_NOTIFY')">
            </el-switch>
          </div>
          <div class="setting-item">
            <div class="setting-info">
              <span class="setting-title">驱虫提醒</span>
              <span class="setting-desc">开启后将在驱虫日期前7天提醒</span>
            </div>
            <el-switch v-model="settings.DEWORMING_NOTIFY" @change="handleSettingChange('DEWORMING_NOTIFY')">
            </el-switch>
          </div>
        </div>

        <!-- 显示设置 -->
        <div class="settings-section">
          <h3>显示设置</h3>
          <div class="setting-item">
            <div class="setting-info">
              <span class="setting-title">深色模式</span>
              <span class="setting-desc">切换深色/浅色主题</span>
            </div>
            <el-switch v-model="settings.DARK_MODE" @change="handleSettingChange('DARK_MODE')">
            </el-switch>
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>

import { getSetting,setSetting } from '@/api/setting'

export default {
  name: 'Settings',
  data() {
    return {
      settings: {}
    }
  },
  created() {
    // 从本地存储加载设置
    getSetting().then(res => {
      // 转换字符串为布尔值
      const data = res.data
      Object.keys(data).forEach(key => {
        if (data[key] === 'true' || data[key] === 'false') {
          data[key] = data[key] === 'true'
        }
      })
      this.settings = data
    })
  },
  methods: {
    handleSettingChange(key) {
      let data = {
        item: key
      }
      setSetting(data);
    },
  }
}
</script>

<style scoped>
.settings-container {
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

.settings-card {
  max-width: 800px;
  margin: 0 auto;
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

.settings-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 20px;
}

.settings-header h2 {
  font-size: 28px;
  font-weight: 600;
  margin: 0;
  background: linear-gradient(45deg, #409EFF, #764ba2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.settings-section {
  margin-bottom: 40px;
}

.settings-section h3 {
  font-size: 20px;
  color: #303133;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

.setting-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 0;
  transition: background-color 0.3s;
}

.setting-item:hover {
  background-color: rgba(64, 158, 255, 0.05);
  border-radius: 8px;
  padding: 15px 10px;
}

.setting-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.setting-title {
  font-size: 16px;
  color: #303133;
  font-weight: 500;
}

.setting-desc {
  font-size: 14px;
  color: #909399;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .settings-card {
    padding: 20px;
  }

  .settings-header h2 {
    font-size: 24px;
  }

  .setting-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }

  .setting-info {
    margin-bottom: 10px;
  }
}
</style>