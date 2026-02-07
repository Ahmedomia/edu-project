import useStore from "../src/store";
import { useNavigate } from "react-router-dom";
import { useMemo } from "react";
import { formatLocation } from "../src/locationData";
import { useState } from "react";

export default function CompanyDashboard() {
  const navigate = useNavigate();

  const user = useStore((state) => state.user);
  const companyProfile = useStore((state) => state.companyProfile);
  const jobs = useStore((state) => state.companyJobs);
  const jobApplications = useStore((state) => state.jobApplications);
  const registeredUsers = useStore((state) => state.registeredUsers);
  const deleteJob = useStore((state) => state.deleteJob);

  const [showAllApplicants, setShowAllApplicants] = useState(false);
  const [showAllJobs, setShowAllJobs] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);

  const companyName = companyProfile?.name || user?.name || "المنشأة";

  const activeJobs = useMemo(() => {
    return jobs.filter((job) => job.status === "active");
  }, [jobs]);

  const applicants = useMemo(() => {
    if (!user) return [];
    return jobApplications
      .filter((app) => {
        const job = jobs.find((j) => j.id === app.jobId);
        return job && job.company === user.name && app.status !== "rejected";
      })
      .map((app) => {
        const teacherUser = registeredUsers.find(
          (u) => u.email === app.teacherId,
        );
        return {
          ...app,
          photo: teacherUser?.photo || "",
          jobTitle: teacherUser?.jobTitle || "",
          totalExperienceYears: teacherUser?.totalExperienceYears || 0,
          educationField: teacherUser?.educationField || "",
          city: teacherUser?.city || "",
          neighborhood: teacherUser?.neighborhood || "",
          country: teacherUser?.country || "",
          languageSkills: teacherUser?.languageSkills || [],
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
    <div className="bg-gray-50 px-4 py-6 md:px-12 lg:px-24 pt-24" dir="rtl">
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
          onClick={() => setShowAllApplicants(true)}
          clickable={true}
        />
        <StatCard
          title="الوظائف النشطة"
          value={activeJobs.length}
          icon={<span className="material-symbols-outlined">upload_file</span>}
          color="bg-blue-100 text-blue-600"
          onClick={() => setShowAllJobs(true)}
          clickable={true}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {!showAllJobs && (
          <div className={`bg-white rounded-2xl shadow-sm p-5 ${showAllApplicants ? 'lg:col-span-2' : ''}`}>
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-semibold">{showAllApplicants ? "جميع طلبات التوظيف" : "أحدث المتقدمين"}</h2>
            {showAllApplicants && (
              <button 
                onClick={() => setShowAllApplicants(false)}
                className="text-sm text-sky-700 hover:underline flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
                العودة للوحة التحكم
              </button>
            )}
          </div>

          {applicants.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p className="text-sm">لا يوجد متقدمين بعد</p>
            </div>
          ) : (
            applicants
              .sort((a, b) => new Date(b.appliedAt) - new Date(a.appliedAt))
              .slice(0, showAllApplicants ? applicants.length : 10)
              .map((applicant) => (
                <div
                  key={applicant.id}
                  className="flex items-center justify-between border-b border-black/10 last:border-b-0 py-4 px-2 hover:bg-gray-50 rounded-xl transition-colors"
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
                    <div className="flex-1">
                      <p className="font-medium text-slate-800">
                        {applicant.teacherName || "مقدم"}
                      </p>
                      <div className="flex flex-wrap gap-x-3 gap-y-1 mt-1">
                        <span className="text-xs text-slate-500 flex items-center gap-1">
                          <span className="material-symbols-outlined text-xs">work</span>
                          {applicant.jobTitle || "معلم"}
                        </span>
                        <span className="text-xs text-slate-500 flex items-center gap-1">
                          <span className="material-symbols-outlined text-xs">history</span>
                          خبرة {applicant.totalExperienceYears} سنة
                        </span>
                        <span className="text-xs text-slate-500 flex items-center gap-1">
                          <span className="material-symbols-outlined text-xs">location_on</span>
                          {formatLocation(applicant.country, applicant.city, applicant.neighborhood)}
                        </span>
                      </div>
                      <p className="text-[10px] text-gray-400 mt-1">
                        تم التقديم في: {new Date(applicant.appliedAt).toLocaleDateString(
                          "ar-SA",
                        )}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => navigate(`/applicant/${applicant.id}`)}
                    className="p-2 rounded-full hover:text-blue-600 text-slate-600 transition-colors"
                    title="عرض الملف"
                  >
                    <span className="material-symbols-outlined">visibility</span>
                  </button>
                </div>
              ))
          )}
        </div>
        )}
        
        {!showAllApplicants && (
          <div className={`bg-white rounded-2xl shadow-sm p-5 ${showAllJobs ? 'lg:col-span-2' : ''}`}>
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-semibold">{showAllJobs ? "جميع الوظائف" : "الوظائف النشطة"}</h2>
            {showAllJobs && (
              <button 
                onClick={() => setShowAllJobs(false)}
                className="text-sm text-sky-700 hover:underline flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
                العودة للوحة التحكم
              </button>
            )}
          </div>

          {jobs
            .slice(0, showAllJobs ? jobs.length : 10)
            .map((job) => (
            <div
              key={job.id}
              onClick={() => setSelectedJob(job)}
              className="border-b border-black/10 last:border-b-0 py-4 px-3 cursor-pointer hover:bg-gray-50 rounded-xl transition-colors"
            >
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                    نشط
                  </span>
                  <h3 className="font-medium mt-2">{job.title}</h3>
                  <p className="text-sm text-gray-500">
                    {formatLocation(job.country, job.city, job.neighborhood)} · {job.jobType}
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
        )}
      </div>

      {/* Job Details Modal */}
      {selectedJob && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto" dir="rtl">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-slate-800">{selectedJob.title}</h2>
                  <p className="text-slate-500 mt-1">{formatLocation(selectedJob.country, selectedJob.city, selectedJob.neighborhood)}</p>
                </div>
                <button 
                  onClick={() => setSelectedJob(null)}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                <DetailItem icon="work" label="نوع الوظيفة" value={selectedJob.jobType} />
                <DetailItem icon="school" label="المرحلة الدراسية" value={selectedJob.stage} />
                <DetailItem icon="payments" label="الراتب" value={`${selectedJob.salaryFrom || 0} - ${selectedJob.salaryTo || 0} ${selectedJob.currency || "ر.س"}`} />
                <DetailItem icon="person" label="الجنس المطلوب" value={selectedJob.gender} />
                <DetailItem icon="groups" label="عدد المتقدمين" value={selectedJob.applicants || 0} />
                <DetailItem icon="calendar_today" label="تاريخ النشر" value={new Date(selectedJob.createdAt).toLocaleDateString("ar-SA")} />
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-slate-800 mb-2 flex items-center gap-2">
                    <span className="material-symbols-outlined text-sky-700">description</span>
                    وصف الوظيفة
                  </h3>
                  <div className="bg-slate-50 p-4 rounded-xl text-slate-700 whitespace-pre-wrap leading-relaxed">
                    {selectedJob.description || "لا يوجد وصف"}
                  </div>
                </div>

                {selectedJob.requirements && (
                  <div>
                    <h3 className="font-semibold text-slate-800 mb-2 flex items-center gap-2">
                      <span className="material-symbols-outlined text-sky-700">list_alt</span>
                      المتطلبات
                    </h3>
                    <div className="bg-slate-50 p-4 rounded-xl text-slate-700 whitespace-pre-wrap leading-relaxed">
                      {selectedJob.requirements}
                    </div>
                  </div>
                )}

                {selectedJob.mapUrl && (
                  <div>
                    <h3 className="font-semibold text-slate-800 mb-2 flex items-center gap-2">
                      <span className="material-symbols-outlined text-sky-700">location_on</span>
                      رابط الموقع
                    </h3>
                    <a 
                      href={selectedJob.mapUrl} 
                      target="_blank" 
                      rel="noreferrer"
                      className="text-sky-700 hover:underline flex items-center gap-1"
                    >
                      عرض الموقع على الخريطة
                      <span className="material-symbols-outlined text-sm">open_in_new</span>
                    </a>
                  </div>
                )}
              </div>

              <div className="mt-8 pt-6 border-t flex flex-col sm:flex-row gap-3">
                <button 
                  onClick={() => {
                    if (window.confirm("هل أنت متأكد من حذف هذه الوظيفة؟ سيتم حذف جميع الطلبات المرتبطة بها أيضاً.")) {
                      deleteJob(selectedJob.id);
                      setSelectedJob(null);
                    }
                  }}
                  className="flex-1 bg-red-50 text-red-600 py-3 rounded-xl hover:bg-red-100 transition-colors flex items-center justify-center gap-2 font-semibold"
                >
                  <span className="material-symbols-outlined">delete</span>
                  حذف الوظيفة
                </button>
                <button 
                  onClick={() => setSelectedJob(null)}
                  className="flex-1 bg-slate-800 text-white py-3 rounded-xl hover:bg-slate-900 transition-colors font-semibold"
                >
                  إغلاق
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function DetailItem({ icon, label, value }) {
  return (
    <div className="bg-slate-50 p-3 rounded-2xl flex items-center gap-3">
      <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-sky-700">
        <span className="material-symbols-outlined">{icon}</span>
      </div>
      <div>
        <p className="text-[10px] text-slate-500">{label}</p>
        <p className="text-sm font-semibold text-slate-800">{value}</p>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, color, onClick, clickable }) {
  return (
    <div 
      onClick={onClick}
      className={`bg-white rounded-2xl shadow-sm p-5 flex items-center justify-between ${clickable ? 'cursor-pointer hover:shadow-md transition-shadow' : ''}`}
    >
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-2xl font-bold mt-1">{value}</p>
      </div>
      <div className={`p-3 rounded-xl ${color}`}>{icon}</div>
    </div>
  );
}
