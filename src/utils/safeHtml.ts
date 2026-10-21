/**
 * Leaflet builds markers, tooltips and popups from HTML strings, so every string
 * that reaches `html:`, `bindPopup()` or `bindTooltip()` must pass through here.
 * Quotes are escaped in both forms because these strings also land inside attributes.
 */
export function escapeHtml(value: unknown): string {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
