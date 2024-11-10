<script setup>
import { onMounted } from "vue";
import { useSalesStore } from "@/stores/sales";
import { storeToRefs } from "pinia";

const salesStore = useSalesStore();
const { salesComparison, formattedTrendData, isLoading } =
	storeToRefs(salesStore);

onMounted(async () => {
	await salesStore.fetchSalesData();
});
</script>

<template>
	<main class="p-4">
		<h1 class="text-2xl font-bold mb-6">Sales Dashboard</h1>

		<!-- Loading State -->
		<div v-if="isLoading" class="text-center py-4">Loading sales data...</div>

		<div v-else class="grid grid-cols-1 md:grid-cols-2 gap-6">
			<!-- Sales Comparison Section -->
			<section class="bg-white p-4 rounded-lg shadow">
				<h2 class="text-xl font-semibold mb-4">Sales Comparison</h2>
				<div v-for="item in salesComparison" :key="item.type" class="mb-4">
					<h3 class="font-medium text-lg">{{ item.type }}</h3>
					<div class="grid grid-cols-2 gap-4 mt-2">
						<div class="bg-gray-50 p-3 rounded">
							<p class="text-sm text-gray-600">Total Products</p>
							<p class="font-bold">{{ item.total_products }}</p>
						</div>
						<div class="bg-gray-50 p-3 rounded">
							<p class="text-sm text-gray-600">Total Sales</p>
							<p class="font-bold">{{ item.total_sales }}</p>
						</div>
						<div class="bg-gray-50 p-3 rounded">
							<p class="text-sm text-gray-600">Average Sales</p>
							<p class="font-bold">{{ item.average_sales }}</p>
						</div>
						<div class="bg-gray-50 p-3 rounded">
							<p class="text-sm text-gray-600">Highest Sales</p>
							<p class="font-bold">{{ item.highest_sales.value }}</p>
							<p class="text-sm">{{ item.highest_sales.product.name }}</p>
						</div>
					</div>
				</div>
			</section>

			<!-- Sales Trend Section -->
			<section class="bg-white p-4 rounded-lg shadow">
				<h2 class="text-xl font-semibold mb-4">Sales Trend</h2>
				<div class="overflow-x-auto">
					<table class="min-w-full">
						<thead>
							<tr>
								<th class="px-4 py-2">Date</th>
								<th
									v-for="type in Object.keys(
										formattedTrendData[0] || {}
									).filter((k) => k !== 'date')"
									:key="type"
									class="px-4 py-2"
								>
									{{ type }}
								</th>
							</tr>
						</thead>
						<tbody>
							<tr v-for="data in formattedTrendData" :key="data.date">
								<td class="border px-4 py-2">{{ data.date }}</td>
								<td
									v-for="type in Object.keys(data).filter((k) => k !== 'date')"
									:key="type"
									class="border px-4 py-2"
								>
									{{ data[type] }}
								</td>
							</tr>
						</tbody>
					</table>
				</div>
			</section>

			<!-- Date Range Filter -->
			<section class="col-span-full bg-white p-4 rounded-lg shadow">
				<h2 class="text-xl font-semibold mb-4">Date Filter</h2>
				<div class="flex gap-4">
					<input
						type="date"
						v-model="salesStore.dateRange.startDate"
						class="border rounded px-3 py-2"
					/>
					<input
						type="date"
						v-model="salesStore.dateRange.endDate"
						class="border rounded px-3 py-2"
					/>
					<button
						@click="salesStore.fetchSalesData()"
						class="bg-blue-500 text-white px-4 py-2 rounded"
					>
						Apply Filter
					</button>
					<button
						@click="salesStore.resetDateRange()"
						class="bg-gray-500 text-white px-4 py-2 rounded"
					>
						Reset
					</button>
				</div>
			</section>
		</div>
	</main>
</template>

<style scoped>
/* Add any component-specific styles here */
</style>
