import { useEffect, useRef } from "react";

function ReportsManager() {
  const containerRef = useRef(null);
  const widgetRef = useRef(null);

  useEffect(() => {
    const loadScript = (src) => {
      return new Promise((resolve, reject) => {
        if (document.querySelector(`script[src="${src}"]`)) {
          resolve();
          return;
        }
        const script = document.createElement('script');
        script.src = src;
        script.async = false;
        script.onload = resolve;
        script.onerror = () => reject(new Error(`Failed to load ${src}`));
        document.head.appendChild(script);
      });
    };

    const loadCSS = (href) => {
      if (document.querySelector(`link[href="${href}"]`)) return;
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = href;
      document.head.appendChild(link);
    };

    const initWebix = async () => {
      try {
        // Load Webix core
        await loadScript('/webix.trial.complete/webix/codebase/webix.js');
        loadCSS('/webix.trial.complete/webix/codebase/webix.css');

        // Load Reports module
        await loadScript('/webix.trial.complete/reports/codebase/reports.js');
        loadCSS('/webix.trial.complete/reports/codebase/reports.css');

        // Initialize Reports Manager (matches official sample: 01_init_as_view.html)
        if (window.webix) {
          window.webix.ready(() => {
            if (window.webix.env.mobile) window.webix.ui.fullScreen();
            window.webix.CustomScroll.init();

            widgetRef.current = window.webix.ui({
              view: "reports",
              container: containerRef.current,
              url: "/",
            });
          });
        }
      } catch (error) {
        console.error('Error loading Webix:', error);
      }
    };

    initWebix();

    return () => {
      if (widgetRef.current && widgetRef.current.destructor) {
        try {
          widgetRef.current.destructor();
          widgetRef.current = null;
        } catch (err) {
          console.error('Error during cleanup:', err);
        }
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        height: "100vh",
        width: "100%",
        position: "relative"
      }}
    />
  );
}

export default ReportsManager;
