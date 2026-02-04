import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useStore from "../src/store";
import Header from "../Components/Header";

const TeacherProfile = () => {
  const { email } = useParams();
  const navigate = useNavigate();
  const [showContactModal, setShowContactModal] = useState(false);

  const teacher = useStore((state) =>
    state.registeredUsers.find((u) => u.email === decodeURIComponent(email)),
  );

  const handleInvite = () => {
    setShowContactModal(true);
  };

  if (!teacher) {
    return (
      <>
        <Header />
        <div className="p-20 text-center text-gray-500 pt-32">الملف غير موجود</div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="bg-slate-100 min-h-screen pt-28 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Side Panel - Identical to ApplicantProfile but without Reject button */}
          <div className="bg-white rounded-2xl shadow p-6 text-center">
            <div className="w-28 h-28 mx-auto mb-4 bg-slate-300 rounded-full flex items-center justify-center overflow-hidden">
              {teacher.photo ? (
                <img
                  src={teacher.photo}
                  alt={teacher.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="material-symbols-outlined text-slate-500 text-4xl">
                  person
                </span>
              )}
            </div>

            <h2 className="font-bold text-lg text-slate-800">{teacher.name}</h2>
            <p className="text-sm text-slate-500 mt-1">
              {teacher.jobTitle || "معلم"}
            </p>

            <div className="mt-6 space-y-4 text-right">
              <label className="text-sm text-slate-600">الاسم الكامل</label>
              <div className="w-full rounded-lg p-3 bg-slate-200 text-slate-700">
                {teacher.name}
              </div>

              <label className="text-sm text-slate-600">المسمى الوظيفي</label>
              <div className="w-full rounded-lg p-3 bg-slate-200 text-slate-700">
                {teacher.jobTitle || "غير محدد"}
              </div>

              <label className="text-sm text-slate-600">البريد الإلكتروني</label>
              <div className="w-full rounded-lg p-3 bg-slate-200 text-slate-700">
                {teacher.email}
              </div>

              <label className="text-sm text-slate-600">رقم الهاتف</label>
              <div className="w-full rounded-lg p-3 bg-slate-200 text-slate-700">
                {teacher.phone || "غير متوفر"}
              </div>

              <label className="text-sm text-slate-600">المدينة</label>
              <div className="w-full rounded-lg p-3 bg-slate-200 text-slate-700">
                {teacher.city || "غير محدد"}
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-100">
              <button 
                onClick={handleInvite}
                className="w-full bg-sky-700 text-white px-4 py-3 rounded-xl hover:bg-sky-600 transition font-semibold"
              >
                دعوة لمقابلة
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl shadow p-6">
              <h3 className="font-semibold mb-3 text-right">نبذة مهنية</h3>
              <div className="w-full rounded-lg p-4 bg-slate-50 text-slate-700 min-h-[100px] text-right">
                {teacher.bio || "لا توجد نبذة"}
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow p-6">
              <h3 className="font-semibold mb-4 text-right">الخبرات العملية</h3>
              <div className="space-y-4">
                {teacher.experiences && teacher.experiences.length > 0 ? (
                  teacher.experiences.map((exp) => (
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
                        {exp.link && (
                          <a
                            href={exp.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block mt-2 text-sky-600 hover:underline text-sm flex items-center gap-1 justify-end"
                          >
                            <span>رابط</span>
                            <span className="material-symbols-outlined text-sm">link</span>
                          </a>
                        )}
                        
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
              {teacher.cv ? (
                <div className="flex justify-end">
                  <a
                    href={teacher.cv}
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
                href={`mailto:${teacher.email}`}
                className="bg-slate-100 hover:bg-slate-200 text-slate-800 py-3 rounded-xl flex items-center justify-center gap-2 transition"
              >
                <span className="material-symbols-outlined">mail</span>
                <span>البريد الإلكتروني</span>
              </a>
              {teacher.phone && (
                <a 
                   href={`tel:${teacher.phone}`}
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
};

export default TeacherProfile;
