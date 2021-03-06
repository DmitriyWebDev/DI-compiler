import test from "ava";
import * as typescript from "typescript";
import { generateTransformerResult } from "./setup/setup-transformer";
import { formatCode } from "./util/format-code";

test("Preserves Type-only imports. #1", (t) => {
  const bundle = generateTransformerResult(
    [
      {
        entry: true,
        fileName: "index.ts",
        text: `
				import {DIContainer} from "@wessberg/di";
				import Foo, {IFoo} from "./foo";
				console.log(Foo);
				
				const container = new DIContainer();
				container.registerSingleton<IFoo, Foo>();
			`,
      },
      {
        entry: false,
        fileName: "foo.ts",
        text: `	
				export interface IFoo {}
				export default class Foo implements IFoo {}
			`,
      },
    ],
    {
      typescript,
      compilerOptions: {
        module: typescript.ModuleKind.UMD,
      },
    }
  );

  const file = bundle.find(({ fileName }) => fileName.includes("index.js"))!;

  t.deepEqual(
    formatCode(file.code),
    formatCode(`\
			(function (factory) {
          if (typeof module === "object" && typeof module.exports === "object") {
              var v = factory(require, exports);
              if (v !== undefined) module.exports = v;
          }
          else if (typeof define === "function" && define.amd) {
              define(["require", "exports", "@wessberg/di", "./foo"], factory);
          }
      })(function (require, exports) {
          "use strict";
          Object.defineProperty(exports, "__esModule", { value: true });
          const Foo = require("./foo");
          const di_1 = require("@wessberg/di");
          const foo_1 = require("./foo");
          console.log(foo_1.default);
          const container = new di_1.DIContainer();
          container.registerSingleton(undefined, { identifier: "IFoo", implementation: Foo.default });
      });

			`)
  );
});

test("Preserves type-only imports. #2", (t) => {
  const bundle = generateTransformerResult(
    [
      {
        entry: true,
        fileName: "index.ts",
        text: `
				import {DIContainer} from "@wessberg/di";
				import Foo, {IFoo} from "./foo";
				
				const container = new DIContainer();
				container.registerSingleton<IFoo, Foo>();
			`,
      },
      {
        entry: false,
        fileName: "foo.ts",
        text: `	
				export interface IFoo {}
				export default class Foo implements IFoo {}
			`,
      },
    ],
    {
      typescript,
      compilerOptions: {
        module: typescript.ModuleKind.UMD,
      },
    }
  );

  const file = bundle.find(({ fileName }) => fileName.includes("index.js"))!;

  t.deepEqual(
    formatCode(file.code),
    formatCode(`\
      (function (factory) {
          if (typeof module === "object" && typeof module.exports === "object") {
              var v = factory(require, exports);
              if (v !== undefined) module.exports = v;
          }
          else if (typeof define === "function" && define.amd) {
              define(["require", "exports", "@wessberg/di", "./foo"], factory);
          }
      })(function (require, exports) {
          "use strict";
          Object.defineProperty(exports, "__esModule", { value: true });
          const Foo = require("./foo");
          const di_1 = require("@wessberg/di");
          const container = new di_1.DIContainer();
          container.registerSingleton(undefined, { identifier: "IFoo", implementation: Foo.default });
      });
			`)
  );
});

test("Preserves type-only imports. #3", (t) => {
  const bundle = generateTransformerResult(
    [
      {
        entry: true,
        fileName: "index.ts",
        text: `
				import {DIContainer} from "@wessberg/di";
				import {Foo, IFoo} from "./foo";
				
				const container = new DIContainer();
				container.registerSingleton<IFoo, Foo>();
			`,
      },
      {
        entry: false,
        fileName: "foo.ts",
        text: `	
				export interface IFoo {}
				export class Foo implements IFoo {}
			`,
      },
    ],
    {
      typescript,
      compilerOptions: {
        module: typescript.ModuleKind.UMD,
      },
    }
  );

  const file = bundle.find(({ fileName }) => fileName.includes("index.js"))!;

  t.deepEqual(
    formatCode(file.code),
    formatCode(`\
      (function (factory) {
          if (typeof module === "object" && typeof module.exports === "object") {
              var v = factory(require, exports);
              if (v !== undefined) module.exports = v;
          }
          else if (typeof define === "function" && define.amd) {
              define(["require", "exports", "@wessberg/di", "./foo"], factory);
          }
      })(function (require, exports) {
          "use strict";
          Object.defineProperty(exports, "__esModule", { value: true });
          const Foo = require("./foo");
          const di_1 = require("@wessberg/di");
          const container = new di_1.DIContainer();
          container.registerSingleton(undefined, { identifier: "IFoo", implementation: Foo.Foo });
      });
			`)
  );
});

test("Preserves type-only imports. #4", (t) => {
  const bundle = generateTransformerResult(
    [
      {
        entry: true,
        fileName: "index.ts",
        text: `
				import {DIContainer} from "@wessberg/di";
				import * as Foo from "./foo";
				import {IFoo} from "./foo";
				
				const container = new DIContainer();
				container.registerSingleton<IFoo, Foo>();
			`,
      },
      {
        entry: false,
        fileName: "foo.ts",
        text: `	
				export interface IFoo {}
				export class Foo implements IFoo {}
			`,
      },
    ],
    {
      typescript,
      compilerOptions: {
        module: typescript.ModuleKind.UMD,
      },
    }
  );

  const file = bundle.find(({ fileName }) => fileName.includes("index.js"))!;

  t.deepEqual(
    formatCode(file.code),
    formatCode(`\
      (function (factory) {
          if (typeof module === "object" && typeof module.exports === "object") {
              var v = factory(require, exports);
              if (v !== undefined) module.exports = v;
          }
          else if (typeof define === "function" && define.amd) {
              define(["require", "exports", "@wessberg/di", "./foo"], factory);
          }
      })(function (require, exports) {
          "use strict";
          Object.defineProperty(exports, "__esModule", { value: true });
          const Foo = require("./foo");
          const di_1 = require("@wessberg/di");
          const container = new di_1.DIContainer();
          container.registerSingleton(undefined, { identifier: "IFoo", implementation: Foo });
      });
			`)
  );
});

test("Preserves type-only imports. #5", (t) => {
  const bundle = generateTransformerResult(
    [
      {
        entry: true,
        fileName: "index.ts",
        text: `
				import {DIContainer} from "@wessberg/di";
				import {Bar as Foo, IFoo} from "./foo";
				
				const container = new DIContainer();
				container.registerSingleton<IFoo, Foo>();
			`,
      },
      {
        entry: false,
        fileName: "foo.ts",
        text: `	
				export interface IFoo {}
				export class Bar implements IFoo {}
			`,
      },
    ],
    {
      typescript,
      compilerOptions: {
        module: typescript.ModuleKind.UMD,
      },
    }
  );

  const file = bundle.find(({ fileName }) => fileName.includes("index.js"))!;

  t.deepEqual(
    formatCode(file.code),
    formatCode(`\
      (function (factory) {
          if (typeof module === "object" && typeof module.exports === "object") {
              var v = factory(require, exports);
              if (v !== undefined) module.exports = v;
          }
          else if (typeof define === "function" && define.amd) {
              define(["require", "exports", "@wessberg/di", "./foo"], factory);
          }
      })(function (require, exports) {
          "use strict";
          Object.defineProperty(exports, "__esModule", { value: true });
          const Foo = require("./foo");
          const di_1 = require("@wessberg/di");
          const container = new di_1.DIContainer();
          container.registerSingleton(undefined, { identifier: "IFoo", implementation: Foo.Bar });
      });
			`)
  );
});

test("Preserves type-only imports. #6", (t) => {
  const bundle = generateTransformerResult(
    [
      {
        entry: true,
        fileName: "index.ts",
        text: `
				import {DIContainer} from "@wessberg/di";
				import {default as Foo, IFoo} from "./foo";
				
				const container = new DIContainer();
				container.registerSingleton<IFoo, Foo>();
			`,
      },
      {
        entry: false,
        fileName: "foo.ts",
        text: `	
				export interface IFoo {}
				export default class Bar implements IFoo {}
			`,
      },
    ],
    {
      typescript,
      compilerOptions: {
        module: typescript.ModuleKind.UMD,
      },
    }
  );

  const file = bundle.find(({ fileName }) => fileName.includes("index.js"))!;

  t.deepEqual(
    formatCode(file.code),
    formatCode(`\
      (function (factory) {
          if (typeof module === "object" && typeof module.exports === "object") {
              var v = factory(require, exports);
              if (v !== undefined) module.exports = v;
          }
          else if (typeof define === "function" && define.amd) {
              define(["require", "exports", "@wessberg/di", "./foo"], factory);
          }
      })(function (require, exports) {
          "use strict";
          Object.defineProperty(exports, "__esModule", { value: true });
          const Foo = require("./foo");
          const di_1 = require("@wessberg/di");
          const container = new di_1.DIContainer();
          container.registerSingleton(undefined, { identifier: "IFoo", implementation: Foo.default });
      });
			`)
  );
});

test("Preserves type-only imports. #7", (t) => {
  const bundle = generateTransformerResult(
    [
      {
        entry: true,
        fileName: "index.ts",
        text: `
				import {DIContainer} from "@wessberg/di";
				import {Foo, Bar, IFoo} from "./foo";
				console.log(Bar);
				
				const container = new DIContainer();
				container.registerSingleton<IFoo, Foo>();
			`,
      },
      {
        entry: false,
        fileName: "foo.ts",
        text: `	
				export interface IFoo {}
				export class Foo implements IFoo {}
				export class Bar {}
			`,
      },
    ],
    {
      typescript,
      compilerOptions: {
        module: typescript.ModuleKind.UMD,
      },
    }
  );

  const file = bundle.find(({ fileName }) => fileName.includes("index.js"))!;

  t.deepEqual(
    formatCode(file.code),
    formatCode(`\
      (function (factory) {
          if (typeof module === "object" && typeof module.exports === "object") {
              var v = factory(require, exports);
              if (v !== undefined) module.exports = v;
          }
          else if (typeof define === "function" && define.amd) {
              define(["require", "exports", "@wessberg/di", "./foo"], factory);
          }
      })(function (require, exports) {
          "use strict";
          Object.defineProperty(exports, "__esModule", { value: true });
          const Foo = require("./foo");
          const di_1 = require("@wessberg/di");
          const foo_1 = require("./foo");
          console.log(foo_1.Bar);
          const container = new di_1.DIContainer();
          container.registerSingleton(undefined, { identifier: "IFoo", implementation: Foo.Foo });
      });
			`)
  );
});

test("Preserves type-only imports with esModuleInterop and importHelpers. #1", (t) => {
  const bundle = generateTransformerResult(
    [
      {
        entry: true,
        fileName: "index.ts",
        text: `
				import {DIContainer} from "@wessberg/di";
				import Foo, {IFoo} from "./foo";
				
				const container = new DIContainer();
				container.registerSingleton<IFoo, Foo>();
			`,
      },
      {
        entry: false,
        fileName: "foo.ts",
        text: `	
				export interface IFoo {}
				export default class Foo implements IFoo {}
			`,
      },
    ],
    {
      typescript,
      compilerOptions: {
        esModuleInterop: true,
        importHelpers: true,
        module: typescript.ModuleKind.UMD,
      },
    }
  );

  const file = bundle.find(({ fileName }) => fileName.includes("index.js"))!;

  t.deepEqual(
    formatCode(file.code),
    formatCode(`\
      (function (factory) {
          if (typeof module === "object" && typeof module.exports === "object") {
              var v = factory(require, exports);
              if (v !== undefined) module.exports = v;
          }
          else if (typeof define === "function" && define.amd) {
              define(["require", "exports", "@wessberg/di", "./foo", "tslib"], factory);
          }
      })(function (require, exports) {
          "use strict";
          Object.defineProperty(exports, "__esModule", { value: true });
          const Foo = require("tslib").__importDefault(require("./foo"));
          const di_1 = require("@wessberg/di");
          const container = new di_1.DIContainer();
          container.registerSingleton(undefined, { identifier: "IFoo", implementation: Foo.default });
      });
			`)
  );
});

test("Preserves type-only imports with esModuleInterop. #1", (t) => {
  const bundle = generateTransformerResult(
    [
      {
        entry: true,
        fileName: "index.ts",
        text: `
				import {DIContainer} from "@wessberg/di";
				import Foo, {IFoo} from "./foo";
				
				const container = new DIContainer();
				container.registerSingleton<IFoo, Foo>();
			`,
      },
      {
        entry: false,
        fileName: "foo.ts",
        text: `	
				export interface IFoo {}
				export default class Foo implements IFoo {}
			`,
      },
    ],
    {
      typescript,
      compilerOptions: {
        esModuleInterop: true,
        module: typescript.ModuleKind.UMD,
      },
    }
  );

  const file = bundle.find(({ fileName }) => fileName.includes("index.js"))!;

  t.deepEqual(
    formatCode(file.code),
    formatCode(`\
      var __importDefault = (this && this.__importDefault) || function (mod) {
          return (mod && mod.__esModule) ? mod : { "default": mod };
      };
      (function (factory) {
          if (typeof module === "object" && typeof module.exports === "object") {
              var v = factory(require, exports);
              if (v !== undefined) module.exports = v;
          }
          else if (typeof define === "function" && define.amd) {
              define(["require", "exports", "@wessberg/di", "./foo"], factory);
          }
      })(function (require, exports) {
          "use strict";
          Object.defineProperty(exports, "__esModule", { value: true });
          const Foo = __importDefault(require("./foo"));
          const di_1 = require("@wessberg/di");
          const container = new di_1.DIContainer();
          container.registerSingleton(undefined, { identifier: "IFoo", implementation: Foo.default });
      });

			`)
  );
});

test("Preserves type-only imports with esModuleInterop. #2", (t) => {
  const bundle = generateTransformerResult(
    [
      {
        entry: true,
        fileName: "index.ts",
        text: `
				import {DIContainer} from "@wessberg/di";
				import Foo, {IFoo} from "./foo";
				console.log(Foo);
				
				const container = new DIContainer();
				container.registerSingleton<IFoo, Foo>();
			`,
      },
      {
        entry: false,
        fileName: "foo.ts",
        text: `	
				export interface IFoo {}
				export default class Foo implements IFoo {}
			`,
      },
    ],
    {
      typescript,
      compilerOptions: {
        esModuleInterop: true,
        module: typescript.ModuleKind.UMD,
      },
    }
  );

  const file = bundle.find(({ fileName }) => fileName.includes("index.js"))!;

  t.deepEqual(
    formatCode(file.code),
    formatCode(`\
      var __importDefault = (this && this.__importDefault) || function (mod) {
          return (mod && mod.__esModule) ? mod : { "default": mod };
      };
      (function (factory) {
          if (typeof module === "object" && typeof module.exports === "object") {
              var v = factory(require, exports);
              if (v !== undefined) module.exports = v;
          }
          else if (typeof define === "function" && define.amd) {
              define(["require", "exports", "@wessberg/di", "./foo"], factory);
          }
      })(function (require, exports) {
          "use strict";
          Object.defineProperty(exports, "__esModule", { value: true });
          const Foo = __importDefault(require("./foo"));
          const di_1 = require("@wessberg/di");
          const foo_1 = __importDefault(require("./foo"));
          console.log(foo_1.default);
          const container = new di_1.DIContainer();
          container.registerSingleton(undefined, { identifier: "IFoo", implementation: Foo.default });
      });

			`)
  );
});

test("Preserves type-only imports with esModuleInterop. #3", (t) => {
  const bundle = generateTransformerResult(
    [
      {
        entry: true,
        fileName: "index.ts",
        text: `
				import {DIContainer} from "@wessberg/di";
				import * as Foo from "./foo";
				import {IFoo} from "./foo";
				
				const container = new DIContainer();
				container.registerSingleton<IFoo, Foo>();
			`,
      },
      {
        entry: false,
        fileName: "foo.ts",
        text: `	
				export interface IFoo {}
				export class Foo implements IFoo {}
			`,
      },
    ],
    {
      typescript,
      compilerOptions: {
        esModuleInterop: true,
        module: typescript.ModuleKind.UMD,
      },
    }
  );

  const file = bundle.find(({ fileName }) => fileName.includes("index.js"))!;

  t.deepEqual(
    formatCode(file.code),
    formatCode(`\
      var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
          if (k2 === undefined) k2 = k;
          Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
      }) : (function(o, m, k, k2) {
          if (k2 === undefined) k2 = k;
          o[k2] = m[k];
      }));
      var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
          Object.defineProperty(o, "default", { enumerable: true, value: v });
      }) : function(o, v) {
          o["default"] = v;
      });
      var __importStar = (this && this.__importStar) || function (mod) {
          if (mod && mod.__esModule) return mod;
          var result = {};
          if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
          __setModuleDefault(result, mod);
          return result;
      };
      (function (factory) {
          if (typeof module === "object" && typeof module.exports === "object") {
              var v = factory(require, exports);
              if (v !== undefined) module.exports = v;
          }
          else if (typeof define === "function" && define.amd) {
              define(["require", "exports", "@wessberg/di", "./foo"], factory);
          }
      })(function (require, exports) {
          "use strict";
          Object.defineProperty(exports, "__esModule", { value: true });
          const Foo = __importStar(require("./foo"));
          const di_1 = require("@wessberg/di");
          const container = new di_1.DIContainer();
          container.registerSingleton(undefined, { identifier: "IFoo", implementation: Foo });
      });
			`)
  );
});
