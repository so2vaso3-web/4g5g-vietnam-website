interface PaymentMethodSelectorProps {
  paymentMethod: 'momo' | 'zalopay' | 'bank';
  onPaymentMethodChange: (method: 'momo' | 'zalopay' | 'bank') => void;
  availableMethods: {
    momo?: boolean;
    zalopay?: boolean;
    bank?: boolean;
  };
}

export default function PaymentMethodSelector({
  paymentMethod,
  onPaymentMethodChange,
  availableMethods,
}: PaymentMethodSelectorProps) {
  return (
    <>
      {/* MoMo Payment Button */}
      {availableMethods.momo && (
        <button
          onClick={() => onPaymentMethodChange('momo')}
          className={`w-full p-2.5 sm:p-4 rounded-lg border-2 transition-all relative ${
            paymentMethod === 'momo'
              ? 'border-pink-400 bg-pink-600/20 shadow-lg shadow-pink-500/20'
              : 'border-gray-600 bg-gray-800 hover:border-gray-500'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-lg flex items-center justify-center flex-shrink-0 ${
              paymentMethod === 'momo' ? 'bg-pink-600' : 'bg-gray-700'
            }`}>
              <i className="fas fa-mobile-alt text-2xl sm:text-3xl text-white"></i>
            </div>
            <div className="flex-1 text-left">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-white text-base sm:text-lg">MoMo</span>
                {paymentMethod === 'momo' && (
                  <i className="fas fa-check-circle text-green-400 text-sm"></i>
                )}
              </div>
              <span className="text-gray-400 text-xs sm:text-sm">Thanh toán qua ví MoMo</span>
            </div>
            {paymentMethod === 'momo' && (
              <div className="text-pink-400">
                <i className="fas fa-chevron-right"></i>
              </div>
            )}
          </div>
        </button>
      )}

      {/* ZaloPay Payment Button */}
      {availableMethods.zalopay && (
        <button
          onClick={() => onPaymentMethodChange('zalopay')}
          className={`w-full p-2.5 sm:p-4 rounded-lg border-2 transition-all relative ${
            paymentMethod === 'zalopay'
              ? 'border-green-400 bg-green-600/20 shadow-lg shadow-green-500/20'
              : 'border-gray-600 bg-gray-800 hover:border-gray-500'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-lg flex items-center justify-center flex-shrink-0 ${
              paymentMethod === 'zalopay' ? 'bg-green-600' : 'bg-gray-700'
            }`}>
              <i className="fab fa-zalo text-2xl sm:text-3xl text-white"></i>
            </div>
            <div className="flex-1 text-left">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-white text-base sm:text-lg">ZaloPay</span>
                {paymentMethod === 'zalopay' && (
                  <i className="fas fa-check-circle text-green-400 text-sm"></i>
                )}
              </div>
              <span className="text-gray-400 text-xs sm:text-sm">Thanh toán qua ví ZaloPay</span>
            </div>
            {paymentMethod === 'zalopay' && (
              <div className="text-green-400">
                <i className="fas fa-chevron-right"></i>
              </div>
            )}
          </div>
        </button>
      )}

      {/* Bank Payment Button */}
      {availableMethods.bank && (
        <button
          onClick={() => onPaymentMethodChange('bank')}
          className={`w-full p-2.5 sm:p-4 rounded-lg border-2 transition-all relative ${
            paymentMethod === 'bank'
              ? 'border-green-400 bg-green-600/20 shadow-lg shadow-green-500/20'
              : 'border-gray-600 bg-gray-800 hover:border-gray-500'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-lg flex items-center justify-center flex-shrink-0 ${
              paymentMethod === 'bank' ? 'bg-green-600' : 'bg-gray-700'
            }`}>
              <i className="fas fa-university text-2xl sm:text-3xl text-white"></i>
            </div>
            <div className="flex-1 text-left">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-white text-base sm:text-lg">Chuyển Khoản Ngân Hàng</span>
                {paymentMethod === 'bank' && (
                  <i className="fas fa-check-circle text-green-400 text-sm"></i>
                )}
              </div>
              <span className="text-gray-400 text-xs sm:text-sm">Chuyển khoản qua ngân hàng</span>
            </div>
            {paymentMethod === 'bank' && (
              <div className="text-green-400">
                <i className="fas fa-chevron-right"></i>
              </div>
            )}
          </div>
        </button>
      )}
    </>
  );
}




