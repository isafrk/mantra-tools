export type ToolCategory = 'all' | 'ai-creator' | 'media-assets' | 'developer-text';

export interface ToolItem {
  id: string;
  title: string;
  shortTitle: string;
  category: 'ai-creator' | 'media-assets' | 'developer-text';
  description: string;
  badge?: string;
  iconName: string;
  tags: string[];
}
