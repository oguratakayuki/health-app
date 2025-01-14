export interface Category {
  id?: number;
  name: string;
  display_name: string;
  _destroy?: boolean; // 削除フラグ
}

export interface TagCategory {
  id?: number;
  category: Category;
  _destroy?: boolean; // 削除フラグ
}

export interface Tag {
  id?: number;
  name: string;
  tag_categories?: TagCategory[]; // オプショナルプロパティ
  _destroy?: boolean; // 削除フラグ
}
