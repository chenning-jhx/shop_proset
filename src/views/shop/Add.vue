<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片页面区域 -->
    <el-card>
      <!-- Alert提示区域 -->
      <el-alert
        title="添加商品信息"
        type="info"
        show-icon
        :closable="false"
        center
      >
      </el-alert>
      <!-- 步骤条区域 -->
      <el-steps :active="activeName - 0" align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <!-- 左侧tab标签页 -->
      <el-form
        :model="addGoodsForm"
        :rules="addGoodsRules"
        ref="addGoodsRef"
        label-position="top"
      >
        <el-tabs
          tabPosition="left"
          v-model="activeName"
          :before-leave="tabsChange"
          @tab-click="tabClick"
        >
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addGoodsForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input
                v-model="addGoodsForm.goods_price"
                type="number"
              ></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input
                v-model="addGoodsForm.goods_weight"
                type="number"
              ></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input
                v-model="addGoodsForm.goods_number"
                type="number"
              ></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <el-cascader
                v-model="addGoodsForm.goods_cat"
                :options="cateList"
                :props="cateProps"
                clearable
                @change="handleChange"
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <el-form-item
              v-for="item in manyTableData"
              :key="item.attr_id"
              :label="item.attr_name"
            >
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox
                  v-for="(val, index) in item.attr_vals"
                  :key="index"
                  :label="val"
                  border
                ></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item
              v-for="item in onlyTableData"
              :key="item.attr_id"
              :label="item.attr_name"
            >
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <el-upload
              class="upload-demo"
              :action="uploadUrl"
              :headers="headerObj"
              :on-success="uploadSuccess"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              list-type="picture"
            >
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">
                只能上传jpg/png文件，且不超过500kb
              </div>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <quill-editor v-model="addGoodsForm.goods_introduce">
            </quill-editor>
            <el-button type="primary" class="add-button" @click="addGoods"
              >添加商品</el-button
            >
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>

    <!-- 图片预览对话框 -->
    <el-dialog title="提示" :visible.sync="previewDialogVisible" width="50%">
      <img :src="previewUrl" alt="" class="preViewImg" />
    </el-dialog>
  </div>
</template>

<script>
import _ from "lodash";

export default {
  name: "Add",
  data() {
    return {
      activeName: "0",
      addGoodsForm: {
        goods_name: "",
        goods_price: 0,
        goods_weight: 0,
        goods_number: 0,
        goods_cat: [],
        pics: [],
        goods_introduce: "",
        attrs: [],
      },
      cateProps: {
        expandTrigger: "hover",
        value: "cat_id",
        label: "cat_name",
        children: "children",
      },
      cateList: [],
      addGoodsRules: {
        goods_name: [
          { required: true, message: "请输入商品名称", trigger: "blur" },
        ],
        goods_price: [
          { required: true, message: "请输入商品价格", trigger: "blur" },
        ],
        goods_weight: [
          { required: true, message: "请输入商品重量", trigger: "blur" },
        ],
        goods_number: [
          { required: true, message: "请输入商品数量", trigger: "blur" },
        ],
        goods_cat: [
          { required: true, message: "请选择商品分类", trigger: "blur" },
        ],
      },
      manyTableData: [],
      onlyTableData: [],
      uploadUrl: "http://127.0.0.1:8888/api/private/v1/upload",
      headerObj: {
        Authorization: window.sessionStorage.getItem("token"),
      },
      previewDialogVisible: false,
      previewUrl: "",
    };
  },
  created() {
    this.getCateList();
  },
  computed: {
    selectId() {
      if (this.addGoodsForm.goods_cat.length === 3) {
        return this.addGoodsForm.goods_cat[2];
      }
    },
  },
  methods: {
    //获取商品分类列表数据
    async getCateList() {
      const { data: res } = await this.$http.get("categories");
      if (res.meta.status !== 200) {
        return this.$message.error("获取商品分类数据失败");
      }
      this.cateList = res.data;
    },

    //监听商品分类变化
    handleChange() {
      if (this.addGoodsForm.goods_cat.length !== 3) {
        this.addGoodsForm.goods_cat = [];
      }
    },

    //左侧tab标签页切换前验证
    tabsChange(activeName, oldActiveName) {
      if (oldActiveName === "0" && this.addGoodsForm.goods_cat.length !== 3) {
        this.$message.error("请选择商品分类");
        return false;
      }
    },

    //监听tab标签点击事件
    async tabClick() {
      //获取动态参数
      if (this.activeName === "1") {
        const { data: res } = await this.$http.get(
          `categories/${this.selectId}/attributes`,
          {
            params: { sel: "many" },
          }
        );
        res.data.forEach((item) => {
          item.attr_vals =
            item.attr_vals.length === 0 ? [] : item.attr_vals.split(" ");
        });
        this.manyTableData = res.data;
      } else if (this.activeName === "2") {
        const { data: res } = await this.$http.get(
          `categories/${this.selectId}/attributes`,
          {
            params: { sel: "only" },
          }
        );
        this.onlyTableData = res.data;
      }
    },

    //图片上传成功的回调函数
    uploadSuccess(response) {
      const pic = {
        pic: response.data.tem_path,
      };
      this.addGoodsForm.pics.push(pic);
    },

    //监听图片预览
    handlePreview(file) {
      this.previewUrl = file.response.data.url;
      this.previewDialogVisible = true;
    },

    //监听图片移除
    handleRemove(file) {
      const picPath = file.response.data.tem_path;
      const index = this.addGoodsForm.pics.findIndex(
        (item) => item.pic === picPath
      );
      this.addGoodsForm.pics.splice(index, 1);
    },

    //添加商品
    addGoods() {
      this.$refs.addGoodsRef.validate(async valid => {
        if (!valid) {
          this.$message.error("请填写必填项");
          return;
        }

        //goods_cat变成字符串
        const newForm = _.cloneDeep(this.addGoodsForm);
        newForm.goods_cat = newForm.goods_cat.join(",");

        //attrs数组插入参数和属性
        this.manyTableData.forEach((item) => {
          const value = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals.join(" "),
          };
          newForm.attrs.push(value)
        });

        this.onlyTableData.forEach(item => {
          const value = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals
          }
          newForm.attrs.push(value)
        })

        const {data: res} = await this.$http.post('goods', newForm)
        if(res.meta.status !== 201) {
          this.$message.error("添加商品失败")
        }
        this.$message.success("添加商品成功")
        this.$router.push("/goods")
      });
    },
  },
};
</script>

<style scoped>
.el-breadcrumb {
  margin-bottom: 15px;
}

.el-steps {
  margin: 20px 0;
}

.el-checkbox {
  margin: 0 10px;
}

.preViewImg {
  width: 100%;
}

.add-button {
  display: block;
  margin: 15px auto;
}
</style>