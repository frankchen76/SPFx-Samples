declare interface ICommandsetExtensionCommandSetStrings {
  Command1: string;
  Command2: string;
}

declare module 'CommandsetExtensionCommandSetStrings' {
  const strings: ICommandsetExtensionCommandSetStrings;
  export = strings;
}
