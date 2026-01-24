import { useNavigate } from "react-router-dom";


export default function CallToAction() {
  const navigate = useNavigate();
  return (
    <section className="bg-sky-800 py-16 mb-26 ">
      <div dir="rtl" className="container mx-auto px-6 text-center text-white">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 cursor-default">
          جاهز للانطلاق في مسيرتك؟
        </h2>
        <p className="text-teal-100 max-w-2xl mx-auto mb-10 leading-relaxed cursor-default">
          انضم اليوم إلى أكبر شبكة توظيف تعليمي في المملكة. التسجيل مجاني
          ويستغرق دقائق معدودة.
        </p>
        <button onClick={() => navigate("/Register")} className="bg-white text-sky-800 font-semibold px-10 py-4 rounded-lg shadow-md hover:bg-sky-200 transition">
          أنشئ حسابك الآن
        </button>
      </div>
    </section>
  );
}
