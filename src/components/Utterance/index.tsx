import { useEffect, useRef } from 'react';

export function UtterancesComments() {
  const utteranceRef = useRef<HTMLDivElement>();

  useEffect(() => {
    if (!utteranceRef.current) return;

    const scriptElem = document.createElement('script');
    scriptElem.src = 'https://utteranc.es/client.js';
    scriptElem.async = true;
    scriptElem.crossOrigin = 'anonymous';
    scriptElem.setAttribute('repo', 'joaovictor3g/blog-ignite');
    scriptElem.setAttribute('issue-term', 'pathname');
    scriptElem.setAttribute('label', 'blog-comment');
    scriptElem.setAttribute('theme', 'dark-blue');
    utteranceRef.current.appendChild(scriptElem);
  }, []);

  return <div ref={utteranceRef}></div>;
}
