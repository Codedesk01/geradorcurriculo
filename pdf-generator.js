// Currículo com fontes maiores e títulos visíveis apenas se houver conteúdo

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
  const objective = document.getElementById('objective').value;
  const education = document.getElementById('education').value;
  const experience = document.getElementById('experience').value;
  const languages = document.getElementById('languages').value;
  const awards = document.getElementById('awards').value;
  const style = document.getElementById('style').value || 'classic';

  const colorMap = {
    classic: '#000000',
    modern: '#007bff',
    elegant: '#4a2c2a'
  };
  const sectionColor = colorMap[style] || '#000000';

  const resumeHTML = `
    <div style="font-family: 'Open Sans', sans-serif; padding: 1rem; max-width: 800px; color: #333;">
      <h2 style="font-size: 2.2rem; font-weight: bold; margin-bottom: 0; color: ${sectionColor};">${name.toUpperCase()}</h2>
      <p style="margin: 0.25rem 0; font-size: 1.1rem; font-weight: 600;">Vaga pretendida ou área de atuação</p>
      <hr style="margin: 1rem 0; border: none; border-top: 1px solid ${sectionColor};">
      <p style="margin: 0.2rem 0; font-size: 1rem;">Telefone: ${phone}</p>
      <p style="margin: 0.2rem 0; font-size: 1rem;">Email: ${email}</p>
      <p style="margin: 0.2rem 0 2rem 0; font-size: 1rem;">Endereço: ${address}, ${city}</p>
      ${objective ? sectionHTML('OBJETIVO', objective, sectionColor) : ''}
      ${experience ? sectionHTML('EXPERIÊNCIA', experience, sectionColor) : ''}
      ${education ? sectionHTML('FORMAÇÃO', education, sectionColor) : ''}
      ${languages ? sectionHTML('IDIOMAS', languages, sectionColor) : ''}
      ${awards ? sectionHTML('INFORMAÇÕES ADICIONAIS', awards, sectionColor) : ''}
    </div>
  `;

  document.getElementById('resumePreview').innerHTML = resumeHTML;
}

function sectionHTML(title, content, color) {
  return `
    <h3 style="font-size: 1.2rem; font-weight: bold; text-transform: uppercase; margin-top: 2rem; margin-bottom: 0.5rem; color: ${color};">${title}</h3>
    <p style="margin-top: 0.2rem; white-space: pre-line; font-size: 1rem;">${content}</p>
  `;
}

function generatePDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

  const margin = 20;
  const pageWidth = doc.internal.pageSize.getWidth();
  const maxWidth = pageWidth - margin * 2;
  const pageHeight = doc.internal.pageSize.getHeight();
  let y = margin;

  const name = document.getElementById('name').value || 'SEU NOME';
  const address = document.getElementById('address').value || '[Endereço]';
  const city = document.getElementById('city').value || '[Cidade, Estado, CEP]';
  const phone = document.getElementById('phone').value || '[telefone]';
  const email = document.getElementById('email').value || '[email]';
  const objective = document.getElementById('objective').value;
  const education = document.getElementById('education').value;
  const experience = document.getElementById('experience').value;
  const languages = document.getElementById('languages').value;
  const awards = document.getElementById('awards').value;
  const style = document.getElementById('style').value || 'classic';

  const colorMap = {
    classic: [0, 0, 0],
    modern: [0, 123, 255],
    elegant: [74, 44, 42]
  };
  const sectionColor = colorMap[style] || [0, 0, 0];

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.setTextColor(...sectionColor);
  doc.text(name.toUpperCase(), margin, y); y += 14;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(13);
  doc.setTextColor(51, 51, 51);
  doc.text(`Telefone: ${phone}`, margin, y); y += 8;
  doc.text(`Email: ${email}`, margin, y); y += 8;
  doc.text(`Endereço: ${address}, ${city}`, margin, y); y += 10;

  doc.setDrawColor(...sectionColor);
  doc.line(margin, y, pageWidth - margin, y); y += 10;

  if (objective) y = addSection(doc, 'OBJETIVO', objective, y, margin, maxWidth, sectionColor);
  if (experience) y = addSection(doc, 'EXPERIÊNCIA', experience, y, margin, maxWidth, sectionColor);
  if (education) y = addSection(doc, 'FORMAÇÃO', education, y, margin, maxWidth, sectionColor);
  if (languages) y = addSection(doc, 'IDIOMAS', languages, y, margin, maxWidth, sectionColor);
  if (awards) y = addSection(doc, 'INFORMAÇÕES ADICIONAIS', awards, y, margin, maxWidth, sectionColor);

  doc.save(`${name}_curriculo.pdf`);
}

function addSection(doc, title, content, y, margin, maxWidth, color) {
  const lineHeight = 8;
  const sectionSpacing = 14;
  const pageHeight = doc.internal.pageSize.getHeight();

  if (y + lineHeight > pageHeight - margin) {
    doc.addPage();
    y = margin;
  }

  y += sectionSpacing;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(15);
  doc.setTextColor(...color);
  doc.text(title, margin, y);
  y += 9;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(12);
  doc.setTextColor(51, 51, 51);

  const lines = doc.splitTextToSize(content, maxWidth);
  lines.forEach(line => {
    if (y + lineHeight > pageHeight - margin) {
      doc.addPage();
      y = margin;
    }
    doc.text(line, margin + 2, y);
    y += lineHeight;
  });

  return y;
}

updateResume();
