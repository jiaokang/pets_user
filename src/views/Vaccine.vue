<template>
  <div class="vaccine-container">
    <h1>添加疫苗记录</h1>
    <p>这里将显示疫苗接种记录表单</p>
    <el-button type="primary" @click="$router.push('/index')">返回首页</el-button>
  </div>
</template>

<script>
export default {
  name: 'Vaccine'
}
</script>

<style scoped>
.vaccine-container {
  padding: 20px;
  text-align: center;
}
</style> 