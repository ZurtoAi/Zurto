import {
  forwardRef,
  useState,
  useRef,
  useEffect,
  InputHTMLAttributes,
} from "react";
import { X } from "lucide-react";
import { cn } from "@/utils/cn";
import styles from "./ZMention.module.css";

export interface MentionUser {
  /** User ID */
  id: string;
  /** Display name */
  name: string;
  /** Avatar URL */
  avatar?: string;
  /** Username */
  username?: string;
}

export interface ZMentionProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "value" | "onChange"> {
  /** Current value */
  value: string;
  /** Change handler */
  onChange: (value: string) => void;
  /** User search function */
  onSearch: (query: string) => Promise<MentionUser[]>;
  /** Mention trigger character */
  trigger?: string;
  /** Selected users */
  mentions?: MentionUser[];
  /** Mention callback */
  onMention?: (user: MentionUser) => void;
}

export const ZMention = forwardRef<HTMLInputElement, ZMentionProps>(
  (
    {
      value,
      onChange,
      onSearch,
      trigger = "@",
      mentions = [],
      onMention,
      className,
      ...props
    },
    ref
  ) => {
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [suggestions, setSuggestions] = useState<MentionUser[]>([]);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [searchQuery, setSearchQuery] = useState("");
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
      const handleSearch = async () => {
        if (searchQuery) {
          const results = await onSearch(searchQuery);
          setSuggestions(results);
          setShowSuggestions(results.length > 0);
        } else {
          setShowSuggestions(false);
        }
      };

      handleSearch();
    }, [searchQuery, onSearch]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      onChange(newValue);

      // Check if user typed trigger character
      const cursorPos = e.target.selectionStart || 0;
      const textBeforeCursor = newValue.slice(0, cursorPos);
      const lastTriggerIndex = textBeforeCursor.lastIndexOf(trigger);

      if (lastTriggerIndex !== -1) {
        const query = textBeforeCursor.slice(lastTriggerIndex + 1);
        if (!query.includes(" ")) {
          setSearchQuery(query);
        } else {
          setShowSuggestions(false);
        }
      } else {
        setShowSuggestions(false);
      }
    };

    const handleSelectUser = (user: MentionUser) => {
      const cursorPos = inputRef.current?.selectionStart || 0;
      const textBeforeCursor = value.slice(0, cursorPos);
      const lastTriggerIndex = textBeforeCursor.lastIndexOf(trigger);

      const beforeMention = value.slice(0, lastTriggerIndex);
      const afterMention = value.slice(cursorPos);
      const newValue = `${beforeMention}${trigger}${
        user.username || user.name
      } ${afterMention}`;

      onChange(newValue);
      onMention?.(user);
      setShowSuggestions(false);
      setSearchQuery("");
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (!showSuggestions) return;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % suggestions.length);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex(
          (prev) => (prev - 1 + suggestions.length) % suggestions.length
        );
      } else if (e.key === "Enter" && suggestions[selectedIndex]) {
        e.preventDefault();
        handleSelectUser(suggestions[selectedIndex]);
      } else if (e.key === "Escape") {
        setShowSuggestions(false);
      }
    };

    return (
      <div className={cn(styles.container, className)}>
        <input
          ref={inputRef || ref}
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          className={styles.input}
          {...props}
        />

        {showSuggestions && suggestions.length > 0 && (
          <div className={styles.suggestions}>
            {suggestions.map((user, index) => (
              <button
                key={user.id}
                onClick={() => handleSelectUser(user)}
                className={cn(
                  styles.suggestion,
                  index === selectedIndex && styles.selected
                )}
              >
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className={styles.avatar}
                  />
                ) : (
                  <div className={styles.avatarPlaceholder}>
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <div className={styles.userInfo}>
                  <div className={styles.name}>{user.name}</div>
                  {user.username && (
                    <div className={styles.username}>@{user.username}</div>
                  )}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }
);

ZMention.displayName = "ZMention";

export default ZMention;
