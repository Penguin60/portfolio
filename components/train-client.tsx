"use client";

import dynamic from "next/dynamic";

const Train = dynamic(() => import("@/components/train"), { ssr: false });

export default function TrainClient() {
  return <Train />;
}
