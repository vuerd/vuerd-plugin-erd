import {
  defineComponent,
  FunctionalComponent,
  html,
  observable,
} from '@vuerd/lit-observable';
import { classMap } from 'lit-html/directives/class-map';
import { styleMap } from 'lit-html/directives/style-map';

import { onPreventDefault } from '@/core/helper/dom.helper';
import { useContext } from '@/core/hooks/context.hook';
import { Changes } from '@/core/tableTree';
import { TreeNode } from '@/core/tableTree/tableTree';
import { css } from '@/core/tagged';
import { focusTable, focusTableEnd } from '@/engine/command/editor.cmd.helper';
import {
  moveTable,
  selectEndTable,
  selectTable,
} from '@/engine/command/table.cmd.helper';

declare global {
  interface HTMLElementTagNameMap {
    'vuerd-tree-table-name': TreeTableElement;
  }
}

export interface TreeTableProps {
  changes: Changes;
  node: TreeNode;
  update: {
    (): void;
  };
}

export interface TreeTableState {
  hover: boolean;
  iconHover: boolean;
}

export interface TreeTableElement extends TreeTableProps, HTMLElement {}

const Table: FunctionalComponent<TreeTableProps, TreeTableElement> = (
  props,
  ctx
) => {
  const contextRef = useContext(ctx);

  const state = observable<TreeTableState>({
    hover: false,
    iconHover: false,
  });

  /**
   * Toggle open/close and select/unselect state of a single node
   */
  const toggleNode = () => {
    if (!props.node.open && props.node.selected) {
      if (props.node.toggleOpen()) props.update();
    } else if (props.node.open && !props.node.selected) {
      if (props.node.toggleSelect()) props.update();
    } else {
      if (props.node.toggleSelect() && props.node.toggleOpen()) props.update();
    }
  };

  /**
   * Toggle select/unselect state of a single node
   */
  const toggleSelectNode = () => {
    if (props.node.toggleSelect()) props.update();
  };

  /**
   * When drag ends, recalculate position of table inside canvas and load it
   * @param ev MouseEvent
   */
  const onDragEnd = (ev: MouseEvent) => {
    if (!props.node.table) return;

    if (props.node.selected || props.node.disabled) return;

    const { store } = contextRef.value;
    const { height, width, scrollTop, scrollLeft, zoomLevel } =
      store.canvasState;

    var diffX = (width - width * zoomLevel + scrollLeft * 2) / 2;
    var diffY = (height - height * zoomLevel + scrollTop * 2) / 2;

    props.node.table.ui.left = (ev.clientX - diffX) / zoomLevel;
    props.node.table.ui.top = (ev.clientY - 30 - diffY) / zoomLevel;

    toggleSelectNode();
    store.dispatch(moveTable(store, false, 0, 0, props.node.table.id));
  };

  return () => html`<div
    class=${classMap({
      'vuerd-tree-table-name': true,
      'diff-modify': props.node.changes === 'modify',
      'diff-add': props.node.changes === 'add',
      'diff-remove': props.node.changes === 'remove',
    })}
    @dragenter=${onPreventDefault}
    @dragover=${onPreventDefault}
    @mouseover=${() => {
      state.hover = true;
      contextRef.value.store.dispatch(
        selectTable(contextRef.value.store, false, props.node.id)
      );
    }}
    @mouseleave=${() => {
      state.hover = false;
      contextRef.value.store.dispatch(selectEndTable());
    }}
    style=${styleMap({
      cursor: props.node.disabled ? 'default' : '',
    })}
  >
    <vuerd-icon
      id="table"
      name="table"
      size="12"
      @click=${toggleNode}
      style=${styleMap({
        fill: props.node.disabled ? 'var(--vuerd-color-font-placeholder)' : '',
      })}
    >
    </vuerd-icon>

    <span
      draggable="${props.node.disabled || props.node.selected
        ? 'false'
        : 'true'}"
      @dragend=${onDragEnd}
      @click=${toggleNode}
      style=${styleMap({
        backgroundColor: props.node.selected
          ? 'var(--vuerd-color-contextmenu-active)'
          : '',
        color: props.node.disabled ? 'var(--vuerd-color-font-placeholder)' : '',
        cursor: !props.node.selected ? 'grab' : 'pointer',
      })}
    >
      ${props.node.table?.name}
    </span>

    ${state.hover
      ? html`
          <vuerd-icon
            id="eye"
            name="eye${props.node.selected === state.iconHover ? '-slash' : ''}"
            size="15"
            @click=${toggleSelectNode}
            @mouseover=${() => (state.iconHover = true)}
            @mouseleave=${() => (state.iconHover = false)}
          >
          </vuerd-icon>
        `
      : null}
  </div> `;
};

const style = css`
  .vuerd-tree-table-name {
    height: 18px;
    width: max-content;

    margin: 1px 0;

    cursor: pointer;
    display: flex;
    align-items: center;

    font-size: 15px;
  }

  .vuerd-tree-table-name > span:hover {
    color: var(--vuerd-color-font-active);
  }

  .vuerd-tree-table-name > span {
    padding: 0 3px;
  }

  .vuerd-tree-table-name #eye,
  .vuerd-tree-table-name #table {
    margin: 0 3px;
    fill: var(--vuerd-color-font);
  }

  .vuerd-tree-table-name #eye:hover {
    fill: var(--vuerd-color-font-active);
  }
`;

defineComponent('vuerd-tree-table-name', {
  observedProps: ['node', 'update'],
  style,
  render: Table,
});
