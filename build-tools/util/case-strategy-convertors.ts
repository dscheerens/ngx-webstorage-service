function normalizeCase(name: string): string[] {
    let parts: string[];
    if (name.indexOf('-') > 0) {
        parts = name.split('-');
    } else {
        // TODO: Add support for other casing strategies.
        parts = [name];
    }
    return parts.filter((part) => !!part).map((part) => part.toLowerCase());
}

function uppercaseFirstCharacter(str: string): string {
    return str.substr(0, 1).toUpperCase() + str.substr(1);
}

export function toKebabCase(name: string): string {
    return normalizeCase(name).join('-');
}

export function toLowerCamelCase(name: string): string {
    return normalizeCase(name).map((part, index) => index > 0 ? uppercaseFirstCharacter(part) : part).join('');
}

export function toUpperCamelCase(name: string): string {
    return normalizeCase(name).map(uppercaseFirstCharacter).join('');
}
