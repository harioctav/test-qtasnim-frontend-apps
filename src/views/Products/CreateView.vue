<script setup>
import { useProductStore } from "@/stores/products";
import { storeToRefs } from "pinia";
import { reactive } from "vue";

const { errors } = storeToRefs(useProductStore());
const { createProduct } = useProductStore();

const formData = reactive({
	name: "",
	stock: null,
	number_of_sales: null,
	transaction_date: "",
	type: "",
});
</script>

<template>
	<main>
		<h1 class="title">Create New Product</h1>

		<form
			@submit.prevent="createProduct(formData)"
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

			<button class="primary-btn">Create New Data</button>
		</form>
	</main>
</template>
