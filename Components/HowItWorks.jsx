const steps = [
  {
    id: 1,
    title: "أنشئ حسابك",
    description:
      "سجل كمعلم لبناء سيرتك الذاتية، أو كمدرسة للبدء في نشر الوظائف والبحث عن كفاءات.",
    icon: <span class="material-symbols-outlined">person_add</span>,
  },
  {
    id: 2,
    title: "أكمل بياناتك",
    description:
      "أضف خبراتك وشهاداتك كمعلم، أو حدد تفاصيل الوظيفة ومتطلباتها كمدرسة بدقة.",
    icon: <span class="material-symbols-outlined">assignment</span>,
  },
  {
    id: 3,
    title: "توظيف فوري",
    description:
      "تواصل مباشرة بين المدرسة والمعلم، حدد موعد المقابلة وابدأ مسيرتك المهنية.",
    icon: <span class="material-symbols-outlined">checked_bag</span>,
  },
];

const HowItWorks = () => {
  return (
    <section className="bg-slate-50 py-24">
      <div className="mx-auto max-w-7xl px-6 text-center">
        <h2 className="text-3xl font-bold text-slate-900 mb-4 cursor-default">
          كيف تعمل المنصة؟
        </h2>

        <p className="text-slate-500 mb-16 max-w-2xl mx-auto cursor-default">
          خطوات بسيطة تفصلك عن هدفك، صممناها لتكون رحلة التوظيف سلسة وسريعة.
        </p>

        <div className="grid gap-8 md:grid-cols-3">
          {steps.map((step) => (
            <div
              key={step.id}
              className="relative rounded-2xl bg-white p-8 shadow-xl transition-transform duration-300 ease-in-out hover:-translate-y-3 hover:shadow-2xl"
            >
              <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-sky-100 text-2xl">
                {step.icon}
              </div>

              <h3 className="text-lg font-bold text-slate-900 mb-3">
                {step.id}. {step.title}
              </h3>

              <p className="text-slate-500 text-sm leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
