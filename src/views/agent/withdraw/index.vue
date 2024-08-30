<template>
  <el-container>
    <!-- 筛选表单 -->
    <el-header class="header">
      <div>
        <el-form :inline="true" :model="searchForm" class="demo-form-inline">
          <el-form-item :label="$t('form.inOrderId')">
            <el-input type="text" v-model="searchForm.inOrderId"></el-input>
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

      <!-- <div class="rigth">
        <el-button type="primary" @click="showExportDialog">
          {{ $t("form.export") }}
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
        <el-table-column
          prop="outOrderId"
          :label="$t('form.outOrderId')"
          width="200"
        ></el-table-column>
        <el-table-column prop="status" :label="$t('form.status')" width="100">
          <template #default="scope">
            <el-tag :type="getStatus(scope.row.status).type">
              {{ getStatus(scope.row.status).name }}</el-tag
            >
          </template>
        </el-table-column>
        <el-table-column
          prop="status"
          :label="$t('form.distribution')"
          width="100"
        >
          <template #default="scope">
            <el-tag type="success" v-if="scope.row.otcId">
              {{ $t("form.yes") }}</el-tag
            >
            <el-tag type="default" v-else> {{ $t("form.no") }}</el-tag>
          </template>
        </el-table-column>

        <el-table-column
          prop="otcName"
          :label="$t('form.otcName2')"
          width="150"
        ></el-table-column>
        <el-table-column
          prop="realTransferPrice"
          :label="$t('form.realTransferPrice')"
          width="120"
        ></el-table-column>
        <el-table-column
          prop="realQuantity"
          :label="$t('form.realQuantity')"
          width="100"
        ></el-table-column>
        <el-table-column
          prop="unitPrice"
          :label="$t('form.unitPrice')"
          width="70"
        ></el-table-column>
        <el-table-column
          prop="quantity"
          :label="$t('form.quantity')"
          width="100"
        ></el-table-column>
        <el-table-column
          prop="totalPrice"
          :label="$t('form.totalPrice')"
          width="100"
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
          prop="payee"
          :label="$t('form.withdrawPayee')"
          width="100"
        ></el-table-column>
        <el-table-column prop="payType" :label="$t('form.payType')" width="100">
          <template #default="scope">
            <el-tag :type="getPlay(scope.row.payType).type">
              {{ getPlay(scope.row.payType).name }}</el-tag
            >
          </template>
        </el-table-column>
        <el-table-column
          prop="cardId"
          :label="$t('form.payAccount')"
          width="150"
        >
          <template #default="scope">
            <span v-if="scope.row.payType === 1">
              {{ scope.row.cardId }}
            </span>
            <span v-else>
              <el-image
                style="width: 60px; height: 60px"
                :src="`data:image/jpeg;base64,${scope.row.qrCodePicture}`"
                :zoom-rate="1.2"
                :max-scale="7"
                :min-scale="0.2"
                :preview-src-list="[
                  `data:image/jpeg;base64,${scope.row.qrCodePicture}`,
                ]"
                :initial-index="1"
                fit="cover"
                :preview-teleported="true"
              />
            </span>
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

        <el-table-column :label="$t('form.actions')" width="180" fixed="right">
          <template #default="scope">
            <el-popconfirm
              :title="$t('form.cancelText')"
              :confirm-button-text="$t('form.yes')"
              :cancel-button-text="$t('form.no')"
              @confirm="() => handleDelete(scope.row)"
            >
              <template #reference>
                <el-button type="text">{{ $t("form.cancel") }}</el-button>
              </template>
            </el-popconfirm>

            <el-button type="text" @click="showAddDialog(scope.row)">{{
              $t("form.edit")
            }}</el-button>
            <el-button type="text" @click="showAddDialog2(scope.row)">{{
              $t("form.allocateOrder")
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

    <!-- 分配对话框 -->
    <el-dialog :title="$t('form.edit')" v-model="isAddDialogVisible2">
      <el-form
        :model="addForm2"
        :rules="rules2"
        ref="addFormRef2"
        label-width="120px"
      >
        <el-form-item :label="$t('form.nameEmail')" prop="email">
          <!-- <el-input v-model="addForm2.email"></el-input> -->
          <el-select v-model="addForm2.email" filterable>
            <el-option
              v-for="item in otcSelectData"
              :key="item.email"
              :label="`${item.name}（${item.email}）`"
              :value="item.email"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('form.unitPrice')" prop="unitPrice">
          <el-input v-model="addForm2.unitPrice"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="isAddDialogVisible2 = false">
          {{ $t("form.cancel") }}
        </el-button>
        <el-button
          type="primary"
          :loading="dialogLoading"
          @click="allocateSubmit"
        >
          {{ $t("form.confirm") }}
        </el-button>
      </template>
    </el-dialog>

    <!-- 编辑订单对话框 -->
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
        <el-form-item :label="$t('form.quantity')" prop="quantity">
          <el-input type="number" v-model="addForm.quantity"></el-input>
        </el-form-item>
        <el-form-item :label="$t('form.realQuantity')" prop="realQuantity">
          <el-input type="number" v-model="addForm.realQuantity"></el-input>
        </el-form-item>
        <el-form-item :label="$t('form.transferName')" prop="transferName">
          <el-input type="text" v-model="addForm.transferName"></el-input>
        </el-form-item>
        <el-form-item :label="$t('form.payee')" prop="payee">
          <el-input type="text" v-model="addForm.payee"></el-input>
        </el-form-item>
        <el-form-item
          :label="$t('form.outServiceChargePrice')"
          prop="outServiceChargePrice"
        >
          <el-input
            type="number"
            v-model="addForm.outServiceChargePrice"
          ></el-input>
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
import { queryOutOrderList, updateOutOrderStatus } from "@/api/otc.js";
import { getLegalCurrencyDict, getCoinDict } from "@/api/buyer.js";
import {
  shareOutOrderToOtc,
  updateOutOrder,
  getOtcSelectData,
  downloadOutOrderData,
} from "@/api/agent.js";
import { ElMessage } from "element-plus";
import moment from "moment";
import { getPlay, getStatus } from "@/utils/enumerate.js";
import { uploadPicture, previewPicture } from "@/api/file";
import { assignSelectedData, clearFormFields } from "@/utils/tool.js";

const paymentOptions = computed(() => getPlay());

const { t } = useI18n();

// 初始化数据
const coinOptions = ref([]);
const legalCurrencyOptions = ref([]);
const otcSelectData = ref([]);
const isAddDialogVisible2 = ref(false);

// 表单相关状态
const searchForm = ref({
  coin: "",
  legalCurrency: "",
  status: "",
  inOrderId: "",
});
const addForm = ref({
  coin: "",
  legalCurrency: "",
  unitPrice: "",
  totalPrice: "",
  realTransferPrice: "",
  proxyPrice: "",
  quantity: "",
  realQuantity: "",
  transferName: "",
  outOrderId: "",
  //
  outServiceChargePrice: "",
  payee: "",
});
const addForm2 = ref({
  email: "",
  unitPrice: "",
});
const addFormRef2 = ref(null);
const addFormRef3 = ref(null);
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
  outServiceChargePrice: [
    { required: true, message: t("form.requiredText"), trigger: "blur" },
  ],
  payee: [{ required: true, message: t("form.requiredText"), trigger: "blur" }],
});

const rules2 = ref({
  email: [
    { required: true, message: t("login.email_placeholder"), trigger: "blur" },
    {
      type: "email",
      message: t("login.email_format_error"),
      trigger: ["blur", "change"],
    },
  ],
  unitPrice: [
    { required: true, message: t("form.requiredText"), trigger: "blur" },
  ],
});
const rules3 = ref({
  dateList: [
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
const exportDialogVisible = ref(false);
const exportData = ref({
  startDate: "",
  endDate: "",
  merchantName: "",
  otcName: "",
  dateList: [],
});
const showExportDialog = () => {
  exportDialogVisible.value = true;
  exportData.value = {
    startDate: "",
    endDate: "",
    merchantName: "",
    otcName: "",
    dateList: [],
  };
};

// 禁用超过当前日期的日期
const disabledDate = (time) => {
  return time.getTime() > Date.now();
};

const exportLoading = ref(false);
const exportFn = async () => {
  exportLoading.value = true;
  addFormRef3.value.validate(async (valid) => {
    if (valid) {
      const { merchantName, otcName, dateList } = exportData.value;
      try {
        const res = await downloadOutOrderData({
          startDate: moment(dateList[0]).format("YYYY-MM-DD"),
          endDate: moment(dateList[1]).format("YYYY-MM-DD"),
          merchantName,
          otcName,
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
// 模拟获取 coin 和 legalCurrency 列表
const fetchOptions = async () => {
  const res = await getCoinDict();
  const res2 = await getLegalCurrencyDict();
  const res3 = await getOtcSelectData();
  coinOptions.value = res.data;
  legalCurrencyOptions.value = res2.data;
  otcSelectData.value = res3.data;
};

// 查询列表数据
const loadData = async () => {
  tableLoading.value = true;
  try {
    const { data } = await queryOutOrderList({
      pageNum: currentPage.value,
      pageSize: pageSize.value,
      ...searchForm.value,
      outOrderId: searchForm.value.inOrderId,
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
        await updateOutOrder({ ...addForm.value });
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
// 分配
const allocateSubmit = () => {
  dialogLoading.value = true;
  addFormRef2.value.validate(async (valid) => {
    if (valid) {
      console.log(addForm2.value, allocateRow.value);
      try {
        await shareOutOrderToOtc({
          otcEmail: addForm2.value.email,
          unitPrice: addForm2.value.unitPrice,
          outOrderId: allocateRow.value.outOrderId,
        });
        ElMessage.success(t("form.successText"));
        isAddDialogVisible2.value = false;
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
  const res = await updateOutOrderStatus({
    outOrderId: row.outOrderId,
    status: 4,
  });
  console.log(res);
  ElMessage.success(t("form.success"));
  loadData();
};
// 重置搜索表单
const handleReset = () => {
  searchForm.value = { coin: "", legalCurrency: "", status: "", inOrderId: "" };
  loadData();
};

// 分页功能
const handlePageChange = (page) => {
  currentPage.value = page;
  loadData();
};
const allocateRow = ref({});
//分配
const showAddDialog2 = (row) => {
  allocateRow.value = row;
  isAddDialogVisible2.value = true;
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
