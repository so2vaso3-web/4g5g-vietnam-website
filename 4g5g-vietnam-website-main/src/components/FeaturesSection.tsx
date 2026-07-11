'use client';

export default function FeaturesSection() {
  const features = [
    {
      icon: 'fas fa-rocket',
      title: 'Kích Hoạt Siêu Nhanh',
      description: 'Kích hoạt gói cước của bạn trong vài phút, không phải vài giờ. Thiết lập tức thì và truy cập ngay vào mạng tốc độ cao.',
      gradient: 'from-orange-500 via-yellow-500 to-orange-600',
      iconBg: 'bg-gradient-to-br from-orange-500/20 to-yellow-500/20',
    },
    {
      icon: 'fas fa-wifi',
      title: 'Sẵn Sàng 4G & 5G',
      description: 'Truy cập mạng 4G và 5G mới nhất từ tất cả các nhà mạng lớn. Trải nghiệm tốc độ internet cực nhanh.',
      gradient: 'from-blue-500 via-cyan-500 to-blue-600',
      iconBg: 'bg-gradient-to-br from-blue-500/20 to-cyan-500/20',
    },
    {
      icon: 'fas fa-tags',
      title: 'Giá Tốt Nhất Đảm Bảo',
      description: 'So sánh giá từ tất cả các nhà mạng và tiết kiệm lên đến 50% hóa đơn hàng tháng. Chúng tôi cung cấp các gói tốt nhất.',
      gradient: 'from-green-500 via-emerald-500 to-green-600',
      iconBg: 'bg-gradient-to-br from-green-500/20 to-emerald-500/20',
    },
    {
      icon: 'fas fa-sync-alt',
      title: 'Thay Đổi Gói Dễ Dàng',
      description: 'Chuyển đổi gói cước hoặc nhà mạng bất cứ lúc nào không có phí ẩn. Nâng cấp hoặc hạ cấp theo nhu cầu của bạn.',
      gradient: 'from-purple-500 via-pink-500 to-purple-600',
      iconBg: 'bg-gradient-to-br from-red-500/20 to-blue-500/20',
    },
    {
      icon: 'fas fa-shield-alt',
      title: '100% An Toàn',
      description: 'Thông tin thanh toán và cá nhân của bạn được bảo vệ bằng mã hóa cấp ngân hàng. Chúng tôi không bao giờ chia sẻ dữ liệu của bạn.',
      gradient: 'from-red-500 via-rose-500 to-red-600',
      iconBg: 'bg-gradient-to-br from-red-500/20 to-rose-500/20',
    },
    {
      icon: 'fas fa-headset',
      title: 'Hỗ Trợ Chuyên Nghiệp',
      description: 'Đội ngũ chuyên gia mạng của chúng tôi sẵn sàng 24/7 để giúp bạn chọn gói cước hoàn hảo và giải quyết mọi vấn đề.',
      gradient: 'from-indigo-500 via-purple-500 to-indigo-600',
      iconBg: 'bg-gradient-to-br from-indigo-500/20 to-purple-500/20',
    },
  ];

  return (
    <section className="py-12 px-4 bg-white relative -mt-4">
      <div className="container mx-auto max-w-6xl relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-red-600 to-blue-600 bg-clip-text text-transparent">
            Tại Sao Chọn Chúng Tôi?
          </h2>
          <p className="text-gray-600 max-w-3xl mx-auto text-lg leading-relaxed">
            Chúng tôi không chỉ là nhà phân phối - chúng tôi là đối tác đáng tin cậy của bạn trong việc tìm gói cước di động hoàn hảo phù hợp với lối sống và ngân sách của bạn.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className="bg-white rounded-xl sm:rounded-2xl p-5 sm:p-6 md:p-8 border border-gray-200 hover:border-blue-500 transition-all duration-300 hover:transform hover:scale-[1.02] hover:shadow-2xl hover:shadow-blue-500/20 group relative overflow-hidden h-full flex flex-col"
            >
              <div className="relative z-10">
                <div className={`w-16 h-16 sm:w-20 sm:h-20 md:w-20 md:h-20 rounded-xl sm:rounded-2xl ${feature.iconBg} border-2 border-gray-200 flex items-center justify-center mb-4 sm:mb-5 md:mb-6 group-hover:scale-110 group-hover:border-blue-500/50 transition-all duration-300 shadow-xl group-hover:shadow-blue-500/30 relative overflow-hidden mx-auto sm:mx-0`}>
                  <i className={`${feature.icon} text-2xl sm:text-2xl md:text-3xl text-gray-700 relative z-10 group-hover:scale-110 transition-transform duration-300`}></i>
                </div>
                <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3 text-gray-800 group-hover:bg-gradient-to-r group-hover:from-red-600 group-hover:to-blue-600 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300 text-center sm:text-left">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed text-xs sm:text-sm text-center sm:text-left">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Additional Trust Elements */}
        <div className="mt-8 sm:mt-10 md:mt-12 pt-6 sm:pt-8 md:pt-10 border-t border-gray-200">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-5 md:gap-6 text-center">
            <div className="p-4 sm:p-5 md:p-6 bg-gradient-to-br from-blue-500/10 to-transparent rounded-xl border border-blue-500/20 relative overflow-visible group hover:border-blue-500/50 transition-all duration-300 hover:scale-105">
              <div className="absolute top-2 right-2 cursor-pointer group/tick">
                <div className="relative inline-block">
                  <div className="absolute inset-0 bg-green-400 rounded-full opacity-30 animate-ping -inset-1 scale-150"></div>
                  <i className="fas fa-check-circle text-green-400 text-base sm:text-lg group-hover/tick:scale-110 transition-all duration-300 relative" style={{ 
                    filter: 'drop-shadow(0 0 6px rgba(34, 197, 94, 0.9))',
                    textShadow: '0 0 8px rgba(34, 197, 94, 0.7)'
                  }} title="Verified"></i>
                </div>
                <div className="absolute bottom-full right-0 mb-2 px-3 py-1.5 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover/tick:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap border border-white/20 shadow-xl z-50">
                  Đã Xác Minh
                  <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                </div>
              </div>
              <i className="fas fa-certificate text-3xl sm:text-4xl text-blue-400 mb-3 sm:mb-4"></i>
              <h4 className="font-bold text-base sm:text-lg mb-2">Đối Tác Được Chứng Nhận</h4>
              <p className="text-gray-400 text-xs sm:text-sm">
                Nhà phân phối được ủy quyền cho tất cả các nhà mạng lớn Việt Nam
              </p>
            </div>
            <div className="p-4 sm:p-5 md:p-6 bg-gradient-to-br from-cyan-500/10 to-transparent rounded-xl border border-cyan-500/20 relative overflow-visible group hover:border-cyan-500/50 transition-all duration-300 hover:scale-105">
              <div className="absolute top-2 right-2 cursor-pointer group/tick">
                <div className="relative inline-block">
                  <div className="absolute inset-0 bg-green-400 rounded-full opacity-30 animate-ping -inset-1 scale-150"></div>
                  <i className="fas fa-check-circle text-green-400 text-base sm:text-lg group-hover/tick:scale-110 transition-all duration-300 relative" style={{ 
                    filter: 'drop-shadow(0 0 6px rgba(34, 197, 94, 0.9))',
                    textShadow: '0 0 8px rgba(34, 197, 94, 0.7)'
                  }} title="Verified"></i>
                </div>
                <div className="absolute bottom-full right-0 mb-2 px-3 py-1.5 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover/tick:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap border border-white/20 shadow-xl z-50">
                  Đã Xác Minh
                  <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                </div>
              </div>
              <i className="fas fa-certificate text-3xl sm:text-4xl text-cyan-400 mb-3 sm:mb-4"></i>
              <h4 className="font-bold text-base sm:text-lg mb-2">Nhà Phân Phối Chính Thức</h4>
              <p className="text-gray-400 text-xs sm:text-sm">
                Được ủy quyền chính thức để bán gói cước từ các nhà mạng lớn
              </p>
            </div>
            <div className="p-4 sm:p-5 md:p-6 bg-gradient-to-br from-purple-500/10 to-transparent rounded-xl border border-purple-500/20 relative overflow-visible group hover:border-purple-500/50 transition-all duration-300 hover:scale-105">
              <div className="absolute top-2 right-2 cursor-pointer group/tick">
                <div className="relative inline-block">
                  <div className="absolute inset-0 bg-green-400 rounded-full opacity-30 animate-ping -inset-1 scale-150"></div>
                  <i className="fas fa-check-circle text-green-400 text-base sm:text-lg group-hover/tick:scale-110 transition-all duration-300 relative" style={{ 
                    filter: 'drop-shadow(0 0 6px rgba(34, 197, 94, 0.9))',
                    textShadow: '0 0 8px rgba(34, 197, 94, 0.7)'
                  }} title="Verified"></i>
                </div>
                <div className="absolute bottom-full right-0 mb-2 px-3 py-1.5 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover/tick:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap border border-white/20 shadow-xl z-50">
                  Đã Xác Minh
                  <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                </div>
              </div>
              <i className="fas fa-lock text-3xl sm:text-4xl text-purple-400 mb-3 sm:mb-4"></i>
              <h4 className="font-bold text-base sm:text-lg mb-2">Giao Dịch An Toàn</h4>
              <p className="text-gray-400 text-xs sm:text-sm">
                Xử lý thanh toán tuân thủ PCI DSS
              </p>
            </div>
            <div className="p-4 sm:p-5 md:p-6 bg-gradient-to-br from-green-500/10 to-transparent rounded-xl border border-green-500/20 relative overflow-visible group hover:border-green-500/50 transition-all duration-300 hover:scale-105">
              <div className="absolute top-2 right-2 cursor-pointer group/tick">
                <div className="relative inline-block">
                  <div className="absolute inset-0 bg-green-400 rounded-full opacity-30 animate-ping -inset-1 scale-150"></div>
                  <i className="fas fa-check-circle text-green-400 text-base sm:text-lg group-hover/tick:scale-110 transition-all duration-300 relative" style={{ 
                    filter: 'drop-shadow(0 0 6px rgba(34, 197, 94, 0.9))',
                    textShadow: '0 0 8px rgba(34, 197, 94, 0.7)'
                  }} title="Verified"></i>
                </div>
                <div className="absolute bottom-full right-0 mb-2 px-3 py-1.5 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover/tick:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap border border-white/20 shadow-xl z-50">
                  Đã Xác Minh
                  <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                </div>
              </div>
              <i className="fas fa-handshake text-3xl sm:text-4xl text-green-400 mb-3 sm:mb-4"></i>
              <h4 className="font-bold text-base sm:text-lg mb-2">Đảm Bảo Hoàn Tiền</h4>
              <p className="text-gray-400 text-xs sm:text-sm">
                Đảm bảo hài lòng 30 ngày cho tất cả các gói cước
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

