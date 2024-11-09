<script setup>
import Pagination from "@/components/Pagination.vue";
import { useProductStore } from "@/stores/products";
import { computed, onMounted } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const productsStore = useProductStore();

onMounted(async () => {
	try {
		await productsStore.getAllProducts();
	} catch (error) {
		alert("Failed to load products: " + error.message);
	}
});

const products = computed(() => productsStore.products.data);
const links = computed(() => productsStore.products.links);

async function handlePageChange(page) {
	await productsStore.getPage(page);
}

async function handleEdit(productId) {
	// Navigate to edit page
	router.push({ name: "product-edit", params: { uuid: productId } });
}

async function handleDelete(product) {
	if (confirm(`Are you sure you want to delete "${product.name}"?`)) {
		try {
			await productsStore.deleteProduct(product);
			// Optional: tampilkan notifikasi sukses
			alert("Product deleted successfully");
		} catch (error) {
			alert("Failed to delete product: " + error.message);
		}
	}
}
</script>

<template>
	<main>
		<div class="flex items-center justify-between">
			<h1 class="title">Latest Product</h1>

			<RouterLink
				:to="{ name: 'product-create' }"
				class="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600 transition-colors text-sm"
				>Create New Product</RouterLink
			>
		</div>

		<div class="overflow-x-auto">
			<table class="min-w-full divide-y divide-gray-200">
				<thead class="bg-gray-50">
					<tr>
						<th
							class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
						>
							Name
						</th>
						<th
							class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
						>
							Stock
						</th>
						<th
							class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
						>
							Number of Sales
						</th>
						<th
							class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
						>
							Transaction Date
						</th>
						<th
							class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
						>
							Type
						</th>
						<th
							class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
						>
							Action
						</th>
					</tr>
				</thead>
				<tbody class="bg-white divide-y divide-gray-200">
					<tr v-for="product in products" :key="product.id">
						<td class="px-6 py-4 whitespace-nowrap">{{ product.name }}</td>
						<td class="px-6 py-4 whitespace-nowrap">{{ product.stock }}</td>
						<td class="px-6 py-4 whitespace-nowrap">
							{{ product.number_of_sales }}
						</td>
						<td class="px-6 py-4 whitespace-nowrap">
							{{ product.transaction_date }}
						</td>
						<td class="px-6 py-4 whitespace-nowrap">{{ product.type }}</td>
						<td class="px-6 py-4 whitespace-nowrap">
							<div class="flex space-x-2">
								<button
									@click="handleEdit(product.uuid)"
									class="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600 transition-colors text-sm"
								>
									Edit
								</button>
								<button
									@click="handleDelete(product)"
									class="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition-colors text-sm"
									:disabled="productsStore.isLoading"
								>
									{{ productsStore.isLoading ? "Deleting..." : "Delete" }}
								</button>
							</div>
						</td>
					</tr>
				</tbody>
			</table>
		</div>

		<Pagination :links="links" :onPageChange="handlePageChange" />
	</main>
</template>
