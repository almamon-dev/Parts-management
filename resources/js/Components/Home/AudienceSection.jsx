import React from "react";

export default function AudienceSection() {
    const audience = [
        "CSE & Non-CSE Students",
        "Beginner Web Developers",
        "Laravel / React Learners",
        "Job Seekers & Freelancers",
        "Career Switchers",
    ];

    return (
        <section className="py-24 bg-white">
            <div className="container mx-auto px-6 max-w-4xl">
                <h2 className="text-4xl font-bold text-center text-gray-800">
                    Who Should Attend
                </h2>

                <ul className="mt-10 space-y-4 text-lg text-gray-700">
                    {audience.map((item, i) => (
                        <li key={i} className="flex items-center gap-3">
                            <span className="w-3 h-3 bg-indigo-600 rounded-full" />
                            {item}
                        </li>
                    ))}
                </ul>
            </div>
        </section>
    );
}
