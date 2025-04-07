<template>
  <div class="post-list-container">
    <div class="page-header">
      <h2>文章管理</h2>
      <el-button type="primary" icon="el-icon-plus" @click="$router.push('/posts/create')">
        新建文章
      </el-button>
    </div>

    <!-- 搜索和筛选 -->
    <el-card class="filter-card">
      <el-form :inline="true" :model="filterForm" class="filter-form">
        <el-form-item label="标题搜索">
          <el-input
            v-model="filterForm.title"
            placeholder="请输入标题关键词"
            prefix-icon="el-icon-search"
            clearable
            @clear="handleFilter"
          ></el-input>
        </el-form-item>
        <el-form-item label="标签筛选">
          <el-select
            v-model="filterForm.tag"
            placeholder="请选择标签"
            clearable
            @change="handleFilter"
          >
            <el-option
              v-for="tag in tags"
              :key="tag.name"
              :label="tag.name"
              :value="tag.name"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleFilter">筛选</el-button>
          <el-button @click="resetFilter">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 文章列表 -->
    <el-card class="post-table-card">
      <el-table
        :data="filteredPosts"
        style="width: 100%"
        v-loading="isLoading"
        border
        stripe
        :default-sort="{prop: 'createdAt', order: 'descending'}"
      >
        <el-table-column prop="title" label="标题" min-width="150">
          <template slot-scope="scope">
            <el-link :underline="false" type="primary" @click="goToEdit(scope.row)">
              {{ scope.row.title }}
            </el-link>
          </template>
        </el-table-column>
        <el-table-column label="标签" width="200">
          <template slot-scope="scope">
            <el-tag
              v-for="tag in scope.row.tags"
              :key="tag"
              size="small"
              class="post-tag"
            >
              {{ tag }}
            </el-tag>
            <span v-if="!scope.row.tags || scope.row.tags.length === 0" class="text-muted">
              无标签
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="创建时间" width="160" sortable>
          <template slot-scope="scope">
            {{ formatDate(scope.row.createdAt) }}
          </template>
        </el-table-column>
        <el-table-column prop="updatedAt" label="更新时间" width="160" sortable>
          <template slot-scope="scope">
            {{ formatDate(scope.row.updatedAt) }}
          </template>
        </el-table-column>
        <el-table-column prop="featured" label="精选" width="80" sortable>
          <template slot-scope="scope">
            <el-tag v-if="scope.row.featured" type="success" size="small">是</el-tag>
            <el-tag v-else type="info" size="small">否</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" fixed="right">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-edit"
              @click="goToEdit(scope.row)"
              title="编辑"
            ></el-button>
            <el-button
              size="mini"
              type="success"
              icon="el-icon-view"
              @click="previewPost(scope.row)"
              title="预览"
            ></el-button>
            <el-button
              size="mini"
              type="danger"
              icon="el-icon-delete"
              @click="confirmDelete(scope.row)"
              title="删除"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 空状态 -->
      <div v-if="filteredPosts.length === 0 && !isLoading" class="empty-state">
        <i class="el-icon-document"></i>
        <p>暂无文章{{ filterActive ? '符合筛选条件' : '' }}</p>
        <el-button type="primary" @click="$router.push('/posts/create')">
          新建文章
        </el-button>
      </div>
    </el-card>

    <!-- 文章预览对话框 -->
    <el-dialog
      title="文章预览"
      :visible.sync="previewDialogVisible"
      width="70%"
      fullscreen
      class="preview-dialog"
    >
      <div v-if="currentPost" class="preview-container">
        <h1 class="preview-title">{{ currentPost.title }}</h1>
        <div class="preview-meta">
          <span>创建时间: {{ formatDate(currentPost.createdAt) }}</span>
          <span v-if="currentPost.tags && currentPost.tags.length > 0">
            标签:
            <el-tag
              v-for="tag in currentPost.tags"
              :key="tag"
              size="small"
              class="post-tag"
            >
              {{ tag }}
            </el-tag>
          </span>
        </div>
        <div class="markdown-content" v-html="renderedContent"></div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import moment from 'moment'
import { marked } from 'marked'

export default {
  name: 'PostList',
  data() {
    return {
      filterForm: {
        title: '',
        tag: ''
      },
      previewDialogVisible: false,
      currentPost: null
    }
  },
  computed: {
    ...mapGetters(['posts', 'tags', 'isLoading']),
    // 过滤后的文章列表
    filteredPosts() {
      let result = this.posts

      // 按标题筛选
      if (this.filterForm.title) {
        const keyword = this.filterForm.title.toLowerCase()
        result = result.filter(post => 
          post.title.toLowerCase().includes(keyword)
        )
      }

      // 按标签筛选
      if (this.filterForm.tag) {
        result = result.filter(post => 
          post.tags && post.tags.includes(this.filterForm.tag)
        )
      }

      return result
    },
    // 是否有激活的筛选条件
    filterActive() {
      return this.filterForm.title || this.filterForm.tag
    },
    // 渲染的Markdown内容
    renderedContent() {
      if (!this.currentPost) return ''
      return marked(this.currentPost.content)
    }
  },
  created() {
    this.fetchPosts()
    this.fetchTags()
  },
  methods: {
    ...mapActions(['fetchPosts', 'fetchTags', 'deletePost']),
    // 格式化日期
    formatDate(date) {
      return moment(date).format('YYYY-MM-DD HH:mm')
    },
    // 筛选处理
    handleFilter() {
      // 已通过计算属性实现筛选
    },
    // 重置筛选条件
    resetFilter() {
      this.filterForm = {
        title: '',
        tag: ''
      }
    },
    // 跳转到编辑页面
    goToEdit(post) {
      this.$router.push(`/posts/edit/${post.slug}`)
    },
    // 预览文章
    previewPost(post) {
      this.currentPost = post
      this.previewDialogVisible = true
    },
    // 确认删除
    confirmDelete(post) {
      this.$confirm(`确定要删除文章 "${post.title}" 吗？此操作不可恢复！`, '删除确认', {
        confirmButtonText: '确定删除',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.handleDelete(post)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 执行删除
    async handleDelete(post) {
      try {
        await this.deletePost(post.slug)
        this.$message({
          type: 'success',
          message: '文章删除成功！'
        })
      } catch (error) {
        this.$message.error('文章删除失败')
        console.error('文章删除失败:', error)
      }
    }
  }
}
</script>

<style scoped>
.post-list-container {
  padding-bottom: 20px;
}

.filter-card {
  margin-bottom: 20px;
}

.post-table-card {
  margin-bottom: 20px;
}

.post-tag {
  margin-right: 5px;
}

.text-muted {
  color: #909399;
  font-size: 12px;
}

.empty-state {
  padding: 40px 0;
  text-align: center;
}

.empty-state i {
  font-size: 48px;
  color: #909399;
  margin-bottom: 10px;
}

.empty-state p {
  color: #606266;
  margin-bottom: 20px;
}

.preview-container {
  padding: 0 20px;
}

.preview-title {
  text-align: center;
  margin-bottom: 10px;
}

.preview-meta {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
  color: #606266;
  font-size: 14px;
  border-bottom: 1px solid #ebeef5;
  padding-bottom: 15px;
}

.markdown-content {
  line-height: 1.8;
}

.markdown-content img {
  max-width: 100%;
}
</style> 