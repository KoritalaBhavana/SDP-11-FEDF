// Map image filenames (stored in DB) to imported assets
import sareeImage from '@/assets/saree-1.jpg';
import sareeImage2 from '@/assets/saree-2.jpg';
import dressImage from '@/assets/dress-1.jpg';
import dressImage2 from '@/assets/dress-2.jpg';
import shirtImage from '@/assets/shirt-1.jpg';
import bagImage from '@/assets/bag-1.jpg';
import bagImage2 from '@/assets/bag-2.jpg';
import kurtaImage from '@/assets/kurta-1.jpg';
import kurtiImage from '@/assets/kurti-1.jpg';
import dupattaImage from '@/assets/dupatta-1.jpg';
// Note: some earlier SVG assets were removed; keep mappings to existing JPGs only.

const map: Record<string, string> = {
  'saree-1.jpg': sareeImage,
  'saree-2.jpg': sareeImage2,
  'dress-1.jpg': dressImage,
  'dress-2.jpg': dressImage2,
  'shirt-1.jpg': shirtImage,
  'bag-1.jpg': bagImage,
  'bag-2.jpg': bagImage2,
  'kurta-1.jpg': kurtaImage,
  'kurti-1.jpg': kurtiImage,
  // Some older assets referenced in DB may not exist; fallback to the
  // existing kurti image so build doesn't fail and recommendations still show.
  'kurti-2.jpg': kurtiImage,
  'kurti-2.svg': kurtiImage,
  // Dupatta mappings (ensure common spellings and extensions are covered)
  'dupatta-1.jpg': dupattaImage,
  'dupatta-1.png': dupattaImage,
  'duppata-1.jpg': dupattaImage,
  'duppata-1.png': dupattaImage,
};

export default map;
