'use client';

import Layout from '@/Layout'
import React from 'react';

export default function TaskLayout({ children }: { children: React.ReactNode }) {
    return (
        <Layout>
            {children}
        </Layout>
    );
}