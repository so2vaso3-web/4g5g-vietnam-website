import QRCode from 'qrcode';

/**
 * Parse URL QR code từ VietQR để lấy bankCode và accountNumber
 * Format URL: https://img.vietqr.io/image/{bankCode}-{accountNumber}-{template}.jpg
 */
function parseVietQRUrl(qrCodeUrl: string): { bankCode: string; accountNumber: string; template: string; extension: string } | null {
  try {
    console.log('Parsing VietQR URL:', qrCodeUrl);
    
    // Format thực tế: https://img.vietqr.io/image/TCB-3456345670-compact.png
    // Format: {bankCode}-{accountNumber}-{template}.{extension}
    // Bank code có thể là: TCB, VCB, VTB, BID, etc. hoặc tên đầy đủ như vietinbank, techcombank
    // Regex pattern: match bankCode, accountNumber, template, và extension
    const match = qrCodeUrl.match(/vietqr\.io\/image\/([^-]+)-([^-]+)-([^.]+)\.(jpg|png|jpeg)/i);
    if (match) {
      const result = {
        bankCode: match[1],
        accountNumber: match[2],
        template: match[3],
        extension: match[4]
      };
      console.log('Parsed VietQR URL:', result);
      return result;
    }
    
    // Thử format khác: có thể không có template
    const match2 = qrCodeUrl.match(/vietqr\.io\/image\/([^-]+)-([^.]+)\.(jpg|png|jpeg)/i);
    if (match2) {
      const result = {
        bankCode: match2[1],
        accountNumber: match2[2],
        template: 'compact', // Default template
        extension: match2[3]
      };
      console.log('Parsed VietQR URL (no template):', result);
      return result;
    }
    
    console.error('Could not parse VietQR URL:', qrCodeUrl);
    return null;
  } catch (error) {
    console.error('Error parsing VietQR URL:', error);
    return null;
  }
}

/**
 * Tạo QR code động từ VietQR API với số tiền và nội dung chuyển khoản
 * Sử dụng VietQR API để tạo QR code có số tiền tự động điền
 */
export async function generateVietQRCode(
  qrCodeUrl: string,
  amount: number,
  content: string
): Promise<string> {
  // Parse URL để lấy thông tin
  const parsed = parseVietQRUrl(qrCodeUrl);
  if (!parsed) {
    console.error('Failed to parse VietQR URL:', qrCodeUrl);
    throw new Error('Invalid VietQR URL format');
  }
  
  const { bankCode, accountNumber, template, extension } = parsed;
  
  // Nội dung chuyển khoản cần được format đúng cách cho VietQR API
  // VietQR API yêu cầu nội dung không có ký tự đặc biệt, chỉ chữ, số, khoảng trắng
  // Loại bỏ các ký tự đặc biệt như dấu tiếng Việt, chỉ giữ chữ số và khoảng trắng
  const cleanContent = content
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Loại bỏ dấu tiếng Việt
    .replace(/[^a-zA-Z0-9\s]/g, '') // Chỉ giữ chữ, số, khoảng trắng
    .trim()
    .replace(/\s+/g, '-'); // Thay khoảng trắng bằng dấu gạch ngang (format URL-friendly)
  
  // Format URL VietQR API với số tiền và nội dung
  // Format VietQR API động: https://img.vietqr.io/image/{bankCode}-{accountNumber}-{amount}-{content}-{template}.{extension}
  // Ví dụ: https://img.vietqr.io/image/TCB-3456345670-80000-Thanh-toan-don-hang-order123-compact.png
  // Giữ nguyên template và extension từ URL gốc
  const vietQRUrl = `https://img.vietqr.io/image/${bankCode}-${accountNumber}-${amount}-${cleanContent}-${template}.${extension}`;
  
  console.log('Generated VietQR dynamic URL:', vietQRUrl);
  console.log('Parameters:', { 
    bankCode, 
    accountNumber, 
    amount, 
    content: cleanContent,
    originalContent: content,
    template,
    extension
  });
  
  // Trả về URL trực tiếp (browser sẽ load ảnh từ URL này)
  return vietQRUrl;
}

/**
 * Tạo QR code với thông tin thanh toán (số tiền và nội dung chuyển khoản)
 * Sử dụng VietQR API nếu có thông tin ngân hàng, nếu không thì tạo QR code local
 */
export async function generatePaymentQR(
  paymentMethod: 'momo' | 'zalopay' | 'bank',
  amount: number,
  orderId: string,
  customerName?: string,
  qrCodeUrl?: string
): Promise<string> {
  // Nội dung chuyển khoản
  const content = `Thanh toan don hang ${orderId}${customerName ? ` - ${customerName}` : ''}`;
  
  // Nếu có qrCodeUrl từ VietQR, parse và tạo QR code động với số tiền
  if (qrCodeUrl && qrCodeUrl.includes('vietqr.io')) {
    console.log('Generating VietQR dynamic code with URL:', qrCodeUrl);
    try {
      const vietQRCode = await generateVietQRCode(qrCodeUrl, amount, content);
      console.log('Successfully generated VietQR code:', vietQRCode);
      return vietQRCode;
    } catch (error) {
      console.error('Error generating VietQR code:', error);
      console.error('Falling back to local QR code generation');
      // Fallback về QR code local
    }
  } else {
    console.log('No VietQR URL provided or URL does not contain vietqr.io');
  }
  
  // Fallback: Tạo QR code local với format text
  const amountStr = amount.toString();
  let qrData: string;
  
  switch (paymentMethod) {
    case 'momo':
      qrData = `AMOUNT:${amountStr}|CONTENT:${content}|ORDER:${orderId}|METHOD:momo`;
      break;
    case 'zalopay':
      qrData = `AMOUNT:${amountStr}|CONTENT:${content}|ORDER:${orderId}|METHOD:zalopay`;
      break;
    case 'bank':
      qrData = `AMOUNT:${amountStr}|CONTENT:${content}|ORDER:${orderId}|METHOD:bank`;
      break;
    default:
      qrData = `AMOUNT:${amountStr}|CONTENT:${content}|ORDER:${orderId}`;
  }
  
  // Generate QR code image as data URL
  try {
    const qrDataURL = await QRCode.toDataURL(qrData, {
      width: 300,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    });
    
    return qrDataURL;
  } catch (error) {
    console.error('Error generating QR code:', error);
    throw error;
  }
}

/**
 * Tạo QR code từ base QR code (ảnh tĩnh) kết hợp với thông tin thanh toán
 * Nếu có base QR code, sẽ overlay thông tin thanh toán lên đó
 */
export async function generateQRWithBase(
  baseQRImage: string,
  amount: number,
  orderId: string,
  customerName?: string
): Promise<string> {
  // Nếu có base QR code, có thể decode và thêm thông tin
  // Hoặc đơn giản hơn: tạo QR code mới với format phù hợp
  const content = `Thanh toan don hang ${orderId}${customerName ? ` - ${customerName}` : ''}`;
  const qrData = `bank://pay?amount=${amount}&content=${encodeURIComponent(content)}`;
  
  try {
    const qrDataURL = await QRCode.toDataURL(qrData, {
      width: 300,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    });
    
    return qrDataURL;
  } catch (error) {
    console.error('Error generating QR code:', error);
    // Fallback về base QR code nếu có lỗi
    return baseQRImage;
  }
}

