/**
 * Injects environment variables into object properties
 * Replaces {{VARIABLE_NAME}} patterns with actual environment variable values
 * 
 * @param obj - The object to process (can be nested objects/arrays)
 * @returns A new object with environment variables injected
 * @throws Error if a referenced environment variable is not found
 */
export function injectEnvVariables<T>(obj: T): T {
    if (obj === null || obj === undefined) {
        return obj;
    }

    // Handle strings - replace {{VAR}} patterns
    if (typeof obj === 'string') {
        return obj.replace(/\{\{([^}]+)\}\}/g, (match, envVarName) => {
            const envValue = process.env[envVarName];

            if (envValue === undefined) {
                throw new Error(`Environment variable '${envVarName}' is not defined. Please set it in your environment.`);
            }

            return envValue;
        }) as T;
    }

    // Handle arrays - process each element
    if (Array.isArray(obj)) {
        return obj.map(item => injectEnvVariables(item)) as T;
    }

    // Handle objects - process each property
    if (typeof obj === 'object') {
        const result: any = {};

        for (const [key, value] of Object.entries(obj)) {
            result[key] = injectEnvVariables(value);
        }

        return result as T;
    }

    // Return primitives unchanged (numbers, booleans, etc.)
    return obj;
}