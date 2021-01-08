<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片页面区域 -->
    <el-card>
      <!-- 搜索框区域 -->
      <el-row class="serach-input">
        <el-col :span="7">
          <el-input
            placeholder="请输入内容"
            v-model="queryInfo.query"
            class="input-with-select"
            clearable
            @change="serachGoods"
            @clear="serachGoods"
          >
            <el-button slot="append" icon="el-icon-search" @click="serachGoods"></el-button
          ></el-input>
        </el-col>
        <el-col :span="5" class="add-button">
          <el-button type="primary" @click="goAddPage">添加商品</el-button>
        </el-col>
      </el-row>

      <!-- 商品列表区域 -->
      <el-table :data="goodsList" border stripe>
        <el-table-column type="index" label="#"> </el-table-column>
        <el-table-column prop="goods_name" label="商品名称"> </el-table-column>
        <el-table-column prop="goods_price" label="商品价格(元)" width="120px">
        </el-table-column>
        <el-table-column prop="goods_weight" label="商品重量" width="100px">
        </el-table-column>
        <el-table-column label="创建时间" width="200px">
          <template slot-scope="scope">
            {{ scope.row.add_time | dateFormat }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150px">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
            ></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="deleteGoods(scope.row.goods_id)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="10"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "Goods",
  data() {
    return {
      goodsList: [],
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 10,
      },
      total: 0
    };
  },
  created() {
    this.getGoodsList();
  },
  methods: {
    //获取商品列表参数
    async getGoodsList() {
      const { data: res } = await this.$http.get("goods", {
        params: this.queryInfo,
      });
      if (res.meta.status !== 200) {
        return this.$messange.error("获取商品列表数据失败");
      }
      // console.log(res.data)
      this.goodsList = res.data.goods
      this.total = res.data.total
    },
    
    //搜索框搜索
    serachGoods() {
      this.getGoodsList()
    },

    //改变页面条数
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getGoodsList()
    },

    //改变页数
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getGoodsList()
    },

    //删除商品
    async deleteGoods(id) {
      const confirmRes = await this.$confirm('此操作将永久删除该商品, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => err)
      if(confirmRes !== "confirm") {
        return this.$message.info("取消删除商品")
      }
      const {data: res} = await this.$http.delete("goods/"+id)
      if(res.meta.status !== 200) {
        return this.$messange.error("删除商品失败")
      }
      this.$message.success("删除商品成功")
      this.getGoodsList()
    },

    //跳转到添加商品页面
    goAddPage() {
      this.$router.push("/goods/add")
    }
  },
};
</script>

<style scoped>
.el-breadcrumb, .serach-input {
  margin-bottom: 15px;
}

.add-button {
  margin-left: 15px;
}

.el-pagination {
  margin-top: 15px;
}
</style>