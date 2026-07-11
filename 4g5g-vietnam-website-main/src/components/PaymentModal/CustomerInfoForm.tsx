interface CustomerInfoFormProps {
  customerInfo: {
    name: string;
    email: string;
    phone: string;
  };
  errors: Record<string, string>;
  onCustomerInfoChange: (info: { name: string; email: string; phone: string }) => void;
  onEmailBlur: () => void;
  onPhoneBlur: () => void;
  onContinue: () => void;
  isFormValid: () => boolean;
  formatPhoneNumber: (value: string) => string;
}

export default function CustomerInfoForm({
  customerInfo,
  errors,
  onCustomerInfoChange,
  onEmailBlur,
  onPhoneBlur,
  onContinue,
  isFormValid,
  formatPhoneNumber,
}: CustomerInfoFormProps) {
  return (
    <div className="space-y-2 sm:space-y-4">
      {/* Important Notice */}
      <div className="bg-[#1A2036] border border-[#36405B] rounded-lg p-2 sm:p-4 mb-1 sm:mb-2">
        <div className="flex items-start gap-2 sm:gap-3">
          <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-red-500 flex items-center justify-center flex-shrink-0 mt-0.5">
            <i className="fas fa-info text-white text-xs sm:text-sm"></i>
          </div>
          <div className="flex-1">
            <h4 className="font-semibold text-red-400 mb-0.5 sm:mb-1 text-xs sm:text-base">Thông Báo Quan Trọng</h4>
            <p className="text-gray-300 text-[11px] sm:text-sm leading-relaxed">
              Vui lòng nhập <strong className="text-white">thông tin chính xác và đúng đắn</strong>. Thông tin này sẽ được sử dụng để kích hoạt gói cước của bạn. Thông tin không chính xác có thể dẫn đến việc trì hoãn hoặc không nhận được gói dịch vụ.
            </p>
          </div>
        </div>
      </div>

      <div>
        <label className="block mb-1 sm:mb-2 font-medium text-gray-300 text-xs sm:text-base">
          Họ và Tên <span className="text-red-400">*</span>
        </label>
        <input
          type="text"
          value={customerInfo.name}
          onChange={(e) => onCustomerInfoChange({ ...customerInfo, name: e.target.value })}
          className={`w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-gray-800 border rounded-lg text-white placeholder-gray-500 focus:outline-none transition-colors text-base min-h-[44px] ${
            errors.name ? 'border-red-500' : 'border-gray-600 focus:border-gray-400'
          }`}
          placeholder="Nguyễn Văn A"
        />
        {errors.name && (
          <p className="text-red-400 text-[10px] sm:text-sm mt-1">
            {errors.name}
          </p>
        )}
      </div>

      <div>
        <label className="block mb-1 sm:mb-2 font-medium text-gray-300 text-xs sm:text-base">
          Địa chỉ Email <span className="text-red-400">*</span>
        </label>
        <input
          type="email"
          value={customerInfo.email}
          onChange={(e) => {
            onCustomerInfoChange({ ...customerInfo, email: e.target.value });
          }}
          onBlur={onEmailBlur}
          className={`w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-gray-800 border rounded-lg text-white placeholder-gray-500 focus:outline-none transition-colors text-base min-h-[44px] ${
            errors.email ? 'border-red-500 focus:border-red-500' : 'border-gray-600 focus:border-gray-400'
          }`}
          placeholder="nguyenvana@gmail.com"
        />
        {errors.email && (
          <p className="text-red-400 text-[10px] sm:text-sm mt-1">
            {errors.email}
          </p>
        )}
      </div>

      <div>
        <label className="block mb-1 sm:mb-2 font-medium text-gray-300 text-xs sm:text-base">
          Số Điện Thoại <span className="text-red-400">*</span>
        </label>
        <input
          type="tel"
          value={customerInfo.phone}
          onChange={(e) => {
            const formatted = formatPhoneNumber(e.target.value);
            onCustomerInfoChange({ ...customerInfo, phone: formatted });
          }}
          onBlur={onPhoneBlur}
          maxLength={14}
          className={`w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-gray-800 border rounded-lg text-white placeholder-gray-500 focus:outline-none transition-colors text-base min-h-[44px] ${
            errors.phone ? 'border-red-500 focus:border-red-500' : 'border-gray-600 focus:border-gray-400'
          }`}
          placeholder="(012) 345-6789"
        />
        <p className="text-gray-500 text-[9px] sm:text-xs mt-1">
          Vui lòng nhập số điện thoại Việt Nam (10 chữ số, bắt đầu bằng 0). Ví dụ: 0123456789
        </p>
        {errors.phone && (
          <p className="text-red-400 text-[10px] sm:text-sm mt-1">
            {errors.phone}
          </p>
        )}
      </div>

      <button
        onClick={onContinue}
        disabled={!isFormValid()}
        className={`w-full px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg font-medium transition-all duration-300 flex items-center justify-center gap-2 mt-3 sm:mt-6 text-sm sm:text-base min-h-[44px] ${
          isFormValid()
            ? 'bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 shadow-lg hover:shadow-blue-500/50 cursor-pointer'
            : 'bg-gray-700/50 text-gray-500 cursor-not-allowed opacity-50'
        }`}
        style={isFormValid() ? { color: '#ffffff' } : undefined}
      >
        <span style={isFormValid() ? { color: '#ffffff', fontWeight: '600' } : undefined}>Tiếp Tục Thanh Toán</span>
        <i className={`fas fa-arrow-right text-xs sm:text-sm ${isFormValid() ? '' : 'opacity-50'}`} style={isFormValid() ? { color: '#ffffff' } : undefined}></i>
      </button>
    </div>
  );
}




