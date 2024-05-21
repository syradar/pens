/**
 * @typedef {Object} MockedData
 * @property {string} category - The category of the data item.
 * @property {string} linkText - The text for the link.
 * @property {string} linkUrl - The URL for the link.
 */

import { Result } from "./lib/result";
import { getTemplateRenderer } from "./lib/template";

/**
 * Returns an array of mocked data.
 * @returns {MockedData[]} The array of mocked data.
 */
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

/**
 * Simulates an API call to fetch data.
 * @returns {Promise<{json: () => Promise<{Items: MockedData[]}>}>} The response object containing a JSON method.
 */
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

/**
 * Fetches and displays the search results using the provided template renderer.
 * @param {(data: MockedData[]) => void} templateRenderer - The template renderer to use for displaying results.
 */
async function fetchAndDisplayResults(templateRenderer) {
  try {
    const response = await fetchContrived();
    const data = await response.json();
    templateRenderer(data.Items);
  } catch (error) {
    console.error("Error fetching search results:", error);
  }
}

/**
 * Initializes the application by setting up the template renderer and fetching the initial data.
 */
async function initApp() {
  const resultsContainer = document.getElementById("results-container");

  const templateRenderer = getTemplateRenderer({
    // Selector to the template element
    template: "#result-template",
    // Where we add the template children
    containerEl: resultsContainer,
    // Function of dataSetTemplate items and attribute map to pull out from the json data
    config: (data) => ({
      category: { textContent: data.category },
      link: { textContent: data.linkText, href: data.linkUrl, class: "link" },
    }),
    debug: false,
  });

  if (templateRenderer.err) {
    return Result.err(templateRenderer);
  }

  await fetchAndDisplayResults(templateRenderer.value);
  return Result.ok(true);
}

// Call the function to fetch and display results when the page loads
document.addEventListener("DOMContentLoaded", initApp);
