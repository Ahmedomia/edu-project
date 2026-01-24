import { useState, useMemo } from "react";
import Header from "../Components/Header";
import useStore from "../src/store";
import Notification from "../Components/Notification";

export default function JobSearch() {
  const companyJobs = useStore((state) => state.companyJobs);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCity, setSelectedCity] = useState("الكل");
  const [selectedStage, setSelectedStage] = useState("الكل");
  const addJobApplication = useStore((state) => state.addJobApplication);
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
      const isActive = job.status === "active";

      return matchesSearch && matchesCity && matchesStage && isActive;
    });
  }, [companyJobs, searchTerm, selectedCity, selectedStage]);

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

    addJobApplication(jobId);

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

          <div className="bg-white rounded-2xl shadow p-4 mb-6 flex flex-wrap gap-4 items-center justify-end">
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="ابحث بالمسمى الوظيفي أو اسم المدرسة"
              className="flex-1 min-w-[250px] rounded-lg bg-slate-800 text-white px-4 py-3"
            />
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="rounded-lg bg-slate-800 text-white px-4 py-3"
            >
              {cities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
            <select
              value={selectedStage}
              onChange={(e) => setSelectedStage(e.target.value)}
              className="rounded-lg bg-slate-800 text-white px-4 py-3"
            >
              {stages.map((stage) => (
                <option key={stage} value={stage}>
                  {stage}
                </option>
              ))}
            </select>
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
                    className="bg-white rounded-2xl shadow p-6 flex justify-between items-center"
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
