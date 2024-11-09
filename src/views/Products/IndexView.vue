<script setup>
import Pagination from "@/components/Pagination.vue";
import { useProductStore } from "@/stores/products";
import { computed, onMounted, ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const productsStore = useProductStore();
const searchInput = ref("");
const searchTimeout = ref(null);

onMounted(async () => {
	try {
		await productsStore.getAllProducts();
	} catch (error) {
		alert("Failed to load products: " + error.message);
	}
});

const products = computed(() => productsStore.products.data);
const links = computed(() => productsStore.products.links);
const currentSort = computed(() => productsStore.sortField);
const currentSortOrder = computed(() => productsStore.sortOrder);
const isLoading = computed(() => productsStore.isLoading);

// Fungsi helper untuk menampilkan ikon sort
function getSortIcon(field) {
	if (currentSort.value !== field) return "↕️";
	return currentSortOrder.value === "asc" ? "↑" : "↓";
}

// Fungsi untuk debounce search
function handleSearch(event) {
	if (searchTimeout.value) {
		clearTimeout(searchTimeout.value);
	}

	searchTimeout.value = setTimeout(async () => {
		try {
			await productsStore.updateSearch(event.target.value);
		} catch (error) {
			alert("Search failed: " + error.message);
		}
	}, 300); // Delay 300ms
}

async function handleSort(field) {
	await productsStore.updateSort(field);
}

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

		<!-- Search Section -->
		<div class="mb-6">
			<div class="flex items-center space-x-4">
				<div class="flex-1">
					<input
						type="text"
						v-model="searchInput"
						@input="handleSearch"
						placeholder="Search by name or stock..."
						class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
					/>
				</div>

				<!-- Loading indicator -->
				<div v-if="isLoading" class="text-gray-500">Searching...</div>
			</div>
		</div>

		<!-- No results message -->
		<div v-if="products.length === 0" class="text-center py-8 text-gray-500">
			No products found.
		</div>

		<div v-else class="overflow-x-auto">
			<table class="min-w-full divide-y divide-gray-200">
				<thead class="bg-gray-50">
					<tr>
						<th
							class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer select-none"
							@click="handleSort('name')"
						>
							<div class="flex items-center space-x-1">
								<span>Name</span>
								<span class="text-gray-400">{{ getSortIcon("name") }}</span>
							</div>
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
							class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer select-none hover:bg-gray-100"
							@click="handleSort('transaction_date')"
						>
							<div class="flex items-center space-x-1">
								<span>Transaction Date</span>
								<span class="text-gray-400">{{
									getSortIcon("transaction_date")
								}}</span>
							</div>
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
<style scoped>
.cursor-pointer {
	cursor: pointer;
}

.select-none {
	user-select: none;
}

th[class*="cursor-pointer"] {
	transition: background-color 0.2s;
}

.search-highlight {
	background-color: yellow;
	padding: 0.1em;
}

/* Optional: Tambahkan animasi loading */
@keyframes pulse {
	0%,
	100% {
		opacity: 1;
	}
	50% {
		opacity: 0.5;
	}
}

.animate-pulse {
	animation: pulse 1.5s ease-in-out infinite;
}
</style>
