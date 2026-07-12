/**
 * VNPay integration utilities
 */

import crypto from 'crypto';

export interface VNPayConfig {
  tmnCode: string;
  hashSecret: string;
  url: string;
  returnUrl: string;
}

export interface VNPayPaymentParams {
  vnp_Amount: number;
  vnp_Command: string;
  vnp_CreateDate: string;
  vnp_CurrCode: string;
  vnp_IpAddr: string;
  vnp_Locale: string;
  vnp_OrderInfo: string;
  vnp_OrderType: string;
  vnp_ReturnUrl: string;
  vnp_TmnCode: string;
  vnp_TxnRef: string;
  vnp_Version: string;
  vnp_SecureHash?: string;
}

export function createVNPayPaymentUrl(
  orderId: string,
  amount: number,
  orderInfo: string,
  returnUrl: string,
  config: VNPayConfig
): string {
  const date = new Date();
  const createDate = date.toISOString().replace(/[-:]/g, '').split('.')[0] + '00';
  
  const params: VNPayPaymentParams = {
    vnp_Amount: amount * 100,
    vnp_Command: 'pay',
    vnp_CreateDate: createDate,
    vnp_CurrCode: 'VND',
    vnp_IpAddr: '127.0.0.1',
    vnp_Locale: 'vn',
    vnp_OrderInfo: orderInfo,
    vnp_OrderType: 'other',
    vnp_ReturnUrl: returnUrl,
    vnp_TmnCode: config.tmnCode,
    vnp_TxnRef: orderId,
    vnp_Version: '2.1.0',
  };
  
  const sortedParams = Object.keys(params)
    .sort()
    .filter(key => params[key as keyof VNPayPaymentParams] !== undefined && params[key as keyof VNPayPaymentParams] !== '')
    .map(key => `${key}=${encodeURIComponent(params[key as keyof VNPayPaymentParams] as string)}`)
    .join('&');
  
  const secureHash = crypto
    .createHmac('sha512', config.hashSecret)
    .update(sortedParams)
    .digest('hex');
  
  return `${config.url}?${sortedParams}&vnp_SecureHash=${secureHash}`;
}

export function verifyVNPayCallback(query: any, hashSecret: string): boolean {
  try {
    const secureHash = query.vnp_SecureHash;
    delete query.vnp_SecureHash;
    delete query.vnp_SecureHashType;
    
    const sortedParams = Object.keys(query)
      .sort()
      .filter(key => query[key] !== undefined && query[key] !== '')
      .map(key => `${key}=${encodeURIComponent(query[key])}`)
      .join('&');
    
    const checkSum = crypto
      .createHmac('sha512', hashSecret)
      .update(sortedParams)
      .digest('hex');
    
    return secureHash === checkSum;
  } catch (error) {
    console.error('VNPay verification error:', error);
    return false;
  }
}
