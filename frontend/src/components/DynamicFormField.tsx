import React from 'react';
import { useTranslation } from 'react-i18next';
import type { FormFieldDefinition, LocalizedString } from '../types/schema';
import { Input } from './ui/Input';
import { Select } from './ui/Select';
import { Textarea } from './ui/Textarea';

interface DynamicFormFieldProps {
  field: FormFieldDefinition;
  value: string | number | undefined;
  error?: string;
  onChange: (key: string, value: string | number | undefined) => void;
}

export const DynamicFormField: React.FC<DynamicFormFieldProps> = ({
  field,
  value,
  error,
  onChange,
}) => {
  const { i18n, t } = useTranslation();
  const lang = (i18n.language === 'ar' ? 'ar' : 'en') as keyof LocalizedString;

  const labelText = field.label[lang] || field.label.en;
  const placeholderText = field.placeholder ? (field.placeholder[lang] || field.placeholder.en) : undefined;

  switch (field.type) {
    case 'text':
      return (
        <Input
          id={`field-${field.key}`}
          label={labelText}
          required={field.required}
          placeholder={placeholderText}
          value={(value as string) ?? ''}
          error={error}
          onChange={(e) => onChange(field.key, e.target.value)}
        />
      );

    case 'number':
      return (
        <Input
          id={`field-${field.key}`}
          type="number"
          label={labelText}
          required={field.required}
          min={field.min}
          max={field.max}
          placeholder={placeholderText}
          value={value !== undefined ? String(value) : ''}
          error={error}
          onChange={(e) => {
            const val = e.target.value;
            onChange(field.key, val === '' ? undefined : Number(val));
          }}
        />
      );

    case 'select': {
      const options =
        field.options?.map((opt) => ({
          value: opt.value,
          label: opt.label[lang] || opt.label.en,
        })) || [];

      return (
        <Select
          id={`field-${field.key}`}
          label={labelText}
          required={field.required}
          placeholder={placeholderText || t('form.selectPlaceholder')}
          options={options}
          value={(value as string) ?? ''}
          error={error}
          onChange={(e) => onChange(field.key, e.target.value)}
        />
      );
    }

    case 'textarea':
      return (
        <Textarea
          id={`field-${field.key}`}
          label={labelText}
          required={field.required}
          placeholder={placeholderText || t('form.notesPlaceholder')}
          value={(value as string) ?? ''}
          error={error}
          onChange={(e) => onChange(field.key, e.target.value)}
        />
      );

    case 'date':
      return (
        <Input
          id={`field-${field.key}`}
          type="date"
          label={labelText}
          required={field.required}
          value={(value as string) ?? ''}
          error={error}
          onChange={(e) => onChange(field.key, e.target.value)}
        />
      );

    default:
      return null;
  }
};
