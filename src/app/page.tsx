"use client";

import React, { useState } from "react";
import PdfViewer from "./components/PdfViewer";

interface DomainData {
  id: string;
  nameFr: string;
  descriptionFr: string;
  highlightsFr: string[];
  members: string[];
  icon: React.ReactNode;
  pdfPath: string;
}

export default function Home() {
  const [isOpening, setIsOpening] = useState(false);
  const [isCurtainRemoved, setIsCurtainRemoved] = useState(false);
  const [activeDomain, setActiveDomain] = useState<DomainData | null>(null);
  const [hoveredDomain, setHoveredDomain] = useState<string | null>(null);



  const triggerCurtainOpen = () => {
    setIsOpening(true);
    sessionStorage.setItem("hasSeenCurtain", "true");
    setTimeout(() => {
      setIsCurtainRemoved(true);
    }, 1600); // matches the CSS transition duration
  };



  const domains: DomainData[] = [
    {
      id: "politique",
      nameFr: "Le domaine politique",
      descriptionFr: "Étude approfondie des relations diplomatiques franco-égyptiennes et analyse des systèmes politiques contemporains. Traduction de discours officiels et d'articles de presse internationale sur la géopolitique.",
      highlightsFr: ["Relations Bilatérales", "Discours Officiels", "Analyses Géopolitiques"],
      members: ["Marawan Mohamed", "Mariam Mohsen", "Rawan Hfeda"],
      pdfPath: "/المجال السياسي.pdf",
      icon: (
        <svg className="w-12 h-12 text-gold transition-all duration-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 21h16M4 18h16M4 8l8-5 8 5M6 8v10M10 8v10M14 8v10M18 8v10M12 5v3" />
        </svg>
      )
    },
    {
      id: "historique",
      nameFr: "Le domaine historique",
      descriptionFr: "Exploration des liens historiques profonds qui unissent l'Égypte et la France, de l'expédition d'Égypte aux échanges archéologiques modernes et à l'héritage intellectuel partagé.",
      highlightsFr: ["Patrimoine Commun", "Égyptologie & Archives", "Héritage Littéraire"],
      members: ["Mansour Mohamed", "Rana Mohamed", "Haidy Hesham", "Merna El Desouky"],
      pdfPath: "/المجال التاريخي.pdf",
      icon: (
        <svg className="w-12 h-12 text-gold transition-all duration-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
        </svg>
      )
    },
    {
      id: "economique",
      nameFr: "Le domaine économique",
      descriptionFr: "Analyse des échanges commerciaux bilatéraux, des investissements industriels français en Égypte et des perspectives économiques liées au développement durable et aux projets du canal de Suez.",
      highlightsFr: ["Échanges Commerciaux", "Développement Durable", "Investissements Directs"],
      members: ["Ammar Ramadan", "Maram Ebrahim", "Tasnem Khalil", "Sama Essam"],
      pdfPath: "/المجال الاقتصادي.pdf",
      icon: (
        <svg className="w-12 h-12 text-gold transition-all duration-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.281m5.94 2.28l-2.28 5.941M3.75 3v18" />
        </svg>
      )
    },
    {
      id: "medical",
      nameFr: "Le domaine médical",
      descriptionFr: "Synthèse de la coopération médicale et scientifique franco-égyptienne. Traduction d'articles sur la santé publique, les protocoles de recherche et les avancées thérapeutiques modernes.",
      highlightsFr: ["Coopération Scientifique", "Traduction Médicale", "Santé Publique"],
      members: ["Yasmine El Sayed", "Amira Gamal", "Menna Saad"],
      pdfPath: "/المجال الطبي.pdf",
      icon: (
        <svg className="w-12 h-12 text-gold transition-all duration-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6M12 9v6" />
        </svg>
      )
    },
    {
      id: "educatif",
      nameFr: "Le domaine éducatif",
      descriptionFr: "Examen des méthodologies d'apprentissage du Français Langue Étrangère (FLE) en Égypte, rôle des universités bilingues et impact culturel des partenariats universitaires.",
      highlightsFr: ["Méthodologies FLE", "Partenariats Universitaires", "Échanges Éducatifs"],
      members: ["Mohamed Adel", "Merna Osama", "Shrouk Mostafa"],
      pdfPath: "/المجال التعليمي.pdf",
      icon: (
        <svg className="w-12 h-12 text-gold transition-all duration-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.263 10.185a.75.75 0 000 1.63l7.352 3.897a.75.75 0 00.77 0l7.352-3.897a.75.75 0 000-1.63L12.385 6.288a.75.75 0 00-.77 0L4.263 10.185z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 12.582V16.5a2 2 0 002 2h8a2 2 0 002-2v-3.918M20.25 11v5" />
        </svg>
      )
    },
    {
      id: "sport",
      nameFr: "Le domaine de sport",
      descriptionFr: "Analyse du sport comme vecteur universel d'intégration sociale et de diplomatie d'influence. Focus sur les événements bilatéraux franco-égyptiens et les valeurs olympiques.",
      highlightsFr: ["Diplomatie Sportive", "Valeurs Olympiques", "Événements Majeurs"],
      members: ["Mohamed Ebrahim", "Menna El Sayed", "Fatma El Sayed"],
      pdfPath: "/المجال الرياضي.pdf",
      icon: (
        <svg className="w-12 h-12 text-gold transition-all duration-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 15a4 4 0 004-4V5H8v6a4 4 0 004 4zm0 0v4m0 0H8m4 0h4m-8-8H4v2c0 2 1.5 3 3 3h1m10-5h4v2c0 2-1.5 3-3 3h-1" />
        </svg>
      )
    }
  ];

  return (
    <div className="flex-1 w-full relative min-h-screen bg-luxury-bg font-sans selection:bg-gold-dark/40 selection:text-white">
      {/* 1. SINGLE-PANE LIFTING SPLASH SCREEN */}
      {!isCurtainRemoved && (
        <div className={`fixed inset-0 z-50 bg-[#070709] transition-transform duration-[1600ms] ease-[cubic-bezier(0.77,0,0.175,1)] flex flex-col items-center justify-between overflow-hidden ${
          isOpening ? "-translate-y-full" : "translate-y-0"
        }`}>
          
          {/* Blurred Background Cover to fill different screen ratios */}
          <div 
            className="absolute inset-0 bg-cover bg-center blur-3xl opacity-20 scale-105 pointer-events-none"
            style={{ backgroundImage: "url('/header.jpeg')" }}
          />

          {/* Central Flex Content Wrapper */}
          <div className="absolute inset-0 flex flex-col justify-between items-center py-10 px-6 z-10">
            
            {/* Top Academic Title */}
            <div className="text-center">
              <p className="text-[10px] md:text-xs uppercase tracking-[0.25em] text-gold-light/85 font-inter font-semibold">
                Université de Mansoura • Faculté des Lettres
              </p>
            </div>

            {/* Centered Cover Image - Auto-scales responsively with ZERO cropping */}
            <div className="flex-1 flex items-center justify-center my-4 max-h-[65vh] md:max-h-[70vh] w-full max-w-3xl px-4">
              <img 
                src="/header.jpeg" 
                alt="Le Nil et La Seine - Cover" 
                className="max-w-full max-h-full object-contain shadow-[0_0_50px_rgba(0,0,0,0.9)] border border-gold-dark/20 rounded-none transition-transform duration-700 hover:scale-[1.01]"
              />
            </div>

            {/* Bottom Action Button */}
            <div className="flex flex-col items-center text-center max-w-xl w-full pb-4">
              <button
                onClick={triggerCurtainOpen}
                className="px-10 py-3.5 bg-gradient-to-r from-gold-dark via-gold to-gold-dark hover:from-gold hover:to-gold-light text-black font-semibold rounded-none tracking-widest uppercase text-xs transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-[0_4px_25px_rgba(197,168,128,0.4)] border border-gold-light/35 cursor-pointer"
              >
                Découvrir
              </button>
            </div>

          </div>
        </div>
      )}

      {/* 2. MAIN APP CONTENT */}
      <div className={`min-h-screen flex flex-col transition-opacity duration-1000 ${
        isOpening ? "opacity-100" : "opacity-0"
      }`}>
        
        {/* Navigation / Header */}
        <header className="w-full border-b border-gold-dark/15 py-5 px-6 md:px-12 flex justify-between items-center glass-panel sticky top-0 z-40">
          <div className="flex items-center gap-3">
            <svg className="w-8 h-8 text-gold" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M50 20 C50 35, 43 45, 30 48 C43 51, 47 65, 50 80 C53 65, 57 51, 70 48 C57 45, 50 35, 50 20 Z" />
            </svg>
            <div>
              <span className="font-cormorant font-bold text-xl md:text-2xl text-gold-light tracking-wide">
                Le Nil et La Seine
              </span>
              <span className="block text-[10px] text-zinc-500 uppercase tracking-widest">
                Faculté des lettres - Mansoura
              </span>
            </div>
          </div>
          

        </header>

        {/* Hero Section */}
        <section className="relative py-16 px-6 md:px-12 text-center overflow-hidden border-b border-gold-dark/10">
          <div className="max-w-4xl mx-auto z-10 relative">
            <span className="text-gold uppercase tracking-[0.3em] text-xs font-semibold block mb-3">
              Recherche & Traduction
            </span>
            <h2 className="text-4xl md:text-6xl font-cormorant font-bold italic text-gold-light mb-6 text-gold-shadow">
              Les Portails d&apos;Exploration
            </h2>
            <p className="text-zinc-400 max-w-2xl mx-auto text-sm md:text-base leading-relaxed">
              Explorez les six domaines de recherche rédigés et traduits par les étudiants de la Faculté des Lettres. 
              Cliquez sur chaque domaine pour découvrir les thématiques clés, les travaux de recherche et l&apos;équipe responsable.
            </p>
          </div>
          
          {/* Subtle light beam in the center background */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gold-dark/5 blur-[120px] rounded-full -z-10 pointer-events-none" />
        </section>

        {/* Main Content Area */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-6 md:px-12 py-16 flex flex-col gap-16">
          
          {/* 3. THE 6 DOMAIN BUTTONS GRID */}
          <section className="w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {domains.map((domain) => {
                const isHovered = hoveredDomain === domain.id;
                return (
                  <button
                    key={domain.id}
                    onClick={() => setActiveDomain(domain)}
                    onMouseEnter={() => setHoveredDomain(domain.id)}
                    onMouseLeave={() => setHoveredDomain(null)}
                    className={`glass-panel p-8 rounded-none text-left relative overflow-hidden transition-all duration-500 cursor-pointer text-gold-shadow group flex flex-col justify-between min-h-[220px] ${
                      isHovered 
                        ? "border-gold/50 shadow-[0_8px_30px_rgba(197,168,128,0.15)] -translate-y-1" 
                        : "border-gold-dark/10"
                    }`}
                  >
                    {/* Background Radial Glow on Hover */}
                    <div className={`absolute -right-20 -top-20 w-44 h-44 rounded-full bg-gold-dark/5 blur-3xl transition-opacity duration-500 pointer-events-none ${
                      isHovered ? "opacity-100" : "opacity-0"
                    }`} />
                    
                    {/* Icon container */}
                    <div className="mb-6 p-3 w-16 h-16 bg-luxury-bg border border-gold-dark/20 flex items-center justify-center transition-all duration-500 group-hover:border-gold/60 group-hover:shadow-[0_0_15px_rgba(197,168,128,0.2)]">
                      {domain.icon}
                    </div>

                    <div>
                      {/* Subtitle / French Category titles */}
                      <span className="text-[10px] uppercase tracking-widest text-zinc-500 block mb-1">
                        Département de Français
                      </span>
                      <h4 className="text-2xl font-cormorant font-bold italic text-gold-light group-hover:text-gold transition-colors duration-300">
                        {domain.nameFr}
                      </h4>
                    </div>

                    {/* Interactive read arrow */}
                    <div className="mt-8 pt-4 border-t border-zinc-900/60 flex justify-between items-center text-xs text-gold uppercase tracking-widest">
                      <span>Explorer</span>
                      <svg className="w-5 h-5 text-gold transform translate-x-0 group-hover:translate-x-1.5 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </div>
                  </button>
                );
              })}
            </div>
          </section>

          {/* 4. BOTTOM SECTION LAYOUT (TWO DYNAMIC BUTTONS) */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
            
            {/* Left Button: Concept & Objectif */}
            <button
              onClick={() => setActiveDomain({
                id: "concept",
                nameFr: "Concept & Objectif du Magazine",
                descriptionFr: "Le Nil et La Seine est un projet éditorial d'excellence conçu par les étudiants du département de français. Il fait office de pont culturel et intellectuel reliant l'Égypte et la France à travers l'étude approfondie de six domaines essentiels de la vie moderne.",
                highlightsFr: ["Pont Culturel", "Bilinguisme Universitaire", "Recherche & Traduction"],
                members: [],
                pdfPath: "/المقدمة.pdf",
                icon: null
              })}
              className="glass-panel p-8 text-left relative overflow-hidden border-gold-dark/15 hover:border-gold/50 shadow-sm hover:shadow-[0_8px_30px_rgba(197,168,128,0.15)] transition-all duration-500 cursor-pointer group min-h-[160px] flex flex-col justify-between"
            >
              <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-gold-dark/30" />
              <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-gold-dark/30" />
              <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-gold-dark/30" />
              <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-gold-dark/30" />
              
              <div>
                <span className="text-gold text-[10px] uppercase tracking-[0.25em] font-semibold block mb-1">
                  Présentation du Projet
                </span>
                <h3 className="text-2xl font-cormorant font-bold italic text-gold-light group-hover:text-gold transition-colors duration-300">
                  Concept & Objectif du Magazine
                </h3>
                <p className="text-zinc-400 text-xs mt-2 font-light leading-relaxed">
                  Découvrez la vision éditoriale et la coopération scientifique et littéraire unissant l&apos;Égypte et la France.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-zinc-900/40 flex justify-between items-center text-xs text-gold uppercase tracking-widest">
                <span>Consulter / Ouvrir PDF</span>
                <svg className="w-5 h-5 text-gold transform translate-x-0 group-hover:translate-x-1.5 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
            </button>

            {/* Right Button: Les Équipes Responsables */}
            <button
              onClick={() => setActiveDomain({
                id: "teams",
                nameFr: "Les Équipes Responsables",
                descriptionFr: "Les équipes d'étudiants de la Faculté des Lettres ayant collaboré à la rédaction et à la traduction des six domaines scientifiques de ce magazine.",
                highlightsFr: ["Membres du Projet", "Groupes de Travail", "Promotion 2026"],
                members: [],
                pdfPath: "/عمل الطلاب.pdf",
                icon: null
              })}
              className="glass-panel p-8 text-left relative overflow-hidden border-gold-dark/15 hover:border-gold/50 shadow-sm hover:shadow-[0_8px_30px_rgba(197,168,128,0.15)] transition-all duration-500 cursor-pointer group min-h-[160px] flex flex-col justify-between"
            >
              <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-gold-dark/30" />
              <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-gold-dark/30" />
              <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-gold-dark/30" />
              <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-gold-dark/30" />
              
              <div>
                <span className="text-gold text-[10px] uppercase tracking-[0.25em] font-semibold block mb-1">
                  Membres et Groupes
                </span>
                <h3 className="text-2xl font-cormorant font-bold italic text-gold-light group-hover:text-gold transition-colors duration-300">
                  Les Équipes Responsables
                </h3>
                <p className="text-zinc-400 text-xs mt-2 font-light leading-relaxed">
                  Consultez la liste complète des étudiants et des groupes responsables des travaux de recherche par domaine.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-zinc-900/40 flex justify-between items-center text-xs text-gold uppercase tracking-widest">
                <span>Consulter / Ouvrir PDF</span>
                <svg className="w-5 h-5 text-gold transform translate-x-0 group-hover:translate-x-1.5 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
            </button>

          </section>
        </main>



        {/* 6. IMMERSIVE DOMAIN DETAIL MODAL */}
        {activeDomain && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md transition-opacity duration-300">
            <div 
              onClick={() => setActiveDomain(null)}
              className="absolute inset-0 cursor-zoom-out"
            />
            
            <div className="glass-panel w-full max-w-6xl max-h-[95vh] overflow-hidden rounded-none border-gold/30 shadow-[0_15px_50px_rgba(0,0,0,0.8)] relative z-10 flex flex-col transform scale-100 transition-all duration-300">
              
              {/* Corner decorative accents */}
              <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-gold z-20 pointer-events-none" />
              <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-gold z-20 pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-gold z-20 pointer-events-none" />
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-gold z-20 pointer-events-none" />

              {/* Scrollable Container */}
              <div className="flex-1 overflow-y-auto p-6 md:p-10 flex flex-col gap-6 relative">

                {/* Close Button */}
                <button
                  onClick={() => setActiveDomain(null)}
                  className="absolute top-6 right-6 p-2 text-zinc-400 hover:text-gold transition-colors duration-300 cursor-pointer"
                  aria-label="Fermer"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>

                {/* Header Title */}
                <div className="text-left pr-8">
                  <span className="text-gold text-[10px] uppercase tracking-[0.3em] font-semibold block mb-1">
                    Projet de Fin d&apos;Études
                  </span>
                  <h2 className="text-3xl md:text-4xl font-cormorant font-bold italic text-gold-light">
                    {activeDomain.nameFr}
                  </h2>
                </div>

                <div className="w-full h-[1px] bg-gradient-to-r from-gold via-gold-dark/25 to-transparent" />

                {/* Content Grid: PDF on left, details on right */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
                  
                  {/* Left PDF column */}
                  <div className="lg:col-span-7 flex flex-col gap-3">
                    <div className="flex justify-between items-center">
                      <h4 className="text-xs uppercase tracking-wider text-zinc-500 font-semibold">
                        Document de Recherche PDF
                      </h4>
                      <a 
                        href={encodeURI(activeDomain.pdfPath)} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-xs text-gold hover:text-gold-light underline flex items-center gap-1 transition-colors"
                      >
                        Ouvrir plein écran ↗
                      </a>
                    </div>
                    
                    <PdfViewer pdfPath={activeDomain.pdfPath} title={activeDomain.nameFr} />
                  </div>

                  {/* Right Metadata column */}
                  <div className="lg:col-span-5 flex flex-col justify-between gap-6">
                    {activeDomain.id === "teams" ? (
                      <div className="flex flex-col gap-5">
                        <div>
                          <h4 className="text-xs uppercase tracking-wider text-zinc-500 font-semibold mb-3">
                            Les Équipes par Domaine
                          </h4>
                          <div className="flex flex-col gap-3 max-h-[350px] overflow-y-auto pr-1">
                            {domains.map((d) => (
                              <div key={d.id} className="p-3 bg-black/30 border border-gold-dark/10 flex flex-col gap-1">
                                <span className="text-xs text-gold font-semibold uppercase tracking-wider font-cormorant">
                                  {d.nameFr.replace("Le domaine ", "")}
                                </span>
                                <p className="text-xs text-zinc-300 font-light leading-relaxed">
                                  {d.members.join(" — ")}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ) : activeDomain.id === "concept" ? (
                      <div className="flex flex-col gap-5">
                        <div>
                          <h4 className="text-xs uppercase tracking-wider text-zinc-500 font-semibold mb-2">
                            Concept & Objectif
                          </h4>
                          <div className="text-zinc-300 text-xs md:text-sm font-light leading-relaxed text-justify flex flex-col gap-3 max-h-[350px] overflow-y-auto pr-1">
                            <p>
                              <strong>Le Nil et La Seine</strong> est un projet éditorial d&apos;excellence conçu par les étudiants du département de français. Il fait office de pont culturel et intellectuel reliant l&apos;Égypte et la France à travers l&apos;étude approfondie de six domaines essentiels de la vie moderne.
                            </p>
                            <p>
                              Ce travail illustre le niveau académique exceptionnel des étudiants, conciliant de rigoureuses recherches méthodologiques, la synthèse documentaire et une traduction pointue des textes académiques. L&apos;objectif ultime est de mettre en lumière la synergie franco-égyptienne historique et de valoriser le bilinguisme universitaire.
                            </p>
                            <p>
                              En mobilisant leurs connaissances avancées en langue française et en techniques de recherche scientifique, les diplômés apporte une contribution significative à la compréhension mutuelle des enjeux sociopolitiques, économiques et culturels contemporains.
                            </p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-5">
                        <div>
                          <h4 className="text-xs uppercase tracking-wider text-zinc-500 font-semibold mb-2">
                            Description & Contexte
                          </h4>
                          <p className="text-zinc-300 font-light leading-relaxed text-justify text-sm md:text-base">
                            {activeDomain.descriptionFr}
                          </p>
                        </div>

                        <div>
                          <h4 className="text-xs uppercase tracking-wider text-zinc-500 font-semibold mb-2">
                            Points Clés
                          </h4>
                          <ul className="flex flex-wrap gap-2">
                            {activeDomain.highlightsFr.map((hl, index) => (
                              <li 
                                key={index}
                                className="px-3 py-1 bg-gold-dark/10 border border-gold-dark/30 text-xs text-gold-light"
                              >
                                {hl}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}

                    {/* Bottom section of the right column (supervision or members) */}
                    <div className="flex flex-col gap-4">
                      <div className="w-full h-[1px] bg-zinc-900" />
                      
                      {activeDomain.id === "concept" || activeDomain.id === "teams" ? (
                        <div className="flex flex-col gap-1.5">
                          <h4 className="text-[10px] uppercase tracking-widest text-zinc-500 font-semibold">
                            Supervision Académique
                          </h4>
                          <p className="text-xs text-gold-light italic font-cormorant">
                            Sous la direction de : Dr. Héba EL Zomor & Dr. Mai Tarek
                          </p>
                          <p className="text-xs text-gold-light italic font-cormorant">
                            Directeur exécutif : Dr. Chaymaa Lachine
                          </p>
                        </div>
                      ) : (
                        <>
                          <h4 className="text-[10px] uppercase tracking-widest text-zinc-500 font-semibold">
                            Équipe de Recherche
                          </h4>
                          
                          <div className="flex flex-col gap-2">
                            {activeDomain.members.map((member, idx) => (
                              <div 
                                key={idx}
                                className="px-3 py-2 bg-black/30 border border-gold-dark/10 text-sm text-zinc-300 font-medium tracking-wide flex items-center gap-2"
                              >
                                <span className="w-6 h-6 rounded-full bg-gold-dark text-black text-[10px] font-bold flex items-center justify-center shrink-0">
                                  {member.split(" ").map(w => w[0]).join("")}
                                </span>
                                <span>{member}</span>
                              </div>
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                </div>

                {/* Footer action */}
                <div className="flex justify-end mt-2 border-t border-zinc-900 pt-4">
                  <button
                    onClick={() => setActiveDomain(null)}
                    className="px-6 py-2 border border-gold text-gold hover:bg-gold hover:text-black text-xs font-semibold tracking-widest uppercase transition-all duration-300 cursor-pointer"
                  >
                    Fermer
                  </button>
                </div>

              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
