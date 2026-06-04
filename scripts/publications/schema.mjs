export const confidenceLevels = ["high", "medium", "low"];

export const fieldTypes = {
  title: "string",
  authors: "stringArray",
  year: "year",
  journal: "string",
  volume: "string",
  issue: "string",
  pages: "string",
  doi: "string",
  publication_type: "string",
  abstract: "string",
  one_sentence_summary: "string",
  plain_english_summary: "string",
  research_question: "string",
  main_findings: "stringArray",
  methods: "stringArray",
  data_sources: "stringArray",
  key_variables: "stringArray",
  identification_strategy: "string",
  geography: "string",
  time_period: "string",
  unit_of_analysis: "string",
  keywords: "stringArray",
  related_topics: "stringArray",
  policy_relevance: "string",
  pull_quote: "string",
  pull_quote_page: "number",
  citation: "string",
  links: "links",
  evidence: "evidence",
  confidence_notes: "string",
  substantive_area: "stringArray",
  government_level: "stringArray",
  research_design: "stringArray"
};

export const fieldNames = Object.keys(fieldTypes);

const scalarSchema = {
  type: ["string", "null"]
};

const stringArraySchema = {
  anyOf: [
    {
      type: "array",
      items: { type: "string" }
    },
    { type: "null" }
  ]
};

const wrapperSchema = (valueSchema) => ({
  type: "object",
  additionalProperties: false,
  required: ["value", "evidence_pages", "confidence"],
  properties: {
    value: valueSchema,
    evidence_pages: {
      type: "array",
      items: { type: "integer", minimum: 1 }
    },
    confidence: {
      type: "string",
      enum: confidenceLevels
    }
  }
});

const valueSchemaFor = (type) => {
  if (type === "string") return scalarSchema;
  if (type === "year") return { anyOf: [{ type: "integer" }, { type: "string" }, { type: "null" }] };
  if (type === "number") return { type: ["number", "null"] };
  if (type === "stringArray") return stringArraySchema;
  if (type === "links") {
    return {
      anyOf: [
        {
          type: "object",
          additionalProperties: false,
          required: ["pdf", "journal", "replication_data", "code"],
          properties: {
            pdf: { type: ["string", "null"] },
            journal: { type: ["string", "null"] },
            replication_data: { type: ["string", "null"] },
            code: { type: ["string", "null"] }
          }
        },
        { type: "null" }
      ]
    };
  }
  if (type === "evidence") {
    return {
      anyOf: [
        {
          type: "object",
          additionalProperties: false,
          required: ["research_question", "main_findings", "methods"],
          properties: {
            research_question: {
              type: "object",
              additionalProperties: false,
              required: ["pages"],
              properties: { pages: { type: "array", items: { type: "integer", minimum: 1 } } }
            },
            main_findings: {
              type: "object",
              additionalProperties: false,
              required: ["pages"],
              properties: { pages: { type: "array", items: { type: "integer", minimum: 1 } } }
            },
            methods: {
              type: "object",
              additionalProperties: false,
              required: ["pages"],
              properties: { pages: { type: "array", items: { type: "integer", minimum: 1 } } }
            }
          }
        },
        { type: "null" }
      ]
    };
  }
  throw new Error(`Unknown field type: ${type}`);
};

export const publicationMetadataJsonSchema = {
  type: "object",
  additionalProperties: false,
  required: fieldNames,
  properties: Object.fromEntries(fieldNames.map((fieldName) => [fieldName, wrapperSchema(valueSchemaFor(fieldTypes[fieldName]))]))
};

const defaultValueFor = (type) => {
  if (type === "links") {
    return {
      pdf: null,
      journal: null,
      replication_data: null,
      code: null
    };
  }
  if (type === "evidence") {
    return {
      research_question: { pages: [] },
      main_findings: { pages: [] },
      methods: { pages: [] }
    };
  }
  return null;
};

export const emptyPublicationMetadata = () =>
  Object.fromEntries(
    fieldNames.map((fieldName) => [
      fieldName,
      {
        value: defaultValueFor(fieldTypes[fieldName]),
        evidence_pages: [],
        confidence: "low"
      }
    ])
  );

const isPlainObject = (value) => Boolean(value) && typeof value === "object" && !Array.isArray(value);
const isStringOrNull = (value) => typeof value === "string" || value === null;
const isStringArrayOrNull = (value) => value === null || (Array.isArray(value) && value.every((item) => typeof item === "string"));
const isPageArray = (value) => Array.isArray(value) && value.every((item) => Number.isInteger(item) && item >= 1);

const validateValue = (fieldName, type, value, errors) => {
  if (type === "string" && !isStringOrNull(value)) errors.push(`${fieldName}.value must be a string or null`);
  if (type === "year" && !(value === null || Number.isInteger(value) || typeof value === "string")) {
    errors.push(`${fieldName}.value must be an integer, string, or null`);
  }
  if (type === "number" && !(value === null || typeof value === "number")) errors.push(`${fieldName}.value must be a number or null`);
  if (type === "stringArray" && !isStringArrayOrNull(value)) errors.push(`${fieldName}.value must be an array of strings or null`);
  if (type === "links") {
    if (value === null) return;
    if (!isPlainObject(value)) {
      errors.push(`${fieldName}.value must be an object or null`);
      return;
    }
    for (const key of ["pdf", "journal", "replication_data", "code"]) {
      if (!Object.hasOwn(value, key)) errors.push(`${fieldName}.value.${key} is required`);
      if (!isStringOrNull(value[key])) errors.push(`${fieldName}.value.${key} must be a string or null`);
    }
    for (const key of Object.keys(value)) {
      if (!["pdf", "journal", "replication_data", "code"].includes(key)) errors.push(`${fieldName}.value.${key} is not allowed`);
    }
  }
  if (type === "evidence") {
    if (value === null) return;
    if (!isPlainObject(value)) {
      errors.push(`${fieldName}.value must be an object or null`);
      return;
    }
    for (const key of ["research_question", "main_findings", "methods"]) {
      if (!isPlainObject(value[key])) {
        errors.push(`${fieldName}.value.${key} must be an object`);
      } else if (!isPageArray(value[key].pages)) {
        errors.push(`${fieldName}.value.${key}.pages must be an array of positive integers`);
      }
    }
    for (const key of Object.keys(value)) {
      if (!["research_question", "main_findings", "methods"].includes(key)) errors.push(`${fieldName}.value.${key} is not allowed`);
    }
  }
};

export const validatePublicationMetadata = (record) => {
  const errors = [];
  if (!isPlainObject(record)) {
    return { valid: false, errors: ["metadata must be an object"] };
  }

  for (const fieldName of fieldNames) {
    const wrapper = record[fieldName];
    if (!isPlainObject(wrapper)) {
      errors.push(`${fieldName} must be a field wrapper`);
      continue;
    }
    for (const key of ["value", "evidence_pages", "confidence"]) {
      if (!Object.hasOwn(wrapper, key)) errors.push(`${fieldName}.${key} is required`);
    }
    for (const key of Object.keys(wrapper)) {
      if (!["value", "evidence_pages", "confidence"].includes(key)) errors.push(`${fieldName}.${key} is not allowed`);
    }
    if (!isPageArray(wrapper.evidence_pages)) errors.push(`${fieldName}.evidence_pages must be an array of positive integers`);
    if (!confidenceLevels.includes(wrapper.confidence)) {
      errors.push(`${fieldName}.confidence must be one of: ${confidenceLevels.join(", ")}`);
    }
    validateValue(fieldName, fieldTypes[fieldName], wrapper.value, errors);
  }

  for (const key of Object.keys(record)) {
    if (!fieldNames.includes(key)) errors.push(`${key} is not an allowed top-level field`);
  }

  return { valid: errors.length === 0, errors };
};

export const normalizedPages = (field) => {
  if (!field || !Array.isArray(field.evidence_pages)) return [];
  return [...new Set(field.evidence_pages)].sort((a, b) => a - b);
};

export const slugify = (value) =>
  String(value || "")
    .toLowerCase()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 90);
