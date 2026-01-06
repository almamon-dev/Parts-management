import React from "react";

export default function AboutSection() {
    return (
        <section className="py-24 bg-white">
            <div className="container mx-auto px-6 max-w-5xl text-center">
                <h2 className="text-4xl font-bold text-gray-800">
                    About the Seminar
                </h2>

                <p className="mt-6 text-gray-600 leading-relaxed text-lg">
                    This Web Development seminar is designed for students,
                    beginners and junior developers who want to build a strong
                    career in modern web technologies. We will cover frontend,
                    backend, API architecture, authentication systems and
                    real-world project workflow.
                </p>
            </div>
        </section>
    );
}
