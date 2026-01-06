export default function BenefitsSection() {
    const benefits = [
        "Clear Career Roadmap",
        "Industry Best Practices",
        "Certificate",
        "Networking Opportunity",
        "Job & Internship Guidance",
    ];

    return (
        <section className="py-24 bg-gray-100 text-center">
            <h2 className="text-4xl font-bold">Why Join?</h2>

            <div className="grid md:grid-cols-3 gap-6 mt-10 max-w-5xl mx-auto">
                {benefits.map((b, i) => (
                    <div key={i} className="bg-white p-6 rounded shadow">
                        {b}
                    </div>
                ))}
            </div>
        </section>
    );
}
