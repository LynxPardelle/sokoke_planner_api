export type TEmailOptions = {
  to: string | string[];
  cc?: string | string[];
  bcc?: string | string[];
  subject?: string;
  template?: string;
  context?: Record<string, any>;
  text?: string;
  html?: string;
  attachments?: Array<{
    filename: string;
    content: Buffer | string;
    contentType?: string;
  }>;
};

export type TEmailTemplate = {
  subject: string;
  html: string;
  text?: string;
};