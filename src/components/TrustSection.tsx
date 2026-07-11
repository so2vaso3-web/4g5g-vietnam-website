'use client';

export default function TrustSection() {
  const trustItems = [
    {
      icon: 'fas fa-shield-alt',
      title: 'Thanh Toán An Toàn',
      description: 'Mã hóa SSL 256-bit',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      icon: 'fas fa-users',
      title: '50,000+ Khách Hàng',
      description: 'Được tin dùng bởi hàng nghìn người',
      color: 'from-red-600 to-blue-600',
    },
    {
      icon: 'fas fa-award',
      title: 'Giải Thưởng',
      description: 'Dịch Vụ Tốt Nhất 2025',
      color: 'from-yellow-500 to-orange-500',
    },
    {
      icon: 'fas fa-clock',
      title: 'Hỗ Trợ 24/7',
      description: 'Luôn sẵn sàng hỗ trợ',
      color: 'from-green-500 to-emerald-500',
    },
  ];

  return (
    <section className="py-16 px-4 bg-white relative">
      <div className="container mx-auto relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-red-600 to-blue-600 bg-clip-text text-transparent">
            Đáng Tin Cậy & An Toàn
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Bảo mật dữ liệu và sự hài lòng của bạn là ưu tiên hàng đầu của chúng tôi
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {trustItems.map((item, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl p-6 border border-gray-200 hover:border-blue-500/50 transition-all duration-300 hover:transform hover:scale-105 hover:shadow-xl hover:shadow-blue-500/20 text-center group"
            >
              <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${item.color} flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                <i className={`${item.icon} text-2xl text-white`}></i>
              </div>
              <h3 className="text-lg font-bold mb-2 text-gray-800 group-hover:text-blue-600 transition-colors">{item.title}</h3>
              <p className="text-sm text-gray-600">{item.description}</p>
            </div>
          ))}
        </div>

        {/* Trust Badges */}
        <div className="mt-12 pt-12 border-t border-gray-200">
          <div className="flex flex-wrap items-center justify-center gap-8">
            <div className="flex items-center gap-2 text-gray-600">
              <i className="fas fa-lock text-blue-600"></i>
              <span className="text-sm">Bảo Mật SSL</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <i className="fas fa-check-circle text-green-600"></i>
              <span className="text-sm">Tuân Thủ PCI</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <i className="fas fa-shield-alt text-purple-600"></i>
              <span className="text-sm">Dữ Liệu Được Bảo Vệ</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <i className="fas fa-certificate text-yellow-600"></i>
              <span className="text-sm">Đối Tác Được Chứng Nhận</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

