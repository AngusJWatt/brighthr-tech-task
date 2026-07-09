type File = { name: string; type: string; added: string; };
export type Directory = { name: string; type: string; files: (File | Directory)[]; added?: undefined; };
export type FileNode = File | Directory;
