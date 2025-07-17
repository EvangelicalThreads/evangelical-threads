"use client";

import React, { Suspense } from "react";
import ResetPasswordConfirmContent from "./ResetPasswordConfirmContent";

export default function ResetPasswordConfirmPage() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <ResetPasswordConfirmContent />
    </Suspense>
  );
}