<script setup>
import { computed } from "vue";

const props = defineProps({
	// Data pagination dari backend
	links: {
		type: Array,
		required: true,
	},
	// Callback function yang akan dipanggil ketika halaman berubah
	onPageChange: {
		type: Function,
		required: true,
	},
});

// Helper function untuk mendapatkan nomor halaman dari URL
function getPageFromUrl(url) {
	try {
		if (url) {
			const params = new URLSearchParams(url.split("?")[1]);
			return params.get("page") || 1;
		}
	} catch (error) {
		console.error("Invalid URL:", error);
	}
	return 1;
}

// Computed property untuk memfilter link yang valid
const paginationLinks = computed(() => {
	return props.links.filter((link) => link.url || link.active);
});
</script>

<template>
	<div class="pagination">
		<nav
			class="isolate inline-flex -space-x-px rounded-md shadow-sm"
			aria-label="Pagination"
		>
			<a
				v-for="link in paginationLinks"
				:key="link.label"
				href="#"
				v-html="link.label"
				:class="[
					'relative inline-flex items-center px-4 py-2 text-sm font-semibold',
					link.active
						? 'z-10 bg-indigo-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
						: 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline-offset-0',
					!link.url ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
				]"
				@click.prevent="link.url && onPageChange(getPageFromUrl(link.url))"
			></a>
		</nav>
	</div>
</template>

<style scoped>
.pagination {
	display: flex;
	justify-content: center;
	margin-top: 1rem;
}
</style>
