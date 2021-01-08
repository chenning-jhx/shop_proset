<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片页面区域 -->
    <el-card>
      <!-- 搜索框区域 -->
      <el-row class="search-input">
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            v-model="queryInfo.query"
            clearable
            @change="searchOrder"
            @clear="searchOrder"
          >
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
      </el-row>
      <!-- 表格区域 -->
      <el-table :data="ordersList" border stripe>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="order_number" label="订单编号" align="center">
        </el-table-column>
        <el-table-column
          prop="order_price"
          label="订单价格"
          width="100px"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="pay_status"
          label="是否付款"
          width="120px"
          align="center"
        >
          <template slot-scope="scope">
            <el-tag v-if="scope.row.order_pay === '1'">已付款</el-tag>
            <el-tag type="danger" v-else>未付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="is_send"
          label="是否发货"
          width="100px"
          align="center"
        >
        </el-table-column>
        <el-table-column label="下单时间" width="180px">
          <template slot-scope="scope">
            {{ scope.row.create_time | dateFormat }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150px" align="center">
          <template slot-scope="">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="editAddress"
            ></el-button>
            <el-button
              type="danger"
              icon="el-icon-s-promotion"
              size="mini"
              @click="showLogisticsInfo"
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

    <!-- 修改订单对话框 -->
    <el-dialog
  title="修改地址"
  :visible.sync="editAddressDialogVisible"
  width="50%"
  @close="editAddressClosed">
  <el-form :model="addressForm" :rules="addressrules" ref="addressFormRef" label-width="100px">
  <el-form-item label="省市区/县" prop="city">
    <el-cascader
    v-model="addressForm.city"
    :options="cityData"
    :props="cityProps"
    @change="handleChange"></el-cascader>
  </el-form-item>
  <el-form-item label="详细地址" prop="address">
    <el-input v-model="addressForm.address"></el-input>
  </el-form-item>
  </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="editAddressDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="editAddressDialogVisible = false">确 定</el-button>
  </span>
</el-dialog>

<!-- 物流信息对话框 -->
<el-dialog
  title="提示"
  :visible.sync="logisticsInfodialogVisible"
  width="50%">
  <span>这是物流信息</span>
  <span slot="footer" class="dialog-footer">
    <el-button @click="logisticsInfodialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="logisticsInfodialogVisible = false">确 定</el-button>
  </span>
</el-dialog>
  </div>
</template>

<script>
import CityData from "./citydata"

export default {
  name: "Order",
  data() {
    return {
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 10,
      },
      ordersList: [],
      total: 0,
      editAddressDialogVisible: false,
      addressForm: {
        city: [],
        address: ""
      },
      addressrules: {
        city: [
          { required: true, message: '请选择省市区/县', trigger: 'blur' },
        ],
        address: [
          { required: true, message: '请输入详细地址', trigger: 'blur' },
        ],
      },
      cityData: CityData,
      cityProps: {
        expandTrigger: 'hover'
      },
      logisticsInfodialogVisible: false
    };
  },
  created() {
    this.getOrdersList();
  },
  methods: {
    //获取订单列表数据
    async getOrdersList() {
      const { data: res } = await this.$http.get("orders", {
        params: this.queryInfo,
      });
      if (res.meta.status !== 200) {
        return this.$message.error("获取订单数据失败");
      }
      // console.log(res.data)
      this.ordersList = res.data.goods;
      this.total = res.data.total;
    },

    //改变页面条数
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      this.getOrdersList();
    },

    //改变页数
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage;
      this.getOrdersList();
    },

    //搜索框搜索
    searchOrder() {
      this.getOrdersList();
    },

    handleChange() {
      console.log(this.addressForm.city)
    },

    //修改收货地址
    editAddress() {
      this.editAddressDialogVisible = true
    },

    editAddressClosed() {
      this.$refs.addressFormRef.resetFields()
    },

    //显示物流信息
    async showLogisticsInfo() {
      // const {data: res} = await this.$http.get("/kuaidi/804909574412544580")
      // if(res.meta.status !== 200) {
      //   return this.$message.error("获取物流信息失败")
      // }
      this.logisticsInfodialogVisible = true
    }
  },
};
</script>

<style scoped>
.el-breadcrumb {
  margin-bottom: 15px;
}

.search-input {
  margin-bottom: 15px;
}

.el-cascader {
  width: 100%
}
</style>