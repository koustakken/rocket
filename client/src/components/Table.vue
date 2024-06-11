<script setup lang="ts">
import { onMounted, ref } from "vue";
import { InputSearch, Tooltip, Button } from "ant-design-vue";
import { axiosClient } from "../config/axios";

const isLoading = ref(true);
const data = ref([]);

const value = ref("");
const onSearch = () => {
  if (value.value.length < 3) return false;
  fetchSearchTerm(value.value);
};

const columns = [
  {
    title: "Название",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "Бюджет",
    dataIndex: "price",
    key: "price",
  },
  {
    title: "Дата создания",
    dataIndex: "created_at",
    key: "created_at",
  },
  {
    title: "Компания",
    dataIndex: "company",
    key: "company",
  },
  {
    title: "Ответственный",
    dataIndex: "manager",
    key: "manager",
  },
  {
    title: "Этап",
    dataIndex: "pipeline",
    key: "pipeline",
  },
];

const fetchData = async () => {
  try {
    isLoading.value = true;
    const response = await axiosClient.get("/leads");
    isLoading.value = false;
    data.value = response.data;
    console.log(data.value);
  } catch (error) {
    isLoading.value = false;
    console.log(error);
  }
};

const fetchSearchTerm = async (searthTerm: string) => {
  try {
    isLoading.value = true;
    const response = await axiosClient.get(`/leads/${searthTerm}`);
    isLoading.value = false;
    data.value = response.data;
  } catch (error) {
    isLoading.value = false;
    console.log(error);
  }
};

onMounted(() => {
  fetchData();
});
</script>

<template>
  <div class="wrapper">
    <div class="search">
      <Tooltip placement="top" v-if="value.length < 3 && value.length > 0">
        <template #title>
          <span> Поиск работает от 3-х символов </span>
        </template>
        <Button>?</Button>
      </Tooltip>
      <InputSearch
        v-model:value="value"
        placeholder="Search lead by name"
        @search="onSearch"
      />
    </div>
    <a-table :columns="columns" :data-source="data" :expand-column-width="100">
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'name'">
          {{ record.name || "Ошибка загрузки" }}
        </template>
        <template v-if="column.key === 'pipeline'">
          <a-tag
            :color="
              record.pipeline === undefined ? '#ededed' : record.pipeline[1]
            "
          >
            {{
              record.pipeline === undefined ? "Не найден" : record.pipeline[0]
            }}
          </a-tag>
        </template>
        <template v-if="column.key === 'company'">
          {{ record.company === "-" ? "Не найден" : record.company }}
        </template>
        <template v-if="column.key === 'manager'">
          <span class="manager">
            <svg
              width="24px"
              height="24px"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
              <g
                id="SVGRepo_tracerCarrier"
                stroke-linecap="round"
                stroke-linejoin="round"
              ></g>
              <g id="SVGRepo_iconCarrier">
                <circle
                  cx="12"
                  cy="6"
                  r="4"
                  stroke="#1C274C"
                  stroke-width="1.5"
                ></circle>
                <path
                  d="M19.9975 18C20 17.8358 20 17.669 20 17.5C20 15.0147 16.4183 13 12 13C7.58172 13 4 15.0147 4 17.5C4 19.9853 4 22 12 22C14.231 22 15.8398 21.8433 17 21.5634"
                  stroke="#1C274C"
                  stroke-width="1.5"
                  stroke-linecap="round"
                ></path>
              </g>
            </svg>
            {{ record.manager === "-" ? "Не найден" : record.manager }}
          </span>
        </template>
      </template>
      <template #expandedRowRender="{ record }">
        <p style="margin: 0">
          {{ record.contacts === undefined ? "Не найден" : record.contacts[0] }}
          <Tooltip placement="top">
            <template #title>
              <span>
                {{
                  record.contacts === undefined
                    ? "Не найден"
                    : record.contacts[1]
                }}
              </span>
            </template>
            <Button :disabled="record.contacts === undefined">
              <svg
                width="12px"
                height="12px"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                <g
                  id="SVGRepo_tracerCarrier"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                ></g>
                <g id="SVGRepo_iconCarrier">
                  <path
                    d="M21 5.5C21 14.0604 14.0604 21 5.5 21C5.11378 21 4.73086 20.9859 4.35172 20.9581C3.91662 20.9262 3.69906 20.9103 3.50103 20.7963C3.33701 20.7019 3.18146 20.5345 3.09925 20.364C3 20.1582 3 19.9181 3 19.438V16.6207C3 16.2169 3 16.015 3.06645 15.842C3.12515 15.6891 3.22049 15.553 3.3441 15.4456C3.48403 15.324 3.67376 15.255 4.05321 15.117L7.26005 13.9509C7.70153 13.7904 7.92227 13.7101 8.1317 13.7237C8.31637 13.7357 8.49408 13.7988 8.64506 13.9058C8.81628 14.0271 8.93713 14.2285 9.17882 14.6314L10 16C12.6499 14.7999 14.7981 12.6489 16 10L14.6314 9.17882C14.2285 8.93713 14.0271 8.81628 13.9058 8.64506C13.7988 8.49408 13.7357 8.31637 13.7237 8.1317C13.7101 7.92227 13.7904 7.70153 13.9509 7.26005L13.9509 7.26005L15.117 4.05321C15.255 3.67376 15.324 3.48403 15.4456 3.3441C15.553 3.22049 15.6891 3.12515 15.842 3.06645C16.015 3 16.2169 3 16.6207 3H19.438C19.9181 3 20.1582 3 20.364 3.09925C20.5345 3.18146 20.7019 3.33701 20.7963 3.50103C20.9103 3.69907 20.9262 3.91662 20.9581 4.35173C20.9859 4.73086 21 5.11378 21 5.5Z"
                    stroke="#000000"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  ></path>
                </g>
              </svg>
            </Button>
          </Tooltip>
        </p>
      </template>
    </a-table>
  </div>
</template>

<style scoped>
.wrapper {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 2rem;
  border-radius: 0.3rem;
  background-color: #fff;
}
.search {
  display: flex;
  gap: 0.3rem;
}
.ant-tag {
  color: #8f8f8f;
}
.manager {
  display: flex;
  align-items: center;
  gap: 0.3rem;
}
</style>
