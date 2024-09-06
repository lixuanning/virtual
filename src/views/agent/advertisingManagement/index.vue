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
              <el-option :label="$t('form.putaway')" :value="1"></el-option>
              <el-option :label="$t('form.takeaway')" :value="2"></el-option>
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
          prop="productId"
          :label="$t('form.productId')"
          width="150"
        ></el-table-column>
        <el-table-column prop="status" :label="$t('form.status')" width="80">
          <template #default="{ row }">
            <el-tag type="success" v-if="row.status === 1">
              {{ $t("form.putaway") }}
            </el-tag>
            <el-tag type="success" v-else>
              {{ $t("form.takeaway") }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="coin"
          :label="$t('form.coin')"
          width="100"
        ></el-table-column>
        <el-table-column
          prop="legalCurrency"
          :label="$t('form.legalCurrency')"
        ></el-table-column>
        <el-table-column
          prop="total"
          :label="$t('form.total')"
          sortable
        ></el-table-column>
        <el-table-column
          prop="unitPrice"
          :label="$t('form.unitPrice')"
          width="120"
          sortable
        ></el-table-column>
        <el-table-column
          prop="buyMin"
          :label="$t('form.buyMin')"
          width="120"
          sortable
        ></el-table-column>
        <el-table-column
          prop="buyMax"
          :label="$t('form.buyMax')"
          width="150"
          sortable
        ></el-table-column>
        <el-table-column
          prop="expirationDate"
          :label="$t('form.expirationDate')"
          width="150"
        >
          <template #default="scope">
            {{
              scope.row.expirationDate
                ? `${scope.row.expirationDate} ${$t("form.minute")}`
                : ""
            }}
          </template>
        </el-table-column>
        <!-- <el-table-column
          prop="saleStartDate"
          :label="$t('form.tabSaleStartDate')"
          width="150"
        >
          <template #default="scope">
            {{ moment(scope.row.saleStartDate).format("YYYY-MM-DD") }}
          </template>
        </el-table-column>
        <el-table-column
          prop="saleEndDate"
          :label="$t('form.tabSaleEndDate')"
          width="150"
        >
          <template #default="scope">
            {{ moment(scope.row.saleEndDate).format("YYYY-MM-DD") }}
          </template>
        </el-table-column> -->
        <el-table-column
          prop="residue"
          :label="$t('form.residue')"
          width="100"
        ></el-table-column>
        <el-table-column
          prop="createDate"
          :label="$t('form.createDate')"
          width="200"
        >
          <template #default="scope">
            <!-- {{ moment(scope.row.createDate).format("YYYY-MM-DD hh:mm:ss") }} -->
            {{ scope.row.createDate }}
          </template>
        </el-table-column>
        <el-table-column :label="$t('form.actions')" width="150" fixed="right">
          <template #default="scope">
            <!-- <el-button type="text" @click="showViewDialog(scope.row)">
              {{ $t("form.view") }}
            </el-button> -->

            <el-popconfirm
              :title="$t('form.isPutaway')"
              confirm-button-text="是"
              cancel-button-text="否"
              @confirm="() => handleDelete(scope.row)"
              v-if="scope.row.status === 2"
            >
              <template #reference>
                <el-button type="text">{{ $t("form.putaway") }}</el-button>
              </template>
            </el-popconfirm>
            <el-popconfirm
              :title="$t('form.isTakeaway')"
              confirm-button-text="是"
              cancel-button-text="否"
              @confirm="() => handleDelete(scope.row)"
              v-else
            >
              <template #reference>
                <el-button type="text">{{ $t("form.takeaway") }}</el-button>
              </template>
            </el-popconfirm>

            <el-button
              type="text"
              @click="showAddDialog(scope.row)"
              v-if="scope.row.status === 1"
            >
              {{ $t("form.edit") }}
            </el-button>
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
        <el-form-item :label="$t('form.total')" prop="total">
          <el-input type="number" v-model="addForm.total"></el-input>
        </el-form-item>
        <el-form-item :label="$t('form.unitPrice')" prop="unitPrice">
          <el-input type="number" v-model="addForm.unitPrice"></el-input>
        </el-form-item>
        <el-form-item :label="$t('form.buyMin')" prop="buyMin">
          <el-input type="number" v-model="addForm.buyMin"></el-input>
        </el-form-item>
        <el-form-item :label="$t('form.buyMax')" prop="buyMax">
          <el-input type="number" v-model="addForm.buyMax"></el-input>
        </el-form-item>
        <el-form-item :label="$t('form.desc')" prop="desc">
          <el-input type="textarea" v-model="addForm.desc"></el-input>
        </el-form-item>
        <el-form-item :label="$t('form.mark')" prop="mark">
          <el-input type="textarea" v-model="addForm.mark"></el-input>
        </el-form-item>
        <el-form-item :label="$t('form.expirationDate')" prop="expirationDate">
          <el-input type="number" v-model="addForm.expirationDate">
            <template #append>{{ $t("form.minute") }}</template></el-input
          >
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
import { ref, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import {
  queryProductList,
  updateProductStatus,
  getLegalCurrencyDict,
  getCoinDict,
} from "@/api/otc.js";
import { updateProduct } from "@/api/agent.js";
import { ElMessage } from "element-plus";
import moment from "moment";
const { t } = useI18n();

// 初始化数据
const coinOptions = ref([]);
const legalCurrencyOptions = ref([]);

// 表单相关状态
const searchForm = ref({ coin: "", legalCurrency: "", status: "" });
const addForm = ref({
  unitPrice: "",
  total: "",
  expirationDate: "",
  productId: "",
  buyMin: "",
  buyMax: "",
  desc: "",
  mark: "",
});

const rules = ref({
  total: [{ required: true, message: t("form.requiredText"), trigger: "blur" }],
  unitPrice: [
    { required: true, message: t("form.requiredText"), trigger: "blur" },
  ],
  buyMin: [
    { required: true, message: t("form.requiredText"), trigger: "blur" },
  ],
  buyMax: [
    { required: true, message: t("form.requiredText"), trigger: "blur" },
  ],
  expirationDate: [
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
    const { data } = await queryProductList({
      pageNum: currentPage.value,
      pageSize: pageSize.value,
      status: searchForm.value.status,
      coin: searchForm.value.coin,
      legalCurrency: searchForm.value.legalCurrency,
    });
    tableData.value = data.records;
    totalItems.value = data.totalNum;
  } catch (error) {
    ElMessage.error(t("message.loadDataError"));
  } finally {
    tableLoading.value = false;
  }
};

// 编辑产品
const handleAddSubmit = () => {
  dialogLoading.value = true;
  addFormRef.value.validate(async (valid) => {
    if (valid) {
      try {
        await updateProduct({
          ...addForm.value,
        });
        ElMessage.success(t("form.successText"));
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
  searchForm.value = { coin: "", legalCurrency: "", status: "" };
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
    unitPrice: row.unitPrice,
    total: row.total,
    expirationDate: row.expirationDate,
    productId: row.productId,
    buyMin: row.buyMin,
    buyMax: row.buyMax,
    desc: row.desc,
    mark: row.mark,
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
