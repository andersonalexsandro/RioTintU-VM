// import { FileManager } from "./assembler/fileManager";
// import * as fs from 'fs';
// import * as path from 'path';

// export class NodeFileReader implements FileManager {

//     private readPath: string;
//     private writePath: string;

//     constructor(readPath: string, writePath: string) {
//         this.readPath = readPath;
//         this.writePath = writePath;
//     }

//     public getLines(): Map<string, string[]> {
//         return this.readAllFilesInDir();
//     }

//     public setLines(filesMap: Map<string, string[]>): void {
//         this.writeAllFilesInDir(filesMap);
//     }

//     private readAllFilesInDir(): Map<string, string[]> {
//         const fileLinesMap = new Map<string, string[]>();

//         try {
//             const files = fs.readdirSync(this.readPath);
//             files.forEach(file => {
//                 const filePath = path.join(this.readPath, file);
//                 const data = fs.readFileSync(filePath, 'utf8');
//                 const lines = data.split('\n');
//                 fileLinesMap.set(file, lines);
//             });
//         } catch (err) {
//             console.error(`Error reading files in directory ${this.readPath}:`, err);
//         }

//         return fileLinesMap;
//     }

//     private writeAllFilesInDir(fileLinesMap: Map<string, string[]>): void {
//         try {
//             if (!fs.existsSync(this.writePath)) {
//                 fs.mkdirSync(this.writePath, { recursive: true });
//             }

//             fileLinesMap.forEach((lines, fileName) => {
//                 const filePath = path.join(this.writePath, fileName);
//                 const data = lines.join('\n');
//                 fs.writeFileSync(filePath, data, 'utf8');
//             });
//         } catch (err) {
//             console.error(`Error writing files to directory ${this.writePath}:`, err);
//         }
//     }
// }