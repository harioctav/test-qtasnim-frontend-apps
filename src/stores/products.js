import { defineStore } from "pinia";

export const useProductStore = defineStore("productStore", {
	state: () => {
		return {
			products: {
				current_page: 1,
				data: [],
				first_page_url: "",
				from: 1,
				last_page: 1,
				last_page_url: "",
				links: [],
				next_page_url: "",
				path: "",
				per_page: 5,
				prev_page_url: null,
				to: 5,
				total: 0,
			},
			errors: {},
			isLoading: false,
		};
	},
	actions: {
		// get All Products
		async getAllProducts(page = 1) {
			const response = await fetch(`/api/products?page=${page}`, {
				headers: {
					Authorization: `Bearer ${localStorage.getItem("token")}`,
				},
			});
			const data = await response.json();
			this.products = data.products;

			return this.products.data;
		},

		async getPage(page) {
			await this.getAllProducts(page);
		},

		// Get a Product
		async getProduct(product) {
			const response = await fetch(`/api/products/${product}`, {
				headers: {
					Authorization: `Bearer ${localStorage.getItem("token")}`,
				},
			});
			const data = await response.json();

			return data.product;
		},

		// Create Product
		async createProduct(formData) {
			const response = await fetch("/api/products", {
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
				this.router.push({ name: "products" });
				this.errors = {};
			}
		},

		// Update Product
		async updateProduct(product, formData) {
			const response = await fetch(`/api/products/${product.uuid}`, {
				method: "put",
				headers: {
					Authorization: `Bearer ${localStorage.getItem("token")}`,
				},
				body: JSON.stringify(formData),
			});

			const data = await response.json();

			if (data.errors) {
				this.errors = data.errors;
			} else {
				this.router.push({ name: "products" });
				this.errors = {};
			}
		},

		// Delete Product
		async deleteProduct(product) {
			try {
				this.isLoading = true;
				const response = await fetch(`/api/products/${product.uuid}`, {
					method: "delete",
					headers: {
						Authorization: `Bearer ${localStorage.getItem("token")}`,
					},
				});

				if (!response.ok) {
					throw new Error("Failed to delete product");
				}

				// Refresh the products list after successful deletion
				await this.getAllProducts(this.products.current_page);

				return true;
			} catch (error) {
				console.error("Error deleting product:", error);
				throw error;
			} finally {
				this.isLoading = false;
			}
		},
	},
});
