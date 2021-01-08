<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片页面区域 -->
    <el-card>
      <!-- 警告弹窗区域 -->
      <el-alert
        title="注意：只允许为第三级分类设置相关参数！"
        type="warning"
        :closable="false"
        show-icon
      >
      </el-alert>
      <el-row class="select_par">
        <el-col>
          <span>选择商品分类：</span>
          <el-cascader
            v-model="selectdKeys"
            :options="shopCatList"
            :props="selectProps"
            @change="handleChange"
            clearable
          ></el-cascader>
        </el-col>
      </el-row>
      <!-- tabs标签页面 -->
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <!-- 动态参数页面 -->
        <el-tab-pane label="动态参数" name="many">
          <el-button
            type="primary"
            @click="addParams"
            :disabled="btnDisabled"
            size="small"
            >添加参数</el-button
          >
          <el-table :data="manyTableData" style="width: 100%">
            <el-table-column type="expand">
              <template slot-scope="scope">
                <!-- {{scope.row}} -->
                <el-tag
                  v-for="(item, index) in scope.row.attr_vals"
                  :key="index"
                  closable
                  @close="handleClosed(index, scope.row)"
                >
                  {{ item }}
                </el-tag>
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                  >添加新属性</el-button
                >
              </template>
            </el-table-column>
            <el-table-column type="index" label="#"> </el-table-column>
            <el-table-column prop="attr_name" label="参数名称">
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  size="mini"
                  @click="editParams(scope.row.attr_id)"
                  >修改</el-button
                >
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  @click="deleteParams(scope.row.attr_id)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <!-- 静态属性页面 -->
        <el-tab-pane label="静态属性" name="only">
          <el-button
            type="primary"
            @click="addParams"
            :disabled="btnDisabled"
            size="small"
            >添加属性</el-button
          >
          <el-table :data="onlyTableData" style="width: 100%">
            <el-table-column type="expand">
              <template slot-scope="scope">
                <!-- {{scope.row}} -->
                <el-tag
                  v-for="(item, index) in scope.row.attr_vals"
                  :key="index"
                  closable
                  @close="handleClosed(index, scope.row)"
                >
                  {{ item }}
                </el-tag>
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                  >添加新属性</el-button
                >
              </template>
            </el-table-column>
            <el-table-column type="index" label="#"> </el-table-column>
            <el-table-column prop="attr_name" label="属性名称">
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  size="mini"
                  @click="editParams(scope.row.attr_id)"
                  >修改</el-button
                >
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  @click="deleteParams(scope.row.attr_id)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <!-- 添加参数/属性对话框 -->
    <el-dialog
      :title="'添加' + dialogTitle"
      :visible.sync="showAddDialogVisible"
      width="50%"
      @close="clearAddParamForm"
    >
      <el-form
        :model="addParamForm"
        :rules="addParamRules"
        ref="addParamRef"
        label-width="100px"
      >
        <el-form-item :label="dialogTitle + '名称'" prop="attr_name">
          <el-input v-model="addParamForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showAddDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="sureAddParam">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改参数/属性对话框 -->
    <el-dialog
      :title="'修改' + dialogTitle"
      :visible.sync="showEditDialogVisible"
      width="50%"
      @close="clearEditParamForm"
    >
      <el-form
        :model="editParamForm"
        :rules="addParamRules"
        ref="editParamRef"
        label-width="100px"
      >
        <el-form-item :label="dialogTitle + '名称'" prop="attr_name">
          <el-input v-model="editParamForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showEditDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="sureEditParam">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "Params",
  data() {
    return {
      shopCatList: [],
      selectProps: {
        expandTrigger: "hover",
        value: "cat_id",
        label: "cat_name",
        children: "children",
      },
      selectdKeys: [],
      activeName: "many",
      manyTableData: [],
      onlyTableData: [],
      showAddDialogVisible: false,
      addParamForm: {
        attr_name: "",
      },
      addParamRules: {
        attr_name: [
          { required: true, message: "请输入参数名称", trigger: "blur" },
          {
            min: 1,
            max: 10,
            message: "长度在 1 到 10 个字符",
            trigger: "blur",
          },
        ],
      },
      showEditDialogVisible: false,
      editParamForm: {
        attr_name: "",
      },
      paramId: "",
    };
  },
  computed: {
    //获取级联选择器的三级id
    selectId() {
      return this.selectdKeys[2];
    },
    //添加参数/属性按钮是否可用
    btnDisabled() {
      if (this.selectdKeys.length === 3) {
        return false;
      }
      return true;
    },

    //添加对话框的title
    dialogTitle() {
      if (this.activeName === "many") {
        return "参数";
      } else {
        return "属性";
      }
    },
  },
  created() {
    this.getShopCats();
  },
  methods: {
    //获取商品分类列表
    async getShopCats() {
      const { data: res } = await this.$http.get("categories");
      if (res.meta.status !== 200) {
        return this.$message.error("获取商品分类失败");
      }
      this.shopCatList = res.data;
    },

    //监听级联选择器变化事件
    handleChange() {
      this.getParamsData();
    },

    //监听tabs标签页面切换
    handleClick() {
      this.getParamsData();
    },

    //获取参数列表数据
    async getParamsData() {
      //判断选择的是不是三级分类
      if (this.selectdKeys.length !== 3) {
        this.selectdKeys = [];
        this.manyTableData = [];
        this.onlyTableData = [];
        return;
      }
      // console.log(this.selectdKeys);
      //发起网络请求
      const { data: res } = await this.$http.get(
        `categories/${this.selectId}/attributes`,
        {
          params: { sel: this.activeName },
        }
      );
      if (res.meta.status !== 200) {
        return this.$message.error("获取参数列表失败");
      }
      // attr_vals字符串变成数组
      res.data.forEach((item) => {
        item.attr_vals = item.attr_vals ? item.attr_vals.split(" ") : [];
        item.inputVisible = false;
        item.inputValue = "";
      });
      // console.log(res.data);
      if (this.activeName === "many") {
        this.manyTableData = res.data;
      } else {
        this.onlyTableData = res.data;
      }
    },

    //显示添加参数/属性对话框
    addParams() {
      this.showAddDialogVisible = true;
    },

    //关闭对话框，格式化表单
    clearAddParamForm() {
      this.$refs.addParamRef.resetFields();
    },

    //确定添加参数/属性
    sureAddParam() {
      this.$refs.addParamRef.validate(async (valid) => {
        if (!valid) return;
        //发起网络请求
        const { data: res } = await this.$http.post(
          `categories/${this.selectId}/attributes`,
          {
            attr_name: this.addParamForm.attr_name,
            attr_sel: this.activeName,
          }
        );
        if (res.meta.status !== 201) {
          return this.$message.error("添加参数失败");
        }
        this.$message.success("添加参数成功");
        this.showAddDialogVisible = false;
        this.getParamsData();
      });
    },

    //显示修改属性/参数对话框
    async editParams(attr_id) {
      this.paramId = attr_id;
      //获取当前参数名称
      const { data: res } = await this.$http.get(
        `categories/${this.selectId}/attributes/` + attr_id,
        {
          params: { attr_sel: this.activeName },
        }
      );
      if (res.meta.status !== 200) {
        return this.$message.error("获取参数失败");
      }
      this.editParamForm.attr_name = res.data.attr_name;
      this.showEditDialogVisible = true;
    },

    //关闭对话框，格式化表单
    clearEditParamForm() {
      this.$refs.editParamRef.resetFields();
    },

    //确定修改参数/属性
    sureEditParam() {
      this.$refs.editParamRef.validate(async (valid) => {
        if (!valid) return;
        const {
          data: res,
        } = await this.$http.put(
          `categories/${this.selectId}/attributes/${this.paramId}`,
          { attr_name: this.editParamForm.attr_name, attr_sel: this.activeName }
        );
        if (res.meta.status !== 200) {
          return this.$message.error("修改参数失败");
        }
        this.$message.success("修改参数成功");
        this.showEditDialogVisible = false;
        this.getParamsData();
      });
    },
    //删除参数/属性
    async deleteParams(arr_id) {
      const confirmRes = await this.$confirm(
        "此操作将永久删除该参数, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => err);
      if (confirmRes !== "confirm") {
        return this.$message.info("取消删除参数");
      }
      const { data: res } = await this.$http.delete(
        `categories/${this.selectId}/attributes/` + arr_id
      );
      if (res.meta.status !== 200) {
        return this.$message.error("删除参数失败");
      }
      this.$message.success("删除参数成功");
      this.getParamsData();
    },

    //添加新参数项tag
    handleInputConfirm(info) {
      //如果tag值为空，直接return
      if (info.inputValue.length === 0) {
        info.inputValue = "";
        info.inputVisible = false;
        return;
      }

      //如果不为空，将值插入attr_vals数组
      info.attr_vals.push(info.inputValue.trim());
      info.inputValue = "";
      info.inputVisible = false;
      //发起网络请求
      this.saveInputValue(info);
    },

    //显示tag输入框
    showInput(info) {
      info.inputVisible = true;
      this.$nextTick((_) => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },

    //删除tag标签
    handleClosed(index, info) {
      info.attr_vals.splice(index, 1);
      this.saveInputValue(info);
    },

    //保存参数项修改
    async saveInputValue(info) {
      const { data: res } = await this.$http.put(
        `categories/${this.selectId}/attributes/` + info.attr_id,
        {
          attr_name: info.attr_name,
          attr_sel: info.attr_sel,
          attr_vals: info.attr_vals.join(" "),
        }
      );
      if (res.meta.status !== 200) {
        return this.$message.error("修改参数项失败");
      }
      this.$message.success("修改参数项成功");
    },
  },
};
</script>

<style scoped>
.el-breadcrumb {
  margin-bottom: 15px;
}

.select_par {
  margin: 15px 0;
}

.el-tag,
.button-new-tag {
  margin: 10px;
}

.input-new-tag {
  width: 120px;
  margin: 10px;
}
</style>