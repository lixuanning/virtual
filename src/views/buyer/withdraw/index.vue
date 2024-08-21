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
          </el-form-item>
        </el-form>
      </div>

      <div class="rigth">
        <el-button type="primary" @click="showAddDialog">
          {{ $t("form.add") }}
        </el-button>
      </div>
    </el-header>

    <!-- 表格和分页 -->
    <el-main>
      <el-table
        :data="tableData"
        max-height="520"
        style="width: 100%"
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
          :label="$t('form.transferName')"
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

        <!-- <el-table-column :label="$t('form.actions')" width="100" fixed="right">
          <template #default="scope">
            <el-popconfirm
              :title="$t('form.confirmTheOk')"
              confirm-button-text="是"
              cancel-button-text="否"
              @confirm="() => handleDelete(scope.row)"
              v-if="scope.row.status === 1"
            >
              <template #reference>
                <el-button type="text">{{
                  $t("form.confirmTheOkBtn")
                }}</el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column> -->
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
    <el-dialog :title="$t('form.add')" v-model="isAddDialogVisible">
      <el-form
        :model="addForm"
        :rules="rules"
        ref="addFormRef"
        label-width="100px"
      >
        <el-form-item :label="$t('form.supportPay')" prop="supportPay">
          <el-select v-model="addForm.supportPay" @change="changeSupportPay">
            <el-option
              v-for="item in paymentOptions"
              :key="item.key"
              :label="item.name"
              :value="item.key"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('form.quantity')" prop="quantity">
          <el-input v-model="addForm.quantity"></el-input>
        </el-form-item>
        <el-form-item :label="$t('form.payee')" prop="payee">
          <el-input v-model="addForm.payee"></el-input>
        </el-form-item>
        <template v-if="addForm.supportPay === 1">
          <el-form-item :label="$t('form.openingBank')" prop="openingBank">
            <el-input v-model="addForm.openingBank"></el-input>
          </el-form-item>
          <el-form-item :label="$t('form.bank')" prop="bank">
            <el-input v-model="addForm.bank"></el-input>
          </el-form-item>
        </template>
        <template v-if="addForm.supportPay === 2">
          <el-form-item
            :label="$t('form.uploadWechatQRcode')"
            prop="wechatQRcode"
          >
            <el-upload
              class="upload-demo"
              :before-upload="beforeUpload"
              :show-file-list="false"
              :http-request="(file) => customUpload(file, 'wechatQRcode')"
              :limit="2"
            >
              <el-button type="text">{{
                $t("register.uploadInHand")
              }}</el-button>
            </el-upload>
            <span v-if="addForm.wechatQRcode">
              <el-image
                style="width: 100px; height: 100px"
                :src="imgUrl.wechatQRcode"
                :zoom-rate="1.2"
                :max-scale="7"
                :min-scale="0.2"
                :preview-src-list="[imgUrl.wechatQRcode]"
                :initial-index="1"
                fit="cover"
            /></span>
          </el-form-item>
        </template>
        <template v-if="addForm.supportPay === 3">
          <el-form-item
            :label="$t('form.uploadAlipayQRcode')"
            prop="alipayQRcode"
          >
            <el-upload
              class="upload-demo"
              :before-upload="beforeUpload"
              :show-file-list="false"
              :http-request="(file) => customUpload(file, 'alipayQRcode')"
              :limit="2"
            >
              <el-button type="text">{{
                $t("register.uploadInHand")
              }}</el-button>
            </el-upload>
            <span v-if="addForm.alipayQRcode">
              <el-image
                style="width: 100px; height: 100px"
                :src="imgUrl.alipayQRcode"
                :zoom-rate="1.2"
                :max-scale="7"
                :min-scale="0.2"
                :preview-src-list="[imgUrl.alipayQRcode]"
                :initial-index="1"
                fit="cover"
            /></span>
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
import {
  addProduct,
  queryOutOrderList,
  updateOutOrderStatus,
} from "@/api/otc.js";
import {
  getLegalCurrencyDict,
  getCoinDict,
  createOutOrder,
} from "@/api/buyer.js";
import { ElMessage } from "element-plus";
import moment from "moment";
import { getPlay, getStatus } from "@/utils/enumerate.js";
import { uploadPicture, previewPicture } from "@/api/file";
const paymentOptions = computed(() => getPlay());

const { t } = useI18n();

// 初始化数据
const coinOptions = ref([]);
const legalCurrencyOptions = ref([]);

// 表单相关状态
const searchForm = ref({ coin: "", legalCurrency: "", status: "" });
const addForm = ref({
  supportPay: "",
  wechatQRcode: "",
  alipayQRcode: "",
  bank: "",
  payee: "",
  openingBank: "",
  quantity: "",
});
const imgUrl = ref({
  alipayQRcode: "",
  wechatQRcode: "",
});
// 自定义上传配置
const beforeUpload = (file) => {
  const isJPG = file.type === "image/jpeg" || file.type === "image/png";
  const isLt2M = file.size / 1024 / 1024 < 2;

  if (!isJPG) {
    ElMessage.error("上传图片只能是 JPG/PNG 格式!");
  }
  if (!isLt2M) {
    ElMessage.error("上传图片大小不能超过 2MB!");
  }
  return isJPG && isLt2M;
};
const customUpload = async ({ file, onSuccess, onError }, field) => {
  try {
    const response = await uploadPicture({ file: file });
    addForm.value[field] = response.data.pictureId;
    const url = await previewPicture({ pictureId: response.data.pictureId });
    const base64Url = `data:image/jpeg;base64,${url.data.picture}`;
    imgUrl.value[field] = base64Url;
    ElMessage.success("图片上传成功");
  } catch (error) {
    onError(error);
  }
};
const rules = ref({
  supportPay: [
    { required: true, message: t("form.requiredText"), trigger: "blur" },
  ],
  wechatQRcode: [
    { required: true, message: t("form.requiredText"), trigger: "blur" },
  ],
  alipayQRcode: [
    { required: true, message: t("form.requiredText"), trigger: "blur" },
  ],
  quantity: [
    { required: true, message: t("form.requiredText"), trigger: "blur" },
  ],
  bank: [{ required: true, message: t("form.requiredText"), trigger: "blur" }],

  payee: [{ required: true, message: t("form.requiredText"), trigger: "blur" }],
  openingBank: [
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
    const { data } = await queryOutOrderList({
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

// 根据类型设置入参
const setData = (value) => {
  if (value.supportPay === 1) {
    return {
      payee: value.payee,
      payType: value.supportPay,
      cardId: value.bank,
      openingBank: value.openingBank,
      quantity: value.quantity,
      qrCodeId: "",
    };
  }
};

// 新增产品
const handleAddSubmit = () => {
  dialogLoading.value = true;
  addFormRef.value.validate(async (valid) => {
    if (valid) {
      let newData = setData({ ...addForm.value });
      console.log(newData, "newData", addForm.value);
      try {
        await createOutOrder({ ...newData });
        ElMessage.success(t("form.addSuccess"));
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
  const res = await updateOutOrderStatus({
    outOrderId: row.outOrderId,
    status: 2,
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

// 显示新增对话框
const showAddDialog = () => {
  addForm.value = {
    supportPay: "",
    wechatQRcode: "",
    alipayQRcode: "",
    bank: "",
    payee: "",
    openingBank: "",
    quantity: "",
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
