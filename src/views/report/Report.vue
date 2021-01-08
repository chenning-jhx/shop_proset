<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>数据统计</el-breadcrumb-item>
      <el-breadcrumb-item>数据报表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片页面区域 -->
    <el-card>
      <div id="main"></div>
    </el-card>
  </div>
</template>

<script>
import _ from "lodash";

export default {
  name: "Report",
  data() {
    return {
      reportData: {},
      options: {
        title: {
          text: "用户来源",
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            label: {
              backgroundColor: "#E9EEF3",
            },
          },
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true,
        },
        xAxis: [
          {
            boundaryGap: false,
          },
        ],
        yAxis: [
          {
            type: "value",
          },
        ],
      },
    };
  },
  created() {},
  mounted() {
    this.getReportData();
  },
  methods: {
    //获取报表数据并渲染
    async getReportData() {
      const { data: res } = await this.$http.get("reports/type/1");
      if (res.meta.status !== 200) {
        return this.$message.error("获取报告数据失败");
      }
      this.reportData = _.merge(res.data, this.options);
      var myChart = this.$echarts.init(document.getElementById("main"));
      myChart.setOption(this.reportData);
    },
  },
};
</script>

<style scoped>
.el-breadcrumb {
  margin-bottom: 15px;
}

#main {
    width: 800px;
    height: 600px;
}
</style>