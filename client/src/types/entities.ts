export interface BaseEntity {
  id: number;
  name: string;
  sorted_name: string;
  image_url: string;
  discogs_id?: number;
  release_count?: number;
  discogs_image_url?: string;
}

export interface BaseEntityForm {
  name: string;
  sorted_name: string;
  discogs_id?: number;
  image_url?: string;
}