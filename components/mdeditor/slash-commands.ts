export type SlashCommand = {
  id: string;
  label: string;
  hint?: string;
  group: "standard" | "component";
  keywords?: string[];
  insert: string;
};

export const SLASH_COMMANDS: SlashCommand[] = [
  {
    id: "h1",
    label: "Heading 1",
    hint: "# ",
    group: "standard",
    keywords: ["heading", "title", "h1"],
    insert: "# ${1:Heading}",
  },
  {
    id: "h2",
    label: "Heading 2",
    hint: "## ",
    group: "standard",
    keywords: ["heading", "h2"],
    insert: "## ${1:Heading}",
  },
  {
    id: "h3",
    label: "Heading 3",
    hint: "### ",
    group: "standard",
    keywords: ["heading", "h3"],
    insert: "### ${1:Heading}",
  },
  {
    id: "ul",
    label: "Bulleted list",
    hint: "- item",
    group: "standard",
    keywords: ["list", "bullet", "ul"],
    insert: "- ${1:item}",
  },
  {
    id: "ol",
    label: "Ordered list",
    hint: "1. item",
    group: "standard",
    keywords: ["list", "numbered", "ol"],
    insert: "1. ${1:item}",
  },
  {
    id: "task",
    label: "Task list",
    hint: "- [ ] todo",
    group: "standard",
    keywords: ["checklist", "todo", "task"],
    insert: "- [ ] ${1:todo}",
  },
  {
    id: "quote",
    label: "Quote",
    hint: "> ",
    group: "standard",
    keywords: ["blockquote", "quote"],
    insert: "> ${1:quote}",
  },
  {
    id: "code",
    label: "Code block",
    hint: "```lang",
    group: "standard",
    keywords: ["code", "fence", "pre"],
    insert: "```${1:ts}\n${2:code}\n```",
  },
  {
    id: "table",
    label: "Table",
    hint: "| col | col |",
    group: "standard",
    keywords: ["table", "grid"],
    insert:
      "| ${1:col} | ${2:col} |\n| --- | --- |\n| ${3:val} | ${4:val} |",
  },
  {
    id: "link",
    label: "Link",
    hint: "[text](url)",
    group: "standard",
    keywords: ["link", "anchor", "url"],
    insert: "[${1:text}](${2:url})",
  },
  {
    id: "image",
    label: "Image",
    hint: "![alt](url)",
    group: "standard",
    keywords: ["image", "picture", "img"],
    insert: "![${1:alt}](${2:url})",
  },
  {
    id: "hr",
    label: "Divider",
    hint: "---",
    group: "standard",
    keywords: ["divider", "rule", "hr", "separator"],
    insert: "---",
  },
  {
    id: "mdximage",
    label: "Image (with caption)",
    hint: "<MdxImage src caption />",
    group: "component",
    keywords: ["image", "picture", "photo", "caption", "lightbox"],
    insert: "<MdxImage src=\"${1:url}\" caption=\"${2:Caption}\" maxWidth=\"${3:100%}\" />",
  },
  {
    id: "collage",
    label: "Collage",
    hint: "<Collage>…</Collage>",
    group: "component",
    keywords: ["collage", "gallery", "bento", "grid", "images"],
    insert:
      "<Collage>\n  <MdxImage src=\"${1:url}\" caption=\"${2:}\" />\n  <MdxImage src=\"${3:url}\" caption=\"${4:}\" />\n  <MdxImage src=\"${5:url}\" caption=\"${6:}\" />\n</Collage>",
  },
  {
    id: "callout",
    label: "Callout",
    hint: "<Callout type=\"info\">",
    group: "component",
    keywords: ["callout", "alert", "note", "info", "warning", "tip"],
    insert:
      "<Callout type=\"${1:info}\">\n  ${2:Body}\n</Callout>",
  },
  {
    id: "statcard",
    label: "StatCard",
    hint: "<StatCard label value trend />",
    group: "component",
    keywords: ["stat", "metric", "card"],
    insert:
      "<StatCard label=\"${1:Users}\" value=\"${2:1.2k}\" trend=\"${3:+4%}\" />",
  },
  {
    id: "chart",
    label: "SimpleChart",
    hint: "<SimpleChart title data />",
    group: "component",
    keywords: ["chart", "bar", "graph"],
    insert:
      "<SimpleChart\n  title=\"${1:Title}\"\n  data={[\n    { label: \"${2:A}\", value: ${3:10} },\n    { label: \"${4:B}\", value: ${5:20} },\n  ]}\n/>",
  },
];

export function fillSnippet(insert: string): {
  text: string;
  selectionStart: number;
  selectionEnd: number;
} {
  const m = insert.match(/\$\{(\d+):([^}]*)\}|\$(\d+)/);
  const stripped = insert
    .replace(/\$\{\d+:([^}]*)\}/g, "$1")
    .replace(/\$\d+/g, "");
  if (!m) {
    return { text: stripped, selectionStart: stripped.length, selectionEnd: stripped.length };
  }
  const beforeStripped = insert
    .slice(0, m.index!)
    .replace(/\$\{\d+:([^}]*)\}/g, "$1")
    .replace(/\$\d+/g, "");
  const placeholderText = m[2] ?? "";
  return {
    text: stripped,
    selectionStart: beforeStripped.length,
    selectionEnd: beforeStripped.length + placeholderText.length,
  };
}
