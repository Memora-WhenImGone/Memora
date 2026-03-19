"use client";

function WorkflowStep({ step, title, description }) {
  return (
    <div className="p-3 rounded-lg border border-amber-200 bg-white">
      <p className="font-semibold">
        {step}) {title}
      </p>
      <p className="text-gray-600 mt-1">{description}</p>
    </div>
  );
}

export default function VaultWorkflowBanner() {
  return (
    <div className="rounded-xl border border-amber-300 bg-amber-50 p-4">
      <p className="text-sm font-medium text-amber-900">How it works</p>
      <div className="mt-2 grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
        <WorkflowStep
          step="1"
          title="Add details"
          description="Set title and description, then Save."
        />
        <WorkflowStep
          step="2"
          title="Assign contacts"
          description="Choose who can access this item."
        />
        <WorkflowStep
          step="3"
          title="Upload files"
          description="Files are encrypted with your vault key."
        />
      </div>
    </div>
  );
}
