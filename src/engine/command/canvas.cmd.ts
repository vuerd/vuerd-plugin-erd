import { State } from '@@types/engine/store';
import {
  MoveCanvas,
  MovementCanvas,
  ResizeCanvas,
  ChangeCanvasShow,
  ChangeDatabase,
  ChangeDatabaseName,
  ChangeCanvasType,
  ChangeLanguage,
  ChangeNameCase,
  ChangeRelationshipDataTypeSync,
  MoveColumnOrder,
} from '@@types/engine/command/canvas.cmd';

export function executeMoveCanvas(state: State, data: MoveCanvas) {
  const { canvasState } = state;
  canvasState.scrollTop = data.scrollTop;
  canvasState.scrollLeft = data.scrollLeft;
}

export function executeMovementCanvas(state: State, data: MovementCanvas) {
  const { canvasState } = state;
  canvasState.scrollTop += data.movementY;
  canvasState.scrollLeft += data.movementX;
}

export function executeResizeCanvas(state: State, data: ResizeCanvas) {
  const { canvasState } = state;
  canvasState.width = data.width;
  canvasState.height = data.height;
}

export function executeChangeCanvasShow(state: State, data: ChangeCanvasShow) {
  const { tables } = state.tableState;
  const { relationships } = state.relationshipState;
  const { show } = state.canvasState;
  show[data.showKey] = data.value;
  // relationshipSort(tables, relationships);
}

export function executeChangeDatabase(state: State, data: ChangeDatabase) {
  state.canvasState.database = data.database;
}

export function executeChangeDatabaseName(
  state: State,
  data: ChangeDatabaseName
) {
  state.canvasState.databaseName = data.value;
}

export function executeChangeCanvasType(state: State, data: ChangeCanvasType) {
  state.canvasState.canvasType = data.canvasType;
}

export function executeChangeLanguage(state: State, data: ChangeLanguage) {
  state.canvasState.language = data.language;
}

export function executeChangeTableCase(state: State, data: ChangeNameCase) {
  state.canvasState.tableCase = data.nameCase;
}

export function executeChangeColumnCase(state: State, data: ChangeNameCase) {
  state.canvasState.columnCase = data.nameCase;
}

export function executeChangeRelationshipDataTypeSync(
  state: State,
  data: ChangeRelationshipDataTypeSync
) {
  state.canvasState.setting.relationshipDataTypeSync = data.value;
}

export function executeMoveColumnOrder(state: State, data: MoveColumnOrder) {
  const { columnOrder } = state.canvasState.setting;

  if (data.columnType === data.targetColumnType) return;

  const targetIndex = columnOrder.indexOf(data.targetColumnType);
  const currentIndex = columnOrder.indexOf(data.columnType);
  if (targetIndex !== -1 && currentIndex !== -1) {
    columnOrder.splice(currentIndex, 1);
    columnOrder.splice(targetIndex, 0, data.columnType);
  }
}

export const executeCanvasCommandMap = {
  'canvas.move': executeMoveCanvas,
  'canvas.movement': executeMovementCanvas,
  'canvas.resize': executeResizeCanvas,
  'canvas.changeShow': executeChangeCanvasShow,
  'canvas.changeDatabase': executeChangeDatabase,
  'canvas.changeDatabaseName': executeChangeDatabaseName,
  'canvas.changeCanvasType': executeChangeCanvasType,
  'canvas.changeLanguage': executeChangeLanguage,
  'canvas.changeTableCase': executeChangeTableCase,
  'canvas.changeColumnCase': executeChangeColumnCase,
  'canvas.changeRelationshipDataTypeSync': executeChangeRelationshipDataTypeSync,
  'canvas.moveColumnOrder': executeMoveColumnOrder,
};