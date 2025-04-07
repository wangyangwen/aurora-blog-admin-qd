<template>
  <el-container class="layout-container">
    <!-- 侧边栏 -->
    <el-aside width="200px" class="aside">
      <div class="logo">
        <h2>Aurora</h2>
      </div>
      <el-menu
        class="menu"
        :default-active="activeMenu"
        background-color="#304156"
        text-color="#fff"
        active-text-color="#ffd04b"
        router
        unique-opened
      >
        <el-menu-item index="/">
          <i class="el-icon-s-home"></i>
          <span slot="title">Dashboard</span>
        </el-menu-item>
        
        <el-submenu index="post">
          <template slot="title">
            <i class="el-icon-document"></i>
            <span>文章管理</span>
          </template>
          <el-menu-item index="/posts">
            <i class="el-icon-s-order"></i>
            <span>文章列表</span>
          </el-menu-item>
          <el-menu-item index="/posts/create">
            <i class="el-icon-plus"></i>
            <span>新建文章</span>
          </el-menu-item>
        </el-submenu>
        
        <el-menu-item index="/tags">
          <i class="el-icon-collection-tag"></i>
          <span slot="title">标签管理</span>
        </el-menu-item>
        
        <el-menu-item index="/profile">
          <i class="el-icon-user"></i>
          <span slot="title">个人设置</span>
        </el-menu-item>
      </el-menu>
    </el-aside>
    
    <!-- 主体区域 -->
    <el-container class="main-container">
      <!-- 头部 -->
      <el-header class="header">
        <div class="header-left">
          <i class="el-icon-s-fold toggle-button" @click="toggleSidebar"></i>
          <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item v-if="$route.meta && $route.meta.title">
              {{ $route.meta.title }}
            </el-breadcrumb-item>
          </el-breadcrumb>
        </div>
        <div class="header-right">
          <el-dropdown trigger="click" @command="handleCommand">
            <span class="user-info">
              <span class="username">{{ currentUser ? currentUser.username : '未登录' }}</span>
              <i class="el-icon-caret-bottom"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="profile">个人设置</el-dropdown-item>
              <el-dropdown-item command="blog" divided>前往博客</el-dropdown-item>
              <el-dropdown-item command="logout" divided>退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </el-header>
      
      <!-- 主体内容 -->
      <el-main class="main">
        <router-view />
      </el-main>
      
      <!-- 底部 -->
      <el-footer class="footer">
        <p>Aurora Blog Admin &copy; {{ new Date().getFullYear() }}</p>
      </el-footer>
    </el-container>
  </el-container>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'Layout',
  data() {
    return {
      isCollapsed: false
    }
  },
  computed: {
    ...mapGetters(['currentUser']),
    activeMenu() {
      return this.$route.path
    }
  },
  created() {
    // 尝试获取用户信息
    this.getCurrentUser().catch(err => {
      console.error('获取用户信息失败', err)
    })
  },
  methods: {
    ...mapActions(['logout', 'getCurrentUser']),
    toggleSidebar() {
      this.isCollapsed = !this.isCollapsed
    },
    handleCommand(command) {
      if (command === 'logout') {
        this.logout()
        this.$message({
          type: 'success',
          message: '已退出登录！'
        })
        this.$router.push('/login')
      } else if (command === 'profile') {
        this.$router.push('/profile')
      } else if (command === 'blog') {
        window.open('http://localhost:5000', '_blank')
      }
    }
  }
}
</script>

<style scoped>
.layout-container {
  height: 100vh;
}

.aside {
  background-color: #304156;
  color: white;
  height: 100%;
  overflow: hidden;
}

.logo {
  height: 60px;
  line-height: 60px;
  text-align: center;
  background-color: #263445;
  color: #fff;
}

.menu {
  border-right: none;
  height: calc(100% - 60px);
}

.header {
  background-color: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-left, .header-right {
  display: flex;
  align-items: center;
}

.toggle-button {
  padding: 0 15px;
  font-size: 20px;
  cursor: pointer;
}

.user-info {
  cursor: pointer;
  display: flex;
  align-items: center;
}

.username {
  margin-right: 5px;
}

.main-container {
  height: 100%;
  overflow: hidden;
}

.main {
  background-color: #f0f2f5;
  overflow-y: auto;
  padding: 20px;
}

.footer {
  text-align: center;
  background-color: #fff;
  line-height: 60px;
  color: #606266;
  font-size: 14px;
}
</style> 