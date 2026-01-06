export default function AgendaSection() {
    const agenda = [
        ["10:00 AM", "Web Development Overview"],
        ["11:00 AM", "Frontend Roadmap (React)"],
        ["12:30 PM", "Break"],
        ["02:00 PM", "Backend Roadmap (Laravel)"],
        ["03:30 PM", "Career & Q&A"],
    ];

    return (
        <section className="py-24 bg-gray-100">
            <h2 className="text-4xl font-bold text-center">Seminar Agenda</h2>

            <div className="max-w-4xl mx-auto mt-10 space-y-4">
                {agenda.map(([time, title], i) => (
                    <div
                        key={i}
                        className="flex justify-between bg-white p-4 rounded shadow"
                    >
                        <span className="font-semibold">{time}</span>
                        <span>{title}</span>
                    </div>
                ))}
            </div>
        </section>
    );
}
