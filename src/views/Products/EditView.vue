<script setup>
import { useProductStore } from "@/stores/products";
import { storeToRefs } from "pinia";
import { onMounted, reactive, ref } from "vue";
import { useRoute, useRouter } from "vue-router";

const router = useRouter();
const route = useRoute();

const { errors } = storeToRefs(useProductStore());
const { getProduct, updateProduct } = useProductStore();

const product = ref(null);

const formData = reactive({
	name: "",
	stock: null,
	number_of_sales: null,
	transaction_date: "",
	type: "",
});

// Fungsi untuk memformat tanggal dari ISO ke format yyyy-MM-dd
function formatDate(isoDate) {
	if (!isoDate) return "";
	try {
		const date = new Date(isoDate);
		return date.toISOString().split("T")[0];
	} catch (error) {
		console.error("Error formatting date:", error);
		return "";
	}
}

onMounted(async () => {
	try {
		product.value = await getProduct(route.params.uuid);

		// Mengisi form data dengan nilai yang sudah diformat
		formData.name = product.value.name;
		formData.stock = product.value.stock;
		formData.number_of_sales = product.value.number_of_sales;
		formData.transaction_date = formatDate(product.value.transaction_date);
		formData.type = product.value.type;
	} catch (error) {
		console.error("Error fetching product:", error);
	}
});
</script>

<template>
	<main>
		<h1 class="title">Edit Product Page</h1>

		<form
			@submit.prevent="updateProduct(product, formData)"
			class="w-1/2 mx-auto space-y-6"
		>
			<div>
				<input type="text" placeholder="Name" v-model="formData.name" />
				<p v-if="errors.name" class="error">{{ errors.name[0] }}</p>
			</div>

			<div>
				<input type="number" placeholder="Stock" v-model="formData.stock" />
				<p v-if="errors.stock" class="error">{{ errors.stock[0] }}</p>
			</div>

			<div>
				<input
					type="number"
					placeholder="Number of Sales"
					v-model="formData.number_of_sales"
				/>
				<p v-if="errors.number_of_sales" class="error">
					{{ errors.number_of_sales[0] }}
				</p>
			</div>

			<div>
				<input
					type="date"
					placeholder="Transaction Date"
					v-model="formData.transaction_date"
				/>
				<p v-if="errors.transaction_date" class="error">
					{{ errors.transaction_date[0] }}
				</p>
			</div>

			<div>
				<input type="text" placeholder="Type" v-model="formData.type" />
				<p v-if="errors.type" class="error">{{ errors.type[0] }}</p>
			</div>

			<button class="primary-btn">Update Data</button>
		</form>
	</main>
</template>
