import { useState, useEffect, useRef } from "react";
import Header from "../Components/Header";
import { useNavigate } from "react-router-dom";
import useStore from "../src/store";
import Notification from "../Components/Notification";
import LocationSelector from "../Components/LocationSelector";
import MapPicker from "../Components/MapPicker";
import { COUNTRY_CODES } from "../src/constants";

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
      educationCategory: "",
      stages: [],
      country: user.country || "",
      city: user.city || "",
      neighborhood: user.neighborhood || "",
      bio: "",
      logo: "",
      mapUrl: user.mapUrl || "",
      landline: user.landline || companyProfile?.landline || "",
    };
  });

  const [showNotif, setShowNotif] = useState(false);
  const [notification, setNotification] = useState(null);
  const [showMapPicker, setShowMapPicker] = useState(false);

  const [countryCode, setCountryCode] = useState(() => {
    const phone = company?.phone || "";
    const found = COUNTRY_CODES.find(c => phone.startsWith(c.code));
    return found ? found.code : "+966";
  });

  const [phoneNumber, setPhoneNumber] = useState(() => {
    const phone = company?.phone || "";
    const found = COUNTRY_CODES.find(c => phone.startsWith(c.code));
    return found ? phone.slice(found.code.length) : phone;
  });

  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const countryDropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (countryDropdownRef.current && !countryDropdownRef.current.contains(event.target)) {
        setShowCountryDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
        educationCategory: "",
        stages: [],
        country: user.country || "",
        city: user.city || "",
        neighborhood: user.neighborhood || "",
        bio: "",
        logo: "",
        mapUrl: user.mapUrl || "",
      });
    }
  }, [user, companyProfile]);

  if (!company) return null;

  const handleChange = (e) => {
    setCompany({ ...company, [e.target.name]: e.target.value });
  };

  const handleStageToggle = (stage) => {
    const currentStages = company.stages || [];
    const newStages = currentStages.includes(stage)
      ? currentStages.filter((s) => s !== stage)
      : [...currentStages, stage];
    setCompany({ ...company, stages: newStages });
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
                    <option value="تعليم عام">تعليم عام</option>
                    <option value="تعليم جامعي">تعليم جامعي</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm">فئة التعليم</label>
                  <select
                    name="educationCategory"
                    value={company.educationCategory}
                    onChange={handleChange}
                    className="w-full mt-1 rounded-lg bg-slate-800 text-white p-3"
                  >
                    <option value="">اختر</option>
                    <option value="تعليم عالمي">تعليم عالمي</option>
                    <option value="تعليم حكومي">تعليم حكومي</option>
                  </select>
                </div>

                {company.educationType === "تعليم عام" && (
                  <div className="md:col-span-2">
                    <label className="text-sm block mb-2">المراحل الدراسية (اختياري - يمكنك اختيار أكثر من مرحلة)</label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {["طفوله مبكره", "ابتدائي", "متوسط", "ثانوي"].map((stage) => (
                        <div 
                          key={stage}
                          onClick={() => handleStageToggle(stage)}
                          className={`cursor-pointer p-3 rounded-xl border-2 transition-all flex items-center justify-center gap-2 ${
                            company.stages?.includes(stage) 
                              ? 'border-sky-500 bg-sky-50 text-sky-800 shadow-sm' 
                              : 'border-slate-800 bg-slate-800 text-white hover:border-slate-600'
                          }`}
                        >
                          <span className={`material-symbols-outlined text-sm ${company.stages?.includes(stage) ? 'text-sky-600' : 'text-slate-400'}`}>
                            {company.stages?.includes(stage) ? 'check_circle' : 'circle'}
                          </span>
                          <span className="text-sm">{stage}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="md:col-span-2">
                  <LocationSelector
                    data={company}
                    onUpdate={(updatedLocation) => setCompany({ ...company, ...updatedLocation })}
                    darkMode={true}
                  />
                </div>
              </div>
            </div>
            <div className="bg-white rounded-2xl shadow p-6">
              <div className="flex justify-between items-center mb-4">
                <button
                  onClick={() => {
                    const query = `${company.neighborhood || ""} ${company.city || ""} ${company.country || ""}`.trim();
                    window.open(`https://www.google.com/maps/search/${encodeURIComponent(query)}`, '_blank');
                  }}
                  className="text-xs bg-sky-100 text-sky-700 px-3 py-1 rounded-lg hover:bg-sky-200 transition flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-sm">map</span>
                  افتح الخريطة للبحث
                </button>
                <h3 className="font-semibold text-right text-slate-800">موقع المنشأة على الخريطة</h3>
              </div>

              <div className="text-right">
                <label className="text-sm text-slate-600 block mb-2">رابط الخريطة (Google Maps)</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute right-3 top-3 text-slate-400">link</span>
                  <input
                    name="mapUrl"
                    value={company.mapUrl || ""}
                    onChange={handleChange}
                    placeholder="قم بلصق رابط الموقع من خرائط جوجل هنا..."
                    className="w-full rounded-lg bg-slate-800 text-white p-3 pr-10 text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowMapPicker(true)}
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-sky-100 text-sky-700 px-3 py-1 rounded-md text-xs hover:bg-sky-200 transition"
                  >
                    تحديد من الخريطة
                  </button>
                </div>
                {company.mapUrl && (
                  <a 
                    href={company.mapUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-xs text-sky-600 hover:underline mt-2 inline-block"
                  >
                    عرض الموقع الحالي على الخريطة ←
                  </a>
                )}
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow p-6">
              <h3 className="font-semibold mb-4 text-right text-slate-800">بيانات الاتصال</h3>

              <div className="grid md:grid-cols-2 gap-4 text-right">
                <input
                  value={company.email}
                  readOnly
                  className="rounded-lg bg-slate-200 text-slate-500 p-3 cursor-not-allowed"
                />
                <div className="flex gap-2" dir="ltr">
                  <div className="relative w-32 min-w-[120px]">
                    <select
                      value={countryCode}
                      onChange={(e) => {
                        const newCode = e.target.value;
                        setCountryCode(newCode);
                        setCompany({ ...company, phone: newCode + phoneNumber });
                      }}
                      className="w-full h-full rounded-lg bg-slate-800 text-white px-3 py-3 text-sm appearance-none text-center cursor-pointer focus:outline-none focus:ring-2 focus:ring-sky-500"
                    >
                      {COUNTRY_CODES.map((country) => (
                        <option key={`${country.code}-${country.flag}`} value={country.code}>
                          {country.flag} {country.code}
                        </option>
                      ))}
                    </select>
                    <span className="material-symbols-outlined absolute left-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-sm">
                      expand_more
                    </span>
                  </div>
                  <div className="relative flex-1">
                    <input
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, "");
                        setPhoneNumber(val);
                        setCompany({ ...company, phone: countryCode + val });
                      }}
                      className="w-full rounded-lg bg-slate-800 text-white p-3 pl-12 text-sm text-left focus:outline-none focus:ring-2 focus:ring-sky-500"
                      dir="ltr"
                    />
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                      call
                    </span>
                  </div>
                </div>

                {/* Landline Field */}
                <div className="relative">
                  <input
                    type="tel"
                    value={company.landline || ""}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, "");
                      setCompany({ ...company, landline: val });
                    }}
                    className="w-full rounded-lg bg-slate-800 text-white p-3 pl-12 text-sm text-left focus:outline-none focus:ring-2 focus:ring-sky-500"
                    dir="ltr"
                    placeholder="رقم الهاتف الثابت"
                  />
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                    deskphone
                  </span>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-2xl shadow p-6">
              <h3 className="font-semibold mb-3 text-right">نبذة عن المنشأة</h3>
              <textarea
                name="bio"
                value={company.bio}
                onChange={handleChange}
                rows={4}
                maxLength={2000}
                className="w-full rounded-lg bg-slate-800 text-white p-4"
              />
              <p className="text-xs text-slate-400 text-right mt-1">
                {company.bio?.length || 0} / 2000 حرف
              </p>
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

      <MapPicker
        isOpen={showMapPicker}
        onClose={() => setShowMapPicker(false)}
        onConfirm={(url) => setCompany({ ...company, mapUrl: url })}
        initialUrl={company.mapUrl}
      />
    </>
  );
};

export default CompanyProfile;
