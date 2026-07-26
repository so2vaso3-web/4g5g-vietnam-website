/**
 * ZaloPay integration utilities
 */

import crypto from 'crypto';
import axios from 'axios';

export interface ZaloPayConfig {
  appId: string;
  key1: string;
  key2: string;
  endpoint: string;
}

export interface ZaloPayPaymentRequest {
  app_id: string;
  app_user: string;
  app_time: number;
  amount: number;
  app_trans_id: string;
  embed_data: string;
  item: string;
  description: string;
  bank_code?: string;
  mac?: string;
}

export async function createZaloPayPayment(
  orderId: string,
  amount: number,
  description: string,
  callbackUrl: string,
  config: ZaloPayConfig
): Promise<string> {
  const appTime = Date.now();
  const appTransId = `${appTime}_${orderId}`;
  const appUser = 'Mạng Việt Nam';
  
  const embedData = JSON.stringify({});
  const item = JSON.stringify([{ name: description, quantity: 1, price: amount }]);
  
  const data = `${config.appId}|${appTransId}|${appUser}|${amount}|${appTime}|${embedData}|${item}`;
  const mac = crypto
    .createHmac('sha256', config.key1)
    .update(data)
    .digest('hex');
  
  const requestData: ZaloPayPaymentRequest = {
    app_id: config.appId,
    app_user: appUser,
    app_time: appTime,
    amount,
    app_trans_id: appTransId,
    embed_data: embedData,
    item,
    description,
    mac,
  };
  
  try {
    const response = await axios.post(config.endpoint, requestData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (response.data.return_code === 1 && response.data.order_url) {
      return response.data.order_url;
    }
    
    throw new Error(`ZaloPay payment failed: ${response.data.return_message || 'Unknown error'}`);
  } catch (error: any) {
    console.error('ZaloPay payment error:', error);
    throw new Error(`ZaloPay payment failed: ${error.message}`);
  }
}

export function verifyZaloPayCallback(data: any, key2: string): boolean {
  try {
    const mac = data.mac;
    delete data.mac;
    
    const dataStr = Object.keys(data)
      .sort()
      .map(key => `${key}=${data[key]}`)
      .join('&');
    
    const checkSum = crypto
      .createHmac('sha256', key2)
      .update(dataStr)
      .digest('hex');
    
    return mac === checkSum;
  } catch (error) {
    console.error('ZaloPay verification error:', error);
    return false;
  }
}
