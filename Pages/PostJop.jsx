import { useState, useEffect } from "react";
import Header from "../Components/Header";
import { useNavigate } from "react-router-dom";
import useStore from "../src/store";
import Notification from "../Components/Notification";
import { JOB_TITLES } from "../src/constants";
import { useRef } from "react";
import LocationSelector from "../Components/LocationSelector";
import MapPicker from "../Components/MapPicker";

const PostJob = () => {
  const navigate = useNavigate();
  const user = useStore((state) => state.user);
  const addJob = useStore((state) => state.addJob);
  const [notification, setNotification] = useState(null);
  const [showMapPicker, setShowMapPicker] = useState(false);
  
  const [showJobDropdown, setShowJobDropdown] = useState(false);
  const [jobSearchTerm, setJobSearchTerm] = useState("");
  const jobDropdownRef = useRef(null);

  const filteredJobTitles = JOB_TITLES.filter((title) =>
    title.toLowerCase().includes(jobSearchTerm.toLowerCase())
  );

  useEffect(() => {
      const handleClickOutside = (event) => {
        if (jobDropdownRef.current && !jobDropdownRef.current.contains(event.target)) {
          setShowJobDropdown(false);
        }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

  useEffect(() => {
    if (!user || user.role !== "company") {
      navigate("/Login");
    }
  }, [user, navigate]);

  const [form, setForm] = useState({
    title: "",
    jobType: "دوام كامل",
    stage: "طفوله مبكره",
    gender: "أنثي",
    country: "",
    city: "",
    neighborhood: "",
    salaryFrom: "",
    salaryTo: "",
    currency: "SAR",
    description: "",
    requirements: "",
    mapUrl: user?.mapUrl || "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    addJob(form);

    setForm({
      title: "",
      jobType: "دوام كامل",
      stage: "طفوله مبكره",
      gender: "أنثي",
      country: "",
      city: "",
      neighborhood: "",
      salaryFrom: "",
      salaryTo: "",
      currency: "SAR",
      description: "",
      requirements: "",
      mapUrl: user?.mapUrl || "",
    });

    setNotification({
      message: "تم نشر الوظيفة بنجاح",
      type: "success",
    });
    setTimeout(() => {
      navigate("/CompanyDashboard");
    }, 1500);
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
      <div className="min-h-screen bg-slate-50 pt-28 px-4">
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md p-8">
          <div className="flex items-center gap-3 mb-6">
            <button
              onClick={() => navigate(-1)}
              className="text-slate-600 hover:text-sky-800"
            >
              <span className="material-symbols-outlined">arrow_back</span>
            </button>
            <h2 className="text-xl font-bold text-slate-800">
              نشر وظيفة جديدة
            </h2>
          </div>

          <h3 className="mb-4 font-semibold text-slate-700">تفاصيل الوظيفة</h3>

          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-5"
          >
            <div>
              <label className="text-sm text-slate-600">المسمى الوظيفي</label>
              <div className="relative" ref={jobDropdownRef}>
                <input
                  name="title"
                  value={form.title}
                  onChange={(e) => {
                     setForm({ ...form, title: e.target.value });
                     setJobSearchTerm(e.target.value);
                     setShowJobDropdown(true);
                  }}
                  onFocus={() => {
                     setJobSearchTerm(form.title);
                     setShowJobDropdown(true);
                  }}
                  placeholder="اختر المسمى الوظيفي"
                  className="w-full mt-1 rounded-lg bg-gray-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-sky-700"
                  autoComplete="off"
                />
                <span
                   className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 cursor-pointer"
                   onClick={() => setShowJobDropdown(!showJobDropdown)}
                >
                   {showJobDropdown ? "expand_less" : "expand_more"}
                </span>

                {showJobDropdown && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-slate-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {filteredJobTitles.length > 0 ? (
                      filteredJobTitles.map((title, index) => (
                        <div
                          key={index}
                          onClick={() => {
                            setForm({ ...form, title: title });
                            setJobSearchTerm(title);
                            setShowJobDropdown(false);
                          }}
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
            </div>
            <div>
              <label className="text-sm text-slate-600">نوع الوظيفة</label>
              <select
                name="jobType"
                value={form.jobType}
                onChange={handleChange}
                className="w-full mt-1 rounded-lg bg-gray-200 px-4 py-2"
                required
              >
                <option>دوام كامل</option>
                <option>دوام جزئي</option>
                <option>عن بُعد</option>
              </select>
            </div>
            <div>
              <label className="text-sm text-slate-600">المرحلة الدراسية</label>
              <select
                name="stage"
                value={form.stage}
                onChange={handleChange}
                className="w-full mt-1 rounded-lg bg-gray-200 px-4 py-2"
                required
              >
                <option>طفولة مبكرة </option>
                <option>ابتدائي</option>
                <option>متوسط</option>
                <option>ثانوي</option>
                <option>جامعي</option>
              </select>
            </div>
            <div>
              <label className="text-sm text-slate-600">الجنس</label>
              <select
                name="gender"
                value={form.gender}
                onChange={handleChange}
                className="w-full mt-1 rounded-lg bg-gray-200 px-4 py-2"
                required
              >
                <option>أنثي</option>
                <option>ذكر</option>
                <option>لا يهم</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <LocationSelector
                country={form.country}
                city={form.city}
                neighborhood={form.neighborhood}
                onChange={(location) => {
                  setForm({
                    ...form,
                    country: location.country,
                    city: location.city,
                    neighborhood: location.neighborhood,
                  });
                }}
                disabled={false}
                showLabels={true}
              />
            </div>
            <div>
              <label className="text-sm text-slate-600">
                الراتب المتوقع (من) (اختياري)
              </label>
              <input
                name="salaryFrom"
                type="number"
                value={form.salaryFrom}
                onChange={handleChange}
                className="w-full mt-1 rounded-lg bg-gray-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-sky-700"
              />
            </div>
            <div>
              <label className="text-sm text-slate-600">
                الراتب المتوقع (إلى) (اختياري)
              </label>
              <input
                name="salaryTo"
                type="number"
                value={form.salaryTo}
                onChange={handleChange}
                className="w-full mt-1 rounded-lg bg-gray-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-sky-700"
              />
            </div>
            <div>
              <label className="text-sm text-slate-600">العملة</label>
              <select
                name="currency"
                value={form.currency}
                onChange={handleChange}
                className="w-full mt-1 rounded-lg bg-gray-200 px-4 py-2"
                required
              >
                <option value="SAR">ريال سعودي (SAR)</option>
                <option value="EGP">جنيه مصري (EGP)</option>
                <option value="USD">دولار أمريكي (USD)</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="text-sm text-slate-600">
                وصف الوظيفة والمهام
              </label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows="5"
                placeholder="اكتب تفاصيل الوظيفة..."
                className="w-full mt-1 rounded-lg bg-gray-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-sky-700"
                required
              />
            </div>
            <div className="md:col-span-2">
              <label className="text-sm text-slate-600">رابط الموقع على الخريطة (اختياري)</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute right-3 top-3 text-slate-400">link</span>
                <input
                  name="mapUrl"
                  value={form.mapUrl}
                  onChange={handleChange}
                  placeholder="رابط خرائط جوجل..."
                  className="w-full mt-1 rounded-lg bg-gray-200 px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-sky-700"
                />
                <button
                  type="button"
                  onClick={() => setShowMapPicker(true)}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-sky-100 text-sky-700 px-3 py-1 rounded-md text-xs hover:bg-sky-200 transition"
                >
                  تحديد من الخريطة
                </button>
              </div>
            </div>
            <div className="md:col-span-2 flex justify-end mt-4">
              <button
                type="submit"
                className="rounded-lg bg-sky-800 px-6 py-2 text-white hover:bg-sky-900 transition"
              >
                نشر الوظيفة
              </button>
            </div>
          </form>
        </div>
      </div>
      
      <MapPicker
        isOpen={showMapPicker}
        onClose={() => setShowMapPicker(false)}
        onConfirm={(url) => setForm({ ...form, mapUrl: url })}
        initialUrl={form.mapUrl}
      />
    </>
  );
};

export default PostJob;
