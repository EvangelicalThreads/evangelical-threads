import fs from 'node:fs';
import path from 'node:path';
import HomeClient from '@/components/HomeClient';

// Files this page checks for in /public/drop-01/. Drop the real photo in with
// this exact name and the homepage swaps it in on the next request — nothing
// else to edit or toggle.
const DROP_IMAGE_FILES = {
  'men-dolphin-tee': 'men-dolphin-tee.jpg',
  'women-ringer-tee': 'women-ringer-tee.jpg',
  'current-tote': 'current-tote.jpg',
} as const;

function getDropAvailability() {
  const dir = path.join(process.cwd(), 'public', 'drop-01');
  return Object.fromEntries(
    Object.entries(DROP_IMAGE_FILES).map(([id, filename]) => [
      id,
      fs.existsSync(path.join(dir, filename)),
    ])
  );
}

export default function HomePage() {
  return <HomeClient dropAvailability={getDropAvailability()} />;
}
