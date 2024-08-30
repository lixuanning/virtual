<template>
  <div class="transfers">
    <div class="top-nav">
      <h3>{{ $t("form.instructions") }}</h3>
      <p class="text">{{ $t("form.instructionsText") }}</p>
      <p class="text">{{ $t("form.instructionsText2") }}</p>
    </div>
    <div class="steps">
      <el-steps :active="step" finish-status="success">
        <el-step :title="$t('steps.transfer')"></el-step>
        <el-step :title="$t('steps.waitForConfirmation')"></el-step>
        <el-step :title="$t('steps.confirmed')"></el-step>
      </el-steps>
    </div>

    <div class="from-nav" v-if="step === 1">
      <el-form :model="form" ref="formRef" :rules="rules" label-width="120px">
        <el-form-item :label="$t('form.payType')" prop="payType">
          <el-select
            width="100%"
            v-model="form.payType"
            :placeholder="$t('form.selectType')"
            @change="setType"
          >
            <el-option
              v-for="item in playType"
              :key="item.id"
              :label="
                item.type === 1 ? '银行卡' : item.type === 2 ? '微信' : '支付宝'
              "
              :value="item.type"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('form.realName')">
          <el-input v-model="form.payee" disabled></el-input>
        </el-form-item>
        <el-form-item :label="$t('form.realTransferPrice')">
          <el-input v-model="form.realTransferPrice" disabled>
            <template #append>CNY</template>
          </el-input>
        </el-form-item>
        <el-form-item :label="$t('form.realPayee')">
          <el-input v-model="form.realName" disabled></el-input>
        </el-form-item>

        <el-form-item :label="$t('form.payAccount')" v-if="form.payType">
          <span v-if="form.payType === 1">
            {{ thisItem.openingBank }}/{{ thisItem.cardId }}
          </span>
          <span v-if="form.payType === 3 || form.payType === 2">
            <el-image
              style="width: 120px; height: 120px"
              :src="`data:image/jpeg;base64,${thisItem.qrCodePicture}`"
              :zoom-rate="1.2"
              :max-scale="7"
              :min-scale="0.2"
              :preview-src-list="[
                `data:image/jpeg;base64,${thisItem.qrCodePicture}`,
              ]"
              :initial-index="1"
              fit="cover"
              :preview-teleported="true"
            />
          </span>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm" v-if="form.payType">{{
            $t("form.confirmTheOkBtn")
          }}</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="btn-nav">
      <h3>{{ $t("warning.title") }}</h3>
      <p v-for="item in 6" :key="item" class="text">
        {{ $t(`warning.text${item}`) }}
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { ElMessage } from "element-plus";
import { useI18n } from "vue-i18n";
import {
  getPaymentConfigForMerchant,
  queryInOrderDetail,
  merchantConfirmInOrder,
} from "@/api/buyer";
import axios from "axios";

const { t } = useI18n();
import store from "@/store/index";

const form = ref({
  payee: "",
  realTransferPrice: "",
  realName: "",
  payType: "",
});
const rules = ref({
  payType: [
    { required: true, message: t("form.requiredText"), trigger: "blur" },
  ],
});
const step = ref(1);
const formRef = ref(null);
const route = useRoute();
const playType = ref([]);
const thisItem = ref({});
const setType = (value) => {
  const changeItem = playType.value.find((item) => item.type === value);
  form.value.payee = changeItem.payee;
  thisItem.value = changeItem;
};
const reqData = ref({});
const fetchData = async (params) => {
  try {
    const response = await getPaymentConfigForMerchant({
      productId: params.productId,
    });
    const data = response.data;
    playType.value = data;
  } catch (error) {
    ElMessage.error(t("errors.fetchFailed"));
  }
};

const fetchStatus = async (params) => {
  try {
    const response = await queryInOrderDetail({
      inOrderId: params.inOrderId,
    });
    const data = response.data;
    reqData.value = data;
    updateStep(data.status);
  } catch (error) {
    ElMessage.error(t("errors.fetchFailed"));
  }
};

const updateStep = (status) => {
  step.value = status; // 根据状态更新步骤条
};

const submitForm = async () => {
  let newData = {
    ...form.value,
  };
  if (form.value.payType === 1) {
    newData.payCardId = thisItem.value.cardId;
  } else {
    newData.payQrCodeId = thisItem.value.qrCodeId;
  }
  console.log(newData);

  try {
    const response = await merchantConfirmInOrder({
      ...form.value,
      inOrderId: routeData.value.inOrderId,
    });
    fetchStatus(routeData.value);
    ElMessage.success(t("messages.submitted"));
  } catch (error) {
    ElMessage.error(t("errors.submitFailed"));
  }
};
const routeData = ref({});
onMounted(() => {
  const params = route.query;
  routeData.value = params;
  console.log(params, "333");
  form.value.realName = params.realName;
  form.value.realTransferPrice = params.realTransferPrice;
  store.setUserinfo({ role: "buyer", token: params.token });
  fetchData(params);
  fetchStatus(params);
});
</script>
<style scoped>
.transfers {
  padding: 30px 50px;
  background-color: #f0f2f5;
}
.top-nav {
  background: #fff;
  padding: 20px;
  font-size: 12px;
}
.btn-nav {
  padding: 20px;
  font-size: 12px;
  margin-top: 20px;
  background: #fff;
}
.text {
  padding-left: 40px;
}
.from-nav {
  margin-top: 20px;
  background: #fff;
  padding: 20px;
}
.steps {
  margin-top: 20px;
  background: #fff;
  padding: 50px;
}
</style>
