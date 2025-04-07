<template>
  <div class="tag-list-container">
    <div class="page-header">
      <h2>标签管理</h2>
      <el-button type="primary" icon="el-icon-plus" @click="showCreateDialog">
        新建标签
      </el-button>
    </div>

    <el-row :gutter="20">
      <el-col :span="24">
        <el-card shadow="hover" class="tag-card">
          <el-table
            :data="tags"
            style="width: 100%"
            v-loading="isLoading"
            border
            stripe
          >
            <el-table-column prop="name" label="标签名称" width="180">
              <template slot-scope="scope">
                <el-tag>{{ scope.row.name }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="count" label="使用次数" width="120" sortable>
              <template slot-scope="scope">
                <span>{{ scope.row.count || 0 }}</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="150">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="danger"
                  icon="el-icon-delete"
                  @click="confirmDelete(scope.row)"
                  :disabled="scope.row.count > 0"
                  title="删除"
                ></el-button>
                <el-button
                  size="mini"
                  type="primary"
                  icon="el-icon-search"
                  @click="filterPostsByTag(scope.row.name)"
                  title="查看关联文章"
                ></el-button>
              </template>
            </el-table-column>
          </el-table>

          <!-- 空状态 -->
          <div v-if="tags.length === 0 && !isLoading" class="empty-state">
            <i class="el-icon-collection-tag"></i>
            <p>暂无标签</p>
            <el-button type="primary" @click="showCreateDialog">
              新建标签
            </el-button>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 新建标签对话框 -->
    <el-dialog title="新建标签" :visible.sync="createDialogVisible" width="30%">
      <el-form :model="tagForm" :rules="rules" ref="tagForm" label-width="80px">
        <el-form-item label="标签名称" prop="tag">
          <el-input v-model="tagForm.tag" placeholder="请输入标签名称"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="createDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="createTag" :loading="isLoading">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'TagList',
  data() {
    return {
      createDialogVisible: false,
      tagForm: {
        tag: ''
      },
      rules: {
        tag: [
          { required: true, message: '请输入标签名称', trigger: 'blur' },
          { min: 1, max: 30, message: '长度在 1 到 30 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    ...mapGetters(['tags', 'isLoading'])
  },
  created() {
    this.fetchTags()
  },
  methods: {
    ...mapActions(['fetchTags', 'createTag', 'deleteTag']),
    // 显示创建对话框
    showCreateDialog() {
      this.tagForm.tag = ''
      this.createDialogVisible = true
      this.$nextTick(() => {
        this.$refs.tagForm.clearValidate()
      })
    },
    // 创建标签
    createTag() {
      this.$refs.tagForm.validate(async (valid) => {
        if (valid) {
          try {
            await this.createTag({ tag: this.tagForm.tag })
            
            this.$message({
              type: 'success',
              message: '标签创建成功！'
            })
            
            this.createDialogVisible = false
          } catch (error) {
            this.$message.error('标签创建失败')
            console.error('标签创建失败:', error)
          }
        } else {
          return false
        }
      })
    },
    // 确认删除标签
    confirmDelete(tag) {
      if (tag.count > 0) {
        this.$message.warning(`该标签还在使用中，不能删除`)
        return
      }
      
      this.$confirm(`确定要删除标签 "${tag.name}" 吗？`, '删除确认', {
        confirmButtonText: '确定删除',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.handleDelete(tag.name)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 执行删除
    async handleDelete(tagName) {
      try {
        await this.deleteTag(tagName)
        this.$message({
          type: 'success',
          message: '标签删除成功！'
        })
      } catch (error) {
        this.$message.error('标签删除失败')
        console.error('标签删除失败:', error)
      }
    },
    // 筛选使用该标签的文章
    filterPostsByTag(tagName) {
      this.$router.push({
        path: '/posts',
        query: { tag: tagName }
      })
    }
  }
}
</script>

<style scoped>
.tag-list-container {
  padding-bottom: 20px;
}

.tag-card {
  min-height: 300px;
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
</style> 