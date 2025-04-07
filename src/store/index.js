import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import jwt_decode from 'jwt-decode'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    token: localStorage.getItem('token') || '',
    user: null,
    posts: [],
    tags: [],
    loading: false
  },
  mutations: {
    // 用户相关
    setToken(state, token) {
      state.token = token
    },
    setUser(state, user) {
      state.user = user
    },
    clearUserData(state) {
      state.token = ''
      state.user = null
      localStorage.removeItem('token')
    },
    // 文章相关
    setPosts(state, posts) {
      state.posts = posts
    },
    // 标签相关
    setTags(state, tags) {
      state.tags = tags
    },
    // 加载状态
    setLoading(state, status) {
      state.loading = status
    }
  },
  actions: {
    // 登录
    async login({ commit }, credentials) {
      commit('setLoading', true)
      try {
        const response = await axios.post('/auth/login', credentials)
        const token = response.data.token
        localStorage.setItem('token', token)
        commit('setToken', token)
        
        // 解析token获取用户信息
        const decodedToken = jwt_decode(token)
        commit('setUser', decodedToken.user)
        
        return response
      } catch (error) {
        throw error
      } finally {
        commit('setLoading', false)
      }
    },
    
    // 注册
    async register({ commit }, userData) {
      commit('setLoading', true)
      try {
        const response = await axios.post('/auth/register', userData)
        const token = response.data.token
        localStorage.setItem('token', token)
        commit('setToken', token)
        
        // 解析token获取用户信息
        const decodedToken = jwt_decode(token)
        commit('setUser', decodedToken.user)
        
        return response
      } catch (error) {
        throw error
      } finally {
        commit('setLoading', false)
      }
    },
    
    // 注销
    logout({ commit }) {
      commit('clearUserData')
    },
    
    // 获取当前用户信息
    async getCurrentUser({ commit }) {
      commit('setLoading', true)
      try {
        const response = await axios.get('/auth/me')
        commit('setUser', response.data)
        return response.data
      } catch (error) {
        commit('clearUserData')
        throw error
      } finally {
        commit('setLoading', false)
      }
    },
    
    // 获取所有文章
    async fetchPosts({ commit }) {
      commit('setLoading', true)
      try {
        const response = await axios.get('/posts')
        commit('setPosts', response.data)
        return response.data
      } catch (error) {
        throw error
      } finally {
        commit('setLoading', false)
      }
    },
    
    // 获取所有标签
    async fetchTags({ commit }) {
      commit('setLoading', true)
      try {
        const response = await axios.get('/tags')
        commit('setTags', response.data)
        return response.data
      } catch (error) {
        throw error
      } finally {
        commit('setLoading', false)
      }
    },
    
    // 创建文章
    async createPost({ commit, dispatch }, postData) {
      commit('setLoading', true)
      try {
        const response = await axios.post('/posts', postData)
        // 更新文章列表
        dispatch('fetchPosts')
        return response.data
      } catch (error) {
        throw error
      } finally {
        commit('setLoading', false)
      }
    },
    
    // 更新文章
    async updatePost({ commit, dispatch }, { slug, postData }) {
      commit('setLoading', true)
      try {
        const response = await axios.put(`/posts/${slug}`, postData)
        // 更新文章列表
        dispatch('fetchPosts')
        return response.data
      } catch (error) {
        throw error
      } finally {
        commit('setLoading', false)
      }
    },
    
    // 删除文章
    async deletePost({ commit, dispatch }, slug) {
      commit('setLoading', true)
      try {
        const response = await axios.delete(`/posts/${slug}`)
        // 更新文章列表
        dispatch('fetchPosts')
        return response.data
      } catch (error) {
        throw error
      } finally {
        commit('setLoading', false)
      }
    },
    
    // 创建标签
    async createTag({ commit, dispatch }, tagData) {
      commit('setLoading', true)
      try {
        const response = await axios.post('/tags', tagData)
        // 更新标签列表
        dispatch('fetchTags')
        return response.data
      } catch (error) {
        throw error
      } finally {
        commit('setLoading', false)
      }
    },
    
    // 删除标签
    async deleteTag({ commit, dispatch }, tag) {
      commit('setLoading', true)
      try {
        const response = await axios.delete(`/tags/${tag}`)
        // 更新标签列表
        dispatch('fetchTags')
        return response.data
      } catch (error) {
        throw error
      } finally {
        commit('setLoading', false)
      }
    }
  },
  getters: {
    isAuthenticated: state => !!state.token,
    currentUser: state => state.user,
    posts: state => state.posts,
    tags: state => state.tags,
    isLoading: state => state.loading
  }
}) 