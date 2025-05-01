import React, { useEffect, useRef } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';

const BarcodeScanner = ({ onScan }) => {
  const scannerRef = useRef(null);

  useEffect(() => {
    if (!scannerRef.current) {
      scannerRef.current = new Html5QrcodeScanner('reader', {
        fps: 10,
        qrbox: { width: 200, height: 200 },
        disableFlip: false,
        rememberLastUsedCamera: true
      });

      scannerRef.current.render(handleSuccess, handleError);
    }

    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear().catch(console.error);
        scannerRef.current = null;
      }
    };
  }, []);

  const handleSuccess = (decodedText) => {
    const beep = new Audio('/beepp.mp3'); // Place `beep.mp3` in your public folder
    beep.play();
    onScan(decodedText);
  };

  const handleError = (err) => {
    // Ignore to reduce console noise
  };

  return <div id="reader" className="w-full max-w-sm mx-auto"></div>;
};

export default BarcodeScanner;
