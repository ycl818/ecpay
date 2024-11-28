'use client'

import { useState } from 'react';


interface ECPayButtonProps {
  amount: number;
  itemName: string;
}

export default function ECPayButton({ amount, itemName }: ECPayButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handlePayment = async () => {
    setIsLoading(true);
    try {
      const orderNumber = `ORDER${Date.now()}`;
      const response = await fetch('/api/ecpay', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount, itemName, orderNumber }),
      });

      const data = await response.json();

      // Create a form and submit it to ECPay
      const form = document.createElement('form');
      form.method = 'POST';
      form.action = 'https://payment-stage.ecpay.com.tw/Cashier/AioCheckOut/V5';

      Object.keys(data).forEach((key) => {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = key;
        input.value = data[key];
        form.appendChild(input);
      });

      document.body.appendChild(form);
      form.submit();
    } catch (error) {
      console.error('Payment initiation failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button onClick={handlePayment} disabled={isLoading}>
      {isLoading ? 'Processing...' : 'Pay with ECPay'}
    </button>
  );
}

