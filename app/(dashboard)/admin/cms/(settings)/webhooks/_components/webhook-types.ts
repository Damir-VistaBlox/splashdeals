export const WEBHOOK_EVENT_LABELS: Record<string, string> = {
  "post.created": "Objava kreirana",
  "post.updated": "Objava ažurirana",
  "post.deleted": "Objava obrisana",
  "page.created": "Strana kreirana",
  "page.updated": "Strana ažurirana",
  "page.deleted": "Strana obrisana",
  "category.created": "Kategorija kreirana",
  "category.updated": "Kategorija ažurirana",
  "category.deleted": "Kategorija obrisana",
};

export type WebhookRow = {
  id: string;
  name: string;
  url: string;
  events: string[];
  isActive: boolean;
  consecutiveFailures: number;
  createdAt: string;
  updatedAt: string;
  latestLog: {
    id: string;
    event: string;
    status: string;
    responseCode: number | null;
    createdAt: string;
  } | null;
};

export type WebhookDetail = {
  id: string;
  name: string;
  url: string;
  events: string[];
  isActive: boolean;
  consecutiveFailures: number;
  createdAt: string;
  updatedAt: string;
};

export type WebhookLogRow = {
  id: string;
  event: string;
  status: string;
  responseCode: number | null;
  responseBody: string | null;
  createdAt: string;
};
