declare namespace ObjectMakr {
    /**
     * A tree representing class inheritances, where each key represents
     * a class, and its children inherit from that class.
     */
    interface IClassInheritance {
        [i: string]: IClassInheritance;
    }
    /**
     * Properties for a class prototype, which may be of any type.
     */
    interface IClassProperties {
        [i: string]: any;
    }
    /**
     * Listing of class Functions, keyed by name.
     */
    interface IClassFunctions {
        [i: string]: IClassFunction;
    }
    /**
     * Root abstract definition for class Functions.
     */
    interface IClassFunction {
        new (): any;
    }
    /**
     * Member callback for when an output onMake is a Function.
     */
    interface IOnMakeFunction {
        (output: any, name: string, settings: any, defaults: any): any;
    }
    /**
     * Settings to initialize a new IObjectMakr.
     */
    interface IObjectMakrSettings {
        /**
         * A sketch of class inheritance.
         */
        inheritance: IClassInheritance;
        /**
         * Properties for each class.
         */
        properties?: IClassProperties;
        /**
         * Whether a full property mapping should be made for each type.
         */
        doPropertiesFull?: boolean;
        /**
         * How propperties can be mapped from an Array to indices.
         */
        indexMap?: any[];
        /**
         * Optionally, a String index for each generated Object's Function to
         * be run when made.
         */
        onMake?: string;
        /**
         * Optionally, existing classes that can be passed in instead of using auto-generated ones.
         */
        functions?: IClassFunctions;
        /**
         * A scope to call onMake functions in, if not this IObjectMakr.
         */
        scope?: any;
    }
    /**
     * A abstract factory for dynamic attribute-based JavaScript classes.
     */
    interface IObjectMakr {
        /**
         * @returns The complete inheritance mapping.
         */
        getInheritance(): any;
        /**
         * @returns The complete properties mapping.
         */
        getProperties(): any;
        /**
         * @returns The properties for a particular class.
         */
        getPropertiesOf(title: string): any;
        /**
         * @returns Full properties, if doPropertiesFull is true.
         */
        getFullProperties(): any;
        /**
         * @returns Full properties for a particular class, if
         *          doPropertiesFull is true.
         */
        getFullPropertiesOf(title: string): any;
        /**
         * @returns The full mapping of class constructors.
         */
        getFunctions(): IClassFunctions;
        /**
         * @param name   The name of a class to retrieve.
         * @returns The constructor for the given class.
         */
        getFunction(name: string): IClassFunction;
        /**
         * @param type   The name of a class to check for.
         * @returns Whether that class exists.
         */
        hasFunction(name: string): boolean;
        /**
         * @returns The scope onMake functions are called in, if not this.
         */
        getScope(): any;
        /**
         * @returns The optional mapping of indices.
         */
        getIndexMap(): any[];
        /**
         * Creates a new instance of the specified type and returns it.
         * If desired, any settings are applied to it (deep copy using proliferate).
         *
         * @param name   The name of the type to initialize a new instance of.
         * @param [settings]   Additional attributes to add to the new instance.
         * @returns A newly created instance of the specified type.
         */
        make(name: string, settings?: any): any;
    }
    /**
     * A abstract factory for dynamic attribute-based JavaScript classes.
     */
    class ObjectMakr implements IObjectMakr {
        /**
         * The sketch of class inheritance.
         */
        private inheritance;
        /**
         * Properties for each class.
         */
        private properties;
        /**
         * The actual Functions for the classes to be made.
         */
        private functions;
        /**
         * A scope to call onMake functions in, if not this.
         */
        private scope;
        /**
         * Whether a full property mapping should be made for each type.
         */
        private doPropertiesFull;
        /**
         * If doPropertiesFull is true, a version of properties that contains the
         * sum properties for each type (rather than missing inherited ones).
         */
        private propertiesFull;
        /**
         * How properties can be mapped from an Array to indices.
         */
        private indexMap;
        /**
         * Optionally, a String index for each generated Object's Function to
         * be run when made.
         */
        private onMake;
        /**
         * Initializes a new instance of the ObjectMakr class.
         *
         * @param settings   Settings to be used for initialization.
         */
        constructor(settings: IObjectMakrSettings);
        /**
         * @returns The complete inheritance mapping.
         */
        getInheritance(): any;
        /**
         * @returns The complete properties mapping.
         */
        getProperties(): any;
        /**
         * @returns The properties for a particular class.
         */
        getPropertiesOf(title: string): any;
        /**
         * @returns Full properties, if doPropertiesFull is true.
         */
        getFullProperties(): any;
        /**
         * @returns Full properties for a particular class, if
         *          doPropertiesFull is true.
         */
        getFullPropertiesOf(title: string): any;
        /**
         * @returns The full mapping of class constructors.
         */
        getFunctions(): IClassFunctions;
        /**
         * @param name   The name of a class to retrieve.
         * @returns The constructor for the given class.
         */
        getFunction(name: string): IClassFunction;
        /**
         * @returns The scope onMake functions are called in, if not this.
         */
        getScope(): any;
        /**
         * @param type   The name of a class to check for.
         * @returns Whether that class exists.
         */
        hasFunction(name: string): boolean;
        /**
         * @returns The optional mapping of indices.
         */
        getIndexMap(): string[];
        /**
         * Creates a new instance of the specified type and returns it.
         * If desired, any settings are applied to it (deep copy using proliferate).
         *
         * @param name   The name of the type to initialize a new instance of.
         * @param settings   Additional attributes to add to the new instance.
         * @returns A newly created instance of the specified type.
         */
        make(name: string, settings?: any): any;
        /**
         * Parser that calls processPropertyArray on all properties given as arrays
         *
         * @param properties   Type properties for classes to create.
         */
        private processProperties(properties);
        /**
         * Creates an output properties object with the mapping shown in indexMap
         *
         * @param properties   An Array with indiced versions of properties
         */
        private processPropertyArray(indexMap);
        /**
         * Recursive parser to generate each Function, starting from the base.
         *
         * @param base   An object whose keys are the names of Functions to
         *               made, and whose values are objects whose keys are
         *               for children that inherit from these Functions
         * @param parent   The parent class Function of the classes about to be made.
         * @param parentName   The name of the parent class to be inherited from,
         *                     if it is a generated one (and not Object itself).
         */
        private processFunctions(base, parent, parentName?);
        /**
         * Proliferates all members of the donor to the recipient recursively, as
         * a deep copy.
         *
         * @param recipient   An object receiving the donor's members.
         * @param donor   An object whose members are copied to recipient.
         * @param noOverride   If recipient properties may be overriden (by default, false).
         */
        private proliferate(recipient, donor, noOverride?);
    }
}
declare var module: any;
