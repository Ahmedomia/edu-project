export default function WhyChooseUs() {
  return (
    <section className="bg-gradient-to-r from-white to-slate-50 py-20">
      <div className="container mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="flex justify-center">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="h-3 w-32 bg-gray-200 rounded"></div>
              <div className="h-10 w-10 bg-gray-300 rounded-full"></div>
            </div>

            <div className="bg-blue-50 rounded-lg p-4">
              <div className="h-3 w-3/4 bg-blue-200 rounded mb-2"></div>
              <div className="h-3 w-full bg-blue-200 rounded"></div>
            </div>

            <div className="h-3 w-full bg-gray-200 rounded"></div>
            <div className="h-3 w-5/6 bg-gray-200 rounded"></div>
            <div className="h-3 w-2/3 bg-gray-200 rounded"></div>
          </div>
        </div>
        <div dir="rtl" className="text-right">
          <h2 className="text-3xl font-bold text-sky-800 mb-4 cursor-default">
            لماذا يختارنا قادة التعليم؟
          </h2>

          <p className="text-gray-600 mb-8 leading-relaxed cursor-default">
            نقدم مجموعة من الأدوات المتقدمة التي توفر الوقت والجهد في عملية
            التوظيف، مع ضمان الجودة والمصداقية في كل خطوة.
          </p>

          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="bg-sky-800 text-white p-3 rounded-lg">
                <span class="material-symbols-outlined">search</span>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 mb-1 cursor-default">
                  بحث ذكي وفلاتر دقيقة
                </h4>
                <p className="text-gray-600 text-sm cursor-default">
                  ابحث عن المعلمين حسب التخصص، الخبرة، الموقع الجغرافي،
                  والميزانية بدقة عالية.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="bg-sky-800 text-white p-3 rounded-lg">
                <span class="material-symbols-outlined">check</span>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 mb-1 cursor-default">
                  حسابات موثوقة
                </h4>
                <p className="text-gray-600 text-sm cursor-default">
                  نضمن هوية المدارس ومؤهلات المعلمين لخلق بيئة توظيف آمنة
                  ومهنية.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="bg-sky-800 text-white p-3 rounded-lg">
                <span class="material-symbols-outlined">school</span>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 mb-1 sky-800 cursor-default">
                  ملفات تعريفية شاملة للمدارس
                </h4>
                <p className="text-gray-600 text-sm cursor-default">
                  اعرض ثقافة مدرستك، مميزاتها، وبيئة العمل لجذب أفضل الكفاءات.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
