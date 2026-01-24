import heroImage from "../src/assets/hero.jpg";
import { useNavigate } from "react-router-dom";

const Hero = () => {
  const navigate = useNavigate();
  return (
    <div className="flex h-screen bg-slate-50">
      <div className="hidden lg:block w-1/2 relative">
        <img
          src={heroImage}
          alt="Audience"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-white/90 via-white/750 to-transparent"></div>
      </div>
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 lg:px-20 text-right">
        <span className="mb-6 inline-block rounded-full bg-sky-100 px-4 py-2 text-sm text-sky-700">
          المنصة رقم #1 للتوظيف التعليمي
        </span>

        <h1 className="text-4xl lg:text-5xl font-bold leading-tight mb-6">
          بوابتك لمستقبل
          <br />
          <span className="text-sky-900">تعليمي واعد</span>
        </h1>

        <p className="text-slate-600 mb-8 max-w-xl">
          نجمع بين شغف المعلمين واحتياجات المدارس في منصة واحدة ذكية. سواء كنت
          تبحث عن وظيفتك القادمة أو عن كفاءات متميزة، نحن هنا لخدمتك.
        </p>

        <div className="flex gap-4 justify-end mb-8">
          <button
            onClick={() => navigate("/Register")}
            className="bg-sky-800 text-white px-6 py-3 rounded-lg hover:bg-sky-900 transition"
          >
            ابدأ رحلتك الآن
          </button>

          <button
            onClick={() => navigate("/Login")}
            className="border border-sky-800 text-sky-800 px-6 py-3 rounded-lg hover:bg-sky-50 transition"
          >
            تسجيل الدخول
          </button>
        </div>

        <p className="text-sm text-slate-500">
          انضم لأكثر من <span className="font-semibold">2,000+</span> معلم
          ومدرسة
        </p>
      </div>
    </div>
  );
};

export default Hero;
