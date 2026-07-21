export type ItemType = "image" | "video" | "pdf";

export interface PortfolioItem {
  id: string;
  title: string;
  type: ItemType;
  url: string; // The source file URL (image, video player stream, or PDF file)
  thumbnailUrl?: string; // Optional cover thumbnail if needed
  description?: string;
  category: "design" | "3d" | "animation";
  isUserCreated?: boolean;
  fileName?: string;
  fileSize?: number;
  images?: string[];
}

export interface CategoryInfo {
  id: "design" | "3d" | "animation";
  title: string;
  coverImage: string;
  description: string;
  items: PortfolioItem[];
}
