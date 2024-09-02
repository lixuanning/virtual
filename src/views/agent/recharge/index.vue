<template>
  <el-container>
    <!-- 筛选表单 -->
    <el-header class="header">
      <div>
        <el-form :inline="true" :model="searchForm" class="demo-form-inline">
          <el-form-item :label="$t('form.inOrderId')">
            <el-input type="text" v-model="searchForm.outOrderId"></el-input>
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
          <el-form-item :label="$t('form.legalCurrency')">
            <el-select
              v-model="searchForm.legalCurrency"
              :placeholder="$t('form.select')"
            >
              <el-option
                v-for="item in legalCurrencyOptions"
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
                v-for="item in getStatus()"
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
            <el-button type="primary" @click="showExportDialog">
              {{ $t("form.export") }}
            </el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-header>

    <!-- 表格和分页 -->
    <el-main>
      <el-table
        :data="tableData"
        style="width: 100%; min-height: calc(100vh - 330px)"
        v-loading="tableLoading"
      >
        <el-table-column
          prop="inOrderId"
          :label="$t('form.inOrderId')"
          width="200"
        ></el-table-column>
        <el-table-column
          prop="merchantName"
          :label="$t('form.merchantName')"
          width="90"
        ></el-table-column>
        <el-table-column
          prop="merchantOrderId"
          :label="$t('form.merchantOrderId')"
          width="180"
        ></el-table-column>
        <el-table-column
          prop="productId"
          :label="$t('form.productId')"
          width="120"
        ></el-table-column>
        <el-table-column
          prop="otcName"
          :label="$t('form.otcName2')"
          width="150"
        ></el-table-column>
        <el-table-column prop="status" :label="$t('form.status')" width="100">
          <template #default="scope">
            <el-tag :type="getStatus(scope.row.status).type">
              {{ getStatus(scope.row.status).name }}</el-tag
            >
          </template>
        </el-table-column>
        <el-table-column
          prop="realTransferPrice"
          :label="$t('form.realTransferPrice')"
          width="140"
          sortable
        ></el-table-column>
        <el-table-column
          prop="realQuantity"
          sortable
          :label="$t('form.realQuantity')"
          width="120"
        ></el-table-column>
        <el-table-column
          prop="unitPrice"
          :label="$t('form.unitPrice')"
          width="100"
          sortable
        ></el-table-column>
        <el-table-column
          prop="quantity"
          :label="$t('form.quantity')"
          width="120"
          sortable
        ></el-table-column>
        <el-table-column
          prop="totalPrice"
          :label="$t('form.totalPrice')"
          width="100"
          sortable
        ></el-table-column>

        <el-table-column
          prop="coin"
          :label="$t('form.coin')"
          width="70"
        ></el-table-column>

        <el-table-column
          prop="legalCurrency"
          :label="$t('form.legalCurrency')"
        ></el-table-column>

        <el-table-column
          prop="transferName"
          :label="$t('form.transferName')"
          width="100"
        ></el-table-column>
        <el-table-column prop="payType" :label="$t('form.payType')" width="100">
          <template #default="scope">
            {{ getPlay(scope.row.payType).name }}
          </template>
        </el-table-column>
        <el-table-column
          prop="createDate"
          :label="$t('form.createDate')"
          width="120"
        >
          <template #default="scope">
            {{ moment(scope.row.createDate).format("YYYY-MM-DD") }}
          </template>
        </el-table-column>

        <el-table-column :label="$t('form.actions')" width="120" fixed="right">
          <template #default="scope">
            <el-popconfirm
              :title="$t('form.cancelText')"
              confirm-button-text="是"
              cancel-button-text="否"
              @confirm="() => handleDelete(scope.row)"
            >
              <template #reference>
                <el-button type="text">{{ $t("form.cancel") }}</el-button>
              </template>
            </el-popconfirm>

            <el-button type="text" @click="showAddDialog(scope.row)">{{
              $t("form.edit")
            }}</el-button>

            <el-button type="text" @click="showTransferPicture(scope.row)">{{
              $t("form.transferPicture")
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
    <el-dialog :title="$t('form.edit')" v-model="isAddDialogVisible">
      <el-form
        :model="addForm"
        :rules="rules"
        ref="addFormRef"
        label-width="100px"
      >
        <el-form-item :label="$t('form.coin')" prop="coin">
          <el-select v-model="addForm.coin" placeholder="Select Coin">
            <el-option
              v-for="item in coinOptions"
              :key="item.id"
              :label="item.value"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item :label="$t('form.legalCurrency')" prop="legalCurrency">
          <el-select
            v-model="addForm.legalCurrency"
            placeholder="Select Currency"
          >
            <el-option
              v-for="item in legalCurrencyOptions"
              :key="item.id"
              :label="item.value"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item :label="$t('form.unitPrice')" prop="unitPrice">
          <el-input type="number" v-model="addForm.unitPrice"></el-input>
        </el-form-item>
        <el-form-item :label="$t('form.totalPrice')" prop="totalPrice">
          <el-input type="number" v-model="addForm.totalPrice"></el-input>
        </el-form-item>
        <el-form-item
          :label="$t('form.realTransferPrice')"
          prop="realTransferPrice"
        >
          <el-input
            type="number"
            v-model="addForm.realTransferPrice"
          ></el-input>
        </el-form-item>
        <el-form-item
          :label="$t('form.inServiceChargePrice')"
          prop="inServiceChargePrice"
        >
          <el-input
            type="number"
            v-model="addForm.inServiceChargePrice"
          ></el-input>
        </el-form-item>
        <el-form-item :label="$t('form.proxyPrice')" prop="proxyPrice">
          <el-input type="number" v-model="addForm.proxyPrice"></el-input>
        </el-form-item>
        <el-form-item :label="$t('form.quantity')" prop="quantity">
          <el-input type="number" v-model="addForm.quantity"></el-input>
        </el-form-item>
        <el-form-item :label="$t('form.realQuantity')" prop="realQuantity">
          <el-input type="number" v-model="addForm.realQuantity"></el-input>
        </el-form-item>
        <el-form-item :label="$t('form.transferName')" prop="transferName">
          <el-input type="text" v-model="addForm.transferName"></el-input>
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

    <!-- 导出 -->
    <el-dialog :title="$t('form.export')" v-model="exportDialogVisible">
      <el-form
        :model="exportData"
        :rules="rules3"
        ref="addFormRef3"
        label-width="120px"
      >
        <el-form-item :label="$t('form.startAndEndTime')" prop="dateList">
          <el-date-picker
            v-model="exportData.dateList"
            type="daterange"
            start-placeholder="Start Date"
            end-placeholder="End Date"
            align="right"
            format="YYYY/MM/DD"
            :disabled-date="disabledDate"
          ></el-date-picker>
        </el-form-item>
        <el-form-item :label="$t('form.startAndEndTime')" prop="dateList">
          <el-date-picker
            v-model="exportData.dateList"
            type="daterange"
            start-placeholder="Start Date"
            end-placeholder="End Date"
            align="right"
            format="YYYY/MM/DD"
            :disabled-date="disabledDate"
          ></el-date-picker>
        </el-form-item>
        <el-form-item :label="$t('form.otcName2')" prop="otcName">
          <el-input v-model="exportData.otcName"></el-input>
        </el-form-item>
        <el-form-item :label="$t('form.merchantName')" prop="merchantName">
          <el-input v-model="exportData.merchantName"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="exportDialogVisible = false">
          {{ $t("form.cancel") }}
        </el-button>
        <el-button type="primary" :loading="exportLoading" @click="exportFn">
          {{ $t("form.confirm") }}
        </el-button>
      </template>
    </el-dialog>
    <!-- 转账凭证 -->
    <el-dialog :title="$t('form.view')" v-model="transferPictureVisible">
      <el-image
        style="width: 400px; height: 400px"
        :src="`data:image/jpeg;base64,${transferPictureUrl}`"
        :zoom-rate="1.2"
        :max-scale="7"
        :min-scale="0.2"
        :preview-src-list="[`data:image/jpeg;base64,${transferPictureUrl}`]"
        :initial-index="1"
        fit="cover"
        :preview-teleported="true"
      />
      <template #footer>
        <el-button @click="transferPictureVisible = false">
          {{ $t("form.cancel") }}
        </el-button>
      </template>
    </el-dialog>
  </el-container>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import {
  queryInOrderList,
  getCoinDict,
  getLegalCurrencyDict,
} from "@/api/otc.js";
import {
  updateInOrderStatus,
  updateInOrder,
  downloadInOrderData,
  getTransferPicture,
} from "@/api/agent.js";
import { ElMessage } from "element-plus";
import moment from "moment";
import { getPlay, getStatus } from "@/utils/enumerate.js";
import { assignSelectedData, clearFormFields } from "@/utils/tool.js";

const { t } = useI18n();

// 初始化数据
const coinOptions = ref([]);
const legalCurrencyOptions = ref([]);

// 表单相关状态
const searchForm = ref({
  coin: "",
  legalCurrency: "",
  status: "",
  outOrderId: "",
});
const dateList = ref([]);
const addForm = ref({
  coin: "",
  legalCurrency: "",
  unitPrice: "",
  totalPrice: "",
  realTransferPrice: "",
  inServiceChargePrice: "",
  proxyPrice: "",
  quantity: "",
  realQuantity: "",
  transferName: "",
  inOrderId: "",
});

const rules = ref({
  coin: [{ required: true, message: t("form.requiredText"), trigger: "blur" }],
  supportPay: [
    { required: true, message: t("form.requiredText"), trigger: "blur" },
  ],
  unitPrice: [
    { required: true, message: t("form.requiredText"), trigger: "blur" },
  ],
  legalCurrency: [
    {
      required: true,
      message: t("form.requiredText"),
      trigger: "blur",
    },
  ],
  totalPrice: [
    { required: true, message: t("form.requiredText"), trigger: "blur" },
  ],
  realTransferPrice: [
    { required: true, message: t("form.requiredText"), trigger: "blur" },
  ],
  inServiceChargePrice: [
    { required: true, message: t("form.requiredText"), trigger: "blur" },
  ],
  proxyPrice: [
    { required: true, message: t("form.requiredText"), trigger: "blur" },
  ],
  quantity: [
    { required: true, message: t("form.requiredText"), trigger: "blur" },
  ],
  transferName: [
    { required: true, message: t("form.requiredText"), trigger: "blur" },
  ],
  realQuantity: [
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
    const { data } = await queryInOrderList({
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

const exportDialogVisible = ref(false);
const exportData = ref({
  startDate: "",
  endDate: "",
  merchantName: "",
  otcName: "",
  status: "",
  dateList: [],
});
const showExportDialog = () => {
  exportDialogVisible.value = true;
  exportData.value = {
    startDate: "",
    endDate: "",
    merchantName: "",
    otcName: "",
    status: "",
    dateList: [],
  };
};
const addFormRef3 = ref(null);
// 禁用超过当前日期的日期
const disabledDate = (time) => {
  return time.getTime() > Date.now();
};

const exportLoading = ref(false);
const exportFn = async () => {
  exportLoading.value = true;
  addFormRef3.value.validate(async (valid) => {
    if (valid) {
      const { merchantName, otcName, dateList, status } = exportData.value;
      try {
        const res = await downloadInOrderData({
          startDate: moment(dateList[0]).format("YYYY-MM-DD"),
          endDate: moment(dateList[1]).format("YYYY-MM-DD"),
          merchantName,
          otcName,
          status,
        });
        const downloadUrl = res.data.downloadUrl;
        const link = document.createElement("a");
        link.href = `http://47.122.43.46:7070/api/${downloadUrl}`;
        link.click();
        exportLoading.value = false;
      } catch (error) {
        exportLoading.value = false;
      }
    } else {
      exportLoading.value = false;
    }
  });
};
// 新增产品
const handleAddSubmit = () => {
  dialogLoading.value = true;
  addFormRef.value.validate(async (valid) => {
    if (valid) {
      try {
        await updateInOrder({
          ...addForm.value,
        });
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
const handleDelete = async (row) => {
  const res = await updateInOrderStatus({
    inOrderId: row.inOrderId,
    status: 4,
  });
  console.log(res);
  ElMessage.success(t("form.success"));
  loadData();
};
// 重置搜索表单
const handleReset = () => {
  searchForm.value = {
    coin: "",
    legalCurrency: "",
    status: "",
    outOrderId: "",
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
  console.log(row);
  addForm.value = assignSelectedData(addForm.value, row);

  isAddDialogVisible.value = true;
};
const transferPictureVisible = ref(false);
const transferPictureUrl = ref("");
const showTransferPicture = async (row) => {
  const res = await getTransferPicture({
    transferPictureId: row.transferPictureId,
  });
  transferPictureUrl.value = res.data.picture;
  transferPictureVisible.value = true;
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
