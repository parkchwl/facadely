import { ThemeTokens } from "@/lib/site-customization-types";

export const TEMPLATE_MANIFEST_SCHEMA_VERSION = 1 as const;
export const TEMPLATE_RUNTIME_DEPLOYMENT = "static" as const;

export const TEMPLATE_RUNTIME_FORMATS = ["react", "html"] as const;
export type TemplateRuntimeFormat = (typeof TEMPLATE_RUNTIME_FORMATS)[number];

export const TEMPLATE_EDITABLE_KINDS = ["text", "image", "button", "container"] as const;
export type TemplateEditableKind = (typeof TEMPLATE_EDITABLE_KINDS)[number];

export const TEMPLATE_EDITABLE_FIELDS = ["text", "image", "button", "color", "font"] as const;
export type TemplateEditableField = (typeof TEMPLATE_EDITABLE_FIELDS)[number];

export const EDITABLE_STYLE_PROPERTIES = [
  "color",
  "backgroundColor",
  "backgroundImage",
  "fontFamily",
  "fontSize",
  "fontWeight",
  "lineHeight",
  "letterSpacing",
] as const;
export type EditableStyleProperty = (typeof EDITABLE_STYLE_PROPERTIES)[number];

const THEME_TOKEN_KEYS = ["primary", "secondary", "radius", "spacingBase"] as const;
type ThemeTokenKey = (typeof THEME_TOKEN_KEYS)[number];

const FIELD_TO_STYLE_PROPERTIES: Record<TemplateEditableField, EditableStyleProperty[]> = {
  text: [],
  image: ["backgroundImage"],
  button: [],
  color: ["color", "backgroundColor"],
  font: ["fontFamily", "fontSize", "fontWeight", "lineHeight", "letterSpacing"],
};

const DEFAULT_FIELDS_BY_KIND: Record<TemplateEditableKind, TemplateEditableField[]> = {
  text: ["text", "color", "font"],
  image: ["image"],
  button: ["text", "button", "color", "font"],
  container: ["color"],
};

export type TemplateEditableNode = {
  editId: string;
  label: string;
  kind: TemplateEditableKind;
  fields: TemplateEditableField[];
};

export type TemplateImagePreset = {
  id: string;
  label: string;
  targetEditId: string;
  thumbnailUrl: string;
  imageUrl: string;
};

export type TemplateScenePatch = {
  editId: string;
  styles?: Partial<Record<EditableStyleProperty, string>>;
  innerText?: string;
  src?: string;
  href?: string;
};

export type TemplateScenePreset = {
  id: string;
  label: string;
  targetEditId: string;
  thumbnailUrl: string;
  description?: string;
  patches: TemplateScenePatch[];
};

export type TemplatePresetUiConfig = {
  imageInitialVisible: number;
  sceneInitialVisible: number;
};

export type TemplateManifest = {
  schemaVersion: typeof TEMPLATE_MANIFEST_SCHEMA_VERSION;
  templateId: string;
  sitePath: string;
  name: string;
  description: string;
  runtime: {
    format: TemplateRuntimeFormat;
    entry: string;
    deployment: typeof TEMPLATE_RUNTIME_DEPLOYMENT;
  };
  editable: TemplateEditableNode[];
  themeTokens: ThemeTokenKey[];
  imagePresets: TemplateImagePreset[];
  scenePresets: TemplateScenePreset[];
  presetUi: TemplatePresetUiConfig;
};

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function assertString(value: unknown, field: string): string {
  if (typeof value !== "string") {
    throw new Error(`manifest.${field} must be a string`);
  }
  const trimmed = value.trim();
  if (!trimmed) {
    throw new Error(`manifest.${field} cannot be empty`);
  }
  return trimmed;
}

function assertOptionalString(value: unknown, field: string): string | undefined {
  if (value === undefined || value === null) return undefined;
  if (typeof value !== "string") {
    throw new Error(`manifest.${field} must be a string`);
  }
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

function assertOneOf<T extends readonly string[]>(
  value: unknown,
  validValues: T,
  field: string
): T[number] {
  if (typeof value !== "string" || !validValues.includes(value)) {
    throw new Error(`manifest.${field} must be one of: ${validValues.join(", ")}`);
  }
  return value as T[number];
}

function dedupeStringArray<T extends string>(values: T[]): T[] {
  return Array.from(new Set(values));
}

function readPositiveInteger(input: unknown, fallback: number): number {
  if (typeof input !== "number" || !Number.isFinite(input)) return fallback;
  const rounded = Math.floor(input);
  return rounded > 0 ? rounded : fallback;
}

export function defaultFieldsForKind(kind: TemplateEditableKind): TemplateEditableField[] {
  return [...DEFAULT_FIELDS_BY_KIND[kind]];
}

export function getAllowedStyleProperties(fields: TemplateEditableField[]): EditableStyleProperty[] {
  const properties = fields.flatMap((field) => FIELD_TO_STYLE_PROPERTIES[field]);
  return dedupeStringArray(properties);
}

export function hasEditableField(node: TemplateEditableNode, field: TemplateEditableField): boolean {
  return node.fields.includes(field);
}

export function isThemeTokenKey(value: string): value is keyof ThemeTokens {
  return THEME_TOKEN_KEYS.includes(value as ThemeTokenKey);
}

export function parseTemplateManifest(input: unknown): TemplateManifest {
  if (!isObject(input)) {
    throw new Error("manifest must be an object");
  }

  const schemaVersion = input.schemaVersion;
  if (schemaVersion !== TEMPLATE_MANIFEST_SCHEMA_VERSION) {
    throw new Error(`manifest.schemaVersion must be ${TEMPLATE_MANIFEST_SCHEMA_VERSION}`);
  }

  const runtimeInput = input.runtime;
  if (!isObject(runtimeInput)) {
    throw new Error("manifest.runtime must be an object");
  }

  const runtime = {
    format: assertOneOf(runtimeInput.format, TEMPLATE_RUNTIME_FORMATS, "runtime.format"),
    entry: assertString(runtimeInput.entry, "runtime.entry"),
    deployment: assertOneOf(
      runtimeInput.deployment,
      [TEMPLATE_RUNTIME_DEPLOYMENT] as const,
      "runtime.deployment"
    ),
  };

  const editableInput = input.editable;
  if (!Array.isArray(editableInput)) {
    throw new Error("manifest.editable must be an array");
  }

  const editable: TemplateEditableNode[] = editableInput.map((node, index) => {
    if (!isObject(node)) {
      throw new Error(`manifest.editable[${index}] must be an object`);
    }

    const kind = assertOneOf(node.kind, TEMPLATE_EDITABLE_KINDS, `editable[${index}].kind`);
    const fieldsInput = node.fields;
    const parsedFields = Array.isArray(fieldsInput)
      ? fieldsInput.map((field, fieldIndex) =>
        assertOneOf(field, TEMPLATE_EDITABLE_FIELDS, `editable[${index}].fields[${fieldIndex}]`)
      )
      : defaultFieldsForKind(kind);

    return {
      editId: assertString(node.editId, `editable[${index}].editId`),
      label: assertString(node.label ?? node.editId, `editable[${index}].label`),
      kind,
      fields: dedupeStringArray(parsedFields),
    };
  });

  const duplicateEditId = editable.find(
    (node, index) => editable.findIndex((candidate) => candidate.editId === node.editId) !== index
  );
  if (duplicateEditId) {
    throw new Error(`manifest.editable contains duplicate editId: ${duplicateEditId.editId}`);
  }

  const themeTokensInput = input.themeTokens;
  const themeTokens = Array.isArray(themeTokensInput)
    ? dedupeStringArray(
      themeTokensInput.map((token, index) =>
        assertOneOf(token, THEME_TOKEN_KEYS, `themeTokens[${index}]`)
      )
    )
    : [...THEME_TOKEN_KEYS];

  const editableIdSet = new Set(editable.map((node) => node.editId));

  const imagePresetsInput = input.imagePresets;
  const imagePresets: TemplateImagePreset[] = Array.isArray(imagePresetsInput)
    ? imagePresetsInput.map((preset, index) => {
      if (!isObject(preset)) {
        throw new Error(`manifest.imagePresets[${index}] must be an object`);
      }
      const targetEditId = assertString(preset.targetEditId, `imagePresets[${index}].targetEditId`);
      if (!editableIdSet.has(targetEditId)) {
        throw new Error(`manifest.imagePresets[${index}].targetEditId is not declared in editable: ${targetEditId}`);
      }
      return {
        id: assertString(preset.id, `imagePresets[${index}].id`),
        label: assertString(preset.label ?? preset.id, `imagePresets[${index}].label`),
        targetEditId,
        thumbnailUrl: assertString(preset.thumbnailUrl, `imagePresets[${index}].thumbnailUrl`),
        imageUrl: assertString(preset.imageUrl, `imagePresets[${index}].imageUrl`),
      };
    })
    : [];

  const duplicateImagePresetId = imagePresets.find(
    (preset, index) => imagePresets.findIndex((candidate) => candidate.id === preset.id) !== index
  );
  if (duplicateImagePresetId) {
    throw new Error(`manifest.imagePresets contains duplicate id: ${duplicateImagePresetId.id}`);
  }

  const scenePresetsInput = input.scenePresets;
  const scenePresets: TemplateScenePreset[] = Array.isArray(scenePresetsInput)
    ? scenePresetsInput.map((scene, sceneIndex) => {
      if (!isObject(scene)) {
        throw new Error(`manifest.scenePresets[${sceneIndex}] must be an object`);
      }
      const targetEditId = assertString(scene.targetEditId, `scenePresets[${sceneIndex}].targetEditId`);
      if (!editableIdSet.has(targetEditId)) {
        throw new Error(`manifest.scenePresets[${sceneIndex}].targetEditId is not declared in editable: ${targetEditId}`);
      }

      const patchesInput = scene.patches;
      if (!Array.isArray(patchesInput) || patchesInput.length === 0) {
        throw new Error(`manifest.scenePresets[${sceneIndex}].patches must be a non-empty array`);
      }

      const patches: TemplateScenePatch[] = patchesInput.map((patch, patchIndex) => {
        if (!isObject(patch)) {
          throw new Error(`manifest.scenePresets[${sceneIndex}].patches[${patchIndex}] must be an object`);
        }

        const editId = assertString(
          patch.editId,
          `scenePresets[${sceneIndex}].patches[${patchIndex}].editId`
        );
        if (!editableIdSet.has(editId)) {
          throw new Error(
            `manifest.scenePresets[${sceneIndex}].patches[${patchIndex}].editId is not declared in editable: ${editId}`
          );
        }

        const stylesInput = patch.styles;
        let styles: Partial<Record<EditableStyleProperty, string>> | undefined;
        if (stylesInput !== undefined) {
          if (!isObject(stylesInput)) {
            throw new Error(`manifest.scenePresets[${sceneIndex}].patches[${patchIndex}].styles must be an object`);
          }
          const parsedEntries = Object.entries(stylesInput).map(([key, value]) => {
            const styleKey = assertOneOf(
              key,
              EDITABLE_STYLE_PROPERTIES,
              `scenePresets[${sceneIndex}].patches[${patchIndex}].styles.${key}`
            );
            if (typeof value !== "string") {
              throw new Error(
                `manifest.scenePresets[${sceneIndex}].patches[${patchIndex}].styles.${key} must be a string`
              );
            }
            return [styleKey, value] as const;
          });
          styles = Object.fromEntries(parsedEntries);
        }

        const innerText = assertOptionalString(
          patch.innerText,
          `scenePresets[${sceneIndex}].patches[${patchIndex}].innerText`
        );
        const src = assertOptionalString(
          patch.src,
          `scenePresets[${sceneIndex}].patches[${patchIndex}].src`
        );
        const href = assertOptionalString(
          patch.href,
          `scenePresets[${sceneIndex}].patches[${patchIndex}].href`
        );

        if (!styles && !innerText && !src && !href) {
          throw new Error(`manifest.scenePresets[${sceneIndex}].patches[${patchIndex}] has no patch values`);
        }

        return {
          editId,
          styles,
          innerText,
          src,
          href,
        };
      });

      return {
        id: assertString(scene.id, `scenePresets[${sceneIndex}].id`),
        label: assertString(scene.label ?? scene.id, `scenePresets[${sceneIndex}].label`),
        targetEditId,
        thumbnailUrl: assertString(scene.thumbnailUrl, `scenePresets[${sceneIndex}].thumbnailUrl`),
        description: assertOptionalString(scene.description, `scenePresets[${sceneIndex}].description`),
        patches,
      };
    })
    : [];

  const duplicateScenePresetId = scenePresets.find(
    (scene, index) => scenePresets.findIndex((candidate) => candidate.id === scene.id) !== index
  );
  if (duplicateScenePresetId) {
    throw new Error(`manifest.scenePresets contains duplicate id: ${duplicateScenePresetId.id}`);
  }

  const presetUiInput = isObject(input.presetUi) ? input.presetUi : {};
  const presetUi: TemplatePresetUiConfig = {
    imageInitialVisible: readPositiveInteger(presetUiInput.imageInitialVisible, 4),
    sceneInitialVisible: readPositiveInteger(presetUiInput.sceneInitialVisible, 4),
  };

  return {
    schemaVersion: TEMPLATE_MANIFEST_SCHEMA_VERSION,
    templateId: assertString(input.templateId, "templateId"),
    sitePath: assertString(input.sitePath, "sitePath"),
    name: assertString(input.name, "name"),
    description: assertString(input.description ?? "", "description"),
    runtime,
    editable,
    themeTokens,
    imagePresets,
    scenePresets,
    presetUi,
  };
}
