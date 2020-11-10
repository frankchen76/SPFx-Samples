declare interface ICopySitePageCommandSetStrings {
  Command1: string;
  Command2: string;
}

declare module 'CopySitePageCommandSetStrings' {
  const strings: ICopySitePageCommandSetStrings;
  export = strings;
}
