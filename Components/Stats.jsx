const stats = [
  {
    value: "98%",
    label: "نسبة التوظيف الناجح",
  },
  {
    value: "500+",
    label: "وظيفة شاغرة يوميًا",
  },
  {
    value: "1,200+",
    label: "مدرسة مسجلة",
  },
  {
    value: "15k+",
    label: "سيرة ذاتية لمعلم",
  },
];

const Stats = () => {
  return (
    <section className="bg-sky-900">
      <div className="mx-auto max-w-7xl px-6 py-14">
        <div className="grid grid-cols-2 md:grid-cols-4 text-center text-white">
          {stats.map((stat, index) => (
            <div
              key={index}
              className={`px-6 ${
                index !== 0 ? "md:border-l md:border-white/20" : ""
              }`}
            >
              <div className="text-3xl md:text-4xl font-bold mb-2 cursor-default">
                {stat.value}
              </div>
              <div className="text-sm text-white/80 cursor-default">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;
