<template>
  <div class="userSetting">
    <el-card class="box-card">
      <div class="clearfix">
        <h3>{{ $t("userProfile.title") }}</h3>
      </div>
      <div class="text item">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-descriptions :border="true" :column="1">
              <el-descriptions-item :label="$t('userProfile.userId')">{{
                userData.userId
              }}</el-descriptions-item>
              <el-descriptions-item :label="$t('userProfile.email')">{{
                userData.email
              }}</el-descriptions-item>
              <el-descriptions-item :label="$t('userProfile.name')">{{
                userData.name
              }}</el-descriptions-item>
              <el-descriptions-item :label="$t('userProfile.mobile')">{{
                userData.mobile
              }}</el-descriptions-item>
              <!-- <el-descriptions-item :label="$t('userProfile.status')">{{
                userStatus === 1 ? $t("form.enable") : $t("form.disable")
              }}</el-descriptions-item> -->
            </el-descriptions>
          </el-col>
          <!-- <el-col :span="12">
            <el-descriptions :border="true" :column="1">
              <el-descriptions-item :label="$t('userProfile.rechargeTotal')">{{
                userData.rechargeTotal
              }}</el-descriptions-item>
              <el-descriptions-item :label="$t('userProfile.tradeTotal')">{{
                userData.tradeTotal
              }}</el-descriptions-item>
              <el-descriptions-item :label="$t('userProfile.otcBalance')">{{
                userData.otcBalance
              }}</el-descriptions-item>
              <el-descriptions-item
                :label="$t('userProfile.otcAvailableBalance')"
                >{{ userData.otcAvailableBalance }}</el-descriptions-item
              >
              <el-descriptions-item :label="$t('userProfile.freezeAmount')">{{
                userData.freezeAmount
              }}</el-descriptions-item>
            </el-descriptions>
          </el-col> -->
        </el-row>
      </div>
    </el-card>
    <el-row>
      <el-col :span="12">
        <h3>{{ $t("routerName.userSetting") }}</h3>
        <el-form
          :model="form"
          :rules="registerRules"
          ref="formRef"
          @submit.prevent="submitForm"
          label-width="150px"
        >
          <!-- 注册表单部分 -->
          <el-form-item
            :label="$t('register.idCardFrontId')"
            prop="idCardFrontId"
          >
            <el-upload
              class="upload-demo"
              :before-upload="beforeUpload"
              :show-file-list="false"
              :http-request="(file) => customUpload(file, 'idCardFrontId')"
              :limit="1"
            >
              <el-button type="text">{{
                $t("register.uploadFront")
              }}</el-button>
            </el-upload>
            <span v-if="imgUrl.idCardFrontId">
              <el-image
                style="width: 100px; height: 100px"
                :src="`data:image/jpeg;base64,${imgUrl.idCardFrontId}`"
                :zoom-rate="1.2"
                :max-scale="7"
                :min-scale="0.2"
                :preview-src-list="[
                  `data:image/jpeg;base64,${imgUrl.idCardFrontId}`,
                ]"
                :initial-index="1"
                fit="cover"
            /></span>
          </el-form-item>

          <el-form-item
            :label="$t('register.idCardBackId')"
            prop="idCardBackId"
          >
            <el-upload
              class="upload-demo"
              :before-upload="beforeUpload"
              :show-file-list="false"
              :http-request="(file) => customUpload(file, 'idCardBackId')"
              :limit="2"
            >
              <el-button type="text">{{ $t("register.uploadBack") }}</el-button>
            </el-upload>
            <span v-if="imgUrl.idCardBackId" class="img">
              <el-image
                style="width: 100px; height: 100px"
                :src="`data:image/jpeg;base64,${imgUrl.idCardBackId}`"
                :zoom-rate="1.2"
                :max-scale="7"
                :min-scale="0.2"
                :preview-src-list="[
                  `data:image/jpeg;base64,${imgUrl.idCardBackId}`,
                ]"
                :initial-index="1"
                fit="cover"
            /></span>
          </el-form-item>

          <el-form-item
            :label="$t('register.idCardInHandId')"
            prop="idCardInHandId"
          >
            <el-upload
              class="upload-demo"
              :before-upload="beforeUpload"
              :show-file-list="false"
              :http-request="(file) => customUpload(file, 'idCardInHandId')"
              :limit="2"
            >
              <el-button type="text">{{
                $t("register.uploadInHand")
              }}</el-button>
            </el-upload>
            <span v-if="imgUrl.idCardInHandId">
              <el-image
                style="width: 100px; height: 100px"
                :src="`data:image/jpeg;base64,${imgUrl.idCardInHandId}`"
                :zoom-rate="1.2"
                :max-scale="7"
                :min-scale="0.2"
                :preview-src-list="[
                  `data:image/jpeg;base64,${imgUrl.idCardInHandId}`,
                ]"
                :initial-index="1"
                fit="cover"
            /></span>
          </el-form-item>

          <el-form-item>
            <div class="rigth">
              <el-button type="primary" @click="submitForm">{{
                $t("form.confirm")
              }}</el-button>
            </div>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="9">
        <h3>{{ $t("form.apaSetting") }}</h3>
        <el-form
          :model="apiInfo"
          :rules="apiInfoRules"
          ref="apiFormRef"
          @submit.prevent="submitForm2"
          label-width="150px"
        >
          <el-form-item :label="$t('form.accessKey')" prop="accessKey">
            <el-input v-model="apiInfo.accessKey"></el-input>
          </el-form-item>
          <el-form-item :label="$t('form.callbackUrl')" prop="callbackUrl">
            <el-input v-model="apiInfo.callbackUrl"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm2">{{
              $t("form.confirm")
            }}</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import { useI18n } from "vue-i18n";
import store from "@/store/index";
import { uploadPicture, previewPicture } from "@/api/file";
import { registerForOtc } from "@/api/otc";
import { login } from "@/api/auth";
import {
  getUserInfoForMerchant,
  updateMerchantInfo,
  updateApiInfo,
} from "@/api/buyer";
const { locale, t } = useI18n();
const router = useRouter();
const formRef = ref(null);
const loginFormRef = ref(null);
const isLogin = ref(true);

const loginForm = ref({
  email: "",
  password: "",
});
const apiInfo = ref({
  accessKey: "",
  callbackUrl: "",
});
const apiFormRef = ref(null);
const form = ref({
  idCardFrontId: "",
  idCardBackId: "",
  idCardInHandId: "",
});
const imgUrl = ref({
  idCardFrontId: "",
  idCardBackId: "",
  idCardInHandId: "",
});
onMounted(() => {
  getUserData();
});
const userData = ref({});
const getUserData = async () => {
  const res = await getUserInfoForMerchant();

  imgUrl.value.idCardFrontId = res.data.idCardFrontPicture;
  imgUrl.value.idCardBackId = res.data.idCardBackPicture;
  imgUrl.value.idCardInHandId = res.data.idCardInHandPicture;
  form.value.idCardFrontId = res.data.idCardFrontId;
  form.value.idCardBackId = res.data.idCardBackId;
  form.value.idCardInHandId = res.data.idCardInHandId;
  apiInfo.value.accessKey = res.data.accessKey;
  apiInfo.value.callbackUrl = res.data.callbackUrl;

  userData.value = res.data;
  console.log(imgUrl, "imgUrl");
};
const apiInfoRules = ref({
  accessKey: [
    { required: true, message: t("form.requiredText"), trigger: "blur" },
  ],
  callbackUrl: [
    { required: true, message: t("form.requiredText"), trigger: "blur" },
  ],
});

const registerRules = ref({
  email: [
    { required: true, message: t("login.email_placeholder"), trigger: "blur" },
    {
      type: "email",
      message: t("login.email_format_error"),
      trigger: ["blur", "change"],
    },
  ],
  name: [
    {
      required: true,
      message: t("register.name_placeholder"),
      trigger: "blur",
    },
  ],
  mobile: [
    {
      required: true,
      message: t("register.mobile_placeholder"),
      trigger: "blur",
    },
  ],
  password: [
    {
      required: true,
      message: t("login.password_placeholder"),
      trigger: "blur",
    },
  ],
  idCardFrontId: [
    {
      required: true,
      message: t("register.idCardFront_placeholder"),
      trigger: "change",
    },
  ],
  idCardBackId: [
    {
      required: true,
      message: t("register.idCardBack_placeholder"),
      trigger: "change",
    },
  ],
  idCardInHandId: [
    {
      required: true,
      message: t("register.idCardInHand_placeholder"),
      trigger: "change",
    },
  ],
});

const switchLanguage = () => {
  locale.value = locale.value === "zh" ? "en" : "zh";
};

const toggleForm = () => {
  isLogin.value = !isLogin.value;
};

const submitForm = async () => {
  formRef.value.validate(async (valid) => {
    if (valid) {
      // 调用注册 API，成功后跳转到登录页面或首页
      const res = await updateMerchantInfo({
        ...form.value,
      });
      ElMessage.success(t("form.success"));
      isLogin.value = true;
    }
  });
};

const submitForm2 = async () => {
  apiFormRef.value.validate(async (valid) => {
    if (valid) {
      const res = await updateApiInfo({
        ...apiInfo.value,
      });
      ElMessage.success(t("form.success"));
      isLogin.value = true;
    }
  });
};
const forgotPassword = () => {
  // 模拟发送邮件
  ElMessage.success("重置密码邮件已发送，请检查您的邮箱");
};

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

// 将图片数据转换为 base64 URL

const customUpload = async ({ file, onSuccess, onError }, field) => {
  try {
    const response = await uploadPicture({ file: file });
    form.value[field] = response.data.pictureId;
    const url = await previewPicture({ pictureId: response.data.pictureId });
    const base64Url = url.data.picture;
    imgUrl.value[field] = base64Url;
    ElMessage.success("图片上传成功");
  } catch (error) {
    onError(error);
  }
};

const handleUploadSuccess = (field) => (response) => {
  console.log(field, response);
  if (response && response.data && response.code === "0") {
    form.value[field] = response.data.pictureId;
    ElMessage.success("图片上传成功");
  } else {
    ElMessage.error("上传失败");
  }
};
</script>

<style scoped>
.userSetting {
}
</style>
