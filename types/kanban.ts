export interface CardType {
  id: string;
  title: string;
  content: string;
}

export interface ColumnType {
  id: string;
  title: string;
  cardIds: string[];
}

export interface KanbanData {
  cards: {
    [key: string]: CardType;
  };
  columns: {
    [key: string]: ColumnType;
  };
  columnOrder: string[];
}