import { jsPDF } from "jspdf";
import fs from "fs";

async function generateCV() {
  console.log("Starting PDF generation...");
  fs.mkdirSync("public/assets", { recursive: true });

  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const photoUrl = "https://lh3.googleusercontent.com/aida-public/AB6AXuDUz4unZ8_5BLombgp3WCX1C8SDfJ2rT75qmFCmp93dG6q0rbPgdr4REtiZKaeuI_Eh9GVeNJBOgyf_TqW6uzm7rSeqe0QiYl7iD8PZkXLmFXkRjvG1UHEApJEQfRy-kVPK3mxkE4sNSAcG-hp7EQwudKNReG64aofejcN-RuUpfx2AugYOi6kLQlZkRvTTuaaVuWdWBm3naXSiFQh1YBSsSLInhHDXHl7LiUMYiJcOqlm8CPpSlRAU6uQPqR6VgKpBj1weXzCvFHMVUoQ";
  let base64Photo = "";
  let photoFormat: "PNG" | "JPEG" = "JPEG";

  try {
    if (fs.existsSync("public/Foto Pro.png")) {
      const buffer = fs.readFileSync("public/Foto Pro.png");
      base64Photo = "data:image/png;base64," + buffer.toString("base64");
      photoFormat = "PNG";
      console.log("Successfully loaded local profile photo.");
    } else {
      const res = await fetch(photoUrl);
      const buffer = await res.arrayBuffer();
      base64Photo = "data:image/jpeg;base64," + Buffer.from(buffer).toString("base64");
      photoFormat = "JPEG";
      console.log("Successfully fetched remote profile photo.");
    }
  } catch (err) {
    console.log("Could not load profile photo, falling back to a beautiful placeholder.", err);
  }

  // ==================== PAGE 1: PORTRAIT CV ====================
  const primaryColor = [31, 36, 45]; // #1f242d Slate
  const accentColor = [255, 95, 31]; // #ff5f1f Orange
  const leftBgColor = [203, 209, 214]; // #cbd1d6 Light Gray

  // Draw Header Banner
  doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.rect(0, 0, 210, 52, "F");

  // Profile Photo or initials
  if (base64Photo) {
    try {
      doc.setFillColor(255, 255, 255);
      doc.circle(28, 26, 17, "F");
      doc.addImage(base64Photo, photoFormat, 12, 10, 32, 32);
    } catch (e) {
      doc.setFillColor(accentColor[0], accentColor[1], accentColor[2]);
      doc.circle(28, 26, 16, "F");
      doc.setFont("helvetica", "bold");
      doc.setFontSize(16);
      doc.setTextColor(255, 255, 255);
      doc.text("SZ", 28, 31, { align: "center" });
    }
  } else {
    doc.setFillColor(accentColor[0], accentColor[1], accentColor[2]);
    doc.circle(28, 26, 16, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.setTextColor(255, 255, 255);
    doc.text("SZ", 28, 31, { align: "center" });
  }

  // Name and Subtitle
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.setTextColor(255, 255, 255);
  doc.text("Sandro Ismael Zhindón", 52, 21);
  doc.text("Cordero", 52, 29);

  // Decorative line
  doc.setDrawColor(255, 255, 255);
  doc.setLineWidth(1.2);
  doc.line(52, 36, 195, 36);

  // Left Column Background
  doc.setFillColor(leftBgColor[0], leftBgColor[1], leftBgColor[2]);
  doc.rect(0, 52, 72, 245, "F");

  // Helper to draw left side section headers
  const drawLeftHeader = (title: string, y: number) => {
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.6);
    doc.line(8, y, 64, y);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    doc.text(title, 8, y + 5);
    return y + 11;
  };

  // Helper to draw left side bullet points
  const drawLeftBullet = (text: string, x: number, y: number, maxW: number) => {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(30, 30, 30);
    doc.text("•", x, y);
    doc.setFont("helvetica", "normal");
    const lines = doc.splitTextToSize(text, maxW - 3);
    doc.text(lines, x + 3, y);
    return y + (lines.length * 4.2);
  };

  // Helper to draw right side section headers
  const drawRightHeader = (title: string, y: number) => {
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.6);
    doc.line(80, y, 200, y);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10.5);
    doc.setTextColor(0, 0, 0);
    doc.text(title, 80, y + 5);
    return y + 11;
  };

  // Helper to draw right side bullet points
  const drawRightBullet = (text: string, x: number, y: number, maxW: number) => {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(30, 30, 30);
    doc.text("•", x, y);
    doc.setFont("helvetica", "normal");
    const lines = doc.splitTextToSize(text, maxW - 3);
    doc.text(lines, x + 3, y);
    return y + (lines.length * 4.2);
  };

  // DRAW CONTACT INFO
  let leftY = 58;
  leftY = drawLeftHeader("CONTACTO", leftY);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(30, 30, 30);
  
  // Custom contact drawing matching original image
  doc.text("Azogues", 12, leftY);
  doc.text("0998773471", 12, leftY + 6);
  doc.text("sandro.zhindon@igad.edu.ec", 12, leftY + 12);
  doc.text("0302562392", 12, leftY + 18);
  leftY += 26;

  // DRAW HABILIDADES
  leftY = drawLeftHeader("HABILIDADES", leftY);
  const skillsList = [
    "Manejo de Adobe: Photoshop, Illustrator, After Effects, InDesign y Premiere",
    "Manejo de Autodesk Maya",
    "Manejo de DaVinci Resolve",
    "Manejo de Toon Boom Harmony",
    "Manejo de Word/Excel/PowerPoint",
    "IA generativa"
  ];
  skillsList.forEach(skill => {
    leftY = drawLeftBullet(skill, 8, leftY, 56);
  });
  leftY += 6;

  // DRAW DIPLOMAS
  leftY = drawLeftHeader("DIPLOMAS", leftY);
  const diplomasList = [
    "Certificado de Escultura 3D.",
    "Certificado de Uso Profesional DaVinci Resolve.",
    "Certificado de Inteligencia Artificial Aliada Creativa para el Diseño Publicitario.",
    "Certificado de Motion Graphics en AE - Técnicas para medios Audiovisuales.",
    "Certificado de IA para Audiovisuales: Herramientas y Aplicaciones.",
    "Certificado Flujos de Trabajo con IA"
  ];
  diplomasList.forEach(diploma => {
    leftY = drawLeftBullet(diploma, 8, leftY, 56);
  });

  // RIGHT COLUMN
  let rightY = 58;

  // DRAW FORMACIÓN
  rightY = drawRightHeader("FORMACIÓN", rightY);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(0, 0, 0);
  doc.text("Tecnólogo Superior Universitario: Diseño de Animación y Arte Digital", 80, rightY);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(80, 80, 80);
  doc.text("04/2023 - 09/2025", 200, rightY, { align: "right" });
  rightY += 4;
  doc.setFont("helvetica", "italic");
  doc.text("Universitario IGAD - Guayaquil", 80, rightY);
  rightY += 8;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(0, 0, 0);
  doc.text("Egresado: Ingeniería en Ciencias de la Computación", 80, rightY);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(80, 80, 80);
  doc.text("11/2017 - 03/2023", 200, rightY, { align: "right" });
  rightY += 4;
  doc.setFont("helvetica", "italic");
  doc.text("Universidad Central del Ecuador - Quito", 80, rightY);
  rightY += 8;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(0, 0, 0);
  doc.text("Bachiller Técnico de Servicios: Aplicaciones Informáticas", 80, rightY);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(80, 80, 80);
  doc.text("09/2011 - 07/2017", 200, rightY, { align: "right" });
  rightY += 4;
  doc.setFont("helvetica", "italic");
  doc.text("Unidad Educativa Juan Bautista Vásquez - Azogues", 80, rightY);
  rightY += 12;

  // DRAW HISTORIAL LABORAL
  rightY = drawRightHeader("HISTORIAL LABORAL", rightY);

  // Job 1
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(0, 0, 0);
  doc.text("Asesor comercial de ventas", 80, rightY);
  doc.setFont("helvetica", "normal");
  doc.text("03/2022 - 09/2022", 200, rightY, { align: "right" });
  rightY += 4;
  doc.setFont("helvetica", "italic");
  doc.text("Novalider - Quito, Pichincha", 80, rightY);
  rightY += 5;
  rightY = drawRightBullet("Comunicación con los clientes a través de llamadas, chats y correos.", 82, rightY, 118);
  rightY = drawRightBullet("Call Center", 82, rightY, 118);
  rightY += 4;

  // Job 2
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(0, 0, 0);
  doc.text("Diseñador gráfico online", 80, rightY);
  doc.setFont("helvetica", "normal");
  doc.text("04/2023 - 08/2023", 200, rightY, { align: "right" });
  rightY += 4;
  doc.setFont("helvetica", "italic");
  doc.text("FUVIDA - Guayaquil, Guayas", 80, rightY);
  rightY += 5;
  rightY = drawRightBullet("Creación de infografías para redes sociales.", 82, rightY, 118);
  rightY += 4;

  // Job 3
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(0, 0, 0);
  doc.text("Diseñador gráfico online", 80, rightY);
  doc.setFont("helvetica", "normal");
  doc.text("02/2025 - 06/2025", 200, rightY, { align: "right" });
  rightY += 4;
  doc.setFont("helvetica", "italic");
  doc.text("Fundación Paz y Esperanza - Guayaquil, Guayas", 80, rightY);
  rightY += 5;
  rightY = drawRightBullet("Creación de posts y piezas gráficas para redes sociales.", 82, rightY, 118);
  rightY += 4;

  // Job 4
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(0, 0, 0);
  doc.text("Diseñador gráfico", 80, rightY);
  doc.setFont("helvetica", "normal");
  doc.text("04/2024 - Actual", 200, rightY, { align: "right" });
  rightY += 4;
  doc.setFont("helvetica", "italic");
  doc.text("Lui Vibes - Azogues, Cañar", 80, rightY);
  rightY += 5;
  rightY = drawRightBullet("Adaptación, actualización y modificación de diseños existentes para personalización de artículos.", 82, rightY, 118);
  rightY = drawRightBullet("Creación de diseños personalizados para los clientes desde el concepto hasta su finalización.", 82, rightY, 118);
  rightY = drawRightBullet("Creación y edición de contenido multimedia, videos y posts para redes sociales.", 82, rightY, 118);
  rightY += 4;

  // DRAW IDIOMAS
  rightY = drawRightHeader("IDIOMAS", rightY);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(0, 0, 0);
  doc.text("Español:", 80, rightY);
  doc.setFont("helvetica", "normal");
  doc.text("Idioma nativo", 94, rightY);
  
  doc.setFont("helvetica", "bold");
  doc.text("Inglés:", 135, rightY);
  doc.setFont("helvetica", "normal");
  doc.text("A2", 146, rightY);

  // English proficiency bar decoration
  doc.setFillColor(200, 200, 200);
  doc.rect(135, rightY + 2.5, 40, 2, "F");
  doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.rect(135, rightY + 2.5, 12, 2, "F"); // basic block indicator
  doc.setFontSize(7);
  doc.setTextColor(100, 100, 100);
  doc.text("Básico", 135, rightY + 7);
  
  rightY += 12;

  // DRAW REFERENCIAS
  rightY = drawRightHeader("REFERENCIAS", rightY);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(0, 0, 0);
  doc.text("Mgst. Priscila Ruilova – Lui Vibes – 0979285456.", 80, rightY);
  doc.text("Mgst. Karina Solís - Fundación Paz y Esperanza – 0995390600.", 80, rightY + 4.5);


  // Helper to draw BIG SCHOOL landscape certificates (A4 Landscape = 297 x 210)
  const drawBigSchoolCertificate = (subtitle: string, descriptionText: string, date: string) => {
    doc.addPage([297, 210], "landscape");

    // Dark cosmic background
    doc.setFillColor(6, 6, 18);
    doc.rect(0, 0, 297, 210, "F");

    // Draw tech grid decorative circles / lines (recreating modern background style)
    doc.setDrawColor(255, 255, 255, 0.05);
    doc.setLineWidth(0.2);
    for (let i = 0; i < 297; i += 15) {
      doc.line(i, 0, i, 210);
    }
    for (let j = 0; j < 210; j += 15) {
      doc.line(0, j, 297, j);
    }

    // Top Brand Logos
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(180, 100, 255); // neon purple
    doc.rect(38, 16, 6, 6, "F");
    doc.setTextColor(255, 255, 255);
    doc.text("IA", 41, 20, { align: "center" });
    doc.setFontSize(9);
    doc.text("JON\nHERNÁNDEZ", 47, 18.5);

    doc.setDrawColor(255, 255, 255, 0.2);
    doc.line(148, 14, 148, 24);

    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("BIG", 158, 21);
    doc.setFont("helvetica", "normal");
    doc.text("school", 168, 21);

    // Title
    doc.setFont("helvetica", "bold");
    doc.setFontSize(24);
    doc.setTextColor(255, 255, 255);
    doc.text("CERTIFICADO DE ASISTENCIA", 148, 48, { align: "center" });

    doc.setFontSize(14);
    doc.setTextColor(180, 100, 255);
    doc.text(subtitle, 148, 58, { align: "center" });

    // Otorgado a
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(120, 120, 150);
    doc.text("OTORGADO A:", 148, 74, { align: "center" });

    // Recipient Name
    doc.setFont("helvetica", "bold");
    doc.setFontSize(26);
    doc.setTextColor(255, 255, 255);
    doc.text("Ismael Zhindón Cordero", 148, 88, { align: "center" });

    // Description (Paragraph)
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10.5);
    doc.setTextColor(170, 170, 190);
    const descLines = doc.splitTextToSize(descriptionText, 200);
    doc.text(descLines, 148, 105, { align: "center" });

    // Duration and Date
    doc.setDrawColor(180, 100, 255, 0.4);
    doc.rect(70, 132, 35, 8);
    doc.rect(70, 144, 35, 8);
    doc.setFontSize(8);
    doc.setTextColor(180, 100, 255);
    doc.text("DURACIÓN:", 87.5, 137, { align: "center" });
    doc.text("FECHA:", 87.5, 149, { align: "center" });

    doc.setFontSize(10);
    doc.setTextColor(255, 255, 255);
    doc.text("6 horas", 150, 137);
    doc.text(date, 150, 149);

    // Signatures
    doc.setDrawColor(255, 255, 255, 0.2);
    doc.line(50, 185, 120, 185);
    doc.line(177, 185, 247, 185);

    // Simulated beautiful signatures
    doc.setFont("helvetica", "italic");
    doc.setFontSize(14);
    doc.setTextColor(255, 255, 255);
    doc.text("R. Fons", 85, 180, { align: "center" });
    doc.text("J. Hernández", 212, 180, { align: "center" });

    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.5);
    doc.text("Romuald Fons", 85, 190, { align: "center" });
    doc.text("Jon Hernández", 212, 190, { align: "center" });
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(120, 120, 150);
    doc.text("CEO de BIG school", 85, 194, { align: "center" });
    doc.text("Director Máster de IA", 212, 194, { align: "center" });
  };

  // Page 2: BIG School - De 0 a Agentes
  drawBigSchoolCertificate(
    "AL CURSO DE IA",
    "Certificado de asistencia al Curso de IA. De 0 a Agentes: domina la IA, gana competitividad y aprende cómo los agentes trabajan por ti.",
    "29/05/2026"
  );

  // Page 3: BIG School - Vibe Coding y Automatizaciones
  drawBigSchoolCertificate(
    "AL CURSO DE IA 2026",
    "Certificado de asistencia a las jornadas de Inteligencia Artificial, incluyendo Vibe Coding y Automatizaciones, organizadas por BIG school.",
    "16/01/2026"
  );

  // Page 4: BIG School - IA WORKFLOWS
  drawBigSchoolCertificate(
    "CURSO DE INICIACIÓN A LOS FLUJOS DE TRABAJO CON IA",
    "Certificado de asistencia a las jornadas formativas \"IA WORKFLOWS\" de BIG school.",
    "09/09/2025"
  );


  // Helper to draw IGAD landscape certificates (A4 Landscape = 297 x 210)
  const drawIgadCertificate = (recipientName: string, certificateTitle: string, dateText: string) => {
    doc.addPage([297, 210], "landscape");

    // Clean white certificate background
    doc.setFillColor(255, 255, 255);
    doc.rect(0, 0, 297, 210, "F");

    // Left sidebar (Black band with teal border)
    doc.setFillColor(15, 15, 20);
    doc.rect(10, 0, 42, 210, "F");
    doc.setFillColor(72, 191, 227); // Teal sidebar decoration accent
    doc.rect(8, 0, 2, 210, "F");
    doc.rect(52, 0, 2, 210, "F");

    // Wreath / Seal decorative drawing inside Left sidebar
    doc.setDrawColor(255, 255, 255, 0.4);
    doc.setLineWidth(1);
    doc.circle(31, 140, 14);
    doc.setFillColor(30, 30, 40);
    doc.circle(31, 140, 11, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(255, 255, 255);
    doc.text("IGAD", 31, 143, { align: "center" });

    // IGAD Top Right Logo
    doc.setFont("helvetica", "bold");
    doc.setFontSize(28);
    doc.setTextColor(0, 0, 0);
    doc.text("IGAD", 230, 25);
    doc.setFontSize(10);
    doc.text("UNIVERSITARIO", 230, 31);
    
    // Mini Logo abstract shape
    doc.setFillColor(0, 0, 0);
    doc.triangle(215, 17, 225, 17, 220, 29, "F");
    doc.setFillColor(72, 191, 227);
    doc.circle(220, 22, 1.5, "F");

    // Main Headers
    doc.setFont("helvetica", "bold");
    doc.setFontSize(32);
    doc.setTextColor(25, 25, 30);
    doc.text("EDUCACIÓN", 70, 60);
    doc.setTextColor(0, 0, 0);
    doc.text("CONTINUA", 70, 72);

    doc.setFontSize(7.5);
    doc.setTextColor(100, 100, 100);
    doc.text("EL INSTITUTO SUPERIOR TECNOLÓGICO GRÁFICO DE ARTES Y CIENCIAS DIGITALES CONFIERE EL PRESENTE CERTIFICADO A:", 70, 84);

    // Name
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.setTextColor(0, 0, 0);
    doc.text(recipientName, 70, 98);

    // Thick underline
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.8);
    doc.line(70, 102, 270, 102);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(100, 100, 100);
    doc.text("POR HABER APROBADO CON TODOS LOS REQUISITOS ACADÉMICOS DE LA CERTIFICACIÓN EN:", 70, 110);

    // Certification Title
    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.setTextColor(0, 0, 0);
    doc.text(certificateTitle, 70, 122);

    // Month and location
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(120, 120, 120);
    doc.text("DADO EN LA CIUDAD DE GUAYAQUIL, PROVINCIA DEL GUAYAS, REPÚBLICA DEL ECUADOR,", 70, 136);
    
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(0, 0, 0);
    doc.text(dateText.toUpperCase(), 70, 144);

    // Signatures
    doc.setDrawColor(100, 100, 100, 0.4);
    doc.line(70, 185, 150, 185);
    doc.line(190, 185, 270, 185);

    // Signature path or text representation
    doc.setFont("helvetica", "italic");
    doc.setFontSize(12);
    doc.text("Dr. Efraín Paredes", 110, 180, { align: "center" });
    doc.text("Soledad Gutiérrez", 230, 180, { align: "center" });

    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.5);
    doc.text("Dr. Efraín Paredes", 110, 190, { align: "center" });
    doc.text("Soledad Gutiérrez", 230, 190, { align: "center" });
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(100, 100, 100);
    doc.text("RECTOR", 110, 194, { align: "center" });
    doc.text("SECRETARÍA GENERAL", 230, 194, { align: "center" });
  };

  // Page 5: IGAD - IA PARA AUDIOVISUALES
  drawIgadCertificate(
    "ZHINDON CORDERO ISMAEL",
    "IA PARA AUDIOVISUALES: HERRAMIENTAS Y APLICACIONES",
    "MARZO 2025"
  );

  // Page 6: IGAD - MOTION GRAPHICS
  drawIgadCertificate(
    "ZHINDON CORDERO SANDRO ISMAEL",
    "MOTION GRAPHICS EN AE - TÉCNICAS PARA MEDIOS AUDIOVISUALES",
    "Agosto 2024"
  );

  // Page 7: IGAD - INTELIGENCIA ARTIFICIAL ALIADA CREATIVA
  drawIgadCertificate(
    "ZHINDON CORDERO ISMAEL",
    "INTELIGENCIA ARTIFICIAL ALIADA CREATIVA PARA EL DISEÑO PUBLICITARIO",
    "Agosto 2024"
  );

  // Page 8: IGAD - USO PROFESIONAL DAVINCI RESOLVE
  drawIgadCertificate(
    "ZHINDON CORDERO ISMAEL",
    "USO PROFESIONAL DAVINCI RESOLVE",
    "MARZO 2024"
  );

  // Page 9: IGAD - ESCULTURA 3D
  drawIgadCertificate(
    "ZHINDON CORDERO SANDRO ISMAEL",
    "ESCULTURA 3D",
    "MARZO 2024"
  );


  // Output compilation buffer and save to public assets directory
  const buffer = Buffer.from(doc.output("arraybuffer"));
  fs.writeFileSync("public/assets/cv.pdf", buffer);
  console.log("SUCCESS: Multi-page CV PDF written successfully to public/assets/cv.pdf!");
}

generateCV();
