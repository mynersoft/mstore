"use client";

import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import PdfViewer from "@/components/PdfViewer";

export default function TopicPage() {
  const [selected, setSelected] = useState(null);

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar onSelect={setSelected} />

      {/* Main Container */}
      <main className="flex-1 p-6">
        {!selected ? (
          <div className="text-center text-gray-500 text-lg mt-20">
            📝 কোনো Topic সিলেক্ট করো Sidebar থেকে।
          </div>
        ) : (
          <div>
            <h1 className="text-2xl font-semibold mb-4 text-gray-800">
              {selected.title}
            </h1>
            <PdfViewer pdfUrl={selected.pdfUrl} />
          </div>
        )}
      </main>
    </div>
  );
}