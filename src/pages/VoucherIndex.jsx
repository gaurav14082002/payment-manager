import React, { useState, useMemo } from 'react';
import Layout from '../components/Layout';
import { useVouchers } from '../context/VoucherContext';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { format, parseISO, isWithinInterval } from 'date-fns';
import { Edit, Trash2, Search } from 'lucide-react';
import { toast } from 'sonner';

const VoucherIndex = () => {
  const { vouchers, deleteVoucher } = useVouchers();
  const { isAdmin } = useAuth();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  const filteredVouchers = useMemo(() => {
    return vouchers.filter((v) => {
      const matchesSearch = (v.narration?.toLowerCase() || '').includes(searchTerm.toLowerCase()) || 
                          (v.remarks?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
                          (v.accountHead?.toLowerCase() || '').includes(searchTerm.toLowerCase());
      const matchesType = typeFilter === 'ALL' || v.type === typeFilter;
      
      let matchesDate = true;
      if (fromDate && toDate) {
        try {
          const vDate = parseISO(v.date);
          matchesDate = isWithinInterval(vDate, {
            start: parseISO(fromDate),
            end: parseISO(toDate)
          });
        } catch (e) { matchesDate = true; }
      }

      return matchesSearch && matchesType && matchesDate;
    });
  }, [vouchers, searchTerm, typeFilter, fromDate, toDate]);

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete this voucher?')) {
      deleteVoucher(id);
      toast.success('Voucher deleted successfully');
    }
  };

  const calculateTotals = (voucher) => {
    let dr = 0;
    let cr = 0;
    voucher.rows.forEach(row => {
      const amt = parseFloat(row.amt) || 0;
      if (row.type === 'Debit') dr += amt;
      else cr += amt;
    });
    return { dr, cr };
  };

  return (
    <Layout title="Voucher Index">
      <div className="bg-white shadow rounded-lg overflow-hidden border border-gray-200">
        <div className="p-4 bg-gray-50 border-b border-gray-200 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <select
            className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            <option value="ALL">All Types</option>
            <option value="Payment">Payment</option>
            <option value="Received">Received</option>
          </select>

          <input
            type="date"
            className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
          />

          <input
            type="date"
            className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
          />
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-3 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">No</th>
                <th className="px-3 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Mode</th>
                <th className="px-3 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-3 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Account Head</th>
                <th className="px-3 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Narration</th>
                <th className="px-3 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Debit</th>
                <th className="px-3 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Credit</th>
                <th className="px-3 py-3 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredVouchers.map((v) => {
                const { dr, cr } = calculateTotals(v);
                return (
                  <tr key={v.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-3 py-4 whitespace-nowrap text-xs text-gray-900">{v.date}</td>
                    <td className="px-3 py-4 whitespace-nowrap text-xs text-gray-500">{v.voucherNo || '-'}</td>
                    <td className="px-3 py-4 whitespace-nowrap text-xs text-gray-500">{v.mode || 'CASH'}</td>
                    <td className="px-3 py-4 whitespace-nowrap text-xs text-gray-900">
                      <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${v.type === 'Payment' ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700'}`}>
                        {v.type}
                      </span>
                    </td>
                    <td className="px-3 py-4 text-xs text-gray-900 max-w-[150px] truncate font-medium">{v.accountHead || '-'}</td>
                    <td className="px-3 py-4 text-xs text-gray-500 max-w-[200px] truncate">
                      {v.narration || v.remarks || '-'}
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap text-xs text-right font-mono text-indigo-600 font-bold">{dr.toFixed(2)}</td>
                    <td className="px-3 py-4 whitespace-nowrap text-xs text-right font-mono text-emerald-600 font-bold">{cr.toFixed(2)}</td>
                    <td className="px-3 py-4 whitespace-nowrap text-center text-xs font-medium">
                      <div className="flex justify-center space-x-2">
                        {isAdmin ? (
                          <>
                            <Link to={`/edit/${v.id}`} className="text-indigo-600 hover:text-indigo-900 bg-indigo-50 p-1 rounded">
                              <Edit className="w-3.5 h-3.5" />
                            </Link>
                            <button onClick={() => handleDelete(v.id)} className="text-red-600 hover:text-red-900 bg-red-50 p-1 rounded">
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </>
                        ) : (
                          <span className="text-gray-400 text-[10px] italic">Read Only</span>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filteredVouchers.length === 0 && (
                <tr>
                  <td colSpan="9" className="px-6 py-10 text-center text-gray-500">No vouchers found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
};

export default VoucherIndex;
