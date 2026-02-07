import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../Components/Header";
import useStore from "../src/store";
import Notification from "../Components/Notification";
import SocialMediaLink from "../Components/SocialMediaLink";
import LocationSelector from "../Components/LocationSelector";

import { JOB_TITLES, COUNTRY_CODES } from "../src/constants";

const Profile = () => {
  const navigate = useNavigate();
  const user = useStore((state) => state.user);
  const profile = useStore((state) => state.profile);
  const experiences = useStore((state) => state.experiences);
  const setProfile = useStore((state) => state.setProfile);
  const addExperience = useStore((state) => state.addExperience);
  const deleteExperience = useStore((state) => state.deleteExperience);

  const [localProfile, setLocalProfile] = useState(() => {
    if (profile) return profile;
    return {
      name: user?.name || "",
      role: user?.role || "",
      jobTitle: user?.jobTitle || "",
      bio: user?.bio || "",
      email: user?.email || "",
      phone: user?.phone || "",
      country: user?.country || "",
      city: user?.city || "",
      neighborhood: user?.neighborhood || "",
      photo: user?.photo || profile?.photo || "",
      cv: user?.cv || profile?.cv || "",
      languageSkills: user?.languageSkills || [],
      education: user?.education || "",
      educationField: user?.educationField || "",
      landline: user?.landline || profile?.landline || "",
    };
  });

  const [showModal, setShowModal] = useState(false);
  const [newExp, setNewExp] = useState({
    title: "",
    place: "",
    from: "",
    to: "",
    photos: [],
    link: "",
  });

  const [showNotif, setShowNotif] = useState(false);
  const [notification, setNotification] = useState(null);

  const [showJobDropdown, setShowJobDropdown] = useState(false);
  const [jobSearchTerm, setJobSearchTerm] = useState("");
  const jobDropdownRef = useRef(null);

  const [showExpTitleDropdown, setShowExpTitleDropdown] = useState(false);
  const [expTitleSearchTerm, setExpTitleSearchTerm] = useState("");
  const expTitleDropdownRef = useRef(null);

  const [countryCode, setCountryCode] = useState(() => {
    const phone = localProfile.phone || "";
    const found = COUNTRY_CODES.find(c => phone.startsWith(c.code));
    return found ? found.code : "+966";
  });

  const [phoneNumber, setPhoneNumber] = useState(() => {
    const phone = localProfile.phone || "";
    const found = COUNTRY_CODES.find(c => phone.startsWith(c.code));
    return found ? phone.slice(found.code.length) : phone;
  });

  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const countryDropdownRef = useRef(null);

  const filteredJobTitles = JOB_TITLES.filter((title) =>
    title.toLowerCase().includes(jobSearchTerm.toLowerCase())
  );

  const filteredExpTitles = JOB_TITLES.filter((title) =>
    title.toLowerCase().includes(expTitleSearchTerm.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (jobDropdownRef.current && !jobDropdownRef.current.contains(event.target)) {
        setShowJobDropdown(false);
      }
      if (expTitleDropdownRef.current && !expTitleDropdownRef.current.contains(event.target)) {
        setShowExpTitleDropdown(false);
      }
      if (countryDropdownRef.current && !countryDropdownRef.current.contains(event.target)) {
        setShowCountryDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (!user) {
      navigate("/login", { replace: true });
    }
  }, [user, navigate]);

  useEffect(() => {
    if (profile) {
      setLocalProfile(profile);
      setJobSearchTerm(profile.jobTitle || "");
    } else if (user) {
      setLocalProfile({
        name: user.name || "",
        role: user.role || "",
        jobTitle: user.jobTitle || "",
        bio: user.bio || "",
        email: user.email || "",
        phone: user.phone || "",
        country: user.country || "",
        city: user.city || "",
        neighborhood: user.neighborhood || "",
        photo: user.photo || profile?.photo || "",
        cv: user.cv || profile?.cv || "",
        languageSkills: user.languageSkills || [],
        education: user.education || "",
        educationField: user.educationField || "",
      });
      setJobSearchTerm(user.jobTitle || "");
    }
  }, [user, profile]);

  const handleChange = (e) => {
    setLocalProfile({ ...localProfile, [e.target.name]: e.target.value });
  };

  const handleJobTitleChange = (e) => {
    const value = e.target.value;
    setJobSearchTerm(value);
    setLocalProfile({ ...localProfile, jobTitle: value });
    setShowJobDropdown(true);
  };

  const selectJobTitle = (title) => {
    setJobSearchTerm(title);
    setLocalProfile({ ...localProfile, jobTitle: title });
    setShowJobDropdown(false);
  };

  const handleSave = () => {
    setProfile(localProfile);
    setShowNotif(true);
    setTimeout(() => setShowNotif(false), 3000);
  };

  const handleAddExperience = () => {
    if (!newExp.title || !newExp.place) return;

    addExperience(newExp);
    setNewExp({ title: "", place: "", from: "", to: "", photos: [], link: "" });
    setExpTitleSearchTerm("");
    setShowModal(false);
  };

  const handleDeleteExperience = (id) => {
    deleteExperience(id);
  };

  const handlePhotoClick = () => {
    if (localProfile.role === "teacher") {
      document.getElementById("photo-input").click();
    }
  };

  const handlePhotoChange = (e) => {
    if (localProfile.role !== "teacher") return;

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
        setLocalProfile({ ...localProfile, photo: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCvChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type !== "application/pdf") {
        setNotification({
          message: "يرجى اختيار ملف PDF فقط",
          type: "error",
        });
        return;
      }

      if (file.size > 2 * 1024 * 1024) { // 2MB limit
        setNotification({
          message: "حجم الملف كبير جداً (الحد الأقصى 2 ميجابايت)",
          type: "error",
        });
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setLocalProfile({ ...localProfile, cv: reader.result });
        setNotification({
          message: "تم رفع السيرة الذاتية بنجاح",
          type: "success",
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveCv = () => {
    setLocalProfile({ ...localProfile, cv: "" });
     setNotification({
      message: "تم حذف السيرة الذاتية",
      type: "success",
    });
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
              id="photo-input"
              accept="image/*"
              onChange={handlePhotoChange}
              className="hidden"
            />
            <div
              onClick={handlePhotoClick}
              className={`relative w-28 h-28 mx-auto mb-4 ${
                localProfile.role === "teacher" ? "cursor-pointer group" : ""
              }`}
            >
              {localProfile.photo ? (
                <>
                  <img
                    src={localProfile.photo}
                    alt="profile"
                    className="w-28 h-28 rounded-full object-cover group-hover:opacity-80 transition-opacity"
                  />
                  {localProfile.role === "teacher" && (
                    <div className="absolute inset-0 bg-black/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="material-symbols-outlined text-white text-lg">
                        edit
                      </span>
                    </div>
                  )}
                </>
              ) : (
                <div
                  className={`w-28 h-28 rounded-full ${
                    localProfile.role === "teacher"
                      ? "bg-slate-300 group-hover:bg-slate-400 border-2 border-dashed border-slate-400 group-hover:border-sky-500 transition-colors flex items-center justify-center"
                      : "bg-slate-300"
                  }`}
                >
                  {localProfile.role === "teacher" && (
                    <span className="material-symbols-outlined text-slate-500 group-hover:text-sky-500">
                      add_photo_alternate
                    </span>
                  )}
                </div>
              )}
              {localProfile.role === "teacher" && (
                <div className="absolute bottom-1 right-1 bg-sky-800 text-white rounded-full w-8 h-8 flex items-center justify-center group-hover:bg-sky-900 transition-colors">
                  <span className="material-symbols-outlined text-sm">add</span>
                </div>
              )}
            </div>

            <h2 className="font-bold text-lg text-slate-800">
              {localProfile.name}
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              {localProfile.jobTitle ||
                (localProfile.role === "teacher" ? "معلم" : "منشأة")}
            </p>

            <div className="mt-6 space-y-4 text-right">
              <label className="text-sm text-slate-600">الاسم الكامل</label>
              <input
                name="name"
                value={localProfile.name}
                onChange={handleChange}
                disabled={localProfile.role === "company"}
                className={`w-full rounded-lg p-3 ${
                  localProfile.role === "company"
                    ? "bg-slate-200 text-slate-500 cursor-not-allowed"
                    : "bg-slate-800 text-white"
                }`}
              />

              <label className="text-sm text-slate-600">
                {localProfile.role === "teacher"
                  ? "المسمى الوظيفي"
                  : "نوع الحساب"}
              </label>
              {localProfile.role === "teacher" ? (
                <div className="relative" ref={jobDropdownRef}>
                  <div className="relative">
                    <input
                      name="jobTitle"
                      value={jobSearchTerm}
                      onChange={handleJobTitleChange}
                      onFocus={() => setShowJobDropdown(true)}
                      placeholder="ابحث أو اختر المسمى الوظيفي..."
                      className="w-full rounded-lg bg-slate-800 text-white p-3 pr-10"
                    />
                    <span
                      className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 cursor-pointer"
                      onClick={() => setShowJobDropdown(!showJobDropdown)}
                    >
                      {showJobDropdown ? "expand_less" : "expand_more"}
                    </span>
                  </div>
                  {showJobDropdown && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-slate-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                      {filteredJobTitles.length > 0 ? (
                        filteredJobTitles.map((title, index) => (
                          <div
                            key={index}
                            onClick={() => selectJobTitle(title)}
                            className="px-4 py-2 hover:bg-sky-100 cursor-pointer text-slate-700 text-right"
                          >
                            {title}
                          </div>
                        ))
                      ) : (
                        <div className="px-4 py-2 text-slate-500 text-right">
                          لا توجد نتائج
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <input
                  value="منشأة"
                  disabled
                  className="w-full rounded-lg bg-slate-200 p-3 cursor-not-allowed"
                />
              )}

              <label className="text-sm text-slate-600">
                البريد الإلكتروني
              </label>
              <input
                name="email"
                value={localProfile.email}
                onChange={handleChange}
                disabled={localProfile.role === "company"}
                className={`w-full rounded-lg p-3 ${
                  localProfile.role === "company"
                    ? "bg-slate-200 text-slate-500 cursor-not-allowed"
                    : "bg-slate-800 text-white"
                }`}
              />

              <label className="text-sm text-slate-600">رقم الهاتف</label>
              <div className="flex gap-2" dir="ltr">
                <div className="relative w-32 min-w-[120px]">
                  <select
                    value={countryCode}
                    onChange={(e) => {
                      const newCode = e.target.value;
                      setCountryCode(newCode);
                      setLocalProfile({ ...localProfile, phone: newCode + phoneNumber });
                    }}
                    disabled={localProfile.role === "company"}
                    className={`w-full h-full rounded-lg px-3 py-3 text-sm appearance-none text-center cursor-pointer ${
                      localProfile.role === "company"
                        ? "bg-slate-200 text-slate-500 cursor-not-allowed"
                        : "bg-slate-800 text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                    }`}
                  >
                    {COUNTRY_CODES.map((country) => (
                      <option key={`${country.code}-${country.flag}`} value={country.code}>
                        {country.flag} {country.code}
                      </option>
                    ))}
                  </select>
                  {! (localProfile.role === "company") && (
                    <span className="material-symbols-outlined absolute left-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-sm">
                      expand_more
                    </span>
                  )}
                </div>
                <div className="relative flex-1">
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, "");
                      setPhoneNumber(val);
                      setLocalProfile({ ...localProfile, phone: countryCode + val });
                    }}
                    disabled={localProfile.role === "company"}
                    className={`w-full rounded-lg p-3 pl-12 text-sm text-left ${
                      localProfile.role === "company"
                        ? "bg-slate-200 text-slate-500 cursor-not-allowed"
                        : "bg-slate-800 text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                    }`}
                    dir="ltr"
                  />
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                    call
                  </span>
                </div>
              </div>

              <label className="text-sm text-slate-600">الرقم الثابت</label>
              <div className="relative">
                <input
                  type="tel"
                  value={localProfile.landline || ""}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, "");
                    setLocalProfile({ ...localProfile, landline: val });
                  }}
                  disabled={localProfile.role === "company"}
                  className={`w-full rounded-lg p-3 pl-12 text-sm text-left ${
                    localProfile.role === "company"
                      ? "bg-slate-200 text-slate-500 cursor-not-allowed"
                      : "bg-slate-800 text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                  }`}
                  dir="ltr"
                  placeholder="رقم الهاتف الثابت"
                />
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                  deskphone
                </span>
              </div>


              <LocationSelector
                country={localProfile.country}
                city={localProfile.city}
                neighborhood={localProfile.neighborhood}
                onChange={(location) => {
                  setLocalProfile({
                    ...localProfile,
                    country: location.country,
                    city: location.city,
                    neighborhood: location.neighborhood,
                  });
                }}
                disabled={localProfile.role === "company"}
                showLabels={true}
              />
            </div>
          </div>
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl shadow p-6">
              <h3 className="font-semibold mb-3 text-right">نبذة مهنية</h3>
              <textarea
                name="bio"
                value={localProfile.bio}
                onChange={handleChange}
                disabled={localProfile.role === "company"}
                rows={5}
                maxLength={2000}
                className={`w-full rounded-lg p-4 ${
                  localProfile.role === "company"
                    ? "bg-slate-200 text-slate-500 cursor-not-allowed"
                    : "bg-slate-800 text-white"
                }`}
              />
              <p className="text-xs text-slate-400 text-right mt-1">
                {localProfile.bio?.length || 0} / 2000 حرف
              </p>
            </div>

            {localProfile.role === "teacher" && (
              <>
                <div className="bg-white rounded-2xl shadow p-6">
                  <h3 className="font-semibold mb-4 text-right">المؤهل العلمي</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-slate-600 block mb-1">الدرجة العلمية</label>
                      <select
                        name="education"
                        value={localProfile.education}
                        onChange={handleChange}
                        className="w-full rounded-lg p-3 bg-slate-800 text-white"
                      >
                        <option value="">اختر الدرجة</option>
                        <option value="bachelor">بكالوريوس</option>
                        <option value="master">ماجستير</option>
                        <option value="phd">دكتوراه</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-sm text-slate-600 block mb-1">التخصص</label>
                      <input
                        type="text"
                        name="educationField"
                        value={localProfile.educationField || ""}
                        onChange={handleChange}
                        placeholder="مثلاً: رياضيات، فيزياء..."
                        className="w-full rounded-lg p-3 bg-slate-800 text-white"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl shadow p-6">
                  <h3 className="font-semibold mb-4 text-right">
                    المهارات اللغوية
                  </h3>
                  
                  <div className="space-y-4">
                    {(localProfile.languageSkills || []).map((lang, index) => (
                      <div key={index} className="flex gap-3 items-end">
                        <div className="flex-1">
                          <label className="text-sm text-slate-600">اللغة</label>
                          <select
                            value={lang.language}
                            onChange={(e) => {
                              const newSkills = [...(localProfile.languageSkills || [])];
                              newSkills[index].language = e.target.value;
                              setLocalProfile({ ...localProfile, languageSkills: newSkills });
                            }}
                            className="w-full rounded-lg p-3 bg-slate-800 text-white mt-1"
                          >
                            <option value="">اختر اللغة</option>
                            <option value="arabic">العربية (العربية)</option>
                            <option value="english">الإنجليزية (English)</option>
                            <option value="french">الفرنسية (Français)</option>
                            <option value="german">الألمانية (Deutsch)</option>
                            <option value="spanish">الإسبانية (Español)</option>
                            <option value="italian">الإيطالية (Italiano)</option>
                            <option value="turkish">التركية (Türkçe)</option>
                            <option value="chinese">الصينية (中文)</option>
                            <option value="japanese">اليابانية (日本語)</option>
                            <option value="korean">الكورية (한국어)</option>
                          </select>
                        </div>
                        <div className="flex-1">
                          <label className="text-sm text-slate-600">المستوى</label>
                          <select
                            value={lang.level}
                            onChange={(e) => {
                              const newSkills = [...(localProfile.languageSkills || [])];
                              newSkills[index].level = e.target.value;
                              setLocalProfile({ ...localProfile, languageSkills: newSkills });
                            }}
                            className="w-full rounded-lg p-3 bg-slate-800 text-white mt-1"
                          >
                            <option value="">اختر المستوى</option>
                            <option value="beginner">مبتدئ (Beginner)</option>
                            <option value="intermediate">متوسط (Intermediate)</option>
                            <option value="advanced">متقدم (Advanced)</option>
                            <option value="fluent">طليق (Fluent)</option>
                            <option value="native">لغة أم (Native)</option>
                          </select>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            const newSkills = (localProfile.languageSkills || []).filter((_, i) => i !== index);
                            setLocalProfile({ ...localProfile, languageSkills: newSkills });
                          }}
                          className="p-3 text-red-600 hover:bg-red-50 rounded-lg transition"
                        >
                          <span className="material-symbols-outlined">delete</span>
                        </button>
                      </div>
                    ))}

                    {(!localProfile.languageSkills || localProfile.languageSkills.length < 4) && (
                      <button
                        type="button"
                        onClick={() => {
                          const newSkills = [...(localProfile.languageSkills || []), { language: "", level: "" }];
                          setLocalProfile({ ...localProfile, languageSkills: newSkills });
                        }}
                        className="w-full rounded-lg border-2 border-dashed border-slate-300 py-3 text-slate-600 hover:border-sky-700 hover:text-sky-700 transition"
                      >
                        + إضافة لغة (الحد الأقصى 4 لغات)
                      </button>
                    )}
                  </div>
                </div>

                <div className="bg-white rounded-2xl shadow p-6">
                  <h3 className="font-semibold mb-4 text-right">
                  الخبرات العملية
                </h3>

                <div className="space-y-4">
                  
                  {experiences.map((exp) => (
                    <div key={exp.id} className="flex justify-between pb-4 border-b border-slate-100 last:border-0">
                     <div className="text-right">
                          <p className="font-semibold">• {exp.title}</p>
                          <p className="text-sky-700 text-sm">{exp.place}</p>
                          <span className="text-xs bg-slate-200 px-3 py-1 rounded-full">
                            {exp.from} - {exp.to}
                          </span>
                          {exp.link && <SocialMediaLink url={exp.link} />}
                        </div>
                      <div className="flex gap-3 items-start">
                        {exp.photos && exp.photos.length > 0 && (
                          <div className="flex gap-2">
                            {exp.photos.map((photo, idx) => (
                              <img
                                key={idx}
                                src={photo}
                                alt={`${exp.title} ${idx + 1}`}
                                className="w-16 h-16 rounded-lg object-cover"
                              />
                            ))}
                          </div>
                        )}
                      </div>


                      <button
                        onClick={() => handleDeleteExperience(exp.id)}
                        className="text-slate-400 cursor-pointer hover:text-red-500 self-start"
                      >
                        <span className="material-symbols-outlined">
                          delete
                        </span>
                      </button>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => setShowModal(true)}
                  className="w-full rounded-lg border-2 border-dashed border-slate-300 py-3 text-slate-600 hover:border-sky-700 hover:text-sky-700 transition"
                >
                  + إضافة خبرة
                </button>
              </div>
            </>
            )}


             {localProfile.role === "teacher" && (
                <div className="bg-white rounded-2xl shadow p-6">
                  <h3 className="font-semibold mb-3 text-right">السيرة الذاتية</h3>
                  <div className="flex flex-col gap-4">
                     <p className="text-sm text-slate-500 text-right">
                        يمكنك رفع سيرتك الذاتية بصيغة PDF (بحد أقصى 2 ميجابايت)
                     </p>
                    
                    <div className="flex gap-4 items-center justify-end">
                       <label className="cursor-pointer bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-lg flex items-center gap-2 transition">
                         <span className="material-symbols-outlined text-lg">upload_file</span>
                         <span>رفع ملف PDF</span>
                         <input
                           type="file"
                           accept="application/pdf"
                           onChange={handleCvChange}
                           className="hidden"
                         />
                       </label>
                       
                       {localProfile.cv && (
                          <div className="flex gap-2">
                             <a 
                               href={localProfile.cv} 
                               target="_blank" 
                               rel="noreferrer"
                               className="bg-sky-100 text-sky-700 px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-sky-200 transition"
                             >
                                <span className="material-symbols-outlined text-lg">visibility</span>
                                <span>عرض</span>
                             </a>
                             <button
                               onClick={handleRemoveCv}
                               className="bg-red-50 text-red-600 px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-red-100 transition"
                             >
                                <span className="material-symbols-outlined text-lg">delete</span>
                                <span>حذف</span>
                             </button>
                          </div>
                       )}
                    </div>
                  </div>
                </div>
             )}
            
            {localProfile.role === "teacher" && (
              <button
                onClick={handleSave}
                className="bg-sky-800 text-white px-8 py-3 rounded-xl"
              >
                حفظ التغييرات
              </button>
            )}
          </div>
        </div>

        {showNotif && (
          <div className="fixed top-22 right-6 bg-green-600 text-white px-5 py-4 rounded-xl">
            تم حفظ التغييرات بنجاح
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h3 className="font-semibold mb-4 text-right">إضافة خبرة جديدة</h3>

            <div className="space-y-3">
              <div className="relative" ref={expTitleDropdownRef}>
                <div className="relative">
                  <input
                    placeholder="المسمى الوظيفي"
                    value={expTitleSearchTerm}
                    onChange={(e) => {
                      setExpTitleSearchTerm(e.target.value);
                      setNewExp({ ...newExp, title: e.target.value });
                      setShowExpTitleDropdown(true);
                    }}
                    onFocus={() => setShowExpTitleDropdown(true)}
                    className="w-full p-3 rounded-lg bg-slate-100 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowExpTitleDropdown(!showExpTitleDropdown)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
                  >
                    <span className="material-symbols-outlined text-xl">
                      {showExpTitleDropdown ? "expand_less" : "expand_more"}
                    </span>
                  </button>
                </div>
                {showExpTitleDropdown && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                    {filteredExpTitles.length > 0 ? (
                      filteredExpTitles.map((title, index) => (
                        <div
                          key={index}
                          onClick={() => {
                            setExpTitleSearchTerm(title);
                            setNewExp({ ...newExp, title: title });
                            setShowExpTitleDropdown(false);
                          }}
                          className="px-4 py-2 text-right cursor-pointer hover:bg-sky-50 hover:text-sky-700"
                        >
                          {title}
                        </div>
                      ))
                    ) : (
                      <div className="px-4 py-2 text-slate-400 text-right">
                        لا توجد نتائج
                      </div>
                    )}
                  </div>
                )}
              </div>
              <input
                placeholder="المكان"
                value={newExp.place}
                onChange={(e) =>
                  setNewExp({ ...newExp, place: e.target.value })
                }
                className="w-full p-3 rounded-lg bg-slate-100"
              />
              <div className="flex gap-2">
                <input
                  placeholder="من"
                  value={newExp.from}
                  onChange={(e) =>
                    setNewExp({ ...newExp, from: e.target.value })
                  }
                  className="w-full p-3 rounded-lg bg-slate-100"
                />
                <input
                  placeholder="إلى"
                  value={newExp.to}
                  onChange={(e) => setNewExp({ ...newExp, to: e.target.value })}
                  className="w-full p-3 rounded-lg bg-slate-100"
                />
              </div>

              <input
                placeholder="رابط (اختياري)"
                value={newExp.link}
                onChange={(e) =>
                  setNewExp({ ...newExp, link: e.target.value })
                }
                className="w-full p-3 rounded-lg bg-slate-100"
              />

              <div className="mt-2">
                <label className="block text-sm text-slate-600 mb-2 text-right">
                  إضافة صور (اختياري - حتى 3 صور)
                </label>
                <div className="flex items-center gap-3 flex-wrap">
                  {newExp.photos.map((photo, index) => (
                    <div key={index} className="relative">
                      <img
                        src={photo}
                        alt={`preview ${index + 1}`}
                        className="w-20 h-20 rounded-lg object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const updatedPhotos = newExp.photos.filter((_, i) => i !== index);
                          setNewExp({ ...newExp, photos: updatedPhotos });
                        }}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                  {newExp.photos.length < 3 && (
                    <label className="w-20 h-20 border-2 border-dashed border-slate-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-sky-500 hover:bg-sky-50 transition">
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (file && newExp.photos.length < 3) {
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              setNewExp({ ...newExp, photos: [...newExp.photos, reader.result] });
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                      <span className="material-symbols-outlined text-slate-400 text-2xl">add</span>
                      <span className="text-xs text-slate-400">{newExp.photos.length}/3</span>
                    </label>
                  )}
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={handleAddExperience}
                className="flex-1 bg-sky-800 text-white py-2 rounded-xl"
              >
                حفظ
              </button>
              <button
                onClick={() => {
                  setExpTitleSearchTerm("");
                  setNewExp({ title: "", place: "", from: "", to: "", photos: [], link: "" });
                  setShowModal(false);
                }}
                className="flex-1 border py-2 rounded-xl"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Profile;

