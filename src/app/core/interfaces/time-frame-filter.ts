export interface TimeFrameFilter {
  label: string;
  value: string;
  getDates: () => { start: Date | null; end: Date | null };
  customDateRange?: { start: Date; end: Date };
}
