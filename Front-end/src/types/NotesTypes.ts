export default interface Notestype {
  notes: Array<{ title: string; body: string; id: string }>;
  message: string;
  code: number;
}