<template>
  <div class="vaccine-container">
    <el-card class="vaccine-card">
      <div class="vaccine-header">
        <div class="header-left">
          <el-button type="text" icon="el-icon-back" @click="$router.push('/index')">返回主页</el-button>
          <h2>疫苗接种记录</h2>
        </div>
        <div class="header-right">
          <el-select
            v-model="selectedPetId"
            placeholder="选择宠物筛选"
            clearable
            @change="handlePetFilter"
            class="pet-filter">
            <el-option
              v-for="pet in pets"
              :key="pet.id"
              :label="pet.name"
              :value="pet.id">
            </el-option>
          </el-select>
          <el-button type="primary" icon="el-icon-plus" @click="handleAdd">添加接种记录</el-button>
        </div>
      </div>

      <!-- 疫苗记录列表 -->
      <div class="vaccine-list" v-if="records.length > 0">
        <el-card v-for="record in records" :key="record.id" class="record-item" shadow="hover">
          <div class="record-icon">
            <i class="el-icon-vaccine">💉</i>
          </div>
          <div class="record-info">
            <h3>{{ record.petName }}</h3>
            <p class="vaccine-name">疫苗名称：{{ record.vaccineName }}</p>
            <p class="vaccine-date">接种日期：{{ formatDate(record.vaccineDate) }}</p>
            <p class="next-date">下次接种：{{ formatDate(record.nextDate) }}</p>
            <p class="hospital">接种医院：{{ record.hospital }}</p>
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
        <i class="el-icon-vaccine">💉</i>
        <p>还没有疫苗接种记录，快来添加一条吧！</p>
        <el-button type="primary" icon="el-icon-plus" @click="handleAdd">添加接种记录</el-button>
      </div>
    </el-card>

    <!-- 添加/编辑记录对话框 -->
    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="500px">
      <el-form :model="recordForm" :rules="rules" ref="recordForm" label-width="100px">
        <el-form-item label="选择宠物" prop="petId">
          <el-select v-model="recordForm.petId" placeholder="请选择宠物" @change="handlePetChange">
            <el-option
              v-for="pet in pets"
              :key="pet.id"
              :label="pet.name"
              :value="pet.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="疫苗名称" prop="vaccineName">
          <el-input v-model="recordForm.vaccineName" placeholder="请输入疫苗名称"></el-input>
        </el-form-item>
        <el-form-item label="接种日期" prop="vaccineDate">
          <el-date-picker
            v-model="recordForm.vaccineDate"
            type="date"
            placeholder="选择接种日期"
            value-format="yyyy-MM-dd">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="接种间隔:月" prop="gap">
          <el-input-number v-model="recordForm.gap" :min="0" :max="48" placeholder="接种间隔(月)"></el-input-number>
        </el-form-item>
        <el-form-item label="接种医院" prop="hospital">
          <el-input v-model="recordForm.hospital" placeholder="请输入接种医院"></el-input>
        </el-form-item>
        <el-form-item label="备注">
          <el-input
            type="textarea"
            v-model="recordForm.notes"
            placeholder="请输入备注信息"
            :rows="3">
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
import { getVaccineRecords, createVaccineRecord, updateVaccineRecord, deleteVaccineRecord } from '@/api/vaccine'
import { getPets } from '@/api/pets'

export default {
  name: 'Vaccine',
  data() {
    return {
      records: [], // 疫苗记录列表
      allRecords: [], // 所有疫苗记录
      pets: [], // 宠物列表
      selectedPetId: null, // 选中的宠物ID
      dialogVisible: false,
      dialogTitle: '添加接种记录',
      submitLoading: false,
      recordForm: {
        id: null,
        petId: '',
        petName: '',
        vaccineName: '',
        vaccineDate: '',
        nextDate: '',
        hospital: '',
        notes: ''
      },
      rules: {
        petId: [
          { required: true, message: '请选择宠物', trigger: 'change' }
        ],
        vaccineName: [
          { required: true, message: '请输入疫苗名称', trigger: 'blur' }
        ],
        vaccineDate: [
          { required: true, message: '请选择接种日期', trigger: 'change' }
        ],
        gap: [
          { required: true, message: '请输入接种间隔', trigger: 'blur' }
        ],
        hospital: [
          { required: true, message: '请输入接种医院', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.fetchRecords()
    this.fetchPets()
  },
  methods: {
    // 获取疫苗记录列表
    async fetchRecords(petId) {
      try {
        const response = await getVaccineRecords(petId)
        this.allRecords = response.data
        this.records = [...this.allRecords]
      } catch (error) {
        this.$message.error('获取疫苗记录失败')
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

    // 处理宠物筛选
    handlePetFilter(petId) {
      console.log("petId",petId)
      this.fetchRecords(this.selectedPetId)
    },

    // 添加记录
    handleAdd() {
      this.dialogTitle = '添加接种记录'
      this.recordForm = {
        id: null,
        petId: '',
        petName: '',
        vaccineName: '',
        vaccineDate: '',
        gap: 12,
        hospital: '',
        notes: ''
      }
      this.dialogVisible = true
    },

    // 编辑记录
    handleEdit(record) {
      this.dialogTitle = '编辑接种记录'
      this.recordForm = { ...record }
      this.dialogVisible = true
    },

    // 删除记录
    handleDelete(record) {
      this.$confirm('确定要删除这条接种记录吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        try {
          await deleteVaccineRecord(record.id)
          this.records = this.records.filter(item => item.id !== record.id)
          this.$message.success('删除成功')
        } catch (error) {
          this.$message.error('删除失败')
        }
      }).catch(() => {})
    },

    // 提交表单
    async submitForm() {
      this.$refs.recordForm.validate(async valid => {
        if (valid) {
          try {
            this.submitLoading = true
            if (this.recordForm.id) {
              await updateVaccineRecord(this.recordForm)
            } else {
              await createVaccineRecord(this.recordForm)
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
      if (diffDays <= 30) return 'status-upcoming'
      return 'status-normal'
    },

    // 获取状态文本
    getStatusText(record) {
      const now = new Date()
      const nextDate = new Date(record.nextDate)
      const diffDays = Math.ceil((nextDate - now) / (1000 * 60 * 60 * 24))
      
      if (diffDays < 0) return '已过期'
      if (diffDays <= 30) return '即将到期'
      return '正常'
    }
  }
}
</script>

<style scoped>
.vaccine-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
  animation: fadeIn 0.5s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.vaccine-card {
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

.vaccine-header {
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

.vaccine-header h2 {
  font-size: 28px;
  font-weight: 600;
  margin: 0;
  background: linear-gradient(45deg, #409EFF, #764ba2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 20px;
}

.pet-filter {
  width: 160px;
}

.vaccine-list {
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

/* 响应式调整 */
@media (max-width: 768px) {
  .vaccine-card {
    padding: 20px;
  }

  .vaccine-header h2 {
    font-size: 24px;
  }

  .vaccine-list {
    grid-template-columns: 1fr;
  }

  .record-item {
    padding: 15px;
  }
}
</style> 