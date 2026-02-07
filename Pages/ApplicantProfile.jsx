import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useStore from "../src/store";
import Header from "../Components/Header";
import SocialMediaLink from "../Components/SocialMediaLink";
import { formatLocation } from "../src/locationData";

export default function ApplicantProfile() {
  const { applicationId } = useParams();
  const navigate = useNavigate();
  const [showContactModal, setShowContactModal] = useState(false);

  const application = useStore((state) =>
    state.jobApplications.find((app) => app.id == applicationId),
  );
  
  const updateApplicationStatus = useStore((state) => state.updateApplicationStatus);

  const user = useStore((state) =>
    state.registeredUsers.find((u) => u.email === application?.teacherId),
  );
  const job = useStore((state) =>
    state.companyJobs.find((j) => j.id === application?.jobId),
  );

  const handleReject = () => {
    if (window.confirm("هل أنت متأكد من رفض هذا الطلب؟")) {
      updateApplicationStatus(application.id, "rejected");
      navigate(-1); // Go back to dashboard
    }
  };

  const handleInvite = () => {
     setShowContactModal(true);
  };

  if (!application || !user || !job) {
    return <p className="p-10 text-center text-gray-500">الملف غير موجود</p>;
  }

  return (
    <>
      <Header />

      <div className="bg-slate-100 min-h-screen pt-28 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Side Panel */}
          <div className="bg-white rounded-2xl shadow p-6 text-center">
            <div className="w-28 h-28 mx-auto mb-4 bg-slate-300 rounded-full flex items-center justify-center overflow-hidden">
              {user.photo ? (
                <img
                  src={user.photo}
                  alt="profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="material-symbols-outlined text-slate-500 text-4xl">
                  person
                </span>
              )}
            </div>

            <h2 className="font-bold text-lg text-slate-800">{user.name}</h2>
            <p className="text-sm text-slate-500 mt-1">
              {user.jobTitle || "معلم"}
            </p>

            <div className="mt-6 space-y-4 text-right">
              <label className="text-sm text-slate-600">الاسم الكامل</label>
              <div className="w-full rounded-lg p-3 bg-slate-200 text-slate-700">
                {user.name}
              </div>

              <label className="text-sm text-slate-600">المسمى الوظيفي</label>
              <div className="w-full rounded-lg p-3 bg-slate-200 text-slate-700">
                {user.jobTitle || "غير محدد"}
              </div>

              <label className="text-sm text-slate-600">البريد الإلكتروني</label>
              <div className="w-full rounded-lg p-3 bg-slate-200 text-slate-700">
                {user.email}
              </div>

              <label className="text-sm text-slate-600">رقم الهاتف</label>
              <div className="w-full rounded-lg p-3 bg-slate-200 text-slate-700">
                {user.phone ? (
                  <a href={`tel:${user.phone}`} className="text-sky-600 hover:text-sky-700 hover:underline flex items-center gap-2" dir="ltr">
                    <span className="material-symbols-outlined text-sm">call</span>
                    {user.phone}
                  </a>
                ) : "غير متوفر"}
              </div>

              {user.landline && (
                <>
                  <label className="text-sm text-slate-600">الرقم الثابت</label>
                  <div className="w-full rounded-lg p-3 bg-slate-200 text-slate-700">
                    <a href={`tel:${user.landline}`} className="text-sky-600 hover:text-sky-700 hover:underline flex items-center gap-2" dir="ltr">
                      <span className="material-symbols-outlined text-sm">deskphone</span>
                      {user.landline}
                    </a>
                  </div>
                </>
              )}

              <label className="text-sm text-slate-600">الموقع</label>
              <div className="w-full rounded-lg p-3 bg-slate-200 text-slate-700">
                {formatLocation(user.country, user.city, user.neighborhood) || "غير محدد"}
              </div>

              <label className="text-sm text-slate-600">الجنس</label>
              <div className="w-full rounded-lg p-3 bg-slate-200 text-slate-700">
                {user.gender === "female" ? "أنثى" : user.gender === "male" ? "ذكر" : user.gender || "غير محدد"}
              </div>

              <label className="text-sm text-slate-600">المؤهل العلمي</label>
              <div className="w-full rounded-lg p-3 bg-slate-200 text-slate-700">
                {user.education === "bachelor" ? "بكالوريوس" : user.education === "master" ? "ماجستير" : user.education === "phd" ? "دكتوراه" : user.education || "غير محدد"} 
                {user.educationField ? ` - ${user.educationField}` : ""}
              </div>
            </div>
            
            <div className="mt-8 pt-6 border-t border-slate-100">
                <p className="text-sm text-slate-500 mb-4">إجراءات الطلب</p>
                <div className="flex flex-col gap-3">
                  <button 
                    onClick={handleInvite}
                    className="bg-sky-700 text-white px-4 py-3 rounded-xl hover:bg-sky-600 transition font-semibold"
                  >
                    دعوة لمقابلة
                  </button>
                  <button 
                    onClick={handleReject}
                    className="bg-white border border-red-200 text-red-600 px-4 py-3 rounded-xl hover:bg-red-50 transition font-semibold"
                  >
                    رفض الطلب
                  </button>
                </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl shadow p-6">
              <h3 className="font-semibold mb-4 text-right border-b pb-2">تفاصيل الوظيفة المقدم عليها</h3>
              
              <div className="space-y-4 text-right">
                <div className="flex justify-between items-start">
                    <div>
                        <p className="text-sm text-slate-500">المسمى الوظيفي</p>
                        <p className="font-bold text-lg text-slate-800">{job.title}</p>
                    </div>
                     <div className="text-left">
                        <p className="text-sm text-slate-500">تاريخ التقديم</p>
                        <p className="text-slate-800 dir-ltr">{new Date(application.appliedAt).toLocaleDateString('ar-EG')}</p>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl">
                    <div>
                        <p className="text-xs text-slate-500">نوع الوظيفة</p>
                        <p className="font-medium text-slate-800">{job.jobType}</p>
                    </div>
                    <div>
                        <p className="text-xs text-slate-500">المرحلة الدراسية</p>
                        <p className="font-medium text-slate-800">{job.stage}</p>
                    </div>
                     <div>
                        <p className="text-xs text-slate-500">الموقع</p>
                        <p className="font-medium text-slate-800">{formatLocation(job.country, job.city, job.neighborhood)}</p>
                    </div>
                     <div>
                        <p className="text-xs text-slate-500">الراتب المتوقع</p>
                        <p className="font-medium text-slate-800">
                             {job.salaryFrom} - {job.salaryTo} {job.currency}
                        </p>
                    </div>
                </div>

                 <div className="bg-slate-50 p-4 rounded-xl space-y-3">
                    <div>
                        <p className="text-xs text-slate-500 mb-1">وصف الوظيفة</p>
                        <p className="text-sm text-slate-700 whitespace-pre-wrap">{job.description}</p>
                    </div>
                    {job.requirements && (
                        <div>
                             <p className="text-xs text-slate-500 mb-1">المتطلبات</p>
                            <p className="text-sm text-slate-700 whitespace-pre-wrap">{job.requirements}</p>
                        </div>
                    )}
                 </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow p-6">
              <h3 className="font-semibold mb-3 text-right">نبذة مهنية</h3>
              <div className="w-full rounded-lg p-4 bg-slate-50 text-slate-700 min-h-[100px] text-right">
                {user.bio || "لا توجد نبذة"}
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow p-6">
              <h3 className="font-semibold mb-3 text-right">المهارات اللغوية</h3>
              <div className="flex flex-wrap gap-2 justify-end">
                {user.languageSkills && user.languageSkills.length > 0 ? (
                  user.languageSkills.map((lang, index) => (
                    <div key={index} className="bg-sky-50 text-sky-700 px-4 py-2 rounded-xl border border-sky-100 flex items-center gap-2">
                      <span className="material-symbols-outlined text-sm">language</span>
                      <span className="font-medium">
                        {lang.language === "arabic" ? "العربية" : 
                         lang.language === "english" ? "الإنجليزية" : 
                         lang.language === "french" ? "الفرنسية" : 
                         lang.language === "german" ? "الألمانية" : 
                         lang.language}
                      </span>
                      <span className="text-xs text-sky-500">•</span>
                      <span className="text-xs">
                        {lang.level === "beginner" ? "مبتدئ" : 
                         lang.level === "intermediate" ? "متوسط" : 
                         lang.level === "advanced" ? "متقدم" : 
                         lang.level === "fluent" ? "طليق" : 
                         lang.level === "native" ? "لغة أم" : 
                         lang.level}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-center w-full text-slate-500 py-2">لا توجد مهارات لغوية مسجلة</p>
                )}
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow p-6">
              <h3 className="font-semibold mb-4 text-right">الخبرات العملية</h3>
              <div className="space-y-4">
                {user.experiences && user.experiences.length > 0 ? (
                  user.experiences.map((exp) => (
                    <div
                      key={exp.id}
                      className="flex justify-between pb-4 border-b border-slate-100 last:border-0"
                    >
                      <div className="text-right w-full">
                        <p className="font-semibold text-lg">• {exp.title}</p>
                        <p className="text-sky-700 text-sm">{exp.place}</p>
                        <span className="text-xs bg-slate-200 px-3 py-1 rounded-full mt-1 inline-block">
                          {exp.from} - {exp.to}
                        </span>
                         {exp.link && <SocialMediaLink url={exp.link} />}
                        <div className="flex gap-3 items-start mt-3 justify-end">
                          {exp.photos && exp.photos.length > 0 && (
                            <div className="flex gap-2 flex-wrap justify-end">
                              {exp.photos.map((photo, idx) => (
                                <img
                                  key={idx}
                                  src={photo}
                                  alt={`${exp.title} ${idx + 1}`}
                                  className="w-20 h-20 rounded-lg object-cover border border-slate-200"
                                />
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-slate-500 py-4">
                    لا توجد خبرات مسجلة
                  </p>
                )}
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow p-6">
              <h3 className="font-semibold mb-3 text-right">السيرة الذاتية</h3>
              {user.cv ? (
                <div className="flex justify-end">
                  <a
                    href={user.cv}
                    target="_blank"
                    rel="noreferrer"
                    className="bg-sky-100 text-sky-700 px-6 py-3 rounded-xl flex items-center gap-3 hover:bg-sky-200 transition"
                  >
                    <span className="material-symbols-outlined text-2xl">
                      description
                    </span>
                    <span className="font-medium">عرض السيرة الذاتية (PDF)</span>
                  </a>
                </div>
              ) : (
                <p className="text-center text-slate-500 py-4">
                  لا توجد سيرة ذاتية مرفقة
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {showContactModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm text-center">
            <h3 className="text-xl font-bold mb-6">اختر وسيلة التواصل</h3>
            <div className="flex flex-col gap-4">
              <a 
                href={`mailto:${user.email}`}
                className="bg-slate-100 hover:bg-slate-200 text-slate-800 py-3 rounded-xl flex items-center justify-center gap-2 transition"
              >
                <span className="material-symbols-outlined">mail</span>
                <span>البريد الإلكتروني</span>
              </a>
              {user.phone && (
                <a 
                   href={`tel:${user.phone}`}
                   className="bg-slate-100 hover:bg-slate-200 text-slate-800 py-3 rounded-xl flex items-center justify-center gap-2 transition"
                >
                  <span className="material-symbols-outlined">call</span>
                  <span>رقم الهاتف</span>
                </a>
              )}
            </div>
            <button 
              onClick={() => setShowContactModal(false)}
              className="mt-6 text-slate-500 hover:text-slate-800 text-sm underline"
            >
              إلغاء
            </button>
          </div>
        </div>
      )}
    </>
  );
}
