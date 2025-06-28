"use client";

import React, { useState } from 'react';
import { Bot, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { generateMarketingPlanSuggestions } from '@/ai/flows/generate-marketing-plan-suggestions';

interface AiAssistantProps {
  sectionTitle: string;
  existingContent: string | object;
}

export default function AiAssistant({ sectionTitle, existingContent }: AiAssistantProps) {
  const [loading, setLoading] = useState(false);
  const [suggestion, setSuggestion] = useState('');
  const [error, setError] = useState('');

  const getSuggestion = async () => {
    setLoading(true);
    setError('');
    setSuggestion('');

    try {
      const contentString = typeof existingContent === 'object' && existingContent !== null
        ? JSON.stringify(existingContent, null, 2)
        : existingContent;

      const result = await generateMarketingPlanSuggestions({
        sectionTitle,
        existingContent: contentString || '',
      });

      if (result.suggestions) {
        setSuggestion(result.suggestions);
      } else {
        throw new Error("Received an empty suggestion from the AI.");
      }
    } catch (err) {
      console.error("AI Assistant Error:", err);
      setError("Sorry, I couldn't get suggestions at this time.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="my-4 p-4 border-l-4 border-blue-300 bg-blue-500/10 rounded-r-lg">
      <Button onClick={getSuggestion} disabled={loading} variant="link" className="p-0 h-auto text-primary">
        {loading ? (
          <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Thinking...</>
        ) : (
          <><Bot className="w-5 h-5 mr-2" /> Get AI Suggestions</>
        )}
      </Button>
      {error && <p className="text-destructive mt-2 text-sm">{error}</p>}
      {suggestion && (
        <div className="mt-3 text-sm prose prose-sm max-w-none text-foreground/80 prose-p:my-1 prose-ul:my-2 prose-li:my-0">
          {suggestion.split('\n').map((line, i) => (
            <p key={i}>{line.replace(/\*/g, '•')}</p>
          ))}
        </div>
      )}
    </div>
  );
}
