import React from 'react';
import { formatCurrency } from '../../utils/formatters';

export default function TopupHistoryTable({ history = [], getStatusBadge }) {
  if (!history || history.length === 0) return null;

  return (
    <div className="topup-history-block">
      <div className="history-header">
        <span className="history-icon">📜</span>
        <h3 className="history-title">LỊCH SỬ GIAO DỊCH NGÂN HÀNG GẦN ĐÂY</h3>
      </div>

      <div className="history-table-responsive">
        <table className="history-table">
          <thead>
            <tr>
              <th>Mã Giao Dịch</th>
              <th>Số Tiền Nạp</th>
              <th>Thực Nhận</th>
              <th style={{ textAlign: 'center' }}>Trạng Thái</th>
              <th style={{ textAlign: 'right' }}>Thời Gian</th>
            </tr>
          </thead>
          <tbody>
            {history.map((tx, idx) => (
              <tr key={idx} className="history-row">
                <td className="code-cell">
                  <span>{tx.code || 'N/A'}</span>
                </td>
                <td className="amount-cell">
                  {formatCurrency(tx.amount)}đ
                </td>
                <td className="real-amount-cell">
                  {formatCurrency(tx.real_amount)}đ
                </td>
                <td style={{ textAlign: 'center' }}>
                  {getStatusBadge(tx.status)}
                </td>
                <td className="date-cell" style={{ textAlign: 'right' }}>
                  {new Date(tx.created_at).toLocaleString('vi-VN')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
