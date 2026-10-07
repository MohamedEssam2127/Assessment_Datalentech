import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { v4 as uuidv4 } from 'uuid';
import formSchemaJson from '../data/form-schema.json';
import type { FormErrors, FormSchema, LocalizedString, SubmissionStatus } from '../types/schema';
import { isFieldVisible, sanitizeSubmissionPayload, validateForm } from '../utils/formEngine';
import { DynamicFormField } from '../components/DynamicFormField';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { submitReport } from '../api/reportApi';

const schema: FormSchema = formSchemaJson as FormSchema;
const DRAFT_KEY = `inspection_draft_${schema.id}`;

export const InspectionPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const lang = (i18n.language === 'ar' ? 'ar' : 'en') as keyof LocalizedString;

  // Restore draft from localStorage so half-filled forms survive
  const [values, setValues] = useState<Record<string, any>>(() => {
    const saved = localStorage.getItem(DRAFT_KEY);
    return saved ? JSON.parse(saved) : {};
  });

  const [idempotencyKey, setIdempotencyKey] = useState<string>(() => {
    try {
      const savedKey = localStorage.getItem(`${DRAFT_KEY}_key`);
      if (savedKey) return savedKey;
      const newKey = uuidv4();
      localStorage.setItem(`${DRAFT_KEY}_key`, newKey);
      return newKey;
    } catch {
      return uuidv4();
    }
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [submissionStatus, setSubmissionStatus] = useState<SubmissionStatus>('idle');
  const [submissionMessage, setSubmissionMessage] = useState<string | null>(null);

  // Auto-save draft on every input change
  useEffect(() => {
    if (Object.keys(values).length > 0) {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(values));
    } else {
      localStorage.removeItem(DRAFT_KEY);
    }
  }, [values]);

  const setFieldValue = (key: string, value: any) => {
    setValues((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
    }
  };

  const handleSubmit = async (e?: React.SubmitEvent) => {
    if (e) e.preventDefault();

    // Do not block rapid clicks; idempotency key handles deduplication
    // if (submissionStatus === 'saving') return;

    const validation = validateForm(schema, values, t);
    setErrors(validation.errors);

    if (!validation.isValid) {
      setSubmissionStatus('idle');
      return;
    }

    const sanitizedData = sanitizeSubmissionPayload(schema, values);

    setSubmissionStatus('saving');
    setSubmissionMessage(null);

    const payload = {
      equipment: schema.title[lang] || schema.title.en,
      data: sanitizedData,
    };

    try {
      await submitReport(payload, idempotencyKey);

      setSubmissionMessage(t('status.savedSuccess'));

      setSubmissionStatus('saved');

      // Clear draft only after the server confirmed the save
      localStorage.removeItem(DRAFT_KEY);
      localStorage.removeItem(`${DRAFT_KEY}_key`);

      setValues({});
      setErrors({});

      // Generate a fresh idempotency key for the next report
      const newKey = uuidv4();
      setIdempotencyKey(newKey);
      localStorage.setItem(`${DRAFT_KEY}_key`, newKey);
    } catch (err: any) {
      setSubmissionStatus('failed');
      setSubmissionMessage(err?.message || t('status.submitFailed'));
      // Keep the same idempotency key so retry is safe
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <Card>
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
          <div>
            <h1 className="text-xl font-bold text-[#1F2429]">
              {schema.title[lang] || schema.title.en}
            </h1>
            <p className="text-xs text-[#5A646E] mt-0.5">
              ID: {schema.id}
            </p>
          </div>
          <span className="bg-[#8B1E2D]/10 text-[#8B1E2D] font-semibold text-xs px-2.5 py-1 rounded-full">
            v{schema.version}
          </span>
        </div>

        <form onSubmit={handleSubmit} noValidate className="space-y-5">

          {/* Status Message */}
          {submissionStatus === 'saving' && (
            <div className="p-3 rounded-xl bg-blue-50 text-blue-800 text-xs font-medium">
              {t('status.saving')}
            </div>
          )}

          {submissionStatus === 'saved' && (
            <div className="p-3 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-medium">
              {submissionMessage}
            </div>
          )}

          {submissionStatus === 'failed' && (
            <div className="p-3 rounded-xl bg-red-50 text-red-800 text-xs font-medium">
              <p>{submissionMessage}</p>
              <p className="mt-1 opacity-75">{t('status.submitFailedTip')}</p>
            </div>
          )}

          {/* Dynamic Form Fields */}
          <div className="space-y-4">
            {schema.fields.map((field) => {
              if (!isFieldVisible(field, values)) return null;

              return (
                <DynamicFormField
                  key={field.key}
                  field={field}
                  value={values[field.key]}
                  error={errors[field.key]}
                  onChange={setFieldValue}
                />
              );
            })}
          </div>

          {/* Actions */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
            {submissionStatus === 'failed' ? (
              <Button
                type="submit"
                variant="primary"
              >
                {t('form.retryButton')}
              </Button>
            ) : (
              <Button
                type="submit"
                variant="primary"
                isLoading={submissionStatus === 'saving'}
              >
                {t('form.submitButton')}
              </Button>
            )}
          </div>
        </form>
      </Card>
    </div>
  );
};
