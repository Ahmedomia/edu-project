import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../Components/Header";
import useStore from "../src/store";
import { formatLocation } from "../src/locationData";

const CompanyDatabase = () => {
  const registeredUsers = useStore((state) => state.registeredUsers);
  const [city, setCity] = useState("الكل");
  const [search, setSearch] = useState("");
  const [educationType, setEducationType] = useState("الكل");
  // Removed educationCategory state
  const [selectedStage, setSelectedStage] = useState("الكل");
  const navigate = useNavigate();

  const companies = useMemo(() => {
    return registeredUsers
      .filter((user) => user.role === "company")
      .map((user) => ({
        id: user.email,
        name: user.name || "منشأة تعليمية",
        city: user.city || "غير محدد",
        country: user.country || "",
        neighborhood: user.neighborhood || "",
        email: user.email,
        bio: user.bio || "",
        phone: user.phone || "",
        landline: user.landline || "",
        photo: user.photo || "",
        mapUrl: user.mapUrl || "",
        educationType: user.educationType || "",
        // Removed educationCategory
        stages: user.stages || [],
      }));
  }, [registeredUsers]);

  const filterOptions = useMemo(() => {
    const types = new Set(["تعليم اهلي", "تعليم عالمي", "تعليم جامعي", ...companies.map((c) => c.educationType).filter(t => t && t !== "تعليم عام")]);
    // Removed categories
    const citySet = new Set(companies.map((c) => c.city).filter(Boolean));
    
    return {
      cities: ["الكل", ...Array.from(citySet).sort((a, b) => a.localeCompare(b, "ar"))],
      types: ["الكل", ...Array.from(types)],
      stages: ["الكل", "طفوله مبكره", "ابتدائي", "متوسط", "ثانوي", "جامعي"]
    };
  }, [companies]);

  const filteredCompanies = useMemo(() => {
    return companies.filter((c) => {
      const matchesCity = city === "الكل" || c.city === city;
      const matchesType = educationType === "الكل" || c.educationType === educationType;
      // Removed matchesCategory
      const matchesStage = selectedStage === "الكل" || (c.stages && c.stages.includes(selectedStage));
      
      const searchLower = search.toLowerCase();
      const matchesSearch =
        !search ||
        (c.name && c.name.toLowerCase().includes(searchLower)) ||
        (c.bio && c.bio.toLowerCase().includes(searchLower));

      return matchesCity && matchesType && matchesStage && matchesSearch;
    });
  }, [companies, city, search, educationType, selectedStage]);

  return (
    <>
      <Header />
      <div className="min-h-screen bg-slate-50 pt-28 px-6 pb-12">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold text-right mb-6">
            دليل المنشآت التعليمية
          </h2>
          
          <div className="bg-white p-4 rounded-xl shadow-md flex flex-col gap-4 mb-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] text-slate-500 pr-2">المدينة</label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="rounded-lg bg-gray-200 px-4 py-2 text-right text-sm"
                >
                  {filterOptions.cities.map((c) => (
                    <option key={c} value={c}>
                      {c === "الكل" ? "جميع المدن" : c}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] text-slate-500 pr-2">نوع التعليم</label>
                <select
                  value={educationType}
                  onChange={(e) => {
                    const val = e.target.value;
                    setEducationType(val);
                    if (val === "تعليم جامعي") {
                      setSelectedStage("جامعي");
                    }
                  }}
                  className="rounded-lg bg-gray-200 px-4 py-2 text-right text-sm"
                >
                  {filterOptions.types.map((t) => (
                    <option key={t} value={t}>
                      {t === "الكل" ? "جميع الأنواع" : t}
                    </option>
                  ))}
                </select>
              </div>

              {/* Removed Education Category filter */}

              <div className="flex flex-col gap-1">
                <label className="text-[10px] text-slate-500 pr-2">المسار التدريسي</label>
                <select
                  value={selectedStage}
                  onChange={(e) => setSelectedStage(e.target.value)}
                  className="rounded-lg bg-gray-200 px-4 py-2 text-right text-sm"
                >
                  {filterOptions.stages.map((stage) => (
                    <option key={stage} value={stage}>
                      {stage === "الكل" ? "جميع المراحل" : stage}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="relative">
              <span className="material-symbols-outlined absolute right-3 top-2.5 text-slate-400">
                search
              </span>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="بحث باسم المنشأة أو النبذة..."
                className="w-full rounded-lg bg-gray-200 px-10 py-2 text-right"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCompanies.length === 0 ? (
              <div className="col-span-full bg-white rounded-xl shadow-md p-8 text-center">
                <p className="text-gray-500 text-lg">لا توجد منشآت مطابقة للبحث</p>
                <p className="text-gray-400 text-sm mt-2">
                  جرب تغيير معايير البحث
                </p>
              </div>
            ) : (
              filteredCompanies.map((c) => (
                <div
                  key={c.id}
                  onClick={() => navigate(`/company/${encodeURIComponent(c.email)}`)}
                  className="bg-white rounded-xl shadow-md p-6 text-center cursor-pointer hover:shadow-lg transition flex flex-col group"
                >
                  <div className="mx-auto h-24 w-24 rounded-2xl bg-sky-50 flex items-center justify-center mb-4 overflow-hidden border border-slate-100 group-hover:border-sky-200 transition-colors shadow-sm">
                    {c.photo ? (
                      <img
                        src={c.photo}
                        alt={c.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="material-symbols-outlined text-4xl text-sky-700">
                        apartment
                      </span>
                    )}
                  </div>

                  <h3 className="font-bold text-slate-800 text-lg mb-1">{c.name}</h3>
                  <p className="text-sm text-sky-700 flex items-center justify-center gap-1 mb-4 font-medium">
                    <span className="material-symbols-outlined text-sm">location_on</span>
                    {formatLocation(c.country, c.city, c.neighborhood) || "غير محدد"}
                  </p>

                  <div className="flex flex-wrap justify-center gap-1 mb-4">
                     {c.educationType && (
                        <span className="text-[10px] bg-sky-100 text-sky-800 px-2 py-0.5 rounded-full font-semibold">
                          {c.educationType}
                        </span>
                     )}
                  </div>

                  {c.bio && (
                    <p className="text-xs text-slate-500 text-right line-clamp-2 mb-4 flex-grow italic">
                      {c.bio}
                    </p>
                  )}

                  <div className="mt-auto">
                    <button
                      className="w-full rounded-xl bg-sky-800 text-white py-3 group-hover:bg-sky-900 transition-all text-sm font-bold flex items-center justify-center gap-2 shadow-sm cursor-pointer"
                    >
                      عرض الملف الكامل
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default CompanyDatabase;
