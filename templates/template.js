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

function validateAttribut(attr) {
	if (!VALID_ATTRIBUTES.has(attr)) {
		throw new Error(`${attr} is not a valid attribute`);
	}

	return true;
}

/**
 * Updates a clones attributes
 * @param {HTMLElement} clone
 * @param {{}} values
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
			} else if (validateAttribut(attr)) {
				element.setAttribute(attr, value);
			}
		}

		// Remove the data-template attribute after updating
		element.removeAttribute("data-template");
	}

	return clone;
}

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

function cloneTemplate($template) {
	const clone = $template.content.cloneNode(true);

	return clone;
}

/**
 *
 * @param {{}} config
 * @param {{}} data
 * @returns {{}}
 */
function validateConfig(config, data) {
	const newConfig = {};

	for (const [templateItem, attributes] of Object.entries(config)) {
		newConfig[templateItem] = {};

		for (const [attr, value] of Object.entries(attributes)) {
			if (data[value] === undefined) {
				throw new Error(
					`Data key '${value}' is missing for element ID '${templateItem}'.`,
				);
			}

			newConfig[templateItem][attr] = data[value];
		}
	}

	return newConfig;
}

export function getTemplateRenderer({ template, container, config, debug }) {
	if (debug) {
		performance.mark("templateRenderStart");
	}

	const $template = getTemplate(template);

	return (data) => {
		const templateChildren = data.map((d) => {
			const clone = cloneTemplate($template);
			const values = validateConfig(config, d);

			return updateTemplateValues(clone, values);
		});

		container.replaceChildren(...templateChildren);

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
