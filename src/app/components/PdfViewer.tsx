"use client";

import React, { useEffect, useRef, useState } from "react";
import Script from "next/script";

interface PdfViewerProps {
  pdfPath: string;
  title: string;
}

// Sub-component to render a single page of the PDF to canvas
interface PdfPageProps {
  pdfDoc: any;
  pageNum: number;
  scale: number;
  containerWidth: number;
}

const PdfPage = React.memo(({ pdfDoc, pageNum, scale, containerWidth }: PdfPageProps) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const renderTaskRef = useRef<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const render = async () => {
      if (!pdfDoc || !canvasRef.current) return;
      setLoading(true);
      
      try {
        const page = await pdfDoc.getPage(pageNum);
        if (!active) return;

        // Calculate scale to fit container width initially
        const unscaledViewport = page.getViewport({ scale: 1 });
        const fitScale = containerWidth / unscaledViewport.width;
        // Apply the user's zoom factor (scale)
        const finalScale = fitScale * scale;

        const viewport = page.getViewport({ scale: finalScale });
        const canvas = canvasRef.current;
        const context = canvas.getContext("2d");
        if (!context) return;

        canvas.height = viewport.height;
        canvas.width = viewport.width;

        const renderContext = {
          canvasContext: context,
          viewport: viewport,
        };

        if (renderTaskRef.current) {
          renderTaskRef.current.cancel();
        }

        const renderTask = page.render(renderContext);
        renderTaskRef.current = renderTask;

        await renderTask.promise;
        renderTaskRef.current = null;
        if (active) setLoading(false);
      } catch (err: any) {
        if (err.name !== "RenderingCancelledException") {
          console.error(`Error rendering page ${pageNum}:`, err);
        }
      }
    };

    render();

    return () => {
      active = false;
      if (renderTaskRef.current) {
        renderTaskRef.current.cancel();
      }
    };
  }, [pdfDoc, pageNum, scale, containerWidth]);

  return (
    <div 
      data-page-num={pageNum}
      className="relative flex flex-col items-center justify-center my-6 bg-black/10 border border-gold-dark/10 shadow-lg mx-auto shrink-0 select-none"
      style={{
        // Ensure some min-height matches aspect ratio to avoid layout shifts before loading
        minHeight: containerWidth ? `${containerWidth * 1.41}px` : "500px",
      }}
    >
      {loading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#070709]/80 gap-3 z-10">
          <div className="w-8 h-8 border-2 border-gold/20 border-t-gold rounded-full animate-spin" />
        </div>
      )}
      <canvas ref={canvasRef} className="block shadow-md bg-white max-w-none" />
      <div className="absolute bottom-3 right-3 bg-black/75 border border-gold-dark/20 px-2.5 py-1 text-[10px] text-gold font-mono tracking-wider">
        Page {pageNum}
      </div>
    </div>
  );
});

PdfPage.displayName = "PdfPage";

export default function PdfViewer({ pdfPath, title }: PdfViewerProps) {
  const [pdfjsLoaded, setPdfjsLoaded] = useState(false);
  const [pdfDoc, setPdfDoc] = useState<any>(null);
  const [activePage, setActivePage] = useState(1);
  const [pageCount, setPageCount] = useState(0);
  const [scale, setScale] = useState(1.0);
  const [loading, setLoading] = useState(true);
  const [containerWidth, setContainerWidth] = useState(600);
  const [error, setError] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement | null>(null);

  // Initialize PDFJS Worker once loaded
  const handleScriptLoad = () => {
    if (typeof window !== "undefined" && (window as any).pdfjsLib) {
      const pdfjsLib = (window as any).pdfjsLib;
      pdfjsLib.GlobalWorkerOptions.workerSrc =
        "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js";
      setPdfjsLoaded(true);
    }
  };

  // Check if PDFJS is already loaded
  useEffect(() => {
    if (typeof window !== "undefined" && (window as any).pdfjsLib) {
      const pdfjsLib = (window as any).pdfjsLib;
      pdfjsLib.GlobalWorkerOptions.workerSrc =
        "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js";
      setPdfjsLoaded(true);
    }
  }, []);

  // Measure container width and observe resize
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const updateWidth = () => {
      const padding = window.innerWidth < 640 ? 16 : 32;
      // Subtract padding to keep canvas nicely formatted inside container
      setContainerWidth(container.clientWidth - padding);
    };

    updateWidth();

    const resizeObserver = new ResizeObserver(() => {
      updateWidth();
    });
    resizeObserver.observe(container);

    return () => {
      resizeObserver.disconnect();
    };
  }, [pdfDoc]);

  // Load PDF document when path changes
  useEffect(() => {
    if (!pdfjsLoaded || !pdfPath) return;

    let active = true;
    const loadPdf = async () => {
      setLoading(true);
      setError(null);
      setPdfDoc(null);
      setActivePage(1);
      setScale(1.0);
      
      try {
        const pdfjsLib = (window as any).pdfjsLib;
        const loadingTask = pdfjsLib.getDocument(encodeURI(pdfPath));
        const pdf = await loadingTask.promise;
        if (active) {
          setPdfDoc(pdf);
          setPageCount(pdf.numPages);
        }
      } catch (err: any) {
        console.error("Error loading PDF:", err);
        if (active) {
          setError("Impossible de charger le document PDF. Vous pouvez le télécharger directement.");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadPdf();

    return () => {
      active = false;
    };
  }, [pdfPath, pdfjsLoaded]);

  // Scroll event handler to track active page
  const handleScroll = () => {
    const container = containerRef.current;
    if (!container) return;

    const containerRect = container.getBoundingClientRect();
    const containerHeight = containerRect.height;
    const pageElements = container.querySelectorAll("[data-page-num]");
    
    let currentActive = 1;
    let minDiff = Infinity;

    pageElements.forEach((el) => {
      const pageNum = Number(el.getAttribute("data-page-num"));
      const rect = el.getBoundingClientRect();
      
      // Calculate how close the center of the page is to the center of the scroll container
      const elMiddle = rect.top - containerRect.top + rect.height / 2;
      const containerMiddle = containerHeight / 2;
      
      const diff = Math.abs(elMiddle - containerMiddle);
      if (diff < minDiff) {
        minDiff = diff;
        currentActive = pageNum;
      }
    });

    setActivePage(currentActive);
  };

  // Attach scroll listener with requestAnimationFrame throttling
  useEffect(() => {
    const container = containerRef.current;
    if (!container || !pdfDoc) return;

    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    container.addEventListener("scroll", onScroll);
    return () => {
      container.removeEventListener("scroll", onScroll);
    };
  }, [pdfDoc]);

  const scrollToPage = (num: number) => {
    const container = containerRef.current;
    if (!container) return;
    
    const targetPage = container.querySelector(`[data-page-num="${num}"]`);
    if (targetPage) {
      targetPage.scrollIntoView({ behavior: "smooth", block: "start" });
      setActivePage(num);
    }
  };

  const handlePageChange = (offset: number) => {
    const newPage = activePage + offset;
    if (newPage >= 1 && newPage <= pageCount) {
      scrollToPage(newPage);
    }
  };

  const handleZoom = (factor: number) => {
    setScale((prev) => {
      const newScale = prev * factor;
      // Allow scaling up to 3.0 (300%) and down to 0.5 (50%)
      return Math.min(Math.max(newScale, 0.5), 3.0);
    });
  };

  const resetZoom = () => {
    setScale(1.0);
  };

  const isFirstPage = activePage === 1;
  const isLastPage = activePage === pageCount;

  return (
    <div className="w-full flex flex-col gap-4">
      {/* Load script only if not already loaded */}
      {!pdfjsLoaded && (
        <Script
          src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.min.js"
          onLoad={handleScriptLoad}
          strategy="afterInteractive"
        />
      )}

      {/* Toolbar / Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-black/40 border border-gold-dark/20 backdrop-blur-md sticky top-0 z-20">
        {/* Navigation buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => handlePageChange(-1)}
            disabled={isFirstPage || loading}
            className="p-2 border border-gold-dark/20 text-gold hover:border-gold hover:bg-gold/10 transition-all cursor-pointer disabled:opacity-40 disabled:pointer-events-none"
            title="Page précédente"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Direct page selection */}
          <div className="flex items-center gap-2 text-xs md:text-sm text-gold-light">
            <select
              value={activePage}
              onChange={(e) => scrollToPage(Number(e.target.value))}
              disabled={loading || pageCount === 0}
              className="bg-black/80 border border-gold-dark/30 text-gold-light py-1 px-2 text-xs font-semibold focus:outline-none focus:border-gold cursor-pointer rounded-none"
            >
              {Array.from({ length: pageCount }, (_, i) => (
                <option key={i + 1} value={i + 1}>
                  Page {i + 1}
                </option>
              ))}
            </select>
            <span className="text-zinc-500 font-light">sur {pageCount || "?"}</span>
          </div>

          <button
            onClick={() => handlePageChange(1)}
            disabled={isLastPage || loading}
            className="p-2 border border-gold-dark/20 text-gold hover:border-gold hover:bg-gold/10 transition-all cursor-pointer disabled:opacity-40 disabled:pointer-events-none"
            title="Page suivante"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Zoom Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleZoom(0.8)}
            disabled={loading || scale <= 0.5}
            className="p-2 border border-gold-dark/20 text-gold hover:border-gold hover:bg-gold/10 transition-all cursor-pointer disabled:opacity-40 disabled:pointer-events-none"
            title="Zoom arrière"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7" />
            </svg>
          </button>
          
          <span className="text-xs text-gold-light/80 min-w-[40px] text-center font-mono select-none">
            {Math.round(scale * 100)}%
          </span>

          <button
            onClick={() => handleZoom(1.2)}
            disabled={loading || scale >= 3.0}
            className="p-2 border border-gold-dark/20 text-gold hover:border-gold hover:bg-gold/10 transition-all cursor-pointer disabled:opacity-40 disabled:pointer-events-none"
            title="Zoom avant"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" />
            </svg>
          </button>

          <button
            onClick={resetZoom}
            disabled={loading || scale === 1.0}
            className="p-2 border border-gold-dark/20 text-gold hover:border-gold hover:bg-gold/10 transition-all text-xs font-semibold uppercase tracking-wider cursor-pointer disabled:opacity-40 disabled:pointer-events-none"
            title="Ajuster à la largeur"
          >
            Ajuster
          </button>
        </div>

        {/* Download Button */}
        <div>
          <a
            href={encodeURI(pdfPath)}
            download={pdfPath.substring(pdfPath.lastIndexOf("/") + 1)}
            className="p-2 border border-gold text-gold hover:bg-gold hover:text-black transition-all text-xs font-semibold uppercase tracking-widest flex items-center gap-1.5 cursor-pointer"
            title="Télécharger le PDF"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            <span className="hidden sm:inline">Télécharger</span>
          </a>
        </div>
      </div>

      {/* PDF Pages Scroll Container */}
      <div 
        ref={containerRef}
        className="w-full flex-1 max-h-[70vh] bg-black/40 border border-gold-dark/20 flex flex-col items-center overflow-auto p-4 relative"
      >
        {loading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 z-10 gap-3">
            <div className="w-10 h-10 border-2 border-gold/20 border-t-gold rounded-full animate-spin" />
            <p className="text-xs text-gold uppercase tracking-widest font-semibold animate-pulse">
              Chargement du document...
            </p>
          </div>
        )}

        {error ? (
          <div className="text-center p-6 flex flex-col items-center gap-4 max-w-md my-auto">
            <svg className="w-12 h-12 text-red-500/80" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <p className="text-sm text-zinc-300 font-light leading-relaxed">{error}</p>
            <a
              href={encodeURI(pdfPath)}
              download
              className="px-6 py-2 border border-gold text-gold hover:bg-gold hover:text-black transition-all text-xs font-semibold uppercase tracking-widest cursor-pointer"
            >
              Télécharger le document PDF
            </a>
          </div>
        ) : (
          !loading && pdfDoc && (
            <div className="flex flex-col w-full items-center">
              {Array.from({ length: pageCount }, (_, i) => (
                <PdfPage 
                  key={i + 1}
                  pdfDoc={pdfDoc}
                  pageNum={i + 1}
                  scale={scale}
                  containerWidth={containerWidth}
                />
              ))}
            </div>
          )
        )}
      </div>
    </div>
  );
}
