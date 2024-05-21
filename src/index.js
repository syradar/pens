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
function getMockData(query) {
  return [
    {
      category: "Technology",
      linkText: `Learn JavaScript ${query}`,
      linkUrl: "https://example.com/learn-js",
    },
    {
      category: "Health",
      linkText: `Fitness Tips ${query}`,
      linkUrl: "https://example.com/fitness-tips",
    },
    {
      category: "Finance",
      linkText: `Investing 101 ${query}`,
      linkUrl: "https://example.com/investing-101",
    },
    {
      category: "Education",
      linkText: `Online Courses ${query}`,
      linkUrl: "https://example.com/online-courses",
    },
    {
      category: "Entertainment",
      linkText: `Movie Reviews ${query}`,
      linkUrl: "https://example.com/movie-reviews",
    },
    {
      category: "Travel",
      linkText: `Top Destinations ${query}`,
      linkUrl: "https://example.com/top-destinations",
    },
  ];
}

/**
 * Simulates an API call to fetch data.
 * @returns {Promise<{json: () => Promise<{Items: MockedData[]}>}>} The response object containing a JSON method.
 */
async function fetchContrived(query) {
  // Faked roundtrip delay
  await new Promise((resolve) => setTimeout(resolve, 200));

  return Promise.resolve({
    async json() {
      return {
        Items: getMockData(query),
      };
    },
  });
}

/**
 * Initializes the application by setting up the template renderer and fetching the initial data.
 */
async function initApp() {
  const sry = document.querySelector("sry-header");

  sry.addEventListener(SryHeader.EVENTS.READY, () => {
    sry.dispatchEvent(
      new CustomEvent(SryHeader.EVENTS.SEARCH, {
        detail: {
          query: "you da man",
        },
      }),
    );
  });

  sry.addEventListener(SryHeader.EVENTS.RESULTS, (data) => {
    console.log("caught the data");
    console.log(data.detail.data);
  });

  // dispatchEvent(
  //   new CustomEvent(SryHeader.EVENTS.SEARCH, {
  //     detail: {
  //       query: "you da man",
  //     },
  //   }),
  // );

  console.log("defined sry-header");
  customElements.define("sry-header", SryHeader);
  // Define the custom element
}

// Call the function to fetch and display results when the page loads
document.addEventListener("DOMContentLoaded", initApp);

class SryHeader extends HTMLElement {
  constructor() {
    super();
    // Attach a shadow DOM tree to the instance.
    // this.attachShadow({ mode: "open" });

    // // Create the header element
    // const header = document.createElement("header");
    // header.textContent = "Default Header Text";

    // // Apply some styles
    // const style = document.createElement("style");
    // style.textContent = `
    //   header {
    //     background-color: #f8f9fa;
    //     color: #343a40;
    //     padding: 1rem;
    //     text-align: center;
    //     font-size: 1.5rem;
    //     border-bottom: 1px solid #dee2e6;
    //   }
    // `;

    // Append the header and styles to the shadow root
    // this.shadowRoot.append(style, header);
  }

  static EVENTS = Object.freeze({
    SEARCH: "SryHeader:Search",
    READY: "SryHeader:Ready",
    RESULTS: "SryHeader:Results",
  });

  // // Observe attributes to reflect changes
  static get observedAttributes() {
    return ["text"];
  }

  // Called when the element is inserted into the DOM
  async connectedCallback() {
    console.log("SryHeader element added to page.");
    // if (this.hasAttribute("text")) {
    //   this.updateHeaderText();
    // }

    const children = this.querySelectorAll("*");
    console.log("children", children);

    const resultsContainer = this.querySelector("#results-container");

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

    this.addEventListener(SryHeader.EVENTS.SEARCH, (e) => {
      this.onSearchHandler(e, templateRenderer);
    });

    // this.addEventListener(SryHeader.EVENTS.READY, (e) => {
    //   console.log("onready", e);
    // });
    // console.log("onready");
    this.emit(SryHeader.EVENTS.READY);
  }
  /**
   * Emit a custom event
   * @param  {String} type   The event type
   * @param  {Object} detail Any details to pass along with the event
   */
  emit(type, detail = {}) {
    // Create a new event
    const event = new CustomEvent(type, {
      bubbles: true,
      cancelable: true,
      detail: detail,
    });

    // Dispatch the event
    return this.dispatchEvent(event);
  }

  async onSearchHandler(e, templateRenderer) {
    console.log("each", e, templateRenderer);

    const query = e.detail.query;

    if (templateRenderer.err) {
      return Result.err(templateRenderer);
    }

    await this.fetchAndDisplayResults(templateRenderer.value, query);
    return Result.ok(true);
  }

  // Called when the element is removed from the DOM
  disconnectedCallback() {
    console.log("SryHeader element removed from page.");
  }

  // Called when observed attribute values change
  attributeChangedCallback(name, oldValue, newValue) {
    console.log("label", name, oldValue, newValue);

    // if (name === "text" && oldValue !== newValue) {
    //   this.updateHeaderText();
    // }
  }

  // // Custom method to update the header text
  // updateHeaderText() {
  //   const header = this.shadowRoot.querySelector("header");
  //   if (header) {
  //     header.textContent = this.getAttribute("text");
  //   }
  // }

  /**
   * Fetches and displays the search results using the provided template renderer.
   * @param {(data: MockedData[]) => void} templateRenderer - The template renderer to use for displaying results.
   */
  async fetchAndDisplayResults(templateRenderer, query) {
    try {
      const response = await fetchContrived(query);
      const data = await response.json();
      templateRenderer(data.Items);
      this.dispatchEvent(
        new CustomEvent(SryHeader.EVENTS.RESULTS, {
          bubbles: true,
          composed: true,
          detail: {
            data: data.Items,
          },
        }),
      );
    } catch (error) {
      console.error("Error fetching search results:", error);
    }
  }
}
