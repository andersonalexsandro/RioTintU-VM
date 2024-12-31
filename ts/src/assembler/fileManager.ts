export interface FileManager {
    getLines(): Map<string, string[]>;
    setLines(filesMap: Map<string, string[]>): void;
}