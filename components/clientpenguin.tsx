"use client";

import dynamic from 'next/dynamic';

const Penguin = dynamic(() => import('@/components/Penguin'), { ssr: false });

export default function ClientPenguin() {
  return <Penguin />;
}