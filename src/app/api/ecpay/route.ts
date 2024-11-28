import { NextResponse } from 'next/server';
import crypto from 'crypto';

const MERCHANT_ID = process.env.MERCHANTID;
const HASH_KEY = process.env.HASHKEY?.trim();
const HASH_IV = process.env.HASHIV?.trim();

interface PaymentData {
  MerchantID: string;
  MerchantTradeNo: string;
  MerchantTradeDate: string;
  PaymentType: string;
  TotalAmount: number;
  TradeDesc: string;
  ItemName: string;
  ReturnURL: string;
  ChoosePayment: string;
  EncryptType: string;
}

interface RequestBody {
  amount: number;
  itemName: string;
  orderNumber: string;
}

export async function POST(request: Request) {
  const body: RequestBody = await request.json();
  const { amount, itemName, orderNumber } = body;

  if (!MERCHANT_ID || !HASH_KEY || !HASH_IV) {
    throw new Error('Missing required environment variables');
  }

  const data: PaymentData = {
    MerchantID: MERCHANT_ID,
    MerchantTradeNo: orderNumber,
    MerchantTradeDate: new Date().toLocaleString('zh-TW', { timeZone: 'Asia/Taipei' }),
    PaymentType: 'aio',
    TotalAmount: amount,
    TradeDesc: 'Test Transaction',
    ItemName: itemName,
    ReturnURL: `${process.env.HOST}/api/ecpay/callback`,
    ChoosePayment: 'Credit',
    EncryptType: '1',
  };

  const sortedData = Object.keys(data)
    .sort()
    .reduce<Record<keyof PaymentData, string | number>>((obj, key) => {
      const typedKey = key as keyof PaymentData;
      obj[typedKey] = data[typedKey].toString();
      return obj;
    }, {} as Record<keyof PaymentData, string | number>);

  const checkMacValue = generateCheckMacValue(sortedData);

  return NextResponse.json({ ...data, CheckMacValue: checkMacValue });
}

function generateCheckMacValue(data: Record<keyof PaymentData, string | number>): string {
  let checkValue = `HashKey=${HASH_KEY?.trim()}`;
  Object.keys(data).forEach((key) => {
    checkValue += `&${key}=${data[key as keyof PaymentData]}`;
  });
  checkValue += `&HashIV=${HASH_IV?.trim()}`;

  checkValue = encodeURIComponent(checkValue).toLowerCase();
  checkValue = checkValue.replace(/%20/g, '+');
  checkValue = checkValue.replace(/[!'()]/g, escape);

  return crypto.createHash('sha256').update(checkValue).digest('hex').toUpperCase();
}

