export type LocalizedString = {
  en: string;
  ar: string;
};

export type FieldOption = {
  value: string;
  label: LocalizedString;
};

export type ShowIfCondition = {
  field: string;
  equals: string | number | boolean;
};

export type FieldType = 'text' | 'number' | 'select' | 'textarea' | 'date';

export type FormFieldDefinition = {
  key: string;
  type: FieldType;
  required?: boolean;
  min?: number;
  max?: number;
  placeholder?: LocalizedString;
  label: LocalizedString;
  options?: FieldOption[];
  showIf?: ShowIfCondition;
  helperText?: LocalizedString;
};

export type FormSchema = {
  id: string;
  version: number;
  title: LocalizedString;
  fields: FormFieldDefinition[];
};

export type FormValues = Record<string, string | number | undefined>;

export type FormErrors = Record<string, string>;


export type SubmissionStatus = 'idle' | 'saving' | 'saved' | 'failed';
