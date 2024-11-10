const dateFormatter = {
	install: (app) => {
		// Menambahkan global method
		app.config.globalProperties.$dateFormatter = {
			// Format ke standar YYYY-MM-DD
			toStandard(isoDate) {
				if (!isoDate) return "";
				try {
					const date = new Date(isoDate);
					return date.toISOString().split("T")[0];
				} catch (error) {
					console.error("Error formatting date:", error);
					return "";
				}
			},

			// Format ke Indonesia (contoh: 10 November 2023)
			toIndonesian(isoDate) {
				if (!isoDate) return "";
				try {
					const date = new Date(isoDate);
					return date.toLocaleDateString("id-ID", {
						day: "numeric",
						month: "long",
						year: "numeric",
					});
				} catch (error) {
					console.error("Error formatting date:", error);
					return "";
				}
			},

			// Format ke short date (contoh: 10 Nov 2023)
			toShortDate(isoDate) {
				if (!isoDate) return "";
				try {
					const date = new Date(isoDate);
					return date.toLocaleDateString("id-ID", {
						day: "numeric",
						month: "short",
						year: "numeric",
					});
				} catch (error) {
					console.error("Error formatting date:", error);
					return "";
				}
			},

			// Format custom dengan pattern
			toCustom(isoDate, pattern = "DD-MM-YYYY") {
				if (!isoDate) return "";
				try {
					const date = new Date(isoDate);
					const day = String(date.getDate()).padStart(2, "0");
					const month = String(date.getMonth() + 1).padStart(2, "0");
					const year = date.getFullYear();

					const patterns = {
						DD: day,
						MM: month,
						YYYY: year,
						YY: String(year).slice(-2),
					};

					return pattern.replace(
						/(DD|MM|YYYY|YY)/g,
						(match) => patterns[match]
					);
				} catch (error) {
					console.error("Error formatting date:", error);
					return "";
				}
			},
		};
	},
};

export default dateFormatter;
