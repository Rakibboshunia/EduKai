import React from "react";

export default function DummyCVViewer({ open, onClose, candidate }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white w-[850px] max-w-full rounded-xl shadow-2xl max-h-[90vh] overflow-y-auto">

        {/* ================= HEADER BAR ================= */}
        <div className="flex justify-between items-center px-8 py-4 border-b">
          <h2 className="text-lg font-semibold text-[#2D468A]">
            Candidate CV Preview
          </h2>

          <button
            onClick={onClose}
            className="text-sm text-gray-500 hover:text-red-500 transition"
          >
            Close
          </button>
        </div>

        {/* ================= CV CONTENT ================= */}
        <div className="px-10 py-8 text-gray-900">

          {/* ===== Top Section ===== */}
          <div className="border-b pb-5 mb-6">
            <h1 className="text-3xl font-bold tracking-wide">
              {candidate?.name || "John Doe"}
            </h1>

            <p className="text-sm text-gray-600 mt-1">
              Senior Software Developer
            </p>

            <div className="flex flex-wrap gap-6 text-sm text-gray-600 mt-3">
              <span>{candidate?.email || "john@email.com"}</span>
              <span>{candidate?.phone || "+44 7700 900123"}</span>
              <span>London, United Kingdom</span>
            </div>
          </div>

          {/* ===== Professional Summary ===== */}
          <div className="mb-6">
            <h3 className="text-base font-semibold uppercase tracking-wide text-[#2D468A]">
              Professional Summary
            </h3>

            <p className="mt-3 text-sm leading-relaxed text-gray-700">
              Results-driven software engineer with{" "}
              {candidate?.experience || 5}+ years of experience designing,
              developing and deploying scalable web applications.
              Strong background in frontend and backend technologies,
              delivering high-performance and user-focused solutions.
            </p>
          </div>

          {/* ===== Skills ===== */}
          <div className="mb-6">
            <h3 className="text-base font-semibold uppercase tracking-wide text-[#2D468A]">
              Technical Skills
            </h3>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-3 text-sm">
              {(candidate?.skills || ["React", "Node.js", "JavaScript"]).map(
                (skill) => (
                  <div
                    key={skill}
                    className="bg-gray-100 px-3 py-2 rounded-md border text-gray-700"
                  >
                    {skill}
                  </div>
                )
              )}
            </div>
          </div>

          {/* ===== Experience ===== */}
          <div className="mb-6">
            <h3 className="text-base font-semibold uppercase tracking-wide text-[#2D468A]">
              Professional Experience
            </h3>

            <div className="mt-4 space-y-4">

              <div>
                <div className="flex justify-between items-center">
                  <h4 className="font-semibold text-sm">
                    Senior Software Developer
                  </h4>
                  <span className="text-sm text-gray-500">
                    2021 – Present
                  </span>
                </div>

                <p className="text-sm text-gray-600">
                  TechCorp International
                </p>

                <ul className="list-disc ml-5 mt-2 text-sm text-gray-700 space-y-1">
                  <li>Designed and developed scalable React applications</li>
                  <li>Improved system performance by 40%</li>
                  <li>Led cross-functional agile teams</li>
                  <li>Implemented CI/CD pipelines</li>
                </ul>
              </div>

            </div>
          </div>

          {/* ===== Education ===== */}
          <div>
            <h3 className="text-base font-semibold uppercase tracking-wide text-[#2D468A]">
              Education
            </h3>

            <div className="mt-4">
              <div className="flex justify-between items-center">
                <h4 className="font-semibold text-sm">
                  BSc Computer Science
                </h4>
                <span className="text-sm text-gray-500">
                  2016 – 2020
                </span>
              </div>

              <p className="text-sm text-gray-600">
                University of Technology
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}