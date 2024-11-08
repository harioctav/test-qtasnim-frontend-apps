import { defineStore } from "pinia";

export const useAuthStore = defineStore("authStore", {
	state: () => {
		return {
			user: null,
			errors: {},
		};
	},
	actions: {
		// Get Authenticated User
		async getUser() {
			if (localStorage.getItem("token")) {
				const response = await fetch("/api/user", {
					headers: {
						authorization: `Bearer ${localStorage.getItem("token")}`,
					},
				});

				const data = await response.json();

				if (response.ok) {
					this.user = data;
				}
			}
		},

		// Login or Register User
		async authenticate(apiRoute, formData) {
			const res = await fetch(`/api/${apiRoute}`, {
				method: "post",
				body: JSON.stringify(formData),
			});

			const data = await res.json();

			if (data.errors) {
				this.errors = data.errors;
			} else {
				this.errors = {};
				localStorage.setItem("token", data.token);
				this.user = data.user;
				this.router.push({ name: "home" });
			}
		},

		// Logout
		async logout() {
			const response = await fetch("/api/logout", {
				method: "post",
				headers: {
					authorization: `Bearer ${localStorage.getItem("token")}`,
				},
			});

			if (response.ok) {
				this.user = null;
				this.errors = {};
				localStorage.removeItem("token");
				this.router.push({ name: "home" });
			}
		},
	},
});
