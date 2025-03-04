<template>
  <div class="deworming-container">
    <el-card class="deworming-card">
      <div class="deworming-header">
        <div class="header-left">
          <el-button type="text" icon="el-icon-back" @click="$router.push('/index')">返回主页</el-button>
          <h2>驱虫记录</h2>
        </div>
        <div class="header-right">
          <el-select v-model="selectedPetId" placeholder="选择宠物筛选" clearable @change="handlePetFilter"
            class="pet-filter">
            <el-option v-for="pet in pets" :key="pet.id" :label="pet.name" :value="pet.id">
            </el-option>
          </el-select>
          <el-button type="primary" icon="el-icon-plus" @click="handleAdd">添加驱虫记录</el-button>
        </div>
      </div>

      <!-- 驱虫记录列表 -->
      <div class="deworming-list" v-if="records.length > 0">
        <el-card v-for="record in records" :key="record.id" class="record-item" shadow="hover">
          <div class="record-icon">
            <i class="el-icon-medicine">💊</i>
          </div>
          <div class="record-info">
            <h3>{{ record.petName }}</h3>
            <p class="medicine-name">驱虫药类型：{{ getDewormType(record.dewormType) }}</p>
            <p class="medicine-name">驱虫药名称：{{ record.productName }}</p>
            <p class="dosage">用药剂量：{{ record.metering }}ml</p>
            <p class="medicine-date">驱虫日期：{{ formatDate(record.dewormDate) }}</p>
            <p class="next-date">下次驱虫：{{ formatDate(record.nextDate) }}</p>
            <p class="weight">体重：{{ record.weight }}kg</p>
            <p class="notes" v-if="record.address">地址：{{ record.address }}</p>
            <p class="notes" v-if="record.notes">备注：{{ record.notes }}</p>
          </div>
          <div class="record-status" :class="getStatusClass(record)">
            {{ getStatusText(record) }}
          </div>
          <div class="record-actions">
            <el-button type="text" icon="el-icon-edit" @click="handleEdit(record)">编辑</el-button>
            <el-button type="text" icon="el-icon-delete" class="delete-btn" @click="handleDelete(record)">删除</el-button>
          </div>
        </el-card>
      </div>

      <!-- 空状态 -->
      <div v-else class="empty-state">
        <i class="el-icon-medicine">💊</i>
        <p>还没有驱虫记录，快来添加一条吧！</p>
        <el-button type="primary" icon="el-icon-plus" @click="handleAdd">添加驱虫记录</el-button>
      </div>
    </el-card>

    <!-- 添加/编辑记录对话框 -->
    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="500px">
      <el-form :model="recordForm" :rules="rules" ref="recordForm" label-width="100px">
        <el-form-item label="选择宠物" prop="petId">
          <el-select v-model="recordForm.petId" placeholder="请选择宠物" @change="handlePetChange">
            <el-option v-for="pet in pets" :key="pet.id" :label="pet.name" :value="pet.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="驱虫药类型" prop="dewormType">
          <el-select v-model="recordForm.dewormType" placeholder="请选择驱虫药类型">
            <el-option label="体内" value="internal"></el-option>
            <el-option label="体外" value="external"></el-option>
            <el-option label="混合" value="mixed"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="驱虫药名称" prop="productName">
          <el-input v-model="recordForm.productName" placeholder="请输入驱虫药名称"></el-input>
        </el-form-item>
        <el-form-item label="用药剂量 ml" prop="metering">
          <el-input-number v-model="recordForm.metering" :precision="1" :step="0.1" :min="0" placeholder="请输入用药剂量">
          </el-input-number>
        </el-form-item>
        <el-form-item label="驱虫日期" prop="dewormDate">
          <el-date-picker v-model="recordForm.dewormDate" type="date" placeholder="选择驱虫日期" value-format="yyyy-MM-dd">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="接种间隔:月" prop="gap">
          <el-input-number v-model="recordForm.gap" :min="0" :max="48" placeholder="接种间隔(月)"></el-input-number>
        </el-form-item>
        <el-form-item label="体重 kg" prop="weight">
          <el-input-number v-model="recordForm.weight" :precision="1" :step="0.1" :min="0" placeholder="请输入宠物体重">
          </el-input-number>
        </el-form-item>
        <el-form-item label="地点">
          <el-input v-model="recordForm.address" placeholder="请输入驱虫地点">
          </el-input>
        </el-form-item>
        <el-form-item label="备注">
          <el-input type="textarea" v-model="recordForm.notes" placeholder="请输入备注信息" :rows="3">
          </el-input>
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

import { getPets } from '@/api/pets'
import { getDewormingRecords, createDewormingRecord, updateDewormingRecord, deleteDewormingRecord } from '@/api/deworming'
export default {
  name: 'Deworming',
  data() {
    return {
      records: [], // 驱虫记录列表
      pets: [], // 宠物列表
      dialogVisible: false,
      dialogTitle: '添加驱虫记录',
      submitLoading: false,
      recordForm: {},
      rules: {
        petId: [
          { required: true, message: '请选择宠物', trigger: 'change' }
        ],
        dewormType: [
          { required: true, message: '请驱虫药类型', trigger: 'change' }
        ],
        productName: [
          { required: true, message: '请输入驱虫药名称', trigger: 'blur' }
        ],
        dewormDate: [
          { required: true, message: '请选择驱虫日期', trigger: 'change' }
        ],
        gap: [
          { required: true, message: '请选择驱虫间隔', trigger: 'blur' }
        ],
        weight: [
          { required: true, message: '请输入宠物体重', trigger: 'blur' }
        ],
        metering: [
          { required: true, message: '请输入用药剂量', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.fetchRecords()
    this.fetchPets()
  },
  methods: {
    // 获取驱虫记录列表
    async fetchRecords() {
      try {
        const response = await getDewormingRecords()
        this.records = response.data
      } catch (error) {
        this.$message.error('获取驱虫记录失败')
      }
    },

    // 获取宠物列表

    async fetchPets() {
      try {
        const response = await getPets()
        this.pets = response.data
      } catch (error) {
        this.$message.error('获取宠物列表失败')
      }
    },

    // 添加记录
    handleAdd() {
      this.dialogTitle = '添加驱虫记录'
      this.recordForm = {
        id: null,
        petId: '',
        dewormType: '',
        productName: '',
        metering: '',
        weight: '',
        dewormDate: '',
        gap: '',
        address: '',
        notes: ''
      }
      this.dialogVisible = true
    },

    // 编辑记录
    handleEdit(record) {
      this.dialogTitle = '编辑驱虫记录'
      this.recordForm = { ...record }
      this.dialogVisible = true
    },

    // 删除记录
    handleDelete(record) {
      this.$confirm('确定要删除这条驱虫记录吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        try {
          // TODO: 调用删除记录API
          // await deleteDewormingRecord(record.id)
          this.records = this.records.filter(item => item.id !== record.id)
          this.$message.success('删除成功')
        } catch (error) {
          this.$message.error('删除失败')
        }
      }).catch(() => { })
    },

    // 提交表单
    async submitForm() {
      this.$refs.recordForm.validate(async valid => {
        if (valid) {
          try {
            this.submitLoading = true
            // 模拟API调用
            if (this.recordForm.id) {
              const index = this.records.findIndex(record => record.id === this.recordForm.id)
              this.records[index] = {
                ...this.recordForm,
                petName: this.getPetName(this.recordForm.petId)
              }
            } else {
              await createDewormingRecord(this.recordForm)
            }
            this.$message.success(this.recordForm.id ? '编辑成功' : '添加成功')
            this.dialogVisible = false
            this.fetchRecords()
          } catch (error) {
            this.$message.error(this.recordForm.id ? '编辑失败' : '添加失败')
          } finally {
            this.submitLoading = false
          }
        }
      })
    },

    // 选择宠物时更新宠物名称
    handlePetChange(petId) {
      const pet = this.pets.find(p => p.id === petId)
      if (pet) {
        this.recordForm.petName = pet.name
      }
    },

    // 获取宠物名称
    getPetName(petId) {
      const pet = this.pets.find(p => p.id === petId)
      return pet ? pet.name : ''
    },

    // 格式化日期
    formatDate(date) {
      if (!date) return ''
      return date.split('-').join('/')
    },

    // 获取状态样式类
    getStatusClass(record) {
      const now = new Date()
      const nextDate = new Date(record.nextDate)
      const diffDays = Math.ceil((nextDate - now) / (1000 * 60 * 60 * 24))

      if (diffDays < 0) return 'status-expired'
      if (diffDays <= 7) return 'status-upcoming'
      return 'status-normal'
    },

    // 获取状态文本
    getStatusText(record) {
      const now = new Date()
      const nextDate = new Date(record.nextDate)
      const diffDays = Math.ceil((nextDate - now) / (1000 * 60 * 60 * 24))

      if (diffDays < 0) return '已过期'
      if (diffDays <= 7) return '即将到期'
      return '正常'
    },
    getDewormType(type) {
      const typeMap = {
        'internal': '体内',
        'external': '体外',
        'mixed': '混合'
      }
      return typeMap[type] || type || '未知'
    },
  }
}
</script>

<style scoped>
.deworming-container {
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

.deworming-card {
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

.deworming-header {
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

.header-left .el-button {
  font-size: 16px;
}

.deworming-header h2 {
  font-size: 28px;
  font-weight: 600;
  margin: 0;
  background: linear-gradient(45deg, #409EFF, #764ba2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.deworming-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 20px;
}

.record-item {
  position: relative;
  transition: all 0.3s ease;
  border-radius: 12px;
  overflow: hidden;
  padding: 20px;
}

.record-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
}

.record-icon {
  font-size: 32px;
  margin-bottom: 15px;
  color: #409EFF;
  text-align: center;
}

.record-info {
  text-align: left;
}

.record-info h3 {
  font-size: 20px;
  margin: 0 0 15px;
  color: #303133;
}

.record-info p {
  margin: 8px 0;
  color: #606266;
  font-size: 14px;
}

.record-status {
  position: absolute;
  top: 20px;
  right: 20px;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
}

.status-normal {
  background-color: #f0f9eb;
  color: #67c23a;
}

.status-upcoming {
  background-color: #fdf6ec;
  color: #e6a23c;
}

.status-expired {
  background-color: #fef0f0;
  color: #f56c6c;
}

.record-actions {
  display: flex;
  justify-content: flex-end;
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

.header-right {
  display: flex;
  align-items: center;
  gap: 20px;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .deworming-card {
    padding: 20px;
  }

  .deworming-header h2 {
    font-size: 24px;
  }

  .deworming-list {
    grid-template-columns: 1fr;
  }

  .record-item {
    padding: 15px;
  }
}
</style>