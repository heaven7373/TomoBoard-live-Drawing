"use client";

import { useEffect, useState } from "react";
import styles from "./StudentLearningHub.module.css";

const templates: Record<string, string> = {
  javascript: `// JavaScript sample\nconsole.log("Hello from JavaScript");`,
  python: `# Python sample\nprint("Hello from Python")`,
  java: `// Java sample\nclass Main {\n  public static void main(String[] args) {\n    System.out.println("Hello from Java");\n  }\n}`,
  cpp: `// C++ sample\n#include <iostream>\nint main(){ std::cout << "Hello from C++" << std::endl; return 0; }`,
  html: `<!-- HTML sample -->\n<!doctype html>\n<html><body><h1>Hello from HTML</h1></body></html>`,
  css: `/* CSS sample */\nbody { background: #f0f0f0; }`,
  typescript: `// TypeScript sample\nconst msg: string = "Hello from TypeScript";\nconsole.log(msg);`,
};

export function StudentLearningHub({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [language, setLanguage] = useState<string>("javascript");
  const [code, setCode] = useState<string>(templates.javascript);
  const [output, setOutput] = useState<string>("Run your code to see the output here.");
  const [videoUrl, setVideoUrl] = useState<string>("https://www.youtube.com/watch?v=aqvD3w85I_0");
  const [videoSize, setVideoSize] = useState<string>("medium");

  useEffect(() => {
    setCode(templates[language] ?? "");
  }, [language]);

  useEffect(() => {
    if (!open) {
      setOutput("Run your code to see the output here.");
    }
  }, [open]);

  function handleRun() {
    if (language !== "javascript") {
      setOutput("Running only supported for JavaScript in the browser. Use an external REPL for other languages.");
      return;
    }

    const lines: string[] = [];
    const captureConsole = {
      log: (...args: unknown[]) => {
        lines.push(args.map((a) => String(a)).join(" "));
      },
      warn: (...args: unknown[]) => {
        lines.push("WARN: " + args.map((a) => String(a)).join(" "));
      },
      error: (...args: unknown[]) => {
        lines.push("ERROR: " + args.map((a) => String(a)).join(" "));
      },
    };

    try {
      // eslint-disable-next-line no-new-func
      const run = new Function("console", code);
      run(captureConsole);
      setOutput(lines.length ? lines.join("\n") : "No output generated.");
    } catch (err) {
      setOutput(err instanceof Error ? `Error: ${err.message}` : "Unknown error");
    }
  }

  function openVideoInNewWindow() {
    if (!videoUrl) return;
    const embed = toEmbedUrl(videoUrl);
    const sizes: Record<string, string> = {
      small: "560,315",
      medium: "800,450",
      large: "1280,720",
    };
    const [w, h] = (sizes[videoSize] || sizes.medium).split(",");
    window.open(embed, "_blank", `width=${w},height=${h}`);
  }

  function toEmbedUrl(url: string) {
    try {
      const u = new URL(url);
      if (u.hostname.includes("youtube.com") && u.searchParams.get("v")) {
        return `https://www.youtube.com/watch?v=${u.searchParams.get("v")}`;
      }
      if (u.hostname === "youtu.be") {
        const id = u.pathname.slice(1);
        return `https://www.youtube.com/watch?v=${id}`;
      }
      return url;
    } catch (e) {
      return url;
    }
  }

  if (!open) return null;

  return (
    <div className={styles.modalOverlay} role="dialog" aria-modal="true">
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <h3>Student study hub</h3>
          <button className={styles.close} onClick={onClose} aria-label="Close">✕</button>
        </div>

        <div className={styles.modalBody}>
          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <h4>Virtual coding lab</h4>
              <div>
                <label className={styles.label}>Language</label>
                <select value={language} onChange={(e) => setLanguage(e.target.value)}>
                  {Object.keys(templates).map((lang) => (
                    <option key={lang} value={lang}>
                      {lang}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <textarea className={styles.textarea} value={code} onChange={(e) => setCode(e.target.value)} spellCheck={false} />

            <div className={styles.actions}>
              <button type="button" className={styles.primaryButton} onClick={handleRun}>
                Run
              </button>
              <button type="button" className={styles.secondaryButton} onClick={() => setCode(templates[language] ?? "")}>
                Reset
              </button>
              {language !== "javascript" ? (
                <a className={styles.externalLink} href="https://replit.com/" target="_blank" rel="noreferrer">
                  Open in Repl.it
                </a>
              ) : null}
            </div>

            <pre className={styles.output}>{output}</pre>
          </section>

          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <h4>Watch a lesson</h4>
              <div>
                <label className={styles.label}>Size</label>
                <select value={videoSize} onChange={(e) => setVideoSize(e.target.value)}>
                  <option value="small">Small</option>
                  <option value="medium">Medium</option>
                  <option value="large">Large</option>
                </select>
              </div>
            </div>

            <div className={styles.inputRow}>
              <input className={styles.input} value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} placeholder="Paste YouTube link here" />
              <button className={styles.openButton} onClick={openVideoInNewWindow}>
                Open
              </button>
            </div>

            <div className={`${styles.previewWrap} ${styles[videoSize]}`}>
              <iframe
                src={toEmbedUrl(videoUrl).replace("watch?v=", "embed/")}
                title="Video preview"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
