import { useEffect, useRef } from "react";
import { EditorView, basicSetup } from "codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { css } from "@codemirror/lang-css";
import { html } from "@codemirror/lang-html";
import { json } from "@codemirror/lang-json";
import { oneDark } from "@codemirror/theme-one-dark";
import { EditorState } from "@codemirror/state";

interface CodeEditorProps {
  content: string;
  language: string;
  onChange?: (value: string) => void;
  readOnly?: boolean;
}

function getLanguageExtension(lang: string) {
  switch (lang) {
    case "typescript":
    case "javascript":
      return javascript({ typescript: lang === "typescript", jsx: true });
    case "css":
      return css();
    case "html":
      return html();
    case "json":
      return json();
    default:
      return javascript();
  }
}

export default function CodeEditor({ content, language, onChange, readOnly }: CodeEditorProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const extensions = [
      basicSetup,
      getLanguageExtension(language),
      oneDark,
      EditorView.theme({
        "&": { height: "100%", fontSize: "13px" },
        ".cm-scroller": { overflow: "auto" },
        ".cm-content": { fontFamily: "'JetBrains Mono', monospace" },
        ".cm-gutters": {
          backgroundColor: "hsl(20, 10%, 8%)",
          borderRight: "1px solid hsl(20, 10%, 15%)",
        },
      }),
    ];

    if (readOnly) {
      extensions.push(EditorState.readOnly.of(true));
    }

    if (onChange) {
      extensions.push(
        EditorView.updateListener.of((update) => {
          if (update.docChanged) {
            onChange(update.state.doc.toString());
          }
        })
      );
    }

    const view = new EditorView({
      state: EditorState.create({ doc: content, extensions }),
      parent: containerRef.current,
    });

    viewRef.current = view;

    return () => {
      view.destroy();
    };
    // Recreate editor when file changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language, readOnly]);

  // Update content when it changes externally
  useEffect(() => {
    const view = viewRef.current;
    if (!view) return;
    const current = view.state.doc.toString();
    if (current !== content) {
      view.dispatch({
        changes: { from: 0, to: current.length, insert: content },
      });
    }
  }, [content]);

  return <div ref={containerRef} className="h-full w-full overflow-hidden" />;
}
