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
			sortField: "created_at",
			sortOrder: "desc",
			searchTerm: "",
			dateRange: {
				startDate: "",
				endDate: "",
			},
		};
	},
	actions: {
		async getAllProducts(page = 1) {
			try {
				this.isLoading = true;
				const searchParams = new URLSearchParams({
					page: page,
					sort_field: this.sortField,
					sort_order: this.sortOrder,
				});

				if (this.searchTerm) {
					searchParams.append("search", this.searchTerm);
				}

				if (this.dateRange.startDate) {
					searchParams.append("start_date", this.dateRange.startDate);
				}
				if (this.dateRange.endDate) {
					searchParams.append("end_date", this.dateRange.endDate);
				}

				const response = await fetch(
					`/api/products?${searchParams.toString()}`,
					{
						headers: {
							Authorization: `Bearer ${localStorage.getItem("token")}`,
						},
					}
				);
				const data = await response.json();
				this.products = data.products;
				return this.products.data;
			} catch (error) {
				console.error("Error fetching products:", error);
				throw error;
			} finally {
				this.isLoading = false;
			}
		},

		async updateDateRange(startDate, endDate) {
			this.dateRange.startDate = startDate;
			this.dateRange.endDate = endDate;
			await this.getAllProducts(1); // Reset ke halaman pertama
		},

		// Reset semua filter
		async resetFilters() {
			this.searchTerm = "";
			this.dateRange.startDate = "";
			this.dateRange.endDate = "";
			this.sortField = "created_at";
			this.sortOrder = "desc";
			await this.getAllProducts(1);
		},

		async updateSearch(term) {
			this.searchTerm = term;
			await this.getAllProducts(1); // Reset ke halaman pertama saat search
		},

		async updateSort(field) {
			// Toggle sort order if same field is clicked
			if (field === this.sortField) {
				this.sortOrder = this.sortOrder === "asc" ? "desc" : "asc";
			} else {
				// New field, default to ascending
				this.sortField = field;
				this.sortOrder = "asc";
			}

			// Reload data with new sorting
			await this.getAllProducts(this.products.current_page);
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
