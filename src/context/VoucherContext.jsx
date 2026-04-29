import React, { createContext, useContext, useState, useEffect } from 'react';

const VoucherContext = createContext();

export const VoucherProvider = ({ children }) => {
  const [vouchers, setVouchers] = useState(() => {
    const savedVouchers = localStorage.getItem('vouchers');
    return savedVouchers ? JSON.parse(savedVouchers) : [];
  });

  useEffect(() => {
    localStorage.setItem('vouchers', JSON.stringify(vouchers));
  }, [vouchers]);

  const addVoucher = (voucher) => {
    const newVoucher = {
      ...voucher,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    setVouchers((prev) => [...prev, newVoucher]);
    return newVoucher;
  };

  const updateVoucher = (id, updatedData) => {
    setVouchers((prev) =>
      prev.map((v) => (v.id === id ? { ...v, ...updatedData } : v))
    );
  };

  const deleteVoucher = (id) => {
    setVouchers((prev) => prev.filter((v) => v.id !== id));
  };

  const getVoucher = (id) => vouchers.find((v) => v.id === id);

  return (
    <VoucherContext.Provider value={{ vouchers, addVoucher, updateVoucher, deleteVoucher, getVoucher }}>
      {children}
    </VoucherContext.Provider>
  );
};

export const useVouchers = () => useContext(VoucherContext);
