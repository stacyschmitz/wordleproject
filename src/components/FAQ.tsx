import { Mail, Copy, Check } from 'lucide-react';
import { useState } from 'react';

export function FAQ() {
  const submissionEmail = 'wordle@sandbox1defe0edc02e4a3f99e420b9118d5831.mailgun.org';
  const [copied, setCopied] = useState(false);

  const copyEmail = () => {
    navigator.clipboard.writeText(submissionEmail);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-md mx-auto text-left">
      <div className="bg-[#f6f7f8] border border-[#d3d6da] rounded-lg p-4">
        <div className="flex items-center gap-2 mb-3">
          <Mail className="w-4 h-4 text-[#1a1a1b]" />
          <h3 className="font-bold text-[#1a1a1b]">How to Submit Scores</h3>
        </div>
        <div className="text-sm text-[#1a1a1b] space-y-3">
          <div>
            <p className="mb-2">After completing your daily Wordle:</p>
            <ol className="list-decimal list-inside space-y-1 text-[#878a8c] ml-2">
              <li>Tap the <span className="font-bold text-[#1a1a1b]">Share</span> button in Wordle</li>
              <li>Select <span className="font-bold text-[#1a1a1b]">Email</span></li>
              <li>Send to the email address below</li>
            </ol>
          </div>

          <div className="bg-white rounded-lg p-3 border border-[#d3d6da]">
            <div className="flex items-center justify-between gap-2 mb-2">
              <p className="text-xs font-bold text-[#1a1a1b]">Email Address:</p>
              <button
                onClick={copyEmail}
                className="flex items-center gap-1 px-2 py-1 text-xs font-medium text-[#6aaa64] hover:text-[#538d4e] transition-colors"
              >
                {copied ? (
                  <>
                    <Check className="w-3 h-3" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    Copy
                  </>
                )}
              </button>
            </div>
            <p className="font-mono text-xs text-[#6aaa64] break-words overflow-wrap-anywhere">
              {submissionEmail}
            </p>
          </div>

          <p className="text-[#878a8c] text-xs">
            Make sure you're using your registered email address when sending. Scores are automatically recorded when you email your Wordle share!
          </p>
        </div>
      </div>

      <div className="bg-[#f6f7f8] border border-[#d3d6da] rounded-lg p-4">
        <h3 className="font-bold text-[#1a1a1b] mb-3">Rules</h3>
        <ul className="text-sm text-[#1a1a1b] space-y-2 list-disc list-inside">
          <li>Play daily Wordle at <a href="https://www.nytimes.com/games/wordle" target="_blank" rel="noopener noreferrer" className="underline text-[#6aaa64] hover:text-[#538d4e]">nytimes.com/games/wordle</a></li>
          <li>Lower score wins the day</li>
          <li>Both players must submit to count</li>
          <li>No cheating!</li>
        </ul>
      </div>
    </div>
  );
}
