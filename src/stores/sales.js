import { defineStore } from "pinia";

export const useSalesStore = defineStore("salesStore", {
	state: () => ({
		salesComparison: [],
		salesTrend: {},
		dateRange: {
			startDate: "",
			endDate: "",
		},
		isLoading: false,
		errors: {},
	}),

	actions: {
		async fetchSalesData() {
			try {
				this.isLoading = true;
				const params = new URLSearchParams();

				if (this.dateRange.startDate && this.dateRange.endDate) {
					params.append("start_date", this.dateRange.startDate);
					params.append("end_date", this.dateRange.endDate);
				}

				const [comparisonResponse, trendResponse] = await Promise.all([
					fetch(`/api/products/sales-comparison?${params}`, {
						headers: {
							Authorization: `Bearer ${localStorage.getItem("token")}`,
						},
					}),
					fetch(`/api/products/sales-trend?${params}`, {
						headers: {
							Authorization: `Bearer ${localStorage.getItem("token")}`,
						},
					}),
				]);

				const comparisonData = await comparisonResponse.json();
				const trendData = await trendResponse.json();

				this.salesComparison = comparisonData.sales_comparison;
				this.salesTrend = trendData.sales_trend;
			} catch (error) {
				console.error("Error fetching sales data:", error);
				this.errors = error;
			} finally {
				this.isLoading = false;
			}
		},

		async updateDateRange(startDate, endDate) {
			this.dateRange.startDate = startDate;
			this.dateRange.endDate = endDate;
			await this.fetchSalesData();
		},

		resetDateRange() {
			this.dateRange.startDate = "";
			this.dateRange.endDate = "";
			this.fetchSalesData();
		},
	},

	getters: {
		formattedTrendData: (state) => {
			if (!state.salesTrend || Object.keys(state.salesTrend).length === 0) {
				return [];
			}

			const allDates = new Set();
			Object.values(state.salesTrend).forEach((data) => {
				data.forEach((item) => allDates.add(item.date));
			});

			return Array.from(allDates)
				.sort()
				.map((date) => {
					const dataPoint = { date };
					Object.entries(state.salesTrend).forEach(([type, data]) => {
						const salesForDate = data.find((item) => item.date === date);
						dataPoint[type] = salesForDate ? parseInt(salesForDate.sales) : 0;
					});
					return dataPoint;
				});
		},
	},
});
