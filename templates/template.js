/**
 * @typedef {("accept"|"accept-charset"|"accesskey"|"action"|"align"|"alt"|"async"|"autocomplete"|"autofocus"|
 * "autoplay"|"bgcolor"|"border"|"charset"|"checked"|"cite"|"class"|"color"|"cols"|"colspan"|"content"|
 * "contenteditable"|"controls"|"coords"|"data"|"datetime"|"default"|"defer"|"dir"|"dirname"|"disabled"|
 * "download"|"draggable"|"dropzone"|"enctype"|"for"|"form"|"formaction"|"headers"|"height"|"hidden"|"high"|
 * "href"|"hreflang"|"http-equiv"|"id"|"ismap"|"kind"|"label"|"lang"|"list"|"loop"|"low"|"max"|"maxlength"|
 * "media"|"method"|"min"|"multiple"|"muted"|"name"|"novalidate"|"open"|"optimum"|"pattern"|"placeholder"|
 * "poster"|"preload"|"readonly"|"rel"|"required"|"reversed"|"rows"|"rowspan"|"sandbox"|"scope"|"selected"|
 * "shape"|"size"|"sizes"|"span"|"spellcheck"|"src"|"srcdoc"|"srclang"|"srcset"|"start"|"step"|"style"|
 * "tabindex"|"target"|"title"|"translate"|"type"|"usemap"|"value"|"width"|"wrap")} ValidAttributes
 */

/**
 *
 * @type {Set<ValidAttributes>}
 */
const VALID_ATTRIBUTES = new Set([
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
]);

/**
 * Validates if the given attribute is valid.
 * @param {string} attr - The attribute to validate.
 * @returns {attr is ValidAttributes} - Returns true if the attribute is valid.
 * @throws {Error} - Throws an error if the attribute is not valid.
 */
function validateAttribute(attr) {
	// @ts-ignore
	if (!VALID_ATTRIBUTES.has(attr)) {
		throw new Error(`${attr} is not a valid attribute`);
	}

	return true;
}

/**
 * @typedef {Object<ValidAttributes|"textContent", string>} DataValues
 */
/**
 * @typedef {{[key: string]: DataValues}} ConfigData
 */

const asd = getTemplateRenderer({
	config: (data) => ({
		/** @type {DataValues} test */
		test: {},
	}),
});

/**
 * Updates a clone's attributes based on the provided values.
 * @param {DocumentFragment} clone - The cloned template element.
 * @param {DataValues} values - The values to set on the template.
 * @returns {DocumentFragment} - The updated clone.
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
 * @param {string} selector - The CSS selector for the template.
 * @returns {HTMLTemplateElement} - The template element.
 * @throws {Error} - Throws an error if the template is not found or is not a valid template element.
 */
function getTemplate(selector) {
	const $template = document.querySelector(selector);

	if (!$template) {
		throw new Error(`Could not find: ${selector}`);
	}

	if (!($template instanceof HTMLTemplateElement)) {
		throw new Error(`${$template} is not a Template`);
	}

	return $template;
}

/**
 * Clones the content of a given template element.
 * @param {HTMLTemplateElement} $template - The template element to clone.
 * @returns {DocumentFragment} - The cloned content.
 */
function cloneTemplate($template) {
	const clone = $template.content.cloneNode(true);

	if (!(clone instanceof DocumentFragment)) {
		throw new Error(
			`Template could not be cloned to a DocumentFragment: ${clone}`,
		);
	}

	return clone;
}

/**
 * Returns a function to render a template with provided data.
 * @param {Object} options - Options for rendering the template.
 * @param {string} options.template - The template selector.
 * @param {HTMLElement} options.$container - The container element to render into.
 * @param {function(T): DataValues} options.config - The configuration function to map data to template values.
 * @param {boolean} [options.debug] - Enable performance debugging.
 * @returns {function(Array<T>): void} - The template renderer function.
 * @template T
 */
export function getTemplateRenderer({ template, $container, config, debug }) {
	if (typeof config !== "function") {
		throw new Error(
			`The config should be a function but got ${typeof config} instead.`,
		);
	}
	if (!($container instanceof HTMLElement)) {
		throw new Error(
			`The $container must be a valid HTMLElement but got ${$container} instead.`,
		);
	}

	const $template = getTemplate(template);

	return (data) => {
		if (debug) {
			performance.mark("templateRenderStart");
		}

		const renderData = Array.isArray(data) ? data : [data];

		if (renderData.length <= 0) {
			if (debug) {
				console.warn("No data provided for rendering");
			}
			return;
		}

		const $fragment = document.createDocumentFragment();

		for (const item of data) {
			const clone = cloneTemplate($template);
			const values = config(item);
			$fragment.appendChild(updateTemplateValues(clone, values));
		}

		$container.replaceChildren($fragment);

		if (debug) {
			performance.mark("templateRenderEnd");
			const res = performance.measure(
				"templateRender",
				"templateRenderStart",
				"templateRenderEnd",
			);
			console.log(`Total time render: ${res.duration}ms`);
		}
	};
}
