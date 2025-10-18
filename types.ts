export enum Sender {
  User = 'user',
  Bot = 'bot',
}

export interface Message {
  id: string;
  text: string;
  sender: Sender;
}

export interface Language {
  code: string;
  name: "English" | "हिन्दी" | "தமிழ்" | "বাংলা" | "తెలుగు";
}
