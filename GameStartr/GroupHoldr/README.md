# GroupHoldr

A general utility to keep Arrays and/or Objects by key names within a container
so they can be referenced automatically by those keys. Automation is made easier
by more abstraction, such as by automatically generated add, remove, etc.
methods.


## Basic Architecture

#### Important APIs

Each of these APIs exists for each <name> in the groupNames given to the 
GroupHoldr upon reset or instantiation.

* **get<Name>Group()** - Returns the complete <Name> group.

* **set<Name>Group()** - Sets the complete <Name> group.

* **get<Name>(***`key`***)** - Gets the member of the <Name> group referenced by
the key.

* **set<Name>(***`key`, `value`***)** - Sets the member of the <Name> group 
referenced by the key to the new value.

* **add<Name>(***`key`, `value`***)** - Adds a member of the <Name> group, to be 
referenced by the key.

* **del<Name>(***`key`***)** - Deletes the member of the <Name> group referenced
referenced by the key.

#### Constructor Arguments

* **groupNames** *`String[]`* - An Array of Strings to be used for the group
names.

* **groupTypes** *`Mixed`* - The types of groups. This can either be a String
("Array" or "Object") to set each one or an Object mapping each groupName to a
different one.


## Sample Usage

1.  Creating and using a GroupHoldr to store populations of locations.

    ```javascript
    var GroupHolder = new GroupHoldr({
        "groupNames": ["Country", "State"],
        "groupTypes": "Object"
    });

    GroupHolder.addCountry("United States", 316130000);
    GroupHolder.addCountry("Canada", 35160000);
    GroupHolder.addState("New York", 19650000);

    console.log(GroupHolder.getCountry("United States")); // 316,130,000
    ```

2.  Creating and using a GroupHoldr to hold people by their age group.

    ```javascript
    var GroupHolder = new GroupHoldr({
        "groupNames": ["Child", "Adult"],
        "groupTypes": "Array"
    });

    GroupHolder.addChild("Alex");
    GroupHolder.addChild("Bob");
    GroupHolder.getGroup("Adult").push("Carol");
    GroupHolder.getGroups().Adult.push("Devin");

    console.log(GroupHolder.getAdultGroup()); // ["Carol", "Devin"]
    ```