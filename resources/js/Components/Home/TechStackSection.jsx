import React from "react";

const techs = [
    "HTML5",
    "CSS3",
    "Tailwind CSS",
    "JavaScript (ES6+)",
    "React.js",
    "PHP",
    "Laravel",
    "REST API",
    "JWT Auth",
    "MySQL",
    "Git & GitHub",
];

export default function TechStackSection() {
    return (
        <section className="py-24 bg-gray-100">
            <div className="container mx-auto px-6">
                <h2 className="text-4xl font-bold text-center text-gray-800">
                    Technologies You Will Learn
                </h2>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
                    {techs.map((tech, index) => (
                        <div
                            key={index}
                            className="bg-white rounded-xl p-6 shadow hover:shadow-lg transition text-center font-semibold"
                        >
                            {tech}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
