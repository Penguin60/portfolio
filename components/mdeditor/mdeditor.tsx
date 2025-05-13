"use client";

import React, { useEffect } from "react";

import { Textarea } from "../ui/textarea";
import { Separator } from "../ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { ToggleGroup, ToggleGroupItem } from "../ui/toggle-group";
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
import { MultiSelect } from "../ui/multiselect";
import {
  Bold,
  Italic,
  Strikethrough,
  Heading,
  List,
  ListOrdered,
  ListChecks,
  Quote,
  Code,
} from "lucide-react";
import { useState } from "react";
import { Marked } from "marked";
import { markedHighlight } from "marked-highlight";
import hljs from "highlight.js";
import "highlight.js/styles/github-dark.css";
import mermaid from "mermaid";

import "./mdeditor.css";

export function MarkdownEditor({
  type,
  options,
  formAction,
}: {
  type: string;
  options: string[];
  formAction: (formData: FormData) => Promise<any>;
}) {
  const [text, setText] = useState("");
  const [title, setTitle] = useState("");
  const [localOptions, setLocalOptions] = useState<string[]>(options);
  const [tags, setTags] = useState<string[]>([]);
  const [description, setDescription] = useState("");
  const [link, setLink] = useState("");
  const [image, setImage] = useState("");

  const marked = new Marked(
    markedHighlight({
      emptyLangClass: "hljs",
      langPrefix: "hljs language-",
      highlight(code, lang, info) {
        const language = hljs.getLanguage(lang) ? lang : "plaintext";
        return hljs.highlight(code, { language }).value;
      },
    })
  );

  marked.use({
    renderer: {
      code: function (code) {
        if (code.lang == "mermaid")
          return `<pre class="mermaid">${code.text}</pre>`;
        return false;
      },
    },
  });

  useEffect(() => {
    mermaid.initialize({
      startOnLoad: true,
      theme: "dark",
      themeVariables: {
        darkMode: false,
      },
      flowchart: {
        curve: "basis",
      },
    });
  });

  function updateText(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setText(e.target.value);
  }

  const updateTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const updateDescription = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(e.target.value);
  };

  const updateLink = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLink(e.target.value);
  };

  const updateImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImage(e.target.value);
  };

  async function populatePreview() {
    const html = await marked.parse(text);

    const output = document.getElementById(
      "markdownOutput"
    ) as HTMLTextAreaElement;

    if (!output) return;

    output.innerHTML = html;

    mermaid.run();
  }

  function bold() {
    const textarea = document.getElementById(
      "markdownInput"
    ) as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const selectedText = text.substring(start, end);
    const beforeText = text.substring(0, start);
    const afterText = text.substring(end);

    const isBold =
      start >= 2 &&
      end + 2 <= text.length &&
      text.substring(start - 2, start) === "**" &&
      text.substring(end, end + 2) === "**";

    if (isBold) {
      const newText = `${text.substring(
        0,
        start - 2
      )}${selectedText}${text.substring(end + 2)}`;
      textarea.value = newText;

      if (start === end) {
        textarea.selectionStart = textarea.selectionEnd = start - 2;
      } else {
        textarea.selectionStart = start - 2;
        textarea.selectionEnd = end - 2;
      }
    } else {
      if (start === end) {
        const newText = `${beforeText}****${afterText}`;
        textarea.value = newText;
        textarea.selectionStart = textarea.selectionEnd = start + 2;
      } else {
        const newText = `${beforeText}**${selectedText}**${afterText}`;
        textarea.value = newText;
        textarea.selectionStart = start + 2;
        textarea.selectionEnd = end + 2;
      }
    }

    textarea.focus();
    updateText({ target: textarea } as React.ChangeEvent<HTMLTextAreaElement>);
  }

  function italicize() {
    const textarea = document.getElementById(
      "markdownInput"
    ) as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const selectedText = text.substring(start, end);
    const beforeText = text.substring(0, start);
    const afterText = text.substring(end);

    const isBoldItalic =
      start >= 3 &&
      end + 3 <= text.length &&
      text.substring(start - 3, start) === "***" &&
      text.substring(end, end + 3) === "***";

    const isPureItalic =
      start >= 1 &&
      end + 1 <= text.length &&
      text.charAt(start - 1) === "*" &&
      text.charAt(end) === "*" &&
      (start <= 1 || text.charAt(start - 2) !== "*") &&
      (end + 1 >= text.length || text.charAt(end + 1) !== "*");

    if (isBoldItalic) {
      const newText = `${text.substring(
        0,
        start - 3
      )}**${selectedText}**${text.substring(end + 3)}`;
      textarea.value = newText;

      if (start === end) {
        textarea.selectionStart = textarea.selectionEnd = start - 1;
      } else {
        textarea.selectionStart = start - 1;
        textarea.selectionEnd = end - 1;
      }
    } else if (isPureItalic) {
      const newText = `${text.substring(
        0,
        start - 1
      )}${selectedText}${text.substring(end + 1)}`;
      textarea.value = newText;

      if (start === end) {
        textarea.selectionStart = textarea.selectionEnd = start - 1;
      } else {
        textarea.selectionStart = start - 1;
        textarea.selectionEnd = end - 1;
      }
    } else {
      const isBold =
        start >= 2 &&
        end + 2 <= text.length &&
        text.substring(start - 2, start) === "**" &&
        text.substring(end, end + 2) === "**";

      if (isBold) {
        const newText = `${text.substring(
          0,
          start - 2
        )}***${selectedText}***${text.substring(end + 2)}`;
        textarea.value = newText;

        if (start === end) {
          textarea.selectionStart = textarea.selectionEnd = start + 1;
        } else {
          textarea.selectionStart = start + 1;
          textarea.selectionEnd = end + 1;
        }
      } else {
        if (start === end) {
          const newText = `${beforeText}**${afterText}`;
          textarea.value = newText;
          textarea.selectionStart = textarea.selectionEnd = start + 1;
        } else {
          const newText = `${beforeText}*${selectedText}*${afterText}`;
          textarea.value = newText;
          textarea.selectionStart = start + 1;
          textarea.selectionEnd = end + 1;
        }
      }
    }

    updateText({ target: textarea } as React.ChangeEvent<HTMLTextAreaElement>);
    textarea.focus();
  }

  function strikethrough() {
    const textarea = document.getElementById(
      "markdownInput"
    ) as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const selectedText = text.substring(start, end);
    const beforeText = text.substring(0, start);
    const afterText = text.substring(end);

    const isStrikethrough =
      start >= 2 &&
      end + 2 <= text.length &&
      text.substring(start - 2, start) === "~~" &&
      text.substring(end, end + 2) === "~~";

    if (isStrikethrough) {
      const newText = `${text.substring(
        0,
        start - 2
      )}${selectedText}${text.substring(end + 2)}`;
      textarea.value = newText;

      if (start === end) {
        textarea.selectionStart = textarea.selectionEnd = start - 2;
      } else {
        textarea.selectionStart = start - 2;
        textarea.selectionEnd = end - 2;
      }
    } else {
      if (start === end) {
        const newText = `${beforeText}~~~~${afterText}`;
        textarea.value = newText;
        textarea.selectionStart = textarea.selectionEnd = start + 2;
      } else {
        const newText = `${beforeText}~~${selectedText}~~${afterText}`;
        textarea.value = newText;
        textarea.selectionStart = start + 2;
        textarea.selectionEnd = end + 2;
      }
    }

    updateText({ target: textarea } as React.ChangeEvent<HTMLTextAreaElement>);
    textarea.focus();
  }

  function codeblock() {
    const textarea = document.getElementById(
      "markdownInput"
    ) as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const selectedText = text.substring(start, end);
    const beforeText = text.substring(0, start);
    const afterText = text.substring(end);

    const isCodeblock =
      start >= 3 &&
      end + 3 <= text.length &&
      text.substring(start - 3, start) === "```" &&
      text.substring(end, end + 3) === "```";

    const isInlineCodeBlock =
      start >= 1 &&
      end + 1 <= text.length &&
      text.charAt(start - 1) === "`" &&
      text.charAt(end) === "`";

    if (isCodeblock) {
      const newText = `${text.substring(
        0,
        start - 3
      )}${selectedText}${text.substring(end + 3)}`;
      textarea.value = newText;

      if (start === end) {
        textarea.selectionStart = textarea.selectionEnd = start - 3;
      } else {
        textarea.selectionStart = start - 3;
        textarea.selectionEnd = end - 3;
      }
    } else if (isInlineCodeBlock) {
      const newText = `${text.substring(
        0,
        start - 1
      )}${selectedText}${text.substring(end + 1)}`;
      textarea.value = newText;

      if (start === end) {
        textarea.selectionStart = textarea.selectionEnd = start - 1;
      } else {
        textarea.selectionStart = start - 1;
        textarea.selectionEnd = end - 1;
      }
    } else {
      const lastNewlineBeforeStart = beforeText.lastIndexOf("\n");
      const firstNewlineAfterEnd = afterText.indexOf("\n");

      const textBeforeOnSameLine =
        lastNewlineBeforeStart === -1
          ? beforeText
          : beforeText.substring(lastNewlineBeforeStart + 1);

      const textAfterOnSameLine =
        firstNewlineAfterEnd === -1
          ? afterText
          : afterText.substring(0, firstNewlineAfterEnd);

      const hasTextOnSameLine =
        textBeforeOnSameLine.trim().length > 0 ||
        textAfterOnSameLine.trim().length > 0;

      const isInline = hasTextOnSameLine && !selectedText.includes("\n");

      if (isInline) {
        if (start == end) {
          const newText = `${beforeText}\`${selectedText}\`${afterText}`;
          textarea.value = newText;
          textarea.selectionStart = textarea.selectionEnd = start + 1;
        } else {
          const newText = `${beforeText}\`${selectedText}\`${afterText}`;
          textarea.value = newText;
          textarea.selectionStart = start + 1;
          textarea.selectionEnd = end + 1;
        }
      } else {
        if (start === end) {
          const newText = `${beforeText}\`\`\`\n\n\`\`\`${afterText}`;
          textarea.value = newText;
          textarea.selectionStart = textarea.selectionEnd = start + 4;
        } else {
          const newText = `${beforeText}\`\`\`\n${selectedText}\n\`\`\`${afterText}`;
          textarea.value = newText;
          textarea.selectionStart = start + 4;
          textarea.selectionEnd = end + 4;
        }
      }
    }

    updateText({ target: textarea } as React.ChangeEvent<HTMLTextAreaElement>);
    textarea.focus();
  }

  function heading() {
    const textarea = document.getElementById(
      "markdownInput"
    ) as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const selectedText = text.substring(start, end);
    const afterText = text.substring(end);

    const isHeading1 = start >= 2 && text.substring(start - 2, start) === "# ";

    const isHeading2 = start >= 3 && text.substring(start - 3, start) === "## ";

    const isHeading3 =
      start >= 4 && text.substring(start - 4, start) === "### ";

    if (isHeading1 && !isHeading2 && !isHeading3) {
      const newText = `${text.substring(
        0,
        start - 2
      )}${selectedText}${text.substring(end)}`;
      textarea.value = newText;

      if (start === end) {
        textarea.selectionStart = textarea.selectionEnd = start - 2;
      } else {
        textarea.selectionStart = start - 2;
        textarea.selectionEnd = end - 2;
      }
    } else if (isHeading2 && !isHeading3) {
      const newText = `${text.substring(
        0,
        start - 3
      )}# ${selectedText}${text.substring(end)}`;
      textarea.value = newText;

      if (start === end) {
        textarea.selectionStart = textarea.selectionEnd = start - 1;
      } else {
        textarea.selectionStart = start - 1;
        textarea.selectionEnd = end - 1;
      }
    } else if (isHeading3) {
      const newText = `${text.substring(
        0,
        start - 4
      )}## ${selectedText}${text.substring(end)}`;
      textarea.value = newText;

      if (start === end) {
        textarea.selectionStart = textarea.selectionEnd = start - 1;
      } else {
        textarea.selectionStart = start - 1;
        textarea.selectionEnd = end - 1;
      }
    } else {
      if (start === end) {
        const newText = `### ${selectedText}${afterText}`;
        textarea.value = newText;
        textarea.selectionStart = textarea.selectionEnd = start + 4;
      } else {
        const newText = `### ${selectedText}${afterText}`;
        textarea.value = newText;
        textarea.selectionStart = start + 4;
        textarea.selectionEnd = end + 4;
      }
    }

    updateText({ target: textarea } as React.ChangeEvent<HTMLTextAreaElement>);
    textarea.focus();
  }

  function quote() {
    const textarea = document.getElementById(
      "markdownInput"
    ) as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const selectedText = text.substring(start, end);
    const beforeText = text.substring(0, start);
    const afterText = text.substring(end);

    const isQuote = start >= 2 && text.substring(start - 2, start) === "> ";

    if (isQuote) {
      const newText = `${text.substring(
        0,
        start - 2
      )}${selectedText}${text.substring(end + 2)}`;
      textarea.value = newText;

      if (start === end) {
        textarea.selectionStart = textarea.selectionEnd = start - 2;
      } else {
        textarea.selectionStart = start - 2;
        textarea.selectionEnd = end - 2;
      }
    } else {
      if (start === end) {
        const newText = `${beforeText}> ${selectedText}${afterText}`;
        textarea.value = newText;
        textarea.selectionStart = textarea.selectionEnd = start + 2;
      } else {
        const newText = `${beforeText}> ${selectedText}${afterText}`;
        textarea.value = newText;
        textarea.selectionStart = start + 2;
        textarea.selectionEnd = end + 2;
      }
    }

    updateText({ target: textarea } as React.ChangeEvent<HTMLTextAreaElement>);
    textarea.focus();
  }

  function tagCreationHandler(name: string) {
    setTags((prevTags) => {
      return [...prevTags, name];
    });
    setLocalOptions((prevOptions) => {
      return [...prevOptions, name];
    });
  }

  const isBlog = type === "blog";

  async function handleSubmit(formData: FormData) {
    if (isBlog) {
      try {
        const html = await marked.parse(text);

        formData.set("content", html);
        formData.set("tags", JSON.stringify(tags));
        formData.set("title", title);
        formData.set("description", description);

        const result = await formAction(formData);
      } catch (error) {
        console.error("Error in handleSubmit:", error);
      }
    } else {
      try {
        const html = await marked.parse(text);

        formData.set("extendedDescription", html);
        formData.set("tags", JSON.stringify(tags));
        formData.set("title", title);
        formData.set("description", description);
        formData.set("link", link);
        formData.set("image", image);

        const result = await formAction(formData);
      } catch (error) {
        console.error("Error in handleSubmit:", error);
      }
    }

    setText("");
    setTitle("");
    setTags([]);
    setDescription("");
    setLocalOptions(options);
    setLink("");
    setImage("");
  }

  return (
    <Tabs defaultValue="code" className="flex flex-col h-full">
      <div className="flex items-center justify-between px-4 pt-4">
        <h2 className="font-semibold text-lg">{isBlog ? "Blog" : "Project"}</h2>
        <TabsList className="ml-auto">
          <TabsTrigger value="code">Code</TabsTrigger>
          <TabsTrigger value="preview" onClick={populatePreview}>
            Preview
          </TabsTrigger>
        </TabsList>
      </div>

      <TabsContent value="code" className="flex-grow mt-0">
        <Separator className="mt-3" />
        <div className="flex gap-4 items-center px-4 h-full">
          <Textarea
            placeholder="Start writing..."
            className="min-h-96 h-[95%] flex-1 p-4"
            id="markdownInput"
            onChange={updateText}
            value={text}
            name="content"
          />
          <div className="flex flex-col justify-between h-[95%]">
            <div className="flex flex-col gap-3">
              <ToggleGroup type="multiple" orientation="vertical">
                <ToggleGroupItem
                  value="heading1"
                  aria-label="Heading 1"
                  onClick={heading}
                >
                  <Heading className="h-4 w-4" />
                </ToggleGroupItem>
                <ToggleGroupItem
                  value="heading2"
                  aria-label="Heading 2"
                  onClick={quote}
                >
                  <Quote className="h-4 w-4" />
                </ToggleGroupItem>
                <ToggleGroupItem
                  value="heading3"
                  aria-label="Heading 3"
                  onClick={codeblock}
                >
                  <Code className="h-4 w-4" />
                </ToggleGroupItem>
              </ToggleGroup>
              <ToggleGroup type="multiple" orientation="vertical">
                <ToggleGroupItem
                  value="bold"
                  aria-label="Toggle bold"
                  onClick={bold}
                >
                  <Bold className="h-4 w-4" />
                </ToggleGroupItem>
                <ToggleGroupItem
                  value="italic"
                  aria-label="Toggle italic"
                  onClick={italicize}
                >
                  <Italic className="h-4 w-4" />
                </ToggleGroupItem>
                <ToggleGroupItem
                  value="strikethrough"
                  aria-label="Toggle strikethrough"
                  onClick={strikethrough}
                >
                  <Strikethrough className="h-4 w-4" />
                </ToggleGroupItem>
              </ToggleGroup>
              <ToggleGroup type="multiple" orientation="vertical">
                <ToggleGroupItem value="list" aria-label="Toggle list">
                  <List className="h-4 w-4" />
                </ToggleGroupItem>
                <ToggleGroupItem
                  value="orderedlist"
                  aria-label="Toggle ordered list"
                >
                  <ListOrdered className="h-4 w-4" />
                </ToggleGroupItem>
                <ToggleGroupItem
                  value="checkedlist"
                  aria-label="Toggle checked list"
                >
                  <ListChecks className="h-4 w-4" />
                </ToggleGroupItem>
              </ToggleGroup>
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="w-full mt-2">Create</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Project Creation</DialogTitle>
                </DialogHeader>
                <form
                  action={formAction}
                  onSubmit={(e) => {
                    e.preventDefault();
                    const form = e.currentTarget;
                    const formData = new FormData(form);

                    handleSubmit(formData);
                  }}
                >
                  <div className="grid gap-5 py-4">
                    <div>
                      <Label htmlFor="title">Title</Label>
                      <Input
                        id="title"
                        name="title"
                        placeholder="Title"
                        value={title}
                        onChange={updateTitle}
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
                            onChange={updateLink}
                          />
                        </div>
                        <div>
                          <Label htmlFor="image">Image</Label>
                          <Input
                            id="image"
                            name="image"
                            placeholder="Image"
                            value={image}
                            onChange={updateImage}
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
                        onChange={updateDescription}
                      />
                    </div>
                    <input type="hidden" name="content" value={text} />
                    <DialogClose asChild>
                      <Button type="submit">Submit</Button>
                    </DialogClose>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </TabsContent>
      <TabsContent value="preview" className="flex-grow mt-0">
        <Separator className="mt-3" />
        <div className="flex-1 flex flex-col px-4 h-full overflow-auto">
          <div
            id="markdownOutput"
            className="min-h-96 w-full max-h-[82vh] prose prose-code:bg-slate-200 dark:prose-invert prose-pre:bg-zinc-100 dark:prose-pre:bg-zinc-800 dark:prose-code:bg-zinc-700/50 max-w-full overflow-scroll pt-4"
          />
        </div>
      </TabsContent>
    </Tabs>
  );
}
