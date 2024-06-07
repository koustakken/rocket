<script setup lang="ts">
import { onMounted, ref } from 'vue'
import {
  Table,
  InputSearch,
  Tooltip,
  Button,
  Tag,
  TableColumn,
} from 'ant-design-vue'
import { axiosClient } from '../config/axios'

const isLoading = ref(true)
const data = ref([])

const value = ref('')
const onSearch = () => {
  if (value.value.length < 3) return false
  console.log(value.value)
  fetchSearchTerm(value.value)
}

const columns = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: 'Price',
    dataIndex: 'price',
    key: 'price',
  },
  {
    title: 'Created At',
    key: 'created_at',
    dataIndex: 'created_at',
  },
  {
    title: 'Company',
    key: 'company',
    dataIndex: 'company',
  },
  {
    title: 'Manager',
    key: 'manager',
    dataIndex: 'manager',
  },
  {
    title: 'Status',
    key: 'pipeline',
    dataIndex: 'pipeline',
  },
]

const fetchData = async () => {
  try {
    isLoading.value = true
    const response = await axiosClient.get('/leads')
    isLoading.value = false
    console.log(response.data)
    data.value = response.data
  } catch (error) {
    isLoading.value = false
    console.log(error)
  }
}

const fetchSearchTerm = async (searthTerm: string) => {
  try {
    isLoading.value = true
    const response = await axiosClient.get(`/leads/${searthTerm}`)
    isLoading.value = false
    console.log(response.data)
    data.value = response.data
  } catch (error) {
    isLoading.value = false
    console.log(error)
  }
}

onMounted(() => {
  //fetchData()
})
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
    <Table
      :columns="columns"
      :data-source="data"
      :loading="isLoading"
      :expand-column-width="100"
    >
      <template #expandedRowRender="{ record }">
        <p>
          {{ record.contacts }}
        </p>
      </template>
    </Table>
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
</style>
