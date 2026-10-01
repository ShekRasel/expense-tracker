"use client";

import { useState } from "react";
import { ArrowDown, Check, ChevronDown, Copy } from "lucide-react";

// Public demo credentials intentionally provided for project reviewers.
const demoAccount = {
  email: "testuser01@example.com",
  password: "TestPass123!",
};

export default function DemoAccount({ onUse, disabled }) {
  const [copied, setCopied] = useState("");
  const [message, setMessage] = useState("");

  async function copyCredential(field) {
    try {
      await navigator.clipboard.writeText(demoAccount[field]);
      setCopied(field);
      setMessage(`Demo ${field} copied.`);
    } catch {
      setCopied("");
      setMessage(
        "Copy is unavailable here. Select the details below to copy them manually, or use the fill button.",
      );
    }
  }

  return (
    <details className="demo-account">
      <summary>
        <span>
          <strong>Try the demo account</strong>
          <span>For recruiters & reviewers · No signup needed</span>
        </span>
        <ChevronDown size={18} aria-hidden="true" />
      </summary>
      <div className="demo-account-content">
        <p>Explore the project with this ready-to-use account.</p>
        <dl className="demo-credentials">
          {Object.entries(demoAccount).map(([field, value]) => (
            <div className="demo-credential" key={field}>
              <div>
                <dt>{field === "email" ? "Email" : "Password"}</dt>
                <dd>
                  <code>{value}</code>
                </dd>
              </div>
              <button
                type="button"
                className="icon-button"
                aria-label={`Copy demo ${field}`}
                onClick={() => copyCredential(field)}
                disabled={disabled}
              >
                {copied === field ? <Check size={16} /> : <Copy size={16} />}
              </button>
            </div>
          ))}
        </dl>
        <button
          type="button"
          className="btn btn-secondary btn-full"
          disabled={disabled}
          onClick={() => {
            onUse(demoAccount);
            setMessage("Demo details filled in. Select Sign in to explore.");
          }}
        >
          Use demo credentials <ArrowDown size={16} />
        </button>
        <p className="demo-account-status" role="status">
          {message}
        </p>
      </div>
    </details>
  );
}
