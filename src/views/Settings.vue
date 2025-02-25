<template>
  <div class="settings-container">
    <h1>设置</h1>
    <p>这里将显示用户设置选项</p>
    <el-button type="primary" @click="$router.push('/index')">返回首页</el-button>
  </div>
</template>

<script>
export default {
  name: 'Settings'
}
</script>

<style scoped>
.settings-container {
  padding: 20px;
  text-align: center;
}
</style> 