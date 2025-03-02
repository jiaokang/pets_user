<template>
  <div class="pets-container">
    <el-card class="pets-card">
      <div class="pets-header">
        <div class="header-left">
          <el-button type="text" icon="el-icon-back" @click="$router.push('/index')">返回主页</el-button>
          <h2>我的宠物</h2>
        </div>
        <el-button type="primary" icon="el-icon-plus" @click="handleAdd">添加宠物</el-button>
      </div>

      <!-- 宠物列表 -->
      <div class="pets-list" v-if="pets.length > 0">
        <el-card v-for="pet in pets" :key="pet.id" class="pet-item" shadow="hover">
          <div class="pet-avatar">
            <img :src="pet.avatar || defaultAvatar" :alt="pet.name">
          </div>
          <div class="pet-info">
            <h3>{{ pet.name }}</h3>
            <p class="pet-breed">品种：{{ pet.breed }}</p>
            <p class="pet-age">年龄：{{ pet.age }}岁</p>
            <p class="pet-weight">体重：{{ pet.weight }}kg</p>
          </div>
          <div class="pet-actions">
            <el-button type="text" icon="el-icon-edit" @click="handleEdit(pet)">编辑</el-button>
            <el-button type="text" icon="el-icon-delete" class="delete-btn" @click="handleDelete(pet)">删除</el-button>
          </div>
        </el-card>
      </div>

      <!-- 空状态 -->
      <div v-else class="empty-state">
        <i class="el-icon-pet"></i>
        <p>还没有添加宠物呢，快来添加一个吧！</p>
        <el-button type="primary" icon="el-icon-plus" @click="handleAdd">添加宠物</el-button>
      </div>
    </el-card>

    <!-- 添加/编辑宠物对话框 -->
    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="500px">
      <el-form :model="petForm" :rules="rules" ref="petForm" label-width="80px">
        <el-form-item label="名字" prop="name">
          <el-input v-model="petForm.name" placeholder="请输入宠物名字"></el-input>
        </el-form-item>
        <el-form-item label="品种" prop="breed">
          <el-input v-model="petForm.breed" placeholder="请输入宠物品种"></el-input>
        </el-form-item>
        <el-form-item label="年龄" prop="age">
          <el-input-number v-model="petForm.age" :min="0" :max="30" placeholder="请输入宠物年龄"></el-input-number>
        </el-form-item>
        <el-form-item label="体重" prop="weight">
          <el-input-number v-model="petForm.weight" :min="0" :max="100" :precision="1" placeholder="请输入宠物体重"></el-input-number>
        </el-form-item>
        <el-form-item label="头像">
          <el-upload
            class="avatar-uploader"
            action="/api/upload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload">
            <img v-if="petForm.avatar" :src="petForm.avatar" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm" :loading="submitLoading">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>

import { addPet, getPets,deletePet } from '@/api/pets'

export default {
  name: 'Pets',
  data() {
    return {
      pets: [], // 宠物列表
      dialogVisible: false,
      dialogTitle: '添加宠物',
      submitLoading: false,
      defaultAvatar: require('@/assets/default-pet.png'),
      petForm: {
        id: null,
        name: '',
        breed: '',
        age: 0,
        weight: 0,
        avatar: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入宠物名字', trigger: 'blur' },
          { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' }
        ],
        breed: [
          { required: true, message: '请输入宠物品种', trigger: 'blur' }
        ],
        age: [
          { required: true, message: '请输入宠物年龄', trigger: 'blur' }
        ],
        weight: [
          { required: true, message: '请输入宠物体重', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.fetchPets()
  },
  methods: {
    // 获取宠物列表
    async fetchPets() {
      try {
        // TODO: 调用获取宠物列表API
        const response = await getPets()
        this.pets = response.data
      } catch (error) {
        this.$message.error('获取宠物列表失败')
      }
    },

    // 添加宠物
    handleAdd() {
      this.dialogTitle = '添加宠物'
      this.petForm = {
        id: null,
        name: '',
        breed: '',
        age: 0,
        weight: 0,
        avatar: ''
      }
      this.dialogVisible = true
    },

    // 编辑宠物
    handleEdit(pet) {
      this.dialogTitle = '编辑宠物'
      this.petForm = { ...pet }
      this.dialogVisible = true
    },

    // 删除宠物
    handleDelete(pet) {
      this.$confirm('确定要删除这个宠物吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        try {
          // TODO: 调用删除宠物API
          await deletePet(pet.id)
          this.$message.success('删除成功')
          this.fetchPets()
        } catch (error) {
          this.$message.error('删除失败')
        }
      }).catch(() => {})
    },

    // 提交表单
    async submitForm() {
      this.$refs.petForm.validate(async valid => {
        if (valid) {
          try {
            this.submitLoading = true
            
            if (this.petForm.id) {
              const index = this.pets.findIndex(pet => pet.id === this.petForm.id)
              this.pets[index] = { ...this.petForm }
            } else {
              // 调用添加宠物API
              const response = await addPet(this.petForm)
              this.pets.push(response.data)
            }

            this.$message.success(this.petForm.id ? '编辑成功' : '添加成功')
            this.dialogVisible = false
            this.fetchPets()
          } catch (error) {
            this.$message.error(this.petForm.id ? '编辑失败' : '添加失败')
          } finally {
            this.submitLoading = false
          }
        }
      })
    },

    // 头像上传成功
    handleAvatarSuccess(response) {
      this.petForm.avatar = response.url
    },

    // 头像上传前的验证
    beforeAvatarUpload(file) {
      const isImage = file.type.startsWith('image/')
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isImage) {
        this.$message.error('上传头像图片只能是图片格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }

      return isImage && isLt2M
    }
  }
}
</script>


<style scoped>
.pets-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
  animation: fadeIn 0.5s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.pets-card {
  max-width: 1200px;
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

.pets-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.pets-header h2 {
  font-size: 28px;
  font-weight: 600;
  margin: 0;
  background: linear-gradient(45deg, #409EFF, #764ba2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.pets-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.pet-item {
  position: relative;
  transition: all 0.3s ease;
  border-radius: 12px;
  overflow: hidden;
}

.pet-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
}

.pet-avatar {
  width: 100px;
  height: 100px;
  margin: 0 auto 15px;
  border-radius: 50%;
  overflow: hidden;
  border: 3px solid #409EFF;
}

.pet-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.pet-info {
  text-align: center;
}

.pet-info h3 {
  font-size: 20px;
  margin: 0 0 10px;
  color: #303133;
}

.pet-info p {
  margin: 5px 0;
  color: #606266;
}

.pet-actions {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 15px;
  padding-top: 15px;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
}

.delete-btn {
  color: #f56c6c;
}

.empty-state {
  text-align: center;
  padding: 40px 20px;
}

.empty-state i {
  font-size: 64px;
  color: #409EFF;
  margin-bottom: 20px;
}

.empty-state p {
  color: #606266;
  margin-bottom: 20px;
}

.avatar-uploader {
  text-align: center;
}

.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 100px;
  height: 100px;
  line-height: 100px;
  text-align: center;
}

.avatar {
  width: 100px;
  height: 100px;
  display: block;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 20px;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .pets-card {
    padding: 20px;
  }

  .pets-header h2 {
    font-size: 24px;
  }

  .pets-list {
    grid-template-columns: 1fr;
  }
}
</style> 