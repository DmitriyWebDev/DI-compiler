import test from "ava";
import { generateTransformerResult } from "./setup/setup-transformer";
import { formatCode } from "./util/format-code";

test("Preserves type-only imports. #1", (t) => {
  const bundle = generateTransformerResult([
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
  ]);

  const file = bundle.find(({ fileName }) => fileName.includes("index.js"))!;

  t.deepEqual(
    formatCode(file.code),
    formatCode(`\
      import Foo from "./foo";
			import { DIContainer } from "@wessberg/di";
      const container = new DIContainer();
      container.registerSingleton(undefined, { identifier: "IFoo", implementation: Foo });
			`)
  );
});

test("Preserves type-only imports. #2", (t) => {
  const bundle = generateTransformerResult([
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
  ]);

  const file = bundle.find(({ fileName }) => fileName.includes("index.js"))!;

  t.deepEqual(
    formatCode(file.code),
    formatCode(`\
      import {Foo} from "./foo";
			import { DIContainer } from "@wessberg/di";
      const container = new DIContainer();
      container.registerSingleton(undefined, { identifier: "IFoo", implementation: Foo });
			`)
  );
});

test("Preserves type-only imports. #3", (t) => {
  const bundle = generateTransformerResult([
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
  ]);

  const file = bundle.find(({ fileName }) => fileName.includes("index.js"))!;

  t.deepEqual(
    formatCode(file.code),
    formatCode(`\
      import * as Foo from "./foo";
			import { DIContainer } from "@wessberg/di";
      const container = new DIContainer();
      container.registerSingleton(undefined, { identifier: "IFoo", implementation: Foo });
			`)
  );
});

test("Preserves type-only imports. #4", (t) => {
  const bundle = generateTransformerResult([
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
  ]);

  const file = bundle.find(({ fileName }) => fileName.includes("index.js"))!;

  t.deepEqual(
    formatCode(file.code),
    formatCode(`\
      import {Bar as Foo} from "./foo";
			import { DIContainer } from "@wessberg/di";
      const container = new DIContainer();
      container.registerSingleton(undefined, { identifier: "IFoo", implementation: Foo });
			`)
  );
});

test("Preserves type-only imports. #5", (t) => {
  const bundle = generateTransformerResult([
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
  ]);

  const file = bundle.find(({ fileName }) => fileName.includes("index.js"))!;

  t.deepEqual(
    formatCode(file.code),
    formatCode(`\
      import {default as Foo} from "./foo";
			import { DIContainer } from "@wessberg/di";
      const container = new DIContainer();
      container.registerSingleton(undefined, { identifier: "IFoo", implementation: Foo });
			`)
  );
});

test("Preserves type-only imports. #6", (t) => {
  const bundle = generateTransformerResult([
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
  ]);

  const file = bundle.find(({ fileName }) => fileName.includes("index.js"))!;

  t.deepEqual(
    formatCode(file.code),
    formatCode(`\
      import {Foo} from "./foo";
			import {DIContainer} from "@wessberg/di";
			import {Bar} from "./foo";
			console.log(Bar);
      const container = new DIContainer();
      container.registerSingleton(undefined, { identifier: "IFoo", implementation: Foo });
			`)
  );
});

test("Won't lead to duplicate imports. #1", (t) => {
  const bundle = generateTransformerResult([
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
  ]);

  const file = bundle.find(({ fileName }) => fileName.includes("index.js"))!;

  t.deepEqual(
    formatCode(file.code),
    formatCode(`\
			import { DIContainer } from "@wessberg/di";
      import Foo from "./foo";
      console.log(Foo);
      const container = new DIContainer();
      container.registerSingleton(undefined, { identifier: "IFoo", implementation: Foo });
			`)
  );
});
