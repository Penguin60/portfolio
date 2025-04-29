"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

function Landing() {
    const router = useRouter();

    useEffect(() => {
        router.push('/dean');
    }, [router]);

    return null;
}

export default Landing;