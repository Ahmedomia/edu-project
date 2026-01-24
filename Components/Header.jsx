import { useNavigate } from "react-router-dom";
import useStore from "../src/store";
import logoImage from "../src/assets/Logo.png";

const Header = () => {
  const navigate = useNavigate();

  const user = useStore((state) => state.user);
  const logout = useStore((state) => state.logout);

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <header className="fixed top-0 right-0 w-full z-20 bg-white border-b border-slate-200">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-4">
          {user ? (
            <>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1 rounded-lg border px-3 py-2 text-sm text-slate-600 hover:bg-slate-100 transition"
              >
                <span className="material-symbols-outlined text-base">
                  logout
                </span>
                خروج
              </button>

              <div className="text-right leading-tight">
                <p className="text-sm font-semibold text-slate-800">
                  {user.name || "مستخدم"}
                </p>
                <p className="text-xs text-slate-500">
                  {user.role === "teacher" ? "معلم" : "منشأة"}
                </p>
              </div>
            </>
          ) : (
            <div className="flex gap-3">
              <button
                onClick={() => navigate("/Register")}
                className="rounded-lg bg-sky-800 px-4 py-2 text-white hover:bg-sky-900 transition"
              >
                حساب جديد
              </button>
              <button
                onClick={() => navigate("/Login")}
                className="rounded-lg border border-sky-900 px-4 py-2 text-sky-900 hover:bg-sky-50 transition"
              >
                دخول
              </button>
            </div>
          )}
        </div>
        {user && (
          <div className="flex items-center gap-6 text-sm text-slate-600">
            {user.role === "teacher" && (
              <>
                <div
                  onClick={() => navigate("/TeacherDashboard")}
                  className="flex items-center gap-1 cursor-pointer hover:text-sky-800"
                >
                  <span className="material-symbols-outlined">grid_view</span>
                  الرئيسية
                </div>
                <div
                  onClick={() => navigate("/Profile")}
                  className="flex items-center gap-1 cursor-pointer hover:text-sky-800"
                >
                  <span className="material-symbols-outlined">description</span>
                  سيرتي الذاتية
                </div>
                <div
                  onClick={() => navigate("/JobSearch")}
                  className="flex items-center gap-1 cursor-pointer hover:text-sky-800"
                >
                  <span className="material-symbols-outlined">search</span>
                  البحث عن وظائف
                </div>
              </>
            )}
            {user.role === "company" && (
              <>
                <div
                  onClick={() => navigate("/CompanyDashboard")}
                  className="flex items-center gap-1 cursor-pointer hover:text-sky-800"
                >
                  <span className="material-symbols-outlined">grid_view</span>
                  الرئيسية
                </div>
                <div
                  onClick={() => navigate("/PostJop")}
                  className="flex items-center gap-1 cursor-pointer hover:text-sky-800"
                >
                  <span className="material-symbols-outlined">add_box</span>
                  نشر وظيفة
                </div>
                <div
                  onClick={() => navigate("/TeacherDatabase")}
                  className="flex items-center gap-1 cursor-pointer hover:text-sky-800"
                >
                  <span className="material-symbols-outlined">search</span>
                  البحث عن مرشحين
                </div>
                <div
                  onClick={() => navigate("/CompanyProfile")}
                  className="flex items-center gap-1 cursor-pointer hover:text-sky-800"
                >
                  <span className="material-symbols-outlined">business</span>
                  ملف المنشأة
                </div>
              </>
            )}
          </div>
        )}

        <div
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-sky-800 font-bold text-lg cursor-pointer"
        >
          منصة التوظيف
          <img
            src={logoImage}
            alt="Audience"
            className="h-16 w-16 object-cover"
          />
        </div>
      </div>
    </header>
  );
};

export default Header;
