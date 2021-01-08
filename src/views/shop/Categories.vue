<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片页面区域 -->
    <!-- 添加按钮 -->
    <el-row>
      <el-col>
        <el-button type="primary" class="add-button" @click="addCategories"
          >添加分类</el-button
        >
      </el-col>
    </el-row>
    <el-card>
      <zk-table
        :data="categoriesList"
        :columns="columns"
        :selection-type="false"
        :expand-type="false"
        :show-index="true"
        index-text="#"
        border
      >
        <template slot="isOk" slot-scope="scope">
          <i
            class="el-icon-success"
            v-if="!scope.row.false"
            style="color: blue"
          ></i>
          <i class="el-icon-error" v-else style="color red"></i>
        </template>
        <template slot="sort" slot-scope="scope">
          <el-tag v-if="scope.row.cat_level === 0">一级</el-tag>
          <el-tag type="success" v-else-if="scope.row.cat_level === 1"
            >二级</el-tag
          >
          <el-tag type="warning" v-else>三级</el-tag>
        </template>
        <template slot="pro" slot-scope="scope">
          <!-- <pre>{{scope.row}}</pre> -->
          <el-button
            type="primary"
            icon="el-icon-edit"
            size="mini"
            @click="editCategories(scope.row.cat_id)"
            >编辑</el-button
          >
          <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteCategories(scope.row.cat_id)"
            >删除</el-button
          >
        </template>
      </zk-table>
      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 20, 30]"
        :page-size="5"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <!-- 添加商品分类对话框 -->
    <el-dialog
      title="添加分类"
      :visible.sync="addCateDialogVisible"
      width="50%"
      @close="addCateClosed"
    >
      <el-form
        :model="addCateForm"
        :rules="addCateRules"
        ref="addCateRuleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类">
          <el-cascader
            v-model="parentKeys"
            :options="parentCateList"
            :props="cateProps"
            @change="parentCateChange"
            clearable
          ></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="sureAddCategories">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑商品分类列表 -->
    <el-dialog
      title="修改分类"
      :visible.sync="editCateDialogVisible"
      width="50%"
    >
      <el-form
        :model="editCateForm"
        :rules="addCateRules"
        ref="editCateForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="editCateForm.cat_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="sureEditCate">确 定</el-button>
      </span>
    </el-dialog>

    
  </div>
</template>

<script>
export default {
  name: "Categories",
  data() {
    return {
      categoriesList: [],
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5,
      },
      total: 0,
      columns: [
        {
          label: "分类名称",
          prop: "cat_name",
        },
        {
          label: "是否有效",
          type: "template",
          template: "isOk",
        },
        {
          label: "排序",
          type: "template",
          template: "sort",
        },
        {
          label: "操作",
          type: "template",
          template: "pro",
        },
      ],
      addCateDialogVisible: false,
      addCateForm: {
        cat_name: "",
        cat_pid: 0,
        cat_level: 0,
      },
      addCateRules: {
        cat_name: [
          { required: true, message: "请输入分类名称", trigger: "blur" },
          {
            min: 3,
            max: 10,
            message: "长度在 3 到 10 个字符",
            trigger: "blur",
          },
        ],
      },
      parentCateList: [],
      cateProps: {
        expandTrigger: "hover",
        value: "cat_id",
        label: "cat_name",
        children: "children",
        checkStrictly: "true",
      },
      parentKeys: [],
      editCateDialogVisible: false,
      editCateForm: {},
    };
  },
  created() {
    this.getShopCategories();
  },
  methods: {
    //请求商品分类数据
    async getShopCategories() {
      const { data: res } = await this.$http.get("categories", {
        params: this.queryInfo,
      });
      if (res.meta.status !== 200) {
        return this.$message.error("获取商品分类列表失败");
      }
      this.categoriesList = res.data.result;
      //   console.log(this.categoriesList)
      this.total = res.data.total;
    },
    //根据每页显示条数刷新页面
    handleSizeChange(newPageSize) {
      this.queryInfo.pagesize = newPageSize;
      this.getShopCategories();
    },
    //根据页数刷新页面
    handleCurrentChange(newPageNum) {
      this.queryInfo.pagenum = newPageNum;
      this.getShopCategories();
    },
    //显示/隐藏添加分类对话框
    addCategories() {
      this.getParentCates();
      this.addCateDialogVisible = true;
    },

    //请求父级分类列表
    async getParentCates() {
      const { data: res } = await this.$http.get("categories", {
        params: { type: 2 },
      });
      if (res.meta.status !== 200) {
        return this.$message.error("获取父级分类列表失败");
      }
      this.parentCateList = res.data;
    },
    // 监听次级列表变化事件
    parentCateChange() {
      let length = this.parentKeys.length;
      if (length > 0) {
        // parentKeys数据的最后一位是新增分类的父级id
        this.addCateForm.cat_pid = this.parentKeys[length - 1];
        this.addCateForm.cat_level = length;
        return;
      } else {
        this.addCateForm.cat_pid = 0;
        this.addCateForm.cat_level = 0;
      }
    },
    //确定添加分类
    sureAddCategories() {
      this.$refs.addCateRuleForm.validate(async (vaild) => {
        if (!vaild) return;
        //发起网络请求
        const { data: res } = await this.$http.post(
          "categories",
          this.addCateForm
        );
        if (res.meta.status !== 201) {
          return this.$message.error("添加分类失败");
        }
        this.$message.success("添加分类成功");
        this.addCateDialogVisible = false;
        this.getShopCategories();
      });
    },
    //监听添加分类对话框的关闭事件
    addCateClosed() {
      //格式化添加分类表单数据
      this.$refs.addCateRuleForm.resetFields();
      this.parentKeys = [];
    },
    //显示/隐藏编辑商品分类对话框
    async editCategories(id) {
      //根据id查询出分类的具体参数
      // const {data: res} = await this.$http.get("categories/",{ params: { id } })
      const { data: res } = await this.$http.get(`categories/${id}`);
      if (res.meta.status !== 200) {
        this.$message.error("获取商品分类失败");
      }
      this.editCateForm = res.data;
      this.editCateDialogVisible = true;
    },
    // 确定编辑商品分类
    sureEditCate() {
      this.$refs.editCateForm.validate(async (vaild) => {
        if (!vaild) return;
        const { data: res } = await this.$http.put(
          "categories/" + this.editCateForm.cat_id,
          { cat_name: this.editCateForm.cat_name }
        );
        if (res.meta.status !== 200) {
          return this.$message.error("修改商品分类失败");
        }
        this.$message.success("修改商品分类成功");
        this.editCateDialogVisible = false;
        this.getShopCategories();
      });
    },
    //删除商品分类
    async deleteCategories(id) {
      const confirmRes = await this.$confirm('此操作将永久删除该分类, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => err)

      if(confirmRes !== 'confirm') {
        return this.$message.info("已取消删除")
      }
      const {data: res} = await this.$http.delete("categories/"+id)
      if(res.meta.status !== 200) {
        return this.message.error("删除商品分类失败")
      }
      this.$message.success("成功删除商品分类")
      this.getShopCategories()
    }
  },
};
</script>

<style scoped>
.el-breadcrumb,
.add-button {
  margin: 15px 0;
}

.el-pagination {
  margin-top: 15px;
}
</style>