import "server-only";

type ListmonkTemplate = {
  id: number;
  name: string;
  type: string;
};

type ListmonkEnvelope = {
  data: unknown;
};

const DEFAULT_LISTMONK_URL = "https://listmonk.splashdeals.rs";
const DEFAULT_TEMPLATE_NAME = "Splashdeals Transactional HTML";
const DEFAULT_TEMPLATE_SUBJECT = "Splashdeals";
const TEMPLATE_BODY = "{{ Safe .Tx.Data.html }}";

let cachedTemplateId: number | null = null;

function getListmonkConfig() {
  const rawUrl = (process.env.LISTMONK_URL || DEFAULT_LISTMONK_URL).replace(/\/+$/, "");
  const url = rawUrl.replace(/^http:\/\//i, "https://");
  const username = process.env.LISTMONK_USERNAME || "";
  const token = process.env.LISTMONK_TOKEN || "";
  const fromEmail = process.env.SMTP_FROM || "Splashdeals <noreply@splashdeals.rs>";

  if (!username || !token) {
    throw new Error(
      "Listmonk credentials are missing. Configure LISTMONK_USERNAME and LISTMONK_TOKEN.",
    );
  }

  return { url, username, token, fromEmail };
}

async function listmonkRequest<T>(path: string, init?: RequestInit): Promise<T> {
  const config = getListmonkConfig();
  const response = await fetch(`${config.url}${path}`, {
    ...init,
    headers: {
      Authorization: `token ${config.username}:${config.token}`,
      "Content-Type": "application/json; charset=utf-8",
      ...(init?.headers || {}),
    },
    cache: "no-store",
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Listmonk API ${path} failed (${response.status}): ${body}`);
  }

  return (await response.json()) as T;
}

function getTransactionalTemplateName() {
  return process.env.LISTMONK_TX_TEMPLATE_NAME || DEFAULT_TEMPLATE_NAME;
}

function getTransactionalTemplateHelp(message: string): Error {
  const templateName = getTransactionalTemplateName();

  return new Error(
    [
      message,
      `Listmonk transactional delivery expects one tx template named "${templateName}" (or a valid LISTMONK_TX_TEMPLATE_ID).`,
      "Required template body:",
      TEMPLATE_BODY,
      "Manual fix in Listmonk:",
      `1. Create a template of type "tx" named "${templateName}".`,
      `2. Set the subject to "${DEFAULT_TEMPLATE_SUBJECT}".`,
      `3. Set the body exactly to: ${TEMPLATE_BODY}`,
      "4. Optionally pin it with LISTMONK_TX_TEMPLATE_ID or LISTMONK_TX_TEMPLATE_NAME.",
    ].join("\n"),
  );
}

function parseTemplateList(envelope: ListmonkEnvelope): ListmonkTemplate[] {
  return Array.isArray(envelope.data) ? (envelope.data as ListmonkTemplate[]) : [];
}

async function ensureTransactionalTemplate(): Promise<number> {
  if (cachedTemplateId) return cachedTemplateId;

  const templateName = getTransactionalTemplateName();
  const templates = parseTemplateList(
    await listmonkRequest<ListmonkEnvelope>("/api/templates", {
      method: "GET",
    }),
  );

  const configuredId = Number(process.env.LISTMONK_TX_TEMPLATE_ID || "");
  if (Number.isInteger(configuredId) && configuredId > 0) {
    const configuredTemplate = templates.find((template) => template.id === configuredId);
    if (!configuredTemplate) {
      throw getTransactionalTemplateHelp(
        `Listmonk template ID ${configuredId} was configured in LISTMONK_TX_TEMPLATE_ID but was not found.`,
      );
    }

    if (configuredTemplate.type !== "tx") {
      throw getTransactionalTemplateHelp(
        `Listmonk template ID ${configuredId} exists but has type "${configuredTemplate.type}" instead of "tx".`,
      );
    }

    cachedTemplateId = configuredId;
    return configuredId;
  }

  const existing = templates.find(
    (template) => template.type === "tx" && template.name === templateName,
  );

  if (existing) {
    cachedTemplateId = existing.id;
    return existing.id;
  }

  let createdTemplate: ListmonkTemplate | undefined;

  try {
    await listmonkRequest<ListmonkEnvelope>("/api/templates", {
      method: "POST",
      body: JSON.stringify({
        name: templateName,
        type: "tx",
        subject: DEFAULT_TEMPLATE_SUBJECT,
        body: TEMPLATE_BODY,
      }),
    });

    const refreshedTemplates = parseTemplateList(
      await listmonkRequest<ListmonkEnvelope>("/api/templates", {
        method: "GET",
      }),
    );
    createdTemplate = refreshedTemplates.find(
      (template) => template.type === "tx" && template.name === templateName,
    );
  } catch (error) {
    const reason = error instanceof Error ? error.message : String(error);
    throw getTransactionalTemplateHelp(
      `Listmonk could not auto-create the transactional template "${templateName}". Original error: ${reason}`,
    );
  }

  if (!createdTemplate) {
    throw getTransactionalTemplateHelp(
      `Listmonk reported a successful create flow, but the transactional template "${templateName}" was still not visible in /api/templates.`,
    );
  }

  cachedTemplateId = createdTemplate.id;
  return createdTemplate.id;
}

export async function sendListmonkTransactionalEmail(params: {
  to: string;
  subject: string;
  html: string;
  text?: string;
}): Promise<void> {
  const templateId = await ensureTransactionalTemplate();
  const config = getListmonkConfig();

  await listmonkRequest<ListmonkEnvelope>("/api/tx", {
    method: "POST",
    body: JSON.stringify({
      subscriber_mode: "external",
      subscriber_emails: [params.to],
      template_id: templateId,
      subject: params.subject,
      from_email: config.fromEmail,
      content_type: "html",
      altbody: params.text,
      data: {
        html: params.html,
      },
    }),
  });
}
