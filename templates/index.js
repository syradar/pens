import { getTemplateRenderer } from "./template.js";

function getMockData() {
	return [
		{
			category: "Technology",
			linkText: "Learn JavaScript",
			linkUrl: "https://example.com/learn-js",
		},
		{
			category: "Health",
			linkText: "Fitness Tips",
			linkUrl: "https://example.com/fitness-tips",
		},
		{
			category: "Finance",
			linkText: "Investing 101",
			linkUrl: "https://example.com/investing-101",
		},
		{
			category: "Education",
			linkText: "Online Courses",
			linkUrl: "https://example.com/online-courses",
		},
		{
			category: "Entertainment",
			linkText: "Movie Reviews",
			linkUrl: "https://example.com/movie-reviews",
		},
		{
			category: "Travel",
			linkText: "Top Destinations",
			linkUrl: "https://example.com/top-destinations",
		},
	];
}

async function fetchContrived() {
	// Faked roundtrip delay
	await new Promise((resolve) => setTimeout(resolve, 200));

	return Promise.resolve({
		async json() {
			return {
				Items: getMockData(),
			};
		},
	});
}

async function fetchAndDisplayResults(templateRenderer) {
	try {
		const response = await fetchContrived();
		const data = await response.json();
		templateRenderer(data.Items);
	} catch (error) {
		console.error("Error fetching search results:", error);
	}
}

async function initApp() {
	const resultsContainer = document.getElementById("results-container");

	const templateRenderer = getTemplateRenderer({
		// Selector to the template element
		template: "#result-template",
		// Where we add the template children
		$container: resultsContainer,
		// Function of dataSetTemplate items and attribute map to pull out from the json data
		config: (data) => ({
			category: { textContent: data.category },
			link: { textContent: data.linkText, href: data.linkUrl, class: "link" },
		}),
		debug: true,
	});

	await fetchAndDisplayResults(templateRenderer);
}

// Call the function to fetch and display results when the page loads
document.addEventListener("DOMContentLoaded", initApp);
