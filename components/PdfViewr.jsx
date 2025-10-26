"use client";
export default function PdfViewer({ pdfUrl }) {
  if (!pdfUrl)
    return <p className="text-center mt-10">Select a topic to view PDF</p>;

  return (
    <iframe
      src={`https://docs.google.com/gview?url=${pdfUrl}&embedded=true`}
      className="w-full h-screen"
    />
  );
}