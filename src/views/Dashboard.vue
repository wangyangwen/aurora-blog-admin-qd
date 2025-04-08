<template>
  <div class="dashboard-container">
    <el-row :gutter="20">
      <!-- 总览卡片 -->
      <el-col :span="8">
        <el-card shadow="hover">
          <div slot="header" class="clearfix">
            <span>文章总数</span>
          </div>
          <div class="stat-value">
            <i class="el-icon-document"></i>
            <span>{{ posts.length }}</span>
          </div>
        </el-card>
      </el-col>
      
      <el-col :span="8">
        <el-card shadow="hover">
          <div slot="header" class="clearfix">
            <span>标签总数</span>
          </div>
          <div class="stat-value">
            <i class="el-icon-collection-tag"></i>
            <span>{{ tags.length }}</span>
          </div>
        </el-card>
      </el-col>
      
      <el-col :span="8">
        <el-card shadow="hover">
          <div slot="header" class="clearfix">
            <span>精选文章</span>
          </div>
          <div class="stat-value">
            <i class="el-icon-star-on"></i>
            <span>{{ featuredPosts.length }}</span>
          </div>
        </el-card>
      </el-col>
    </el-row>
    
    <el-row :gutter="20" class="mt-20">
      <!-- 最近文章 -->
      <el-col :span="16">
        <el-card shadow="hover">
          <div slot="header" class="clearfix">
            <span>最近文章</span>
            <router-link to="/posts" style="float: right; padding: 3px 0">
              <el-button type="text" size="small">查看全部</el-button>
            </router-link>
          </div>
          
          <el-table :data="recentPosts" style="width: 100%" v-loading="isLoading">
            <el-table-column prop="title" label="标题" min-width="200">
              <template slot-scope="scope">
                <el-link :underline="false" type="primary" @click="goToEdit(scope.row)">
                  {{ scope.row.title }}
                </el-link>
              </template>
            </el-table-column>
            <el-table-column prop="createdAt" label="创建时间" width="180">
              <template slot-scope="scope">
                {{ formatDate(scope.row.createdAt) }}
              </template>
            </el-table-column>
            <el-table-column prop="featured" label="精选" width="80">
              <template slot-scope="scope">
                <el-tag v-if="scope.row.featured" type="success" size="small">精选</el-tag>
                <el-tag v-else type="info" size="small">普通</el-tag>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
      
      <!-- 常用标签 -->
      <el-col :span="8">
        <el-card shadow="hover">
          <div slot="header" class="clearfix">
            <span>常用标签</span>
            <router-link to="/tags" style="float: right; padding: 3px 0">
              <el-button type="text" size="small">查看全部</el-button>
            </router-link>
          </div>
          
          <div class="tag-cloud" v-loading="isLoading">
            <el-tag
              v-for="tag in topTags"
              :key="tag._id"
              :type="randomTagType()"
              effect="light"
              class="tag-item"
            >
              {{ tag.name }}
              <span class="tag-count">({{ tag.count }})</span>
            </el-tag>
            
            <div v-if="topTags.length === 0" class="empty-text">
              还没有标签，请先添加一些标签
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    
    <!-- 快速操作 -->
    <el-row :gutter="20" class="mt-20">
      <el-col :span="24">
        <el-card shadow="hover">
          <div slot="header" class="clearfix">
            <span>快速操作</span>
          </div>
          
          <div class="quick-actions">
            <el-button type="primary" icon="el-icon-plus" @click="$router.push('/posts/create')">
              新建文章
            </el-button>
            <el-button type="success" icon="el-icon-refresh" @click="generateBlog">
              生成博客
            </el-button>
            <el-button type="warning" icon="el-icon-view" @click="viewBlog">
              查看博客
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
  name: 'Dashboard',
  data() {
    return {
      // 标签类型列表
      tagTypes: ['', 'success', 'info', 'warning', 'danger']
    }
  },
  computed: {
    ...mapGetters(['posts', 'tags', 'isLoading']),
    // 最近文章（最多5篇）
    recentPosts() {
      return [...this.posts]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5)
    },
    // 精选文章
    featuredPosts() {
      return this.posts.filter(post => post.featured)
    },
    // 最常用的标签（最多10个）
    topTags() {
      return [...this.tags]
        .sort((a, b) => b.count - a.count)
        .slice(0, 10)
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    ...mapActions(['fetchPosts', 'fetchTags']),
    // 加载数据
    async fetchData() {
      try {
        await Promise.all([
          this.fetchPosts(),
          this.fetchTags()
        ])
      } catch (error) {
        this.$message.error('加载数据失败')
      }
    },
    // 格式化日期
    formatDate(date) {
      return moment(date).format('YYYY-MM-DD HH:mm')
    },
    // 随机标签类型
    randomTagType() {
      return this.tagTypes[Math.floor(Math.random() * this.tagTypes.length)]
    },
    // 跳转到编辑页面
    goToEdit(post) {
      this.$router.push(`/posts/edit/${post.slug}`)
    },
    // 生成博客
    generateBlog() {
      this.$message({
        type: 'info',
        message: '正在生成博客，请稍候...'
      })
      
      // 这里可以调用API来触发博客生成
      this.$http.post('/hexo/generate')
        .then(() => {
          this.$message({
            type: 'success',
            message: '博客生成成功！'
          })
        })
        .catch(_ => {
          this.$message.error('博客生成失败')
        })
    },
    // 查看博客
    viewBlog() {
      window.open('http://localhost:5000', '_blank')
    }
  }
}
</script>

<style scoped>
.dashboard-container {
  padding: 20px 0;
}

.stat-value {
  font-size: 24px;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 80px;
}

.stat-value i {
  margin-right: 10px;
  font-size: 28px;
}

.tag-cloud {
  min-height: 200px;
}

.tag-item {
  margin: 5px;
}

.tag-count {
  font-size: 12px;
  margin-left: 3px;
}

.quick-actions {
  display: flex;
  justify-content: center;
  gap: 20px;
  padding: 20px 0;
}

.empty-text {
  color: #909399;
  text-align: center;
  margin-top: 50px;
}
</style>