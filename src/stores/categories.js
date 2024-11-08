import { defineStore } from "pinia";

export const useCategoriesStore = defineStore("categoriesStore", {
	state: () => {
		return {
			errors: {},
		};
	},
	actions: {
		// Create Category
		async createCategory(formData) {
			const response = await fetch("/api/categories", {
				method: "post",
				headers: {
					Authorization: `Bearer ${localStorage.getItem("token")}`,
				},
				body: JSON.stringify(formData),
			});

			const data = await response.json();

			if (data.errors) {
				this.errors = data.errors;
			} else {
				this.router.push({ name: "home" });
				this.errors = {};
			}
		},
	},
});
