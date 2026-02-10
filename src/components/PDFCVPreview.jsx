import { X } from "lucide-react";

export default function PDFCVPreview({ data, onClose }) {
  return (
    <div className="fixed inset-0 z-50 bg-black/50 overflow-y-auto">
      <div className="min-h-screen flex justify-center py-10">

        {/* ===== A4 PAGE ===== */}
        <div className="relative bg-white w-[794px] min-h-[1123px] p-12 shadow-2xl font-sans text-gray-800">

          {/* Close */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-black"
          >
            <X />
          </button>

          {/* ===== HEADER ===== */}
          <header className="mb-6">
            <h1 className="text-4xl font-bold text-gray-900">
              {data.name}
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              {data.email} | {data.phone}
            </p>
            <div className="mt-3 h-[2px] bg-gray-200" />
          </header>

          {/* ===== 1. CAREER VISION ===== */}
          <section className="mb-5">
            <h2 className="text-lg font-semibold mb-1">Career Vision</h2>
            <p className="text-sm leading-relaxed">
              To build a successful professional career where I can apply my
              technical skills, creativity, and problem-solving abilities while
              continuously learning and contributing to organizational growth.
            </p>
          </section>

          {/* ===== 2. EDUCATION ===== */}
          <section className="mb-5">
            <h2 className="text-lg font-semibold mb-1">Education</h2>
            <p className="text-sm">
              Bachelor’s Degree in Computer Science <br />
              <span className="text-gray-500">
                (or relevant academic qualification)
              </span>
            </p>
          </section>

          {/* ===== 3. COMPUTER SKILLS ===== */}
          <section className="mb-5">
            <h2 className="text-lg font-semibold mb-2">Computer Skills</h2>
            <div className="grid grid-cols-3 gap-2 text-sm">
              {data.skills?.map((skill) => (
                <div
                  key={skill}
                  className="border border-gray-300 px-3 py-1 rounded text-center"
                >
                  {skill}
                </div>
              ))}
            </div>
          </section>

          {/* ===== 4. WHAT MAKES ME DIFFERENT ===== */}
          <section className="mb-5">
            <h2 className="text-lg font-semibold mb-1">
              What Makes Me Different
            </h2>
            <p className="text-sm leading-relaxed">
              Strong dedication to quality work, fast learning capability,
              positive attitude, adaptability, and a strong sense of
              responsibility toward assigned tasks.
            </p>
          </section>

          {/* ===== 5. INTERESTS & HOBBIES ===== */}
          <section className="mb-5">
            <h2 className="text-lg font-semibold mb-1">
              Interests & Hobbies
            </h2>
            <p className="text-sm">
              Learning new technologies, problem solving, reading tech blogs,
              teamwork, and creative thinking.
            </p>
          </section>

          {/* ===== 6. LANGUAGE PROFICIENCY ===== */}
          <section className="mb-5">
            <h2 className="text-lg font-semibold mb-1">
              Language Proficiency
            </h2>
            <ul className="text-sm list-disc list-inside">
              <li>Bangla – Native</li>
              <li>English – Professional Working Proficiency</li>
            </ul>
          </section>

          {/* ===== 7. PARTICIPATION CERTIFICATES ===== */}
          <section className="mb-5">
            <h2 className="text-lg font-semibold mb-1">
              Participation Certificates
            </h2>
            <p className="text-sm">
              Participated in technical workshops, training programs, and skill
              development courses.
            </p>
          </section>

          {/* ===== 8. VOLUNTARY WORKS ===== */}
          <section className="mb-5">
            <h2 className="text-lg font-semibold mb-1">
              Voluntary Works
            </h2>
            <p className="text-sm">
              Actively involved in voluntary and community-based activities,
              supporting teamwork, leadership, and social responsibility.
            </p>
          </section>

          {/* ===== 9. REFERENCES ===== */}
          <section className="mb-5">
            <h2 className="text-lg font-semibold mb-1">References</h2>
            <p className="text-sm">Available upon request.</p>
          </section>

          {/* ===== 10. DECLARATION ===== */}
          <section className="mb-8">
            <h2 className="text-lg font-semibold mb-1">Declaration</h2>
            <p className="text-sm leading-relaxed">
              I hereby declare that the information provided above is true and
              correct to the best of my knowledge and belief.
            </p>
          </section>

          {/* ===== FOOTER ===== */}
          <footer className="absolute bottom-6 left-0 right-0 text-center text-xs text-gray-400">
            One-Page Professional Curriculum Vitae
          </footer>
        </div>
      </div>
    </div>
  );
}
