export interface ICreateCategory {
  name: string;
  description?: string;
  icon?: string;
  isActive?: boolean;
}

export interface IUpdateCategory {
  name?: string;
  description?: string;
  icon?: string;
  isActive?: boolean;
}
