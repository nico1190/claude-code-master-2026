const fs = require('fs');
const path = require('path');
const {
  Document, Packer, Paragraph, TextRun, ImageRun,
  Table, TableRow, TableCell, Header, Footer,
  AlignmentType, PageOrientation, LevelFormat,
  ExternalHyperlink, HeadingLevel, BorderStyle, WidthType,
  ShadingType, PageBreak, PageNumber, TabStopType, TabStopPosition,
} = require('docx');

const REPO = __dirname;
const SHOTS = path.join(REPO, 'screenshots');

const orange = 'D97757';
const purple = '6B5BB7';
const greyDim = '666666';
const greyBorder = 'CCCCCC';
const codeBg = 'F4F4F4';

function p(text, opts = {}) {
  return new Paragraph({ children: [new TextRun({ text, ...opts })], ...opts.paragraph });
}

function heading(text, level) {
  return new Paragraph({ heading: level, children: [new TextRun({ text })] });
}

function link(text, url) {
  return new ExternalHyperlink({
    children: [new TextRun({ text, style: 'Hyperlink' })],
    link: url,
  });
}

function code(textLines, opts = {}) {
  // each line as a paragraph in monospace
  return textLines.map(line =>
    new Paragraph({
      children: [new TextRun({ text: line || ' ', font: 'Consolas', size: 18 })],
      shading: { type: ShadingType.CLEAR, fill: codeBg },
      spacing: { before: 0, after: 0 },
    })
  );
}

function image(filename, w = 540, h = 340) {
  const fullPath = path.join(SHOTS, filename);
  if (!fs.existsSync(fullPath)) {
    return p(`[Imagen no encontrada: ${filename}]`, { italics: true, color: greyDim });
  }
  return new Paragraph({
    alignment: AlignmentType.CENTER,
    children: [new ImageRun({
      type: 'png',
      data: fs.readFileSync(fullPath),
      transformation: { width: w, height: h },
      altText: { title: filename, description: filename, name: filename },
    })],
  });
}

function caption(text) {
  return new Paragraph({
    alignment: AlignmentType.CENTER,
    children: [new TextRun({ text, italics: true, color: greyDim, size: 18 })],
    spacing: { before: 80, after: 200 },
  });
}

function blank() { return new Paragraph({ children: [new TextRun('')] }); }

// ============================================================
// CONTENT
// ============================================================

const title = new Paragraph({
  alignment: AlignmentType.CENTER,
  spacing: { before: 240, after: 120 },
  children: [new TextRun({
    text: 'Claude Code Master 2026',
    size: 48, bold: true, font: 'Arial', color: orange,
  })],
});

const subtitle = new Paragraph({
  alignment: AlignmentType.CENTER,
  spacing: { after: 240 },
  children: [new TextRun({
    text: 'Podcast + Chatbot RAG sobre Claude Code',
    size: 26, font: 'Arial', color: '333333',
  })],
});

const tagline = new Paragraph({
  alignment: AlignmentType.CENTER,
  spacing: { after: 480 },
  children: [new TextRun({
    text: 'Audio Overview de NotebookLM + chatbot RAG con Gemini Free, sobre 10 articulos curados de Claude Code (mayo 2026)',
    size: 22, italics: true, color: greyDim,
  })],
});

// Cover image (square podcast art)
const coverImg = (() => {
  const coverPath = path.join(REPO, 'cover.jpeg');
  if (!fs.existsSync(coverPath)) return blank();
  return new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 240 },
    children: [new ImageRun({
      type: 'jpg',
      data: fs.readFileSync(coverPath),
      transformation: { width: 320, height: 320 },
      altText: { title: 'Podcast cover', description: 'Las mejores practicas de Claude', name: 'cover' },
    })],
  });
})();

const studentInfo = new Paragraph({
  alignment: AlignmentType.CENTER,
  spacing: { before: 240, after: 240 },
  children: [
    new TextRun({ text: 'Nicolas (Nico1190)', size: 22, font: 'Arial' }),
    new TextRun({ text: '\nMayo 2026', size: 20, font: 'Arial', color: greyDim }),
  ],
});

// ============================================================
// SECTION 1: Links publicos
// ============================================================
const linksSection = [
  new Paragraph({ children: [new PageBreak()] }),
  heading('Enlaces de la entrega', HeadingLevel.HEADING_1),
  blank(),

  new Paragraph({
    spacing: { after: 120 },
    children: [
      new TextRun({ text: 'Repositorio publico de GitHub:  ', bold: true }),
      link('https://github.com/nico1190/claude-code-master-2026',
           'https://github.com/nico1190/claude-code-master-2026'),
    ],
  }),

  new Paragraph({
    spacing: { after: 120 },
    children: [
      new TextRun({ text: 'App desplegada (HuggingFace Spaces):  ', bold: true }),
      link('https://huggingface.co/spaces/Nico1190/claude-code-master-2026',
           'https://huggingface.co/spaces/Nico1190/claude-code-master-2026'),
    ],
  }),

  new Paragraph({
    spacing: { after: 240 },
    children: [
      new TextRun({ text: 'NotebookLM publico (bonus):  ', bold: true }),
      link('https://notebooklm.google.com/notebook/d41b8b19-190a-44b2-8aa1-b40c32e98405',
           'https://notebooklm.google.com/notebook/d41b8b19-190a-44b2-8aa1-b40c32e98405'),
    ],
  }),

  blank(),
  heading('Resumen del proyecto', HeadingLevel.HEADING_2),
  blank(),
  new Paragraph({
    children: [new TextRun({
      text: 'La aplicacion combina dos canales de consulta sobre Claude Code:',
    })],
  }),
  new Paragraph({
    numbering: { reference: 'bullets', level: 0 },
    children: [new TextRun({
      text: 'Un podcast Audio Overview generado con NotebookLM (~27 min, espanol Latam) a partir de 10 articulos curados.',
    })],
  }),
  new Paragraph({
    numbering: { reference: 'bullets', level: 0 },
    children: [new TextRun({
      text: 'Un chatbot RAG embebido que responde preguntas con citas, usando los mismos 10 articulos como base de conocimiento y Gemini Free como motor LLM (sin tarjeta de credito).',
    })],
  }),
  new Paragraph({
    numbering: { reference: 'bullets', level: 0 },
    children: [new TextRun({
      text: 'Recursos complementarios en NotebookLM: Mind Map, FAQ exhaustivo, Briefing Doc.',
    })],
  }),
  blank(),
  new Paragraph({
    children: [new TextRun({
      text: 'Cada visitante carga su propia API key gratuita de Google AI Studio (queda en sessionStorage del navegador, nunca se comparte). El audio del podcast se reproduce sin necesidad de key.',
    })],
  }),
];

// ============================================================
// SECTION 2: Capturas
// ============================================================
const screenshotsSection = [
  new Paragraph({ children: [new PageBreak()] }),
  heading('Capturas de pantalla de la app funcionando', HeadingLevel.HEADING_1),
  blank(),

  heading('1. Hero con Audio Overview', HeadingLevel.HEADING_2),
  new Paragraph({
    children: [new TextRun({
      text: 'La pagina arranca con la portada del podcast a la izquierda y a la derecha el titulo, datos del episodio, reproductor del audio (~27 min) y CTAs. El audio se reproduce sin pedir API key.',
    })],
    spacing: { after: 160 },
  }),
  image('01-hero.png'),
  caption('Hero del podcast con cover, audio nativo y boton para chatear.'),

  heading('2. Tarjetas de invitacion al chatbot', HeadingLevel.HEADING_2),
  new Paragraph({
    children: [new TextRun({
      text: 'Despues del audio, 6 tarjetas pre-cargadas funcionan como entry points al chatbot, cada una con una pregunta concreta sobre los temas centrales del podcast.',
    })],
    spacing: { after: 160 },
  }),
  image('02-invite-cards.png'),
  caption('CLAUDE.md, Skills vs MCP, Plan Mode, Auto Memory, Hooks y Novedades 2026.'),

  heading('3. Chat embebido con sidebar de articulos', HeadingLevel.HEADING_2),
  new Paragraph({
    children: [new TextRun({
      text: 'Sidebar izquierda con filtro por 25 topicos y la lista de los 10 articulos. Main panel con streaming de respuestas, render markdown y citaciones a las fuentes.',
    })],
    spacing: { after: 160 },
  }),
  image('03-chat.png'),
  caption('Layout del chatbot: filtro por temas, articulos clickeables y composer.'),

  heading('4. Recursos del notebook', HeadingLevel.HEADING_2),
  new Paragraph({
    children: [new TextRun({
      text: 'Cuatro tarjetas con links a los artifacts generados en NotebookLM con las mismas 10 fuentes.',
    })],
    spacing: { after: 160 },
  }),
  image('04-resources.png'),
  caption('Audio Overview, Mind Map, FAQ exhaustivo y Briefing Doc.'),

  heading('5. Modal de configuracion de API key', HeadingLevel.HEADING_2),
  new Paragraph({
    children: [new TextRun({
      text: 'Cuando el visitante intenta chatear por primera vez, aparece este modal. La key vive solo en sessionStorage del navegador y se borra al cerrar la pestana.',
    })],
    spacing: { after: 160 },
  }),
  image('05-api-key-modal.png'),
  caption('Modal con link directo a aistudio.google.com/apikey (free tier sin tarjeta).'),
];

// ============================================================
// SECTION 3: Capturas de codigo
// ============================================================
const codeSection = [
  new Paragraph({ children: [new PageBreak()] }),
  heading('Capturas de codigo (partes mas relevantes)', HeadingLevel.HEADING_1),
  blank(),

  heading('1. Construccion del system prompt para Gemini', HeadingLevel.HEADING_2),
  new Paragraph({
    children: [new TextRun({
      text: 'Los 10 articulos completos en markdown se inyectan en el systemInstruction con metadata XML-like, dandole al modelo todo el contexto que necesita para responder con citas precisas.',
    })],
    spacing: { after: 160 },
  }),
  ...code([
    'function buildSystemInstruction() {',
    '  const role = `Eres "Claude Code Master", un experto que',
    'responde preguntas sobre Claude Code basandote estrictamente',
    'en los 10 articulos curados de mayo 2026.',
    '',
    'REGLAS:',
    '1. Responde SIEMPRE en espanol, claro y directo.',
    '2. Cita los articulos asi: [#N: titulo](URL)',
    '3. Si no esta cubierto, marca "(inferencia, no esta en los',
    '   articulos)".',
    '...`;',
    '',
    '  let articlesBlock = "<articles>\\n";',
    '  for (const a of ARTICLES_DATA.articles) {',
    '    articlesBlock += `\\n<article id="${a.id}"',
    '      title=${JSON.stringify(a.title)}',
    '      url="${a.url}"',
    '      official="${a.official}">\\n`;',
    '    articlesBlock += a.content_markdown;',
    '    articlesBlock += "\\n</article>\\n";',
    '  }',
    '  articlesBlock += "</articles>";',
    '',
    '  return { parts: [{ text: role + "\\n\\n" + articlesBlock }] };',
    '}',
  ]),
  blank(),

  heading('2. Streaming SSE de Gemini', HeadingLevel.HEADING_2),
  new Paragraph({
    children: [new TextRun({
      text: 'El chat consume el endpoint :streamGenerateContent con alt=sse. Cada chunk acumula texto y re-renderiza markdown en vivo con marked.js.',
    })],
    spacing: { after: 160 },
  }),
  ...code([
    'const url = `https://generativelanguage.googleapis.com/v1beta/' +
    'models/${state.model}:streamGenerateContent?alt=sse`;',
    '',
    'const resp = await fetch(url, {',
    '  method: "POST",',
    '  headers: {',
    '    "content-type": "application/json",',
    '    "x-goog-api-key": state.apiKey,  // del usuario, sessionStorage',
    '  },',
    '  body: JSON.stringify({',
    '    systemInstruction: buildSystemInstruction(),',
    '    contents,',
    '    generationConfig: { maxOutputTokens: 4096, temperature: 0.7 },',
    '  }),',
    '});',
    '',
    'const reader = resp.body.getReader();',
    'let assistantText = "";',
    'while (true) {',
    '  const { done, value } = await reader.read();',
    '  if (done) break;',
    '  // parsear SSE, acumular texto y re-renderizar markdown',
    '  const parts = evt.candidates?.[0]?.content?.parts || [];',
    '  for (const p of parts) assistantText += p.text;',
    '  bubble.innerHTML = marked.parse(assistantText);',
    '}',
  ]),
  blank(),

  heading('3. Pipeline de descarga con Trafilatura', HeadingLevel.HEADING_2),
  new Paragraph({
    children: [new TextRun({
      text: 'download_articles.py baja las 10 URLs y las convierte a markdown limpio preservando enlaces y tablas.',
    })],
    spacing: { after: 160 },
  }),
  ...code([
    'import trafilatura, requests, json',
    '',
    'def html_to_markdown(html: str, url: str) -> str:',
    '    return trafilatura.extract(',
    '        html,',
    '        url=url,',
    '        output_format="markdown",',
    '        include_links=True,',
    '        include_tables=True,',
    '        favor_recall=True,',
    '    )',
    '',
    'for source in sources:',
    '    html = requests.get(source["url"], headers=HEADERS,',
    '                        timeout=30).text',
    '    source["content_markdown"] = html_to_markdown(html, source["url"])',
  ]),
  blank(),

  heading('4. Build del HTML final (single-file)', HeadingLevel.HEADING_2),
  new Paragraph({
    children: [new TextRun({
      text: 'build_chatbot.py reemplaza el placeholder __ARTICLES_JSON__ por el JSON serializado, produciendo un index.html autocontenido de ~240 KB con los 10 articulos embebidos.',
    })],
    spacing: { after: 160 },
  }),
  ...code([
    'template = TEMPLATE.read_text(encoding="utf-8")',
    'articles = json.load(open(ARTICLES))',
    'js_literal = json.dumps(articles, ensure_ascii=False)',
    'output = template.replace("__ARTICLES_JSON__", js_literal)',
    'OUTPUT.write_text(output, encoding="utf-8")',
  ]),
];

// ============================================================
// SECTION 4: Stack y arquitectura
// ============================================================
const stackSection = [
  new Paragraph({ children: [new PageBreak()] }),
  heading('Stack tecnologico', HeadingLevel.HEADING_1),
  blank(),

  new Paragraph({
    numbering: { reference: 'bullets', level: 0 },
    children: [
      new TextRun({ text: 'Frontend: ', bold: true }),
      new TextRun('HTML5 single-file, CSS custom (sin frameworks), JS vanilla'),
    ],
  }),
  new Paragraph({
    numbering: { reference: 'bullets', level: 0 },
    children: [
      new TextRun({ text: 'Markdown render: ', bold: true }),
      new TextRun('marked.js (CDN)'),
    ],
  }),
  new Paragraph({
    numbering: { reference: 'bullets', level: 0 },
    children: [
      new TextRun({ text: 'Syntax highlight: ', bold: true }),
      new TextRun('highlight.js (CDN)'),
    ],
  }),
  new Paragraph({
    numbering: { reference: 'bullets', level: 0 },
    children: [
      new TextRun({ text: 'Audio: ', bold: true }),
      new TextRun('HTML5 <audio> nativo'),
    ],
  }),
  new Paragraph({
    numbering: { reference: 'bullets', level: 0 },
    children: [
      new TextRun({ text: 'LLM: ', bold: true }),
      new TextRun('Gemini API (free tier, sin tarjeta de credito)'),
    ],
  }),
  new Paragraph({
    numbering: { reference: 'bullets', level: 0 },
    children: [
      new TextRun({ text: 'Curaduria/artifacts: ', bold: true }),
      new TextRun('NotebookLM (Audio Overview, Mind Map, FAQ, Briefing)'),
    ],
  }),
  new Paragraph({
    numbering: { reference: 'bullets', level: 0 },
    children: [
      new TextRun({ text: 'Build pipeline: ', bold: true }),
      new TextRun('Python (trafilatura para HTML→markdown, json.dumps para inyeccion)'),
    ],
  }),
  new Paragraph({
    numbering: { reference: 'bullets', level: 0 },
    children: [
      new TextRun({ text: 'Hosting: ', bold: true }),
      new TextRun('HuggingFace Spaces (Static SDK) + GitHub LFS para el audio (52 MB)'),
    ],
  }),
  blank(),
  blank(),

  heading('Las 10 fuentes curadas', HeadingLevel.HEADING_2),
  blank(),
  new Paragraph({
    children: [new TextRun({
      text: 'Mix de 5 oficiales (Anthropic) + 5 comunidad, cubriendo prompting, planning, skills, .md/memoria, MCP y novedades.',
    })],
    spacing: { after: 160 },
  }),

  // table of sources
  (() => {
    const border = { style: BorderStyle.SINGLE, size: 4, color: greyBorder };
    const borders = { top: border, bottom: border, left: border, right: border };
    const tableWidth = 9360;
    const cols = [600, 4400, 2900, 1460];

    function cell(text, opts = {}) {
      return new TableCell({
        borders,
        width: { size: opts.width, type: WidthType.DXA },
        margins: { top: 80, bottom: 80, left: 120, right: 120 },
        shading: opts.header ? { type: ShadingType.CLEAR, fill: 'F4F4F4' } : undefined,
        children: [new Paragraph({
          children: [new TextRun({ text, bold: !!opts.header, size: 18 })],
        })],
      });
    }

    const rows = [
      new TableRow({ tableHeader: true, children: [
        cell('#', { width: cols[0], header: true }),
        cell('Titulo', { width: cols[1], header: true }),
        cell('Autor', { width: cols[2], header: true }),
        cell('Tipo', { width: cols[3], header: true }),
      ]}),
      ...[
        ['1', 'Best practices for Claude Code', 'Anthropic', 'oficial'],
        ['2', 'Equipping agents for the real world with Agent Skills', 'Anthropic Engineering', 'oficial'],
        ['3', 'Building agents with the Claude Agent SDK', 'Anthropic Engineering', 'oficial'],
        ['4', 'How Claude remembers your project (Memory)', 'Anthropic', 'oficial'],
        ['5', 'Claude Code Changelog', 'Anthropic', 'oficial'],
        ['6', 'The Complete Claude Code Guide (2026)', 'Stan Sedberry', 'comunidad'],
        ['7', '50 Claude Code Tips and Best Practices', 'Vishwas Gopinath / Builder.io', 'comunidad'],
        ['8', 'How Claude Code Builds a System Prompt', 'Drew Breunig', 'comunidad'],
        ['9', 'Claude Code & Agent Memory 2026', 'orchestrator.dev', 'comunidad'],
        ['10', 'Best Claude Code Plugins, Skills & MCP Servers', 'Nicolas Fry / TurboDocx', 'comunidad'],
      ].map(row => new TableRow({ children: row.map((v, i) => cell(v, { width: cols[i] })) })),
    ];

    return new Table({
      width: { size: tableWidth, type: WidthType.DXA },
      columnWidths: cols,
      rows,
    });
  })(),
  blank(),
  blank(),

  heading('Reproducibilidad', HeadingLevel.HEADING_2),
  blank(),
  new Paragraph({
    children: [new TextRun({
      text: 'El repositorio incluye requirements.txt y todos los scripts para regenerar la base de conocimiento, el HTML y los screenshots:',
    })],
    spacing: { after: 160 },
  }),
  ...code([
    '# clonar (incluye el audio via Git LFS)',
    'git clone https://github.com/nico1190/claude-code-master-2026.git',
    'cd claude-code-master-2026',
    'git lfs pull',
    '',
    'pip install -r requirements.txt',
    '',
    '# 1. Editar claude_code_sources.json (las 10 URLs)',
    '# 2. Re-bajar contenido',
    'python download_articles.py',
    '# 3. Reconstruir el HTML embebido',
    'python build_chatbot.py',
    '# 4. Regenerar screenshots (opcional)',
    'python take_screenshots.py',
  ]),
];

// ============================================================
// FINAL DOC
// ============================================================
const doc = new Document({
  creator: 'Nicolas',
  title: 'Claude Code Master 2026 - Entrega',
  description: 'Trabajo academico - podcast + chatbot RAG sobre Claude Code',
  styles: {
    default: { document: { run: { font: 'Arial', size: 22 } } },
    paragraphStyles: [
      { id: 'Heading1', name: 'Heading 1', basedOn: 'Normal', next: 'Normal', quickFormat: true,
        run: { size: 32, bold: true, font: 'Arial', color: orange },
        paragraph: { spacing: { before: 320, after: 200 }, outlineLevel: 0 } },
      { id: 'Heading2', name: 'Heading 2', basedOn: 'Normal', next: 'Normal', quickFormat: true,
        run: { size: 26, bold: true, font: 'Arial', color: '333333' },
        paragraph: { spacing: { before: 240, after: 120 }, outlineLevel: 1 } },
      { id: 'Hyperlink', name: 'Hyperlink', basedOn: 'Normal',
        run: { color: '0563C1', underline: { type: 'single' } } },
    ],
  },
  numbering: {
    config: [
      { reference: 'bullets',
        levels: [{ level: 0, format: LevelFormat.BULLET, text: '•', alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
    ],
  },
  sections: [{
    properties: {
      page: {
        size: { width: 12240, height: 15840 },
        margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 },
      },
    },
    headers: {
      default: new Header({ children: [new Paragraph({
        alignment: AlignmentType.RIGHT,
        children: [new TextRun({ text: 'Claude Code Master 2026  ·  Nico1190', size: 18, color: greyDim })],
      })] }),
    },
    footers: {
      default: new Footer({ children: [new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [
          new TextRun({ text: 'Pagina ', size: 18, color: greyDim }),
          new TextRun({ children: [PageNumber.CURRENT], size: 18, color: greyDim }),
        ],
      })] }),
    },
    children: [
      title,
      subtitle,
      coverImg,
      tagline,
      studentInfo,
      ...linksSection,
      ...screenshotsSection,
      ...codeSection,
      ...stackSection,
    ],
  }],
});

Packer.toBuffer(doc).then(buffer => {
  const out = path.join(REPO, 'Entrega_Claude_Code_Master_2026.docx');
  fs.writeFileSync(out, buffer);
  console.log(`Wrote ${out} (${(buffer.length / 1024).toFixed(1)} KB)`);
});
