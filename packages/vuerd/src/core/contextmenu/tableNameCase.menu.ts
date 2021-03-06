import { changeTableCase } from '@/engine/command/canvas.cmd.helper';
import { Menu, MenuOptions } from '@@types/core/contextmenu';
import { ERDEditorContext } from '@@types/core/ERDEditorContext';
import { NameCase } from '@@types/engine/store/canvas.state';

const defaultOptions: MenuOptions = {
  nameWidth: 50,
  keymapWidth: 0,
  close: false,
};

interface NameCaseMenu {
  name: string;
  nameCase: NameCase;
}

const nameCaseMenus: NameCaseMenu[] = [
  {
    name: 'Pascal',
    nameCase: 'pascalCase',
  },
  {
    name: 'Camel',
    nameCase: 'camelCase',
  },
  {
    name: 'Snake',
    nameCase: 'snakeCase',
  },
  {
    name: 'None',
    nameCase: 'none',
  },
];

export const createTableNameCaseMenus = ({ store }: ERDEditorContext): Menu[] =>
  nameCaseMenus.map(menu => ({
    icon:
      store.canvasState.tableCase === menu.nameCase
        ? {
            prefix: 'fas',
            name: 'check',
          }
        : undefined,
    name: menu.name,
    execute: () => store.dispatch(changeTableCase(menu.nameCase)),
    options: {
      ...defaultOptions,
    },
  }));
