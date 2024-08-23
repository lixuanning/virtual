<template>
  <el-container>
    <!-- 筛选表单 -->
    <el-header class="header">
      <div>
        <el-form :inline="true" :model="searchForm" class="demo-form-inline">
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
          <el-form-item>
            <el-button type="primary" @click="handleSearch">
              {{ $t("form.search") }}
            </el-button>
            <el-button @click="handleReset">{{ $t("form.reset") }}</el-button>
          </el-form-item>
        </el-form>
      </div>

      <div class="rigth">
        <el-button type="primary" @click="showAddDialog(1)">
          {{ $t("form.addCoin") }}
        </el-button>
        <el-button type="primary" @click="showAddDialog(2)">
          {{ $t("form.addLegalCurrency") }}
        </el-button>
        <el-button type="primary" @click="showAddDialog(3)">
          {{ $t("form.addRecharge") }}
        </el-button>
      </div>
    </el-header>

    <!-- 表格和分页 -->
    <el-main>
      <el-table
        :data="tableData"
        style="width: 100%"
        max-height="520"
        border
        v-loading="tableLoading"
        :span-method="spanMethod"
      >
        <el-table-column prop="coin" :label="$t('form.coin')">
        </el-table-column>
        <el-table-column
          prop="legalCurrency"
          :label="$t('form.legalCurrency')"
          width="180"
        >
        </el-table-column>
        <el-table-column prop="unitPrice" :label="$t('form.unitPrice')">
        </el-table-column>

        <el-table-column :label="$t('form.actions')" width="100" fixed="right">
          <template #default="scope">
            <el-button type="text" @click="showEditDialog(scope.row)">{{
              $t("form.edit")
            }}</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 
      <div class="rigth">
        <el-pagination
          background
          layout="prev, pager, next"
          :total="totalItems"
          :page-size="pageSize"
          :current-page="currentPage"
          @current-change="handlePageChange"
        ></el-pagination>
      </div> -->
    </el-main>
    <el-dialog :title="$t('form.edit')" v-model="editDialogVisible">
      <el-form
        :model="editData"
        :rules="rules2"
        ref="editFormRef"
        label-width="100px"
      >
        <el-form-item :label="$t('form.unitPrice')" prop="unitPrice">
          <el-input-number
            v-model="editData.unitPrice"
            :precision="2"
            :step="1"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="editDialogVisible = false">
          {{ $t("form.cancel") }}
        </el-button>
        <el-button
          type="primary"
          :loading="dialogLoading"
          @click="handleEditSubmit"
        >
          {{ $t("form.confirm") }}
        </el-button>
      </template>
    </el-dialog>
    <!-- 新增对话框 -->
    <el-dialog :title="$t('form.add')" v-model="isAddDialogVisible">
      <el-form
        :model="addForm"
        :rules="rules"
        ref="addFormRef"
        label-width="100px"
      >
        <template v-if="thisKey === 1">
          <el-form-item :label="$t('form.coin')" prop="coin">
            <el-input v-model="addForm.coin"> </el-input>
          </el-form-item>
        </template>
        <template v-if="thisKey === 2">
          <el-form-item :label="$t('form.legalCurrency')" prop="legalCurrency">
            <el-input v-model="addForm.legalCurrency"> </el-input>
          </el-form-item>
        </template>
        <template v-if="thisKey === 3">
          <el-form-item :label="$t('form.coin')" prop="coin">
            <el-select
              width="100%"
              v-model="addForm.coin"
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
          <el-form-item :label="$t('form.legalCurrency')" prop="legalCurrency">
            <el-select
              v-model="addForm.legalCurrency"
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
          <el-form-item :label="$t('form.unitPrice')" prop="unitPrice">
            <el-input-number v-model="addForm.unitPrice" :min="1" />
          </el-form-item>
        </template>
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
          {{ $t("form.add") }}
        </el-button>
      </template>
    </el-dialog>
  </el-container>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useI18n } from "vue-i18n";
import { updateOutOrderStatus } from "@/api/otc.js";

import { getLegalCurrencyDict, getCoinDict } from "@/api/buyer.js";
import {
  queryPriceRateConfigData,
  addPriceRateConfig,
  updatePriceRateConfig,
  addCoinDict,
  addLegalCurrencyDit,
} from "@/api/agent.js";

import { ElMessage } from "element-plus";
import moment from "moment";
import { getPlay, getStatus } from "@/utils/enumerate.js";
import { uploadPicture, previewPicture } from "@/api/file";
const paymentOptions = computed(() => getPlay());
const editDialogVisible = ref(false);
const { t } = useI18n();

// 初始化数据
const coinOptions = ref([]);
const legalCurrencyOptions = ref([]);
const isAddDialogVisible2 = ref(false);

// 表单相关状态
const searchForm = ref({ coin: "", legalCurrency: "", status: "" });
const addForm = ref({
  coin: "",
  legalCurrency: "",
  unitPrice: "",
});
const addForm2 = ref({
  email: "",
});
const editFormRef = ref(null);

const editData = ref({
  unitPrice: "",
});
const rules2 = ref({
  unitPrice: [
    { required: true, message: t("form.requiredText"), trigger: "blur" },
  ],
});
const rules = ref({
  legalCurrency: [
    { required: true, message: t("form.requiredText"), trigger: "blur" },
  ],
  coin: [{ required: true, message: t("form.requiredText"), trigger: "blur" }],
  unitPrice: [
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
const spanMethod = ({ row, column, rowIndex, columnIndex }) => {
  if (columnIndex === 0) {
    // 合并 coin 列
    const coin = tableData.value[rowIndex].coin;
    const sameCoinRows = tableData.value.filter(
      (item) => item.coin === coin
    ).length;
    const previousCoinRows = tableData.value
      .slice(0, rowIndex)
      .filter((item) => item.coin === coin).length;

    if (previousCoinRows > 0) {
      return [0, 0]; // 不显示重复行
    } else {
      return [sameCoinRows, 1]; // 显示并合并行
    }
  }
};
const thisRow = ref({});
const showEditDialog = (row) => {
  console.log(row);
  thisRow.value = row;
  editData.value = {
    unitPrice: row.unitPrice,
  };
  editDialogVisible.value = true;
};
const editRechargeFn = async () => {
  try {
    await updatePriceRateConfig({
      ...editData.value,
      id: thisRow.value.id,
    });
    ElMessage.success(t("form.success"));
    editDialogVisible.value = false;
    loadData(); // 重新加载数据
  } catch (error) {
    dialogLoading.value = false;
  } finally {
    dialogLoading.value = false;
  }
};

const handleEditSubmit = async () => {
  editFormRef.value.validate(async (valid) => {
    if (valid) {
      editRechargeFn();
    } else {
      dialogLoading.value = false;
    }
  });
};
// 查询列表数据
const loadData = async () => {
  tableLoading.value = true;
  try {
    const { data } = await queryPriceRateConfigData({
      pageNum: currentPage.value,
      pageSize: pageSize.value,
      coin: searchForm.value.coin,
    });
    const newList = data.flatMap((item) =>
      item.priceList.map((price) => ({
        coin: item.coin,
        legalCurrency: price.legalCurrency,
        unitPrice: price.unitPrice,
        id: price.id,
      }))
    );
    console.log(newList, "newList");
    tableData.value = [...newList];
    // totalItems.value = totalNum; // 确保正确访问到 totalNum
  } catch (error) {
    ElMessage.error(t("message.loadDataError"));
  } finally {
    tableLoading.value = false;
  }
};

const addRechargeFn = async () => {
  try {
    await addPriceRateConfig({ ...addForm.value });
    ElMessage.success(t("form.addSuccess"));
    isAddDialogVisible.value = false;
    loadData(); // 重新加载数据
  } catch (error) {
    dialogLoading.value = false;
  } finally {
    dialogLoading.value = false;
  }
};
// 新增产品
const handleAddSubmit = () => {
  dialogLoading.value = true;
  addFormRef.value.validate(async (valid) => {
    if (valid) {
      if (thisKey.value === 1) {
        addCoinFn();
      } else if (thisKey.value === 2) {
        addLegalCurrencyFn();
      } else if (thisKey.value === 3) {
        addRechargeFn();
      }
    } else {
      dialogLoading.value = false;
    }
  });
};
const addCoinFn = async () => {
  try {
    await addCoinDict({
      coin: addForm.value.coin,
    });
    ElMessage.success(t("form.success"));
    isAddDialogVisible.value = false;
    loadData(); // 重新加载数据
    fetchOptions();
  } catch (error) {
    dialogLoading.value = false;
  } finally {
    dialogLoading.value = false;
  }
};
const addLegalCurrencyFn = async () => {
  try {
    await addLegalCurrencyDit({
      legalCurrency: addForm.value.legalCurrency,
    });
    ElMessage.success(t("form.success"));
    isAddDialogVisible.value = false;
    loadData(); // 重新加载数据
    fetchOptions();
  } catch (error) {
    dialogLoading.value = false;
  } finally {
    dialogLoading.value = false;
  }
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
  searchForm.value = { coin: "", legalCurrency: "", status: "" };
  loadData();
};

// 分页功能
const handlePageChange = (page) => {
  currentPage.value = page;
  loadData();
};
const allocateRow = ref({});
//分配

const thisKey = ref("");
// 显示新增对话框
const showAddDialog = (key) => {
  thisKey.value = key;
  addForm.value = {
    coin: "",
    legalCurrency: "",
    unitPrice: "",
  };

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
