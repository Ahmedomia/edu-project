import { useState, useMemo } from "react";
import Header from "../Components/Header";
import useStore from "../src/store";
import { JOB_TITLES } from "../src/constants";
import { useNavigate } from "react-router-dom";

const TeachersDatabase = () => {
  const registeredUsers = useStore((state) => state.registeredUsers);
  const calculateTotalExperience = useStore((state) => state.calculateTotalExperience);
  const [city, setCity] = useState("الكل");
  const [specialty, setSpecialty] = useState("الكل");
  const [experienceFilter, setExperienceFilter] = useState("الكل");
  const [genderFilter, setGenderFilter] = useState("الكل");
  const [languageFilter, setLanguageFilter] = useState("الكل");
  const [educationFilter, setEducationFilter] = useState("الكل");
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const teachers = useMemo(() => {
    return registeredUsers
      .filter((user) => user.role === "teacher")
      .map((user) => ({
        id: user.email,
        name: user.name || "معلم",
        title: user.jobTitle || "معلم",
        city: user.city || "غير محدد",
        email: user.email,
        bio: user.bio || "",
        phone: user.phone || "",
        gender: user.gender || "",
        photo: user.photo || "",
        languageSkills: user.languageSkills || [],
        education: user.education || "",
        totalExperienceYears: user.totalExperienceYears || calculateTotalExperience(user.experiences) || 0,
      }));
  }, [registeredUsers, calculateTotalExperience]);

  const cities = useMemo(() => {
    const citySet = new Set(teachers.map((t) => t.city).filter(Boolean));
    return ["الكل", ...Array.from(citySet)];
  }, [teachers]);

  const filteredTeachers = useMemo(() => {
    return teachers.filter((t) => {
      const matchesCity = city === "الكل" || t.city === city;
      const searchLower = search.toLowerCase();
      const matchesSearch =
        !search ||
        (t.name && t.name.toLowerCase().includes(searchLower)) ||
        (t.title && t.title.toLowerCase().includes(searchLower)) ||
        (t.bio && t.bio.toLowerCase().includes(searchLower));
      const matchesSpecialty =
        specialty === "الكل" ||
        (t.title && t.title.toLowerCase().includes(specialty.toLowerCase())) ||
        (t.bio && t.bio.toLowerCase().includes(specialty.toLowerCase()));
      const matchesExperience = 
        experienceFilter === "الكل" || 
        t.totalExperienceYears >= parseInt(experienceFilter);
      const matchesGender = 
        genderFilter === "الكل" || 
        t.gender === genderFilter;
      const matchesLanguage = 
        languageFilter === "الكل" || 
        (t.languageSkills && t.languageSkills.some(skill => skill.language === languageFilter));
      
      const matchesEducation = 
        educationFilter === "الكل" || 
        t.education === educationFilter;

      return matchesCity && matchesSearch && matchesSpecialty && matchesExperience && matchesGender && matchesLanguage && matchesEducation;
    });
  }, [teachers, city, search, specialty, experienceFilter, genderFilter, languageFilter, educationFilter]);

  return (
    <>
      <Header />
      <div className="min-h-screen bg-slate-50 pt-28 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold text-right mb-6">
            قاعدة بيانات المعلمين
          </h2>
          <div className="bg-white p-4 rounded-xl shadow-md flex flex-col md:flex-row gap-4 mb-8">
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="rounded-lg bg-gray-200 px-4 py-2"
            >
              {cities.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>

            <select
              value={specialty}
              onChange={(e) => setSpecialty(e.target.value)}
              className="rounded-lg bg-gray-200 px-4 py-2"
            >
              <option>الكل</option>
              {JOB_TITLES.map((title) => (
                <option key={title} value={title}>
                  {title}
                </option>
              ))}
            </select>

            <select
              value={experienceFilter}
              onChange={(e) => setExperienceFilter(e.target.value)}
              className="rounded-lg bg-gray-200 px-4 py-2"
            >
              <option value="الكل">كل سنوات الخبرة</option>
              <option value="1">أكثر من سنة</option>
              <option value="3">أكثر من 3 سنوات</option>
              <option value="5">أكثر من 5 سنوات</option>
              <option value="10">أكثر من 10 سنوات</option>
            </select>

            <select
              value={genderFilter}
              onChange={(e) => setGenderFilter(e.target.value)}
              className="rounded-lg bg-gray-200 px-4 py-2"
            >
              <option value="الكل">الجنس</option>
              <option value="ذكر">ذكر</option>
              <option value="أنثى">أنثى</option>
            </select>

            <select
              value={languageFilter}
              onChange={(e) => setLanguageFilter(e.target.value)}
              className="rounded-lg bg-gray-200 px-4 py-2"
            >
              <option value="الكل">كل اللغات</option>
              <option value="arabic">عربي</option>
              <option value="english">إنجليزي</option>
              <option value="french">فرنسي</option>
              <option value="german">ألماني</option>
              <option value="spanish">إسباني</option>
              <option value="italian">إيطالي</option>
              <option value="turkish">تركي</option>
              <option value="chinese">صيني</option>
              <option value="japanese">ياباني</option>
              <option value="korean">كوري</option>
            </select>

            <select
              value={educationFilter}
              onChange={(e) => setEducationFilter(e.target.value)}
              className="rounded-lg bg-gray-200 px-4 py-2"
            >
              <option value="الكل">كل المؤهلات</option>
              <option value="bachelor">بكالوريوس</option>
              <option value="master">ماجستير</option>
              <option value="phd">دكتوراه</option>
            </select>

            <div className="relative flex-1">
              <span className="material-symbols-outlined absolute right-3 top-2.5 text-slate-400">
                search
              </span>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="بحث بالاسم أو المهارة..."
                className="w-full rounded-lg bg-gray-200 px-10 py-2"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTeachers.length === 0 ? (
              <div className="col-span-full bg-white rounded-xl shadow-xl p-8 text-center">
                <p className="text-gray-500 text-lg">لا يوجد معلمين مسجلين</p>
                <p className="text-gray-400 text-sm mt-2">
                  جرب تغيير معايير البحث
                </p>
              </div>
            ) : (
              filteredTeachers.map((t) => (
                <div
                  key={t.id}
                  className="bg-white rounded-xl shadow-xl p-6 text-center"
                >
                  <div className="mx-auto h-24 w-24 rounded-full bg-sky-100 flex items-center justify-center mb-4 overflow-hidden">
                    {t.photo ? (
                      <img
                        src={t.photo}
                        alt={t.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-3xl text-sky-700 font-bold">
                        {t.name.charAt(0)}
                      </span>
                    )}
                  </div>

                  <h3 className="font-bold text-slate-800">{t.name}</h3>
                  <p className="text-sm text-sky-700">{t.title}</p>

                  <div className="flex justify-between text-xs text-slate-600 mt-4 border-t pt-3">
                    <span>{t.city}</span>
                    <span>{t.email}</span>
                  </div>

                  {t.bio && (
                    <div className="mt-4">
                      <p className="text-xs text-slate-500 text-right line-clamp-2">
                        {t.bio}
                      </p>
                    </div>
                  )}

                  <div className="flex items-center gap-2 mt-4 text-sm text-gray-500">
                  <span className="material-symbols-outlined text-lg">work_history</span>
                  <span>{t.totalExperienceYears > 0 ? `${t.totalExperienceYears} سنوات خبرة` : "لا توجد خبرة مسجلة"}</span>
                </div>
                
                <button
                  onClick={() => navigate(`/teacher/${encodeURIComponent(t.email)}`)}
                    className="mt-5 w-full rounded-lg border border-sky-800 text-sky-800 py-2 hover:bg-sky-800 hover:text-white transition"
                  >
                    عرض الملف
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default TeachersDatabase;
