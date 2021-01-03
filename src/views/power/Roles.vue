<template>
  <div class="roules">
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片显示区域 -->
    <el-card class="box-card">
      <el-row class="add-button">
        <el-col>
          <el-button type="primary" @click="addRole">添加角色</el-button>
        </el-col>
      </el-row>
      <template>
        <el-table :data="roulesList" border style="width: 100%">
          <el-table-column type="expand">
            <template slot-scope="scope">
              <el-row
                v-for="(item1, index1) in scope.row.children"
                :key="item1.id"
                :class="[
                  'border_bottom',
                  index1 === 0 ? 'border_top' : '',
                  'roules_list',
                ]"
              >
                <el-col :span="5">
                  <el-tag closable @close="deleteRight(scope.row, item1.id)">{{
                    item1.authName
                  }}</el-tag>
                  <i class="el-icon-caret-right"></i>
                </el-col>
                <el-col :span="19">
                  <el-row
                    v-for="(item2, index2) in item1.children"
                    :key="index2"
                    :class="[index2 === 0 ? '' : 'border_top']"
                  >
                    <el-col :span="6">
                      <el-tag
                        type="success"
                        closable
                        @close="deleteRight(scope.row, item2.id)"
                        >{{ item2.authName }}</el-tag
                      >
                      <i class="el-icon-caret-right"></i>
                    </el-col>
                    <el-col :span="18">
                      <el-tag
                        type="warning"
                        closable
                        v-for="(item3, index3) in item2.children"
                        :key="index3"
                        @close="deleteRight(scope.row, item3.id)"
                        >{{ item3.authName }}</el-tag
                      >
                    </el-col>
                  </el-row>
                </el-col>
              </el-row>
            </template>
          </el-table-column>
          <el-table-column type="index" label="#"></el-table-column>
          <el-table-column prop="roleName" label="角色名称"> </el-table-column>
          <el-table-column prop="roleDesc" label="角色描述"> </el-table-column>
          <el-table-column prop="" label="操作">
            <template slot-scope="scope">
              <!-- {{scope.row}} -->
              <el-button
                type="primary"
                icon="el-icon-edit"
                size="mini"
                @click="editRole(scope.row.id)"
                >编辑</el-button
              >
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                @click="deleteRole(scope.row.id)"
                >删除</el-button
              >
              <el-button
                type="warning"
                icon="el-icon-setting"
                size="mini"
                @click="setRoles(scope.row)"
                >分配权限</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </template></el-card
    >
    <!-- 添加分配权限对话框 -->
    <el-dialog
      title="分配权限"
      :visible.sync="roleDialogVisible"
      width="50%"
      @close="clearDefKeys"
    >
      <el-tree
        :data="roleRightsList"
        :props="roleRightProps"
        default-expand-all
        show-checkbox
        node-key="id"
        :default-checked-keys="defKeys"
        ref="treeRef"
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="roleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveRoleRights">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 添加角色对话框 -->
    <el-dialog
      title="添加角色"
      :visible.sync="addRoleDialogVisible"
      width="50%"
      @close="addRoleClosed"
    >
      <el-form
        :model="addRoleForm"
        :rules="addRoleRules"
        ref="addRoleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addRoleForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="addRoleForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="sureAddRole">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑角色对话框 -->
    <el-dialog
      title="修改角色"
      :visible.sync="editRoleDialogVisible"
      width="50%"
    >
      <el-form
        :model="editRoleForm"
        :rules="addRoleRules"
        ref="editRoleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="editRoleForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="editRoleForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="sureEditRole">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "Roules",
  data() {
    return {
      roulesList: [],
      //分配权限对话框隐藏/显示
      roleDialogVisible: false,
      roleRightsList: [],
      roleRightProps: {
        children: "children",
        label: "authName",
      },
      defKeys: [],
      roleId: "",
      addRoleDialogVisible: false,
      addRoleForm: {
        roleName: "",
        roleDesc: "",
      },
      addRoleRules: {
        roleName: [
          { required: true, message: "请输入角色名称", trigger: "blur" },
          { min: 1, max: 5, message: "长度在 1 到 5 个字符", trigger: "blur" },
        ],
      },
      editRoleDialogVisible: false,
      editRoleForm: {},
      editRoleId: "",
    };
  },
  created() {
    this.getRoulesList();
  },
  methods: {
    async getRoulesList() {
      const { data: res } = await this.$http.get("roles");
      if (res.meta.status !== 200)
        return this.$message.error("获取角色列表失败");
      this.roulesList = res.data;
    },

    async deleteRight(role, id) {
      const confirmRuslt = await this.$confirm(
        "此操作将永久删除该权限, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => err);
      // console.log(confirmRuslt)

      if (confirmRuslt !== "confirm") return this.$message.info("已取消删除");
      const { data: res } = await this.$http.delete(
        `roles/${role.id}/rights/${id}`
      );
      if (res.meta.status !== 200) return this.$message.error("删除权限失败");
      role.children = res.data;
    },

    //显示分配权限对话框和权限数据
    async setRoles(role) {
      //把当前角色的id保存到roleId，以便后续调用
      this.roleId = role.id;
      // 请求全部权限数据
      const { data: res } = await this.$http.get("rights/tree");
      if (res.meta.status !== 200) {
        return this.$message.error("获取权限数据失败");
      }

      this.roleRightsList = res.data;

      //显示已勾选的权限
      this.getDefkeys(role, this.defKeys);
      // console.log(this.defKeys)

      this.roleDialogVisible = true;
    },

    //运用递归，筛选出3级目录的id，存入数组
    getDefkeys(node, arr) {
      //如果没有childrend，就是3级节点
      if (!node.children) {
        return arr.push(node.id);
      }

      node.children.forEach((item) => this.getDefkeys(item, arr));
    },

    //关于权限对话框，清空defKeys
    clearDefKeys() {
      this.defKeys = [];
    },

    //保存角色权限
    async saveRoleRights() {
      //获取以,隔开的id字符串
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys(),
      ];
      const idStr = keys.join(",");
      // console.log(idStr)
      const { data: res } = await this.$http.post(
        `roles/${this.roleId}/rights`,
        { rids: idStr }
      );
      if (res.meta.status !== 200) {
        return this.$message.error("保存权限列表失败");
      }
      this.$message.success("保存权限列表成功");
      this.getRoulesList();
      this.roleDialogVisible = false;
    },

    //显示添加角色对话框
    addRole() {
      this.addRoleDialogVisible = true;
    },

    //确定添加角色
    sureAddRole() {
      this.$refs.addRoleForm.validate(async (valid) => {
        if (!valid) return;
        const { data: res } = await this.$http.post("roles", this.addRoleForm);
        if (res.meta.status !== 201) {
          return this.$message.error("新建角色失败");
        }
        this.$message.success("新建角色成功");
        this.getRoulesList();
        this.addRoleDialogVisible = false;
      });
    },

    //监听添加角色对话框关闭事件，清空表单数据
    addRoleClosed() {
      this.$refs.addRoleForm.resetFields();
    },

    //显示编辑角色对话框
    async editRole(id) {
      this.editRoleId = id;
      const { data: res } = await this.$http.get("roles/" + id);
      if (res.meta.status !== 200) {
        return this.$message.error("获取角色失败");
      }
      this.editRoleForm = res.data;
      this.editRoleDialogVisible = true;
    },

    //确定修改角色对话框
    async sureEditRole() {
      const { data: res } = await this.$http.put("roles/" + this.editRoleId, {
        roleName: this.editRoleForm.roleName,
        roleDesc: this.editRoleForm.roleDesc,
      });
      if (res.meta.status !== 200) {
        return this.$message.error("修改角色失败");
      }
      this.$message.success("修改角色成功");
      this.getRoulesList();
      this.editRoleDialogVisible = false;
    },

    //删除角色
    async deleteRole(id) {
      const confirmRes = await this.$confirm(
        "此操作将永久删除该文件, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => err);
      if (confirmRes !== "confirm") {
        this.message.info("取消删除角色");
      }
      const {data: res} = await this.$http.delete("roles/"+id)
      if(res.meta.status !== 200) {
        return this.$message.error("删除角色失败")
      }
      this.$message.success("删除角色成功")
      this.getRoulesList()
    },
  },
};
</script>

<style lang="less" scoped>
.el-breadcrumb,
.add-button {
  margin-bottom: 15px;
}

.el-tag {
  margin: 7px;
}

.border_top {
  border-top: 1px solid #eee;
}

.border_bottom {
  border-bottom: 1px solid #eee;
}

.roules_list {
  display: flex;
  align-items: center;
}
</style>
