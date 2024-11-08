<script setup>
import { useCategoriesStore } from "@/stores/categories";
import { storeToRefs } from "pinia";
import { reactive } from "vue";

const { errors } = storeToRefs(useCategoriesStore());
const { createCategory } = useCategoriesStore();

const formData = reactive({
	name: "",
});
</script>

<template>
	<main>
		<h1 class="title">Create a New Category</h1>

		<form
			@submit.prevent="createCategory(formData)"
			class="w-1/2 mx-auto space-y-6"
		>
			<div>
				<input
					type="text"
					placeholder="Category Name"
					v-model="formData.name"
				/>
				<p v-if="errors.name" class="error">{{ errors.name[0] }}</p>
			</div>

			<button class="primary-btn">Create New Data</button>
		</form>
	</main>
</template>
