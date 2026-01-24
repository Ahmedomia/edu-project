import { useState } from "react";
import Header from "../Components/Header";
import { useNavigate } from "react-router-dom";
import useStore from "../src/store";

const Register = () => {
  const [role, setRole] = useState("teacher");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [showNotif, setShowNotif] = useState(false);
  const navigate = useNavigate();
  const setUser = useStore((state) => state.setUser);

  const handleRegister = () => {
    const user = {
      name,
      role,
      email,
      phone,
      bio: "",
    };

    setUser(user);

    setShowNotif(true);

    setTimeout(() => {
      setShowNotif(false);
      navigate("/login");
    }, 1000);
  };

  return (
    <>
      <Header />

      <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 pt-30 pb-30">
        <div className="w-full max-w-md text-center">
          <h1 className="text-2xl font-bold text-slate-900 mb-1">
            إنشاء حساب جديد
          </h1>
          <p className="text-sm text-sky-600 mb-8">
            لديك حساب بالفعل؟ سجل دخولك
          </p>
          <div className="rounded-2xl bg-white p-8 shadow-sm border text-right">
            <div className="flex mb-8 border-b">
              <button
                onClick={() => setRole("company")}
                className={`flex-1 py-3 text-sm flex items-center justify-center gap-2
                ${
                  role === "company"
                    ? "border-b-2 border-sky-600 text-sky-600 font-semibold"
                    : "text-slate-500"
                }`}
              >
                <span className="material-symbols-outlined text-base">
                  apartment
                </span>
                حساب منشأة
              </button>

              <button
                onClick={() => setRole("teacher")}
                className={`flex-1 py-3 text-sm flex items-center justify-center gap-2
                ${
                  role === "teacher"
                    ? "border-b-2 border-sky-600 text-sky-600 font-semibold"
                    : "text-slate-500"
                }`}
              >
                <span className="material-symbols-outlined text-base">
                  person
                </span>
                حساب معلم
              </button>
            </div>
            <div className="mb-5">
              <label className="block text-sm text-slate-600 mb-2">
                {role === "company" ? "اسم المنشأة التعليمية" : "الاسم الرباعي"}
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-lg bg-slate-800 px-4 py-3 pr-12 text-sm text-white"
                />
                <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-slate-400">
                  person
                </span>
              </div>
            </div>
            <div className="mb-5">
              <label className="block text-sm text-slate-600 mb-2">
                البريد الإلكتروني
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg bg-slate-800 px-4 py-3 pr-12 text-sm text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
                <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-slate-400">
                  mail
                </span>
              </div>
            </div>
            <div className="mb-6">
              <label className="block text-sm text-slate-600 mb-2">
                رقم الجوال
              </label>
              <div className="relative">
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full rounded-lg bg-slate-800 px-4 py-3 pr-12 text-sm text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
                <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-slate-400">
                  call
                </span>
              </div>
            </div>
            <div className="mb-2 text-right">
              <label className="block text-sm text-slate-600 mb-2">
                كلمة المرور
              </label>

              <div className="relative">
                <input
                  type="password"
                  placeholder="********"
                  className="w-full rounded-lg bg-slate-800 px-4 py-3 pr-12 text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-900"
                />

                <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-slate-400">
                  lock
                </span>
              </div>
            </div>
            <div className="mb-2 text-right">
              <label className="block text-sm text-slate-600 mb-2">
                تأكيد كلمة المرور
              </label>

              <div className="relative">
                <input
                  type="password"
                  placeholder="********"
                  className="w-full rounded-lg bg-slate-800 px-4 py-3 pr-12 text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-900"
                />

                <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-slate-400">
                  lock
                </span>
              </div>
            </div>
            <button
              onClick={handleRegister}
              className="w-full rounded-lg bg-sky-900 py-3 text-white font-semibold hover:bg-sky-700 transition mt-6"
            >
              إنشاء الحساب
            </button>
          </div>
        </div>
      </div>
      {showNotif && (
        <div className="fixed top-5 right-5 z-50">
          <div className="flex items-center gap-3 rounded-xl bg-green-600 px-5 py-4 text-white shadow-lg animate-slide-in">
            <span className="material-symbols-outlined">check_circle</span>
            <span className="text-sm font-medium">
              تم إنشاء الحساب بنجاح، سجل الدخول الآن
            </span>
          </div>
        </div>
      )}
    </>
  );
};

export default Register;
