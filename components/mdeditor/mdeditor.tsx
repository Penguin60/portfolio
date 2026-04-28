"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import CodeMirror, { ReactCodeMirrorRef } from "@uiw/react-codemirror";
import { EditorView, keymap } from "@codemirror/view";
import { Prec } from "@codemirror/state";
import { markdown } from "@codemirror/lang-markdown";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "../ui/command";

import { Separator } from "../ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { MultiSelect } from "../ui/multiselect";
import {
  Bold,
  Italic,
  Strikethrough,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  ListChecks,
  Quote,
  Code,
  Code2,
  Link as LinkIcon,
  Image as ImageIcon,
  Table as TableIcon,
  Plus,
  Save,
} from "lucide-react";
import { uploadBlob } from "@/server/actions";
import { SLASH_COMMANDS, fillSnippet, type SlashCommand } from "./slash-commands";
import { MdxPreview } from "./preview";

type EditorType = "blog" | "project";

export type PostMeta = { id: number; title: string };

export type LoadResult =
  | {
      kind: "blog";
      id: number;
      title: string;
      description: string;
      tags: string[];
      content: string;
    }
  | {
      kind: "project";
      id: number;
      title: string;
      link: string;
      image: string;
      description: string;
      extendedDescription: string;
      tags: string[];
    };

export function MarkdownEditor({
  type,
  options,
  posts,
  formAction,
  loadAction,
}: {
  type: EditorType;
  options: string[];
  posts: PostMeta[];
  formAction: (formData: FormData) => Promise<any>;
  loadAction: (id: number) => Promise<LoadResult | null>;
}) {
  const [text, setText] = useState("");
  const [title, setTitle] = useState("");
  const [localOptions, setLocalOptions] = useState<string[]>(options);
  const [tags, setTags] = useState<string[]>([]);
  const [description, setDescription] = useState("");
  const [link, setLink] = useState("");
  const [image, setImage] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const cmRef = useRef<ReactCodeMirrorRef>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [slash, setSlash] = useState<{
    pos: number;
    x: number;
    y: number;
  } | null>(null);

  const isBlog = type === "blog";
  const blobPath = isBlog ? "blog" : "project";

  function resetForm() {
    setText("");
    setTitle("");
    setTags([]);
    setDescription("");
    setLink("");
    setImage("");
    setEditingId(null);
  }

  async function handlePostPick(value: string) {
    if (value === "new") {
      resetForm();
      return;
    }
    const id = Number(value);
    if (!Number.isFinite(id)) return;
    setLoading(true);
    try {
      const result = await loadAction(id);
      if (!result) return;
      setEditingId(result.id);
      setTitle(result.title);
      setDescription(result.description);
      setTags(result.tags);
      if (result.kind === "blog") {
        setText(result.content);
      } else {
        setLink(result.link);
        setImage(result.image);
        setText(result.extendedDescription);
      }
    } finally {
      setLoading(false);
    }
  }

  const view = () => cmRef.current?.view ?? null;

  const wrapSelection = useCallback((before: string, after: string = before) => {
    const v = view();
    if (!v) return;
    const { from, to } = v.state.selection.main;
    const selected = v.state.sliceDoc(from, to);
    const insert = `${before}${selected}${after}`;
    v.dispatch({
      changes: { from, to, insert },
      selection: {
        anchor: from + before.length,
        head: from + before.length + selected.length,
      },
    });
    v.focus();
  }, []);

  const toggleLinePrefix = useCallback((prefix: string) => {
    const v = view();
    if (!v) return;
    const { from, to } = v.state.selection.main;
    const startLine = v.state.doc.lineAt(from);
    const endLine = v.state.doc.lineAt(to);
    const changes: { from: number; to: number; insert: string }[] = [];
    for (let n = startLine.number; n <= endLine.number; n++) {
      const line = v.state.doc.line(n);
      if (line.text.startsWith(prefix)) {
        changes.push({ from: line.from, to: line.from + prefix.length, insert: "" });
      } else {
        changes.push({ from: line.from, to: line.from, insert: prefix });
      }
    }
    const changeSet = v.state.changes(changes);
    v.dispatch({
      changes: changeSet,
      selection: v.state.selection.map(changeSet, 1),
    });
    v.focus();
  }, []);

  const insertBlock = useCallback((insertText: string) => {
    const v = view();
    if (!v) return;
    const { from, to } = v.state.selection.main;
    const line = v.state.doc.lineAt(from);
    const needsLeadingNewline = from !== line.from;
    const prefix = needsLeadingNewline ? "\n" : "";
    const finalInsert = `${prefix}${insertText}`;
    v.dispatch({
      changes: { from, to, insert: finalInsert },
      selection: { anchor: from + finalInsert.length },
    });
    v.focus();
  }, []);

  const insertSnippetAt = useCallback(
    (cmd: SlashCommand, replaceFrom: number, replaceTo: number) => {
      const v = view();
      if (!v) return;
      const filled = fillSnippet(cmd.insert);
      v.dispatch({
        changes: { from: replaceFrom, to: replaceTo, insert: filled.text },
        selection: {
          anchor: replaceFrom + filled.selectionStart,
          head: replaceFrom + filled.selectionEnd,
        },
      });
      v.focus();
    },
    []
  );

  const handleSlashSelect = useCallback(
    (cmd: SlashCommand) => {
      if (!slash) return;
      insertSnippetAt(cmd, slash.pos, slash.pos);
      setSlash(null);
    },
    [slash, insertSnippetAt]
  );

  const closeSlash = useCallback(() => {
    setSlash(null);
    view()?.focus();
  }, []);

  const uploadAndInsertRef = useRef<(file: File) => void>(() => {});
  uploadAndInsertRef.current = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      const data = await uploadBlob(formData, blobPath);
      if (!data?.url) throw new Error("Upload failed");
      const v = view();
      if (!v) return;
      const insert = `![${file.name}](${data.url})`;
      const { from, to } = v.state.selection.main;
      v.dispatch({
        changes: { from, to, insert },
        selection: { anchor: from + insert.length },
      });
      v.focus();
    } catch (error) {
      console.error("Image upload failed:", error);
    }
  };

  const uploadAndInsert = useCallback((file: File) => {
    uploadAndInsertRef.current(file);
  }, []);

  const editorExtensions = useMemo(() => [
    markdown(),
    EditorView.lineWrapping,
    Prec.highest(
      keymap.of([
        {
          key: "/",
          run: (v) => {
            const { from } = v.state.selection.main;
            const line = v.state.doc.lineAt(from);
            const before = v.state.doc.sliceString(line.from, from);
            const isAtStart = before.length === 0 || /\s$/.test(before);
            if (!isAtStart) return false;
            const coords = v.coordsAtPos(from);
            if (!coords) return false;
            setSlash({ pos: from, x: coords.left, y: coords.bottom });
            return true;
          },
        },
      ])
    ),
    EditorView.domEventHandlers({
      paste: (event, v) => {
        const items = event.clipboardData?.items;
        if (!items) return false;
        for (let i = 0; i < items.length; i++) {
          const item = items[i];
          if (item.kind === "file") {
            const file = item.getAsFile();
            if (file) {
              event.preventDefault();
              uploadAndInsert(file);
              return true;
            }
          }
        }
        return false;
      },
      drop: (event, v) => {
        const files = event.dataTransfer?.files;
        if (!files || files.length === 0) return false;
        const file = files[0];
        if (!file.type.startsWith("image/")) return false;
        event.preventDefault();
        uploadAndInsert(file);
        return true;
      },
    }),
    EditorView.theme({
      "&": { height: "100%", fontSize: "0.95rem" },
      ".cm-scroller": { fontFamily: "var(--font-geist-mono, ui-monospace, SFMono-Regular, monospace)" },
      "&.cm-focused": { outline: "none" },
    }),
  ], []);

  async function handleFormAction(formData: FormData) {
    formData.set("content", text);
    formData.set("title", title);
    formData.set("description", description);
    formData.set("tags", JSON.stringify(tags));
    if (!isBlog) {
      formData.set("link", link);
      formData.set("image", image);
      formData.set("extendedDescription", text);
    }
    if (editingId !== null) {
      formData.set("id", String(editingId));
    }
    await formAction(formData);
    resetForm();
    setLocalOptions(options);
  }

  function tagCreationHandler(name: string) {
    setTags((prev) => [...prev, name]);
    setLocalOptions((prev) => [...prev, name]);
  }

  return (
    <Tabs defaultValue="code" className="flex flex-col h-full">
      <div className="flex items-center gap-3 pl-[1.5vw] pr-4 pt-4">
        <h2 className="font-semibold text-lg">{isBlog ? "Blog" : "Project"}</h2>
        <select
          value={editingId === null ? "new" : String(editingId)}
          onChange={(e) => handlePostPick(e.target.value)}
          disabled={loading}
          className="h-9 rounded-md border bg-white dark:bg-zinc-900 px-2 text-sm max-w-[20rem]"
        >
          <option value="new">+ New {isBlog ? "blog" : "project"}</option>
          {posts.map((p) => (
            <option key={p.id} value={p.id}>
              {p.title}
            </option>
          ))}
        </select>
        {loading && <span className="text-xs text-zinc-500">Loading…</span>}
        <TabsList className="ml-auto">
          <TabsTrigger value="code">Code</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
        </TabsList>
      </div>

      <TabsContent value="code" className="flex-grow mt-0 min-h-0">
        <Separator className="mt-3" />
        <div className="flex gap-4 items-stretch pl-[1.5vw] pr-4 h-full pb-4 pt-2">
          <div className="relative flex-1 min-w-0 border rounded-md overflow-hidden bg-white dark:bg-zinc-900">
            <CodeMirror
              ref={cmRef}
              value={text}
              onChange={setText}
              extensions={editorExtensions}
              height="100%"
              basicSetup={{
                lineNumbers: false,
                foldGutter: false,
                highlightActiveLine: false,
              }}
              className="h-full"
            />
            {slash && (
              <SlashPopover
                x={slash.x}
                y={slash.y}
                onSelect={handleSlashSelect}
                onClose={closeSlash}
              />
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) uploadAndInsert(file);
                e.target.value = "";
              }}
            />
          </div>
          <Toolbar
            onBold={() => wrapSelection("**")}
            onItalic={() => wrapSelection("*")}
            onStrike={() => wrapSelection("~~")}
            onH1={() => toggleLinePrefix("# ")}
            onH2={() => toggleLinePrefix("## ")}
            onH3={() => toggleLinePrefix("### ")}
            onUl={() => toggleLinePrefix("- ")}
            onOl={() => toggleLinePrefix("1. ")}
            onTask={() => toggleLinePrefix("- [ ] ")}
            onQuote={() => toggleLinePrefix("> ")}
            onInlineCode={() => wrapSelection("`")}
            onCodeBlock={() => insertBlock("```ts\n\n```")}
            onLink={() => wrapSelection("[", "](url)")}
            onImage={() => fileInputRef.current?.click()}
            onTable={() => insertBlock("| col | col |\n| --- | --- |\n| val | val |")}
          >
            <Dialog>
              <DialogTrigger asChild>
                <button
                  type="button"
                  aria-label={editingId !== null ? "Save changes" : `Create new ${isBlog ? "blog" : "project"}`}
                  title={editingId !== null ? "Save changes" : `Create new ${isBlog ? "blog" : "project"}`}
                  className="h-9 w-9 mt-2 rounded-md flex items-center justify-center bg-zinc-900 text-white hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300 transition-colors"
                >
                  {editingId !== null ? (
                    <Save className="h-4 w-4" />
                  ) : (
                    <Plus className="h-4 w-4" />
                  )}
                </button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    {editingId !== null
                      ? `Edit ${isBlog ? "Blog" : "Project"}`
                      : `${isBlog ? "Blog" : "Project"} Creation`}
                  </DialogTitle>
                </DialogHeader>
                <form action={handleFormAction}>
                  <div className="grid gap-5 py-4">
                    <div>
                      <Label htmlFor="title">Title</Label>
                      <Input
                        id="title"
                        name="title"
                        placeholder="Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                      />
                    </div>
                    {!isBlog && (
                      <>
                        <div>
                          <Label htmlFor="link">Link</Label>
                          <Input
                            id="link"
                            name="link"
                            placeholder="Link"
                            value={link}
                            onChange={(e) => setLink(e.target.value)}
                          />
                        </div>
                        <div>
                          <Label htmlFor="image">Image</Label>
                          <Input
                            id="image"
                            name="image"
                            placeholder="Image"
                            value={image}
                            onChange={(e) => setImage(e.target.value)}
                          />
                        </div>
                      </>
                    )}
                    <div>
                      <Label htmlFor="tags">Tags</Label>
                      <MultiSelect
                        options={localOptions}
                        selected={tags}
                        onChange={setTags}
                        placeholder="Select tags..."
                        onTagCreate={tagCreationHandler}
                      />
                      <input
                        type="hidden"
                        name="tags"
                        value={JSON.stringify(tags)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        name="description"
                        placeholder="Description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                      />
                    </div>
                    <DialogClose asChild>
                      <Button type="submit">Submit</Button>
                    </DialogClose>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </Toolbar>
        </div>
      </TabsContent>
      <TabsContent
        value="preview"
        className="flex-grow mt-0 flex flex-col min-h-0"
      >
        <Separator className="mt-3" />
        <div className="flex-1 overflow-auto px-4 pb-4">
          <MdxPreview source={text} />
        </div>
      </TabsContent>
    </Tabs>
  );
}

function Toolbar(props: {
  onBold: () => void;
  onItalic: () => void;
  onStrike: () => void;
  onH1: () => void;
  onH2: () => void;
  onH3: () => void;
  onUl: () => void;
  onOl: () => void;
  onTask: () => void;
  onQuote: () => void;
  onInlineCode: () => void;
  onCodeBlock: () => void;
  onLink: () => void;
  onImage: () => void;
  onTable: () => void;
  children?: React.ReactNode;
}) {
  const groups: { label: string; items: { icon: React.ReactNode; aria: string; onClick: () => void }[] }[] = [
    {
      label: "Headings",
      items: [
        { icon: <Heading1 className="h-4 w-4" />, aria: "Heading 1", onClick: props.onH1 },
        { icon: <Heading2 className="h-4 w-4" />, aria: "Heading 2", onClick: props.onH2 },
        { icon: <Heading3 className="h-4 w-4" />, aria: "Heading 3", onClick: props.onH3 },
      ],
    },
    {
      label: "Inline",
      items: [
        { icon: <Bold className="h-4 w-4" />, aria: "Bold", onClick: props.onBold },
        { icon: <Italic className="h-4 w-4" />, aria: "Italic", onClick: props.onItalic },
        { icon: <Strikethrough className="h-4 w-4" />, aria: "Strikethrough", onClick: props.onStrike },
        { icon: <Code className="h-4 w-4" />, aria: "Inline code", onClick: props.onInlineCode },
      ],
    },
    {
      label: "Blocks",
      items: [
        { icon: <Quote className="h-4 w-4" />, aria: "Quote", onClick: props.onQuote },
        { icon: <Code2 className="h-4 w-4" />, aria: "Code block", onClick: props.onCodeBlock },
        { icon: <List className="h-4 w-4" />, aria: "Bulleted list", onClick: props.onUl },
        { icon: <ListOrdered className="h-4 w-4" />, aria: "Ordered list", onClick: props.onOl },
        { icon: <ListChecks className="h-4 w-4" />, aria: "Task list", onClick: props.onTask },
      ],
    },
    {
      label: "Insert",
      items: [
        { icon: <LinkIcon className="h-4 w-4" />, aria: "Link", onClick: props.onLink },
        { icon: <ImageIcon className="h-4 w-4" />, aria: "Image", onClick: props.onImage },
        { icon: <TableIcon className="h-4 w-4" />, aria: "Table", onClick: props.onTable },
      ],
    },
  ];
  return (
    <div className="flex flex-col justify-between w-12 shrink-0">
      <div className="flex flex-col gap-3">
        {groups.map((group, gi) => (
          <div key={gi} className="flex flex-col gap-1">
            {gi > 0 && <Separator className="my-1" />}
            {group.items.map((item, ii) => (
              <button
                key={ii}
                type="button"
                aria-label={item.aria}
                title={item.aria}
                onClick={item.onClick}
                className="h-9 w-9 rounded-md flex items-center justify-center hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              >
                {item.icon}
              </button>
            ))}
          </div>
        ))}
      </div>
      {props.children}
    </div>
  );
}

function SlashPopover({
  x,
  y,
  onSelect,
  onClose,
}: {
  x: number;
  y: number;
  onSelect: (cmd: SlashCommand) => void;
  onClose: () => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    function onPointer(e: PointerEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        onClose();
      }
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    }
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  const standard = SLASH_COMMANDS.filter((c) => c.group === "standard");
  const components = SLASH_COMMANDS.filter((c) => c.group === "component");

  const maxX = typeof window !== "undefined" ? window.innerWidth - 300 : x;
  const maxY = typeof window !== "undefined" ? window.innerHeight - 360 : y;
  const left = Math.min(x, maxX);
  const top = Math.min(y + 4, maxY);

  return (
    <div
      ref={containerRef}
      className="fixed z-50 w-72 rounded-lg border bg-white dark:bg-zinc-950 shadow-lg overflow-hidden"
      style={{ left, top }}
    >
      <Command>
        <CommandInput
          ref={inputRef}
          placeholder="Search components..."
          className="h-9 px-3 bg-transparent outline-none text-sm w-full"
        />
        <CommandList>
          <CommandEmpty>No matches</CommandEmpty>
          <CommandGroup heading="Standard">
            {standard.map((cmd) => (
              <CommandItem
                key={cmd.id}
                value={`${cmd.label} ${(cmd.keywords ?? []).join(" ")}`}
                onSelect={() => onSelect(cmd)}
              >
                <span className="flex-1">{cmd.label}</span>
                {cmd.hint && (
                  <span className="ml-2 text-xs text-zinc-500 font-mono">
                    {cmd.hint}
                  </span>
                )}
              </CommandItem>
            ))}
          </CommandGroup>
          <CommandGroup heading="Components">
            {components.map((cmd) => (
              <CommandItem
                key={cmd.id}
                value={`${cmd.label} ${(cmd.keywords ?? []).join(" ")}`}
                onSelect={() => onSelect(cmd)}
              >
                <span className="flex-1">{cmd.label}</span>
                {cmd.hint && (
                  <span className="ml-2 text-xs text-zinc-500 font-mono">
                    {cmd.hint}
                  </span>
                )}
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </Command>
    </div>
  );
}
