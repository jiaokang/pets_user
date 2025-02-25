<template>
  <div class="deworming-container">
    <h1>添加驱虫记录</h1>
    <p>这里将显示驱虫记录表单</p>
    <el-button type="primary" @click="$router.push('/index')">返回首页</el-button>
  </div>
</template>

<script>
export default {
  name: 'Deworming'
}
</script>

<style scoped>
.deworming-container {
  padding: 20px;
  text-align: center;
}
</style> 