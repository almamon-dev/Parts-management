export default function SpeakerSection() {
    return (
        <section className="py-24 bg-white text-center">
            <h2 className="text-4xl font-bold">Meet the Speakers</h2>

            <div className="grid md:grid-cols-3 gap-8 mt-12 max-w-6xl mx-auto">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="p-6 border rounded-xl">
                        <div className="w-24 h-24 mx-auto bg-gray-200 rounded-full mb-4" />
                        <h3 className="font-semibold">Senior Developer</h3>
                        <p className="text-sm text-gray-500">
                            5+ Years Experience
                        </p>
                    </div>
                ))}
            </div>
        </section>
    );
}
