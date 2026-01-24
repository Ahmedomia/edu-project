import { useState, useEffect } from "react";
import Header from "../Components/Header";
import { useNavigate } from "react-router-dom";
import useStore from "../src/store";
import Notification from "../Components/Notification";

const CompanyProfile = () => {
  const navigate = useNavigate();
  const user = useStore((state) => state.user);
  const companyProfile = useStore((state) => state.companyProfile);
  const setCompanyProfile = useStore((state) => state.setCompanyProfile);

  const [company, setCompany] = useState(() => {
    if (companyProfile) return companyProfile;
    if (!user || user.role !== "company") {
      return null;
    }

    return {
      name: user.name || "",
      email: user.email || "",
      phone: user.phone || "",
      educationType: "",
      system: "",
      city: "",
      address: "",
      bio: "",
      logo: "",
    };
  });

  const [showNotif, setShowNotif] = useState(false);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (user.role !== "company") {
      navigate("/profile");
    }
  }, [user, navigate]);

  useEffect(() => {
    if (companyProfile) {
      setCompany(companyProfile);
    } else if (user && user.role === "company") {
      setCompany({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        educationType: "",
        system: "",
        city: "",
        address: "",
        bio: "",
        logo: "",
      });
    }
  }, [user, companyProfile]);

  if (!company) return null;

  const handleChange = (e) => {
    setCompany({ ...company, [e.target.name]: e.target.value });
  };

  const handleLogoClick = () => {
    document.getElementById("logo-input").click();
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        setNotification({
          message: "يرجى اختيار صورة فقط",
          type: "error",
        });
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setCompany({ ...company, logo: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    setCompanyProfile(company);
    setShowNotif(true);
    setTimeout(() => setShowNotif(false), 3000);
  };

  return (
    <>
      <Header />
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}

      <div className="bg-slate-100 min-h-screen pt-28 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl shadow p-6 text-center">
            <input
              type="file"
              id="logo-input"
              accept="image/*"
              onChange={handleLogoChange}
              className="hidden"
            />
            <div
              onClick={handleLogoClick}
              className="cursor-pointer group relative mx-auto w-40 h-40 mb-4"
            >
              {company.logo ? (
                <>
                  <img
                    src={company.logo}
                    alt="logo"
                    className="w-full h-full rounded-xl object-cover group-hover:opacity-80 transition-opacity"
                  />
                  <div className="absolute inset-0 bg-black/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="material-symbols-outlined text-white text-2xl">
                      edit
                    </span>
                  </div>
                </>
              ) : (
                <div className="w-full h-full rounded-xl border-2 border-dashed border-slate-300 group-hover:border-sky-500 transition-colors flex flex-col items-center justify-center bg-slate-50 group-hover:bg-sky-50">
                  <span className="material-symbols-outlined text-4xl text-slate-400 group-hover:text-sky-500 mb-2">
                    add_photo_alternate
                  </span>
                  <span className="text-xs text-slate-500 group-hover:text-sky-600">
                    إضافة شعار
                  </span>
                </div>
              )}
            </div>
            <p className="text-sm text-slate-500">شعار المدرسة</p>
            <p className="text-xs text-slate-400 mt-1">انقر لإضافة أو تغيير الشعار</p>
            <p className="text-xs text-slate-400">يفضل مقاس 400x400 بكسل</p>
          </div>
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl shadow p-6">
              <h3 className="font-semibold mb-6 text-right">
                المعلومات الأساسية
              </h3>

              <div className="grid md:grid-cols-2 gap-4 text-right">
                <div>
                  <label className="text-sm">اسم المنشأة</label>
                  <input
                    name="name"
                    value={company.name}
                    onChange={handleChange}
                    className="w-full mt-1 rounded-lg bg-slate-800 text-white p-3"
                  />
                </div>

                <div>
                  <label className="text-sm">نوع التعليم</label>
                  <select
                    name="educationType"
                    value={company.educationType}
                    onChange={handleChange}
                    className="w-full mt-1 rounded-lg bg-slate-800 text-white p-3"
                  >
                    <option value="">اختر</option>
                    <option value="أهلي">أهلي</option>
                    <option value="حكومي">حكومي</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm">المدينة</label>
                  <input
                    name="city"
                    value={company.city}
                    onChange={handleChange}
                    className="w-full mt-1 rounded-lg bg-slate-800 text-white p-3"
                  />
                </div>

                <div>
                  <label className="text-sm">المنهج الدراسي</label>
                  <input
                    name="system"
                    value={company.system}
                    onChange={handleChange}
                    className="w-full mt-1 rounded-lg bg-slate-800 text-white p-3"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="text-sm">العنوان</label>
                  <input
                    name="address"
                    value={company.address}
                    onChange={handleChange}
                    className="w-full mt-1 rounded-lg bg-slate-800 text-white p-3"
                  />
                </div>
              </div>
            </div>
            <div className="bg-white rounded-2xl shadow p-6">
              <h3 className="font-semibold mb-4 text-right">بيانات الاتصال</h3>

              <div className="grid md:grid-cols-2 gap-4 text-right">
                <input
                  value={company.email}
                  className="rounded-lg bg-slate-800 text-white p-3"
                />
                <input
                  value={company.phone}
                  className="rounded-lg bg-slate-800 text-white p-3"
                />
              </div>
            </div>
            <div className="bg-white rounded-2xl shadow p-6">
              <h3 className="font-semibold mb-3 text-right">نبذة عن المنشأة</h3>
              <textarea
                name="bio"
                value={company.bio}
                onChange={handleChange}
                rows={4}
                className="w-full rounded-lg bg-slate-800 text-white p-4"
              />
            </div>

            <button
              onClick={handleSave}
              className="bg-sky-800 text-white px-8 py-3 rounded-xl"
            >
              حفظ التغييرات
            </button>
          </div>
        </div>

        {showNotif && (
          <div className="fixed top-6 right-6 bg-green-600 text-white px-5 py-4 rounded-xl">
            تم حفظ البيانات بنجاح
          </div>
        )}
      </div>
    </>
  );
};

export default CompanyProfile;
