import {
  cloneDeep,
  isArray,
  isBoolean,
  isNumber,
  isObject,
  isString,
} from '@/core/helper';
import {
  SIZE_COLUMN_CLOSE,
  SIZE_COLUMN_HEIGHT,
  SIZE_COLUMN_KEY,
  SIZE_COLUMN_MARGIN_RIGHT,
  SIZE_MIN_WIDTH,
  SIZE_START_X,
  SIZE_START_Y,
  SIZE_TABLE_HEADER_HEIGHT,
} from '@/core/layout';
import { AddTable } from '@@types/engine/command/table.cmd';
import { Show } from '@@types/engine/store/canvas.state';
import {
  Column,
  ColumnWidth,
  PureTable,
  Table,
  TableUI,
} from '@@types/engine/store/table.state';

import { getDefaultWidthColumn, getMaxWidthColumn } from './table.model.helper';

interface TableData {
  addTable?: AddTable;
  loadTable?: PureTable;
}

const isLoadTable = (loadTable: PureTable) =>
  isString(loadTable.id) &&
  isString(loadTable.name) &&
  isString(loadTable.comment) &&
  isArray(loadTable.columns) &&
  isObject(loadTable.ui) &&
  isBoolean(loadTable.ui.active) &&
  isNumber(loadTable.ui.left) &&
  isNumber(loadTable.ui.top) &&
  isNumber(loadTable.ui.zIndex) &&
  isNumber(loadTable.ui.widthName) &&
  isNumber(loadTable.ui.widthComment);

export class TableModel implements Table {
  id: string;
  name = '';
  comment = '';
  columns: Column[] = [];
  ui: TableUI = {
    active: false,
    left: SIZE_START_X,
    top: SIZE_START_Y,
    zIndex: 2,
    widthName: SIZE_MIN_WIDTH,
    widthComment: SIZE_MIN_WIDTH,
  };
  visible = true;

  private _show: Show;

  constructor({ addTable, loadTable }: TableData, show: Show) {
    this._show = show;

    if (addTable) {
      const { id, ui } = addTable;

      this.id = id;
      this.ui = Object.assign(this.ui, ui);
      this.visible = true;
    } else if (loadTable && isLoadTable(loadTable)) {
      const { id, name, comment, columns, ui, visible } = cloneDeep(loadTable);

      this.id = id;
      this.name = name;
      this.comment = comment;
      this.columns = columns;
      this.ui = Object.assign(this.ui, ui);
      if (isBoolean(visible)) this.visible = visible;
    } else {
      throw new Error('not found table');
    }
  }

  width(): number {
    // table header width
    let width = this.ui.widthName + SIZE_COLUMN_MARGIN_RIGHT;
    if (this._show.tableComment) {
      width += this.ui.widthComment + SIZE_COLUMN_MARGIN_RIGHT;
    }

    // default width column
    const defaultWidthColumn =
      getDefaultWidthColumn(this._show) +
      SIZE_COLUMN_CLOSE +
      SIZE_COLUMN_KEY +
      SIZE_COLUMN_MARGIN_RIGHT;

    if (width < defaultWidthColumn) {
      width = defaultWidthColumn;
    }

    // max width column
    const maxWidthColumn =
      this.maxWidthColumn().width +
      SIZE_COLUMN_CLOSE +
      SIZE_COLUMN_KEY +
      SIZE_COLUMN_MARGIN_RIGHT;

    if (width < maxWidthColumn) {
      width = maxWidthColumn;
    }

    return width;
  }

  height(): number {
    return SIZE_TABLE_HEADER_HEIGHT + this.columns.length * SIZE_COLUMN_HEIGHT;
  }

  maxWidthColumn(): ColumnWidth {
    return getMaxWidthColumn(this.columns, this._show);
  }
}
