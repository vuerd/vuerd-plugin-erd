import './ColumnDataTypeEditor';

import { CellEditor, CellEditorProps } from 'tui-grid/types/editor';
import { ColumnDataTypeEditorElement } from './ColumnDataTypeEditor';

export class GridColumnDataTypeEditor implements CellEditor {
  props: CellEditorProps;
  el: ColumnDataTypeEditorElement;

  constructor(props: CellEditorProps) {
    this.props = props;
    this.el = document.createElement('vuerd-grid-column-data-type-editor');
    this.el.value = String(props.value);
    this.el.addEventListener('blur', this.onBlur);
  }

  getElement() {
    return this.el;
  }
  getValue() {
    return this.el.value;
  }
  beforeDestroy() {
    this.el.removeEventListener('blur', this.onBlur);
  }

  private onBlur = () => {
    this.props.grid.finishEditing(this.props.rowKey, this.el.value);
  };
}
