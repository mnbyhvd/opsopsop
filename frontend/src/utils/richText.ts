const ALLOWED_TAGS = new Set([
  'b', 'strong', 'i', 'em', 'u', 's', 'del', 'strike',
  'br', 'p', 'span', 'div',
  'ul', 'ol', 'li',
  'a',
  'blockquote', 'sup', 'sub',
]);

function cleanNode(node: Node): string {
  if (node.nodeType === Node.TEXT_NODE) return node.textContent ?? '';
  if (node.nodeType !== Node.ELEMENT_NODE) return '';

  const el = node as Element;
  const tag = el.tagName.toLowerCase();
  const children = Array.from(el.childNodes).map(cleanNode).join('');

  if (!ALLOWED_TAGS.has(tag)) return children;

  let attrs = '';

  if (tag === 'a') {
    const href = el.getAttribute('href');
    if (href && !href.trim().toLowerCase().startsWith('javascript:')) {
      attrs += ` href="${escapeAttr(href)}"`;
      if (href.startsWith('http')) attrs += ' target="_blank" rel="noopener noreferrer"';
    }
  }

  if (tag === 'span' || tag === 'div' || tag === 'p') {
    const style = el.getAttribute('style');
    if (style) {
      const safeStyle = sanitizeStyle(style);
      if (safeStyle) attrs += ` style="${escapeAttr(safeStyle)}"`;
    }
  }

  if (tag === 'br') return '<br>';

  return `<${tag}${attrs}>${children}</${tag}>`;
}

function escapeAttr(value: string): string {
  return value.replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

const SAFE_STYLE_PROPS = new Set([
  'color', 'background-color', 'font-weight', 'font-style',
  'text-decoration', 'text-align', 'font-size',
]);

function sanitizeStyle(style: string): string {
  return style
    .split(';')
    .map(s => s.trim())
    .filter(s => {
      const [prop] = s.split(':');
      return prop && SAFE_STYLE_PROPS.has(prop.trim().toLowerCase());
    })
    .join('; ');
}

export function sanitizeHtml(html: string | null | undefined): string {
  if (!html) return '';
  try {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return Array.from(doc.body.childNodes).map(cleanNode).join('');
  } catch {
    return html.replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }
}
