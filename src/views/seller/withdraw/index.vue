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
          :label="$t('form.quantity5')"
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
        <el-table-column
          prop="openingBank"
          :label="$t('form.openingBank')"
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
          width="180"
        >
          <template #default="scope">
            {{ moment(scope.row.createDate).format("YYYY-MM-DD hh:mm:ss") }}
          </template>
        </el-table-column>

        <el-table-column :label="$t('form.actions')" width="150" fixed="right">
          <template #default="{ row }">
            <!-- <el-popconfirm
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
            </el-popconfirm> -->
            <el-button
              v-if="row.status === 1"
              type="text"
              @click="updateOutOrderStatusFn(row)"
              >{{ $t("form.confirmTheOkBtn") }}</el-button
            >
            <el-button v-else type="text" @click="showTransferPicture(row)">{{
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
        <el-form-item
          :label="$t('form.addTransferPicture')"
          prop="transferPictureId"
        >
          <el-upload
            class="upload-demo"
            :before-upload="beforeUpload"
            :show-file-list="false"
            :http-request="(file) => customUpload(file, 'transferPictureId')"
            :limit="2"
          >
            <el-button type="text">{{ $t("register.uploadInHand") }}</el-button>
          </el-upload>
          <span v-if="addForm.transferPictureId">
            <el-image
              style="width: 100px; height: 100px"
              :src="imgUrl.transferPictureId"
              :zoom-rate="1.2"
              :max-scale="7"
              :min-scale="0.2"
              :preview-src-list="[imgUrl.transferPictureId]"
              :initial-index="2"
              fit="cover"
          /></span>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="isAddDialogVisible = false">
          {{ $t("form.cancel") }}
        </el-button>
        <el-button
          type="primary"
          :loading="dialogLoading"
          @click="handleDelete"
        >
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
  addProduct,
  queryOutOrderList,
  updateOutOrderStatus,
  getCoinDict,
  getLegalCurrencyDict,
} from "@/api/otc.js";
import { getTransferPicture } from "@/api/agent.js";
import { uploadPicture, previewPicture } from "@/api/file";
import { ElMessage } from "element-plus";
import moment from "moment";
import { getPlay, getStatus } from "@/utils/enumerate.js";

const { t } = useI18n();

// 初始化数据
const coinOptions = ref([]);
const legalCurrencyOptions = ref([]);

// 表单相关状态
const searchForm = ref({
  coin: "",
  legalCurrency: "",
  status: "",
  inOrderId: "",
});
const addForm = ref({
  transferPictureId: "",
});
const imgUrl = ref({
  transferPictureId: "",
});

const rules = ref({
  transferPictureId: [
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

// 搜索功能
const handleSearch = () => {
  currentPage.value = 1;
  loadData();
};
//确认转账
const thisItem = ref({});
const updateOutOrderStatusFn = (row) => {
  addForm.value = {
    transferPictureId: "",
  };
  imgUrl.value = {
    transferPictureId: "",
  };
  thisItem.value = row;
  isAddDialogVisible.value = true;
};
const handleDelete = async (row) => {
  dialogLoading.value = true;
  const res = await updateOutOrderStatus({
    outOrderId: thisItem.value.outOrderId,
    status: 2,
    transferPictureId: addForm.value.transferPictureId,
  });
  console.log(res);
  ElMessage.success(t("form.success"));
  dialogLoading.value = false;
  isAddDialogVisible.value = false;
  loadData();
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

const transferPictureVisible = ref(false);
const transferPictureUrl = ref("");
const showTransferPicture = async (row) => {
  const res = await getTransferPicture({
    transferPictureId: row.transferPictureId,
  });
  transferPictureUrl.value = res.data.picture;
  transferPictureVisible.value = true;
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
