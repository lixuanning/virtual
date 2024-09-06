<template>
  <el-container>
    <!-- 筛选表单 -->
    <el-header class="header">
      <div>
        <el-form :inline="true" :model="searchForm" class="demo-form-inline">
          <el-form-item :label="$t('form.name')">
            <el-input v-model="searchForm.name"></el-input>
          </el-form-item>
          <el-form-item :label="$t('form.email')">
            <el-input v-model="searchForm.email"></el-input>
          </el-form-item>

          <el-form-item :label="$t('form.status')">
            <el-select
              width="100%"
              v-model="searchForm.status"
              :placeholder="$t('form.select')"
            >
              <el-option
                v-for="item in getAuditStatus()"
                :key="item.key"
                :label="item.name"
                :value="item.key"
              ></el-option>
            </el-select>
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
          prop="name"
          :label="$t('form.name')"
          width="180"
        ></el-table-column>
        <el-table-column
          prop="email"
          :label="$t('form.email')"
          width="180"
        ></el-table-column>
        <el-table-column prop="status" :label="$t('form.status')" width="120">
          <template #default="scope">
            <el-tag :type="getAuditStatus(scope.row.status).type">
              {{ getAuditStatus(scope.row.status).name }}</el-tag
            >
          </template>
        </el-table-column>
        <el-table-column
          prop="merchantBalance"
          :label="$t('form.residue')"
          sortable
          width="120"
        >
        </el-table-column>
        <el-table-column
          prop="merchantAvailableBalance"
          :label="$t('form.otcAvailableBalance')"
          sortable
          width="120"
        >
        </el-table-column>

        <el-table-column
          prop="lowerMerchant"
          :label="$t('form.lowerMerchant')"
          width="200"
        >
          <template #default="scope">
            <p v-for="item in scope.row.lowerMerchant" :key="item">
              {{ item.name }}/{{ item.email }}
            </p>
          </template>
        </el-table-column>

        <el-table-column
          prop="createDate"
          :label="$t('form.created')"
          width="200"
        >
          <template #default="scope">
            {{ moment(scope.row.createDate).format("YYYY-MM-DD hh:mm:ss") }}
          </template>
        </el-table-column>

        <el-table-column :label="$t('form.actions')" width="180" fixed="right">
          <template #default="scope">
            <el-button type="text" @click="showEditDialog(scope.row, 1)">
              {{ $t("form.userAudit") }}
            </el-button>
            <el-button type="text" @click="showEditDialog(scope.row, 2)">
              {{ $t("form.updateUserName") }}
            </el-button>
            <!-- <el-button type="text" @click="showEditDialog(scope.row, 2)">
              {{ $t("form.topUp") }}
            </el-button>
            <el-button type="text" @click="showEditDialog(scope.row, 3)">
              {{ $t("form.deduction") }}
            </el-button>
            <el-button
              type="text"
              :loading="showLoding"
              @click="showEditDialog(scope.row, 4)"
            >
              {{ $t("form.userDetails") }}
            </el-button> -->
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
    <!-- 修改状态对话框 -->
    <el-dialog :title="$t('form.setting')" v-model="isAddDialogVisible2">
      <el-form
        :model="updateStatusData"
        :rules="rules2"
        ref="addFormRef2"
        label-width="120px"
      >
        <el-form-item
          :label="$t('form.status')"
          prop="status"
          v-if="thisKey === 1"
        >
          <el-select
            width="100%"
            v-model="updateStatusData.status"
            :placeholder="$t('form.select')"
          >
            <el-option
              v-for="item in getAuditStatus()"
              :key="item.key"
              :label="item.name"
              :value="item.key"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('form.name')" prop="name" v-if="thisKey === 2">
          <el-input type="text" v-model="updateStatusData.name" />
        </el-form-item>

        <el-form-item
          :label="$t('form.quantity4')"
          prop="quantity"
          v-if="thisKey === 3"
        >
          <el-input type="number" v-model="updateStatusData.quantity" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="isAddDialogVisible2 = false">
          {{ $t("form.cancel") }}
        </el-button>
        <el-button
          type="primary"
          :loading="dialogLoading"
          @click="updateStatusFn"
        >
          {{ $t("form.confirm") }}
        </el-button>
      </template>
    </el-dialog>

    <el-dialog :title="$t('form.view')" v-model="showDialogVisible">
      <div class="text item">
        <el-row :gutter="20">
          <el-col :span="24">
            <el-descriptions :border="true" :column="1">
              <el-descriptions-item :label="$t('userProfile.userId')"
                >{{ userData.userId }}11</el-descriptions-item
              >
              <el-descriptions-item :label="$t('userProfile.email')">{{
                userData.email
              }}</el-descriptions-item>
              <el-descriptions-item :label="$t('userProfile.name')">{{
                userData.name
              }}</el-descriptions-item>
              <el-descriptions-item :label="$t('userProfile.mobile')">{{
                userData.mobile
              }}</el-descriptions-item>
              <el-descriptions-item :label="$t('userProfile.status')">{{
                userStatus === 1 ? $t("form.enable") : $t("form.disable")
              }}</el-descriptions-item>
              <el-descriptions-item :label="$t('register.idCardFrontId')">
                <el-image
                  style="width: 30px; height: 30px"
                  :src="`data:image/jpeg;base64,${userData.idCardFrontPicture}`"
                  :zoom-rate="1.2"
                  :max-scale="7"
                  :min-scale="0.2"
                  :preview-src-list="[
                    `data:image/jpeg;base64,${userData.idCardFrontPicture}`,
                  ]"
                  :initial-index="1"
                  fit="cover"
                  :preview-teleported="true"
                />
              </el-descriptions-item>
              <el-descriptions-item :label="$t('register.idCardBackId')">
                <el-image
                  style="width: 30px; height: 30px"
                  :src="`data:image/jpeg;base64,${userData.idCardBackPicture}`"
                  :zoom-rate="1.2"
                  :max-scale="7"
                  :min-scale="0.2"
                  :preview-src-list="[
                    `data:image/jpeg;base64,${userData.idCardBackPicture}`,
                  ]"
                  :initial-index="1"
                  fit="cover"
                  :preview-teleported="true"
                />
              </el-descriptions-item>
              <el-descriptions-item :label="$t('register.idCardInHandId')">
                <el-image
                  style="width: 30px; height: 30px"
                  :src="`data:image/jpeg;base64,${userData.idCardInHandPicture}`"
                  :zoom-rate="1.2"
                  :max-scale="7"
                  :min-scale="0.2"
                  :preview-src-list="[
                    `data:image/jpeg;base64,${userData.idCardInHandPicture}`,
                  ]"
                  :initial-index="1"
                  fit="cover"
                  :preview-teleported="true"
                />
              </el-descriptions-item>
            </el-descriptions>
          </el-col>
        </el-row>
      </div>
      <template #footer>
        <el-button @click="showDialogVisible = false">
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
  addProduct,
  updateProductStatus,
  getLegalCurrencyDict,
  getCoinDict,
} from "@/api/otc.js";
import {
  queryProxyMerchantUserList,
  updateUserStatus,
  otcRecharge,
  otcSubtract,
  getOtcDetail,
  updateUserName,
} from "@/api/agent.js";
import { ElMessage } from "element-plus";
import moment from "moment";
import { getAuditStatus } from "@/utils/enumerate.js";
const { t } = useI18n();

// 初始化数据
const coinOptions = ref([]);
const legalCurrencyOptions = ref([]);
const isAddDialogVisible2 = ref(false);
const addFormRef2 = ref(null);
// 表单相关状态
const searchForm = ref({ email: "", status: "", name: "" });
const addForm = ref({
  coin: "",
  total: "",
  legalCurrency: "",
  buyMin: "",
  buyMax: "",
  desc: "",
  mark: "",
  supportPay: [],
  saleStartDate: null,
  saleEndDate: null,
  dateList: [],
});
const updateStatusData = ref({
  status: "",
  quantity: "",
  name: "",
});
const rules2 = ref({
  status: [
    { required: true, message: t("form.requiredText"), trigger: "blur" },
  ],
  quantity: [
    { required: true, message: t("form.requiredText"), trigger: "blur" },
  ],
  name: [{ required: true, message: t("form.requiredText"), trigger: "blur" }],
});
const rules = ref({
  coin: [{ required: true, message: t("form.requiredText"), trigger: "blur" }],
  supportPay: [
    { required: true, message: t("form.requiredText"), trigger: "blur" },
  ],
  total: [{ required: true, message: t("form.requiredText"), trigger: "blur" }],
  legalCurrency: [
    {
      required: true,
      message: t("form.requiredText"),
      trigger: "blur",
    },
  ],
  buyMin: [
    { required: true, message: t("form.requiredText"), trigger: "blur" },
  ],
  buyMax: [
    { required: true, message: t("form.requiredText"), trigger: "blur" },
  ],
  dateList: [
    {
      required: true,
      message: t("form.requiredText"),
      trigger: "blur",
    },
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
    const { data } = await queryProxyMerchantUserList({
      pageNum: currentPage.value,
      pageSize: pageSize.value,
      ...searchForm.value,
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
    const {
      coin,
      total,
      legalCurrency,
      buyMin,
      buyMax,
      desc,
      mark,
      supportPay,
      dateList,
    } = addForm.value;
    if (valid) {
      try {
        await addProduct({
          coin,
          total,
          legalCurrency,
          buyMin,
          buyMax,
          desc,
          mark,
          supportPay,
          saleStartDate: moment(dateList[0]).format("YYYY-MM-DD"),
          saleEndDate: moment(dateList[1]).format("YYYY-MM-DD"),
        });
        ElMessage.success(t("form.addSuccess"));
        isAddDialogVisible.value = false;
        loadData(); // 重新加载数据
      } catch (error) {
        dialogLoading.value = false;
        // console.log(error,'error');
        // ElMessage.error(error.data.msg || 'errpr');
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
  const status = row.status === 1 ? 2 : 1;
  const res = await updateProductStatus({
    productId: row.productId,
    status: status,
  });
  ElMessage.success(
    status === 1 ? t("form.putaway_success") : t("form.takeaway_success")
  );
  loadData();
};
// 重置搜索表单
const handleReset = () => {
  searchForm.value = { email: "", status: "" };
  loadData();
};

// 分页功能
const handlePageChange = (page) => {
  currentPage.value = page;
  loadData();
};

// 显示新增对话框
const showAddDialog = (row) => {
  addForm.value = {
    ...row,
  };
  isAddDialogVisible.value = true;
};
const thisItem = ref({});
const thisKey = ref(null);
const userData = ref({});
const showDialogVisible = ref(false);
const showLoding = ref(false);
const getOtcDetailFn = async () => {
  showLoding.value = true;
  const res = await getOtcDetail({
    otcId: thisItem.value.otcId,
  });
  userData.value = res.data;
  console.log(res.data);
  showDialogVisible.value = true;
  showLoding.value = false;
};
const showEditDialog = async (row, key) => {
  updateStatusData.value = {
    status: "",
    quantity: "",
    name: "",
  };
  thisItem.value = row;
  thisKey.value = key;
  if (key === 4) {
    await getOtcDetailFn();
    return;
  }
  isAddDialogVisible2.value = true;
};
const updateUserStatusFn = async () => {
  try {
    await updateUserStatus({
      status: updateStatusData.value.status,
      userId: thisItem.value.userId,
    });
    ElMessage.success(t("form.successText"));
    isAddDialogVisible2.value = false;
    dialogLoading.value = false;
    loadData(); // 重新加载数据
  } catch (error) {
    dialogLoading.value = false;
  }
};
const otcRechargeFn = async () => {
  try {
    await otcRecharge({
      quantity: updateStatusData.value.quantity,
      otcId: thisItem.value.otcId,
    });
    ElMessage.success(t("form.successText"));
    isAddDialogVisible2.value = false;
    dialogLoading.value = false;
    loadData(); // 重新加载数据
  } catch (error) {
    dialogLoading.value = false;
  }
};
const otcSubtractFn = async () => {
  try {
    await otcSubtract({
      quantity: updateStatusData.value.quantity,
      otcId: thisItem.value.otcId,
    });
    ElMessage.success(t("form.successText"));
    isAddDialogVisible2.value = false;
    dialogLoading.value = false;
    loadData(); // 重新加载数据
  } catch (error) {
    dialogLoading.value = false;
  }
};
// 修改用户昵称
const updateUserNameFn = async () => {
  try {
    await updateUserName({
      userId: thisItem.value.userId,
      name: updateStatusData.value.name,
    });
    dialogLoading.value = false;
    ElMessage.success(t("form.successText"));
    isAddDialogVisible2.value = false;
    loadData(); // 重新加载数据
  } catch (error) {
    dialogLoading.value = false;
  }
};
const updateStatusFn = async () => {
  dialogLoading.value = true;
  addFormRef2.value.validate(async (valid) => {
    if (valid) {
      if (thisKey.value === 1) {
        updateUserStatusFn();
      } else if (thisKey.value === 2) {
        updateUserNameFn();
      } else if (thisKey.value === 3) {
        otcSubtractFn();
      }
    } else {
      dialogLoading.value = false;
    }
  });
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
