import { useNavigate } from "react-router-dom";
import useStore from "../src/store";
import { useMemo } from "react";

export default function TeacherDashboard() {
  const navigate = useNavigate();
  const user = useStore((state) => state.user);
  const profile = useStore((state) => state.profile);
  const experiences = useStore((state) => state.experiences);
  const teacherStats = useStore((state) => state.teacherStats);

  const profileCompletion = useMemo(() => {
    if (!user) return 0;
    let completed = 0;
    let total = 6;

    if (user.name) completed++;
    if (user.email) completed++;
    if (user.phone) completed++;
    if (user.city) completed++;
    if (profile?.bio) completed++;
    if (experiences.length > 0) completed++;

    return Math.round((completed / total) * 100);
  }, [user, profile, experiences]);

  const displayName = profile?.name || user?.name || "معلم";
  const displayTitle = profile?.bio 
    ? profile.bio.split(" ").slice(0, 3).join(" ") 
    : experiences.length > 0 
    ? experiences[0].title 
    : "معلم";
  
  const userPhoto = profile?.photo || user?.photo;

  return (
    <div className="bg-gray-50 px-4 py-6 md:px-12 lg:px-24 pt-24" dir="rtl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">لوحة تحكم المعلم</h1>
        <button 
          onClick={() => navigate("/Profile")}
          className="bg-sky-700 text-white px-4 py-2 rounded-lg shadow hover:bg-sky-900 transition"
        >
          تحديث السيرة الذاتية
        </button>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl shadow p-6 flex flex-col items-center text-center">
          <h2 className="text-lg font-semibold mb-4">حالة الملف الشخصي</h2>
          <div className="w-24 h-24 rounded-full bg-sky-100 flex items-center justify-center mb-3 overflow-hidden">
            {userPhoto ? (
              <img
                src={userPhoto}
                alt={displayName}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-3xl text-sky-700 font-bold">
                {displayName.charAt(0)}
              </span>
            )}
          </div>
          <p className="font-medium text-gray-700">{displayName}</p>
          <p className="text-sm text-gray-500 mt-1">{displayTitle}</p>
          <div className="w-full mt-4">
            <div className="flex justify-between text-sm text-gray-500 mb-1">
              <span>اكتمال الملف</span>
              <span>{profileCompletion}%</span>
            </div>
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-sky-900 rounded-full transition-all"
                style={{ width: `${profileCompletion}%` }}
              />
            </div>
          </div>
        </div>
        <div className="lg:col-span-2 bg-white rounded-2xl shadow p-6">
          <h2 className="text-lg font-semibold mb-4">الإحصائيات</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <StatCard
              title="مشاهدات الملف"
              value={teacherStats.profileViews}
              color="text-purple-600"
              bg="bg-purple-50"
            />
            <StatCard
              title="دعوات للمقابلة"
              value={teacherStats.interviewInvitations}
              color="text-green-600"
              bg="bg-green-50"
            />
            <StatCard
              title="وظائف تقدمت لها"
              value={teacherStats.jobApplications}
              color="text-blue-600"
              bg="bg-blue-50"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, color, bg }) {
  return (
    <div className={`rounded-xl p-4 ${bg}`}>
      <div className={`text-3xl font-bold ${color}`}>{value}</div>
      <div className="text-sm text-gray-600 mt-1">{title}</div>
    </div>
  );
}
