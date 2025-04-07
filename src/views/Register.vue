<template>
  <div class="register-container">
    <el-card class="register-card">
      <div slot="header" class="text-center">
        <h2>Aurora 博客管理系统</h2>
      </div>
      <el-form :model="registerForm" status-icon :rules="rules" ref="registerForm" label-width="0px">
        <h3 class="text-center">用户注册</h3>
        <el-form-item prop="username">
          <el-input 
            v-model="registerForm.username" 
            prefix-icon="el-icon-user" 
            placeholder="请输入用户名">
          </el-input>
        </el-form-item>
        <el-form-item prop="name">
          <el-input 
            v-model="registerForm.name" 
            prefix-icon="el-icon-s-custom" 
            placeholder="请输入昵称">
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input 
            v-model="registerForm.password" 
            prefix-icon="el-icon-lock" 
            type="password" 
            placeholder="请输入密码">
          </el-input>
        </el-form-item>
        <el-form-item prop="confirmPassword">
          <el-input 
            v-model="registerForm.confirmPassword" 
            prefix-icon="el-icon-lock" 
            type="password" 
            placeholder="请确认密码">
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button 
            type="primary" 
            :loading="loading" 
            class="register-button" 
            @click="handleRegister">
            注册
          </el-button>
        </el-form-item>
        <div class="text-center">
          <router-link to="/login">
            已有账号？立即登录
          </router-link>
        </div>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'Register',
  data() {
    // 确认密码的验证规则
    const validateConfirmPassword = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.registerForm.password) {
        callback(new Error('两次输入密码不一致'))
      } else {
        callback()
      }
    }
    
    return {
      registerForm: {
        username: '',
        name: '',
        password: '',
        confirmPassword: ''
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '请输入昵称', trigger: 'blur' },
          { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 30, message: '长度在 6 到 30 个字符', trigger: 'blur' }
        ],
        confirmPassword: [
          { required: true, message: '请再次输入密码', trigger: 'blur' },
          { validator: validateConfirmPassword, trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    ...mapGetters(['isLoading']),
    loading() {
      return this.isLoading
    }
  },
  methods: {
    ...mapActions(['register']),
    handleRegister() {
      this.$refs.registerForm.validate(async (valid) => {
        if (valid) {
          try {
            // 准备注册数据
            const userData = {
              username: this.registerForm.username,
              name: this.registerForm.name,
              password: this.registerForm.password
            }
            
            await this.register(userData)
            
            this.$message({
              type: 'success',
              message: '注册成功！'
            })
            
            // 注册成功，跳转到首页
            this.$router.push('/')
          } catch (error) {
            console.error('注册失败:', error)
          }
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style scoped>
.register-container {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f5f7fa;
}

.register-card {
  width: 400px;
  max-width: 100%;
}

.register-button {
  width: 100%;
}
</style> 