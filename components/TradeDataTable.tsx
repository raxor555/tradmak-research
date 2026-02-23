import React, { useState } from 'react';
import { TradeRecord } from '../types';
import { Download, ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';
import { Button } from './Button';

interface TradeDataTableProps {
  data: TradeRecord[];
}

export const TradeDataTable: React.FC<TradeDataTableProps> = ({ data }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;
  
  const totalPages = Math.ceil(data.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const currentData = data.slice(startIndex, startIndex + rowsPerPage);

  const handleDownloadCSV = () => {
    if (!data.length) return;

    const headers = [
      'Date',
      'HS Code',
      'Description',
      'Destination',
      'Port of Loading',
      'Unit',
      'Quantity',
      'Total Value (USD)',
      'Price Per Unit (USD)',
      'Source URL'
    ];

    const csvRows = data.map(row => [
      row.date,
      row.hsCode,
      row.description,
      row.destination,
      row.portOfLoading,
      row.unit,
      row.quantity,
      row.totalValueUSD,
      row.pricePerUnitUSD,
      row.sourceUrl || ''
    ].map(val => `"${val}"`).join(','));

    const csvContent = [headers.join(','), ...csvRows].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'trade_data_export.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!data || data.length === 0) {
    return (
      <div className="p-8 text-center border border-trade-border bg-trade-surface rounded-sm">
        <p className="text-sm font-mono text-trade-muted uppercase">No granular trade data available for this query.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex justify-between items-center">
        <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-trade-muted flex items-center gap-2">
          <div className="w-3 h-[1px] bg-trade-border" /> 03 Raw Trade Data
        </h3>
        <Button variant="outline" size="sm" onClick={handleDownloadCSV}>
          <Download className="w-3.5 h-3.5 mr-2" /> EXPORT CSV
        </Button>
      </div>

      <div className="border border-trade-border rounded-sm overflow-hidden bg-white soft-shadow">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-trade-bg border-b border-trade-border">
                <th className="p-3 text-[9px] font-mono font-bold text-trade-muted uppercase tracking-wider whitespace-nowrap">Date</th>
                <th className="p-3 text-[9px] font-mono font-bold text-trade-muted uppercase tracking-wider whitespace-nowrap">HS Code</th>
                <th className="p-3 text-[9px] font-mono font-bold text-trade-muted uppercase tracking-wider whitespace-nowrap">Description</th>
                <th className="p-3 text-[9px] font-mono font-bold text-trade-muted uppercase tracking-wider whitespace-nowrap">Destination</th>
                <th className="p-3 text-[9px] font-mono font-bold text-trade-muted uppercase tracking-wider whitespace-nowrap">Port of Loading</th>
                <th className="p-3 text-[9px] font-mono font-bold text-trade-muted uppercase tracking-wider whitespace-nowrap">Unit</th>
                <th className="p-3 text-[9px] font-mono font-bold text-trade-muted uppercase tracking-wider whitespace-nowrap text-right">Quantity</th>
                <th className="p-3 text-[9px] font-mono font-bold text-trade-muted uppercase tracking-wider whitespace-nowrap text-right">Value (USD)</th>
                <th className="p-3 text-[9px] font-mono font-bold text-trade-muted uppercase tracking-wider whitespace-nowrap text-right">Price/Unit</th>
                <th className="p-3 text-[9px] font-mono font-bold text-trade-muted uppercase tracking-wider whitespace-nowrap text-center">Source</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-trade-border">
              {currentData.map((row, index) => (
                <tr key={index} className="hover:bg-trade-bg/50 transition-colors group">
                  <td className="p-3 text-[10px] font-mono text-trade-text whitespace-nowrap">{row.date}</td>
                  <td className="p-3 text-[10px] font-mono text-trade-muted group-hover:text-trade-accent transition-colors">{row.hsCode}</td>
                  <td className="p-3 text-[10px] font-sans text-trade-text font-medium max-w-[200px] truncate" title={row.description}>{row.description}</td>
                  <td className="p-3 text-[10px] font-sans text-trade-text">{row.destination}</td>
                  <td className="p-3 text-[10px] font-sans text-trade-text">{row.portOfLoading}</td>
                  <td className="p-3 text-[10px] font-mono text-trade-muted text-center">{row.unit}</td>
                  <td className="p-3 text-[10px] font-mono text-trade-text text-right font-bold">{row.quantity.toLocaleString()}</td>
                  <td className="p-3 text-[10px] font-mono text-trade-text text-right">{row.totalValueUSD.toLocaleString()}</td>
                  <td className="p-3 text-[10px] font-mono text-trade-text text-right">{row.pricePerUnitUSD.toFixed(2)}</td>
                  <td className="p-3 text-center">
                    {row.sourceUrl ? (
                      <a 
                        href={row.sourceUrl} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="inline-flex items-center justify-center text-trade-muted hover:text-trade-accent transition-colors"
                        title="View Source"
                      >
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    ) : (
                      <span className="text-[9px] text-trade-muted">-</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="bg-trade-bg border-t border-trade-border p-3 flex items-center justify-between">
            <span className="text-[9px] font-mono text-trade-muted uppercase">
              Showing {startIndex + 1}-{Math.min(startIndex + rowsPerPage, data.length)} of {data.length} records
            </span>
            <div className="flex gap-1">
              <button 
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-1 hover:bg-white hover:shadow-sm border border-transparent hover:border-trade-border rounded disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:shadow-none"
              >
                <ChevronLeft className="w-4 h-4 text-trade-text" />
              </button>
              <button 
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-1 hover:bg-white hover:shadow-sm border border-transparent hover:border-trade-border rounded disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:shadow-none"
              >
                <ChevronRight className="w-4 h-4 text-trade-text" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
