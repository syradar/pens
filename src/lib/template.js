/**
 * @typedef {'accept' | 'accept-charset' | 'accesskey' | 'action' | 'align' | 'alt' | 'async' | 'autocomplete' | 'autofocus' | 'autoplay' | 'bgcolor' | 'border' | 'charset' | 'checked' | 'cite' | 'class' | 'color' | 'cols' | 'colspan' | 'content' | 'contenteditable' | 'controls' | 'coords' | 'data' | 'datetime' | 'default' | 'defer' | 'dir' | 'dirname' | 'disabled' | 'download' | 'draggable' | 'dropzone' | 'enctype' | 'for' | 'form' | 'formaction' | 'headers' | 'height' | 'hidden' | 'high' | 'href' | 'hreflang' | 'http-equiv' | 'id' | 'ismap' | 'kind' | 'label' | 'lang' | 'list' | 'loop' | 'low' | 'max' | 'maxlength' | 'media' | 'method' | 'min' | 'multiple' | 'muted' | 'name' | 'novalidate' | 'open' | 'optimum' | 'pattern' | 'placeholder' | 'poster' | 'preload' | 'readonly' | 'rel' | 'required' | 'reversed' | 'rows' | 'rowspan' | 'sandbox' | 'scope' | 'selected' | 'shape' | 'size' | 'sizes' | 'span' | 'spellcheck' | 'src' | 'srcdoc' | 'srclang' | 'srcset' | 'start' | 'step' | 'style' | 'tabindex' | 'target' | 'title' | 'translate' | 'type' | 'usemap' | 'value' | 'width' | 'wrap' | 'textContent'} ValidAttributes
 */

import { Result } from "./result";

/**
 * An array of valid attribute names.
 * @type {ValidAttributes[]}
 */
const validAttributes = [
  "accept",
  "accept-charset",
  "accesskey",
  "action",
  "align",
  "alt",
  "async",
  "autocomplete",
  "autofocus",
  "autoplay",
  "bgcolor",
  "border",
  "charset",
  "checked",
  "cite",
  "class",
  "color",
  "cols",
  "colspan",
  "content",
  "contenteditable",
  "controls",
  "coords",
  "data",
  "datetime",
  "default",
  "defer",
  "dir",
  "dirname",
  "disabled",
  "download",
  "draggable",
  "dropzone",
  "enctype",
  "for",
  "form",
  "formaction",
  "headers",
  "height",
  "hidden",
  "high",
  "href",
  "hreflang",
  "http-equiv",
  "id",
  "ismap",
  "kind",
  "label",
  "lang",
  "list",
  "loop",
  "low",
  "max",
  "maxlength",
  "media",
  "method",
  "min",
  "multiple",
  "muted",
  "name",
  "novalidate",
  "open",
  "optimum",
  "pattern",
  "placeholder",
  "poster",
  "preload",
  "readonly",
  "rel",
  "required",
  "reversed",
  "rows",
  "rowspan",
  "sandbox",
  "scope",
  "selected",
  "shape",
  "size",
  "sizes",
  "span",
  "spellcheck",
  "src",
  "srcdoc",
  "srclang",
  "srcset",
  "start",
  "step",
  "style",
  "tabindex",
  "target",
  "title",
  "translate",
  "type",
  "usemap",
  "value",
  "width",
  "wrap",
  "textContent",
];

/**
 * A set of valid attribute names.
 * @type {Set<ValidAttributes>}
 */
const VALID_ATTRIBUTES = new Set(validAttributes);

/**
 * Validates if the given attribute is valid.
 * @param {string} attr - The attribute to validate.
 * @returns {attr is ValidAttributes} - True if the attribute is valid, false otherwise.
 */
function validateAttribute(attr) {
  // @ts-ignore
  return VALID_ATTRIBUTES.has(attr);
}

/**
 * @typedef {Record<ValidAttributes, string>} DataValues
 * @typedef {Partial<DataValues>} PartialDataValues
 * @typedef {Record<string, PartialDataValues>} ConfigData
 */

/**
 * Updates a clone's attributes based on the provided values.
 * @param {DocumentFragment} clone - The cloned document fragment.
 * @param {PartialDataValues} values - The values to update in the clone.
 * @returns {DocumentFragment} - The updated document fragment.
 */
function updateTemplateValues(clone, values) {
  for (const [key, attributes] of Object.entries(values)) {
    // Find the element with the corresponding class
    const element = clone.querySelector(`[data-template=${key}]`);
    // If the element doesn't exist, continue to the next iteration
    if (!element) continue;

    // Iterate over each attribute-value pair in the attributes object
    for (const [attr, value] of Object.entries(attributes)) {
      if (attr === "textContent") {
        element.textContent = value;
      } else if (validateAttribute(attr)) {
        element.setAttribute(attr, value);
      }
    }

    // Remove the data-template attribute after updating since we don't want
    // the templating to mess with other scripts or styling.
    element.removeAttribute("data-template");
  }

  return clone;
}

/**
 * Retrieves a template element from the DOM.
 * @param {string} selector - The selector for the template element.
 */
function getTemplate(selector) {
  const templateEl = document.querySelector(selector);

  if (!templateEl) {
    return Result.err(new Error(`Could not find: ${selector}`));
  }

  if (!(templateEl instanceof HTMLTemplateElement)) {
    return Result.err(new Error(`${templateEl} is not a Template`));
  }

  return Result.ok(templateEl);
}

/**
 * Clones the content of a given template element.
 * @param {HTMLTemplateElement} templateEl - The template element to clone.
 */
function cloneTemplate(templateEl) {
  const clone = templateEl.content.cloneNode(true);

  if (!(clone instanceof DocumentFragment)) {
    return Result.err(
      new Error(`Template could not be cloned to a DocumentFragment: ${clone}`),
    );
  }

  return Result.ok(clone);
}

/**
 * @template T
 * @typedef {function(T): ConfigData} ConfigFunction<T>
 */

/**
 * @template T
 * @typedef {Object} TemplateRendererOptions<T>
 * @property {string} template - The selector for the template element.
 * @property {HTMLElement | null} containerEl - The container element to render into.
 * @property {ConfigFunction<T>} config - The function to configure the template with data.
 * @property {boolean} debug - Whether to enable debug mode.
 */

/**
 * @template T
 */

/**
 * Returns a function to render a template with provided data.
 * @template T
 * @param {TemplateRendererOptions<T>} options - The options for the template renderer.
 */
export function getTemplateRenderer({ template, containerEl, config, debug }) {
  if (typeof config !== "function") {
    return Result.err(
      new Error(
        `The config should be a function but got ${typeof config} instead.`,
      ),
    );
  }

  if (!(containerEl instanceof HTMLElement)) {
    return Result.err(
      new Error(
        `The containerEl must be a valid HTMLElement but got ${containerEl} instead.`,
      ),
    );
  }

  const templateEl = getTemplate(template);

  if (templateEl.err) {
    return Result.err(templateEl.error);
  }

  /**
   * Renders the template with the provided data.
   * @param {T[]} data - The data to render.
   */
  const renderer = (/** @type {T[]} */ data) => {
    if (debug) {
      performance.mark("templateRenderStart");
    }

    const renderData = Array.isArray(data) ? data : [data];

    if (renderData.length <= 0) {
      return Result.err(new Error("No data provided for rendering"));
    }

    const $fragment = document.createDocumentFragment();

    for (const item of data) {
      const cloneResult = cloneTemplate(templateEl.value);
      if (cloneResult.err) {
        return Result.err(cloneResult.error);
      }
      const values = config(item);
      $fragment.appendChild(updateTemplateValues(cloneResult.value, values));
    }

    containerEl.replaceChildren($fragment);

    if (debug) {
      performance.mark("templateRenderEnd");
      const res = performance.measure(
        "templateRender",
        "templateRenderStart",
        "templateRenderEnd",
      );
      console.log(`Total time render: ${res.duration}ms`);
    }

    return Result.ok(true);
  };

  return Result.ok(renderer);
}
