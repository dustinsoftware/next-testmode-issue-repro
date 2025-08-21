"use client";

import Image from "next/image";
import { useState } from "react";

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleTestS3 = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/s3-test', { headers: { 'fetch-request': '1'}});
      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error('Error calling /api/s3-test:', error);
      setResult({ error: 'Failed to call API' });
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        
        <button
          onClick={handleTestS3}
          disabled={loading}
          className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 disabled:opacity-50"
        >
          {loading ? 'Testing S3...' : 'Test S3 API'}
        </button>

        {result && (
          <div className="p-4 border rounded-lg bg-gray-50 dark:bg-gray-800">
            <pre className="text-xs overflow-auto">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}
      </main>
    </div>
  );
}
