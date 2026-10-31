export interface SimulatedFile {
  id: string;
  name: string;
  size: string;
  extension: string;
  category: string;
  status?: 'pending' | 'moved' | 'skipped' | 'collision';
  renamedTo?: string;
  originalPath?: string;
}

export const INITIAL_MESSY_FILES: SimulatedFile[] = [
  // Documents
  { id: '1', name: 'Q4_Financial_Report.pdf', size: '2.4 MB', extension: '.pdf', category: 'Documents' },
  { id: '2', name: 'Meeting_Notes_Oct.docx', size: '145 KB', extension: '.docx', category: 'Documents' },
  { id: '3', name: 'Employee_Roster.xlsx', size: '890 KB', extension: '.xlsx', category: 'Documents' },
  { id: '4', name: 'Project_Proposal_Draft.pdf', size: '3.1 MB', extension: '.pdf', category: 'Documents' },
  { id: '5', name: 'Invoice_1092.pdf', size: '320 KB', extension: '.pdf', category: 'Documents' },
  { id: '6', name: 'Invoice_1092.pdf', size: '325 KB', extension: '.pdf', category: 'Documents' }, // collision test!
  { id: '7', name: 'README_Guidelines.txt', size: '12 KB', extension: '.txt', category: 'Documents' },
  { id: '8', name: 'Pitch_Deck_Final.pptx', size: '8.7 MB', extension: '.pptx', category: 'Documents' },

  // Images
  { id: '9', name: 'Screenshot_2026-10-31.png', size: '1.2 MB', extension: '.png', category: 'Images' },
  { id: '10', name: 'Banner_Hero_Design.jpg', size: '3.8 MB', extension: '.jpg', category: 'Images' },
  { id: '11', name: 'Team_Avatar_Photo.jpeg', size: '940 KB', extension: '.jpeg', category: 'Images' },
  { id: '12', name: 'App_Icon_Vector.svg', size: '45 KB', extension: '.svg', category: 'Images' },
  { id: '13', name: 'Animated_Loader.gif', size: '2.1 MB', extension: '.gif', category: 'Images' },
  { id: '14', name: 'Product_Mockup.webp', size: '780 KB', extension: '.webp', category: 'Images' },

  // Videos
  { id: '15', name: 'Sprint_Demo_Recording.mp4', size: '148 MB', extension: '.mp4', category: 'Videos' },
  { id: '16', name: 'Conference_Talk_Keynote.mkv', size: '420 MB', extension: '.mkv', category: 'Videos' },
  { id: '17', name: 'Quick_Bug_Repro.mov', size: '35 MB', extension: '.mov', category: 'Videos' },

  // Archives
  { id: '18', name: 'Project_Backup_2026.zip', size: '88 MB', extension: '.zip', category: 'Archives' },
  { id: '19', name: 'Assets_Bundle.tar.gz', size: '54 MB', extension: '.tar.gz', category: 'Archives' },
  { id: '20', name: 'Dataset_Extract.7z', size: '210 MB', extension: '.7z', category: 'Archives' },

  // Code
  { id: '21', name: 'data_pipeline.py', size: '18 KB', extension: '.py', category: 'Code' },
  { id: '22', name: 'api_handler.ts', size: '14 KB', extension: '.ts', category: 'Code' },
  { id: '23', name: 'landing_page.html', size: '28 KB', extension: '.html', category: 'Code' },
  { id: '24', name: 'db_schema_migration.sql', size: '42 KB', extension: '.sql', category: 'Code' },
  { id: '25', name: 'config_settings.json', size: '6 KB', extension: '.json', category: 'Code' },

  // Audio
  { id: '26', name: 'Podcast_Episode_12.mp3', size: '64 MB', extension: '.mp3', category: 'Audio' },
  { id: '27', name: 'Sound_Effect_Click.wav', size: '1.2 MB', extension: '.wav', category: 'Audio' },

  // Installers
  { id: '28', name: 'VSCode_Setup.deb', size: '92 MB', extension: '.deb', category: 'Installers' },
  { id: '29', name: 'DockerDesktop.dmg', size: '580 MB', extension: '.dmg', category: 'Installers' },

  // Others
  { id: '30', name: 'debug_dump.bin', size: '4.5 MB', extension: '.bin', category: 'Others' },
];

export const CATEGORY_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  Documents: { bg: 'bg-blue-950/60', text: 'text-blue-400', border: 'border-blue-800/60' },
  Images: { bg: 'bg-emerald-950/60', text: 'text-emerald-400', border: 'border-emerald-800/60' },
  Videos: { bg: 'bg-purple-950/60', text: 'text-purple-400', border: 'border-purple-800/60' },
  Archives: { bg: 'bg-amber-950/60', text: 'text-amber-400', border: 'border-amber-800/60' },
  Code: { bg: 'bg-cyan-950/60', text: 'text-cyan-400', border: 'border-cyan-800/60' },
  Audio: { bg: 'bg-pink-950/60', text: 'text-pink-400', border: 'border-pink-800/60' },
  Installers: { bg: 'bg-indigo-950/60', text: 'text-indigo-400', border: 'border-indigo-800/60' },
  Others: { bg: 'bg-zinc-850', text: 'text-zinc-400', border: 'border-zinc-700' },
};
