<template>
  <div class="dashboard">
    <el-row :gutter="20" class="top-row">
      <el-col :span="8">
        <el-card class="stat-card">
          <div class="card-header">
            <el-icon><wallet /></el-icon>
            <span>{{ $t("dashboard.totalBalance") }} (USDT)</span>
          </div>
          <div class="card-content">
            {{ data.otcBalance }}
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card class="stat-card">
          <div class="card-header">
            <el-icon><wallet /></el-icon>
            <span>{{ $t("dashboard.availableBalance") }} (USDT)</span>
          </div>
          <div class="card-content">
            {{ data.otcAvailableBalance }}
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card class="stat-card">
          <div class="card-header">
            <el-icon><package /></el-icon>
            <span>{{ $t("dashboard.frozenBalance") }} (USDT)</span>
          </div>
          <div class="card-content">{{ data.otcFreezeBalance }}</div>
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="20" class="top-row">
      <el-col :span="6">
        <el-card class="stat-card">
          <div class="card-header">
            <span>{{ $t("form.weekForInOrder") }}</span>
          </div>
          <div class="card-content">
            USDT: {{ data.countDataCurrentDayForInOrder?.countU }}
          </div>
          <div class="card-content">
            CNY: {{ data.countDataCurrentDayForInOrder?.countCNY }}
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="stat-card">
          <div class="card-header">
            <span>{{ $t("form.dayForInOrder") }}</span>
          </div>
          <div class="card-content">
            USDT: {{ data.countDataCurrentWeekForInOrder?.countU }}
          </div>
          <div class="card-content">
            CNY: {{ data.countDataCurrentWeekForInOrder?.countCNY }}
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="stat-card">
          <div class="card-header">
            <span>{{ $t("form.dayForOutOrder") }}</span>
          </div>
          <div class="card-content">
            USDT: {{ data.countDataCurrentDayForOutOrder?.countU }}
          </div>
          <div class="card-content">
            CNY: {{ data.countDataCurrentDayForOutOrder?.countCNY }}
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="stat-card">
          <div class="card-header">
            <span>{{ $t("form.weekForOutOrder") }}</span>
          </div>
          <div class="card-content">
            USDT: {{ data.countDataCurrentWeekForOutOrder?.countU }}
          </div>
          <div class="card-content">
            CNY: {{ data.countDataCurrentWeekForOutOrder?.countCNY }}
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" class="order-summary">
      <el-col :span="12" v-show="false">
        <el-card>
          <div class="card-header">
            <span>{{ $t("dashboard.completedOrders") }}</span>
            <el-radio-group v-model="timeFrame" size="small">
              <el-radio-button label="today">{{
                $t("dashboard.today")
              }}</el-radio-button>
              <el-radio-button label="week">{{
                $t("dashboard.last7Days")
              }}</el-radio-button>
            </el-radio-group>
          </div>
          <div id="pie-chart" class="chart"></div>
        </el-card>
      </el-col>
      <el-col :span="24">
        <el-card>
          <div class="card-header">
            <span>{{ $t("dashboard.revenueDetails") }}</span>
            <!-- <el-link href="#" class="detail-link">{{
              $t("dashboard.details")
            }}</el-link> -->
          </div>
          <div id="line-chart" class="chart"></div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { ElMessage } from "element-plus";
import { useI18n } from "vue-i18n";
import { queryOtcDashboard } from "@/api/otc";
import { assignSelectedData, clearFormFields } from "@/utils/tool.js";

import * as echarts from "echarts";

const data = ref({ otcAvailableBalance: "" });
const timeFrame = ref("today");
const { t } = useI18n();

// Initialize charts
const initCharts = () => {
  const pieChart = echarts.init(document.getElementById("pie-chart"));
  const lineChart = echarts.init(document.getElementById("line-chart"));

  pieChart.setOption({
    title: {
      //   text: t("completedOrders"),
      left: "center",
    },
    tooltip: {
      trigger: "item",
    },
    series: [
      {
        name: t("completedOrders"),
        type: "pie",
        radius: "50%",
        data: [
          {
            value: data.value.yforInOrder,
            name: "CNY",
          },
        ],
      },
    ],
  });

  lineChart.setOption({
    title: {
      //   text: t("revenueDetails"),
      left: "center",
    },
    tooltip: {
      trigger: "axis",
    },
    legend: {
      data: [t("dashboard.inOrder"), t("dashboard.outOrder")],
      //   data: ["出金", "入金"],
    },
    xAxis: {
      type: "category",
      data: data.value.xforInOrder,
    },
    yAxis: {
      type: "value",
    },
    series: [
      {
        name: t("dashboard.inOrder"),
        type: "line",
        data: data.value.yforInOrder,
      },
      {
        name: t("dashboard.outOrder"),
        type: "line",
        data: data.value.yforOutOrder,
      },
    ],
  });
};
const getData = async () => {
  const response = await queryOtcDashboard();
  const newData = response.data;
  Object.assign(data.value, newData);
  console.log(data.value.otcAvailableBalance);
  initCharts();
};
onMounted(() => {
  // Mocking API call
  getData();
});
</script>

<style scoped>
.dashboard {
  padding: 20px;
  background: #f5f7fa;
}
.top-row {
  margin-bottom: 20px;
}
.stat-card {
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.stat-card .card-header {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  margin-bottom: 10px;
  color: #333;
}

.stat-card .card-content {
  font-size: 24px;
  font-weight: bold;
  color: #409eff;
}

.order-summary {
  margin-top: 30px;
}

.chart {
  height: 300px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.detail-link {
  font-size: 14px;
  color: #409eff;
  cursor: pointer;
}
</style>
