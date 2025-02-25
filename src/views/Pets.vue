<template>
  <div class="pets-container">
    <h1>我的宠物</h1>
    <p>这里将显示您的宠物列表和详细信息</p>
    <el-button type="primary" @click="$router.push('/index')">返回首页</el-button>
  </div>
</template>

<script>
export default {
  name: 'Pets'
}
</script>

<style scoped>
.pets-container {
  padding: 20px;
  text-align: center;
}
</style> 