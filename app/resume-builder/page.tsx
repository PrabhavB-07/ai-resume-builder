"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import {
  onAuthStateChanged,
  signOut
} from "firebase/auth";

import { auth } from "../firebase";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc
} from "firebase/firestore";
import jsPDF from "jspdf";

// ── Types for Structured States ──
interface EduItem {
  degree: string;
  school: string;
  grade: string;
  year: string;
}

interface ExpItem {
  company: string;
  role: string;
  duration: string;
  location: string;
  description: string; // Newline separated points
}

interface ProjItem {
  name: string;
  tech: string;
  link: string;
  description: string; // Newline separated points
}

interface SkillCategory {
  category: string;
  items: string; // Comma separated
}

interface Certification {
  name: string;
  year: string;
}

// ── Template Metadata (10 Professional ATS-Friendly Styles) ──
const TEMPLATES = [
  { 
    id: "t1", 
    name: "Classic Academic (Prashant)", 
    desc: "Standard single column, serif, right-aligned dates. Standard format for academic and institutional resumes.", 
    rating: "⭐⭐⭐⭐⭐", 
    score: "98% ATS Compatibility",
    type: "Single-Column Serif"
  },
  { 
    id: "t2", 
    name: "Modern Minimalist (Elena)", 
    desc: "Left-aligned bold headers, subtle dividing lines, clean sans-serif. Highly readable and professional.", 
    rating: "⭐⭐⭐⭐⭐", 
    score: "95% ATS Compatibility",
    type: "Single-Column Sans-Serif"
  },
  { 
    id: "t3", 
    name: "Centered Elegance (Akshay)", 
    desc: "Centered title header, italic subtitles, clean spacing and classic serif fonts.", 
    rating: "⭐⭐⭐⭐", 
    score: "92% ATS Compatibility",
    type: "Centered Serif"
  },
  { 
    id: "t4", 
    name: "Two-Column Sidebar (Sukumar)", 
    desc: "Sleek left sidebar for contact details and skills, main body for experience and projects.", 
    rating: "⭐⭐⭐⭐", 
    score: "85% ATS Compatibility",
    type: "Two-Column Split"
  },
  { 
    id: "t5", 
    name: "Technical Strengths (Sunil)", 
    desc: "Structured borderless grid table for skills, high density text. Perfect for programmers.", 
    rating: "⭐⭐⭐⭐⭐", 
    score: "96% ATS Compatibility",
    type: "High-Density Table Grid"
  },
  { 
    id: "t6", 
    name: "Executive Shaded (Yashi)", 
    desc: "Light gray filled blocks for section headings, neat box formatting. Ideal for corporate roles.", 
    rating: "⭐⭐⭐⭐", 
    score: "93% ATS Compatibility",
    type: "Shaded Header Block"
  },
  { 
    id: "t7", 
    name: "Ivy League Standard (Harvard)", 
    desc: "Times New Roman formatting, strict black and white, zero icons. The absolute gold standard for ATS parses.", 
    rating: "⭐⭐⭐⭐⭐", 
    score: "100% ATS Compatibility",
    type: "Traditional ATS"
  },
  { 
    id: "t8", 
    name: "Emerald Border Accent", 
    desc: "Modern corporate template with a sharp green/teal left highlight stripe on section headers.", 
    rating: "⭐⭐⭐⭐", 
    score: "94% ATS Compatibility",
    type: "Modern Accent Style"
  },
  { 
    id: "t9", 
    name: "Compact Developer", 
    desc: "Monospace coding feel, high density, tight spacing. Fits maximum data in minimum space.", 
    rating: "⭐⭐⭐⭐⭐", 
    score: "97% ATS Compatibility",
    type: "High-Density Coding"
  },
  { 
    id: "t10", 
    name: "Creative Sidebar Modern", 
    desc: "Dark accent left-hand column highlighting profile and skills, white right-hand column for core content.", 
    rating: "⭐⭐⭐⭐", 
    score: "88% ATS Compatibility",
    type: "Dark Sidebar Creative"
  },
];


        
export default function ResumeBuilderPage() {

   const handleLogout = async () => {

  await signOut(auth);

  router.push("/login");
};
const analyzeResume = async () => {

  try {

    const response = await fetch(
      "/api/analyze-resume",
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          name,
          skills,
          summary,
          experience,
          projects,
        }),
      }
    );

    const data = await response.json();

    setResumeAnalysis(data.result);

    console.log("Resume Analyzed ");

  } catch (error) {

    console.log(error);
  }
};

const handleSaveResume = async () => {

  try {

    console.log("SAVE BUTTON CLICKED ");

    const user = auth.currentUser;

    if (!user) {

      alert("Please login first 😭");

      return;
    }

    await setDoc(
      doc(db, "resumes", user.uid),
      {
        name,
        email,
        phone,
        location,
        linkedin,
        github,
        portfolio,
        summary,
        
        updatedAt: new Date(),
      }
    );

    alert("Resume Saved Successfully ");

  } catch (error) {

    console.log(error);

    alert("Failed To Save Resume ");
  }
};
    const router = useRouter();
    const db = getFirestore();

useEffect(() => {

  const unsubscribe = onAuthStateChanged(
    auth,
    (user) => {

      if (!user) {

        router.push("/login");
      }
    }
  );

  return () => unsubscribe();

}, [router]);
useEffect(() => {

  const loadResume = async () => {

    const user = auth.currentUser;

    if (!user) return;

    const docRef = doc(db, "resumes", user.uid);

    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {

      const data = docSnap.data();

      setName(data.name || "");
      setEmail(data.email || "");
      setPhone(data.phone || "");
      setLocation(data.location || "");
      setLinkedin(data.linkedin || "");
      setGithub(data.github || "");
      setPortfolio(data.portfolio || "");
      setSummary(data.summary || "");

      console.log("Resume Loaded ");
    }
  };

  loadResume();

}, []);
  const [name, setName]           = useState("");
  const [phone, setPhone]         = useState("");
  const [skills, setSkills]       = useState("");
  const [experience, setExperience] = useState("");
  const [projects, setProjects] = useState("");
  const [education, setEducation] = useState("");

const [certifications, setCertifications] = useState("");
  const [email, setEmail]         = useState("");
  const [linkedin, setLinkedin]   = useState("");
  const [github, setGithub]       = useState("");
  const [location, setLocation]   = useState("");
  const [portfolio, setPortfolio] = useState("");
  const [summary, setSummary]     = useState("");
  const [resumeAnalysis, setResumeAnalysis] = useState("");
  const [template, setTemplate]   = useState("t1");
  const [darkMode, setDarkMode]   = useState(true);
  const [activeTab, setActiveTab] = useState("personal");
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading]     = useState(false);

  // ── Fresher vs Professional Dynamic Controls ──
  const [expHeading, setExpHeading] = useState("Work Experience");
  const [showExperience, setShowExperience] = useState(true);

  // ── Structured Lists States ──
  const [educationList, setEducationList] = useState<EduItem[]>([]);
  const [experienceList, setExperienceList] = useState<ExpItem[]>([]);
  const [projectList, setProjectList]     = useState<ProjItem[]>([]);
  const [skillsList, setSkillsList]       = useState<SkillCategory[]>([]);
  const [certificationsList, setCertificationsList] = useState<Certification[]>([]);

  // Load from localstorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("resume_v2");
    if (saved) {
      try {
        const data = JSON.parse(saved);
        setName(data.name || "");
        setPhone(data.phone || "");
        setEmail(data.email || "");
        setLinkedin(data.linkedin || "");
        setGithub(data.github || "");
        setLocation(data.location || "");
        setPortfolio(data.portfolio || "");
        setSummary(data.summary || "");
        setTemplate(data.template || "t1");
        setExpHeading(data.expHeading || "Work Experience");
        setShowExperience(data.showExperience !== undefined ? data.showExperience : true);
        setEducationList(data.educationList || []);
        setExperienceList(data.experienceList || []);
        setProjectList(data.projectList || []);
        setSkillsList(data.skillsList || []);
        setCertificationsList(data.certificationsList || []);
      } catch (e) {
        console.error("Error loading resume v2 data", e);
      }
    } else {
      // Set some initial premium demo data
      setName("Vikram Aditya");
      setPhone("+91 98765 43210");
      setEmail("vikram.aditya@email.com");
      setLinkedin("linkedin.com/in/vikramaditya");
      setGithub("github.com/vikramaditya");
      setLocation("New Delhi, India");
      setPortfolio("vikramaditya.dev");
      setSummary("Result-oriented Software Engineer with 2+ years of experience designing scalable web applications. Expert in React, Next.js, and Node.js with a proven track record of optimization and clean code principles.");
      
      setEducationList([
        { degree: "B.Tech Computer Science", school: "Delhi Technological University", grade: "GPA: 9.1 / 10.0", year: "2020 - 2024" },
        { degree: "Senior Secondary Education", school: "DAV Public School", grade: "Marks: 95%", year: "2018 - 2020" }
      ]);
      
      setSkillsList([
        { category: "Languages", items: "JavaScript, TypeScript, Python, C++, SQL" },
        { category: "Frameworks & Libs", items: "React.js, Next.js, Express, Node.js, Tailwind CSS" },
        { category: "Databases & Tools", items: "Git, Docker, AWS, MongoDB, PostgreSQL, Redis" }
      ]);

      setProjectList([
        { 
          name: "AI Resume Builder", 
          tech: "Next.js, jsPDF, Tailwind CSS", 
          link: "github.com/vikram/ai-resume", 
          description: "Developed a real-time resume parser and visual template selector using Next.js.\nIntegrated LLM APIs to generate dynamic summaries, boosting user engagement by 40%."
        },
        { 
          name: "E-Commerce Microservices", 
          tech: "Node.js, RabbitMQ, Docker, AWS", 
          link: "github.com/vikram/micro-shop", 
          description: "Built an event-driven catalog service using RabbitMQ and Node.js.\nDeployed on AWS ECS with Docker, reducing application response time by 25%."
        }
      ]);

      setExperienceList([
        { 
          company: "Tech Solutions Corp", 
          role: "Software Engineer Intern", 
          duration: "June - Dec 2023", 
          location: "Bangalore, India", 
          description: "Led development of client-facing analytics dashboard using Chart.js and Next.js.\nOptimized database queries, resulting in a 30% reduction in dashboard load times."
        },
        { 
          company: "React Ecosystem", 
          role: "Open Source Contributor", 
          duration: "Jan 2023 - Present", 
          location: "Remote", 
          description: "Fixed performance bottlenecks in standard rendering engines.\nAuthored comprehensive integration tests and user guides."
        }
      ]);

      setCertificationsList([
        { name: "AWS Certified Developer Associate", year: "2024" },
        { name: "Google UX Design Professional Certificate", year: "2023" }
      ]);
    }
  }, []);

  const saveResume = () => {
    localStorage.setItem(
      "resume_v2",
      JSON.stringify({ 
        name, phone, email, linkedin, github, location, portfolio, summary, template,
        expHeading, showExperience, educationList, experienceList, projectList, skillsList, certificationsList
      })
    );
    alert("Resume Saved Successfully! ✅");
  };

  const generateSummary = async () => {
    setLoading(true);
    try {
      const skillsConcat = skillsList.map(s => `${s.category}: ${s.items}`).join("\n");
      const expConcat = experienceList.map(e => `${e.company} | ${e.role}`).join("\n");
      
      const res = await fetch("/api/generate-summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ skills: skillsConcat, experience: expConcat }),
      });
      const data = await res.json();
      if (data.summary) {
        setSummary(data.summary);
      } else {
        setSummary(`Software Developer skilled in ${skillsList[0]?.items || "modern web technologies"}. Experienced in projects such as ${projectList[0]?.name || "scalable web apps"}. Detail-oriented professional with hands-on experience at ${experienceList[0]?.company || "top companies"}.`);
      }
    } catch (e) {
      setSummary(`Software Developer skilled in ${skillsList[0]?.items || "modern web technologies"}. Experienced in projects such as ${projectList[0]?.name || "scalable web apps"}. Detail-oriented professional with hands-on experience at ${experienceList[0]?.company || "top companies"}.`);
    } finally {
      setLoading(false);
    }
  };

  const getContactFields = () => [
    phone ? `📞 ${phone}` : null,
    email ? `✉️ ${email}` : null,
    location ? `📍 ${location}` : null,
    linkedin ? `🔗 ${linkedin}` : null,
    github ? `🐙 ${github}` : null,
    portfolio ? `🌐 ${portfolio}` : null,
  ].filter(Boolean);

  const getCleanContactText = () => [
    phone, email, location, 
    linkedin ? linkedin.replace(/https?:\/\/(www\.)?/, "") : null,
    github ? github.replace(/https?:\/\/(www\.)?/, "") : null,
    portfolio ? portfolio.replace(/https?:\/\/(www\.)?/, "") : null
  ].filter(Boolean).join("  •  ");

  // ── DYNAMIC PDF GENERATOR ENGINE (ATS COMPLIANT) ──
  const downloadPDF = () => {
    const doc = new jsPDF("p", "mm", "a4");
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 15;
    const contentWidth = pageWidth - 2 * margin;
    let y = 15;

    // ── AUTOMATED DYNAMIC SPACING MATHEMATICS ──
    const filledSectionsCount = [
      summary ? 1 : 0,
      (showExperience && experienceList.length > 0) ? 1 : 0,
      projectList.length > 0 ? 1 : 0,
      skillsList.length > 0 ? 1 : 0,
      educationList.length > 0 ? 1 : 0,
      certificationsList.length > 0 ? 1 : 0
    ].reduce((total, count) => total + count, 0);

    const isSparseContent = filledSectionsCount <= 4;
    const sectionSpacing = isSparseContent ? 9 : 5;  // Space after a block section ends
    const internalItemSpacing = isSparseContent ? 6 : 4.5; // Space between internal lists
    const textLineHeight = template === "t9" ? 4 : (isSparseContent ? 4.8 : 4.1); // Font leading height

    const checkPageOverflow = (heightNeeded: number) => {
      if (y + heightNeeded > pageHeight - 15) {
        doc.addPage();
        y = 15;
        return true;
      }
      return false;
    };

    const drawDivider = (style: string) => {
      if (["t1", "t3", "t4", "t7"].includes(style)) {
        doc.setLineWidth(0.2);
        doc.setDrawColor(0, 0, 0);
        doc.line(margin, y, pageWidth - margin, y);
        y += 4;
      } else if (["t2", "t5"].includes(style)) {
        doc.setLineWidth(0.3);
        doc.setDrawColor(180, 180, 180);
        doc.line(margin, y, pageWidth - margin, y);
        y += 4;
      } else if (style === "t8") {
        doc.setLineWidth(0.5);
        doc.setDrawColor(16, 185, 129);
        doc.line(margin, y, pageWidth - margin, y);
        y += 4;
      } else if (style === "t9") {
        doc.setLineWidth(0.1);
        doc.setDrawColor(100, 100, 100);
        doc.line(margin, y, pageWidth - margin, y);
        y += 3;
      }
    };

    const setFontFamily = (bold: boolean, italic: boolean = false) => {
      const isSerif = ["t1", "t3", "t4", "t7"].includes(template);
      const isMono = template === "t9";
      const font = isSerif ? "times" : (isMono ? "courier" : "helvetica");
      let type = "normal";
      if (bold && italic) type = "bolditalic";
      else if (bold) type = "bold";
      else if (italic) type = "italic";
      doc.setFont(font, type);
    };

    const renderSectionHeader = (title: string) => {
      checkPageOverflow(12);
      y += 2;
      
      if (template === "t6") {
        doc.setFillColor(230, 230, 230);
        doc.rect(margin, y, contentWidth, 6, "F");
        doc.setTextColor(0, 0, 0);
        setFontFamily(true);
        doc.setFontSize(10);
        doc.text(title.toUpperCase(), margin + 2, y + 4.5);
        y += 9;
      } else if (template === "t8") {
        doc.setFillColor(16, 185, 129);
        doc.rect(margin, y, 3, 5, "F");
        doc.setTextColor(0, 0, 0);
        setFontFamily(true);
        doc.setFontSize(11);
        doc.text(title.toUpperCase(), margin + 5, y + 4);
        y += 7;
      } else {
        doc.setTextColor(0, 0, 0);
        setFontFamily(true);
        doc.setFontSize(template === "t9" ? 9 : 10.5);
        const displayText = ["t1", "t3", "t4", "t7", "t5"].includes(template) ? title.toUpperCase() : title;
        doc.text(displayText, margin, y + 3);
        y += 4;
        drawDivider(template);
        if (isSparseContent) y += 1.5;
      }
    };

    const drawTextBlock = (text: string, fontSize: number, leading: number = 4) => {
      setFontFamily(false);
      doc.setFontSize(fontSize);
      doc.setTextColor(50, 50, 50);
      const wrappedLines = doc.splitTextToSize(text, contentWidth);
      wrappedLines.forEach((line: string) => {
        checkPageOverflow(leading);
        doc.text(line, margin, y);
        y += leading;
      });
      y += 1.5;
    };

    const drawBulletPointsList = (rawPoints: string, fontSize: number, leading: number = 4) => {
      const items = rawPoints.split("\n").filter(Boolean);
      items.forEach((item) => {
        const cleanText = item.replace(/^[•–-]\s*/, "");
        setFontFamily(false);
        doc.setFontSize(fontSize);
        doc.setTextColor(60, 60, 60);

        const bulletWidth = contentWidth - 4;
        const wrapped = doc.splitTextToSize(cleanText, bulletWidth);

        wrapped.forEach((wl: string, index: number) => {
          checkPageOverflow(leading);
          if (index === 0) {
            doc.text("•", margin, y);
            doc.text(wl, margin + 4, y);
          } else {
            doc.text(wl, margin + 4, y);
          }
          y += leading;
        });
      });
      y += 1;
    };

    const isCentered = ["t1", "t3", "t7", "t5"].includes(template);
    
    // Name Layout
    setFontFamily(true);
    doc.setFontSize(template === "t9" ? 15 : 18);
    doc.setTextColor(0, 0, 0);
    
    if (isCentered) {
      doc.text(name.toUpperCase() || "YOUR NAME", pageWidth / 2, y, { align: "center" });
      y += template === "t9" ? 5 : 6.5;
    } else {
      doc.text(name || "Your Name", margin, y);
      y += template === "t9" ? 5 : 6.5;
    }

    // Contact Header
    setFontFamily(false);
    doc.setFontSize(template === "t9" ? 8 : 9);
    doc.setTextColor(80, 80, 80);

    const contactStr = getCleanContactText();

    if (isCentered) {
      const wrappedContact = doc.splitTextToSize(contactStr, contentWidth);
      wrappedContact.forEach((cLine: string) => {
        doc.text(cLine, pageWidth / 2, y, { align: "center" });
        y += 4;
      });
    } else {
      const wrappedContact = doc.splitTextToSize(contactStr, contentWidth);
      wrappedContact.forEach((cLine: string) => {
        doc.text(cLine, margin, y);
        y += 4;
      });
    }
    
    y += 2;
    drawDivider(template);
    if (isSparseContent) y += 3;

    const textFontSize = template === "t9" ? 8.5 : 9.5;
    const bodyFontSize = template === "t9" ? 8 : 9;

    // 1. Summary
    if (summary) {
      renderSectionHeader("Professional Summary");
      drawTextBlock(summary, bodyFontSize, textLineHeight);
      y += sectionSpacing;
    }

    // 2. Experience / Internships Section (Dynamic for Freshers)
    if (showExperience && experienceList.length > 0) {
      renderSectionHeader(expHeading); 
      experienceList.forEach((exp) => {
        checkPageOverflow(14);
        
        setFontFamily(true);
        doc.setFontSize(textFontSize);
        doc.setTextColor(0, 0, 0);
        doc.text(`${exp.role} | ${exp.company}`, margin, y);
        
        setFontFamily(false, true);
        doc.setFontSize(bodyFontSize);
        doc.setTextColor(80, 80, 80);
        doc.text(exp.duration, pageWidth - margin, y, { align: "right" });
        y += 4;

        setFontFamily(false);
        doc.setFontSize(bodyFontSize - 0.5);
        doc.setTextColor(100, 100, 100);
        doc.text(exp.location, margin, y);
        y += 4.5;

        drawBulletPointsList(exp.description, bodyFontSize, textLineHeight);
        y += internalItemSpacing;
      });
      y += sectionSpacing;
    }

    // 3. Projects
    if (projectList.length > 0) {
      renderSectionHeader("Projects");
      projectList.forEach((proj) => {
        checkPageOverflow(12);

        setFontFamily(true);
        doc.setFontSize(textFontSize);
        doc.setTextColor(0, 0, 0);
        const nameAndTech = proj.tech ? `${proj.name} [${proj.tech}]` : proj.name;
        doc.text(nameAndTech, margin, y);

        setFontFamily(false, true);
        doc.setFontSize(bodyFontSize);
        doc.setTextColor(80, 80, 80);
        doc.text(proj.link || "", pageWidth - margin, y, { align: "right" });
        y += 4.5;

        drawBulletPointsList(proj.description, bodyFontSize, textLineHeight);
        y += internalItemSpacing;
      });
      y += sectionSpacing;
    }

    // 4. Skills
    if (skillsList.length > 0) {
      renderSectionHeader("Technical Skills");
      
      if (template === "t5") {
        skillsList.forEach((skill) => {
          checkPageOverflow(6);
          setFontFamily(true);
          doc.setFontSize(bodyFontSize);
          doc.setTextColor(0, 0, 0);
          doc.text(skill.category + ":", margin, y);
          
          setFontFamily(false);
          doc.setFontSize(bodyFontSize);
          doc.setTextColor(60, 60, 60);
          doc.text(skill.items, margin + 40, y);
          y += internalItemSpacing + 0.5;
        });
      } else {
        skillsList.forEach((skill) => {
          checkPageOverflow(5);
          setFontFamily(true);
          doc.setFontSize(bodyFontSize);
          doc.setTextColor(0, 0, 0);
          
          const label = skill.category + ": ";
          doc.text(label, margin, y);
          
          const labelWidth = doc.getTextWidth(label);
          setFontFamily(false);
          doc.setTextColor(60, 60, 60);
          doc.text(skill.items, margin + labelWidth, y);
          y += internalItemSpacing;
        });
      }
      y += sectionSpacing;
    }

    // 5. Education
    if (educationList.length > 0) {
      renderSectionHeader("Education");
      educationList.forEach((edu) => {
        checkPageOverflow(10);
        
        setFontFamily(true);
        doc.setFontSize(textFontSize);
        doc.setTextColor(0, 0, 0);
        doc.text(edu.degree, margin, y);

        setFontFamily(false, true);
        doc.setFontSize(bodyFontSize);
        doc.setTextColor(80, 80, 80);
        doc.text(edu.year, pageWidth - margin, y, { align: "right" });
        y += 4.5;

        setFontFamily(false);
        doc.setFontSize(bodyFontSize);
        doc.setTextColor(70, 70, 70);
        doc.text(`${edu.school} | ${edu.grade}`, margin, y);
        y += internalItemSpacing + 1.5;
      });
      y += sectionSpacing;
    }

    // 6. Certifications
    if (certificationsList.length > 0) {
      renderSectionHeader("Certifications & Awards");
      certificationsList.forEach((cert) => {
        checkPageOverflow(5);
        setFontFamily(false);
        doc.setFontSize(bodyFontSize);
        doc.setTextColor(60, 60, 60);
        doc.text(`• ${cert.name}`, margin, y);

        if (cert.year) {
          setFontFamily(false, true);
          doc.text(cert.year, pageWidth - margin, y, { align: "right" });
        }
        y += internalItemSpacing;
      });
    }

    const safeName = (name || "resume").toLowerCase().replace(/\s+/g, "_");
    doc.save(`${safeName}_ats_resume.pdf`);
  };

  // ── SHARED REUSABLE COMPONENTS FOR LIVE PREVIEW CODES ──
  const SharedTemplateSections = ({ isSerif = false, bulletType = "disc", textClass = "text-gray-700" }) => (
    <>
      {showExperience && experienceList.length > 0 && (
        <div className="mt-3">
          <h3 className={`font-bold border-b pb-0.5 uppercase mb-2 ${template === 't8' ? 'text-emerald-800 border-emerald-500' : 'text-gray-900 border-black'}`}>
            {expHeading}
          </h3>
          {experienceList.map((exp, idx) => (
            <div key={idx} className="mb-2">
              <div className="font-bold flex justify-between text-[10.5px]">
                <span>{exp.role} | {exp.company}</span>
                <span className="font-normal italic text-gray-500">{exp.duration}</span>
              </div>
              <p className="text-[9.5px] text-gray-400 italic mb-0.5">{exp.location}</p>
              {exp.description.split("\n").filter(Boolean).map((pt, i) => (
                bulletType === "disc" ? 
                  <li key={i} className={`ml-4 text-[9.5px] list-disc ${textClass}`}>{pt.replace(/^[•–-]\s*/, "")}</li> :
                  <p key={i} className={`ml-3 text-[9.5px] ${textClass}`}>• {pt.replace(/^[•–-]\s*/, "")}</p>
              ))}
            </div>
          ))}
        </div>
      )}

      {projectList.length > 0 && (
        <div className="mt-3">
          <h3 className={`font-bold border-b pb-0.5 uppercase mb-2 ${template === 't8' ? 'text-emerald-800 border-emerald-500' : 'text-gray-900 border-black'}`}>Projects</h3>
          {projectList.map((proj, idx) => (
            <div key={idx} className="mb-2">
              <div className="font-bold flex justify-between text-[10.5px]">
                <span>{proj.name} <span className="font-normal text-[9px] text-gray-500">[{proj.tech}]</span></span>
                <span className="font-normal text-gray-500 italic text-[9.5px]">{proj.link}</span>
              </div>
              {proj.description.split("\n").filter(Boolean).map((pt, i) => (
                bulletType === "disc" ? 
                  <li key={i} className={`ml-4 text-[9.5px] list-disc ${textClass}`}>{pt.replace(/^[•–-]\s*/, "")}</li> :
                  <p key={i} className={`ml-3 text-[9.5px] ${textClass}`}>• {pt.replace(/^[•–-]\s*/, "")}</p>
              ))}
            </div>
          ))}
        </div>
      )}

      {skillsList.length > 0 && (
        <div className="mt-3">
          <h3 className={`font-bold border-b pb-0.5 uppercase mb-1.5 ${template === 't8' ? 'text-emerald-800 border-emerald-500' : 'text-gray-900 border-black'}`}>Technical Skills</h3>
          {skillsList.map((skill, idx) => (
            <p key={idx} className="text-[9.5px] mb-0.5 text-gray-800">
              <span className="font-bold text-gray-950">{skill.category}: </span>{skill.items}
            </p>
          ))}
        </div>
      )}

      {educationList.length > 0 && (
        <div className="mt-3">
          <h3 className={`font-bold border-b pb-0.5 uppercase mb-1.5 ${template === 't8' ? 'text-emerald-800 border-emerald-500' : 'text-gray-900 border-black'}`}>Education</h3>
          {educationList.map((edu, idx) => (
            <div key={idx} className="mb-1.5 flex justify-between text-[10.5px]">
              <div>
                <p className="font-bold">{edu.degree}</p>
                <p className="text-[9.5px] text-gray-600">{edu.school} | {edu.grade}</p>
              </div>
              <span className="text-[9.5px] text-gray-500">{edu.year}</span>
            </div>
          ))}
        </div>
      )}

      {certificationsList.length > 0 && (
        <div className="mt-3">
          <h3 className={`font-bold border-b pb-0.5 uppercase mb-1.5 ${template === 't8' ? 'text-emerald-800 border-emerald-500' : 'text-gray-900 border-black'}`}>Certifications</h3>
          {certificationsList.map((cert, idx) => (
            <div key={idx} className="flex justify-between text-[9.5px] text-gray-700">
              <span>• {cert.name}</span>
              <span className="italic">{cert.year}</span>
            </div>
          ))}
        </div>
      )}
    </>
  );

  // ── REACT RENDERS FOR PREVIEWS ──
  const T1 = () => (
    <div className="bg-white text-black font-serif p-8 min-h-[750px] text-[11px] leading-relaxed">
      <div className="text-center mb-2">
        <h1 className="font-bold text-[18px] uppercase tracking-wide">{name || "Your Name"}</h1>
        <p className="text-[10px] text-gray-700 mt-1">{getCleanContactText()}</p>
      </div>
      <hr className="border-black border-t-2 mb-3"/>
      {summary && <div className="mb-3"><h2 className="font-bold text-[11.5px] uppercase border-b border-black pb-0.5 mb-1">Professional Summary</h2><p className="text-gray-800 text-[10px] text-justify">{summary}</p></div>}
      <SharedTemplateSections isSerif={true} bulletType="para" />
    </div>
  );

  const T2 = () => (
    <div className="bg-white text-black font-sans p-8 min-h-[750px] text-[11px] leading-relaxed">
      <div className="mb-4">
        <h1 className="text-[20px] font-bold text-gray-900">{name || "Your Name"}</h1>
        <p className="text-[9.5px] text-gray-600 mt-1 flex flex-wrap gap-2">{getContactFields().join("  |  ")}</p>
      </div>
      <hr className="border-gray-200 mb-3"/>
      {summary && <div className="mb-3"><h2 className="font-bold text-[11px] text-gray-800 uppercase tracking-widest pb-0.5 mb-1.5 border-b border-gray-100">Summary</h2><p className="text-gray-700 text-[10px]">{summary}</p></div>}
      <SharedTemplateSections isSerif={false} bulletType="disc" />
    </div>
  );

  const T3 = () => (
    <div className="bg-white text-black font-serif p-8 min-h-[750px] text-[10.5px] leading-relaxed">
      <div className="text-center mb-3">
        <h1 className="text-[17px] font-bold uppercase tracking-wider">{name || "YOUR NAME"}</h1>
        <p className="text-[9.5px] text-gray-600 mt-1 italic">{getCleanContactText()}</p>
      </div>
      <hr className="border-black mb-3"/>
      {summary && <div className="mb-3 text-center"><h2 className="font-bold text-[11.5px] uppercase border-b border-gray-300 pb-0.5 mb-1">Career Summary</h2><p className="italic text-gray-800 text-[9.5px]">{summary}</p></div>}
      <SharedTemplateSections isSerif={true} bulletType="para" />
    </div>
  );

  const T4 = () => (
    <div className="bg-white text-black font-sans p-6 min-h-[750px] text-[10px] leading-relaxed flex gap-5">
      <div className="w-[30%] border-r border-gray-200 pr-4 flex flex-col gap-4">
        <div>
          <h2 className="font-bold text-[13px] text-gray-900 leading-tight">{name || "Your Name"}</h2>
          <p className="text-[8.5px] text-gray-500 mt-0.5">Professional Scope</p>
        </div>
        <div className="flex flex-col gap-1 text-[8.5px] text-gray-700">
          <p className="font-bold text-gray-900 border-b pb-0.5 mb-1 uppercase">Contact</p>
          {phone && <p>📞 {phone}</p>}
          {email && <p className="truncate">✉️ {email}</p>}
          {location && <p>📍 {location}</p>}
          {linkedin && <p className="truncate">🔗 {linkedin}</p>}
          {github && <p className="truncate">🐙 {github}</p>}
        </div>
        <div>
          <p className="font-bold text-gray-900 border-b pb-0.5 mb-1 uppercase text-[8.5px]">Skills Matrix</p>
          {skillsList.map((s, i) => (
            <div key={i} className="mt-1">
              <p className="font-semibold text-gray-800 text-[9px]">{s.category}</p>
              <p className="text-[8px] text-gray-500">{s.items}</p>
            </div>
          ))}
        </div>
        {educationList.length > 0 && (
          <div>
            <p className="font-bold text-gray-900 border-b pb-0.5 mb-1 uppercase text-[8.5px]">Education</p>
            {educationList.map((edu, idx) => (
              <div key={idx} className="mb-1 text-[8px]">
                <p className="font-semibold text-gray-800">{edu.degree}</p>
                <p className="text-gray-500">{edu.school} ({edu.year})</p>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="w-[70%] flex flex-col gap-3">
        {summary && (
          <div>
            <p className="font-bold text-[10.5px] uppercase border-b border-black pb-0.5 mb-1">About Me</p>
            <p className="text-gray-700 text-[9.5px]">{summary}</p>
          </div>
        )}
        {showExperience && experienceList.length > 0 && (
          <div>
            <p className="font-bold text-[10.5px] uppercase border-b border-black pb-0.5 mb-1">{expHeading}</p>
            {experienceList.map((exp, idx) => (
              <div key={idx} className="mb-2">
                <p className="font-semibold text-[9.5px] flex justify-between">
                  <span>{exp.role} | {exp.company}</span>
                  <span className="font-normal text-gray-500 text-[8.5px]">{exp.duration}</span>
                </p>
                {exp.description.split("\n").filter(Boolean).map((pt, i) => (
                  <p key={i} className="ml-3 text-[9px] text-gray-600">• {pt.replace(/^[•–-]\s*/, "")}</p>
                ))}
              </div>
            ))}
          </div>
        )}
        {projectList.length > 0 && (
          <div>
            <p className="font-bold text-[10.5px] uppercase border-b border-black pb-0.5 mb-1">Projects</p>
            {projectList.map((proj, idx) => (
              <div key={idx} className="mb-2">
                <p className="font-semibold text-[9.5px] flex justify-between">
                  <span>{proj.name} <span className="text-[8px] text-gray-400">[{proj.tech}]</span></span>
                  <span className="font-normal text-gray-500 text-[8.5px]">{proj.link}</span>
                </p>
                {proj.description.split("\n").filter(Boolean).map((pt, i) => (
                  <p key={i} className="ml-3 text-[9px] text-gray-600">• {pt.replace(/^[•–-]\s*/, "")}</p>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  const T5 = () => (
    <div className="bg-white text-black font-sans p-8 min-h-[750px] text-[10.5px] leading-relaxed shadow-lg">
      <div className="text-center mb-3">
        <h1 className="text-[17px] font-bold uppercase tracking-wider">{name || "YOUR NAME"}</h1>
        <p className="text-[9px] text-gray-650 mt-1">{getCleanContactText()}</p>
      </div>
      <hr className="border-gray-300 mb-3"/>
      {summary && <div className="mb-3"><h2 className="font-bold text-[11px] text-gray-900 uppercase mb-1 border-b">Overview</h2><p className="text-gray-700 text-[9.5px]">{summary}</p></div>}
      
      {skillsList.length > 0 && <div className="mb-3.5"><h2 className="font-bold text-[11px] text-gray-900 uppercase tracking-wider mb-2 border-b-2 border-gray-200 pb-0.5">Core Technical Expertise</h2>
        <table className="w-full text-[9.5px] border-collapse border border-gray-150">
          <tbody>
            {skillsList.map((s, idx) => (
              <tr key={idx} className="border-b border-gray-150">
                <td className="font-bold pr-4 py-1 pl-2 w-[120px] align-top bg-gray-50 text-gray-800">{s.category}</td>
                <td className="py-1 pl-3 pr-2 text-gray-600">{s.items}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>}
      <SharedTemplateSections bulletType="disc" />
    </div>
  );

  const T6 = () => (
    <div className="bg-white text-black font-sans p-8 min-h-[750px] text-[10.5px] leading-relaxed">
      <div className="flex justify-between items-center mb-4 border-b pb-3">
        <div>
          <h1 className="text-[18px] font-extrabold uppercase text-gray-950">{name || "YOUR NAME"}</h1>
          <p className="text-[9px] text-gray-500 mt-0.5">Corporate Resume Layout</p>
        </div>
        <div className="text-right text-[9px] text-gray-600 flex flex-col gap-0.5">
          {phone && <p>📞 {phone}</p>}
          {email && <p>✉️ {email}</p>}
          {location && <p>📍 {location}</p>}
        </div>
      </div>
      {summary && <div className="mb-3"><h2 className="bg-zinc-100 text-zinc-900 font-extrabold text-[10.5px] uppercase px-2.5 py-1 mb-1.5 border border-zinc-200">Executive Statement</h2><p className="text-gray-700 text-[9.5px]">{summary}</p></div>}
      <SharedTemplateSections bulletType="para" textClass="text-zinc-800" />
    </div>
  );

  const T7 = () => (
    <div className="bg-white text-black font-serif p-10 min-h-[750px] text-[10px] leading-relaxed">
      <div className="text-center mb-3">
        <h1 className="font-bold text-[18px] uppercase tracking-wide border-b pb-1 border-black mb-1">{name || "Your Name"}</h1>
        <p className="text-[9px] text-gray-800">{getCleanContactText()}</p>
      </div>
      {summary && <div className="mb-3"><h2 className="font-bold text-[11px] uppercase border-b-2 border-black pb-0.5 mb-1">Summary</h2><p className="text-gray-900 text-[9.5px] text-justify font-serif">{summary}</p></div>}
      <SharedTemplateSections isSerif={true} bulletType="para" textClass="text-black" />
    </div>
  );

  const T8 = () => (
    <div className="bg-white text-black font-sans p-8 min-h-[750px] text-[10.5px] leading-relaxed">
      <div className="border-b-4 border-emerald-500 pb-3 mb-4">
        <h1 className="text-[20px] font-extrabold text-emerald-700 uppercase">{name || "Your Name"}</h1>
        <p className="text-[9.5px] text-gray-600 mt-1 flex flex-wrap gap-1.5">{getCleanContactText()}</p>
      </div>
      {summary && <div className="mb-3.5"><h2 className="font-bold text-[11px] text-emerald-800 uppercase flex items-center gap-1 mb-1"><span className="w-1 h-3.5 bg-emerald-500 inline-block rounded-sm"></span>About Me</h2><div className="pl-2 border-l border-gray-100"><p className="text-gray-700 text-[9.5px]">{summary}</p></div></div>}
      <SharedTemplateSections bulletType="disc" textClass="text-gray-700" />
    </div>
  );

  const T9 = () => (
    <div className="bg-white text-black font-mono p-6 min-h-[750px] text-[9.5px] leading-tight">
      <div className="mb-2">
        <h1 className="font-bold text-[15px] uppercase tracking-tighter">{name || "Your Name"}</h1>
        <p className="text-[8px] text-gray-700 mt-0.5">{getCleanContactText()}</p>
      </div>
      <hr className="border-gray-400 mb-2"/>
      {summary && <div className="mb-3"><h2 className="font-bold text-[10px] uppercase text-gray-900 tracking-tighter mb-1">[Summary]</h2><p className="text-gray-800 text-[9px]">{summary}</p></div>}
      <SharedTemplateSections bulletType="para" textClass="text-zinc-900" />
    </div>
  );

  const T10 = () => (
    <div className="bg-white text-black font-sans p-6 min-h-[750px] text-[10px] leading-relaxed flex gap-6">
      <div className="w-[30%] bg-zinc-900 text-zinc-100 p-4 rounded-xl flex flex-col gap-4">
        <div>
          <h2 className="font-extrabold text-[15px] leading-tight text-white">{name || "Your Name"}</h2>
          <p className="text-[8.5px] text-zinc-400 mt-1">Professional Persona</p>
        </div>
        <div className="flex flex-col gap-1 text-[8.5px]">
          <p className="text-white font-bold border-b border-zinc-700 uppercase tracking-wider pb-0.5 text-[9px]">Contact</p>
          <p className="truncate">✉️ {email}</p>
          <p>📞 {phone}</p>
          <p className="truncate">📍 {location}</p>
        </div>
        <div>
          <p className="text-white font-bold border-b border-zinc-700 uppercase tracking-wider pb-0.5 text-[9px]">Expertise</p>
          {skillsList.map((s, i) => (
            <div key={i} className="mt-1">
              <p className="text-zinc-300 font-semibold text-[8.5px]">{s.category}</p>
              <p className="text-zinc-400 text-[7.5px]">{s.items}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="w-[70%] flex flex-col gap-4">
        {summary && (
          <div>
            <p className="font-bold text-[11px] text-zinc-950 uppercase border-b-2 border-zinc-900 pb-0.5 mb-1.5">Overview</p>
            <p className="text-zinc-700 text-[9.5px]">{summary}</p>
          </div>
        )}
        {showExperience && experienceList.length > 0 && (
          <div>
            <p className="font-bold text-[11px] text-zinc-950 uppercase border-b-2 border-zinc-900 pb-0.5 mb-1.5">{expHeading}</p>
            {experienceList.map((exp, idx) => (
              <div key={idx} className="mb-2">
                <div className="font-bold flex justify-between text-[10px]">
                  <span>{exp.role} | {exp.company}</span>
                  <span className="font-normal text-zinc-500 italic">{exp.duration}</span>
                </div>
                {exp.description.split("\n").filter(Boolean).map((pt, i) => (
                  <p key={i} className="ml-3 text-[9px] text-zinc-600">• {pt.replace(/^[•–-]\s*/, "")}</p>
                ))}
              </div>
            ))}
          </div>
        )}
        {projectList.length > 0 && (
          <div>
            <p className="font-bold text-[11px] text-zinc-950 uppercase border-b-2 border-zinc-900 pb-0.5 mb-1.5">Key Projects</p>
            {projectList.map((proj, idx) => (
              <div key={idx} className="mb-2">
                <div className="font-bold flex justify-between text-[10px]">
                  <span>{proj.name}</span>
                  <span className="font-normal text-zinc-500 text-[8.5px]">{proj.link}</span>
                </div>
                {proj.description.split("\n").filter(Boolean).map((pt, i) => (
                  <p key={i} className="ml-3 text-[9px] text-zinc-600">• {pt.replace(/^[•–-]\s*/, "")}</p>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  const renderActiveTemplate = () => {
    switch (template) {
      case "t1": return <T1 />;
      case "t2": return <T2 />;
      case "t3": return <T3 />;
      case "t4": return <T4 />;
      case "t5": return <T5 />;
      case "t6": return <T6 />;
      case "t7": return <T7 />;
      case "t8": return <T8 />;
      case "t9": return <T9 />;
      case "t10": return <T10 />;
      default: return <T1 />;
    }
  };

  // ── Render miniature visual layout preview inside the Choose Template Modal ──
  const renderMiniPreview = (styleId: string) => {
    switch (styleId) {
      case "t1":
        return (
          <div className="w-full h-24 bg-white border border-zinc-250 p-1 flex flex-col gap-1 rounded overflow-hidden">
            <div className="h-1 w-1/3 bg-zinc-800 mx-auto rounded-sm"></div>
            <div className="h-0.5 w-2/3 bg-zinc-400 mx-auto rounded-sm"></div>
            <div className="w-full border-b border-zinc-900 my-0.5"></div>
            <div className="h-0.5 w-1/4 bg-zinc-650 rounded-sm"></div>
            <div className="h-0.5 w-full bg-zinc-300 rounded-sm"></div>
            <div className="h-0.5 w-[90%] bg-zinc-300 rounded-sm"></div>
            <div className="w-full border-b border-zinc-900 my-0.5"></div>
            <div className="h-0.5 w-1/4 bg-zinc-650 rounded-sm"></div>
            <div className="flex justify-between items-center w-full">
              <div className="h-0.5 w-1/3 bg-zinc-500 rounded-sm"></div>
              <div className="h-0.5 w-1/6 bg-zinc-400 rounded-sm"></div>
            </div>
            <div className="h-0.5 w-[85%] bg-zinc-300 ml-1 rounded-sm"></div>
          </div>
        );
      case "t2":
        return (
          <div className="w-full h-24 bg-white border border-zinc-250 p-1 flex flex-col gap-1 rounded overflow-hidden">
            <div className="h-1.5 w-1/2 bg-zinc-900 rounded-sm"></div>
            <div className="h-0.5 w-[80%] bg-zinc-400 rounded-sm"></div>
            <div className="w-full border-b border-zinc-200 my-0.5"></div>
            <div className="h-1 w-1/3 bg-zinc-700 rounded-sm mt-0.5"></div>
            <div className="h-0.5 w-[90%] bg-zinc-300 rounded-sm"></div>
            <div className="h-0.5 w-[95%] bg-zinc-300 rounded-sm"></div>
            <div className="h-1 w-1/3 bg-zinc-700 rounded-sm mt-0.5"></div>
            <div className="h-0.5 w-[85%] bg-zinc-300 rounded-sm"></div>
          </div>
        );
      case "t3":
        return (
          <div className="w-full h-24 bg-white border border-zinc-250 p-1 flex flex-col gap-1 rounded overflow-hidden">
            <div className="h-1.5 w-2/5 bg-zinc-800 mx-auto rounded-sm mt-1"></div>
            <div className="h-0.5 w-1/2 bg-zinc-400 mx-auto rounded-sm mb-1"></div>
            <div className="w-full border-b border-zinc-800"></div>
            <div className="h-1 w-1/4 bg-zinc-650 mx-auto rounded-sm mt-1"></div>
            <div className="h-0.5 w-[90%] bg-zinc-300 rounded-sm"></div>
            <div className="h-0.5 w-[85%] bg-zinc-300 rounded-sm"></div>
          </div>
        );
      case "t4":
        return (
          <div className="w-full h-24 bg-white border border-zinc-250 p-0.5 flex gap-1 rounded overflow-hidden">
            <div className="w-[30%] bg-zinc-50 border-r border-zinc-150 p-1 flex flex-col gap-1">
              <div className="h-1 w-4/5 bg-zinc-800 rounded-sm"></div>
              <div className="h-0.5 w-[90%] bg-zinc-400 rounded-sm"></div>
              <div className="h-0.5 w-2/3 bg-zinc-300 rounded-sm mt-2"></div>
            </div>
            <div className="w-[70%] p-1 flex flex-col gap-1">
              <div className="h-1 w-1/3 bg-zinc-700 rounded-sm"></div>
              <div className="h-0.5 w-[95%] bg-zinc-300 rounded-sm"></div>
              <div className="h-0.5 w-[90%] bg-zinc-300 rounded-sm"></div>
            </div>
          </div>
        );
      case "t5":
        return (
          <div className="w-full h-24 bg-white border border-zinc-250 p-1 flex flex-col gap-1 rounded overflow-hidden">
            <div className="h-1 w-1/3 bg-zinc-800 mx-auto rounded-sm"></div>
            <div className="h-0.5 w-1/2 bg-zinc-400 mx-auto rounded-sm mb-1"></div>
            <div className="h-1.5 w-1/4 bg-zinc-750 rounded-sm"></div>
            <div className="border border-zinc-200 rounded flex flex-col gap-0.5 p-0.5 mt-0.5">
              <div className="flex w-full border-b border-zinc-100">
                <div className="w-[35%] bg-zinc-50 h-1.5"></div>
                <div className="w-[65%] h-1.5 pl-1 bg-white"></div>
              </div>
              <div className="flex w-full">
                <div className="w-[35%] bg-zinc-50 h-1.5"></div>
                <div className="w-[65%] h-1.5 pl-1 bg-white"></div>
              </div>
            </div>
          </div>
        );
      case "t6":
        return (
          <div className="w-full h-24 bg-white border border-zinc-250 p-1 flex flex-col gap-1.5 rounded overflow-hidden">
            <div className="h-1.5 w-2/5 bg-zinc-900 rounded-sm"></div>
            <div className="h-0.5 w-[75%] bg-zinc-500 rounded-sm"></div>
            <div className="w-full bg-zinc-200 h-2 px-0.5 py-0.5 rounded-sm">
              <div className="h-1 w-1/4 bg-zinc-800 rounded-sm"></div>
            </div>
            <div className="h-0.5 w-[90%] bg-zinc-300 rounded-sm"></div>
          </div>
        );
      case "t7":
        return (
          <div className="w-full h-24 bg-white border border-zinc-250 p-1 flex flex-col gap-1 rounded overflow-hidden">
            <div className="h-1 w-1/3 bg-zinc-900 mx-auto rounded-sm"></div>
            <div className="h-0.5 w-4/5 bg-zinc-500 mx-auto rounded-sm mb-1"></div>
            <div className="h-0.5 w-1/4 bg-zinc-850 rounded-sm"></div>
            <div className="w-full border-b border-zinc-900 my-0.5"></div>
            <div className="h-0.5 w-full bg-zinc-400 rounded-sm"></div>
          </div>
        );
      case "t8":
        return (
          <div className="w-full h-24 bg-white border border-zinc-250 p-1 flex flex-col gap-1 rounded overflow-hidden">
            <div className="border-b border-emerald-500 pb-0.5">
              <div className="h-1.5 w-1/2 bg-emerald-700 rounded-sm"></div>
              <div className="h-0.5 w-[80%] bg-zinc-400 mt-0.5 rounded-sm"></div>
            </div>
            <div className="flex gap-1 items-center mt-1">
              <div className="w-0.5 h-2 bg-emerald-500"></div>
              <div className="h-1 w-1/4 bg-zinc-850 rounded-sm"></div>
            </div>
            <div className="h-0.5 w-[95%] bg-zinc-300 rounded-sm pl-0.5"></div>
          </div>
        );
      case "t9":
        return (
          <div className="w-full h-24 bg-white border border-zinc-250 p-0.5 flex flex-col gap-0.5 rounded overflow-hidden">
            <div className="h-1 w-1/3 bg-zinc-900 rounded-sm"></div>
            <div className="h-0.5 w-[90%] bg-zinc-500 rounded-sm"></div>
            <hr className="border-zinc-300 my-0.5" />
            <div className="h-0.5 w-[95%] bg-zinc-400 rounded-sm"></div>
            <div className="h-0.5 w-full bg-zinc-400 rounded-sm"></div>
          </div>
        );
      case "t10":
        return (
          <div className="w-full h-24 bg-white border border-zinc-250 p-0.5 flex gap-1 rounded overflow-hidden">
            <div className="w-[30%] bg-zinc-900 text-zinc-200 p-0.5 rounded-sm flex flex-col gap-1">
              <div className="h-1 w-4/5 bg-white rounded-sm mt-0.5"></div>
              <div className="h-0.5 w-2/3 bg-zinc-400 rounded-sm"></div>
            </div>
            <div className="w-[70%] p-1 flex flex-col gap-1">
              <div className="h-1 w-1/3 bg-zinc-900 rounded-sm"></div>
              <div className="h-0.5 w-[95%] bg-zinc-300 rounded-sm"></div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  // ── Handlers to Modify Lists ──
  const addEdu = () => setEducationList([...educationList, { degree: "", school: "", grade: "", year: "" }]);
  const removeEdu = (index: number) => setEducationList(educationList.filter((_, i) => i !== index));
  const updateEdu = (index: number, field: keyof EduItem, val: string) => {
    const updated = [...educationList];
    updated[index][field] = val;
    
    setEducationList(updated);
  };

  const addExp = () => setExperienceList([...experienceList, { company: "", role: "", duration: "", location: "", description: "" }]);
  const removeExp = (index: number) => setExperienceList(experienceList.filter((_, i) => i !== index));
  const updateExp = (index: number, field: keyof ExpItem, val: string) => {
    const updated = [...experienceList];
    updated[index][field] = val;
    setExperienceList(updated);
  };

  const addProj = () => setProjectList([...projectList, { name: "", tech: "", link: "", description: "" }]);
  const removeProj = (index: number) => setProjectList(projectList.filter((_, i) => i !== index));
  const updateProj = (index: number, field: keyof ProjItem, val: string) => {
    const updated = [...projectList];
    updated[index][field] = val;
    setProjectList(updated);
  };

  const addSkill = () => setSkillsList([...skillsList, { category: "", items: "" }]);
  const removeSkill = (index: number) => setSkillsList(skillsList.filter((_, i) => i !== index));
  const updateSkill = (index: number, field: keyof SkillCategory, val: string) => {
    const updated = [...skillsList];
    updated[index][field] = val;
    setSkillsList(updated);
  };

  const addCert = () => setCertificationsList([...certificationsList, { name: "", year: "" }]);
  const removeCert = (index: number) => setCertificationsList(certificationsList.filter((_, i) => i !== index));
  const updateCert = (index: number, val: string, field: "name" | "year") => {
    const updated = [...certificationsList];
    updated[index][field] = val;
    setCertificationsList(updated);
  };

  return (
    <div className={`min-h-screen transition-colors duration-200 ${darkMode ? "bg-zinc-950 text-zinc-100" : "bg-gray-150 text-gray-900"}`}>
      
      {/* ── STUNNING GLASSMORPHIC TOP NAVBAR ── */}
      <nav className={`border-b sticky top-0 z-40 backdrop-blur-md px-6 py-4 flex items-center justify-between shadow-sm transition-all ${
        darkMode ? "bg-zinc-950/80 border-zinc-800/80" : "bg-white/80 border-gray-200"
      }`}>
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-emerald-500 flex items-center justify-center text-white text-lg font-bold shadow-md">
            AI
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight">AI Resume Builder SaaS</h1>
            <p className="text-[10px] text-zinc-400 font-medium">Develop high-score job application layouts</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={() => setDarkMode(!darkMode)}
            className={`px-4 py-2 text-xs font-bold rounded-xl border flex items-center gap-1.5 transition-all ${
              darkMode ? "bg-zinc-900 border-zinc-850 hover:bg-zinc-850 text-yellow-400" : "bg-white border-gray-255 hover:bg-gray-100 text-gray-700"
            }`}
          >
            {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
          </button>
          
          <button
            onClick={() => setShowModal(true)}
            className="bg-zinc-900 border border-zinc-850 hover:border-zinc-700 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-1.5"
          >
            📄 Choose Template
          </button>

          <button
  onClick={() => handleSaveResume()}
  className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-xl text-xs font-bold text-white transition-all shadow-md"
>
  💾 Save Data
</button>
        <button
  type="button"
  onClick={() => analyzeResume()}
  className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-xl text-xs font-bold text-white transition-all shadow-md z-50 relative"
>

  😈 Analyze Resume

</button>
          <button 
            onClick={downloadPDF}
            className="bg-emerald-600 hover:bg-emerald-700 px-4 py-2 rounded-xl text-xs font-bold text-white transition-all shadow-md flex items-center gap-1.5"
          >
            📥 Download ATS PDF
          </button>
          <button
  onClick={handleLogout}
  className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-xl text-xs font-bold text-white transition-all shadow-md"
>
  🚪 Logout
</button>
        </div>
      </nav>

      {/* ── WORKSPACE ── */}
      <main className="max-w-7xl mx-auto p-6 grid lg:grid-cols-[1.1fr_0.9fr] gap-8 items-start">
        
        {/* ── LEFT COLUMN: EDIT DETAILS PANEL ── */}
        <section className={`rounded-2xl border p-6 flex flex-col gap-6 shadow-md transition-all ${
          darkMode ? "bg-zinc-900/60 border-zinc-800" : "bg-white border-gray-200"
        }`}>
          <div className="flex items-center justify-between border-b border-zinc-800/40 pb-3">
            <h2 className="text-[16px] font-bold uppercase tracking-wider text-zinc-400">Structured Resume Editor</h2>
            <span className="text-[10px] text-zinc-500 font-medium">Automatic formatting active</span>
          </div>

          {/* Editor Category Tabs */}
          <div className="flex gap-1 bg-zinc-950/45 p-1 rounded-xl border border-zinc-850 overflow-x-auto">
            {[
              { id: "personal", label: "Contact Info" },
              { id: "summary", label: "Summary" },
              { id: "experience", label: "Experience" },
              { id: "projects", label: "Projects" },
              { id: "education", label: "Education" },
              { id: "skills", label: "Skills" },
              { id: "certifications", label: "Certifications" },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-2 text-xs font-bold rounded-lg transition-all whitespace-nowrap ${
                  activeTab === tab.id 
                    ? (darkMode ? "bg-zinc-800 text-white shadow-sm" : "bg-gray-150 text-gray-900 shadow-sm") 
                    : "text-zinc-400 hover:text-zinc-100"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="min-h-[420px] flex flex-col gap-4">
            
            {activeTab === "personal" && (
              <div className="flex flex-col gap-4 animate-fadeIn">
                <p className="text-xs text-zinc-400 mb-1">Standard contact info is read by ATS systems from the very top of the page.</p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <label className="text-xs text-zinc-400 font-bold">Full Name</label>
                    <input type="text" placeholder="e.g. Vikram Aditya" value={name} onChange={e=>setName(e.target.value)}
                      className={`p-3 rounded-xl outline-none text-sm border ${
                        darkMode ? "bg-zinc-950 border-zinc-850 text-white focus:border-zinc-700" : "bg-gray-50 border-gray-200 focus:bg-white"
                      }`}/>
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-xs text-zinc-400 font-bold">Phone Number</label>
                    <input type="text" placeholder="e.g. +91 98765 43210" value={phone} onChange={e=>setPhone(e.target.value)}
                      className={`p-3 rounded-xl outline-none text-sm border ${
                        darkMode ? "bg-zinc-950 border-zinc-850 text-white focus:border-zinc-700" : "bg-gray-50 border-gray-200 focus:bg-white"
                      }`}/>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <label className="text-xs text-zinc-400 font-bold">Email Address</label>
                    <input type="email" placeholder="e.g. name@email.com" value={email} onChange={e=>setEmail(e.target.value)}
                      className={`p-3 rounded-xl outline-none text-sm border ${
                        darkMode ? "bg-zinc-950 border-zinc-850 text-white focus:border-zinc-700" : "bg-gray-50 border-gray-200 focus:bg-white"
                      }`}/>
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-xs text-zinc-400 font-bold">Location (City, State)</label>
                    <input type="text" placeholder="e.g. New Delhi, India" value={location} onChange={e=>setLocation(e.target.value)}
                      className={`p-3 rounded-xl outline-none text-sm border ${
                        darkMode ? "bg-zinc-950 border-zinc-850 text-white focus:border-zinc-700" : "bg-gray-50 border-gray-200 focus:bg-white"
                      }`}/>
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div className="flex flex-col gap-1">
                    <label className="text-xs text-zinc-400 font-bold">LinkedIn URL</label>
                    <input type="text" placeholder="linkedin.com/in/username" value={linkedin} onChange={e=>setLinkedin(e.target.value)}
                      className={`p-3 rounded-xl outline-none text-xs border ${
                        darkMode ? "bg-zinc-950 border-zinc-850 text-white focus:border-zinc-700" : "bg-gray-50 border-gray-200 focus:bg-white"
                      }`}/>
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-xs text-zinc-400 font-bold">GitHub URL</label>
                    <input type="text" placeholder="github.com/username" value={github} onChange={e=>setGithub(e.target.value)}
                      className={`p-3 rounded-xl outline-none text-xs border ${
                        darkMode ? "bg-zinc-950 border-zinc-850 text-white focus:border-zinc-700" : "bg-gray-50 border-gray-200 focus:bg-white"
                      }`}/>
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-xs text-zinc-400 font-bold">Portfolio URL</label>
                    <input type="text" placeholder="username.dev" value={portfolio} onChange={e=>setPortfolio(e.target.value)}
                      className={`p-3 rounded-xl outline-none text-xs border ${
                        darkMode ? "bg-zinc-950 border-zinc-850 text-white focus:border-zinc-700" : "bg-gray-50 border-gray-200 focus:bg-white"
                      }`}/>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "summary" && (
              <div className="flex flex-col gap-4 animate-fadeIn">
                <div className="flex justify-between items-center">
                  <label className="text-xs text-zinc-400 mb-1 font-bold">Professional Summary</label>
                  <button 
                    onClick={generateSummary}
                    disabled={loading}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-bold px-3 py-1.5 rounded-lg transition-all flex items-center gap-1 shadow-sm"
                  >
                    {loading ? "Generating..." : "⚡ Generate AI Summary"}
                  </button>
                </div>
                <textarea 
                  value={summary} 
                  onChange={e=>setSummary(e.target.value)} 
                  rows={6}
                  placeholder="Summarize your professional experience, key skills, and engineering milestones..."
                  className={`w-full p-3 rounded-xl outline-none text-sm border font-sans leading-relaxed ${
                    darkMode ? "bg-zinc-950 border-zinc-850 text-white focus:border-zinc-700" : "bg-gray-50 border-gray-200 focus:bg-white"
                  }`}
                />
              </div>
            )}

            {activeTab === "experience" && (
              <div className="flex flex-col gap-4 animate-fadeIn">
                <div className="flex flex-wrap justify-between items-center gap-3 border-b border-zinc-800/40 pb-3">
                  
                  <div className="flex items-center gap-2">
                    <label className="text-xs text-zinc-400 font-bold whitespace-nowrap">Section Label:</label>
                    <select
                      value={expHeading}
                      onChange={(e) => setExpHeading(e.target.value)}
                      className={`p-1.5 rounded-lg text-xs outline-none border font-semibold ${
                        darkMode ? "bg-zinc-950 border-zinc-850 text-white" : "bg-white border-gray-250 text-gray-800"
                      }`}
                    >
                      <option value="Work Experience">Work Experience</option>
                      <option value="Professional Experience">Professional Experience</option>
                      <option value="Internships & Training">Internships & Training</option>
                      <option value="Leadership & Experience">Leadership Roles</option>
                      <option value="Extracurricular Activities">Extracurricular Activities</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-4">
                    <label className="text-xs text-zinc-400 flex items-center gap-1.5 cursor-pointer font-medium select-none">
                      <input 
                        type="checkbox" 
                        checked={showExperience} 
                        onChange={(e) => setShowExperience(e.target.checked)}
                        className="rounded border-zinc-800 bg-zinc-950 text-emerald-600 focus:ring-0 w-3.5 h-3.5"
                      />
                      Show Section
                    </label>
                    
                    {showExperience && (
                      <button onClick={addExp} className="bg-zinc-900 border border-zinc-800 text-white text-[10px] font-bold px-3 py-1.5 rounded-lg hover:border-zinc-700 transition-all">
                        ➕ Add Item
                      </button>
                    )}
                  </div>
                </div>
                
                {!showExperience ? (
                  <div className="text-center py-10 text-zinc-500 text-xs border border-dashed border-zinc-800 rounded-xl bg-zinc-950/10">
                    🚫 This section has been disabled and hidden from the live resume canvas.
                  </div>
                ) : experienceList.length === 0 ? (
                  <div className="text-center py-8 text-zinc-500 text-xs border border-dashed border-zinc-800 rounded-xl">
                    No data under this label. Click "Add Item" to add entries.
                  </div>
                ) : (
                  <div className="flex flex-col gap-4 max-h-[380px] overflow-y-auto pr-1">
                    {experienceList.map((exp, idx) => (
                      <div key={idx} className="p-4 rounded-xl border border-zinc-800/80 bg-zinc-950/20 flex flex-col gap-3 relative">
                        <button onClick={() => removeExp(idx)} className="absolute top-2 right-2 w-6 h-6 flex items-center justify-center bg-red-650/10 text-red-500 hover:bg-red-500 hover:text-white rounded-lg text-xs transition-all">
                          ×
                        </button>
                        
                        <div className="grid md:grid-cols-2 gap-3 mt-2">
                          <input type="text" placeholder="Company / Organization Name" value={exp.company} onChange={e=>updateExp(idx, "company", e.target.value)}
                            className={`p-2 rounded-lg outline-none text-xs border ${darkMode ? "bg-zinc-950 border-zinc-850" : "bg-white border-gray-200"}`}/>
                          <input type="text" placeholder="Role / Position (e.g. Intern)" value={exp.role} onChange={e=>updateExp(idx, "role", e.target.value)}
                            className={`p-2 rounded-lg outline-none text-xs border ${darkMode ? "bg-zinc-950 border-zinc-850" : "bg-white border-gray-200"}`}/>
                        </div>

                        <div className="grid md:grid-cols-2 gap-3">
                          <input type="text" placeholder="Duration (e.g., Summer 2024)" value={exp.duration} onChange={e=>updateExp(idx, "duration", e.target.value)}
                            className={`p-2 rounded-lg outline-none text-xs border ${darkMode ? "bg-zinc-950 border-zinc-850" : "bg-white border-gray-200"}`}/>
                          <input type="text" placeholder="Location (e.g., Remote / Delhi)" value={exp.location} onChange={e=>updateExp(idx, "location", e.target.value)}
                            className={`p-2 rounded-lg outline-none text-xs border ${darkMode ? "bg-zinc-950 border-zinc-850" : "bg-white border-gray-200"}`}/>
                        </div>

                        <div>
                          <label className="text-[10px] text-zinc-500 font-bold">Bullet points (write each description on a new line)</label>
                          <textarea placeholder="- Handled backend routing with Node.js&#10;- Curated structural engineering algorithms" value={exp.description} onChange={e=>updateExp(idx, "description", e.target.value)} rows={3}
                            className={`w-full p-2.5 rounded-lg outline-none text-xs font-mono border mt-1 ${darkMode ? "bg-zinc-950 border-zinc-850" : "bg-white border-gray-255"}`}/>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === "projects" && (
              <div className="flex flex-col gap-4 animate-fadeIn">
                <div className="flex justify-between items-center">
                  <label className="text-xs text-zinc-400 font-bold">Personal Projects</label>
                  <button onClick={addProj} className="bg-zinc-900 border border-zinc-800 text-white text-[10px] font-bold px-3 py-1.5 rounded-lg hover:border-zinc-700 transition-all">
                    ➕ Add Project
                  </button>
                </div>

                {projectList.length === 0 ? (
                  <div className="text-center py-8 text-zinc-500 text-xs border border-dashed border-zinc-800 rounded-xl">No projects listed. Click Add to insert one.</div>
                ) : (
                  <div className="flex flex-col gap-4 max-h-[380px] overflow-y-auto pr-1">
                    {projectList.map((proj, idx) => (
                      <div key={idx} className="p-4 rounded-xl border border-zinc-800/80 bg-zinc-950/20 flex flex-col gap-3 relative">
                        <button onClick={() => removeProj(idx)} className="absolute top-2 right-2 w-6 h-6 flex items-center justify-center bg-red-650/10 text-red-500 hover:bg-red-500 hover:text-white rounded-lg text-xs transition-all">
                          ×
                        </button>
                        
                        <div className="grid md:grid-cols-3 gap-3 mt-2">
                          <input type="text" placeholder="Project Name" value={proj.name} onChange={e=>updateProj(idx, "name", e.target.value)}
                            className={`p-2 rounded-lg outline-none text-xs border ${darkMode ? "bg-zinc-950 border-zinc-850" : "bg-white border-gray-200"}`}/>
                          <input type="text" placeholder="Tech Stack (e.g. Next.js, Redis)" value={proj.tech} onChange={e=>updateProj(idx, "tech", e.target.value)}
                            className={`p-2 rounded-lg outline-none text-xs border ${darkMode ? "bg-zinc-950 border-zinc-850" : "bg-white border-gray-200"}`}/>
                          <input type="text" placeholder="Link (e.g. github.com/user/project)" value={proj.link} onChange={e=>updateProj(idx, "link", e.target.value)}
                            className={`p-2 rounded-lg outline-none text-xs border ${darkMode ? "bg-zinc-950 border-zinc-850" : "bg-white border-gray-200"}`}/>
                        </div>

                        <div>
                          <label className="text-[10px] text-zinc-500 font-bold">Project Details (each bullet point on new line)</label>
                          <textarea placeholder="- Built full-stack system with microservices&#10;- Configured serverless tasks" value={proj.description} onChange={e=>updateProj(idx, "description", e.target.value)} rows={3}
                            className={`w-full p-2.5 rounded-lg outline-none text-xs font-mono border mt-1 ${darkMode ? "bg-zinc-950 border-zinc-850" : "bg-white border-gray-255"}`}/>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === "education" && (
              <div className="flex flex-col gap-4 animate-fadeIn">
                <div className="flex justify-between items-center">
                  <label className="text-xs text-zinc-400 font-bold">Academic History</label>
                  <button onClick={addEdu} className="bg-zinc-900 border border-zinc-800 text-white text-[10px] font-bold px-3 py-1.5 rounded-lg hover:border-zinc-700 transition-all">
                    ➕ Add Education
                  </button>
                </div>

                {educationList.length === 0 ? (
                  <div className="text-center py-8 text-zinc-500 text-xs border border-dashed border-zinc-800 rounded-xl">No education history. Click Add to insert.</div>
                ) : (
                  <div className="flex flex-col gap-4 max-h-[380px] overflow-y-auto pr-1">
                    {educationList.map((edu, idx) => (
                      <div key={idx} className="p-4 rounded-xl border border-zinc-800/80 bg-zinc-950/20 flex flex-col gap-3 relative">
                        <button onClick={() => removeEdu(idx)} className="absolute top-2 right-2 w-6 h-6 flex items-center justify-center bg-red-650/10 text-red-500 hover:bg-red-500 hover:text-white rounded-lg text-xs transition-all">
                          ×
                        </button>
                        
                        <div className="grid md:grid-cols-2 gap-3 mt-2">
                          <input type="text" placeholder="Degree / Qualification" value={edu.degree} onChange={e=>updateEdu(idx, "degree", e.target.value)}
                            className={`p-2 rounded-lg outline-none text-xs border ${darkMode ? "bg-zinc-950 border-zinc-850" : "bg-white border-gray-200"}`}/>
                          <input type="text" placeholder="School / College Name" value={edu.school} onChange={e=>updateEdu(idx, "school", e.target.value)}
                            className={`p-2 rounded-lg outline-none text-xs border ${darkMode ? "bg-zinc-950 border-zinc-850" : "bg-white border-gray-200"}`}/>
                        </div>

                        <div className="grid md:grid-cols-2 gap-3">
                          <input type="text" placeholder="GPA / Grade (e.g. CGPA: 9.2)" value={edu.grade} onChange={e=>updateEdu(idx, "grade", e.target.value)}
                            className={`p-2 rounded-lg outline-none text-xs border ${darkMode ? "bg-zinc-950 border-zinc-850" : "bg-white border-gray-200"}`}/>
                          <input type="text" placeholder="Duration (e.g., 2020 - 2024)" value={edu.year} onChange={e=>updateEdu(idx, "year", e.target.value)}
                            className={`p-2 rounded-lg outline-none text-xs border ${darkMode ? "bg-zinc-950 border-zinc-850" : "bg-white border-gray-200"}`}/>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === "skills" && (
              <div className="flex flex-col gap-4 animate-fadeIn">
                <div className="flex justify-between items-center">
                  <label className="text-xs text-zinc-400 font-bold">Skills Category Matrix</label>
                  <button onClick={addSkill} className="bg-zinc-900 border border-zinc-800 text-white text-[10px] font-bold px-3 py-1.5 rounded-lg hover:border-zinc-700 transition-all">
                    ➕ Add Skill Category
                  </button>
                </div>

                {skillsList.length === 0 ? (
                  <div className="text-center py-8 text-zinc-500 text-xs border border-dashed border-zinc-800 rounded-xl">No skills added. Click Add.</div>
                ) : (
                  <div className="flex flex-col gap-3 max-h-[380px] overflow-y-auto pr-1">
                    {skillsList.map((skill, idx) => (
                      <div key={idx} className="p-3 rounded-xl border border-zinc-805/85 bg-zinc-950/20 flex gap-3 items-center relative">
                        <div className="w-[30%]">
                          <input type="text" placeholder="e.g. Languages" value={skill.category} onChange={e=>updateSkill(idx, "category", e.target.value)}
                            className={`p-2 rounded-lg outline-none text-xs w-full border ${darkMode ? "bg-zinc-950 border-zinc-850 text-white" : "bg-white border-gray-255"}`}/>
                        </div>
                        <div className="w-[60%]">
                          <input type="text" placeholder="e.g. JavaScript, C++, Python" value={skill.items} onChange={e=>updateSkill(idx, "items", e.target.value)}
                            className={`p-2 rounded-lg outline-none text-xs w-full border ${darkMode ? "bg-zinc-950 border-zinc-850 text-white" : "bg-white border-gray-255"}`}/>
                        </div>
                        <button onClick={() => removeSkill(idx)} className="w-8 h-8 flex items-center justify-center bg-red-650/10 text-red-500 hover:bg-red-500 hover:text-white rounded-lg text-xs transition-all">
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === "certifications" && (
              <div className="flex flex-col gap-4 animate-fadeIn">
                <div className="flex justify-between items-center">
                  <label className="text-xs text-zinc-400 font-bold">Certifications & Awards</label>
                  <button onClick={addCert} className="bg-zinc-900 border border-zinc-800 text-white text-[10px] font-bold px-3 py-1.5 rounded-lg hover:border-zinc-700 transition-all">
                    ➕ Add Certification
                  </button>
                </div>

                {certificationsList.length === 0 ? (
                  <div className="text-center py-8 text-zinc-500 text-xs border border-dashed border-zinc-800 rounded-xl">No certifications added. Click Add.</div>
                ) : (
                  <div className="flex flex-col gap-3 max-h-[380px] overflow-y-auto pr-1">
                    {certificationsList.map((cert, idx) => (
                      <div key={idx} className="p-3 rounded-xl border border-zinc-805/85 bg-zinc-950/20 flex gap-3 items-center relative">
                        <div className="w-[70%]">
                          <input type="text" placeholder="Certification Name" value={cert.name} onChange={e=>updateCert(idx, e.target.value, "name")}
                            className={`p-2 rounded-lg outline-none text-xs w-full border ${darkMode ? "bg-zinc-950 border-zinc-850 text-white" : "bg-white border-gray-200"}`}/>
                        </div>
                        <div className="w-[20%]">
                          <input type="text" placeholder="Year" value={cert.year} onChange={e=>updateCert(idx, e.target.value, "year")}
                            className={`p-2 rounded-lg outline-none text-xs w-full border ${darkMode ? "bg-zinc-950 border-zinc-850 text-white" : "bg-white border-gray-200"}`}/>
                        </div>
                        <button onClick={() => removeCert(idx)} className="w-8 h-8 flex items-center justify-center bg-red-650/10 text-red-500 hover:bg-red-500 hover:text-white rounded-lg text-xs transition-all">
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </section>

        {/* ── RIGHT COLUMN: INTERACTIVE A4 LIVE PREVIEW PANEL ── */}
        <section className="sticky top-24 flex flex-col gap-4">
          <div className="flex justify-between items-center px-1">
            <span className="text-xs text-zinc-500 uppercase tracking-widest font-bold">Interactive A4 Live Preview</span>
            <span className="text-[10px] text-zinc-400 font-semibold bg-emerald-500/10 text-emerald-500 px-2 py-0.5 rounded-full border border-emerald-500/20">
              Active: {TEMPLATES.find(t=>t.id===template)?.name}
            </span>
          </div>
          
          <div className="border border-zinc-850 rounded-2xl overflow-hidden shadow-2xl bg-zinc-100 p-0.5 max-h-[820px] overflow-y-auto scrollbar-thin">
            <div className="transform scale-[0.98] origin-top transition-transform duration-200">
              {renderActiveTemplate()}
            </div>
          </div>
        </section>
      </main>

      {/* ── CHOOSE TEMPLATE MODAL WITH LIVE MINI CSS PREVIEWS ── */}
      {showModal && (
        <div 
          className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setShowModal(false)}
        >
          <div 
            className="bg-zinc-900 border border-zinc-800 rounded-3xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            <div className="p-6 border-b border-zinc-800/80 flex justify-between items-center bg-zinc-950/20">
              <div>
                <h2 className="text-lg font-extrabold text-white tracking-wide">Select ATS Layout Template</h2>
                <p className="text-xs text-zinc-400 mt-1">Scroll down to explore all 10 layout styles tailored to industry standards</p>
              </div>
              <button 
                onClick={() => setShowModal(false)} 
                className="w-8 h-8 rounded-full bg-zinc-800 hover:bg-zinc-700 text-white flex items-center justify-center text-lg font-bold transition-all"
              >
                ×
              </button>
            </div>

            <div className="p-6 overflow-y-auto grid md:grid-cols-2 gap-6 bg-zinc-950/10 max-h-[60vh] scrollbar-thin">
              {TEMPLATES.map((t) => (
                <div 
                  key={t.id}
                  onClick={() => { setTemplate(t.id); setShowModal(false); }}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex gap-4 text-left ${
                    template === t.id 
                      ? "border-emerald-500 bg-emerald-500/5 ring-1 ring-emerald-500/30 shadow-md"
                      : "border-zinc-800 bg-zinc-900 hover:border-zinc-750 hover:bg-zinc-850"
                  }`}
                >
                  <div className="w-[110px] flex-shrink-0">
                    <p className="text-[9px] text-zinc-500 font-bold mb-1 text-center">LAYOUT PREVIEW</p>
                    {renderMiniPreview(t.id)}
                  </div>

                  <div className="flex flex-col justify-between py-1">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h4 className="text-sm font-extrabold text-white">{t.name}</h4>
                        <span className="text-[8px] bg-zinc-800 text-zinc-400 font-bold px-1.5 py-0.5 rounded">
                          {t.type}
                        </span>
                      </div>
                      <p className="text-xs text-zinc-400 mt-1.5 leading-snug">{t.desc}</p>
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <span className="text-[10px] text-emerald-500 font-semibold">{t.score}</span>
                      <span className="text-xs font-bold">{t.rating}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 border-t border-zinc-800/80 text-center bg-zinc-950/20">
              <button 
                onClick={() => setShowModal(false)}
                className="bg-zinc-800 hover:bg-zinc-700 px-6 py-2 rounded-xl text-xs font-bold text-white transition-all"
              >
                Close Gallery
              </button>
            </div>
          </div>
        </div>
      )}

      <footer className="border-t border-zinc-900 mt-16 py-8 text-center text-xs text-zinc-500">
        <p>© 2026 AI Resume Maker Engine. Fully structured, ATS compliant output formats.</p>
      </footer>
      {resumeAnalysis && (

  <div className="mt-10 p-6 rounded-xl border">

    <h2 className="text-2xl font-bold mb-4">

      AI Resume Analysis 

    </h2>

    <pre className="whitespace-pre-wrap">

      {resumeAnalysis}

    </pre>

  </div>

)}
    </div>
  );
}