"use client";

import * as React from "react";
import { X } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Badge } from "@/components/ui/badge";
import { Button } from "./button";

type MultiSelectProps = {
  options: string[];
  selected: string[];
  onChange: (selected: string[]) => void;
  placeholder?: string;
  onTagCreate: (tag: string) => void;
};

export function MultiSelect({
  options,
  selected,
  onChange,
  placeholder = "Select options...",
  onTagCreate,
}: MultiSelectProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [open, setOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState("");

  const handleUnselect = (option: string) => {
    onChange(selected.filter((s) => s !== option));
  };

  const selectables = options.filter((option) => !selected.includes(option));

  function tagCreationHandler() {
    if (inputValue.trim() === "") return;
    onTagCreate(inputValue);
    setInputValue("");
    setOpen(false);
  }

  return (
    <Command className="overflow-visible bg-transparent">
      <div className="group border border-input px-3 py-2 text-sm ring-offset-background rounded-md focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
        <div className="flex gap-1 flex-wrap">
          {selected.map((option) => {
            return (
              <Badge key={option} variant="secondary">
                {option}
                <button
                  className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleUnselect(option);
                    }
                  }}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  onClick={() => handleUnselect(option)}
                >
                  <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                </button>
              </Badge>
            );
          })}
          <CommandInput
            ref={inputRef}
            value={inputValue}
            onValueChange={setInputValue}
            onBlur={() => setOpen(false)}
            onFocus={() => setOpen(true)}
            placeholder={placeholder}
            showBorder={false}
            className="ml-0 bg-transparent outline-none border-none shadow-none placeholder:text-muted-foreground flex-1 p-0 focus:ring-0 focus:ring-offset-0"
          />
        </div>
      </div>
      <div className="relative mt-2">
        {open && selectables.length > 0 ? (
          <div className="absolute w-full z-10 top-0 rounded-md bg-white dark:bg-zinc-900 text-popover-foreground shadow-md outline-none animate-in">
            <CommandList>
              <CommandEmpty>
                <div>
                  <Button
                    variant={"ghost"}
                    className="w-[95%]"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      if (inputValue.trim()) {
                        tagCreationHandler();
                      }
                    }}
                  >
                    Create &quot;{inputValue}&quot;?
                  </Button>
                </div>
              </CommandEmpty>
              <CommandGroup className="h-full overflow-auto">
                {selectables.map((option) => {
                  return (
                    <CommandItem
                      key={option}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                      }}
                      onSelect={() => {
                        setInputValue("");
                        onChange([...selected, option]);
                      }}
                      className={"cursor-pointer"}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          onChange([...selected, option]);
                          setInputValue("");
                        }
                      }}
                    >
                      {option}
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </CommandList>
          </div>
        ) : null}
      </div>
    </Command>
  );
}
