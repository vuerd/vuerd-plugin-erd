export interface Theme {
  canvas: string;
  table: string;
  tableActive: string;
  focus: string;
  keyPK: string;
  keyFK: string;
  keyPFK: string;
  font: string;
  fontActive: string;
  fontPlaceholder: string;
  contextmenuActive: string;
  edit: string;
  mark: string;
  columnSelect: string;
  columnActive: string;
  previewShadow: string;
  previewTarget: string;
  scrollBarThumb: string;
  scrollBarThumbActive: string;
  code: string;
}

export function createTheme(): Theme {
  return {
    canvas: "#282828",
    table: "#191919",
    tableActive: "#14496d",
    focus: "#00a9ff",
    keyPK: "#B4B400",
    keyFK: "#dda8b1",
    keyPFK: "#60b9c4",
    font: "#a2a2a2",
    fontActive: "white",
    fontPlaceholder: "#6D6D6D",
    contextmenuActive: "#383d41",
    edit: "#ffc107",
    mark: "#ffc107",
    columnSelect: "#232a2f",
    columnActive: "#372908",
    previewShadow: "#171717",
    previewTarget: "#ffc107",
    scrollBarThumb: "#80808059",
    scrollBarThumbActive: "#9B9B9B",
    code: "#23241f",
  };
}