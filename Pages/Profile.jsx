import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../Components/Header";
import useStore from "../src/store";
import Notification from "../Components/Notification";

const Profile = () => {
  const navigate = useNavigate();
  const user = useStore((state) => state.user);
  const profile = useStore((state) => state.profile);
  const experiences = useStore((state) => state.experiences);
  const setProfile = useStore((state) => state.setProfile);
  const addExperience = useStore((state) => state.addExperience);
  const deleteExperience = useStore((state) => state.deleteExperience);

  const [localProfile, setLocalProfile] = useState(() => {
    if (profile) return profile;
    return {
      name: user?.name || "",
      role: user?.role || "",
      jobTitle: user?.jobTitle || "",
      bio: user?.bio || "",
      email: user?.email || "",
      phone: user?.phone || "",
      city: user?.city || "",
      photo: user?.photo || profile?.photo || "",
    };
  });

  const [showModal, setShowModal] = useState(false);
  const [newExp, setNewExp] = useState({
    title: "",
    place: "",
    from: "",
    to: "",
  });

  const [showNotif, setShowNotif] = useState(false);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    if (!user) {
      navigate("/login", { replace: true });
    }
  }, [user, navigate]);

  useEffect(() => {
    if (profile) {
      setLocalProfile(profile);
    } else if (user) {
      setLocalProfile({
        name: user.name || "",
        role: user.role || "",
        jobTitle: user.jobTitle || "",
        bio: user.bio || "",
        email: user.email || "",
        phone: user.phone || "",
        city: user.city || "",
        photo: user.photo || profile?.photo || "",
      });
    }
  }, [user, profile]);

  const handleChange = (e) => {
    setLocalProfile({ ...localProfile, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    setProfile(localProfile);
    setShowNotif(true);
    setTimeout(() => setShowNotif(false), 3000);
  };

  const handleAddExperience = () => {
    if (!newExp.title || !newExp.place) return;

    addExperience(newExp);
    setNewExp({ title: "", place: "", from: "", to: "" });
    setShowModal(false);
  };

  const handleDeleteExperience = (id) => {
    deleteExperience(id);
  };

  const handlePhotoClick = () => {
    if (localProfile.role === "teacher") {
      document.getElementById("photo-input").click();
    }
  };

  const handlePhotoChange = (e) => {
    if (localProfile.role !== "teacher") return;

    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        setNotification({
          message: "يرجى اختيار صورة فقط",
          type: "error",
        });
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setLocalProfile({ ...localProfile, photo: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <>
      <Header />
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}

      <div className="bg-slate-100 min-h-screen pt-28 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl shadow p-6 text-center">
            <input
              type="file"
              id="photo-input"
              accept="image/*"
              onChange={handlePhotoChange}
              className="hidden"
            />
            <div
              onClick={handlePhotoClick}
              className={`relative w-28 h-28 mx-auto mb-4 ${
                localProfile.role === "teacher" ? "cursor-pointer group" : ""
              }`}
            >
              {localProfile.photo ? (
                <>
                  <img
                    src={localProfile.photo}
                    alt="profile"
                    className="w-28 h-28 rounded-full object-cover group-hover:opacity-80 transition-opacity"
                  />
                  {localProfile.role === "teacher" && (
                    <div className="absolute inset-0 bg-black/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="material-symbols-outlined text-white text-lg">
                        edit
                      </span>
                    </div>
                  )}
                </>
              ) : (
                <div
                  className={`w-28 h-28 rounded-full ${
                    localProfile.role === "teacher"
                      ? "bg-slate-300 group-hover:bg-slate-400 border-2 border-dashed border-slate-400 group-hover:border-sky-500 transition-colors flex items-center justify-center"
                      : "bg-slate-300"
                  }`}
                >
                  {localProfile.role === "teacher" && (
                    <span className="material-symbols-outlined text-slate-500 group-hover:text-sky-500">
                      add_photo_alternate
                    </span>
                  )}
                </div>
              )}
              {localProfile.role === "teacher" && (
                <div className="absolute bottom-1 right-1 bg-sky-800 text-white rounded-full w-8 h-8 flex items-center justify-center group-hover:bg-sky-900 transition-colors">
                  <span className="material-symbols-outlined text-sm">add</span>
                </div>
              )}
            </div>

            <h2 className="font-bold text-lg text-slate-800">
              {localProfile.name}
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              {localProfile.jobTitle ||
                (localProfile.role === "teacher" ? "معلم" : "منشأة")}
            </p>

            <div className="mt-6 space-y-4 text-right">
              <label className="text-sm text-slate-600">الاسم الكامل</label>
              <input
                name="name"
                value={localProfile.name}
                onChange={handleChange}
                disabled={localProfile.role === "company"}
                className={`w-full rounded-lg p-3 ${
                  localProfile.role === "company"
                    ? "bg-slate-200 text-slate-500 cursor-not-allowed"
                    : "bg-slate-800 text-white"
                }`}
              />

              <label className="text-sm text-slate-600">
                {localProfile.role === "teacher"
                  ? "المسمى الوظيفي"
                  : "نوع الحساب"}
              </label>
              {localProfile.role === "teacher" ? (
                <input
                  name="jobTitle"
                  value={localProfile.jobTitle || ""}
                  onChange={handleChange}
                  placeholder="مثال: معلم لغة عربية"
                  className="w-full rounded-lg bg-slate-800 text-white p-3"
                />
              ) : (
                <input
                  value="منشأة"
                  disabled
                  className="w-full rounded-lg bg-slate-200 p-3 cursor-not-allowed"
                />
              )}

              <label className="text-sm text-slate-600">
                البريد الإلكتروني
              </label>
              <input
                name="email"
                value={localProfile.email}
                onChange={handleChange}
                disabled={localProfile.role === "company"}
                className={`w-full rounded-lg p-3 ${
                  localProfile.role === "company"
                    ? "bg-slate-200 text-slate-500 cursor-not-allowed"
                    : "bg-slate-800 text-white"
                }`}
              />

              <label className="text-sm text-slate-600">رقم الهاتف</label>
              <input
                name="phone"
                value={localProfile.phone}
                onChange={handleChange}
                disabled={localProfile.role === "company"}
                className={`w-full rounded-lg p-3 ${
                  localProfile.role === "company"
                    ? "bg-slate-200 text-slate-500 cursor-not-allowed"
                    : "bg-slate-800 text-white"
                }`}
              />

              <label className="text-sm text-slate-600">المدينة</label>
              <input
                name="city"
                value={localProfile.city}
                onChange={handleChange}
                disabled={localProfile.role === "company"}
                className={`w-full rounded-lg p-3 ${
                  localProfile.role === "company"
                    ? "bg-slate-200 text-slate-500 cursor-not-allowed"
                    : "bg-slate-800 text-white"
                }`}
              />
            </div>
          </div>
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl shadow p-6">
              <h3 className="font-semibold mb-3 text-right">نبذة مهنية</h3>
              <textarea
                name="bio"
                value={localProfile.bio}
                onChange={handleChange}
                disabled={localProfile.role === "company"}
                rows={5}
                className={`w-full rounded-lg p-4 ${
                  localProfile.role === "company"
                    ? "bg-slate-200 text-slate-500 cursor-not-allowed"
                    : "bg-slate-800 text-white"
                }`}
              />
            </div>

            {localProfile.role === "teacher" && (
              <div className="bg-white rounded-2xl shadow p-6">
                <h3 className="font-semibold mb-4 text-right">
                  الخبرات العملية
                </h3>

                <div className="space-y-4">
                  {experiences.map((exp) => (
                    <div key={exp.id} className="flex justify-between pb-4">
                      <button
                        onClick={() => handleDeleteExperience(exp.id)}
                        className="text-slate-400 cursor-pointer hover:text-red-500"
                      >
                        <span className="material-symbols-outlined">
                          delete
                        </span>
                      </button>

                      <div className="text-right">
                        <p className="font-semibold">• {exp.title}</p>
                        <p className="text-sky-700 text-sm">{exp.place}</p>
                        <span className="text-xs bg-slate-200 px-3 py-1 rounded-full">
                          {exp.from} - {exp.to}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => setShowModal(true)}
                  className="mt-4 w-full border border-black/20 rounded-xl py-2 flex justify-center cursor-pointer hover:bg-gray-100 gap-2"
                >
                  <span className="material-symbols-outlined">add</span>
                  إضافة خبرة
                </button>
              </div>
            )}

            {localProfile.role === "teacher" && (
              <button
                onClick={handleSave}
                className="bg-sky-800 text-white px-8 py-3 rounded-xl"
              >
                حفظ التغييرات
              </button>
            )}
          </div>
        </div>

        {showNotif && (
          <div className="fixed top-22 right-6 bg-green-600 text-white px-5 py-4 rounded-xl">
            تم حفظ التغييرات بنجاح
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h3 className="font-semibold mb-4 text-right">إضافة خبرة جديدة</h3>

            <div className="space-y-3">
              <input
                placeholder="المسمى الوظيفي"
                value={newExp.title}
                onChange={(e) =>
                  setNewExp({ ...newExp, title: e.target.value })
                }
                className="w-full p-3 rounded-lg bg-slate-100"
              />
              <input
                placeholder="المكان"
                value={newExp.place}
                onChange={(e) =>
                  setNewExp({ ...newExp, place: e.target.value })
                }
                className="w-full p-3 rounded-lg bg-slate-100"
              />
              <div className="flex gap-2">
                <input
                  placeholder="من"
                  value={newExp.from}
                  onChange={(e) =>
                    setNewExp({ ...newExp, from: e.target.value })
                  }
                  className="w-full p-3 rounded-lg bg-slate-100"
                />
                <input
                  placeholder="إلى"
                  value={newExp.to}
                  onChange={(e) => setNewExp({ ...newExp, to: e.target.value })}
                  className="w-full p-3 rounded-lg bg-slate-100"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={handleAddExperience}
                className="flex-1 bg-sky-800 text-white py-2 rounded-xl"
              >
                حفظ
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 border py-2 rounded-xl"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Profile;
