# Template Renderer 📜✨

## Overview 🌟

This template renderer is designed to facilitate efficient and dynamic rendering of HTML templates. It uses JavaScript to clone HTML template elements, populate them with data, and inject them into a specified container. This approach is particularly useful for dynamically generating HTML content based on data, such as displaying lists of items, creating repetitive sections, or rendering complex UIs with reusable templates.

## How to Use 🚀

### Installation 🔧

1. **Include the JavaScript file in your project:**

   Ensure the script is included in your HTML file or bundled using your preferred JavaScript bundler.

   ```html
   <script src="path/to/template.js"></script>
   ```

### Usage 📝

1. **Define an HTML template:**

   ```html
   <template id="item-template">
     <div>
       <h3 data-template="title"></h3>
       <p data-template="description"></p>
       <a data-template="link">Read more</a>
     </div>
   </template>
   ```

2. **Prepare a container for the rendered content:**

   ```html
   <div id="results-container"></div>
   ```

3. **Initialize the template renderer in your JavaScript file:**

   ```javascript
   import { getTemplateRenderer } from "path/to/template-renderer.js"

   document.addEventListener("DOMContentLoaded", () => {
     const resultsContainer = document.getElementById("results-container")

     const templateRenderer = getTemplateRenderer({
       template: "#item-template",
       $container: resultsContainer,
       config: (data) => ({
         title: { textContent: data.title },
         description: { textContent: data.description },
         link: { textContent: "Read more", href: data.linkUrl },
       }),
     })

     // Example data
     const data = [
       { title: "Item 1", description: "Description 1", linkUrl: "/item1" },
       { title: "Item 2", description: "Description 2", linkUrl: "/item2" },
     ]

     templateRenderer(data)
   })
   ```

## Options ⚙️

### `getTemplateRenderer` Function Options

The `getTemplateRenderer` function accepts an options object with the following properties:

- **`template` (string)**: The CSS selector for the template element. This is the ID or class of the `<template>` element that you want to use for rendering.

- **`$container` (HTMLElement)**: The container element where the rendered content will be inserted. This should be a valid DOM element.

- **`config` (function)**: A function that takes a data item as an argument and returns an object mapping template elements to their attributes and values. The keys of the returned object should correspond to the `data-template` attributes in the template, and the values should be objects with attribute-value pairs to set on the corresponding elements.

  **Example:**

  ```javascript
  config: (data) => ({
    title: { textContent: data.title },
    description: { textContent: data.description },
    link: { textContent: "Read more", href: data.linkUrl },
  })
  ```

- **`debug` (boolean, optional)**: A boolean flag to enable performance debugging. When set to `true`, the function logs performance metrics related to template rendering.

## What It's Good For ✅

- **Dynamic Content Rendering:** Efficiently renders lists or repetitive sections based on data.
- **Reusability:** Enables the use of the same template for different data sets.
- **Maintainability:** Keeps HTML structure separate from JavaScript logic, making code easier to manage.
- **Performance:** Uses `DocumentFragment` for batch updates, improving rendering performance.

## What It's Not Good For ❌

- **Single Use Components:** If your component does not need to be reused or dynamically generated, simpler methods like directly manipulating the DOM or using innerHTML may be more appropriate.
- **Complex State Management:** For applications requiring extensive state management, consider using a front-end framework like React, Vue, or Angular.
- **Server-Side Rendering (SSR):** This solution is for client-side rendering. For SSR, look into frameworks like Next.js (for React) or Nuxt.js (for Vue).

## Alternatives 🔄

- **Direct DOM Manipulation:** For very simple tasks, manually updating the DOM might be more straightforward.
- **Front-End Frameworks:** For complex applications with extensive state management, use frameworks like React, Vue, or Angular.
- **Template Engines:** For server-side template rendering, consider using engines like EJS, Handlebars, or Pug.
