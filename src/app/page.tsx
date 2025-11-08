"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.push("/onboard");
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      <div className="animate-pulse">
        <div className="h-8 w-8 rounded-full border-4 border-purple-600 border-t-transparent animate-spin"></div>
      </div>
    </div>
  );
}