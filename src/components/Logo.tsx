"use client";

import React from "react";
import Link from "next/link";


export default function NotoLogo() {
  return (
    <Link href="/" className="items-center space-x-1 group">
      <span
        className={`
          text-2xl md:text-5xl font-bold transition-colors
          text-default
        `}
      >
        noto
        <span
          className={`
            text-amber-600 group-hover:text-amber-500
            transition-colors
          `}
        >
          ()
        </span>
      </span>
    </Link>
  );
}