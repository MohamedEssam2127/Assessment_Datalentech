import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Card } from '../components/ui/Card';
import { fetchReports } from '../api/reportApi';

export const ReportsPage: React.FC = () => {
  const { t } = useTranslation();
  const [reports, setReports] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadReports = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetchReports();
      setReports(response.data.reports);
    } catch (err: any) {
      setError(err?.message || t('status.submitFailed'));
      setReports([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadReports();
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-[#1F2429]">{t('reports.title')}</h1>
          <p className="text-xs text-[#5A646E] mt-0.5">{t('reports.subtitle')}</p>
        </div>
      </div>

      <Card>
        {isLoading ? (
          <p className="text-center text-xs text-[#5A646E] py-8">{t('common.loading')}</p>
        ) : error ? (
          <p className="text-center text-xs text-red-600 py-8">{error}</p>
        ) : reports.length === 0 ? (
          <p className="text-center text-xs text-[#5A646E] py-8">{t('reports.empty')}</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-[#5A646E] font-semibold">
                  <th className="py-2.5 px-3">{t('reports.table.id')}</th>
                  <th className="py-2.5 px-3">{t('reports.table.equipment')}</th>
                  <th className="py-2.5 px-3">{t('reports.table.serial')}</th>
                  <th className="py-2.5 px-3">{t('reports.table.condition')}</th>
                  <th className="py-2.5 px-3">{t('reports.table.date')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {reports.map((report) => {
                  const data = report.data || report;
                  const isDamaged = data.condition === 'damaged';

                  return (
                    <tr key={report.id} className="hover:bg-slate-50/50">
                      <td className="py-3 px-3 font-mono font-medium text-[#1F2429]">
                        {report.id}
                      </td>
                      <td className="py-3 px-3 font-medium text-[#1F2429]">
                        {report.equipment}
                      </td>
                      <td className="py-3 px-3 font-mono">
                        {data.serial || '—'}
                      </td>
                      <td className="py-3 px-3">
                        <span
                          className={`inline-block px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                            isDamaged
                              ? 'bg-red-100 text-red-700'
                              : 'bg-emerald-100 text-emerald-700'
                          }`}
                        >
                          {isDamaged ? 'Damaged' : 'OK'}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-[#5A646E]">
                        {data.inspectedOn || new Date(report.savedAt).toLocaleDateString()}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
};

