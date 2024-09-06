<template>
  <el-container>
    <!-- 筛选表单 -->
    <el-header class="header">
      <div>
        <el-form :inline="true" :model="searchForm" class="demo-form-inline">
          <el-form-item :label="$t('form.outOrderId')">
            <el-input v-model="searchForm.withdrawalId"></el-input>
          </el-form-item>
          <el-form-item :label="$t('form.coin')">
            <el-select
              width="100%"
              v-model="searchForm.coin"
              :placeholder="$t('form.select')"
            >
              <el-option
                v-for="item in coinOptions"
                :key="item.id"
                :label="item.value"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item :label="$t('form.status')">
            <el-select
              v-model="searchForm.status"
              :placeholder="$t('form.select')"
            >
              <el-option
                v-for="item in getWithdrawalList()"
                :key="item.key"
                :value="item.key"
                :label="item.name"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('form.startAndEndTime')">
            <el-date-picker
              v-model="dateList"
              type="daterange"
              start-placeholder="Start Date"
              end-placeholder="End Date"
              align="right"
              format="YYYY/MM/DD"
            ></el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleSearch">
              {{ $t("form.search") }}
            </el-button>
            <el-button @click="handleReset">{{ $t("form.reset") }}</el-button>
          </el-form-item>
        </el-form>
      </div>

      <!-- <div class="rigth">
        <el-button type="primary" @click="showAddDialog">
          {{ $t("form.add") }}
        </el-button>
      </div> -->
    </el-header>

    <!-- 表格和分页 -->
    <el-main>
      <el-table
        :data="tableData"
        style="width: 100%; min-height: calc(100vh - 330px)"
        v-loading="tableLoading"
      >
        <el-table-column type="index" width="50" />
        <el-table-column
          prop="merchantName"
          :label="$t('form.name')"
        ></el-table-column>
        <el-table-column
          prop="merchantName"
          :label="$t('form.merchantName')"
          width="150"
        ></el-table-column>
        <el-table-column
          prop="withdrawalId"
          :label="$t('form.outOrderId')"
          width="220"
        ></el-table-column>
        <el-table-column prop="status" :label="$t('form.status')" width="100">
          <template #default="scope">
            <el-tag :type="getWithdrawalList(scope.row.status).type">
              {{ getWithdrawalList(scope.row.status).name }}</el-tag
            >
          </template>
        </el-table-column>

        <el-table-column
          prop="quantity"
          :label="$t('form.quantity2')"
          sortable
          width="120"
        ></el-table-column>
        <el-table-column
          prop="withdrawalServiceChargePrice"
          :label="$t('form.withdrawalServiceChargePrice')"
          sortable
          width="120"
        >
        </el-table-column>
        <el-table-column
          prop="realQuantity"
          :label="$t('form.realQuantity')"
          sortable
          width="120"
        >
        </el-table-column>
        <el-table-column
          prop="coin"
          :label="$t('form.coin')"
          width="70"
        ></el-table-column>
        <el-table-column prop="walletType" :label="$t('form.walletType')">
        </el-table-column>
        <el-table-column
          prop="walletUrl"
          :label="$t('form.walletUrl')"
          width="300"
        >
        </el-table-column>

        <el-table-column
          prop="createDate"
          :label="$t('form.createDate')"
          width="120"
        >
          <template #default="scope">
            <!-- {{ moment(scope.row.createDate).format("YYYY-MM-DD hh:mm:ss") }} -->
            {{ scope.row.createDate }}
          </template>
        </el-table-column>

        <el-table-column :label="$t('form.actions')" width="200" fixed="right">
          <template #default="scope">
            <el-popconfirm
              :title="$t('form.confirmRecharge')"
              confirm-button-text="是"
              cancel-button-text="否"
              @confirm="() => handleDelete(scope.row, 2)"
              v-if="scope.row.status !== 3"
            >
              <template #reference>
                <el-button type="text">{{
                  $t("form.transferCompleted")
                }}</el-button>
              </template>
            </el-popconfirm>
            <el-popconfirm
              :title="$t('form.confirmRecharge')"
              confirm-button-text="是"
              cancel-button-text="否"
              @confirm="() => handleDelete(scope.row, 3)"
            >
              <template #reference>
                <el-button type="text">{{ $t("form.dismiss") }}</el-button>
              </template>
            </el-popconfirm>
            <el-button type="text" @click="showAddDialog(scope.row)">{{
              $t("form.edit")
            }}</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="rigth">
        <el-pagination
          background
          layout="prev, pager, next"
          :total="totalItems"
          :page-size="pageSize"
          :current-page="currentPage"
          @current-change="handlePageChange"
        ></el-pagination>
      </div>
    </el-main>

    <!-- 新增对话框 -->
    <!-- 新增对话框 -->
    <el-dialog :title="$t('form.edit')" v-model="isAddDialogVisible">
      <el-form
        :model="addForm"
        :rules="rules"
        ref="addFormRef"
        label-width="100px"
      >
        <el-form-item :label="$t('form.coin')" prop="coin">
          <el-select v-model="addForm.coin" :placeholder="$t('form.select')">
            <el-option
              v-for="item in coinOptions"
              :key="item.id"
              :label="item.value"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('form.quantity2')" prop="quantity">
          <el-input type="number" v-model="addForm.quantity"></el-input>
        </el-form-item>
        <el-form-item :label="$t('form.walletUrl')" prop="walletUrl">
          <el-input v-model="addForm.walletUrl"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="isAddDialogVisible = false">
          {{ $t("form.cancel") }}
        </el-button>
        <el-button
          type="primary"
          :loading="dialogLoading"
          @click="handleAddSubmit"
        >
          {{ $t("form.confirm") }}
        </el-button>
      </template>
    </el-dialog>
  </el-container>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useI18n } from "vue-i18n";
import {
  updateWithdrawalOrderStatus,
  queryWithdrawalList,
  updateWithdrawalOrder,
} from "@/api/agent";
import { getLegalCurrencyDict, getCoinDict } from "@/api/buyer.js";
import { ElMessage } from "element-plus";
import moment from "moment";
import { getPlay, getWithdrawalList } from "@/utils/enumerate.js";
import { uploadPicture, previewPicture } from "@/api/file";
import { assignSelectedData, clearFormFields } from "@/utils/tool.js";
const paymentOptions = computed(() => getPlay());

const { t } = useI18n();

// 初始化数据
const coinOptions = ref([]);
const legalCurrencyOptions = ref([]);

// 表单相关状态
const searchForm = ref({
  coin: "",
  legalCurrency: "",
  status: "",
  withdrawalId: "",
});
const dateList = ref([]);
const addForm = ref({
  withdrawalId: "",
  coin: "",
  walletUrl: "",
  quantity: "",
  withdrawalServiceChargePrice: "",
});
const imgUrl = ref({
  alipayQRcode: "",
  wechatQRcode: "",
});
const rules = ref({
  coin: [{ required: true, message: t("form.requiredText"), trigger: "blur" }],
  quantity: [
    { required: true, message: t("form.requiredText"), trigger: "blur" },
  ],
  walletUrl: [
    { required: true, message: t("form.requiredText"), trigger: "blur" },
  ],
  withdrawalServiceChargePrice: [
    { required: true, message: t("form.requiredText"), trigger: "blur" },
  ],
});

const tableData = ref([]);
const totalItems = ref(0);
const currentPage = ref(1);
const pageSize = ref(10);
const tableLoading = ref(false);
const dialogLoading = ref(false);
const isAddDialogVisible = ref(false);
const addFormRef = ref(null);

// 模拟获取 coin 和 legalCurrency 列表
const fetchOptions = async () => {
  const res = await getCoinDict();
  const res2 = await getLegalCurrencyDict();
  coinOptions.value = res.data;
  legalCurrencyOptions.value = res2.data;
};

// 查询列表数据
const loadData = async () => {
  tableLoading.value = true;
  try {
    const { data } = await queryWithdrawalList({
      pageNum: currentPage.value,
      pageSize: pageSize.value,
      ...searchForm.value,
      startDate: dateList.value[0]
        ? moment(dateList.value[0]).format("YYYY-MM-DD")
        : "",
      endDate: dateList.value[1]
        ? moment(dateList.value[1]).format("YYYY-MM-DD")
        : "",
    });
    tableData.value = data.records;
    totalItems.value = data.totalNum;
  } catch (error) {
    ElMessage.error(t("message.loadDataError"));
  } finally {
    tableLoading.value = false;
  }
};

// 新增产品
const handleAddSubmit = () => {
  dialogLoading.value = true;
  addFormRef.value.validate(async (valid) => {
    if (valid) {
      try {
        await updateWithdrawalOrder({ ...addForm.value });
        ElMessage.success(t("form.success"));
        isAddDialogVisible.value = false;
        loadData(); // 重新加载数据
      } catch (error) {
        dialogLoading.value = false;
      } finally {
        dialogLoading.value = false;
      }
    } else {
      dialogLoading.value = false;
    }
  });
};

// 搜索功能
const handleSearch = () => {
  currentPage.value = 1;
  loadData();
};
//上架和下载
const handleDelete = async (row, key) => {
  const res = await updateWithdrawalOrderStatus({
    withdrawalOrderId: row.withdrawalId,
    status: key,
  });
  console.log(res);
  ElMessage.success(t("form.successText"));
  loadData();
};
// 重置搜索表单
const handleReset = () => {
  searchForm.value = {
    coin: "",
    legalCurrency: "",
    status: "",
    withdrawalId: "",
  };
  dateList.value = [];
  loadData();
};

// 分页功能
const handlePageChange = (page) => {
  currentPage.value = page;
  loadData();
};

// 显示新增对话框
const showAddDialog = (row) => {
  addForm.value = assignSelectedData(addForm.value, row);
  isAddDialogVisible.value = true;
};

// 页面加载时初始化数据
onMounted(() => {
  fetchOptions();
  loadData();
});
</script>

<style scoped>
.header {
  padding: 10px;
  background-color: #f0f2f5;
  min-height: 120px;
}

.demo-form-inline .el-form-item {
  margin-right: 10px;
}
.demo-form-inline .el-input {
  --el-input-width: 220px;
}

.demo-form-inline .el-select {
  --el-select-width: 220px;
}

.el-main {
  padding: 20px;
  background-color: #fff;
}
.rigth {
  display: flex;
  justify-content: flex-end;
  padding-top: 20px;
}
</style>
