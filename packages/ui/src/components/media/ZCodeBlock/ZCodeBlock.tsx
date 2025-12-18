import { forwardRef, HTMLAttributes } from "react";
import { Copy, Check } from "lucide-react";
import { cn } from "@/utils/cn";
import styles from "./ZCodeBlock.module.css";
import { useState } from "react";

export interface ZCodeBlockProps extends HTMLAttributes<HTMLPreElement> {
  /** Code content */
  code: string;
  /** Language */
  language?: string;
  /** Show copy button */
  showCopy?: boolean;
  /** Show line numbers */
  showLineNumbers?: boolean;
}

export const ZCodeBlock = forwardRef<HTMLPreElement, ZCodeBlockProps>(
  (
    {
      code,
      language = "text",
      showCopy = true,
      showLineNumbers = false,
      className,
      ...props
    },
    ref
  ) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    };

    const lines = code.split("\n");

    return (
      <div className={cn(styles.container, className)}>
        {language && (
          <div className={styles.header}>
            <span className={styles.language}>{language}</span>
            {showCopy && (
              <button onClick={handleCopy} className={styles.copyButton}>
                {copied ? (
                  <>
                    <Check className={styles.icon} />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className={styles.icon} />
                    Copy
                  </>
                )}
              </button>
            )}
          </div>
        )}
        <pre ref={ref} className={styles.pre} {...props}>
          <code className={styles.code}>
            {showLineNumbers ? (
              <div className={styles.linesContainer}>
                <div className={styles.lineNumbers}>
                  {lines.map((_, i) => (
                    <div key={i} className={styles.lineNumber}>
                      {i + 1}
                    </div>
                  ))}
                </div>
                <div className={styles.codeContent}>{code}</div>
              </div>
            ) : (
              code
            )}
          </code>
        </pre>
      </div>
    );
  }
);

ZCodeBlock.displayName = "ZCodeBlock";

export default ZCodeBlock;
