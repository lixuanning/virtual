<template>
  <el-card class="box-card">
    <div class="clearfix">
      <span>{{ $t("userProfile.title") }}</span>
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
        <el-col :span="12">
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
        </el-col>
      </el-row>
    </div>
  </el-card>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { ElMessage } from "element-plus";
import axios from "axios";
import { getUserInfoForOtc } from "@/api/otc.js";

// 模拟获取用户数据
const userData = ref({});
const userStatus = ref("");

onMounted(() => {
  fetchUserData();
});

const fetchUserData = async () => {
  try {
    const response = await getUserInfoForOtc();
    userData.value = response.data;
  } catch (error) {
    ElMessage.error("Error fetching data");
  }
};
</script>

<style scoped>
.box-card {
  margin: 20px;
}
.clearfix {
  margin-bottom: 20px;
}
</style>
