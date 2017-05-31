import {IClassConstructorArgumentsStringifier} from "./Interface/IClassConstructorArgumentsStringifier";
import {IDIConfig} from "../DIConfig/Interface/IDIConfig";
import {IMappedInterfaceToImplementationMap} from "../ServiceExpressionUpdater/Interface/IServiceExpressionUpdater";
import {ClassIndexer, IParameter} from "@wessberg/codeanalyzer";
import {shimGlobalObjectStringified} from "@wessberg/globalobject";
import {IIdentifierValidator} from "@wessberg/compiler-common";

/**
 * This class generates a stringified map between classes and the services that their constructors depend on.
 * @author Frederik Wessberg
 */
export class ClassConstructorArgumentsStringifier implements IClassConstructorArgumentsStringifier {
	constructor (private config: IDIConfig,
							 private identifierValidator: IIdentifierValidator) {
	}

	/**
	 * This method will generate a stringified map between service interfaces and the (ordered) identifiers for services that should be dependency injected upon their
	 * corresponding implementations constructors upon instantiation.
	 * @param {ClassIndexer} classes
	 * @param {IMappedInterfaceToImplementationMap} mappedInterfaces
	 * @returns {string}
	 */
	public getClassConstructorArgumentsStringified (classes: ClassIndexer, mappedInterfaces: IMappedInterfaceToImplementationMap): string {
		const globalShim = `${shimGlobalObjectStringified}\n`;
		const identifier = `global.${this.config.interfaceConstructorArgumentsMapName}`;
		let map = "{\n";
		const keys = Object.keys(mappedInterfaces);
		const classKeys = Object.keys(classes);

		keys.forEach((key, index) => {
			const className = mappedInterfaces[key];
			const classDeclaration = classes[className];
			if (classDeclaration == null && !this.identifierValidator.isBuiltIn(className)) throw new ReferenceError(`${this.constructor.name} could not get class constructor arguments: The interface "${key}" had no matching class implementation. Have you registered it as a service?`);
			const mappedArguments = classDeclaration == null || classDeclaration.constructor == null ? [] : classDeclaration.constructor.parameters.parametersList.map(parameter => this.normalizeConstructorParameter(parameter, mappedInterfaces)).join(", ");

			map += `\t${key}: `;
			map += `[${mappedArguments}]`;
			if (index !== classKeys.length - 1) map += ",";
			map += "\n";
		});
		map += "};";
		const returnValue = `${globalShim}\nconst ${this.config.interfaceConstructorArgumentsMapName} = ${map}`;
		return returnValue + `\n${identifier} = ${identifier} != null ? Object.assign(${identifier}, ${this.config.interfaceConstructorArgumentsMapName}) : ${this.config.interfaceConstructorArgumentsMapName};`;
	}

	/**
	 * Normalizes an argument to pass to the instantiation of a service. If the type of the argument is unknown or not defined,
	 * we insert "undefined" as value.
	 * @param {IParameter} parameter
	 * @param {IMappedInterfaceToImplementationMap} mappedInterfaces
	 * @returns {string}
	 */
	private normalizeConstructorParameter (parameter: IParameter, mappedInterfaces: IMappedInterfaceToImplementationMap): string {
		if (parameter.type.flattened == null || mappedInterfaces[parameter.type.flattened] == null) return "undefined";
		return `"${parameter.type.flattened}"`;
	}

}