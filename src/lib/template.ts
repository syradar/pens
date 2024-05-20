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
] as const
const VALID_ATTRIBUTES = new Set(validAttributes)
type ValidAttributes = (typeof validAttributes)[number]

/**
 * Validates if the given attribute is valid.
 * @throws {Error} - Throws an error if the attribute is not valid.
 */
function validateAttribute(attr: string): attr is ValidAttributes {
  if (!VALID_ATTRIBUTES.has(attr as ValidAttributes)) {
    return false
  }

  return true
}

type DataValues = Record<ValidAttributes, string>
type PartialDataValues = Partial<DataValues>

type ConfigData = Record<string, PartialDataValues>

/**
 * Updates a clone's attributes based on the provided values.
 */
function updateTemplateValues(
  clone: DocumentFragment,
  values: PartialDataValues
) {
  for (const [key, attributes] of Object.entries(values)) {
    // Find the element with the corresponding class
    const element = clone.querySelector(`[data-template=${key}]`)
    // If the element doesn't exist, continue to the next iteration
    if (!element) continue

    // Iterate over each attribute-value pair in the attributes object
    for (const [attr, value] of Object.entries(attributes)) {
      if (attr === "textContent") {
        element.textContent = value
      } else if (validateAttribute(attr)) {
        element.setAttribute(attr, value)
      }
    }

    // Remove the data-template attribute after updating since we don't want
    // the templating to mess with other scripts or styling.
    element.removeAttribute("data-template")
  }

  return clone
}

/**
 * Retrieves a template element from the DOM.
 * @throws {Error} - Throws an error if the template is not found or is not a valid template element.
 */
function getTemplate(selector: string): HTMLTemplateElement {
  const templateEl = document.querySelector(selector)

  if (!templateEl) {
    throw new Error(`Could not find: ${selector}`)
  }

  if (!(templateEl instanceof HTMLTemplateElement)) {
    throw new Error(`${templateEl} is not a Template`)
  }

  return templateEl
}

/**
 * Clones the content of a given template element.
 */
function cloneTemplate(templateEl: HTMLTemplateElement): DocumentFragment {
  const clone = templateEl.content.cloneNode(true)

  if (!(clone instanceof DocumentFragment)) {
    throw new Error(
      `Template could not be cloned to a DocumentFragment: ${clone}`
    )
  }

  return clone
}

type ConfigFunction<T> = (data: T) => ConfigData

type TemplateRendererOptions<T> = {
  template: string
  containerEl: HTMLElement | null
  config: ConfigFunction<T>
  debug: boolean
}

export type TemplateRenderer<T> = (data: T[]) => void

/**
 * Returns a function to render a template with provided data.
 */
export function getTemplateRenderer<T>({
  template,
  containerEl,
  config,
  debug,
}: TemplateRendererOptions<T>): TemplateRenderer<T> {
  if (typeof config !== "function") {
    throw new Error(
      `The config should be a function but got ${typeof config} instead.`
    )
  }

  if (!(containerEl instanceof HTMLElement)) {
    throw new Error(
      `The containerEl must be a valid HTMLElement but got ${containerEl} instead.`
    )
  }

  const $template = getTemplate(template)

  return (data) => {
    if (debug) {
      performance.mark("templateRenderStart")
    }

    const renderData = Array.isArray(data) ? data : [data]

    if (renderData.length <= 0) {
      if (debug) {
        console.warn("No data provided for rendering")
      }
      return
    }

    const $fragment = document.createDocumentFragment()

    for (const item of data) {
      const clone = cloneTemplate($template)
      const values = config(item)
      $fragment.appendChild(updateTemplateValues(clone, values))
    }

    containerEl.replaceChildren($fragment)

    if (debug) {
      performance.mark("templateRenderEnd")
      const res = performance.measure(
        "templateRender",
        "templateRenderStart",
        "templateRenderEnd"
      )
      console.log(`Total time render: ${res.duration}ms`)
    }
  }
}
