import Vue from "vue";
import Vuex from "vuex";
import { SIZE_PREVIEW_WIDTH } from "@/ts/layout";
import {
  canvasChangeType,
  canvasMove,
  canvasResize
} from "./canvas/canvasController";
import { showChange } from "./canvas/showController";
import { databaseChange } from "./canvas/databaseController";
import { languageChange } from "./canvas/languageController";
import { dataInit, dataShow } from "@/data/canvas";
import databases, { Database, DataTypeHint } from "@/data/DataType";
import { Language } from "@/ts/GeneratorCode";

Vue.use(Vuex);

export interface State {
  width: number;
  height: number;
  scrollTop: number;
  scrollLeft: number;
  show: Show;
  database: Database;
  databaseName: string;
  canvasType: CanvasType;
  language: Language; // ADD: version 0.2.16
}

export const enum CanvasType {
  ERD = "ERD",
  SQL = "SQL",
  List = "List",
  GeneratorCode = "GeneratorCode"
}

export interface Show {
  tableComment: boolean;
  columnComment: boolean;
  columnDataType: boolean;
  columnDefault: boolean;
  columnAutoIncrement: boolean;
  columnPrimaryKey: boolean;
  columnUnique: boolean;
  columnNotNull: boolean;
  relationship: boolean;
}

export const enum ShowKey {
  tableComment = "tableComment",
  columnComment = "columnComment",
  columnDataType = "columnDataType",
  columnDefault = "columnDefault",
  columnAutoIncrement = "columnAutoIncrement",
  columnPrimaryKey = "columnPrimaryKey",
  columnUnique = "columnUnique",
  columnNotNull = "columnNotNull",
  relationship = "relationship"
}

export const enum Commit {
  init = "init",
  load = "load",
  canvasMove = "canvasMove",
  canvasChangeType = "canvasChangeType",
  canvasResize = "canvasResize",
  showChange = "showChange",
  databaseChange = "databaseChange",
  languageChange = "languageChange"
}

export function createStore() {
  return new Vuex.Store<State>({
    state: {
      width: 2000,
      height: 2000,
      scrollTop: 0,
      scrollLeft: 0,
      show: dataShow(),
      database: Database.MySQL,
      databaseName: "",
      canvasType: CanvasType.ERD,
      language: Language.graphql
    },
    getters: {
      previewRatio(state: State): number {
        return SIZE_PREVIEW_WIDTH / state.width;
      },
      typeHint(state: State): DataTypeHint[] {
        let dataTypeHints!: DataTypeHint[];
        for (const database of databases) {
          if (state.database === database.database) {
            dataTypeHints = database.dataTypeHints;
            break;
          }
        }
        return dataTypeHints;
      }
    },
    mutations: {
      init(state: State) {
        const stateData = state as any;
        const initData = dataInit() as any;
        Object.keys(state).forEach(key => {
          stateData[key] = initData[key];
        });
      },
      load(state: State, load: State) {
        const stateData = state as any;
        const loadData = load as any;
        Object.keys(state).forEach(key => {
          if (key === "language" && loadData[key] === undefined) {
            stateData[key] = Language.graphql;
          } else {
            stateData[key] = loadData[key];
          }
        });
        state.scrollTop = 0;
        state.scrollLeft = 0;
      },
      canvasMove,
      canvasChangeType,
      canvasResize,
      showChange,
      databaseChange,
      languageChange
    },
    actions: {}
  });
}
