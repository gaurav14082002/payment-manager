import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { useVouchers } from '../context/VoucherContext';
import { useNavigate, useParams } from 'react-router-dom';
import { Plus, X, Save, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

const VoucherEntry = () => {
  const { addVoucher, updateVoucher, getVoucher } = useVouchers();
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;

  const [formData, setFormData] = useState({
    group: 'CASH',
    voucherNo: '',
    date: new Date().toISOString().split('T')[0],
    type: 'Payment',
    mode: 'CASH',
    accountHead: '',
    remarks: '',
    narration: 'On Account',
    rows: [
      { id: Date.now(), account: '', narration: 'On Account', amt: '', tdsApplicable: 'No', tdsType: '', type: 'Debit' }
    ]
  });

  useEffect(() => {
    if (isEdit) {
      const v = getVoucher(id);
      if (v) setFormData(v);
    }
  }, [id, isEdit, getVoucher]);

  const handleRowChange = (rid, field, val) => {
    setFormData({
      ...formData,
      rows: formData.rows.map(r => r.id === rid ? { ...r, [field]: val } : r)
    });
  };

  const addRow = () => {
    setFormData({
      ...formData,
      rows: [...formData.rows, { 
        id: Date.now(), 
        account: '', 
        narration: 'On Account', 
        amt: '', 
        tdsApplicable: 'No', 
        tdsType: '', 
        type: formData.type === 'Payment' ? 'Debit' : 'Credit' 
      }]
    });
  };

  const removeRow = (rid) => {
    if (formData.rows.length > 1) {
      setFormData({ ...formData, rows: formData.rows.filter(r => r.id !== rid) });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEdit) {
      updateVoucher(id, formData);
      toast.success('Voucher updated');
    } else {
      addVoucher(formData);
      toast.success('Voucher saved');
    }
    navigate('/');
  };

  const dr = formData.rows.reduce((s, r) => s + (r.type === 'Debit' ? parseFloat(r.amt || 0) : 0), 0);
  const cr = formData.rows.reduce((s, r) => s + (r.type === 'Credit' ? parseFloat(r.amt || 0) : 0), 0);

  return (
    <Layout title={isEdit ? "Edit Voucher" : "Create Voucher"}>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Group</label>
              <input value={formData.group} readOnly className="block w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-sm focus:outline-none" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Voc No</label>
              <input 
                value={formData.voucherNo} 
                onChange={(e) => setFormData({...formData, voucherNo: e.target.value})} 
                className="block w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-indigo-500 focus:border-indigo-500" 
                placeholder="Optional" 
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Date</label>
              <input 
                type="date" 
                value={formData.date} 
                onChange={(e) => setFormData({...formData, date: e.target.value})} 
                className="block w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-indigo-500 focus:border-indigo-500" 
                required 
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Type</label>
              <select 
                value={formData.type} 
                onChange={(e) => {
                  const nt = e.target.value;
                  setFormData({
                    ...formData, 
                    type: nt,
                    rows: formData.rows.map(r => ({...r, type: nt === 'Payment' ? 'Debit' : 'Credit'}))
                  })
                }} 
                className="block w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="Payment">Payment</option>
                <option value="Received">Received</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Mode</label>
              <select 
                value={formData.mode} 
                onChange={(e) => setFormData({...formData, mode: e.target.value})} 
                className="block w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="CASH">CASH</option>
                <option value="BANK">BANK</option>
                <option value="CHEQUE">CHEQUE</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Account Head</label>
              <select 
                value={formData.accountHead} 
                onChange={(e) => setFormData({...formData, accountHead: e.target.value})} 
                className="block w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-indigo-500 focus:border-indigo-500"
                required
              >
                <option value="">--Select--</option>
                <option value="CASH ACCOUNT">CASH ACCOUNT</option>
                <option value="BANK ACCOUNT">BANK ACCOUNT</option>
                <option value="PETTY CASH">PETTY CASH</option>
              </select>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Remarks</label>
              <input 
                value={formData.remarks} 
                onChange={(e) => setFormData({...formData, remarks: e.target.value})} 
                className="block w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-indigo-500 focus:border-indigo-500" 
                placeholder="Additional remarks..." 
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Main Narration</label>
              <input 
                value={formData.narration} 
                onChange={(e) => setFormData({...formData, narration: e.target.value})} 
                className="block w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-indigo-500 focus:border-indigo-500" 
                placeholder="Voucher narration..." 
                onFocus={(e) => { if(e.target.value === 'On Account') setFormData({...formData, narration: ''}) }}
                onBlur={(e) => { if(e.target.value === '') setFormData({...formData, narration: 'On Account'}) }}
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/4">Account Head</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Narration</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">Amount</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-48">TDS Info</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-24">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {formData.rows.map((r) => (
                <tr key={r.id}>
                  <td className="p-2">
                    <select 
                      value={r.account} 
                      onChange={(e) => handleRowChange(r.id, 'account', e.target.value)} 
                      className="block w-full px-2 py-1.5 border border-gray-300 rounded text-sm focus:ring-indigo-500 focus:border-indigo-500" 
                      required
                    >
                      <option value="">--Select--</option>
                      <option value="CASH">CASH</option>
                      <option value="BANK">BANK</option>
                      <option value="OFFICE EXPENSES">OFFICE EXPENSES</option>
                      <option value="SALARY">SALARY</option>
                      <option value="RENT">RENT</option>
                    </select>
                  </td>
                  <td className="p-2">
                    <input 
                      value={r.narration} 
                      onChange={(e) => handleRowChange(r.id, 'narration', e.target.value)}
                      onFocus={(e) => { if(e.target.value === 'On Account') handleRowChange(r.id, 'narration', '') }}
                      onBlur={(e) => { if(e.target.value === '') handleRowChange(r.id, 'narration', 'On Account') }}
                      className="block w-full px-2 py-1.5 border border-gray-300 rounded text-sm focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </td>
                  <td className="p-2">
                    <input 
                      type="number" 
                      step="0.01" 
                      value={r.amt} 
                      onChange={(e) => handleRowChange(r.id, 'amt', e.target.value)} 
                      className="block w-full px-2 py-1.5 border border-gray-300 rounded text-sm text-right focus:ring-indigo-500 focus:border-indigo-500" 
                      required 
                    />
                  </td>
                  <td className="p-2">
                    <div className="flex gap-2">
                      <select 
                        value={r.tdsApplicable} 
                        onChange={(e) => handleRowChange(r.id, 'tdsApplicable', e.target.value)} 
                        className="block w-20 px-1 py-1.5 border border-gray-300 rounded text-xs focus:ring-indigo-500 focus:border-indigo-500"
                      >
                        <option value="No">No</option>
                        <option value="Yes">Yes</option>
                      </select>
                      {r.tdsApplicable === 'Yes' && (
                        <select 
                          value={r.tdsType} 
                          onChange={(e) => handleRowChange(r.id, 'tdsType', e.target.value)} 
                          className="block flex-1 px-1 py-1.5 border border-gray-300 rounded text-xs focus:ring-indigo-500 focus:border-indigo-500" 
                          required
                        >
                          <option value="">--Type--</option>
                          <option value="Rent">Rent (10%)</option>
                          <option value="Professional">Prof. (10%)</option>
                          <option value="Contract">Cont. (2%)</option>
                        </select>
                      )}
                    </div>
                  </td>
                  <td className="p-2 text-center">
                    <div className="flex justify-center space-x-1">
                      <button type="button" onClick={addRow} className="p-1 text-indigo-600 hover:bg-indigo-50 rounded">
                        <Plus className="w-4 h-4" />
                      </button>
                      <button 
                        type="button" 
                        onClick={() => removeRow(r.id)} 
                        className={`p-1 rounded ${formData.rows.length === 1 ? 'text-gray-300' : 'text-red-600 hover:bg-red-50'}`} 
                        disabled={formData.rows.length === 1}
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bg-slate-800 p-6 rounded-lg shadow-sm text-white flex justify-end space-x-12">
          <div className="text-right">
            <div className="text-xs font-bold text-slate-400 uppercase">Total Debit</div>
            <div className="text-2xl font-mono text-indigo-400">₹ {dr.toFixed(2)}</div>
          </div>
          <div className="text-right">
            <div className="text-xs font-bold text-slate-400 uppercase">Total Credit</div>
            <div className="text-2xl font-mono text-emerald-400">₹ {cr.toFixed(2)}</div>
          </div>
          {Math.abs(dr-cr) > 0.01 && (
            <div className="text-right text-red-400">
              <div className="text-xs font-bold uppercase">Diff</div>
              <div className="text-2xl font-mono">₹ {Math.abs(dr-cr).toFixed(2)}</div>
            </div>
          )}
        </div>

        <div className="flex items-center space-x-4 pt-4 border-t border-gray-200">
          <button 
            type="submit" 
            className="inline-flex items-center px-6 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <Save className="w-4 h-4 mr-2" />
            {isEdit ? "Update Voucher" : "Save Voucher"}
          </button>
          <button 
            type="button" 
            onClick={() => navigate('/')} 
            className="inline-flex items-center px-6 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Cancel
          </button>
        </div>
      </form>
    </Layout>
  );
};

export default VoucherEntry;
