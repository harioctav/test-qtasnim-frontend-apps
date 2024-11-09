<script setup>
import { useProductStore } from "@/stores/products";
import { computed, onMounted } from "vue";

const productsStore = useProductStore();

onMounted(async () => {
	await productsStore.getAllProducts();
});

const products = computed(() => productsStore.products.data);
const links = computed(() => productsStore.products.links);

function getPageFromUrl(url) {
	try {
		if (url) {
			const params = new URLSearchParams(url.split("?")[1]);
			return params.get("page") || 1;
		}
	} catch (error) {
		console.error("Invalid URL:", error);
	}
	return 1;
}

async function gotoPage(page) {
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

		<div class="pagination">
			<nav
				class="isolate inline-flex -space-x-px rounded-md shadow-sm"
				aria-label="Pagination"
			>
				<a
					v-for="link in links"
					:key="link.label"
					:href="link.url"
					v-html="link.label"
					:class="[
						'relative inline-flex items-center px-4 py-2 text-sm font-semibold',
						link.active
							? 'z-10 bg-indigo-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
							: 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline-offset-0',
					]"
					@click.prevent="gotoPage(getPageFromUrl(link.url))"
				></a>
			</nav>
		</div>
	</main>
</template>

<style scoped>
.pagination {
	display: flex;
	justify-content: center;
	margin-top: 1rem;
}
</style>
