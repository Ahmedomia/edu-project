import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useStore from "../src/store";
import Header from "../Components/Header";
import { formatLocation } from "../src/locationData";

const CompanyDetail = () => {
  const { email } = useParams();
  const navigate = useNavigate();
  const [showContactModal, setShowContactModal] = useState(false);

  const company = useStore((state) =>
    state.registeredUsers.find((u) => u.email === decodeURIComponent(email) && u.role === "company"),
  );

  if (!company) {
    return (
      <>
        <Header />
        <div className="p-20 text-center text-gray-500 pt-32">
          <p className="text-xl font-bold mb-4">المنشأة غير موجودة</p>
          <button 
            onClick={() => navigate("/CompanyDatabase")}
            className="text-sky-700 hover:underline"
          >
            العودة للدليل
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="bg-slate-100 min-h-screen pt-40 px-6 pb-12">
        {/* Decorative Header Background */}
        
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-6 relative z-10">
          
          {/* Side Panel */}
          <div className="md:w-1/3 space-y-6">
            <div className="bg-white rounded-3xl shadow-xl p-8 text-center border border-slate-200/50">
              <div className="w-40 h-40 mx-auto mb-6 bg-white rounded-3xl flex items-center justify-center overflow-hidden border-4 border-white shadow-lg -mt-16 md:-mt-20">
                {company.photo ? (
                  <img
                    src={company.photo}
                    alt={company.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="material-symbols-outlined text-sky-700 text-5xl">
                    apartment
                  </span>
                )}
              </div>

              <h2 className="font-bold text-xl text-slate-800 mb-1">{company.name}</h2>
              <p className="text-sm text-sky-700 flex items-center justify-center gap-1 font-medium mb-6">
                <span className="material-symbols-outlined text-sm">location_on</span>
                {formatLocation(company.country, company.city, company.neighborhood) || "غير محدد"}
              </p>

              <div className="space-y-3">
                <button 
                  onClick={() => setShowContactModal(true)}
                  className="w-full bg-sky-800 text-white px-4 py-3 rounded-xl hover:bg-sky-900 transition font-bold flex items-center justify-center gap-2 shadow-md"
                >
                  <span className="material-symbols-outlined">forum</span>
                  تواصل الآن
                </button>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-100 space-y-4 text-right">
                 <div className="flex flex-col gap-1">
                    <span className="text-xs text-slate-500">نوع التعليم</span>
                    <span className="font-semibold text-slate-800">{company.educationType || "غير محدد"}</span>
                 </div>
              </div>
            </div>

            {company.mapUrl && (
              <div className="bg-white rounded-2xl shadow p-6 text-right">
                <h3 className="font-bold text-slate-800 mb-4 flex items-center justify-end gap-2">
                  الموقع الجغرافي
                  <span className="material-symbols-outlined text-sky-700">map</span>
                </h3>
                <a 
                  href={company.mapUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="block w-full bg-sky-50 text-sky-700 py-3 rounded-xl text-center font-semibold hover:bg-sky-100 transition border border-sky-100"
                >
                  عرض على خرائط جوجل
                </a>
              </div>
            )}
          </div>

          {/* Main Content Area */}
          <div className="md:w-2/3 space-y-6">
            {/* About Section */}
            <div className="bg-white rounded-2xl shadow p-8 text-right">
              <h3 className="text-xl font-bold text-slate-800 border-r-4 border-sky-800 pr-4 mb-6">حول المنشأة</h3>
              <div className="text-slate-700 leading-relaxed whitespace-pre-wrap text-lg">
                {company.bio || "لا توجد نبذة تعريفية متاحة."}
              </div>
            </div>

            {/* Stages Section */}
            {company.stages && company.stages.length > 0 && (
              <div className="bg-white rounded-2xl shadow p-8 text-right">
                <h3 className="text-xl font-bold text-slate-800 border-r-4 border-sky-800 pr-4 mb-6">المراحل الدراسية</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {company.stages.map((stage) => (
                    <div key={stage} className="bg-slate-50 border border-slate-200 p-4 rounded-2xl text-center flex flex-col items-center gap-2">
                       <span className="material-symbols-outlined text-sky-700">check_circle</span>
                       <span className="font-bold text-slate-800">{stage}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Contact Information */}
            <div className="bg-white rounded-2xl shadow p-8 text-right">
              <h3 className="text-xl font-bold text-slate-800 border-r-4 border-sky-800 pr-4 mb-6">معلومات التواصل</h3>
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="bg-slate-100 p-5 rounded-2xl flex flex-col items-end gap-1 shadow-sm">
                   <span className="text-xs text-slate-500">البريد الإلكتروني</span>
                   <a href={`mailto:${company.email}`} className="text-sky-800 font-bold text-lg hover:underline dir-ltr">
                     {company.email}
                   </a>
                </div>
                {company.phone && (
                  <div className="bg-slate-100 p-5 rounded-2xl flex flex-col items-end gap-1 shadow-sm">
                    <span className="text-xs text-slate-500">رقم الجوال</span>
                    <a href={`tel:${company.phone}`} className="text-sky-800 font-bold text-lg hover:underline dir-ltr">
                      {company.phone}
                    </a>
                  </div>
                )}
                {company.landline && (
                  <div className="bg-slate-100 p-5 rounded-2xl flex flex-col items-end gap-1 shadow-sm">
                    <span className="text-xs text-slate-500">الهاتف الثابت</span>
                    <a href={`tel:${company.landline}`} className="text-sky-800 font-bold text-lg hover:underline dir-ltr">
                      {company.landline}
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Contact Modal (Identical to previous modals for consistency) */}
      {showContactModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 w-full max-w-sm text-center shadow-2xl animate-in fade-in zoom-in duration-300">
            <div className="w-20 h-20 bg-sky-50 text-sky-700 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
              <span className="material-symbols-outlined text-4xl">contact_mail</span>
            </div>
            <h3 className="text-2xl font-bold mb-2 text-slate-900">تواصل معنا</h3>
            <p className="text-slate-500 text-sm mb-8">يسعدنا تواصلكم عبر القنوات المتاحة</p>
            
            <div className="flex flex-col gap-4">
              <a 
                href={`mailto:${company.email}`}
                className="bg-slate-50 hover:bg-sky-50 text-slate-800 hover:text-sky-800 py-4 rounded-2xl flex items-center justify-center gap-3 transition-all border border-slate-100 hover:border-sky-200 group"
              >
                <span className="material-symbols-outlined text-sky-700 group-hover:scale-110 transition-transform">mail</span>
                <span className="font-bold">البريد الإلكتروني</span>
              </a>
              
              {company.phone && (
                <a 
                   href={`tel:${company.phone}`}
                   className="bg-slate-50 hover:bg-sky-50 text-slate-800 hover:text-sky-800 py-4 rounded-2xl flex items-center justify-center gap-3 transition-all border border-slate-100 hover:border-sky-200 group"
                >
                  <span className="material-symbols-outlined text-sky-700 group-hover:scale-110 transition-transform">call</span>
                  <span className="font-bold">رقم الجوال</span>
                </a>
              )}

              {company.landline && (
                <a 
                   href={`tel:${company.landline}`}
                   className="bg-slate-50 hover:bg-sky-50 text-slate-800 hover:text-sky-800 py-4 rounded-2xl flex items-center justify-center gap-3 transition-all border border-slate-100 hover:border-sky-200 group"
                >
                  <span className="material-symbols-outlined text-sky-700 group-hover:scale-110 transition-transform">deskphone</span>
                  <span className="font-bold">الهاتف الثابت</span>
                </a>
              )}
            </div>
            
            <button 
              onClick={() => setShowContactModal(false)}
              className="mt-8 text-slate-400 hover:text-slate-700 text-sm font-bold transition hover:underline"
            >
              إلغاء
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default CompanyDetail;
