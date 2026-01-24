import useStore from "../src/store";
import { useMemo, useState } from "react";
import Notification from "./Notification";

export default function SuggestedJobs() {
  const companyJobs = useStore((state) => state.companyJobs);
  const addJobApplication = useStore((state) => state.addJobApplication);
  const user = useStore((state) => state.user);
  const [notification, setNotification] = useState(null);

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

  const currencyMap = {
    EGP: "ج.م",
    SAR: "ر.س",
    USD: "$",
  };

  const suggestedJobs = useMemo(() => {
    return companyJobs
      .filter((job) => job.status === "active")
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5);
  }, [companyJobs]);

  const formatSalary = (job) => {
    if (!job.salaryFrom) return "";

    const symbol = currencyMap[job.currency] || job.currency || "";

    if (job.salaryFrom && job.salaryTo) {
      return `${symbol} ${job.salaryFrom} - ${job.salaryTo}`;
    }

    return `${symbol} ${job.salaryFrom}+`;
  };

  const getTimeAgo = (createdAt) => {
    if (!createdAt) return "منذ فترة";
    const now = new Date();
    const created = new Date(createdAt);
    const diffInHours = Math.floor((now - created) / (1000 * 60 * 60));

    if (diffInHours < 1) return "منذ أقل من ساعة";
    if (diffInHours < 24) return `منذ ${diffInHours} ساعة`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `منذ ${diffInDays} يوم`;
    const diffInWeeks = Math.floor(diffInDays / 7);
    return `منذ ${diffInWeeks} أسبوع`;
  };

  return (
    <div className="bg-gray-50 pl-24 pr-24 pb-12" dir="rtl">
      <h2 className="text-xl font-bold mb-6">وظائف مقترحة لك</h2>

      <div className="space-y-4">
        {suggestedJobs.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm p-8 text-center text-gray-500">
            <p>لا توجد وظائف متاحة حالياً</p>
          </div>
        ) : (
          suggestedJobs.map((job) => (
            <JobCard
              key={job.id}
              jobId={job.id}
              onApply={handleApply}
              job={{
                title: job.title,
                company: job.company,
                type: job.jobType,
                location: job.city || "غير محدد",
                salary: formatSalary(job),
                time: getTimeAgo(job.createdAt),
              }}
            />
          ))
        )}
      </div>
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}
    </div>
  );
}

function JobCard({ job, jobId, onApply }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm hover:shadow-md p-5 flex items-start justify-between gap-4">
      <div className="flex-1">
        <h3 className="text-lg font-semibold text-sky-900">{job.title}</h3>
        <p className="text-gray-600 text-sm mb-3">{job.company}</p>

        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
          <span className="flex items-center gap-1">
            <span className="material-symbols-outlined">distance</span>
            {job.location}
          </span>
          <span className="flex items-center gap-1">
            <span className="material-symbols-outlined">
              nest_clock_farsight_analog
            </span>
            {job.time}
          </span>
          {job.salary && (
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined">card_travel</span>
              {job.salary}
            </span>
          )}
        </div>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full whitespace-nowrap">
          {job.type}
        </span>
        <button
          onClick={() => onApply(jobId)}
          className="bg-sky-700 text-white px-4 py-2 rounded-lg hover:bg-sky-900 transition cursor-pointer"
        >
          التقديم
        </button>
      </div>
    </div>
  );
}
