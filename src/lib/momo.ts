/**
 * MoMo integration utilities
 */

import crypto from 'crypto';
import axios from 'axios';

export interface MoMoConfig {
  partnerCode: string;
  accessKey: string;
  secretKey: string;
  endpoint: string;
}

export interface MoMoPaymentRequest {
  partnerCode: string;
  partnerName?: string;
  storeId?: string;
  requestId: string;
  amount: number;
  orderId: string;
  orderInfo: string;
  redirectUrl: string;
  ipnUrl: string;
  lang: string;
  extraData?: string;
  requestType: string;
  autoCapture: boolean;
  orderGroupId?: string;
  signature: string;
}

export async function createMoMoPayment(
  orderId: string,
  amount: number,
  orderInfo: string,
  redirectUrl: string,
  ipnUrl: string,
  config: MoMoConfig
): Promise<string> {
  const requestId = `${Date.now()}`;
  const extraData = '';
  
  const rawSignature = `accessKey=${config.accessKey}&amount=${amount}&extraData=${extraData}&ipnUrl=${ipnUrl}&orderId=${orderId}&orderInfo=${orderInfo}&partnerCode=${config.partnerCode}&redirectUrl=${redirectUrl}&requestId=${requestId}&requestType=captureWallet`;
  const signature = crypto
    .createHmac('sha256', config.secretKey)
    .update(rawSignature)
    .digest('hex');
  
  const requestData: MoMoPaymentRequest = {
    partnerCode: config.partnerCode,
    partnerName: 'Mạng Việt Nam',
    requestId,
    amount,
    orderId,
    orderInfo,
    redirectUrl,
    ipnUrl,
    lang: 'vi',
    extraData,
    requestType: 'captureWallet',
    autoCapture: true,
    signature,
  };
  
  try {
    const response = await axios.post(config.endpoint, requestData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (response.data.payUrl) {
      return response.data.payUrl;
    }
    
    throw new Error('MoMo payment URL not found in response');
  } catch (error: any) {
    console.error('MoMo payment error:', error);
    throw new Error(`MoMo payment failed: ${error.message}`);
  }
}

export function verifyMoMoCallback(data: any, secretKey: string): boolean {
  try {
    const signature = data.signature;
    delete data.signature;
    
    const rawSignature = Object.keys(data)
      .sort()
      .map(key => `${key}=${data[key]}`)
      .join('&');
    
    const checkSum = crypto
      .createHmac('sha256', secretKey)
      .update(rawSignature)
      .digest('hex');
    
    return signature === checkSum;
  } catch (error) {
    console.error('MoMo verification error:', error);
    return false;
  }
}
