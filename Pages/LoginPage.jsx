import Header from "../Components/Header";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import useStore from "../src/store";
import { Link } from "react-router-dom";
import Notification from "../Components/Notification";

const Login = () => {
  const navigate = useNavigate();
  const [showError, setShowError] = useState(false);
  const [email, setEmail] = useState("");
  const loginUser = useStore((state) => state.loginUser);

  const handleLogin = () => {
    if (!email) {
      setShowError(true);
      setTimeout(() => {
        setShowError(false);
      }, 3000);
      return;
    }

    const success = loginUser(email);

    if (!success) {
      setShowError(true);
      setTimeout(() => {
        setShowError(false);
      }, 3000);
      return;
    }

    const user = useStore.getState().user;
    if (user.role === "teacher") {
      navigate("/TeacherDashBoard");
    } else {
      navigate("/CompanyDashBoard");
    }
  };

  return (
    <>
      <Header />
      <div className="flex items-center justify-center bg-slate-100 px-4 pt-28 pb-20">
        <div className="w-full max-w-md text-center">
          <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-sky-900 text-white text-xl">
            ت
          </div>

          <h1 className="text-2xl font-bold text-slate-900 mb-1">
            تسجيل الدخول
          </h1>
          <p className="text-sm mb-8">
            ليس لديك حساب؟
            <Link
              to="/Register"
              className="text-sky-600 font-medium hover:underline"
            >
              سجل الآن
            </Link>
          </p>
          <div className="rounded-2xl bg-white p-8 shadow-2xl">
            <div className="mb-5 text-right">
              <label className="block text-sm text-slate-600 mb-2">
                البريد الإلكتروني
              </label>

              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full rounded-lg bg-slate-800 px-4 py-3 pr-12 text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-900"
                />
                <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-slate-400">
                  mail
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

            <div className="mb-6 text-right">
              <a href="#" className="text-sm text-sky-600 hover:underline">
                نسيت كلمة المرور؟
              </a>
            </div>

            <button
              onClick={handleLogin}
              className="w-full rounded-lg bg-sky-900 py-3 text-white font-semibold hover:bg-sky-700 transition"
            >
              دخول
            </button>
          </div>
        </div>
      </div>

      {showError && (
        <Notification
          message="لا يوجد حساب، يرجى التسجيل أولًا"
          type="error"
          onClose={() => setShowError(false)}
        />
      )}
    </>
  );
};

export default Login;
