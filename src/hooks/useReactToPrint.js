import { useRef, useCallback } from 'react';

export const useReactToPrint = (options) => {
  const triggerRef = useRef(null);
  const contentRef = useRef(null);

  const handlePrint = useCallback(() => {
    if (!contentRef.current) return;

    const printableContent = contentRef.current.innerHTML;
    const originalContent = document.body.innerHTML;

    document.body.innerHTML = printableContent;
    window.print();
    document.body.innerHTML = originalContent;
    // We have to re-attach the event listeners after print
    // This is a limitation, but for a simple "print" it works.
    // A more robust library would use an iframe.
    window.location.reload(); 

  }, [contentRef]);

  const setTriggerRef = useCallback((node) => {
    if (triggerRef.current) {
      triggerRef.current.removeEventListener('click', handlePrint);
    }
    if (node) {
      node.addEventListener('click', handlePrint);
    }
    triggerRef.current = node;
  }, [handlePrint]);

  return { contentRef, triggerRef: setTriggerRef };
}; 