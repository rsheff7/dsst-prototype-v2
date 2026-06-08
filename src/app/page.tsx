'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useLesson } from '@/lib/lessonContext';
import { demoLesson } from '@/lib/demoLesson';
import { LessonData } from '@/lib/types';

const LOADING_MESSAGES = [
  'Reading your lesson...',
  'Mapping the lesson pathway...',
  'Predicting student thinking...',
  'Building your move walkthrough...',
];

type UploadState = 'idle' | 'analyzing' | 'error';

export default function HomePage() {
  const { setLesson } = useLesson();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadState, setUploadState] = useState<UploadState>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [loadingMessageIndex, setLoadingMessageIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    if (uploadState !== 'analyzing') return;
    const interval = setInterval(() => {
      setLoadingMessageIndex((i) => (i + 1) % LOADING_MESSAGES.length);
    }, 2500);
    return () => clearInterval(interval);
  }, [uploadState]);

  const handleFile = useCallback(
    async (file: File) => {
      if (!file.name.toLowerCase().endsWith('.pdf')) {
        setErrorMessage('Please upload a PDF file.');
        setUploadState('error');
        return;
      }

      // Vercel App Router POST bodies are capped at 4.5 MB. Reject early with a
      // specific message so the teacher knows what to do.
      const MAX_BYTES = 4_300_000;
      if (file.size > MAX_BYTES) {
        const mb = (file.size / 1_000_000).toFixed(1);
        setErrorMessage(
          `This PDF is ${mb} MB — uploads are capped at 4.3 MB. Re-export as a text-only PDF, or split it into a single-lesson PDF.`,
        );
        setUploadState('error');
        return;
      }

      setUploadState('analyzing');
      setLoadingMessageIndex(0);

      const formData = new FormData();
      formData.append('pdf', file);

      try {
        const res = await fetch('/api/analyze', { method: 'POST', body: formData });

        // Try JSON first; fall back to raw text if the server returned HTML
        // (e.g. Vercel's 413 page when the body is over the platform limit, or
        // an HTML 500 page when the function was killed by the platform).
        let serverMessage = '';
        let data: { error?: string } | null = null;
        let rawText = '';
        try {
          data = (await res.clone().json()) as { error?: string };
          if (data?.error) serverMessage = data.error;
        } catch {
          try {
            rawText = await res.text();
            if (rawText && rawText.length < 500) serverMessage = rawText;
          } catch {
            // ignore
          }
        }

        // Vercel's HTML error pages embed a request ID — surface it so failures
        // are debuggable instead of opaque.
        const vercelRequestId = res.headers.get('x-vercel-id') ?? '';
        const isHtmlPage = !data && /<html|Internal Server Error/i.test(rawText);

        if (!res.ok || !data) {
          if (res.status === 413) {
            setErrorMessage(
              'The PDF was rejected as too large by the server. Re-export the PDF without images or split it to a single lesson.',
            );
          } else if (res.status === 504) {
            setErrorMessage(
              serverMessage ||
                'The analysis timed out. The lesson may be long — try a shorter excerpt or re-upload.',
            );
          } else if (isHtmlPage && res.status >= 500) {
            setErrorMessage(
              `The Vercel function was killed mid-execution (likely a 300s timeout)${
                vercelRequestId ? ` — request ID ${vercelRequestId}` : ''
              }. Try a shorter PDF, or re-upload.`,
            );
          } else if (serverMessage) {
            setErrorMessage(serverMessage);
          } else {
            setErrorMessage(
              `Upload failed (HTTP ${res.status}${
                vercelRequestId ? `, request ID ${vercelRequestId}` : ''
              }). Check your connection and try again.`,
            );
          }
          setUploadState('error');
          return;
        }

        setLesson(data as unknown as LessonData);
        router.push('/lesson');
      } catch (err) {
        setErrorMessage(
          err instanceof Error
            ? `Network error: ${err.message}`
            : 'Network error. Check your connection and try again.',
        );
        setUploadState('error');
      }
    },
    [setLesson, router]
  );

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (file) handleFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const handleDemo = () => {
    setLesson(demoLesson);
    router.push('/lesson');
  };

  if (uploadState === 'analyzing') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6">
        <div className="text-center max-w-sm">
          <div className="mx-auto mb-8 flex h-12 w-12 items-center justify-center">
            <svg className="animate-spin h-8 w-8 text-ink-faint" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          </div>
          <p className="text-[0.95rem] text-ink-muted leading-relaxed transition-all duration-500">
            {LOADING_MESSAGES[loadingMessageIndex]}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-16">
      <div className="w-full max-w-md">
        <div className="mb-12 text-center">
          <h1
            className="text-[2.75rem] tracking-tight text-ink leading-none"
            style={{ fontFamily: 'var(--font-dm-serif), serif' }}
          >
            DSST
          </h1>
          <p
            className="mt-2 text-[0.85rem] uppercase tracking-[0.18em] font-semibold"
            style={{ color: '#00876C' }}
          >
            Math Teacher Tools
          </p>
          <p className="mt-6 text-[0.95rem] text-ink-muted leading-relaxed max-w-sm mx-auto">
            Upload a math lesson to get plan-the-lesson tools and walk through the moves you might make in class.
          </p>
        </div>

        <label
          onDrop={handleDrop}
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          className={`relative block cursor-pointer rounded-2xl border-2 border-dashed px-8 py-12 text-center transition-colors ${
            isDragging
              ? 'border-ink-muted bg-card'
              : 'border-line bg-card hover:border-ink-faint'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="application/pdf,.pdf"
            className="sr-only"
            onChange={handleFileInput}
          />
          <div
            className="mx-auto mb-4 flex h-10 w-10 items-center justify-center rounded-xl"
            style={{ backgroundColor: '#E5EEEB' }}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" style={{ color: '#00876C' }}>
              <path d="M10 2L10 13M10 2L7 5M10 2L13 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M3 14v1a2 2 0 002 2h10a2 2 0 002-2v-1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </div>
          <p className="text-[0.9rem] font-medium text-ink">
            {isDragging ? 'Drop your PDF here' : 'Drag and drop your lesson PDF'}
          </p>
          <p className="mt-1.5 text-[0.8rem] text-ink-faint">
            or click to browse
          </p>
          <p className="mt-4 text-[0.75rem] text-ink-faint">
            PDF · Illustrative Mathematics lessons work best
          </p>
        </label>

        {uploadState === 'error' && (
          <div className="mt-4 rounded-xl border border-line bg-card px-5 py-4">
            <p className="text-[0.875rem] text-ink">{errorMessage}</p>
            <button
              onClick={() => { setUploadState('idle'); setErrorMessage(''); }}
              className="mt-2 text-[0.8rem] font-medium text-ink-muted hover:text-ink cursor-pointer transition-colors"
            >
              Try again
            </button>
          </div>
        )}

        <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-5">
          <button
            onClick={handleDemo}
            className="text-[0.875rem] text-ink-muted hover:text-ink cursor-pointer transition-colors"
          >
            Try with a sample lesson →
          </button>
          <span className="hidden sm:block text-ink-faint text-[0.7rem]">·</span>
          <a
            href="/how-to"
            className="text-[0.875rem] text-ink-muted hover:text-ink cursor-pointer transition-colors"
          >
            How to use Premo →
          </a>
          <span className="hidden sm:block text-ink-faint text-[0.7rem]">·</span>
          <a
            href="/framework"
            className="text-[0.875rem] text-ink-muted hover:text-ink cursor-pointer transition-colors"
          >
            About Premo →
          </a>
        </div>
        <p className="mt-10 text-[0.7rem] text-ink-faint italic">
          Premo · v2.4 — ELD Convergence preview
        </p>
      </div>
    </div>
  );
}
