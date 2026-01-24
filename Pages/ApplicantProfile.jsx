import { useParams } from "react-router-dom";
import useStore from "../src/store";
import Header from "../Components/Header";

export default function ApplicantProfile() {
  const { applicationId } = useParams();

  const application = useStore((state) =>
    state.jobApplications.find((app) => app.id == applicationId),
  );
  const user = useStore((state) =>
    state.registeredUsers.find((u) => u.email === application?.teacherId),
  );
  const job = useStore((state) =>
    state.companyJobs.find((j) => j.id === application?.jobId),
  );

  if (!application || !user || !job) {
    return <p className="p-10 text-center text-gray-500">الملف غير موجود</p>;
  }

  return (
    <>
      <Header />

      <div className="max-w-5xl mx-auto p-8 bg-white rounded-2xl shadow mt-20 space-y-8">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <img
            src={user.photo || "/avatar.png"}
            alt={user.name}
            className="w-28 h-28 rounded-full object-cover border-2 border-sky-300"
          />
          <div className="text-center md:text-right">
            <h1 className="text-3xl font-bold">{user.name}</h1>
            <p className="text-sky-700 font-medium">{user.jobTitle}</p>
            <p className="text-sm text-gray-400">{user.city}</p>
          </div>
        </div>
        <section className="bg-slate-50 p-6 rounded-xl shadow-sm space-y-3">
          <h2 className="text-xl font-semibold mb-2 border-b pb-2">
            تفاصيل الوظيفة
          </h2>
          <div className="space-y-1">
            <p>
              <strong>عنوان الوظيفة:</strong> {job.title}
            </p>
            <p>
              <strong>الوصف:</strong> {job.description || "لا يوجد وصف"}
            </p>
            <p>
              <strong>المتطلبات والشروط:</strong>{" "}
              {job.requirements || "لا توجد متطلبات"}
            </p>
            <p>
              <strong>تم التقديم في:</strong>{" "}
              {new Date(application.appliedAt).toLocaleDateString("ar-EG")}
            </p>
          </div>
        </section>
        <section className="bg-slate-50 p-6 rounded-xl shadow-sm">
          <h2 className="text-xl font-semibold mb-2 border-b pb-2">
            نبذة عن المتقدم
          </h2>
          <p className="text-gray-700">{user.bio || "لا يوجد نبذة"}</p>
        </section>
        <section className="bg-slate-50 p-6 rounded-xl shadow-sm">
          <h2 className="text-xl font-semibold mb-4 border-b pb-2">
            الخبرات العملية
          </h2>
          {user.experiences?.length ? (
            <ul className="space-y-3">
              {user.experiences.map((exp) => (
                <li
                  key={exp.id}
                  className="p-3 rounded-lg border border-slate-200 hover:shadow transition"
                >
                  <p className="font-medium">{exp.title}</p>
                  <p className="text-sm text-gray-500">{exp.company}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-400">لا توجد خبرات</p>
          )}
        </section>
        <div className="flex flex-col md:flex-row gap-4 justify-center">
          <button className="bg-sky-700 text-white px-6 py-3 rounded-lg hover:bg-sky-600 transition">
            دعوة لمقابلة
          </button>
          <button className="border px-6 py-3 rounded-lg hover:bg-gray-100 transition">
            رفض
          </button>
        </div>
      </div>
    </>
  );
}
