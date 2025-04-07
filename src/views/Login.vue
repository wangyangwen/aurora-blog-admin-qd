<template>
  <div class="login-container">
    <el-card class="login-card">
      <div slot="header" class="text-center">
        <h2>Aurora 博客管理系统</h2>
      </div>
      <el-form :model="loginForm" status-icon :rules="rules" ref="loginForm" label-width="0px">
        <h3 class="text-center">用户登录</h3>
        <el-form-item prop="username">
          <el-input 
            v-model="loginForm.username" 
            prefix-icon="el-icon-user" 
            placeholder="请输入用户名">
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input 
            v-model="loginForm.password" 
            prefix-icon="el-icon-lock" 
            type="password" 
            placeholder="请输入密码">
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button 
            type="primary" 
            :loading="loading" 
            class="login-button" 
            @click="handleLogin">
            登录
          </el-button>
        </el-form-item>
        <div class="text-center">
          <router-link to="/register">
            没有账号？立即注册
          </router-link>
        </div>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'Login',
  data() {
    return {
      loginForm: {
        username: '',
        password: ''
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 30, message: '长度在 6 到 30 个字符', trigger: 'blur' }
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
    ...mapActions(['login']),
    handleLogin() {
      this.$refs.loginForm.validate(async (valid) => {
        if (valid) {
          try {
            await this.login(this.loginForm)
            
            // 获取重定向地址或默认到首页
            const redirectPath = this.$route.query.redirect || '/'
            this.$router.push(redirectPath)
            
            this.$message({
              type: 'success',
              message: '登录成功！'
            })
          } catch (error) {
            console.error('登录失败:', error)
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
.login-container {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f5f7fa;
}

.login-card {
  width: 400px;
  max-width: 100%;
}

.login-button {
  width: 100%;
}
</style> 