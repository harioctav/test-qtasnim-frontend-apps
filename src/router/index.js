import { createRouter, createWebHistory } from "vue-router";
import HomeView from "@/views/HomeView.vue";
import RegisterView from "@/views/Auth/RegisterView.vue";
import LoginView from "@/views/Auth/LoginView.vue";
import { useAuthStore } from "@/stores/auth";
import IndexView from "@/views/Products/IndexView.vue";
import CreateView from "@/views/Products/CreateView.vue";
import EditView from "@/views/Products/EditView.vue";
import SalesView from "@/views/Sales/IndexView.vue";

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: [
		{
			path: "/",
			name: "home",
			component: HomeView,
		},
		{
			path: "/register",
			name: "register",
			component: RegisterView,
			meta: { guest: true },
		},
		{
			path: "/login",
			name: "login",
			component: LoginView,
			meta: { guest: true },
		},
		{
			path: "/products",
			name: "products",
			component: IndexView,
			meta: { auth: true },
		},
		{
			path: "/products/create",
			name: "product-create",
			component: CreateView,
			meta: { auth: true },
		},
		{
			path: "/products/:uuid/edit",
			name: "product-edit",
			component: EditView,
			meta: { auth: true },
		},
		{
			path: "/sales",
			name: "sales",
			component: SalesView,
			meta: { auth: true },
		},
	],
});

router.beforeEach(async (to, from) => {
	const authStore = useAuthStore();
	await authStore.getUser();

	if (authStore.user && to.meta.guest) {
		return { name: "home" };
	}

	if (!authStore.user && to.meta.auth) {
		return { name: "login" };
	}
});

export default router;
