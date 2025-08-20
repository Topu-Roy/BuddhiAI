"use client";

import { useRouter } from "nextjs-toploader/app";

export default function Page() {
  const router = useRouter();

  return <div onClick={() => router.push("/dashboard")}>Page</div>;
}
