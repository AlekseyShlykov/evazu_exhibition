export type AnalyticsEvent =
  | "loading_completed"
  | "exhibition_started"
  | "artwork_hovered"
  | "artwork_selected"
  | "artwork_close_view"
  | "preorder_opened"
  | "preorder_submitted"
  | "guestbook_opened"
  | "guestbook_submitted";

type EventProperties = Record<string, string | number | boolean | undefined>;
type AnalyticsAdapter = (event: AnalyticsEvent, properties?: EventProperties) => void;

let adapter: AnalyticsAdapter | undefined;

export function configureAnalytics(nextAdapter: AnalyticsAdapter): void {
  adapter = nextAdapter;
}

export function track(event: AnalyticsEvent, properties?: EventProperties): void {
  adapter?.(event, properties);
  if (process.env.NODE_ENV === "development") {
    console.info("[analytics]", event, properties ?? {});
  }
}
