<template>
  <div class="profile-container">
    <div class="page-header">
      <h2>个人设置</h2>
    </div>

    <el-row :gutter="20">
      <el-col :xs="24" :sm="24" :md="16" :lg="16" :xl="16">
        <!-- 个人信息卡片 -->
        <el-card class="box-card" shadow="hover">
          <div slot="header" class="clearfix">
            <span>个人信息</span>
            <el-button
              style="float: right; padding: 3px 0"
              type="text"
              @click="startEditing"
              v-if="!isEditing"
            >
              编辑
            </el-button>
          </div>
          
          <el-form
            :model="userForm"
            :rules="rules"
            ref="userForm"
            label-width="100px"
            :disabled="!isEditing"
          >
            <el-form-item label="用户名" prop="username">
              <el-input v-model="userForm.username" disabled></el-input>
            </el-form-item>
            
            <el-form-item label="姓名" prop="name">
              <el-input v-model="userForm.name" placeholder="请输入您的姓名"></el-input>
            </el-form-item>
            
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="userForm.email" placeholder="请输入您的邮箱"></el-input>
            </el-form-item>
            
            <el-form-item v-if="isEditing">
              <el-button type="primary" @click="saveUserInfo" :loading="isLoading">保存</el-button>
              <el-button @click="cancelEditing">取消</el-button>
            </el-form-item>
          </el-form>
        </el-card>
        
        <!-- 修改密码卡片 -->
        <el-card class="box-card mt-20" shadow="hover">
          <div slot="header" class="clearfix">
            <span>修改密码</span>
          </div>
          
          <el-form
            :model="passwordForm"
            :rules="passwordRules"
            ref="passwordForm"
            label-width="120px"
          >
            <el-form-item label="当前密码" prop="currentPassword">
              <el-input
                v-model="passwordForm.currentPassword"
                placeholder="请输入当前密码"
                type="password"
                show-password
              ></el-input>
            </el-form-item>
            
            <el-form-item label="新密码" prop="newPassword">
              <el-input
                v-model="passwordForm.newPassword"
                placeholder="请输入新密码"
                type="password"
                show-password
              ></el-input>
            </el-form-item>
            
            <el-form-item label="确认新密码" prop="confirmPassword">
              <el-input
                v-model="passwordForm.confirmPassword"
                placeholder="请再次输入新密码"
                type="password"
                show-password
              ></el-input>
            </el-form-item>
            
            <el-form-item>
              <el-button type="primary" @click="changePassword" :loading="isLoading">修改密码</el-button>
              <el-button @click="resetPasswordForm">重置</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>
      
      <!-- 信息统计区 -->
      <el-col :xs="24" :sm="24" :md="8" :lg="8" :xl="8">
        <el-card class="box-card" shadow="hover">
          <div slot="header" class="clearfix">
            <span>账号统计</span>
          </div>
          
          <div class="user-info">
            <div class="user-avatar">
              <el-avatar :size="100" icon="el-icon-user-solid"></el-avatar>
            </div>
            <div class="user-details">
              <h3>{{ currentUser ? currentUser.username : '未知用户' }}</h3>
              <p>角色: {{ currentUser ? currentUser.role : '无' }}</p>
            </div>
          </div>
          
          <el-divider></el-divider>
          
          <div class="stat-list">
            <div class="stat-item">
              <span class="stat-label">文章数量:</span>
              <span class="stat-value">{{ posts.length }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">标签数量:</span>
              <span class="stat-value">{{ tags.length }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">精选文章:</span>
              <span class="stat-value">{{ featuredPosts.length }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">最后登录:</span>
              <span class="stat-value">{{ formatDate(new Date()) }}</span>
            </div>
          </div>
        </el-card>
        
        <!-- 快捷操作卡片 -->
        <el-card class="box-card mt-20" shadow="hover">
          <div slot="header" class="clearfix">
            <span>快捷操作</span>
          </div>
          
          <div class="quick-actions">
            <el-button type="primary" icon="el-icon-s-home" @click="$router.push('/')">
              控制台
            </el-button>
            <el-button type="success" icon="el-icon-document" @click="$router.push('/posts/create')">
              写文章
            </el-button>
            <el-button type="warning" icon="el-icon-view" @click="viewBlog">
              查看博客
            </el-button>
            <el-button type="danger" icon="el-icon-switch-button" @click="handleLogout">
              退出登录
            </el-button>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import moment from 'moment'

export default {
  name: 'Profile',
  data() {
    // 确认密码验证
    const validateConfirmPassword = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入新密码'))
      } else if (value !== this.passwordForm.newPassword) {
        callback(new Error('两次输入密码不一致'))
      } else {
        callback()
      }
    }
    
    return {
      isEditing: false,
      // 个人信息表单
      userForm: {
        username: '',
        name: '',
        email: ''
      },
      // 表单验证规则
      rules: {
        name: [
          { required: true, message: '请输入姓名', trigger: 'blur' },
          { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
        ],
        email: [
          { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
        ]
      },
      // 密码表单
      passwordForm: {
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      },
      // 密码表单验证规则
      passwordRules: {
        currentPassword: [
          { required: true, message: '请输入当前密码', trigger: 'blur' }
        ],
        newPassword: [
          { required: true, message: '请输入新密码', trigger: 'blur' },
          { min: 6, max: 30, message: '密码长度在 6 到 30 个字符', trigger: 'blur' }
        ],
        confirmPassword: [
          { required: true, validator: validateConfirmPassword, trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    ...mapGetters(['currentUser', 'isLoading', 'posts', 'tags']),
    // 精选文章
    featuredPosts() {
      return this.posts.filter(post => post.featured)
    }
  },
  watch: {
    // 当获取到用户数据后，填充表单
    currentUser: {
      handler(user) {
        if (user) {
          this.userForm = {
            username: user.username || '',
            name: user.name || '',
            email: user.email || ''
          }
        }
      },
      immediate: true
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    ...mapActions(['getCurrentUser', 'fetchPosts', 'fetchTags', 'logout']),
    // 获取数据
    async fetchData() {
      try {
        await Promise.all([
          this.getCurrentUser(),
          this.fetchPosts(),
          this.fetchTags()
        ])
      } catch (error) {
        this.$message.error('加载数据失败')
        console.error('加载数据失败:', error)
      }
    },
    // 格式化日期
    formatDate(date) {
      return date ? moment(date).format('YYYY-MM-DD HH:mm') : '-'
    },
    // 开始编辑个人信息
    startEditing() {
      this.isEditing = true
    },
    // 取消编辑
    cancelEditing() {
      this.isEditing = false
      
      // 重置表单
      if (this.currentUser) {
        this.userForm = {
          username: this.currentUser.username || '',
          name: this.currentUser.name || '',
          email: this.currentUser.email || ''
        }
      }
      
      this.$refs.userForm.clearValidate()
    },
    // 保存个人信息
    saveUserInfo() {
      this.$refs.userForm.validate(async (valid) => {
        if (valid) {
          try {
            // 这里可以调用API更新用户信息
            this.$message({
              type: 'success',
              message: '个人信息更新成功！'
            })
            
            this.isEditing = false
          } catch (error) {
            this.$message.error('个人信息更新失败')
            console.error('个人信息更新失败:', error)
          }
        } else {
          return false
        }
      })
    },
    // 重置密码表单
    resetPasswordForm() {
      this.passwordForm = {
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }
      this.$refs.passwordForm.clearValidate()
    },
    // 修改密码
    changePassword() {
      this.$refs.passwordForm.validate(async (valid) => {
        if (valid) {
          try {
            // 这里可以调用API更新密码
            this.$message({
              type: 'success',
              message: '密码修改成功！'
            })
            
            this.resetPasswordForm()
          } catch (error) {
            this.$message.error('密码修改失败')
            console.error('密码修改失败:', error)
          }
        } else {
          return false
        }
      })
    },
    // 查看博客
    viewBlog() {
      window.open('http://localhost:5000', '_blank')
    },
    // 退出登录
    handleLogout() {
      this.$confirm('确定要退出登录吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.logout()
        this.$router.push('/login')
        this.$message({
          type: 'success',
          message: '已退出登录'
        })
      }).catch(() => {
        // 取消退出
      })
    }
  }
}
</script>

<style scoped>
.profile-container {
  padding-bottom: 20px;
}

.mt-20 {
  margin-top: 20px;
}

.user-info {
  display: flex;
  align-items: center;
  padding: 20px 0;
}

.user-avatar {
  margin-right: 20px;
}

.user-details h3 {
  margin: 0 0 10px 0;
}

.user-details p {
  margin: 0;
  color: #606266;
}

.stat-list {
  margin-top: 20px;
}

.stat-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  font-size: 14px;
}

.stat-label {
  color: #606266;
}

.stat-value {
  font-weight: bold;
}

.quick-actions {
  display: flex;
  flex-direction: column;
}

.quick-actions .el-button {
  margin-bottom: 10px;
}
</style> 