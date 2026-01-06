export default function FAQSection() {
    const faqs = [
        "Is this seminar beginner friendly?",
        "Will I get a certificate?",
        "Is it online or offline?",
        "Will there be a recording?",
    ];

    return (
        <section className="py-24 bg-white">
            <h2 className="text-4xl font-bold text-center">FAQ</h2>

            <div className="max-w-3xl mx-auto mt-10 space-y-4">
                {faqs.map((q, i) => (
                    <div key={i} className="border p-4 rounded">
                        {q}
                    </div>
                ))}
            </div>
        </section>
    );
}
