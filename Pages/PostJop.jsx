import { useState, useEffect } from "react";
import Header from "../Components/Header";
import { useNavigate } from "react-router-dom";
import useStore from "../src/store";
import Notification from "../Components/Notification";

const PostJob = () => {
  const navigate = useNavigate();
  const user = useStore((state) => state.user);
  const addJob = useStore((state) => state.addJob);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    if (!user || user.role !== "company") {
      navigate("/Login");
    }
  }, [user, navigate]);

  const [form, setForm] = useState({
    title: "",
    jobType: "دوام كامل",
    stage: "رياض أطفال",
    gender: "أنثي",
    city: "",
    salaryFrom: "",
    salaryTo: "",
    currency: "SAR",
    description: "",
    requirements: "",
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
      stage: "رياض أطفال",
      gender: "أنثي",
      city: "",
      salaryFrom: "",
      salaryTo: "",
      currency: "SAR",
      description: "",
      requirements: "",
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
              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="مثال: معلمة لغة عربية"
                className="w-full mt-1 rounded-lg bg-gray-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-sky-700"
                required
              />
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
                <option>رياض أطفال</option>
                <option>ابتدائي</option>
                <option>إعدادي</option>
                <option>ثانوي</option>
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
            <div>
              <label className="text-sm text-slate-600">المدينة</label>
              <input
                name="city"
                value={form.city}
                onChange={handleChange}
                placeholder="مثال: الرياض"
                className="w-full mt-1 rounded-lg bg-gray-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-sky-700"
                required
              />
            </div>
            <div>
              <label className="text-sm text-slate-600">
                الراتب المتوقع (من)
              </label>
              <input
                name="salaryFrom"
                type="number"
                value={form.salaryFrom}
                onChange={handleChange}
                className="w-full mt-1 rounded-lg bg-gray-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-sky-700"
                required
              />
            </div>
            <div>
              <label className="text-sm text-slate-600">
                الراتب المتوقع (إلى)
              </label>
              <input
                name="salaryTo"
                type="number"
                value={form.salaryTo}
                onChange={handleChange}
                className="w-full mt-1 rounded-lg bg-gray-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-sky-700"
                required
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
              <label className="text-sm text-slate-600">
                المتطلبات والشروط
              </label>
              <textarea
                name="requirements"
                value={form.requirements}
                onChange={handleChange}
                rows="5"
                placeholder="درجة الباكلريوس في  ..."
                className="w-full mt-1 rounded-lg bg-gray-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-sky-700"
                required
              />
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
    </>
  );
};

export default PostJob;
