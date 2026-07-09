type File = { nodeName: string; nodeType: string; added: Date; };
type Directory = { nodeName: string; nodeType: string; files: (File | Directory)[]; added?: undefined; };
export type FileNode = File | Directory;
