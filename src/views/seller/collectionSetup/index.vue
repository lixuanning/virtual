<template>
  <el-container>
    <el-header class="header">
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
        style="width: 100%; min-height: calc(100vh - 330px)"
        v-loading="tableLoading"
      >
        <el-table-column prop="payee" :label="$t('form.payee')">
          <template #default="scope">
            {{ scope.row.payee }}
          </template>
        </el-table-column>
        <el-table-column prop="type" :label="$t('form.payType')">
          <template #default="scope">
            <el-tag :type="getPlay(scope.row.type).type">
              {{ getPlay(scope.row.type).name }}</el-tag
            >
          </template>
        </el-table-column>
        <el-table-column prop="legalCurrency" :label="$t('form.legalCurrency')">
          <template #default="scope">
            {{ scope.row.legalCurrency }}
          </template>
        </el-table-column>
        <el-table-column prop="cardId" :label="$t('form.payAccount')">
          <template #default="scope">
            <span v-if="scope.row.type === 1">
              {{ scope.row.openingBank }} / {{ scope.row.cardId }}
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

        <el-table-column prop="status" :label="$t('form.status')" width="100">
          <template #default="scope">
            {{
              scope.row.status === 1 ? $t("form.enable") : $t("form.disable")
            }}
          </template>
        </el-table-column>
        <el-table-column prop="createDate" :label="$t('form.created')">
          <template #default="scope">
            {{ moment(scope.row.createDate).format("YYYY-MM-DD") }}
          </template>
        </el-table-column>

        <el-table-column :label="$t('form.actions')" width="100" fixed="right">
          <template #default="scope">
            <el-popconfirm
              :title="
                scope.row.status === 1
                  ? $t('form.disableText')
                  : $t('form.enableText')
              "
              confirm-button-text="是"
              cancel-button-text="否"
              @confirm="() => updateStatus(scope.row)"
            >
              <template #reference>
                <el-button type="text">{{
                  scope.row.status === 1
                    ? $t("form.disable")
                    : $t("form.enable")
                }}</el-button>
              </template>
            </el-popconfirm>
            <el-popconfirm
              :title="$t('form.confirmDelete')"
              confirm-button-text="是"
              cancel-button-text="否"
              @confirm="() => handleDelete(scope.row)"
            >
              <template #reference>
                <el-button type="text">{{ $t("form.delete") }}</el-button>
              </template>
            </el-popconfirm>
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
    <el-dialog :title="$t('form.add')" v-model="isAddDialogVisible" width="60%">
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

        <template v-if="addForm.supportPay === 1">
          <div class="rigth-btn">
            <el-button type="primary" :icon="Plus" circle @click="addItem(1)" />
          </div>
          <el-row gutter="20">
            <el-col span="12" v-for="(item, i) in addForm.bankLsit" :key="item">
              <el-card>
                <div class="rigth-btn">
                  <el-button
                    type="danger"
                    :icon="Delete"
                    circle
                    @click="deleteItem(i)"
                  />
                </div>

                <el-form-item :label="$t('form.payee')">
                  <el-input v-model="addForm.bankLsit[i].payee"></el-input>
                </el-form-item>
                <el-form-item :label="$t('form.legalCurrency')">
                  <el-select
                    v-model="addForm.bankLsit[i].legalCurrency"
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
                <el-form-item :label="$t('form.openingBank')">
                  <el-input
                    v-model="addForm.bankLsit[i].openingBank"
                  ></el-input>
                </el-form-item>
                <el-form-item :label="$t('form.bank')">
                  <el-input v-model="addForm.bankLsit[i].collection"></el-input>
                </el-form-item>
              </el-card>
            </el-col>
          </el-row>
        </template>
        <template v-if="addForm.supportPay === 2">
          <div class="rigth-btn">
            <el-button type="primary" :icon="Plus" circle @click="addItem(2)" />
          </div>
          <el-row gutter="20">
            <el-col span="12" v-for="(item, i) in addForm.bankLsit" :key="item">
              <el-card>
                <div class="rigth-btn">
                  <el-button
                    type="danger"
                    :icon="Delete"
                    circle
                    @click="deleteItem(i)"
                  />
                </div>

                <el-form-item :label="$t('form.payee')">
                  <el-input v-model="addForm.bankLsit[i].payee"></el-input>
                </el-form-item>
                <el-form-item :label="$t('form.uploadWechatQRcode')">
                  <el-upload
                    class="upload-demo"
                    :before-upload="beforeUpload"
                    :show-file-list="false"
                    :http-request="
                      (file) => customUpload(file, 'collection', i)
                    "
                    :limit="2"
                  >
                    <el-button type="text">{{
                      $t("register.uploadInHand")
                    }}</el-button>
                  </el-upload>
                  <span v-if="addForm.bankLsit[i].collection">
                    <el-image
                      style="width: 100px; height: 100px"
                      :src="imgUrl[i]"
                      :zoom-rate="1.2"
                      :max-scale="7"
                      :min-scale="0.2"
                      :preview-src-list="[imgUrl[i]]"
                      :initial-index="1"
                      fit="cover"
                  /></span>
                </el-form-item>
              </el-card>
            </el-col>
          </el-row>
        </template>
        <template v-if="addForm.supportPay === 3">
          <div class="rigth-btn">
            <el-button type="primary" :icon="Plus" circle @click="addItem(3)" />
          </div>
          <el-row gutter="20">
            <el-col span="12" v-for="(item, i) in addForm.bankLsit" :key="item">
              <el-card>
                <div class="rigth-btn">
                  <el-button
                    type="danger"
                    :icon="Delete"
                    circle
                    @click="deleteItem(i)"
                  />
                </div>
                <el-form-item :label="$t('form.payee')">
                  <el-input v-model="addForm.bankLsit[i].payee"></el-input>
                </el-form-item>
                <el-form-item :label="$t('form.uploadAlipayQRcode')">
                  <el-upload
                    class="upload-demo"
                    :before-upload="beforeUpload"
                    :show-file-list="false"
                    :http-request="
                      (file) => customUpload(file, 'collection', i)
                    "
                    :limit="2"
                  >
                    <el-button type="text">{{
                      $t("register.uploadInHand")
                    }}</el-button>
                  </el-upload>
                  <span v-if="addForm.bankLsit[i].collection">
                    <el-image
                      style="width: 100px; height: 100px"
                      :src="imgUrl[i]"
                      :zoom-rate="1.2"
                      :max-scale="7"
                      :min-scale="0.2"
                      :preview-src-list="[imgUrl[i]]"
                      :initial-index="1"
                      fit="cover"
                  /></span>
                </el-form-item>
              </el-card>
            </el-col>
          </el-row>
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
  addPaymentConfig,
  getPaymentConfigForOtc,
  delPaymentConfig,
  updatePaymentConfigStatus,
  getLegalCurrencyDict,
  getCoinDict,
} from "@/api/otc.js";
import { ElMessage } from "element-plus";
import {
  Check,
  Delete,
  Edit,
  Message,
  Search,
  Star,
  Plus,
} from "@element-plus/icons-vue";
import moment from "moment";
import { getPlay, getStatus } from "@/utils/enumerate.js";
import { uploadPicture, previewPicture } from "@/api/file";

const paymentOptions = computed(() => getPlay());
console.log(paymentOptions.value, "paymentOptionspaymentOptions");
console.log(getPlay(), "getPlay");
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
  legalCurrency: "",
  bankLsit: [],
});
const imgUrl = ref([]);
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
const customUpload = async ({ file, onSuccess, onError }, field, i) => {
  try {
    const response = await uploadPicture({ file: file });
    addForm.value.bankLsit[i][field] = response.data.pictureId;
    const url = await previewPicture({ pictureId: response.data.pictureId });
    const base64Url = `data:image/jpeg;base64,${url.data.picture}`;
    if (!imgUrl.value[i]) {
      imgUrl.value[i] = ""; // 初始化索引 i 处的值
    }
    imgUrl.value[i] = base64Url;
    ElMessage.success("图片上传成功");
  } catch (error) {
    onError(error);
  }
};

const rules = ref({
  supportPay: [
    { required: true, message: t("form.requiredText"), trigger: "blur" },
  ],
  legalCurrency: [
    { required: true, message: t("form.requiredText"), trigger: "blur" },
  ],
  wechatQRcode: [
    { required: true, message: t("form.requiredText"), trigger: "blur" },
  ],
  alipayQRcode: [
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
const addItem = (value) => {
  if (value === 1) {
    let item = {
      collection: "",
      payee: "",
      openingBank: "",
      legalCurrency: "",
    };
    addForm.value.bankLsit.push(item);
  } else {
    let item = {
      collection: "",
      payee: "",
    };
    addForm.value.bankLsit.push(item);
  }
};
const deleteItem = (index) => {
  addForm.value.bankLsit.splice(index, 1);
};
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
    const { data } = await getPaymentConfigForOtc();
    console.log(data, "datadata");
    tableData.value = data;
  } catch (error) {
    ElMessage.error(t("message.loadDataError"));
  } finally {
    tableLoading.value = false;
  }
};
// 验证 bankList 数组内的每一个对象是否有空值
const validateBankList = () => {
  let bankList = addForm.value.bankLsit;
  console.log(bankList, "bankList");
  for (let i = 0; i < bankList.length; i++) {
    const item = bankList[i];
    for (const key in item) {
      if (item[key] === "" || item[key] === null || item[key] === undefined) {
        ElMessage.error(t("form.formErrorText"));
        return false;
      }
    }
  }
  return true;
};
// 根据类型设置入参
const setData = (value) => {
  if (value.supportPay === 1) {
    return {
      bank: value.bankLsit,
    };
  } else if (value.supportPay === 2) {
    return {
      wechat: value.bankLsit,
    };
  } else if (value.supportPay === 3) {
    return {
      alipay: value.bankLsit,
    };
  }
};

// 新增产品
const handleAddSubmit = () => {
  dialogLoading.value = true;
  addFormRef.value.validate(async (valid) => {
    if (valid) {
      if (!validateBankList()) {
        dialogLoading.value = false;
        return;
      }
      let newData = setData({ ...addForm.value });
      console.log(newData, "newData", addForm.value);
      try {
        await addPaymentConfig({ ...newData });
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
// 启用禁用
const updateStatus = async (row) => {
  const res = await updatePaymentConfigStatus({
    id: row.id,
    status: row.status === 1 ? 2 : 1,
  });
  console.log(res);
  ElMessage.success(t("form.success"));
  loadData();
};
//删除
const handleDelete = async (row) => {
  const res = await delPaymentConfig({
    id: row.id,
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

const changeSupportPay = (key) => {
  addForm.value = {
    ...addForm.value,
    wechatQRcode: "",
    alipayQRcode: "",
    bank: "",
    openingBank: "",
    legalCurrency: "",
    bankLsit: [],
  };
  imgUrl.value = [];
  addItem(key);
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
  min-height: 80px;
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
.rigth-btn {
  display: flex;
  justify-content: flex-end;
  padding-bottom: 20px;
}
</style>
