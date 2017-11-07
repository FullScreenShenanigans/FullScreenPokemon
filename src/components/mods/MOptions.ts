export class MOptions {
    /**
     * This is the representation of the ModOptions class. The presumption is that a
     * Mod.ts file will have the same set of variables: a series of booleans. These indicate
     * whether or not a certain input method is needed for this particular mod option.
     * If needed, the corresponding method to the boolean is then called.
     */

     //The mod option name.
     public readonly name: string;

     /**
      * Constructor to load in the name of the ModOption.
      * @param name
      */
     public constructor (name: string) {
        this.name = name;
     }
     /**
      * The handler method for the inputs[] variable - redirects flow to appropriate method.
      */
     public readIn(): void {
        //meant to be OVERWRITTEN with each MOption extend.
        //its standard form will most likely be to read in the three necessary booleans
        //(I've called them readBoolean, readString and selectString for my example)
        //and call the corresponding method if the boolean is true.
     }
     public readBoolean(): void {
        //read in input from a switch - on/off, modify class variable
     }
     public readString(): void {
         //read in from a textbox, store entered string into class variable
     }
     public selectString(): void {
         //assume that class has a list of pre-existing options - presumably stored
         //in an array. this method's purpose is to select one of the options and
         //make sure that the mod switches to it. (preferably a variable edit).
     }
}
