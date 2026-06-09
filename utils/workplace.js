export function getWorkplaceDisplay(data) {
  if (!data?.officeType) return data?.officeName || 'N/A';

  const ot = data.officeType.toUpperCase();
  const parts = [data.officeType];

  if (ot.includes('CGA') || ot === 'OFFICE OF THE CONTROLLER GENERAL OF ACCOUNTS') {
    // CGA only
  } else if (ot.includes('CAFO') || ot.includes('CHIEF ACCOUNTS')) {
    if (data.officeName && data.officeName !== 'N/A') parts.push(data.officeName);
    else if (data.district && data.district !== 'N/A') parts.push(data.district);
  } else if (ot.includes('DCA') || ot.includes('DIVISIONAL CONTROLLER')) {
    if (data.division && data.division !== 'N/A') parts.push(data.division);
  } else if (ot.includes('DAFO') || ot.includes('DISTRICT ACCOUNTS')) {
    if (data.district && data.district !== 'N/A') parts.push(data.district);
    if (data.division && data.division !== 'N/A') parts.push(data.division);
  } else if (ot.includes('UAO') || ot.includes('UPAZILA ACCOUNTS')) {
    if (data.upazila && data.upazila !== 'N/A') parts.push(data.upazila);
    if (data.district && data.district !== 'N/A') parts.push(data.district);
    if (data.division && data.division !== 'N/A') parts.push(data.division);
  } else {
    if (data.officeName && data.officeName !== 'N/A' && data.officeName !== data.officeType) {
      parts.push(data.officeName);
    }
    if (data.upazila && data.upazila !== 'N/A') parts.push(data.upazila);
    if (data.district && data.district !== 'N/A') parts.push(data.district);
    if (data.division && data.division !== 'N/A') parts.push(data.division);
  }

  const uniqueParts = [];
  const lowerSeen = new Set();

  for (const part of parts) {
    if (!part) continue;
    const cleanPart = part.trim();
    if (!cleanPart || cleanPart.toUpperCase() === 'N/A') continue;
    const lower = cleanPart.toLowerCase();
    if (!lowerSeen.has(lower)) {
      lowerSeen.add(lower);
      uniqueParts.push(cleanPart);
    }
  }

  return uniqueParts.join(', ');
}
