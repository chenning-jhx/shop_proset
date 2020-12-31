<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片页面 -->
    <el-card class="box-card">
      <!-- 搜索框 -->
      <el-row>
        <el-col :span="8">
          <el-input
            placeholder="请输入搜索内容"
            v-model="params.query"
            clearable
            @change="getUsersList"
            @clear="getUsersList"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getUsersList"
            ></el-button> </el-input
        ></el-col>
        <el-col :span="4">
          <el-button class="addUser-button" type="primary" @click="addUser"
            >添加用户</el-button
          >
        </el-col>
      </el-row>

      <!-- 用户列表 -->
      <template>
        <el-table :data="usersList" border stripe style="width: 100%">
          <el-table-column type="index" label="#"></el-table-column>
          <el-table-column prop="username" label="姓名"></el-table-column>
          <el-table-column prop="email" label="邮箱"></el-table-column>
          <el-table-column prop="mobile" label="电话"></el-table-column>
          <el-table-column prop="role_name" label="角色"></el-table-column>
          <el-table-column label="状态">
            <template slot-scope="scope">
              <!-- {{ scope.row }} -->
              <el-switch
                v-model="scope.row.mg_state"
                @change="switchChange(scope.row)"
              ></el-switch>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="180px">
            <template slot-scope="scope">
              <!-- {{ scope.row}} -->
              <el-button
                type="primary"
                icon="el-icon-edit"
                size="mini"
                @click="editUser(scope.row.id)"
              ></el-button>
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                @click="deleteUser(scope.row.id)"
              ></el-button>
              <el-tooltip
                effect="dark"
                content="分配权限"
                placement="top"
                :enterable="false"
              >
                <el-button
                  type="warning"
                  icon="el-icon-setting"
                  size="mini"
                ></el-button>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
      </template>
      <!-- 页数 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="params.pagenum"
        :page-sizes="pageSizes"
        :page-size="params.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination
    ></el-card>

    <!-- 添加用户对话框 -->
    <el-dialog
      title="添加用户"
      :visible.sync="addDialogVisible"
      @close="addUserClose"
      width="50%"
    >
      <el-form
        ref="addUserForm"
        :model="addUserForm"
        :rules="addUserRules"
        label-width="80px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addUserForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addUserForm.password" type="password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addUserForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="addUserForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelAddUser">取 消</el-button>
        <el-button type="primary" @click="sureAddUser">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑用户对话框 -->
    <el-dialog
      title="修改用户信息"
      :visible.sync="editDialogVisible"
      width="50%"
    >
      <el-form ref="editUserFormRef" :model="editUserform" :rules="editUserRules" label-width="80px">
        <el-form-item label="用户名">
          <el-input v-model="editUserform.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editUserform.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="editUserform.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelEditUser">取 消</el-button>
        <el-button type="primary" @click="sureEditUser"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "Users",
  data() {
    const checkEmail = (rule, value, callback) => {
      let checkRule = /^[a-zA-Z0-9]+([-_.][a-zA-Z0-9]+)*@[a-zA-Z0-9]+([-_.][a-zA-Z0-9]+)*\.[a-z]{2,}$/;
      if (!checkRule.test(value)) {
        callback(new Error("请输入正确的邮箱"));
      } else {
        callback();
      }
    };
    const checkMobile = (rule, value, callback) => {
      let checkRule = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/;
      if (!checkRule.test(value)) {
        callback(new Error("请输入正确的手机号"));
      } else {
        callback();
      }
    };
    return {
      params: {
        query: "",
        pagenum: 1,
        pagesize: 10,
      },
      usersList: [],
      total: 0,
      pageSizes: [1, 2, 5, 10],
      // 添加用户对话框显示/隐藏
      addDialogVisible: false,
      //添加用户表单数据
      addUserForm: {
        username: "",
        password: "",
        email: "",
        mobile: "",
      },
      //添加用户校验规则
      addUserRules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 3, max: 10, message: "长度在 3 到 5 个字符", trigger: "blur" },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 6, max: 15, message: "长度在 3 到 5 个字符", trigger: "blur" },
        ],
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          { validator: checkEmail, trigger: "blur" },
        ],
        mobile: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          { validator: checkMobile, trigger: "blur" },
        ],
      },
      // 修改用户信息对话框显示/隐藏
      editDialogVisible: false,
      editUserform: {},
      editUserRules: {
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          { validator: checkEmail, trigger: "blur" },
        ],
        mobile: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          { validator: checkMobile, trigger: "blur" },
        ]
      }
    };
  },
  created() {
    //获取用户列表
    this.getUsersList();
  },
  methods: {
    //网络请求用户列表
    async getUsersList() {
      const { data: res } = await this.$http.get("users", {
        params: this.params,
      });
      if (res.meta.status !== 200) {
        return this.$message.error("获取用户列表失败");
      } else {
        this.usersList = res.data.users;
        this.total = res.data.total;
        // console.log(this.usersList);
      }
    },

    //设置用户的状态
    async switchChange(userInfo) {
      const { data: res } = await this.$http.put(
        `users/${userInfo.id}/state/${userInfo.mg_state}`
      );
      if (res.meta.status !== 200) {
        return this.$message.error("设置状态失败");
        res.data.mg_state = !res.data.mg_state;
      }
    },

    //根据页面显示条数更新用户列表
    handleSizeChange(newPageSize) {
      this.params.pagesize = newPageSize;
      this.getUsersList();
    },

    //更加页面页数更新用户列表
    handleCurrentChange(newPageNum) {
      this.params.pagenum = newPageNum;
      this.getUsersList();
    },

    //显示添加用户对话框
    addUser() {
      this.addDialogVisible = true;
    },

    //关闭弹窗，清空表单数据
    addUserClose() {
      this.$refs.addUserForm.resetFields();
    },

    //取消添加用户
    cancelAddUser() {
      this.addDialogVisible = false;
    },

    //确定添加用户
    sureAddUser() {
      //对表单校验
      this.$refs.addUserForm.validate(async (vaild) => {
        if (!vaild) return;
        //发起网络请求
        const { data: res } = await this.$http.post("users", this.addUserForm);
        if (res.meta.status !== 201) {
          return this.$message.error("添加用户失败");
        }
        this.$message.success("添加用户成功");
      });
      this.addDialogVisible = false;
      this.getUsersList();
    },

    //显示修改用户信息对话框
    async editUser(id) {
      this.editDialogVisible = true;
      //根据id查询用户信息
      const {data: res} = await this.$http.get(`users/${id}`);
      if(res.meta.status !== 200) return this.$message.error("获取用户数据失败");
      this.editUserform = res.data;
    },

    //取消修改用户信息
    cancelEditUser() {
      this.editDialogVisible = false
    },

    //确定修改用户信息
    sureEditUser() {
      this.$refs.editUserFormRef.validate(async vaild => {
        if(!vaild) return;
        const {data: res} = await this.$http.put("users/"+this.editUserform.id,
        { email: this.editUserform.email, 
          mobile: this.editUserform.mobile });
        if(res.meta.status !== 200 ) return this.$message.error("修改用户信息失败");
        return this.$message.success("修改用户信息成功");
      })
      this.editDialogVisible = false;
      this.getUsersList();
    },

    //删除用户
    async deleteUser(id) {
      const confirmResult = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => err)

        //确定删除用户，返还confirm
        //取消删除用户，返还cancel
        if(confirmResult !== "confirm") {
          return this.$message.info("已取消删除")
        }
        const {data: res} = await this.$http.delete("users/" + id);
        if(res.meta.status !== 200) return this.$message.error("删除用户失败");
        this.$message.success("删除用户成功");
        this.getUsersList();
    }
  },
};
</script>

<style lang="less" scoped>
.el-breadcrumb {
  margin-bottom: 15px;
}

.el-card {
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.15) !important;
}

.addUser-button {
  margin-left: 15px;
}

.el-table,
.el-pagination {
  margin-top: 15px;
}
</style>
