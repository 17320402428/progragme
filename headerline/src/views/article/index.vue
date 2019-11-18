<!-- 文章列表页 -->
<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>全部图文</span>
      </div>
      <div>
        <el-form ref="form" :model="searchForm" label-width="110px">
          <el-form-item label="文章状态：">
            <el-radio-group v-model="searchForm.status">
              <el-radio-button label="">全部</el-radio-button>
              <el-radio-button label="0">草稿</el-radio-button>
              <el-radio-button label="1">待审核</el-radio-button>
              <el-radio-button label="2">审核通过</el-radio-button>
              <el-radio-button label="3">审核失败</el-radio-button>
            </el-radio-group>
          </el-form-item>
          <!-- 父组件频道类别位置 -->
          <channel-com @slt="selectHandler"></channel-com>
          <el-form-item label="时间选择：">
            <el-date-picker
              v-model="timetotime"
              type="datetimerange"
              value-format="yyyy-MM-dd"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            >
            </el-date-picker>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <el-card class="box-card" style="margin-top:25px;">
      <div slot="header" class="clearfix">
        <span>共找到{{ total }}条符合条件的内容</span>
      </div>
      <div class="text item">
        <el-table :data="tableData" style="width: 100%">
          <el-table-column prop="title" label="封面" width="300">
            <img
              :src="stData.row.cover.images[0]"
              slot-scope="stData"
              width="150"
              height="100"
            />
          </el-table-column>
          <el-table-column prop="title" label="标题" width="200">
          </el-table-column>
          <el-table-column prop="status" label="状态" width="150">
            <template slot-scope="stData">
              <el-tag v-if="stData.row.status === 0">草稿</el-tag>
              <el-tag v-else-if="stData.row.status === 1">待审核</el-tag>
              <el-tag v-else-if="stData.row.status === 2">审核通过</el-tag>
              <el-tag v-else-if="stData.row.status === 3">审核失败</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="pubdate" label="发布时间" widhth="160">
          </el-table-column>
          <el-table-column label="操作" widhth="160">
            <template slot-scope="stData">
              <el-button type="primary" size="mini" @click="$router.push(`/artedor/${stData.row.id}`)">修改</el-button>
              <el-button type="danger" size="mini" @click="del(stData.row.id)"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="text item fenye" style="">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="searchForm.page"
          :page-sizes="[10, 20, 30, 40]"
          :page-size="searchForm.per_page"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        >
        </el-pagination>
      </div>
    </el-card>
  </div>
</template>

<script>
// 这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
// 例如：import 《组件名称》 from '《组件路径》';
import ChannelCom from '@/components/channel.vue'
export default {
  name: 'articles',
  // import引入的组件需要注入到对象中才能使用
  components: {
    ChannelCom
  },
  data () {
    // 这里存放数据
    return {
      timetotime: '', // 日期框
      channelList: [], // 频道列表
      tableData: [], // 表格数据
      searchForm: {
        status: '', // 文章状态，0-草稿，1-待审核，2-审核通过，3-审核失败，4-已删除，不传为全部
        channel_id: '', // 频道
        begin_pubdate: '', // 文章发布开始时间
        end_pubdate: '', // 文章发布结束时间
        page: 1, // 当前页码
        per_page: 10 // 每页显示条数
      },
      total: 0 // 总计
    }
  },
  // 监听属性 类似于data概念
  computed: {},
  // 监控data中的数据变化
  watch: {
    searchForm: {
      deep: true,
      handler: function (v1, v2) {
        this.getAtricle()
      }
    },
    timetotime: function (v1, v2) {
      if (v1) {
        this.searchForm.begin_pubdate = v1[0]
        this.searchForm.end_pubdate = v1[1]
      } else {
        this.searchForm.begin_pubdate = ''
        this.searchForm.end_pubdate = ''
      }
    }
  },
  // 方法集合
  methods: {
    // 获取子组件传来的channel值
    selectHandler (arg) {
      this.searchForm.channel_id = arg
    },
    // 获取文章列表
    getAtricle () {
      let searchData = {}
      for (const key in this.searchForm) {
        if (this.searchForm[key]) {
          searchData[key] = this.searchForm[key]
        }
      }
      this.$http
        .get('/articles', { params: searchData })
        .then(res => {
          let data = res.data
          if (data.message === 'OK') {
            let results = data.data.results
            this.tableData = results
            this.total = data.data.total_count
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 删除文章
    del (id) {
      this.$confirm('确认退出吗?', '退出', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.delete(`articles/${id}`)
          .then(res => {
            this.getAtricle()
          })
      })
    },
    // 每页条数
    handleSizeChange (val) {
      this.searchForm.per_page = val
    },
    // 当前页
    handleCurrentChange (val) {
      this.searchForm.page = val
    }
  },
  // 生命周期 - 创建完成（可以访问当前this实例）
  created () {
    this.getAtricle()
  },
  // 生命周期 - 挂载完成（可以访问DOM元素）
  mounted () {},
  beforeCreate () {}, // 生命周期 - 创建之前
  beforeMount () {}, // 生命周期 - 挂载之前
  beforeUpdate () {}, // 生命周期 - 更新之前
  updated () {}, // 生命周期 - 更新之后
  beforeDestroy () {}, // 生命周期 - 销毁之前
  destroyed () {}, // 生命周期 - 销毁完成
  activated () {} // 如果页面有keep-alive缓存功能，这个函数会触发
}
</script>
<style lang="less" scoped>
//@import url(); 引入公共css类
.fenye {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}
</style>
