function insertBullet(fieldId) {
  const textarea = document.getElementById(fieldId);
  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const value = textarea.value;
  textarea.value = value.substring(0, start) + '• ' + value.substring(end);
  textarea.selectionStart = textarea.selectionEnd = start + 2;
  updateResume();
}

function updateResume() {
  const fullName = document.getElementById('fullName').value || 'SEU NOME';
  const address = document.getElementById('address').value || 'Endereço';
  const city = document.getElementById('city').value || 'Cidade, Estado, CEP';
  const phone = document.getElementById('phone').value || 'Telefone';
  const email = document.getElementById('email').value || 'Email';
  const objective = normalizeText(document.getElementById('objective').value);
  const education = normalizeText(document.getElementById('education').value);
  const experience = normalizeText(document.getElementById('experience').value);
  const skills = normalizeText(document.getElementById('skills').value);
  const style = document.getElementById('style').value || 'classic';

  const colorMap = {
    classic: '#000000',
    modern: '#1e90ff',
    elegant: '#cc4d00'
  };
  const sectionColor = colorMap[style] || '#000000';

  const resumeHTML = `
    <div style="font-family: 'Poppins', sans-serif; padding: 2rem; max-width: 800px; color: #333;">
      <h2 style="font-family: 'Lora', serif; font-size: 3rem; font-weight: bold; margin-bottom: 1rem; color: ${sectionColor}; text-transform: uppercase;">${fullName}</h2>
      <p style="margin: 0.5rem 0; font-size: 1.8rem; font-weight: 600; color: ${sectionColor};">Vaga pretendida</p>
      <hr style="margin: 1rem 0; border: none; border-top: 2px solid ${sectionColor};">
      <div style="margin: 1rem 0 2rem 0; font-size: 1.4rem;">
        <p style="margin: 0.5rem 0; white-space: pre-wrap;">Telefone: ${phone}</p>
        <p style="margin: 0.5rem 0; white-space: pre-wrap;">Email: ${email}</p>
        <p style="margin: 0.5rem 0; white-space: pre-wrap;">Endereço: ${address}, ${city}</p>
      </div>
      ${objective ? sectionHTML('Objetivo', objective, sectionColor) : ''}
      ${experience ? sectionHTML('Experiência', experience, sectionColor) : ''}
      ${education ? sectionHTML('Formação', education, sectionColor) : ''}
      ${skills ? sectionHTML('Habilidades', skills, sectionColor) : ''}
    </div>
  `;

  document.getElementById('resumePreview').innerHTML = resumeHTML;
}

function sectionHTML(title, content, color) {
  return `
    <h3 style="font-family: 'Lora', serif; font-size: 2rem; font-weight: bold; margin-top: 4rem; margin-bottom: 2rem; color: ${color}; text-transform: uppercase;">${title}</h3>
    <p style="margin-top: 1rem; white-space: pre-wrap; font-size: 1.6rem; color: #333; line-height: 1.8;">${content}</p>
  `;
}

function generatePDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

  const margin = 15;
  const pageWidth = doc.internal.pageSize.getWidth();
  const maxWidth = pageWidth - margin * 2;
  const pageHeight = doc.internal.pageSize.getHeight();
  let y = margin;

  const fullName = document.getElementById('fullName').value || 'SEU_NOME';
  const address = document.getElementById('address').value || 'Endereço';
  const city = document.getElementById('city').value || 'Cidade, Estado, CEP';
  const phone = document.getElementById('phone').value || 'Telefone';
  const email = document.getElementById('email').value || 'Email';
  const objective = normalizeText(document.getElementById('objective').value);
  const education = normalizeText(document.getElementById('education').value);
  const experience = normalizeText(document.getElementById('experience').value);
  const skills = normalizeText(document.getElementById('skills').value);
  const style = document.getElementById('style').value || 'classic';

  const colorMap = {
    classic: [0, 0, 0],
    modern: [30, 144, 255],
    elegant: [204, 77, 0]
  };
  const sectionColor = colorMap[style] || [0, 0, 0];

  // Header Section
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(28);
  doc.setTextColor(...sectionColor);
  doc.text(fullName.toUpperCase(), margin, y);
  y += 14;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(17);
  doc.setTextColor(...sectionColor);
  doc.text('Vaga pretendida', margin, y);
  y += 10;

  doc.setDrawColor(...sectionColor);
  doc.line(margin, y, pageWidth - margin, y);
  y += 10;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(15);
  doc.setTextColor(51, 51, 51);

  // Split address into lines
  const addressLines = [`Endereço: ${address}, ${city}`].join('\n').split('\n');
  doc.text(`Telefone: ${phone}`, margin, y);
  y += 8;
  doc.text(`Email: ${email}`, margin, y);
  y += 8;
  addressLines.forEach(line => {
    if (y + 8 > pageHeight - margin) {
      doc.addPage();
      y = margin;
    }
    const wrappedLines = doc.splitTextToSize(line, maxWidth);
    wrappedLines.forEach(wrappedLine => {
      if (y + 8 > pageHeight - margin) {
        doc.addPage();
        y = margin;
      }
      doc.text(wrappedLine, margin, y);
      y += 8;
    });
  });
  y += 14;

  const lineHeight = 8;
  const sectionSpacing = 18;
  const bufferHeight = 20;

  // Function to estimate section height
  function estimateSectionHeight(content) {
    const lines = content.split('\n');
    let height = sectionSpacing;
    lines.forEach(line => {
      const wrappedLines = doc.splitTextToSize(line, maxWidth).length;
      height += wrappedLines * lineHeight;
    });
    return height + bufferHeight;
  }

  // Add sections with page break management
  if (objective) {
    const sectionHeight = estimateSectionHeight(objective);
    if (y + sectionHeight > pageHeight - margin) {
      doc.addPage();
      y = margin;
    }
    y = addSection(doc, 'Objetivo', objective, y, margin, maxWidth, sectionColor, lineHeight, sectionSpacing, pageHeight);
  }
  if (experience) {
    const sectionHeight = estimateSectionHeight(experience);
    if (y + sectionHeight > pageHeight - margin) {
      doc.addPage();
      y = margin;
    }
    y = addSection(doc, 'Experiência', experience, y, margin, maxWidth, sectionColor, lineHeight, sectionSpacing, pageHeight);
  }
  if (education) {
    const sectionHeight = estimateSectionHeight(education);
    if (y + sectionHeight > pageHeight - margin) {
      doc.addPage();
      y = margin;
    }
    y = addSection(doc, 'Formação', education, y, margin, maxWidth, sectionColor, lineHeight, sectionSpacing, pageHeight);
  }
  if (skills) {
    const sectionHeight = estimateSectionHeight(skills);
    if (y + sectionHeight > pageHeight - margin) {
      doc.addPage();
      y = margin;
    }
    y = addSection(doc, 'Habilidades', skills, y, margin, maxWidth, sectionColor, lineHeight, sectionSpacing, pageHeight);
  }

  const safeFileName = fullName.replace(/[^a-zA-Z0-9]/g, '_') || 'Curriculo';
  doc.save(`${safeFileName}_Curriculo.pdf`);

  // GTM Integration
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    'event': 'download_pdf',
    'category': 'PDF',
    'action': 'Download',
    'label': 'Curriculum_Download',
    'user_name': fullName,
    'style': style
  });
}

function addSection(doc, title, content, y, margin, maxWidth, color, lineHeight, sectionSpacing, pageHeight) {
  if (y + sectionSpacing > pageHeight - margin) {
    doc.addPage();
    y = margin;
  }

  y += sectionSpacing;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.setTextColor(...color);
  doc.text(title.toUpperCase(), margin, y);
  y += 11;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(15);
  doc.setTextColor(51, 51, 51);

  const lines = content.split('\n');
  lines.forEach(line => {
    if (y + lineHeight > pageHeight - margin) {
      doc.addPage();
      y = margin;
    }
    const wrappedLines = doc.splitTextToSize(line, maxWidth);
    wrappedLines.forEach(wrappedLine => {
      if (y + lineHeight > pageHeight - margin) {
        doc.addPage();
        y = margin;
      }
      doc.text(wrappedLine, margin, y);
      y += lineHeight;
    });
  });

  return y;
}

function normalizeText(text) {
  return text ? text.replace(/\r\n/g, '\n').replace(/\r/g, '\n') : '';
}

updateResume();