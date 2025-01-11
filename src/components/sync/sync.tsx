"use client";

const Sync = () => {
  return (
    <div className="absolute top-0 right-12">
      <button
        className="relative inline-flex h-10 w-10 items-center justify-center rounded-lg    border border-border bg-background/50 hover:bg-accent    transition-colors duration-200"
        title="Sync with cloud"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#4a90e2"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2" />
        </svg>
        <span className="sr-only">Toggle theme</span>
      </button>
    </div>
  );
};

export default Sync;

// TODO: Three lines, then login/logout/swtich char
