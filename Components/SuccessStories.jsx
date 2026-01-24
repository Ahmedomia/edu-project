export default function SuccessStories() {
  return (
    <section className="bg-white py-20">
      <div className="container mx-auto px-6">
        <h2 className="text-center text-3xl font-bold text-gray-900 mb-12">
          قصص نجاح من مجتمعنا
        </h2>
        <div dir="rtl" className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <TestimonialCard
            text="أداة ممتازة لإدارة الموارد البشرية في المدارس. قللت من الوقت المستغرق في فرز السير الذاتية بشكل كبير."
            name="د. فهد الغامدي"
            role="مشرف تربوي"
          />
          <TestimonialCard
            text="لم أتوقع أن أجد وظيفة تناسب مؤهلاتي بهذه السرعة. النظام سهل وساعدني على إبراز مهاراتي بشكل احترافي."
            name="سارة محمد"
            role="معلمة لغة إنجليزية"
          />
          <TestimonialCard
            text="من خلال المنصة استطعنا توظيف 5 معلمين متميزين في تخصصات نادرة خلال أسبوع واحد فقط. تجربة سلسة ونتائج مبهرة."
            name="أ. خالد العتيبي"
            role="مدير مدرسة – الرياض"
          />
        </div>
      </div>
    </section>
  );
}

function TestimonialCard({ text, name, role }) {
  return (
    <div className="relative bg-white rounded-2xl shadow-md p-6">
      <div className="absolute -top-4 right-6 bg-amber-400 text-white w-10 h-10 flex items-center justify-center rounded-full shadow">
        <span class="material-symbols-outlined">kid_star</span>
      </div>
      <p className="text-gray-600 leading-relaxed mb-6">“{text}”</p>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-gray-200 rounded-full" />
        <div>
          <p className="font-semibold text-gray-900">{name}</p>
          <p className="text-sm text-gray-500">{role}</p>
        </div>
      </div>
    </div>
  );
}
