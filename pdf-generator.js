// Novo estilo de currículo com variações: clássico, moderno e elegante

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
  const name = document.getElementById('name').value || 'SEU NOME';
  const address = document.getElementById('address').value || '[Endereço]';
  const city = document.getElementById('city').value || '[Cidade, Estado, CEP]';
  const phone = document.getElementById('phone').value || '[telefone]';
  const email = document.getElementById('email').value || '[email]';
  const objective = document.getElementById('objective').value || '[Vaga pretendida ou área de atuação]';
  const education = document.getElementById('education').value || '';
  const experience = document.getElementById('experience').value || '';
  const languages = document.getElementById('languages').value || '';
  const awards = document.getElementById('awards').value || '';
  const style = document.getElementById('style').value || 'classic';

  const colorMap = {
    classic: '#000000',
    modern: '#007bff',
    elegant: '#4a2c2a'
  };
  const sectionColor = colorMap[style] || '#000000';

  const resumeHTML = `
    <div style="font-family: 'Open Sans', sans-serif; padding: 1rem; max-width: 800px; color: #333;">
      <h2 style="font-size: 2rem; font-weight: bold; margin-bottom: 0; color: ${sectionColor};">${name.toUpperCase()}</h2>
      <p style="margin: 0.25rem 0; font-size: 1rem; font-weight: 600;">${objective}</p>
      <hr style="margin: 1rem 0; border: none; border-top: 1px solid ${sectionColor};">
      <p style="margin: 0.2rem 0; font-size: 0.95rem;">Telefone: ${phone}</p>
      <p style="margin: 0.2rem 0; font-size: 0.95rem;">Email: ${email}</p>
      <p style="margin: 0.2rem 0; font-size: 0.95rem;">Endereço: ${address}, ${city}</p>
      ${sectionHTML('OBJETIVOS', objective, sectionColor)}
      ${sectionHTML('FORMAÇÃO', education, sectionColor)}
      ${sectionHTML('EXPERIÊNCIAS', experience, sectionColor)}
      ${sectionHTML('IDIOMAS', languages, sectionColor)}
      ${sectionHTML('PRÊMIOS E RECONHECIMENTOS', awards, sectionColor)}
    </div>
  `;
  document.getElementById('resumePreview').innerHTML = resumeHTML;
}

function sectionHTML(title, content, color) {
  if (!content) return '';
  return `
    <h3 style="font-size: 1rem; font-weight: bold; text-transform: uppercase; margin-top: 1.5rem; color: ${color};">${title}</h3>
    <p style="margin-top: 0.2rem; white-space: pre-line; font-size: 0.95rem;">${content}</p>
  `;
}

function generatePDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

  const margin = 20;
  const pageWidth = doc.internal.pageSize.getWidth();
  const maxWidth = pageWidth - margin * 2;
  let y = margin;

  const name = document.getElementById('name').value || 'SEU NOME';
  const address = document.getElementById('address').value || '[Endereço]';
  const city = document.getElementById('city').value || '[Cidade, Estado, CEP]';
  const phone = document.getElementById('phone').value || '[telefone]';
  const email = document.getElementById('email').value || '[email]';
  const objective = document.getElementById('objective').value || '';
  const education = document.getElementById('education').value || '';
  const experience = document.getElementById('experience').value || '';
  const languages = document.getElementById('languages').value || '';
  const awards = document.getElementById('awards').value || '';
  const style = document.getElementById('style').value || 'classic';

  const colorMap = {
    classic: [0, 0, 0],
    modern: [0, 123, 255],
    elegant: [74, 44, 42]
  };
  const sectionColor = colorMap[style] || [0, 0, 0];

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.setTextColor(...sectionColor);
  doc.text(name.toUpperCase(), margin, y);
  y += 10;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(12);
  doc.setTextColor(51, 51, 51);
  doc.text(`Telefone: ${phone}`, margin, y);
  y += 6;
  doc.text(`Email: ${email}`, margin, y);
  y += 6;
  doc.text(`Endereço: ${address}, ${city}`, margin, y);
  y += 8;
  doc.setDrawColor(...sectionColor);
  doc.line(margin, y, pageWidth - margin, y);
  y += 8;

  y = addSection(doc, 'OBJETIVOS', objective, y, margin, maxWidth, sectionColor);
  y = addSection(doc, 'FORMAÇÃO', education, y, margin, maxWidth, sectionColor);
  y = addSection(doc, 'EXPERIÊNCIAS', experience, y, margin, maxWidth, sectionColor);
  y = addSection(doc, 'IDIOMAS', languages, y, margin, maxWidth, sectionColor);
  y = addSection(doc, 'PRÊMIOS E RECONHECIMENTOS', awards, y, margin, maxWidth, sectionColor);

  doc.save(`${name}_curriculo.pdf`);
}

function addSection(doc, title, content, y, margin, maxWidth, color) {
  if (!content) return y;
  const lineHeight = 7;
  const pageHeight = doc.internal.pageSize.getHeight();

  if (y + lineHeight > pageHeight - margin) {
    doc.addPage();
    y = margin;
  }
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(...color);
  doc.text(title, margin, y);
  y += 6;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  doc.setTextColor(51, 51, 51);
  const lines = doc.splitTextToSize(content, maxWidth);
  lines.forEach(line => {
    if (y + lineHeight > pageHeight - margin) {
      doc.addPage();
      y = margin;
    }
    doc.text(line, margin, y);
    y += lineHeight;
  });
  y += 4;
  return y;
}

updateResume();
