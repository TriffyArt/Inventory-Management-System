import React, { useEffect } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';

const BarcodeScanner = ({ onScan }) => {
  useEffect(() => {
    const scanner = new Html5QrcodeScanner("reader", { fps: 10, qrbox: 250 });
    scanner.render(onScan, console.error);
    return () => scanner.clear();
  }, [onScan]);

  return <div id="reader"></div>;
};

export default BarcodeScanner;