export function ScrollToHomeOnReload() {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `(function(){try{if("scrollRestoration" in history)history.scrollRestoration="manual";var n=performance.getEntriesByType("navigation")[0];if(n&&n.type==="reload"){window.scrollTo(0,0);if(location.hash)history.replaceState(null,"",location.pathname+location.search);}}catch(e){}})();`,
      }}
    />
  );
}
