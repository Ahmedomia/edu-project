import { useParams } from "react-router-dom";
import useStore from "../src/store";

const TeacherProfile = () => {
  const { email } = useParams();

  const teacher = useStore((state) =>
    state.registeredUsers.find((u) => u.email === decodeURIComponent(email)),
  );

  if (!teacher) {
    return (
      <div className="p-20 text-center text-gray-500">الملف غير موجود</div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto mt-24 bg-white rounded-2xl shadow p-8">
      <div className="flex items-center gap-6">
        <img
          src={teacher.photo || "/avatar.png"}
          alt={teacher.name}
          className="w-24 h-24 rounded-full object-cover"
        />
        <div>
          <h1 className="text-2xl font-bold">{teacher.name}</h1>
          <p className="text-slate-500">{teacher.jobTitle}</p>
          <p className="text-sm text-slate-400">{teacher.city}</p>
        </div>
      </div>

      <hr className="my-6" />

      <section>
        <h2 className="font-semibold mb-2">نبذة</h2>
        <p className="text-slate-700">{teacher.bio || "لا يوجد نبذة"}</p>
      </section>

      <section className="mt-6">
        <h2 className="font-semibold mb-2">بيانات التواصل</h2>
        <p className="flex items-center gap-2 text-sm text-slate-700">
          <span className="material-symbols-outlined text-slate-500">mail</span>
          {teacher.email}
        </p>
        {teacher.phone && (
          <p className="flex items-center gap-2 text-sm text-slate-700 mt-2">
            <span className="material-symbols-outlined text-slate-500">
              call
            </span>
            {teacher.phone}
          </p>
        )}
      </section>

      <div className="mt-8 flex gap-4">
        <button className="bg-sky-700 text-white px-5 py-2 rounded-lg">
          دعوة لمقابلة
        </button>
      </div>
    </div>
  );
};

export default TeacherProfile;
