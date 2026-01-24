import useStore from "../src/store";
import { useNavigate } from "react-router-dom";
import { useMemo } from "react";

export default function CompanyDashboard() {
  const navigate = useNavigate();

  const user = useStore((state) => state.user);
  const companyProfile = useStore((state) => state.companyProfile);
  const jobs = useStore((state) => state.companyJobs);
  const jobApplications = useStore((state) => state.jobApplications);
  const registeredUsers = useStore((state) => state.registeredUsers);

  const companyName = companyProfile?.name || user?.name || "المنشأة";

  const activeJobs = useMemo(() => {
    return jobs.filter((job) => job.status === "active");
  }, [jobs]);

  const applicants = useMemo(() => {
    if (!user) return [];
    return jobApplications
      .filter((app) => {
        const job = jobs.find((j) => j.id === app.jobId);
        return job && job.company === user.name;
      })
      .map((app) => {
        const teacherUser = registeredUsers.find(
          (u) => u.email === app.teacherId,
        );
        return {
          ...app,
          photo: teacherUser?.photo || "",
        };
      });
  }, [jobApplications, jobs, user, registeredUsers]);

  const totalApplicants = useMemo(() => {
    return activeJobs.reduce((sum, job) => {
      const jobApplicants = applicants.filter((app) => app.jobId === job.id);
      return sum + jobApplicants.length;
    }, 0);
  }, [activeJobs, applicants]);

  return (
    <div className="bg-gray-50 p-24" dir="rtl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">لوحة تحكم المنشأة</h1>
          <p className="text-sm text-gray-500">{companyName}</p>
        </div>
        <button
          onClick={() => navigate("/PostJop")}
          className="flex items-center gap-2 bg-sky-700 text-white px-4 py-2 rounded-lg hover:bg-sky-900"
        >
          <span className="material-symbols-outlined">add</span>
          نشر وظيفة جديدة
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <StatCard
          title="طلبات التوظيف"
          value={totalApplicants}
          icon={<span className="material-symbols-outlined">group</span>}
          color="bg-green-100 text-green-600"
        />
        <StatCard
          title="الوظائف النشطة"
          value={activeJobs.length}
          icon={<span className="material-symbols-outlined">upload_file</span>}
          color="bg-blue-100 text-blue-600"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-sm p-5">
          <h2 className="font-semibold mb-4">أحدث المتقدمين</h2>

          {applicants.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p className="text-sm">لا يوجد متقدمين بعد</p>
            </div>
          ) : (
            applicants
              .sort((a, b) => new Date(b.appliedAt) - new Date(a.appliedAt))
              .slice(0, 5)
              .map((applicant) => (
                <div
                  key={applicant.id}
                  className="flex items-center justify-between border-b border-black/20 last:border-b-0 py-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-sky-100 flex items-center justify-center overflow-hidden">
                      {applicant.photo ? (
                        <img
                          src={applicant.photo}
                          alt={applicant.teacherName}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-sky-700 font-semibold">
                          {applicant.teacherName?.charAt(0) || "?"}
                        </span>
                      )}
                    </div>
                    <div>
                      <p className="font-medium">
                        {applicant.teacherName || "مقدم"}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(applicant.appliedAt).toLocaleDateString(
                          "ar-SA",
                        )}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => navigate(`/applicant/${applicant.id}`)}
                    className="text-sm border border-black/20 px-3 py-1 rounded hover:bg-gray-100"
                  >
                    عرض الملف
                  </button>
                </div>
              ))
          )}
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-5">
          <h2 className="font-semibold mb-4">الوظائف النشطة</h2>

          {jobs.map((job) => (
            <div
              key={job.id}
              className="border-b border-black/20 last:border-b-0 py-4"
            >
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                    نشط
                  </span>
                  <h3 className="font-medium mt-2">{job.title}</h3>
                  <p className="text-sm text-gray-500">
                    {job.city} · {job.jobType}
                  </p>
                </div>
                <div className="flex gap-2 text-xs">
                  <span className="bg-gray-100 px-2 py-1 rounded">
                    {job.stage}
                  </span>
                  <span className="bg-gray-100 px-2 py-1 rounded">
                    {job.applicants} متقدم
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, color }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-5 flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-2xl font-bold mt-1">{value}</p>
      </div>
      <div className={`p-3 rounded-xl ${color}`}>{icon}</div>
    </div>
  );
}
