<template>
  <el-container class="home_container">
    <el-header class="home_head">
      <div>
        <img src="~/assets/image/heima.png" alt="" />
        <span>电商管理后台</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <el-container>
      <el-aside :width="istoggle" class="home_aside">
        <div class="toggle_button" @click="toggleClcik">|||</div>
        <el-menu
          background-color="#333744"
          text-color="#fff"
          active-text-color="#409EFF"
          unique-opened
          :collapse="isCollapse"
          :collapse-transition="false"
          router
          :default-active="activePath"
        >
          <el-submenu
            v-for="item in menuList"
            :key="item.id"
            :index="item.id + ''"
          >
            <template slot="title">
              <i :class="iconsList[item.id]"></i>
              <span>{{ item.authName }}</span>
            </template>
            <el-menu-item
              v-for="subItem in item.children"
              :key="subItem.id"
              :index="'/' + subItem.path"
              @click="subItemClick('/' + subItem.path)"
            >
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>{{ subItem.authName }}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main class="home_main">
          <!-- router占位符 -->
          <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  name: "Home",
  data() {
    return {
      menuList: [],
      iconsList: {
        125: "iconfont icon-users",
        103: "iconfont icon-lock_fill",
        101: "iconfont icon-shangpin",
        102: "iconfont icon-danju",
        145: "iconfont icon-baobiao",
      },
      isCollapse: false,
      activePath: ''
    };
  },
  created() {
    //获取菜单列表
    this.getMenuList();
    this.activePath = window.sessionStorage.getItem('activePath');
  },
  computed: {
    istoggle() {
        return this.isCollapse ? '64px' : '200px';
    }
  },
  methods: {
    logout() {
      window.sessionStorage.clear();
      this.$router.push("/login");
    },
    //获取菜单列表
    async getMenuList() {
      const { data: res } = await this.$http.get("/menus");
      // console.log(res)
      this.menuList = res.data;
    },
    //菜单栏缩放
    toggleClcik() {
      this.isCollapse = !this.isCollapse;
    },
    subItemClick(activePath) {
      window.sessionStorage.setItem("activePath",activePath);
      this.activePath = activePath;
    }
  },
};
</script>

<style lang="less" scoped>
.home_container {
  height: 100%;
}

.home_head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-left: 0;
  background-color: #373d41;
  > div {
    display: flex;
    align-items: center;
    > span {
      padding-left: 10px;
      font-size: 20px;
      color: #fff;
    }
  }
}

.home_aside {
  background-color: #333744;
  .el-menu {
    border-right: none;
  }
}

.home_main {
  background-color: #eaedf1;
}

.iconfont {
  margin-right: 10px;
}

.toggle_button {
    background: #4A5064;
    font-size: 10px;
    line-height: 24px;
    text-align: center;
    letter-spacing: 0.2em;
    color: #fff;
}
</style>