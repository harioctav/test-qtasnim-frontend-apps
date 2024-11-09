<script setup>
import Pagination from "@/components/Pagination.vue";
import { useProductStore } from "@/stores/products";
import { computed, onMounted } from "vue";

const productsStore = useProductStore();

onMounted(async () => {
	await productsStore.getAllProducts();
});

const products = computed(() => productsStore.products.data);
const links = computed(() => productsStore.products.links);

async function handlePageChange(page) {
	await productsStore.getPage(page);
}
</script>

<template>
	<main>
		<div class="flex items-center justify-between">
			<h1 class="title">Latest Product</h1>

			<RouterLink :to="{ name: 'product-create' }"
				>Create New Product</RouterLink
			>
		</div>

		<div>
			<table>
				<thead>
					<tr>
						<th>Name</th>
						<th>Stock</th>
						<th>Number of Sales</th>
						<th>Transaction Date</th>
						<th>Type</th>
						<th>Action</th>
					</tr>
				</thead>
				<tbody>
					<tr v-for="product in products" :key="product.id">
						<td>{{ product.name }}</td>
						<td>{{ product.stock }}</td>
						<td>{{ product.number_of_sales }}</td>
						<td>{{ product.transaction_date }}</td>
						<td>{{ product.type }}</td>
						<td>Edit or Delete</td>
					</tr>
				</tbody>
			</table>
		</div>

		<Pagination :links="links" :onPageChange="handlePageChange" />
	</main>
</template>
