import { useState, useMemo } from "react";
import Header from "../Components/Header";
import useStore from "../src/store";
import Notification from "../Components/Notification";

export default function JobSearch() {
  const companyJobs = useStore((state) => state.companyJobs);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCity, setSelectedCity] = useState("الكل");
  const [selectedStage, setSelectedStage] = useState("الكل");
  const [selectedJobType, setSelectedJobType] = useState("الكل");
  const [selectedGender, setSelectedGender] = useState("الكل");
  const [salaryMin, setSalaryMin] = useState("");
  const [salaryMax, setSalaryMax] = useState("");
  const [datePosted, setDatePosted] = useState("الكل");
  const applyForJob = useStore((state) => state.applyForJob);
  const user = useStore((state) => state.user);
  const [notification, setNotification] = useState(null);

  const cities = useMemo(() => {
    const citySet = new Set(companyJobs.map((job) => job.city).filter(Boolean));
    return ["الكل", ...Array.from(citySet)];
  }, [companyJobs]);

  const stages = useMemo(() => {
    const stageSet = new Set(
      companyJobs.map((job) => job.stage).filter(Boolean),
    );
    return ["الكل", ...Array.from(stageSet)];
  }, [companyJobs]);

  const currencyMap = {
    EGP: "ج.م",
    SAR: "ر.س",
    USD: "$",
  };

  const filteredJobs = useMemo(() => {
    return companyJobs.filter((job) => {
      const matchesSearch =
        !searchTerm ||
        job.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.company?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCity = selectedCity === "الكل" || job.city === selectedCity;
      const matchesStage =
        selectedStage === "الكل" || job.stage === selectedStage;
      const matchesJobType =
        selectedJobType === "الكل" || job.jobType === selectedJobType;
      const matchesGender =
        selectedGender === "الكل" || job.gender === selectedGender;
      
      const jobSalaryFrom = Number(job.salaryFrom) || 0;
      const jobSalaryTo = Number(job.salaryTo) || Infinity;
      const minFilter = Number(salaryMin) || 0;
      const maxFilter = Number(salaryMax) || Infinity;

      const matchesSalary = 
        (salaryMin === "" || jobSalaryTo >= minFilter) &&
        (salaryMax === "" || jobSalaryFrom <= maxFilter);

      let matchesDate = true;
      if (datePosted !== "الكل") {
        const jobDate = new Date(job.createdAt);
        const now = new Date();
        const diffTime = Math.abs(now - jobDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 

        if (datePosted === "24h") {
           matchesDate = diffDays <= 1;
        } else if (datePosted === "week") {
           matchesDate = diffDays <= 7;
        } else if (datePosted === "month") {
           matchesDate = diffDays <= 30;
        }
      }

      const isActive = job.status === "active";

      return matchesSearch && matchesCity && matchesStage && matchesJobType && matchesGender && matchesSalary && matchesDate && isActive;
    });
  }, [companyJobs, searchTerm, selectedCity, selectedStage, selectedJobType, selectedGender, salaryMin, salaryMax, datePosted]);

  const formatSalary = (job) => {
    const symbol = currencyMap[job.currency] || job.currency || "";

    if (job.salaryFrom && job.salaryTo) {
      return `${symbol} ${job.salaryFrom} - ${job.salaryTo}`;
    }
    if (job.salaryFrom) {
      return `${symbol} ${job.salaryFrom}+`;
    }
    return "غير محدد";
  };

  const getJobTags = (job) => {
    const tags = [];
    if (job.gender) tags.push(job.gender);
    if (job.stage) tags.push(job.stage);
    return tags;
  };

  const handleApply = (jobId) => {
    if (!user) {
      setNotification({
        message: "يجب تسجيل الدخول أولاً",
        type: "warning",
      });
      return;
    }

    const alreadyApplied = useStore
      .getState()
      .jobApplications.some(
        (app) => app.jobId === jobId && app.teacherId === user.email,
      );

    if (alreadyApplied) {
      setNotification({
        message: "لقد قمت بالتقديم على هذه الوظيفة مسبقًا",
        type: "error",
      });
      return;
    }

    const job = companyJobs.find((j) => j.id === jobId);
    applyForJob({
      jobId,
      teacherId: user.email,
      teacherName: user.name,
      company: job?.company,
    });

    setNotification({
      message: "تم إرسال طلب التوظيف بنجاح",
      type: "success",
    });
  };

  return (
    <>
      <Header />
      <div className="bg-slate-100 min-h-screen pt-28 px-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl font-bold text-right mb-6">البحث عن وظائف</h1>

          <div className="bg-white rounded-2xl shadow p-4 mb-6 flex flex-col gap-4">
             <div className="flex flex-col md:flex-row md:flex-wrap gap-4 items-stretch md:items-center justify-end">
                <input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="ابحث بالمسمى الوظيفي أو اسم المدرسة"
                  className="flex-1 min-w-0 w-full md:min-w-[250px] rounded-lg bg-slate-100 px-4 py-3"
                />
             </div>
             
             <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="rounded-lg bg-slate-100 px-4 py-3"
                >
                  <option value="الكل">كل المدن</option>
                  {cities.filter(c => c !== "الكل").map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
                <select
                  value={selectedStage}
                  onChange={(e) => setSelectedStage(e.target.value)}
                  className="rounded-lg bg-slate-100 px-4 py-3"
                >
                   <option value="الكل">كل المراحل</option>
                  {stages.filter(s => s !== "الكل").map((stage) => (
                    <option key={stage} value={stage}>
                      {stage}
                    </option>
                  ))}
                </select>
                <select
                  value={selectedJobType}
                  onChange={(e) => setSelectedJobType(e.target.value)}
                  className="rounded-lg bg-slate-100 px-4 py-3"
                >
                  <option value="الكل">كل أنواع الوظائف</option>
                  <option value="دوام كامل">دوام كامل</option>
                  <option value="دوام جزئي">دوام جزئي</option>
                  <option value="عن بُعد">عن بُعد</option>
                </select>
                <select
                  value={selectedGender}
                  onChange={(e) => setSelectedGender(e.target.value)}
                  className="rounded-lg bg-slate-100 px-4 py-3"
                >
                  <option value="الكل">كل الأجناس</option>
                  <option value="ذكر">ذكر</option>
                  <option value="أنثي">أنثى</option>
                  <option value="لا يهم">لا يهم</option>
                </select>
                 <select
                  value={datePosted}
                  onChange={(e) => setDatePosted(e.target.value)}
                  className="rounded-lg bg-slate-100 px-4 py-3"
                >
                  <option value="الكل">كل الأوقات</option>
                  <option value="24h">آخر 24 ساعة</option>
                  <option value="week">آخر أسبوع</option>
                  <option value="month">آخر شهر</option>
                </select>
                 <div className="flex gap-2">
                    <input
                      type="number"
                      value={salaryMin}
                      onChange={(e) => setSalaryMin(e.target.value)}
                      placeholder="أقل راتب"
                      className="w-full rounded-lg bg-slate-100 px-2 py-3 text-sm"
                    />
                     <input
                      type="number"
                      value={salaryMax}
                      onChange={(e) => setSalaryMax(e.target.value)}
                      placeholder="أعلى راتب"
                      className="w-full rounded-lg bg-slate-100 px-2 py-3 text-sm"
                    />
                 </div>
             </div>
          </div>

          <div className="space-y-4">
            {filteredJobs.length === 0 ? (
              <div className="bg-white rounded-2xl shadow p-8 text-center text-slate-500">
                <p className="text-lg">لا توجد وظائف متاحة</p>
                <p className="text-sm mt-2">جرب تغيير معايير البحث</p>
              </div>
            ) : (
              filteredJobs.map((job) => {
                const tags = getJobTags(job);
                return (
                  <div
                    key={job.id}
                    className="bg-white rounded-2xl shadow p-6 flex flex-col md:flex-row md:justify-between md:items-center gap-4"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-sky-100 flex items-center justify-center text-sky-700">
                        <span className="material-symbols-outlined">
                          school
                        </span>
                      </div>
                      <div className="text-right">
                        <h3 className="font-semibold">{job.title}</h3>
                        <p className="text-sm text-slate-500">{job.company}</p>
                        {tags.length > 0 && (
                          <div className="flex gap-2 mt-2 justify-end">
                            {tags.map((tag, index) => (
                              <span
                                key={index}
                                className="text-xs bg-sky-100 text-sky-700 px-3 py-1 rounded-full"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="text-right text-sm text-slate-600 space-y-2">
                      <p>{job.city}</p>
                      <p>{formatSalary(job)}</p>
                      <p>{job.jobType}</p>
                      <div className="flex gap-3 justify-end pt-2">
                        <button
                          onClick={() => handleApply(job.id)}
                          className="bg-sky-800 text-white rounded-lg px-4 py-2 cursor-pointer hover:bg-sky-600"
                        >
                          تقديم الآن
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}
    </>
  );
}
