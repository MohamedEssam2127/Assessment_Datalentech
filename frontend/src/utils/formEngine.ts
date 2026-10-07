import type { FormErrors, FormFieldDefinition, FormSchema, FormValues } from '../types/schema';

/**
 * Checks whether a field should be shown based on showIf conditions
 */
export function isFieldVisible(field: FormFieldDefinition, values: FormValues): boolean {
  if (!field.showIf) return true;
  const currentVal = values[field.showIf.field];
  return currentVal === field.showIf.equals;
}

/**
 * Validates only the visible fields according to the schema rules
 */
export function validateForm(
  schema: FormSchema,
  values: FormValues,
  t: (key: string, opts?: any) => string
): { isValid: boolean; errors: FormErrors } {
  const errors: FormErrors = {};

  for (const field of schema.fields) {
    if (!isFieldVisible(field, values)) {
      continue;
    }

    const val = values[field.key];

    // Check required
    if (field.required) {
      if (val === undefined || val === null || (typeof val === 'string' && val.trim() === '')) {
        errors[field.key] = t('form.validation.required');
        continue;
      }
    }

    // Number min/max validation
    if (field.type === 'number' && val !== undefined && val !== '') {
      const numVal = Number(val);
      if (isNaN(numVal)) {
        errors[field.key] = t('form.validation.required');
      } else {
        if (field.min !== undefined && numVal < field.min) {
          errors[field.key] = t('form.validation.min', { min: field.min.toLocaleString() });
        } else if (field.max !== undefined && numVal > field.max) {
          errors[field.key] = t('form.validation.max', { max: field.max.toLocaleString() });
        }
      }
    }

    // Date validation
    if (field.type === 'date' && val) {
      const d = new Date(String(val));
      if (isNaN(d.getTime())) {
        errors[field.key] = t('form.validation.invalidDate');
      }
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Strips out hidden fields from the payload before sending to server
 */
export function sanitizeSubmissionPayload(schema: FormSchema, values: FormValues): FormValues {
  const payload: FormValues = {};
  for (const field of schema.fields) {
    if (isFieldVisible(field, values)) {
      if (values[field.key] !== undefined && values[field.key] !== '') {
        payload[field.key] = values[field.key];
      }
    }
  }
  return payload;
}
