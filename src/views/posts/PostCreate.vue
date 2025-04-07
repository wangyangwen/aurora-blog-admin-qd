<template>
  <div class="post-create-container">
    <div class="page-header">
      <h2>新建文章</h2>
      <div>
        <el-button @click="$router.push('/posts')">返回列表</el-button>
        <el-button type="primary" @click="savePost" :loading="isLoading">保存文章</el-button>
      </div>
    </div>

    <el-row :gutter="20">
      <!-- 左侧表单 -->
      <el-col :span="24">
        <el-card class="box-card">
          <el-form :model="postForm" :rules="rules" ref="postForm" label-width="100px">
            <el-form-item label="文章标题" prop="title">
              <el-input v-model="postForm.title" placeholder="请输入文章标题"></el-input>
            </el-form-item>

            <el-form-item label="选择标签" prop="tags">
              <el-select
                v-model="postForm.tags"
                multiple
                filterable
                allow-create
                default-first-option
                placeholder="请选择标签（可多选）"
                style="width: 100%"
              >
                <el-option
                  v-for="tag in tags"
                  :key="tag.name"
                  :label="tag.name"
                  :value="tag.name"
                ></el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="所属分类" prop="categories">
              <el-select
                v-model="postForm.categories"
                multiple
                filterable
                allow-create
                default-first-option
                placeholder="请选择分类（可多选）"
                style="width: 100%"
              >
                <el-option
                  v-for="category in categories"
                  :key="category"
                  :label="category"
                  :value="category"
                ></el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="文章摘要" prop="excerpt">
              <el-input
                v-model="postForm.excerpt"
                type="textarea"
                :rows="2"
                placeholder="请输入文章摘要（可选）"
              ></el-input>
            </el-form-item>

            <el-form-item label="文章内容" prop="content">
              <div class="editor-wrapper">
                <div class="editor-area">
                  <textarea
                    v-model="postForm.content"
                    placeholder="请输入Markdown格式的文章内容..."
                  ></textarea>
                </div>
                <div class="preview-area">
                  <div class="markdown-preview" v-html="renderedContent"></div>
                </div>
              </div>
            </el-form-item>

            <el-form-item label="精选文章">
              <el-switch v-model="postForm.featured"></el-switch>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { marked } from 'marked'

export default {
  name: 'PostCreate',
  data() {
    return {
      postForm: {
        title: '',
        content: '',
        tags: [],
        categories: [],
        excerpt: '',
        featured: false
      },
      // 分类列表（示例）
      categories: ['博客', '教程', '笔记', '技术', '生活', '随笔'],
      rules: {
        title: [
          { required: true, message: '请输入文章标题', trigger: 'blur' },
          { min: 2, max: 100, message: '长度在 2 到 100 个字符', trigger: 'blur' }
        ],
        content: [
          { required: true, message: '请输入文章内容', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    ...mapGetters(['tags', 'isLoading']),
    // 渲染的Markdown内容
    renderedContent() {
      return this.postForm.content ? marked(this.postForm.content) : ''
    }
  },
  created() {
    this.fetchTags()
  },
  methods: {
    ...mapActions(['createPost', 'fetchTags']),
    // 保存文章
    savePost() {
      this.$refs.postForm.validate(async (valid) => {
        if (valid) {
          try {
            await this.createPost(this.postForm)
            
            this.$message({
              type: 'success',
              message: '文章创建成功！'
            })
            
            // 跳转到文章列表
            this.$router.push('/posts')
          } catch (error) {
            this.$message.error('文章创建失败')
            console.error('文章创建失败:', error)
          }
        } else {
          this.$message.warning('请完善文章信息')
          return false
        }
      })
    }
  }
}
</script>

<style scoped>
.post-create-container {
  padding-bottom: 20px;
}

.editor-wrapper {
  height: calc(100vh - 420px);
  min-height: 400px;
}
</style> 