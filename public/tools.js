// Pencilcase owns the creator's tool definitions. Papers exposes execution facts.
export const tools = [
  { id: 'chatgptLocalCoder', name: 'ChatGPT local coder', description: 'Local coding sessions, live history and evidence. Open its separate view.', providers: [], view: 'coder/index.html' },
  { id: 'officeEditor', name: 'LibreOffice', description: 'Inline Writer and Calc editing; office document conversion.', providers: ['officeEditor', 'libreOffice'], resident: true },
  { id: 'filePreview', name: 'File previews', description: 'Images, text, media and document preview routing.', providers: ['filePreview'] },
  { id: 'pdfPreview', name: 'PDF viewer', description: 'Papers’ native PDF pane.', providers: ['pdfPreview'] },
  { id: 'htmlPreview', name: 'HTML preview', description: 'Local HTML documents in an isolated browser surface.', providers: ['htmlPreview'] },
  { id: 'webBrowser', name: 'Chromium browser', description: 'Inline browser tabs and web tools.', providers: ['webBrowser'] },
  { id: 'everything', name: 'Everything', description: 'Machine-wide indexed file search.', providers: ['everything'] },
  { id: 'directoryOpus', name: 'Directory Opus', description: 'Real-file copy, move, rename and recycle operations.', providers: ['directoryOpus'] },
  { id: 'windowsPreview', name: 'Windows preview handlers', description: 'Installed native preview handlers in the file pane.', providers: ['windowsPreview'] },
  { id: 'shellThumbnail', name: 'Windows thumbnails', description: 'Thumbnails supplied by installed Windows handlers.', providers: ['shellThumbnail'] },
  { id: 'calibrePreview', name: 'Calibre', description: 'E-book previews and conversion.', providers: ['calibrePreview'] },
  { id: 'autoCadPreview', name: 'AutoCAD preview', description: 'DWG preview through installed AutoCAD.', providers: ['autoCadPreview'] },
  { id: 'mlightCadPreview', name: 'mLightCAD', description: 'CAD preview through the installed viewer.', providers: ['mlightCadPreview'] },
  { id: 'revitPreview', name: 'Revit preview', description: 'Revit project preview.', providers: ['revitPreview'] },
  { id: 'powerPointPreview', name: 'PowerPoint preview', description: 'Presentation preview through installed PowerPoint.', providers: ['powerPointPreview'] },
];
