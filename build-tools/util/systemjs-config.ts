// The following is copied from the systemjs typings (https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/systemjs/).
// It is copied because the typings for the systemjs configuration are not exported.

type ModuleFormat = 'esm' | 'cjs' | 'amd' | 'global' | 'register';

interface PackageList<T> {
    [packageName: string]: T;
}

type ConfigMap = PackageList<string | PackageList<string>>;

type ConfigMeta = PackageList<MetaConfig>;

interface MetaConfig {
    /**
     * Sets in what format the module is loaded.
     */
    format?: ModuleFormat;

    /**
     * For the global format, when automatic detection of exports is not enough, a custom exports meta value can be set.
     * This tells the loader what global name to use as the module's export value.
     */
    exports?: string;

    /**
     * Dependencies to load before this module. Goes through regular paths and map normalization.
     * Only supported for the cjs, amd and global formats.
     */
    deps?: string[];

    /**
     * A map of global names to module names that should be defined only for the execution of this module.
     * Enables use of legacy code that expects certain globals to be present.
     * Referenced modules automatically becomes dependencies. Only supported for the cjs and global formats.
     */
    globals?: string;

    /**
     * Set a loader for this meta path.
     */
    loader?: string;

    /**
     * For plugin transpilers to set the source map of their transpilation.
     */
    sourceMap?: any;

    /**
     * Load the module using <script> tag injection.
     */
    scriptLoad?: boolean;

    /**
     * The nonce attribute to use when loading the script as a way to enable CSP.
     * This should correspond to the "nonce-" attribute set in the Content-Security-Policy header.
     */
    nonce?: string;

    /**
     * The subresource integrity attribute corresponding to the script integrity,
     * describing the expected hash of the final code to be executed.
     * For example, System.config({ meta: { 'src/example.js': { integrity: 'sha256-e3b0c44...' }});
     * would throw an error if the translated source of src/example.js doesn't match the expected hash.
     */
    integrity?: string;

    /**
     * When scripts are loaded from a different domain (e.g. CDN) the global error handler (window.onerror)
     * has very limited information about errors to prevent unintended leaking. In order to mitigate this,
     * the <script> tags need to set crossorigin attribute and the server needs to enable CORS.
     * The valid values are "anonymous" and "use-credentials".
     */
    crossOrigin?: string;

    /**
     * When loading a module that is not an ECMAScript Module, we set the module as the default export,
     * but then also iterate the module object and copy named exports for it a well.
     * Use this option to disable this iteration and copying of the exports.
     */
    esmExports?: boolean;

    /**
     * To ignore resources that shouldn't be traced as part of the build.
     * Use with the SystemJS Builder. (https://github.com/systemjs/builder#ignore-resources)
     */
    build?: boolean;
}

interface PackageConfig {
    /**
     * The main entry point of the package (so import 'local/package' is equivalent to import 'local/package/index.js')
     */
    main?: string;

    /**
     * The module format of the package. See Module Formats.
     */
    format?: ModuleFormat;

    /**
     * The default extension to add to modules requested within the package. Takes preference over defaultJSExtensions.
     * Can be set to defaultExtension: false to optionally opt-out of extension-adding when defaultJSExtensions is enabled.
     */
    defaultExtension?: boolean | string;

    /**
     * Local and relative map configurations scoped to the package. Apply for subpaths as well.
     */
    map?: ConfigMap;

    /**
     * Module meta provides an API for SystemJS to understand how to load modules correctly.
     * Package-scoped meta configuration with wildcard support. Modules are subpaths within the package path.
     * This also provides an opt-out mechanism for defaultExtension, by adding modules here that should skip extension adding.
     */
    meta?: ConfigMeta;
}

export type SystemjsConfigMap = ConfigMap;

export type SystemjsConfigPaths = PackageList<string>;

export type SystemjsConfigPackages = PackageList<PackageConfig>;
