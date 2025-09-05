"use client";

import * as React from "react";

const Health = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <div className="w-16 h-16 bg-success rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-success-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-2xl font-heading font-bold text-foreground mb-2">
          System Healthy
        </h1>
        <p className="text-muted-foreground mb-6">
          All services are running normally
        </p>
        <pre className="bg-card p-4 rounded-lg text-left text-sm">
          {JSON.stringify({ ok: true }, null, 2)}
        </pre>
      </div>
    </div>
  );
};

export default Health;