import { Check, ChevronsUpDown, Loader2 } from "lucide-react";
import { useEffect, useState, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

export function AsyncSearchSelect({
  value,
  onChange,
  placeholder = "Select option",
  displayValue,
  renderOption,
  getKey,
  fetchOptions,
}) {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([]);
  const [query, setQuery] = useState("");
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [initialLoadDone, setInitialLoadDone] = useState(false);

  const loadingRef = useRef(false);
  const hasMoreRef = useRef(true);
  const pageRef = useRef(1);
  const queryRef = useRef("");
  const observer = useRef(null);
  const loadMoreRef = useRef(null);

  const loadData = useCallback(
    async (reset = false) => {
      if (loadingRef.current) return;
      if (!hasMoreRef.current && !reset) return;

      loadingRef.current = true;
      setLoading(true);

      try {
        const currentPage = reset ? 1 : pageRef.current;
        const res = await fetchOptions(queryRef.current, currentPage);

        const newItems = res.data || [];

        setItems((prev) => {
          if (reset) return newItems;
          // Deduplicate
          const existingKeys = new Set(prev.map((i) => getKey(i)));
          const unique = newItems.filter((i) => !existingKeys.has(getKey(i)));
          return [...prev, ...unique];
        });

        hasMoreRef.current = res.hasMore;
        setHasMore(res.hasMore);

        pageRef.current = currentPage + 1;

        if (reset) {
          setInitialLoadDone(true);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        loadingRef.current = false;
        setLoading(false);
      }
    },
    [fetchOptions, getKey],
  );

  // Debounced search
  useEffect(() => {
    queryRef.current = query;

    const delay = setTimeout(() => {
      if (open) {
        // Only load if popover is open
        pageRef.current = 1;
        hasMoreRef.current = true;
        setHasMore(true);
        setItems([]);
        setInitialLoadDone(false);
        loadData(true);
      }
    }, 400);

    return () => clearTimeout(delay);
  }, [query, loadData, open]);

  // Load when opened
  useEffect(() => {
    if (open) {
      if (!initialLoadDone && items.length === 0) {
        loadData(true);
      }
    }
  }, [open, initialLoadDone, items.length, loadData]);

  // Setup intersection observer - separate effect for observer setup
  useEffect(() => {
    if (!open) return;

    // Small delay to ensure DOM is ready
    const setupObserver = setTimeout(() => {
      if (!loadMoreRef.current) {
        return;
      }

      // Disconnect previous observer
      if (observer.current) {
        observer.current.disconnect();
      }

      // Create new observer
      observer.current = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (
              entry.isIntersecting &&
              hasMoreRef.current &&
              !loadingRef.current
            ) {
              loadData();
            }
          });
        },
        {
          root: null,
          rootMargin: "100px",
          threshold: 0,
        },
      );

      // Start observing
      observer.current.observe(loadMoreRef.current);
    }, 100);

    return () => {
      clearTimeout(setupObserver);
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, [open, loadData]);

  // Reset when closed
  useEffect(() => {
    if (!open) {
      setQuery("");
      queryRef.current = "";
      setInitialLoadDone(false);
      pageRef.current = 1;
      hasMoreRef.current = true;
      setHasMore(true);
      setItems([]);

      if (observer.current) {
        observer.current.disconnect();
      }
    }
  }, [open]);

  const selectedItem =
    typeof value === "object" ? value : items.find((i) => getKey(i) === value);

  useEffect(() => {
    if (!value) return;

    if (typeof value === "object") {
      setItems((prev) => {
        const exists = prev.find((i) => getKey(i) === getKey(value));
        if (exists) return prev;
        return [value, ...prev];
      });
    }
  }, [value, getKey]);

  return (
    <Popover open={open} onOpenChange={setOpen} modal>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          className={cn(
            "w-full justify-between overflow-hidden bg-transparent",
            !value && "text-muted-foreground",
          )}
        >
          <span className="truncate max-w-[90%]">
            {selectedItem ? displayValue(selectedItem) : placeholder}
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
        <Command shouldFilter={false}>
          <CommandInput
            placeholder="Search..."
            onValueChange={(val) => setQuery(val)}
          />

          <CommandList className="max-h-60 overflow-y-auto">
            <CommandEmpty>
              {loading && items.length === 0
                ? "Loading..."
                : "No results found."}
            </CommandEmpty>

            <CommandGroup>
              {items.map((item) => (
                <CommandItem
                  key={getKey(item)}
                  value={getKey(item)}
                  onSelect={() => {
                    onChange(item);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4 shrink-0",
                      getKey(item) ===
                        (typeof value === "object" ? getKey(value) : value)
                        ? "opacity-100"
                        : "opacity-0",
                    )}
                  />
                  {renderOption ? renderOption(item) : displayValue(item)}
                </CommandItem>
              ))}

              {/* Always render the loader container */}
              <div ref={loadMoreRef} className="w-full">
                {loading && (
                  <div className="flex justify-center items-center gap-2 p-3">
                    <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      Loading more...
                    </span>
                  </div>
                )}
                {!loading && !hasMore && items.length > 0 && (
                  <div className="text-center py-2 text-xs text-gray-400">
                    — End of list —
                  </div>
                )}
                {!loading && hasMore && items.length > 0 && (
                  <div className="h-4" /> // Invisible spacer to ensure scroll area
                )}
              </div>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
