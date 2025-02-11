export default {
  preset: "ts-jest",
  testEnvironment: "node",
  transform: {
    "^.+\\.tsx?$": ["ts-jest", { tsconfig: "tsconfig.test.json" }],
  },
  moduleFileExtensions: ["ts", "tsx", "js"],
  testPathIgnorePatterns: ["<rootDir>/build/"], // Evita rodar testes dentro de "build/"
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1",
  }
};
