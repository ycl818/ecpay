import { NextResponse } from 'next/server';
import crypto from 'crypto';

const MERCHANT_ID = process.env.ECPAY_MERCHANT_ID;
const HASH_KEY = process.env.ECPAY_HASH_KEY;
const HASH_IV = process.env.ECPAY_HASH_IV;

export async function POST(request: Request) {
  const body = await request.json();
  const { amount, itemName, orderNumber } = body;

  const data = {
    MerchantID: MERCHANT_ID,
    MerchantTradeNo: orderNumber,
    MerchantTradeDate: new Date().toLocaleString('zh-TW', { timeZone: 'Asia/Taipei' }),
    PaymentType: 'aio',
    TotalAmount: amount,
    TradeDesc: 'Test Transaction',
    ItemName: itemName,
    ReturnURL: `${process.env.NEXT_PUBLIC_BASE_URL}/api/ecpay/callback`,
    ChoosePayment: 'Credit',
    EncryptType: '1',
  };

  const sortedData = Object.keys(data)
    .sort()
    .reduce((obj, key) => {
      obj[key] = data[key];
      return obj;
    }, {});

  const checkMacValue = generateCheckMacValue(sortedData);

  return NextResponse.json({ ...data, CheckMacValue: checkMacValue });
}

function generateCheckMacValue(data) {
  let checkValue = `HashKey=${HASH_KEY}`;
  Object.keys(data).forEach((key) => {
    checkValue += `&${key}=${data[key]}`;
  });
  checkValue += `&HashIV=${HASH_IV}`;

  checkValue = encodeURIComponent(checkValue).toLowerCase();
  checkValue = checkValue.replace(/%20/g, '+');
  checkValue = checkValue.replace(/[!'()]/g, escape);

  return crypto.createHash('sha256').update(checkValue).digest('hex').toUpperCase();
}

