import React, { useEffect, useRef } from 'react';

declare global {
  interface Window {
    MathJax: any;
  }
}

interface MathTextProps {
  content: string;
  className?: string;
  Component?: React.ElementType;
}

const MathText: React.FC<MathTextProps> = ({ content, className = '', Component = 'div' }) => {
  const containerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      // Basic formatting processor
      // 1. **text** -> styled bold text with distinct color
      // 2. \n -> <br />
      let formattedContent = content;

      // Handle Bold (**text**)
      // Changed to indigo-700 and font-bold for better visibility as requested
      formattedContent = formattedContent.replace(
        /\*\*(.*?)\*\*/g, 
        '<span class="font-bold text-indigo-700">$1</span>'
      );

      // Handle Newlines (\n)
      // We replace \n with <br /> for line breaks
      formattedContent = formattedContent.replace(/\n/g, '<br />');

      containerRef.current.innerHTML = formattedContent;

      // Trigger MathJax typeset
      if (window.MathJax && window.MathJax.typesetPromise) {
        window.MathJax.typesetPromise([containerRef.current])
          .catch((err: any) => console.error('MathJax typeset failed: ', err));
      }
    }
  }, [content]);

  return (
    <Component 
      ref={containerRef} 
      className={`math-content text-slate-700 leading-relaxed ${className}`}
    />
  );
};

export default MathText;