<template>
  <el-container>
    <!-- 筛选表单 -->
    <el-header class="header">
      <div>
        <el-form :inline="true" :model="searchForm" class="demo-form-inline">
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
        <el-table-column prop="name" :label="$t('form.name')"></el-table-column>
        <el-table-column
          prop="email"
          :label="$t('form.email')"
          width="120"
        ></el-table-column>
        <el-table-column
          prop="merchantId"
          width="120"
          :label="$t('form.merchantId')"
        >
        </el-table-column>
        <el-table-column prop="status" :label="$t('form.status')" width="120">
          <template #default="scope">
            <el-tag :type="getAuditStatus(scope.row.status).type">
              {{ getAuditStatus(scope.row.status).name }}</el-tag
            >
          </template>
        </el-table-column>

        <el-table-column
          prop="status"
          :label="$t('form.ApiDistribution')"
          width="120"
        >
          <template #default="scope">
            <el-tag type="success" v-if="scope.row.apiFlag === 1">
              {{ $t("form.yes") }}</el-tag
            >
            <el-tag type="default" v-else> {{ $t("form.no") }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="higherMerchantEmail"
          :label="$t('form.higherMerchantEmailProxyRate')"
          width="150"
        >
          <template #default="{ row }">
            {{ row.higherMerchantEmail }}/
            {{ row.proxyRate ? `${row.proxyRate * 100}%` : "" }}
          </template>
        </el-table-column>
        <!-- <el-table-column prop="proxyRate" :label="$t('form.proxyRate')">
        </el-table-column> -->
        <el-table-column
          prop="inServiceChargeType"
          :label="$t('form.outServiceCharge')"
          width="120"
        >
          <template #default="scope">
            {{
              scope.row.outServiceCharge === 1
                ? $t("form.merchant")
                : $t("form.user")
            }}/{{
              scope.row.outServiceChargeRate
                ? `${scope.row.outServiceChargeRate * 100}%`
                : ""
            }}
          </template>
        </el-table-column>
        <el-table-column
          prop="status"
          :label="$t('form.intoServiceCharge')"
          width="120"
        >
          <template #default="scope">
            {{
              scope.row.inServiceChargeType === 1
                ? $t("form.merchant")
                : $t("form.user")
            }}{{ scope.row.inServiceChargeRate }}
          </template>
        </el-table-column>

        <el-table-column prop="merchantBalance" :label="$t('form.residue')">
        </el-table-column>
        <el-table-column
          prop="merchantAvailableBalance"
          :label="$t('form.otcAvailableBalance')"
        >
        </el-table-column>
        <el-table-column
          prop="merchantFreezeBalance"
          :label="$t('form.otcFreezeBalance')"
        >
        </el-table-column>
        <el-table-column
          prop="supportLegalCurrencyArr"
          :label="$t('form.supportLegalCurrencyArr')"
          width="200"
        >
          <template #default="scope">
            <span
              v-for="(item, index) in scope.row.supportLegalCurrencyArr"
              :key="index"
            >
              {{ item }}，
            </span>
          </template>
        </el-table-column>
        <el-table-column
          prop="createDate"
          :label="$t('form.created')"
          width="200"
        >
          <template #default="scope">
            {{ moment(scope.row.createDate).format("YYYY-MM-DD") }}
          </template>
        </el-table-column>

        <!-- <el-table-column
          prop="idCardFrontPicture"
          :label="$t('register.idCardFrontId')"
          width="200"
        >
          <template #default="scope">
            <el-image
              v-if="scope.row.idCardFrontPicture"
              style="width: 60px; height: 60px"
              :src="`data:image/jpeg;base64,${scope.row.idCardFrontPicture}`"
              :zoom-rate="1.2"
              :max-scale="7"
              :min-scale="0.2"
              :preview-src-list="[
                `data:image/jpeg;base64,${scope.row.idCardFrontPicture}`,
              ]"
              :initial-index="1"
              fit="cover"
              :preview-teleported="true"
            />
          </template>
        </el-table-column>
        <el-table-column
          prop="idCardBackPicture"
          :label="$t('register.idCardBackId')"
          width="200"
        >
          <template #default="scope">
            <el-image
              v-if="scope.row.idCardBackPicture"
              style="width: 60px; height: 60px"
              :src="`data:image/jpeg;base64,${scope.row.idCardBackPicture}`"
              :zoom-rate="1.2"
              :max-scale="7"
              :min-scale="0.2"
              :preview-src-list="[
                `data:image/jpeg;base64,${scope.row.idCardBackPicture}`,
              ]"
              :initial-index="1"
              fit="cover"
              :preview-teleported="true"
            />
          </template>
        </el-table-column>
        <el-table-column
          prop="idCardInHandPicture"
          :label="$t('register.idCardInHandId')"
          width="200"
        >
          <template #default="scope">
            <el-image
              v-if="scope.row.idCardInHandPicture"
              style="width: 60px; height: 60px"
              :src="`data:image/jpeg;base64,${scope.row.idCardInHandPicture}`"
              :zoom-rate="1.2"
              :max-scale="7"
              :min-scale="0.2"
              :preview-src-list="[
                `data:image/jpeg;base64,${scope.row.idCardInHandPicture}`,
              ]"
              :initial-index="1"
              fit="cover"
              :preview-teleported="true"
            />
          </template>
        </el-table-column> -->
        <el-table-column :label="$t('form.actions')" width="240" fixed="right">
          <template #default="scope">
            <el-button type="text" @click="showEditDialog(scope.row, 1)">
              {{ $t("form.userAudit") }}
            </el-button>
            <el-button type="text" @click="showEditDialog(scope.row, 2)">
              {{ $t("form.updateApiStatus") }}
            </el-button>
            <el-button type="text" @click="showEditDialog(scope.row, 3)">
              {{ $t("form.bind") }}
            </el-button>
            <el-button type="text" @click="showEditDialog(scope.row, 4)">
              {{ $t("form.rating") }}
            </el-button>
            <el-button type="text" @click="showEditDialog(scope.row, 5)">
              {{ $t("form.outServiceCharge") }}
            </el-button>
            <el-button type="text" @click="showEditDialog(scope.row, 6)">
              {{ $t("form.intoServiceCharge") }}
            </el-button>
            <el-button type="text" @click="showEditDialog(scope.row, 7)">
              {{ $t("form.topUp") }}
            </el-button>
            <el-button type="text" @click="showEditDialog(scope.row, 8)">
              {{ $t("form.deduction") }}
            </el-button>
            <el-button type="text" @click="showEditDialog(scope.row, 9)">
              {{ $t("form.supportLegalCurrencyArr") }}
            </el-button>
            <el-button type="text" @click="showEditDialog(scope.row, 10)">
              {{ $t("form.updateUserName") }}
            </el-button>
            <!-- <el-button type="text" @click="showEditDialog(scope.row, 2)">
              {{ $t("form.exchangeRate") }}
            </el-button> -->

            <!-- <el-button type="text" @click="showAddDialog(scope.row)">{{
              $t("form.edit")
            }}</el-button> -->
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
          v-if="thisFromKey === 1"
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
        <el-form-item
          :label="$t('form.status')"
          prop="apiFlag"
          v-if="thisFromKey === 2"
        >
          <el-select
            width="100%"
            v-model="updateStatusData.apiFlag"
            :placeholder="$t('form.select')"
          >
            <el-option :label="$t('form.enable')" :value="1"></el-option>
            <el-option :label="$t('form.disable')" :value="2"></el-option>
          </el-select>
        </el-form-item>
        <template v-if="thisFromKey === 3">
          <p class="bindingTitle">
            {{ $t("form.binding") }}
          </p>
          <div v-for="(item, index) in thisItem.bindOtcs" :key="index">
            <p>
              {{
                item.type === 1
                  ? $t("routerName.recharge")
                  : $t("routerName.withdraw")
              }}：{{ item.otcEmail }}
            </p>
          </div>
          <p class="bindingTitle">
            {{ $t("form.AddBinding") }}
          </p>
          <el-form-item :label="$t('form.OTCemail')" prop="OTCemail">
            <el-input v-model="updateStatusData.OTCemail"></el-input>
          </el-form-item>

          <el-form-item :label="$t('form.type')" prop="type">
            <el-select
              width="100%"
              v-model="updateStatusData.type"
              :placeholder="$t('form.select')"
            >
              <el-option label="入金" :value="1"></el-option>
              <el-option label="出金" :value="2"></el-option>
            </el-select>
          </el-form-item>
        </template>

        <template v-if="thisFromKey === 4">
          <el-form-item
            :label="$t('form.higherMerchantEmail')"
            prop="higherMerchantEmail"
          >
            <el-input v-model="updateStatusData.higherMerchantEmail"></el-input>
          </el-form-item>
          <el-form-item :label="$t('form.proxyRate')" prop="proxyRate">
            <!-- <el-input v-model="updateStatusData.proxyRate"></el-input> -->
            <el-input-number
              v-model="updateStatusData.proxyRate"
              :precision="4"
              :step="0.0001"
              :max="10000"
            />
          </el-form-item>
        </template>
        <template v-if="thisFromKey === 5">
          <el-form-item
            :label="$t('form.paymentPayer')"
            prop="outServiceChargeType"
          >
            <el-select
              width="100%"
              v-model="updateStatusData.outServiceChargeType"
              :placeholder="$t('form.select')"
            >
              <el-option label="商家" :value="1"></el-option>
              <el-option label="用户" :value="2"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            :label="$t('form.serviceChargeRate')"
            prop="outServiceChargeRate"
          >
            <el-input-number
              v-model="updateStatusData.outServiceChargeRate"
              :precision="2"
              :step="0.1"
              :max="10000"
            />
          </el-form-item>
        </template>

        <template v-if="thisFromKey === 6">
          <el-form-item
            :label="$t('form.paymentPayer')"
            prop="inServiceChargeType"
          >
            <el-select
              width="100%"
              v-model="updateStatusData.inServiceChargeType"
              :placeholder="$t('form.select')"
            >
              <el-option label="商家" :value="1"></el-option>
              <el-option label="用户" :value="2"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            :label="$t('form.serviceChargeRate')"
            prop="inServiceChargeRate"
          >
            <el-input-number
              v-model="updateStatusData.inServiceChargeRate"
              :precision="2"
              :step="0.1"
              :max="10000"
            />
          </el-form-item>
        </template>

        <el-form-item
          :label="$t('form.quantity3')"
          prop="quantity"
          v-if="thisFromKey === 7"
        >
          <el-input type="number" v-model="updateStatusData.quantity" />
        </el-form-item>
        <el-form-item
          :label="$t('form.quantity4')"
          prop="quantity"
          v-if="thisFromKey === 8"
        >
          <el-input type="number" v-model="updateStatusData.quantity" />
        </el-form-item>
        <el-form-item
          :label="$t('form.supportLegalCurrencyArr')"
          prop="supportLegalCurrencyArr"
          v-if="thisFromKey === 9"
        >
          <el-select
            v-model="updateStatusData.supportLegalCurrencyArr"
            :placeholder="$t('form.select')"
            multiple
          >
            <el-option
              v-for="item in legalCurrencyOptions"
              :key="item.id"
              :label="item.value"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          :label="$t('form.name')"
          prop="name"
          v-if="thisFromKey === 10"
        >
          <el-input type="text" v-model="updateStatusData.name" />
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
    <!-- 新增对话框 -->
    <el-dialog :title="$t('form.add')" v-model="isAddDialogVisible">
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
              :key="item"
              :label="item"
              :value="item"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('form.total')" prop="total">
          <el-input type="number" v-model="addForm.total"></el-input>
        </el-form-item>
        <el-form-item :label="$t('form.legalCurrency')" prop="legalCurrency">
          <el-select
            v-model="addForm.legalCurrency"
            placeholder="Select Currency"
          >
            <el-option
              v-for="item in legalCurrencyOptions"
              :key="item"
              :label="item"
              :value="item"
            ></el-option>
          </el-select>
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

        <el-form-item :label="$t('form.saleStartDate')" prop="dateList">
          <el-date-picker
            v-model="addForm.dateList"
            type="daterange"
            start-placeholder="Start Date"
            end-placeholder="End Date"
            align="right"
            format="YYYY/MM/DD"
          ></el-date-picker>
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
          {{ $t("form.add") }}
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
  queryMerchantUserList,
  updateUserStatus,
  updateMerchantApiStatus,
  merchantBindOtc,
  setProxyRate,
  updateOutServiceCharge,
  updateInServiceCharge,
  merchantRecharge,
  merchantSubtract,
  updateSupportLegalCurrency,
  updateUserName,
} from "@/api/agent.js";
import { ElMessage } from "element-plus";
import moment from "moment";
import { getAuditStatus } from "@/utils/enumerate.js";
import { assignSelectedData, clearFormFields } from "@/utils/tool.js";
const { t } = useI18n();

// 初始化数据
const coinOptions = ref([]);
const legalCurrencyOptions = ref([]);
const isAddDialogVisible2 = ref(false);
const addFormRef2 = ref(null);
// 表单相关状态
const searchForm = ref({ email: "", status: "" });
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
  apiFlag: "",
  otcEmail: "",
  type: "",
  higherMerchantEmail: "",
  proxyRate: "",
  inServiceChargeRate: "",
  outServiceChargeRate: "",
  outServiceChargeType: "",
  inServiceChargeType: "",
  quantity: "",
  supportLegalCurrencyArr: [],
  name: "",
});
const rules2 = ref({
  inServiceChargeRate: [
    { required: true, message: t("form.requiredText"), trigger: "blur" },
  ],
  name: [{ required: true, message: t("form.requiredText"), trigger: "blur" }],
  supportLegalCurrencyArr: [
    { required: true, message: t("form.requiredText"), trigger: "blur" },
  ],
  quantity: [
    { required: true, message: t("form.requiredText"), trigger: "blur" },
  ],
  outServiceChargeRate: [
    { required: true, message: t("form.requiredText"), trigger: "blur" },
  ],
  outServiceChargeType: [
    { required: true, message: t("form.requiredText"), trigger: "blur" },
  ],
  inServiceChargeType: [
    { required: true, message: t("form.requiredText"), trigger: "blur" },
  ],
  status: [
    { required: true, message: t("form.requiredText"), trigger: "blur" },
  ],
  apiFlag: [
    { required: true, message: t("form.requiredText"), trigger: "blur" },
  ],
  proxyRate: [
    { required: true, message: t("form.requiredText"), trigger: "blur" },
  ],
  OTCemail: [
    { required: true, message: t("login.email_placeholder"), trigger: "blur" },
    {
      type: "email",
      message: t("login.email_format_error"),
      trigger: ["blur", "change"],
    },
  ],
  higherMerchantEmail: [
    { required: true, message: t("login.email_placeholder"), trigger: "blur" },
    {
      type: "email",
      message: t("login.email_format_error"),
      trigger: ["blur", "change"],
    },
  ],
  type: [{ required: true, message: t("form.requiredText"), trigger: "blur" }],
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
    const { data } = await queryMerchantUserList({
      pageNum: currentPage.value,
      pageSize: pageSize.value,
      status: searchForm.value.status,
      coin: searchForm.value.email,
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
const thisFromKey = ref();
// 操作
const showEditDialog = (row, key) => {
  clearFormFields(updateStatusData.value);
  updateStatusData.value = assignSelectedData(updateStatusData.value, row);
  updateStatusData.value.type = "";
  updateStatusData.value.OTCemail = "";
  console.log(updateStatusData.value, "updateStatusData.value");
  thisItem.value = row;
  thisFromKey.value = key;
  isAddDialogVisible2.value = true;
};
// 修改状态
const updateUserStatusFn = async () => {
  try {
    await updateUserStatus({
      status: updateStatusData.value.status,
      userId: thisItem.value.userId,
    });
    dialogLoading.value = false;
    ElMessage.success(t("form.successText"));
    isAddDialogVisible2.value = false;
    loadData(); // 重新加载数据
  } catch (error) {
    dialogLoading.value = false;
  }
};
// 修改API状态
const updateApiStatusFn = async () => {
  try {
    await updateMerchantApiStatus({
      merchantId: thisItem.value.merchantId,
      apiFlag: updateStatusData.value.apiFlag,
    });
    dialogLoading.value = false;
    ElMessage.success(t("form.successText"));
    isAddDialogVisible2.value = false;
    loadData(); // 重新加载数据
  } catch (error) {
    dialogLoading.value = false;
  }
};

// 绑定
const bindFn = async () => {
  try {
    await merchantBindOtc({
      merchantId: thisItem.value.merchantId,
      type: updateStatusData.value.type,
      otcEmail: updateStatusData.value.OTCemail,
    });
    dialogLoading.value = false;
    ElMessage.success(t("form.successText"));
    isAddDialogVisible2.value = false;
    loadData(); // 重新加载数据
  } catch (error) {
    dialogLoading.value = false;
  }
};
//设置费率
const setProxyRateFn = async () => {
  try {
    await setProxyRate({
      merchantId: thisItem.value.merchantId,
      proxyRate: updateStatusData.value.proxyRate,
      higherMerchantEmail: updateStatusData.value.higherMerchantEmail,
    });
    dialogLoading.value = false;
    ElMessage.success(t("form.successText"));
    isAddDialogVisible2.value = false;
    loadData(); // 重新加载数据
  } catch (error) {
    dialogLoading.value = false;
  }
};
// 出金手续费
const updateOutServiceChargeFn = async () => {
  try {
    await updateOutServiceCharge({
      merchantId: thisItem.value.merchantId,
      outServiceChargeRate: updateStatusData.value.outServiceChargeRate,
      outServiceChargeType: updateStatusData.value.outServiceChargeType,
    });
    dialogLoading.value = false;
    ElMessage.success(t("form.successText"));
    isAddDialogVisible2.value = false;
    loadData(); // 重新加载数据
  } catch (error) {
    dialogLoading.value = false;
  }
};
// 入金手续费
const updateInServiceChargeFn = async () => {
  try {
    await updateInServiceCharge({
      merchantId: thisItem.value.merchantId,
      inServiceChargeType: updateStatusData.value.inServiceChargeType,
      inServiceChargeRate: updateStatusData.value.inServiceChargeRate,
    });
    dialogLoading.value = false;
    ElMessage.success(t("form.successText"));
    isAddDialogVisible2.value = false;
    loadData(); // 重新加载数据
  } catch (error) {
    dialogLoading.value = false;
  }
};

const merchantRechargeFn = async () => {
  try {
    await merchantRecharge({
      merchantId: thisItem.value.merchantId,
      quantity: updateStatusData.value.quantity,
    });
    dialogLoading.value = false;
    ElMessage.success(t("form.successText"));
    isAddDialogVisible2.value = false;
    loadData(); // 重新加载数据
  } catch (error) {
    dialogLoading.value = false;
  }
};
const merchantSubtractFn = async () => {
  try {
    await merchantSubtract({
      merchantId: thisItem.value.merchantId,
      quantity: updateStatusData.value.quantity,
    });
    dialogLoading.value = false;
    ElMessage.success(t("form.successText"));
    isAddDialogVisible2.value = false;
    loadData(); // 重新加载数据
  } catch (error) {
    dialogLoading.value = false;
  }
};

const updateSupportLegalCurrencyFn = async () => {
  try {
    await updateSupportLegalCurrency({
      merchantId: thisItem.value.merchantId,
      supportLegalCurrencyArr: updateStatusData.value.supportLegalCurrencyArr,
    });
    dialogLoading.value = false;
    ElMessage.success(t("form.successText"));
    isAddDialogVisible2.value = false;
    loadData(); // 重新加载数据
  } catch (error) {
    dialogLoading.value = false;
  }
};

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
      if (thisFromKey.value === 1) {
        updateUserStatusFn();
      } else if (thisFromKey.value === 2) {
        updateApiStatusFn();
      } else if (thisFromKey.value === 3) {
        bindFn();
      } else if (thisFromKey.value === 4) {
        setProxyRateFn();
      } else if (thisFromKey.value === 5) {
        updateOutServiceChargeFn();
      } else if (thisFromKey.value === 6) {
        updateInServiceChargeFn();
      } else if (thisFromKey.value === 7) {
        merchantRechargeFn();
      } else if (thisFromKey.value === 8) {
        merchantSubtractFn();
      } else if (thisFromKey.value === 9) {
        updateSupportLegalCurrencyFn();
      } else if (thisFromKey.value === 10) {
        updateUserNameFn();
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
.bindingTitle {
  font-size: 16px;
  font-weight: 500;
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
