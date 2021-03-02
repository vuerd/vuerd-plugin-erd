import { ColumnType } from '../store/canvas.state';
import { TableType, MoveKey } from '../store/editor.state';
import { RelationshipType } from '../store/relationship.state';

export interface HasUndoRedo {
  hasUndo: boolean;
  hasRedo: boolean;
}

export interface FocusTable {
  tableId: string;
  focusType?: TableType;
}

export interface FocusColumn {
  tableId: string;
  columnId: string;
  focusType: ColumnType;
  ctrlKey: boolean;
  shiftKey: boolean;
}

export interface FocusMoveTable {
  moveKey: MoveKey;
  shiftKey: boolean;
}

export interface DrawStartRelationship {
  relationshipType: RelationshipType;
}

export interface DrawStartAddRelationship {
  tableId: string;
}

export interface EditorCommandMap {
  'editor.hasUndoRedo': HasUndoRedo;
  'editor.focusTable': FocusTable;
  'editor.focusColumn': FocusColumn;
  'editor.focusTableEnd': null;
  'editor.focusMoveTable': FocusMoveTable;
  'editor.editTable': null;
  'editor.editTableEnd': null;
  'editor.selectAllColumn': null;
  'editor.drawStartRelationship': DrawStartRelationship;
  'editor.drawStartAddRelationship': DrawStartAddRelationship;
  'editor.drawEndRelationship': null;
}