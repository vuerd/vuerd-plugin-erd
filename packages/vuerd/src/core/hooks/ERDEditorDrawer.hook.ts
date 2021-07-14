import { beforeMount, html, observable } from '@vuerd/lit-observable';

import { Bus } from '@/core/helper/eventBus.helper';
import {
  drawEndRelationship,
  filterActiveEnd,
  findActiveEnd,
} from '@/engine/command/editor.cmd.helper';
import { selectEndMemo } from '@/engine/command/memo.cmd.helper';
import {
  selectEndTable$,
  selectTable$,
} from '@/engine/command/table.cmd.helper';
import { IERDEditorContext } from '@/internal-types/ERDEditorContext';
import { ERDEditorProps } from '@@types/components/ERDEditorElement';

import { useUnmounted } from './unmounted.hook';

interface DrawerState {
  help: boolean;
  setting: boolean;
  tableProperties: boolean;
  tree: boolean;
}

type DrawerKey = keyof DrawerState;

export function useERDEditorDrawer(
  props: ERDEditorProps,
  { eventBus, store }: IERDEditorContext
) {
  const state = observable<DrawerState>({
    help: false,
    setting: false,
    tableProperties: false,
    tree: false,
  });
  const { unmountedGroup } = useUnmounted();
  let tableId = '';

  const createOpen = (key: DrawerKey) => () => {
    Object.keys(state).forEach(stateKey => {
      if (stateKey === key) return;

      state[stateKey as DrawerKey] = false;
    });

    store.dispatch(findActiveEnd(), filterActiveEnd());
    state[key] = !state[key];
  };
  const createClose = (key: DrawerKey) => () => (state[key] = false);

  const openHelp = createOpen('help');
  const closeHelp = createClose('help');
  const openSetting = createOpen('setting');
  const closeSetting = createClose('setting');
  const openTableProperties = createOpen('tableProperties');
  const closeTableProperties = createClose('tableProperties');
  const openTree = createOpen('tree');
  const closeTree = createClose('tree');

  const closeDrawer = () => {
    if (state.tableProperties && tableId) {
      store.dispatch(selectTable$(store, false, tableId));
    }

    closeHelp();
    closeSetting();
    closeTableProperties();
    closeTree();
    tableId = '';
  };

  beforeMount(() =>
    unmountedGroup.push(
      eventBus.on(Bus.Drawer.openTableProperties).subscribe(data => {
        store.dispatch(
          selectEndMemo(),
          drawEndRelationship(),
          selectEndTable$()
        );
        tableId = data.tableId;
        openTableProperties();
      }),
      eventBus.on(Bus.Drawer.close).subscribe(closeDrawer)
    )
  );

  return {
    drawerTpl: () => html`
      <vuerd-help-drawer
        .width=${props.width}
        .visible=${state.help}
        @close=${closeHelp}
      ></vuerd-help-drawer>
      <vuerd-setting-drawer
        .width=${props.width}
        .visible=${state.setting}
        @close=${closeSetting}
      ></vuerd-setting-drawer>
      <vuerd-tree-drawer
        .width=${props.width}
        .visible=${state.tree}
        @close=${closeTree}
      ></vuerd-tree-drawer>
      <vuerd-table-properties-drawer
        .width=${props.width}
        .visible=${state.tableProperties}
        .tableId=${tableId}
        @close=${closeTableProperties}
      >
      </vuerd-table-properties-drawer>
    `,
    closeDrawer,
    openHelp,
    closeHelp,
    openSetting,
    closeSetting,
    openTableProperties,
    closeTableProperties,
    openTree,
    closeTree,
  };
}
