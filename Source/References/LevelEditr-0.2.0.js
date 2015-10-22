/// <reference path="ChangeLinr-0.2.0.ts" />
/// <reference path="GroupHoldr-0.2.1.ts" />
/// <reference path="InputWritr-0.2.0.ts" />
/// <reference path="MapsCreatr-0.2.1.ts" />
/// <reference path="MapScreenr-0.2.1.ts" />
/// <reference path="MapsHandlr-0.2.0.ts" />
/// <reference path="ObjectMakr-0.2.2.ts" />
/// <reference path="PixelDrawr-0.2.0.ts" />
/// <reference path="PixelRendr-0.2.0.ts" />
/// <reference path="QuadsKeepr-0.2.1.ts" />
/// <reference path="ItemsHoldr-0.2.1.ts" />
/// <reference path="StringFilr-0.2.1.ts" />
/// <reference path="TimeHandlr-0.2.0.ts" />
var LevelEditr;
(function (LevelEditr_1) {
    "use strict";
    /**
     * A level editor designed to work natively on top of an existing GameStartr
     * sub-class.
     */
    var LevelEditr = (function () {
        /**
         * @param {ILevelEditrSettings} settings
         */
        function LevelEditr(settings) {
            this.GameStarter = settings.GameStarter;
            this.prethings = settings.prethings;
            this.thingGroups = settings.thingGroups;
            this.thingKeys = settings.thingKeys;
            this.macros = settings.macros;
            this.beautifier = settings.beautifier;
            this.mapNameDefault = settings.mapNameDefault || "New Map";
            this.mapTimeDefault = settings.mapTimeDefault || Infinity;
            this.mapSettingDefault = settings.mapSettingDefault || "";
            this.mapEntryDefault = settings.mapEntryDefault || "";
            this.mapDefault = settings.mapDefault;
            this.blocksize = settings.blocksize || 1;
            this.keyUndefined = settings.keyUndefined || "-none-";
            this.currentPreThings = [];
            this.currentMode = "Build";
            this.currentClickMode = "Thing";
            this.canClick = true;
        }
        /* Simple gets
        */
        /**
         *
         */
        LevelEditr.prototype.getGameStarter = function () {
            return this.GameStarter;
        };
        /**
         *
         */
        LevelEditr.prototype.getOldInformation = function () {
            return this.oldInformation;
        };
        /**
         *
         */
        LevelEditr.prototype.getPreThings = function () {
            return this.prethings;
        };
        /**
         *
         */
        LevelEditr.prototype.getThingGroups = function () {
            return this.thingGroups;
        };
        /**
         *
         */
        LevelEditr.prototype.getThingKeys = function () {
            return this.thingKeys;
        };
        /**
         *
         */
        LevelEditr.prototype.getMacros = function () {
            return this.macros;
        };
        /**
         *
         */
        LevelEditr.prototype.getMapNameDefault = function () {
            return this.mapNameDefault;
        };
        /**
         *
         */
        LevelEditr.prototype.getMapTimeDefault = function () {
            return this.mapTimeDefault;
        };
        /**
         *
         */
        LevelEditr.prototype.getMapEntryDefault = function () {
            return this.mapEntryDefault;
        };
        /**
         *
         */
        LevelEditr.prototype.getMapDefault = function () {
            return this.mapDefault;
        };
        /**
         *
         */
        LevelEditr.prototype.getDisplay = function () {
            return this.display;
        };
        /**
         *
         */
        LevelEditr.prototype.getCurrentMode = function () {
            return this.currentMode;
        };
        /**
         *
         */
        LevelEditr.prototype.getBlockSize = function () {
            return this.blocksize;
        };
        /**
         *
         */
        LevelEditr.prototype.getBeautifier = function () {
            return this.beautifier;
        };
        /**
         *
         */
        LevelEditr.prototype.getCurrentPreThings = function () {
            return this.currentPreThings;
        };
        /**
         *
         */
        LevelEditr.prototype.getCurrentTitle = function () {
            return this.currentTitle;
        };
        /**
         *
         */
        LevelEditr.prototype.getCurrentArgs = function () {
            return this.currentArgs;
        };
        /**
         *
         */
        LevelEditr.prototype.getPageStylesAdded = function () {
            return this.pageStylesAdded;
        };
        /**
         *
         */
        LevelEditr.prototype.getKeyUndefined = function () {
            return this.keyUndefined;
        };
        /**
         *
         */
        LevelEditr.prototype.getCanClick = function () {
            return this.canClick;
        };
        /* State resets
        */
        /**
         *
         */
        LevelEditr.prototype.enable = function () {
            this.oldInformation = {
                "map": this.GameStarter.MapsHandler.getMapName()
            };
            this.clearAllThings();
            this.resetDisplay();
            this.GameStarter.InputWriter.setCanTrigger(false);
            this.setCurrentMode("Build");
            this.setTextareaValue(this.stringifySmart(this.mapDefault), true);
            this.resetDisplayMap();
            this.disableThing(this.GameStarter.player);
            if (!this.pageStylesAdded) {
                this.GameStarter.addPageStyles(this.createPageStyles());
                this.pageStylesAdded = true;
            }
            this.GameStarter.container.insertBefore(this.display.container, this.GameStarter.container.children[0]);
        };
        /**
         *
         */
        LevelEditr.prototype.disable = function () {
            if (!this.display) {
                return;
            }
            this.GameStarter.container.removeChild(this.display.container);
            this.display = undefined;
            this.GameStarter.InputWriter.setCanTrigger(true);
            this.GameStarter.setMap(this.oldInformation.map);
        };
        /**
         *
         */
        LevelEditr.prototype.minimize = function () {
            this.display.minimizer.innerText = "+";
            this.display.minimizer.onclick = this.maximize.bind(this);
            this.display.container.className += " minimized";
        };
        /**
         *
         */
        LevelEditr.prototype.maximize = function () {
            this.display.minimizer.innerText = "-";
            this.display.minimizer.onclick = this.minimize.bind(this);
            if (this.display.container.className.indexOf("minimized") !== -1) {
                this.display.container.className = this.display.container.className.replace(/ minimized/g, "");
            }
        };
        /**
         *
         */
        LevelEditr.prototype.startBuilding = function () {
            this.beautifyTextareaValue();
            this.setDisplayMap(true);
            this.GameStarter.InputWriter.setCanTrigger(false);
            this.setCurrentMode("Build");
            this.maximize();
        };
        /**
         *
         */
        LevelEditr.prototype.startPlaying = function () {
            this.beautifyTextareaValue();
            this.setDisplayMap(false);
            this.GameStarter.InputWriter.setCanTrigger(true);
            this.setCurrentMode("Play");
            this.minimize();
        };
        /**
         *
         */
        LevelEditr.prototype.downloadCurrentJSON = function () {
            var link = this.downloadFile(this.getMapName() + ".json", this.display.stringer.textarea.value || "");
            window.open(link.href);
        };
        /**
         *
         */
        LevelEditr.prototype.setCurrentJSON = function (json) {
            this.startBuilding();
            this.setTextareaValue(json, true);
            this.getMapObjectAndTry();
        };
        /**
         *
         */
        LevelEditr.prototype.loadCurrentJSON = function () {
            this.display.inputDummy.click();
        };
        /**
         *
         */
        LevelEditr.prototype.beautify = function (text) {
            return this.beautifier(text);
        };
        /* Interactivity
        */
        /**
         *
         */
        LevelEditr.prototype.handleUploadCompletion = function (event) {
            this.enable();
            this.setCurrentJSON(event.currentTarget.result);
            this.setSectionJSON();
        };
        /**
         *
         */
        LevelEditr.prototype.setCurrentMode = function (mode) {
            this.currentMode = mode;
        };
        /**
         *
         */
        LevelEditr.prototype.setCurrentClickMode = function (mode, event) {
            this.currentClickMode = mode;
            this.cancelEvent(event);
        };
        /**
         *
         */
        LevelEditr.prototype.setCurrentThing = function (title, args, x, y) {
            if (x === void 0) { x = 0; }
            if (y === void 0) { y = 0; }
            this.currentTitle = title;
            this.currentArgs = args;
            this.currentPreThings = [
                {
                    "xloc": 0,
                    "yloc": 0,
                    "thing": this.GameStarter.ObjectMaker.make(this.currentTitle, this.GameStarter.proliferate({
                        "onThingMake": undefined,
                        "onThingAdd": undefined,
                        "onThingAdded": undefined,
                        "outerok": true
                    }, this.getNormalizedThingArguments(args)))
                }
            ];
            this.disableThing(this.currentPreThings[0].thing);
            this.GameStarter.addThing(this.currentPreThings[0].thing, x, y);
        };
        LevelEditr.prototype.setCurrentMacroThings = function () {
            var currentThing, i;
            for (i = 0; i < this.currentPreThings.length; i += 1) {
                currentThing = this.currentPreThings[i];
                currentThing.thing.outerok = true;
                this.disableThing(currentThing.thing);
                this.GameStarter.addThing(currentThing.thing, currentThing.xloc || 0, currentThing.yloc || 0);
            }
        };
        /**
         *
         */
        LevelEditr.prototype.setCurrentArgs = function () {
            if (this.currentClickMode === "Thing") {
                this.setCurrentThing(this.currentTitle, this.generateCurrentArgs());
            }
            else {
                this.onMacroIconClick(this.currentTitle, undefined, this.generateCurrentArgs());
            }
        };
        /* Mouse events
        */
        /**
         *
         */
        LevelEditr.prototype.onMouseDownScroller = function (direction, event) {
            var target = event.target, scope = this;
            target.setAttribute("scrolling", "1");
            this.GameStarter.TimeHandler.addEventInterval(function () {
                if (target.getAttribute("scrolling") !== "1") {
                    return true;
                }
                if (direction < 0 && scope.GameStarter.MapScreener.left <= 0) {
                    (scope.display.scrollers.left).style.opacity = "0";
                    return;
                }
                scope.GameStarter.scrollWindow(direction);
                scope.display.scrollers.left.style.opacity = "1";
            }, 1, Infinity);
        };
        /**
         *
         */
        LevelEditr.prototype.onMouseUpScrolling = function (event) {
            event.target.setAttribute("scrolling", "0");
        };
        /**
         *
         */
        LevelEditr.prototype.onMouseMoveEditing = function (event) {
            var x = event.x || event.clientX || 0, y = event.y || event.clientY || 0, prething, i;
            for (i = 0; i < this.currentPreThings.length; i += 1) {
                prething = this.currentPreThings[i];
                if (!prething.thing) {
                    continue;
                }
                this.GameStarter.setLeft(prething.thing, this.roundTo(x - this.GameStarter.container.offsetLeft, this.blocksize)
                    + (prething.left || 0) * this.GameStarter.unitsize);
                this.GameStarter.setTop(prething.thing, this.roundTo(y - this.GameStarter.container.offsetTop, this.blocksize)
                    - (prething.top || 0) * this.GameStarter.unitsize);
            }
        };
        /**
         * Temporarily disables this.canClick, so double clicking doesn't happen.
         */
        LevelEditr.prototype.afterClick = function () {
            this.canClick = false;
            setTimeout(function () {
                this.canClick = true;
            }, 70);
        };
        /**
         *
         */
        LevelEditr.prototype.onClickEditingThing = function (event) {
            if (!this.canClick || this.currentMode !== "Build") {
                return;
            }
            var x = this.roundTo(event.x || event.clientX || 0, this.blocksize), y = this.roundTo(event.y || event.clientY || 0, this.blocksize);
            if (!this.currentPreThings.length || !this.addMapCreationThing(x, y)) {
                return;
            }
            this.onClickEditingGenericAdd(x, y, this.currentTitle, this.currentArgs);
        };
        /**
         *
         */
        LevelEditr.prototype.onClickEditingMacro = function (event) {
            if (!this.canClick || this.currentMode !== "Build") {
                return;
            }
            var x = this.roundTo(event.x || event.clientX || 0, this.blocksize), y = this.roundTo(event.y || event.clientY || 0, this.blocksize), prething, i;
            if (!this.currentPreThings.length || !this.addMapCreationMacro(x, y)) {
                return;
            }
            for (i = 0; i < this.currentPreThings.length; i += 1) {
                prething = this.currentPreThings[i];
                this.onClickEditingGenericAdd(x + (prething.left || 0) * this.GameStarter.unitsize, y - (prething.top || 0) * this.GameStarter.unitsize, prething.thing.title || prething.title, prething.reference);
            }
        };
        /**
         *
         */
        LevelEditr.prototype.onClickEditingGenericAdd = function (x, y, title, args) {
            var thing = this.GameStarter.ObjectMaker.make(title, this.GameStarter.proliferate({
                "onThingMake": undefined,
                "onThingAdd": undefined,
                "onThingAdded": undefined,
                "movement": undefined
            }, this.getNormalizedThingArguments(args)));
            if (this.currentMode === "Build") {
                this.disableThing(thing, .7);
            }
            this.GameStarter.addThing(thing, this.roundTo(x - this.GameStarter.container.offsetLeft, this.blocksize), this.roundTo(y - this.GameStarter.container.offsetTop, this.blocksize));
        };
        /**
         *
         */
        LevelEditr.prototype.onThingIconClick = function (title, event) {
            var x = event.x || event.clientX || 0, y = event.y || event.clientY || 0, target = event.target.nodeName === "DIV"
                ? event.target : event.target.parentNode, scope = this;
            this.cancelEvent(event);
            this.killCurrentPreThings();
            setTimeout(function () {
                scope.setCurrentThing(title, scope.getCurrentArgs(), x, y);
            });
            this.setVisualOptions(target.getAttribute("name"), undefined, target.options);
        };
        /**
         *
         */
        LevelEditr.prototype.onMacroIconClick = function (title, description, options) {
            if (description) {
                this.setVisualOptions(title, description, options);
            }
            var map = this.getMapObject();
            if (!map) {
                return;
            }
            this.currentPreThings = [];
            this.GameStarter.MapsCreator.analyzePreMacro(this.GameStarter.proliferate({
                "macro": title
            }, this.generateCurrentArgs()), this.createPrethingsHolder(this.currentPreThings), this.getCurrentAreaObject(map), map);
            this.currentTitle = title;
            this.setCurrentMacroThings();
        };
        /**
         *
         */
        LevelEditr.prototype.createPrethingsHolder = function (prethings) {
            var output = {};
            this.thingGroups.forEach(function (group) {
                output[group] = prethings;
            });
            return output;
        };
        /**
         *
         */
        LevelEditr.prototype.generateCurrentArgs = function () {
            var args = {}, container = this.display.sections.ClickToPlace.VisualOptions, children = container.getElementsByClassName("VisualOptionsList"), child, labeler, valuer, value, i;
            if (children.length === 0) {
                return args;
            }
            children = children[0].childNodes;
            for (i = 0; i < children.length; i += 1) {
                child = children[i];
                labeler = child.querySelector(".VisualOptionLabel");
                valuer = child.querySelector(".VisualOptionValue");
                switch ((valuer.getAttribute("data:type") || valuer.type).toLowerCase()) {
                    case "boolean":
                        value = valuer.value === "true" ? true : false;
                        break;
                    case "number":
                        value = (Number(valuer.value) || 0) * (Number(valuer.getAttribute("data:mod")) || 1);
                        break;
                    default:
                        value = valuer.value;
                        break;
                }
                if (value !== this.keyUndefined) {
                    args[labeler.textContent] = value;
                }
            }
            return args;
        };
        /* Map manipulations
        */
        /**
         *
         */
        LevelEditr.prototype.setMapName = function () {
            var name = this.getMapName(), map = this.getMapObject();
            if (map && map.name !== name) {
                map.name = name;
                this.display.namer.value = name;
                this.setTextareaValue(this.stringifySmart(map), true);
                this.GameStarter.ItemsHolder.setItem("world", name);
            }
        };
        /**
         *
         *
         * @param {Boolean} fromGui   Whether this is from the MapSettings section
         *                            of the GUI (true), or from the Raw JSON
         *                            section (false).
         */
        LevelEditr.prototype.setMapTime = function (fromGui) {
            var map = this.getMapObject(), time;
            if (!map) {
                return;
            }
            if (fromGui) {
                time = Number(this.display.sections.MapSettings.Time.value);
                map.time = time;
            }
            else {
                time = map.time;
                this.display.sections.MapSettings.Time.value = time.toString();
            }
            this.setTextareaValue(this.stringifySmart(map), true);
            this.GameStarter.ItemsHolder.setItem("time", time);
            this.GameStarter.TimeHandler.cancelAllEvents();
        };
        /**
         *
         *
         * @param {Boolean} fromGui   Whether this is from the MapSettings section
         *                            of the GUI (true), or from the Raw JSON
         *                            section (false).
         */
        LevelEditr.prototype.setMapSetting = function (fromGui) {
            var map = this.getMapObject(), area, setting;
            if (!map) {
                return;
            }
            area = this.getCurrentAreaObject(map);
            if (fromGui) {
                setting = this.display.sections.MapSettings.Setting.Primary.value;
                if (this.display.sections.MapSettings.Setting.Secondary.value) {
                    setting += " " + this.display.sections.MapSettings.Setting.Secondary.value;
                }
                if (this.display.sections.MapSettings.Setting.Tertiary.value) {
                    setting += " " + this.display.sections.MapSettings.Setting.Tertiary.value;
                }
                area.setting = setting;
            }
            else {
                setting = area.setting.split(" ");
                this.display.sections.MapSettings.Setting.Primary.value = setting[0];
                this.display.sections.MapSettings.Setting.Secondary.value = setting[1];
                this.display.sections.MapSettings.Setting.Tertiary.value = setting[2];
            }
            this.setTextareaValue(this.stringifySmart(map), true);
            this.setDisplayMap(true);
        };
        /**
         *
         */
        LevelEditr.prototype.setLocationArea = function () {
            var map = this.getMapObject(), location;
            if (!map) {
                return;
            }
            location = this.getCurrentLocationObject(map);
            location.area = this.getCurrentArea();
            this.setTextareaValue(this.stringifySmart(map), true);
            this.setDisplayMap(true);
        };
        /**
         *
         *
         * @param {Boolean} fromGui   Whether this is from the MapSettings section
         *                             of the GUI (true), or from the Raw JSON
         *                             section (false).
         */
        LevelEditr.prototype.setMapEntry = function (fromGui) {
            var map = this.getMapObject(), location, entry;
            if (!map) {
                return;
            }
            location = this.getCurrentLocationObject(map);
            if (fromGui) {
                entry = this.display.sections.MapSettings.Entry.value;
                location.entry = entry;
            }
            else {
                console.warn("Was this code ever reached? area.location?");
                // entry = area.location;
                this.display.sections.MapSettings.Entry.value = entry;
            }
            this.setTextareaValue(this.stringifySmart(map), true);
            this.setDisplayMap(true);
        };
        /**
         *
         *
         * @param {Boolean} fromGui   Whether this is from the MapSettings section
         *                            of the GUI (true), or from the Raw JSON
         *                            section (false).
         */
        LevelEditr.prototype.setCurrentLocation = function (fromGui) {
            var map = this.getMapObject(), location;
            if (!map) {
                return;
            }
            location = this.getCurrentLocationObject(map);
            if (fromGui) {
                this.display.sections.MapSettings.Area.value = location.area
                    ? location.area.toString() : "0";
            }
            else {
                console.warn("This code is never reached, right?");
            }
            this.setTextareaValue(this.stringifySmart(map), true);
            this.setDisplayMap(true);
        };
        /**
         *
         */
        LevelEditr.prototype.addLocationToMap = function () {
            var name = this.display.sections.MapSettings.Location.options.length.toString(), map = this.getMapObject();
            if (!map) {
                return;
            }
            map.locations[name] = {
                "entry": this.mapEntryDefault
            };
            this.resetAllVisualOptionSelects("VisualOptionLocation", Object.keys(map.locations));
            this.setTextareaValue(this.stringifySmart(map), true);
            this.setDisplayMap(true);
        };
        /**
         *
         */
        LevelEditr.prototype.addAreaToMap = function () {
            var name = this.display.sections.MapSettings.Area.options.length.toString(), map = this.getMapObject();
            if (!map) {
                return;
            }
            map.areas[name] = {
                "setting": this.mapSettingDefault,
                "creation": []
            };
            this.resetAllVisualOptionSelects("VisualOptionArea", Object.keys(map.areas));
            this.setTextareaValue(this.stringifySmart(map), true);
            this.setDisplayMap(true);
        };
        /**
         *
         */
        LevelEditr.prototype.resetAllVisualOptionSelects = function (className, options) {
            var map = this.getMapObject(), elements = this.display.container.getElementsByClassName(className), attributes = {
                "children": options.map(function (option) {
                    return new Option(option, option);
                })
            }, element, value, i;
            if (!map) {
                return;
            }
            for (i = 0; i < elements.length; i += 1) {
                element = elements[i];
                value = element.value;
                element.textContent = "";
                this.GameStarter.proliferateElement(element, attributes);
                element.value = value;
            }
        };
        LevelEditr.prototype.getMapObject = function () {
            var map;
            try {
                map = this.parseSmart(this.display.stringer.textarea.value);
                this.display.stringer.messenger.textContent = "";
                this.display.namer.value = map.name || this.mapNameDefault;
            }
            catch (error) {
                this.setSectionJSON();
                this.display.stringer.messenger.textContent = error.message;
            }
            return map;
        };
        LevelEditr.prototype.getMapObjectAndTry = function () {
            var mapName = this.getMapName() + "::Temporary", mapRaw = this.getMapObject();
            if (!mapRaw) {
                return false;
            }
            try {
                this.GameStarter.MapsCreator.storeMap(mapName, mapRaw);
                this.GameStarter.MapsCreator.getMap(mapName);
                this.setDisplayMap(true);
            }
            catch (error) {
                this.display.stringer.messenger.textContent = error.message;
                return false;
            }
        };
        /**
         *
         */
        LevelEditr.prototype.getCurrentArea = function () {
            return this.display.sections.MapSettings.Area.value;
        };
        /**
         *
         */
        LevelEditr.prototype.getCurrentAreaObject = function (map) {
            if (map === void 0) { map = this.getMapObject(); }
            var area = map.locations[this.getCurrentLocation()].area;
            return map.areas[area ? area.toString() : "0"];
        };
        /**
         *
         */
        LevelEditr.prototype.getCurrentLocation = function () {
            return this.display.sections.MapSettings.Location.value;
        };
        /**
         *
         */
        LevelEditr.prototype.getCurrentLocationObject = function (map) {
            return map.locations[this.getCurrentLocation()];
        };
        /**
         *
         */
        LevelEditr.prototype.addMapCreationThing = function (x, y) {
            var mapObject = this.getMapObject(), thingRaw = this.GameStarter.proliferate({
                "thing": this.currentTitle,
                "x": this.getNormalizedX(x) + (this.GameStarter.MapScreener.left / this.GameStarter.unitsize),
                "y": this.getNormalizedY(y)
            }, this.currentArgs);
            if (!mapObject) {
                return false;
            }
            mapObject.areas[this.getCurrentArea()].creation.push(thingRaw);
            this.setTextareaValue(this.stringifySmart(mapObject), true);
            return true;
        };
        LevelEditr.prototype.addMapCreationMacro = function (x, y) {
            var mapObject = this.getMapObject(), macroRaw = this.GameStarter.proliferate({
                "macro": this.currentTitle,
                "x": this.getNormalizedX(x) + (this.GameStarter.MapScreener.left / this.GameStarter.unitsize),
                "y": this.getNormalizedY(y)
            }, this.generateCurrentArgs());
            if (!mapObject) {
                return false;
            }
            mapObject.areas[this.getCurrentArea()].creation.push(macroRaw);
            this.setTextareaValue(this.stringifySmart(mapObject), true);
            return true;
        };
        /* HTML manipulations
        */
        LevelEditr.prototype.resetDisplay = function () {
            this.display = {
                "container": this.GameStarter.createElement("div", {
                    "className": "LevelEditor",
                    "onclick": this.cancelEvent.bind(this),
                    "ondragenter": this.handleDragEnter.bind(this),
                    "ondragover": this.handleDragOver.bind(this),
                    "ondrop": this.handleDragDrop.bind(this)
                }),
                "scrollers": {},
                "stringer": {},
                "sections": {
                    "ClickToPlace": {},
                    "MapSettings": {
                        "Setting": {}
                    },
                    "buttons": {
                        "ClickToPlace": {}
                    }
                }
            };
            this.resetDisplayScrollers();
            this.resetDisplayGui();
            this.resetDisplayHead();
            this.resetDisplaySectionChoosers();
            this.resetDisplayOptionsList();
            this.resetDisplayMapSettings();
        };
        LevelEditr.prototype.resetDisplayGui = function () {
            this.display.gui = this.GameStarter.createElement("div", {
                "className": "EditorGui",
                "onclick": this.afterClick.bind(this)
            });
            this.display.container.appendChild(this.display.gui);
        };
        LevelEditr.prototype.resetDisplayScrollers = function () {
            this.display.scrollers = {
                "left": this.GameStarter.createElement("div", {
                    "className": "EditorScroller EditorScrollerLeft",
                    "onmousedown": this.onMouseDownScroller.bind(this, -this.GameStarter.unitsize * 2),
                    "onmouseup": this.onMouseUpScrolling.bind(this),
                    "onmouseout": this.onMouseUpScrolling.bind(this),
                    "onclick": this.cancelEvent.bind(this),
                    "innerText": "<",
                    "style": {
                        "paddingTop": this.GameStarter.MapScreener.height / 2 - 35 + "px",
                        "fontSize": "70px",
                        "opacity": 0
                    }
                }),
                "right": this.GameStarter.createElement("div", {
                    "className": "EditorScroller EditorScrollerRight",
                    "onmousedown": this.onMouseDownScroller.bind(this, this.GameStarter.unitsize * 2),
                    "onmouseup": this.onMouseUpScrolling.bind(this),
                    "onmouseout": this.onMouseUpScrolling.bind(this),
                    "onclick": this.cancelEvent.bind(this),
                    "innerText": ">",
                    "style": {
                        "paddingTop": this.GameStarter.MapScreener.height / 2 - 35 + "px",
                        "fontSize": "70px"
                    }
                }),
                "container": this.GameStarter.createElement("div", {
                    "className": "EditorScrollers",
                    "onmousemove": this.onMouseMoveEditing.bind(this),
                    "onclick": this.onClickEditingThing.bind(this)
                })
            };
            this.display.scrollers.container.appendChild(this.display.scrollers.left);
            this.display.scrollers.container.appendChild(this.display.scrollers.right);
            this.display.container.appendChild(this.display.scrollers.container);
        };
        LevelEditr.prototype.resetDisplayHead = function () {
            this.display.minimizer = this.GameStarter.createElement("div", {
                "className": "EditorHeadButton EditorMinimizer",
                "onclick": this.minimize.bind(this),
                "textContent": "-"
            });
            this.display.head = this.GameStarter.createElement("div", {
                "className": "EditorHead",
                "children": [
                    this.GameStarter.createElement("div", {
                        "className": "EditorNameContainer",
                        "children": [
                            this.display.namer = this.GameStarter.createElement("input", {
                                "className": "EditorNameInput",
                                "type": "text",
                                "placeholder": this.mapNameDefault,
                                "value": this.mapNameDefault,
                                "onkeyup": this.setMapName.bind(this),
                                "onchange": this.setMapName.bind(this)
                            })
                        ]
                    }),
                    this.display.minimizer,
                    this.GameStarter.createElement("div", {
                        "className": "EditorHeadButton EditorCloser",
                        "textContent": "X",
                        "onclick": this.disable.bind(this)
                    })
                ]
            });
            this.display.gui.appendChild(this.display.head);
        };
        LevelEditr.prototype.resetDisplaySectionChoosers = function () {
            var sectionChoosers = this.GameStarter.createElement("div", {
                "className": "EditorSectionChoosers",
                "onclick": this.cancelEvent.bind(this),
                "children": [
                    this.display.sections.buttons.ClickToPlace.container = this.GameStarter.createElement("div", {
                        "className": "EditorMenuOption EditorSectionChooser EditorMenuOptionThird",
                        "style": {
                            "background": "white"
                        },
                        "textContent": "Visual",
                        "onclick": this.setSectionClickToPlace.bind(this)
                    }),
                    this.display.sections.buttons.MapSettings = this.GameStarter.createElement("div", {
                        "className": "EditorMenuOption EditorSectionChooser EditorMenuOptionThird",
                        "style": {
                            "background": "gray"
                        },
                        "textContent": "Map",
                        "onclick": this.setSectionMapSettings.bind(this)
                    }),
                    this.display.sections.buttons.JSON = this.GameStarter.createElement("div", {
                        "className": "EditorMenuOption EditorSectionChooser EditorMenuOptionThird",
                        "style": {
                            "background": "gray"
                        },
                        "textContent": "JSON",
                        "onclick": this.setSectionJSON.bind(this)
                    })
                ]
            });
            this.display.gui.appendChild(sectionChoosers);
        };
        LevelEditr.prototype.resetDisplayOptionsList = function () {
            this.display.sections.ClickToPlace.container = this.GameStarter.createElement("div", {
                "className": "EditorOptionsList EditorSectionMain",
                "onclick": this.cancelEvent.bind(this),
                "style": {
                    "display": "block"
                }
            });
            this.resetDisplayOptionsListSubOptionsMenu();
            this.resetDisplayOptionsListSubOptions();
            this.display.gui.appendChild(this.display.sections.ClickToPlace.container);
        };
        LevelEditr.prototype.resetDisplayOptionsListSubOptionsMenu = function () {
            var holder = this.GameStarter.createElement("div", {
                "className": "EditorSubOptionsListsMenu"
            });
            this.display.sections.buttons.ClickToPlace.Things = this.GameStarter.createElement("div", {
                "className": "EditorMenuOption EditorSubOptionsListChooser EditorMenuOptionHalf",
                "textContent": "Things",
                "onclick": this.setSectionClickToPlaceThings.bind(this),
                "style": {
                    "background": "#CCC"
                }
            });
            this.display.sections.buttons.ClickToPlace.Macros = this.GameStarter.createElement("div", {
                "className": "EditorMenuOption EditorSubOptionsListChooser EditorMenuOptionHalf",
                "textContent": "Macros",
                "onclick": this.setSectionClickToPlaceMacros.bind(this),
                "style": {
                    "background": "#777"
                }
            });
            holder.appendChild(this.display.sections.buttons.ClickToPlace.Things);
            holder.appendChild(this.display.sections.buttons.ClickToPlace.Macros);
            this.display.sections.ClickToPlace.container.appendChild(holder);
        };
        LevelEditr.prototype.resetDisplayMapSettings = function () {
            this.display.sections.MapSettings.container = this.GameStarter.createElement("div", {
                "className": "EditorMapSettings EditorSectionMain",
                "onclick": this.cancelEvent.bind(this),
                "style": {
                    "display": "none"
                },
                "children": [
                    this.GameStarter.createElement("div", {
                        "className": "EditorMenuOption",
                        "textContent": "+ Add Area",
                        "onclick": this.addAreaToMap.bind(this)
                    }),
                    this.GameStarter.createElement("div", {
                        "className": "EditorMenuOption",
                        "textContent": "+ Add Location",
                        "onclick": this.addLocationToMap.bind(this)
                    })
                ]
            });
            this.resetDisplayMapSettingsCurrent();
            this.resetDisplayMapSettingsMap();
            this.resetDisplayMapSettingsLocation();
            this.resetDisplayJSON();
            this.resetDisplayVisualContainers();
            this.resetDisplayButtons();
            this.display.gui.appendChild(this.display.sections.MapSettings.container);
        };
        LevelEditr.prototype.resetDisplayMapSettingsCurrent = function () {
            this.display.sections.MapSettings.container.appendChild(this.GameStarter.createElement("div", {
                "className": "EditorMapSettingsSubGroup",
                "children": [
                    this.GameStarter.createElement("label", {
                        "textContent": "Current Location"
                    }),
                    this.display.sections.MapSettings.Location = this.createSelect(["0"], {
                        "className": "VisualOptionLocation",
                        "onchange": this.setCurrentLocation.bind(this, true)
                    })
                ]
            }));
        };
        LevelEditr.prototype.resetDisplayMapSettingsMap = function () {
            this.display.sections.MapSettings.container.appendChild(this.GameStarter.createElement("div", {
                "className": "EditorMapSettingsGroup",
                "children": [
                    this.GameStarter.createElement("h4", {
                        "textContent": "Map"
                    }),
                    this.GameStarter.createElement("div", {
                        "className": "EditorMapSettingsSubGroup",
                        "children": [
                            this.GameStarter.createElement("label", {
                                "className": "EditorMapSettingsLabel",
                                "textContent": "Time"
                            }),
                            this.display.sections.MapSettings.Time = this.createSelect([
                                "100", "200", "300", "400", "500", "1000", "Infinity"
                            ], {
                                "value": this.mapTimeDefault.toString(),
                                "onchange": this.setMapTime.bind(this, true)
                            })
                        ]
                    })
                ]
            }));
        };
        LevelEditr.prototype.resetDisplayMapSettingsLocation = function () {
            this.display.sections.MapSettings.container.appendChild(this.GameStarter.createElement("div", {
                "className": "EditorMapSettingsGroup",
                "children": [
                    this.GameStarter.createElement("h4", {
                        "textContent": "Location"
                    }),
                    this.GameStarter.createElement("div", {
                        "className": "EditorMapSettingsSubGroup",
                        "children": [
                            this.GameStarter.createElement("label", {
                                "textContent": "Area"
                            }),
                            this.display.sections.MapSettings.Area = this.createSelect(["0"], {
                                "className": "VisualOptionArea",
                                "onchange": this.setLocationArea.bind(this, true)
                            })
                        ]
                    }),
                    this.GameStarter.createElement("div", {
                        "className": "EditorMapSettingsSubGroup",
                        "children": [
                            this.GameStarter.createElement("label", {
                                "textContent": "Setting"
                            }),
                            this.display.sections.MapSettings.Setting.Primary = this.createSelect([
                                "Overworld", "Underworld", "Underwater", "Castle"
                            ], {
                                "onchange": this.setMapSetting.bind(this, true)
                            }),
                            this.display.sections.MapSettings.Setting.Secondary = this.createSelect([
                                "", "Night", "Underwater", "Alt"
                            ], {
                                "onchange": this.setMapSetting.bind(this, true)
                            }),
                            this.display.sections.MapSettings.Setting.Tertiary = this.createSelect([
                                "", "Night", "Underwater", "Alt"
                            ], {
                                "onchange": this.setMapSetting.bind(this, true)
                            })
                        ]
                    }),
                    this.GameStarter.createElement("div", {
                        "className": "EditorMapSettingsSubGroup",
                        "children": [
                            this.GameStarter.createElement("label", {
                                "textContent": "Entrance"
                            }),
                            this.display.sections.MapSettings.Entry = this.createSelect([
                                "Plain", "Normal", "Castle", "PipeVertical", "PipeHorizontal"
                            ], {
                                "onchange": this.setMapEntry.bind(this, true)
                            })
                        ]
                    })
                ]
            }));
        };
        LevelEditr.prototype.resetDisplayJSON = function () {
            this.display.sections.JSON = this.GameStarter.createElement("div", {
                "className": "EditorJSON EditorSectionMain",
                "onclick": this.cancelEvent.bind(this),
                "style": {
                    "display": "none"
                },
                "children": [
                    this.display.stringer.textarea = this.GameStarter.createElement("textarea", {
                        "className": "EditorJSONInput",
                        "spellcheck": false,
                        "onkeyup": this.getMapObjectAndTry.bind(this),
                        "onchange": this.getMapObjectAndTry.bind(this)
                    }),
                    this.display.stringer.messenger = this.GameStarter.createElement("div", {
                        "className": "EditorJSONInfo"
                    })
                ]
            });
            this.display.gui.appendChild(this.display.sections.JSON);
        };
        LevelEditr.prototype.resetDisplayVisualContainers = function () {
            this.display.sections.ClickToPlace.VisualSummary = this.GameStarter.createElement("div", {
                "className": "EditorVisualSummary",
                "onclick": this.cancelEvent.bind(this)
            });
            this.display.sections.ClickToPlace.VisualOptions = this.GameStarter.createElement("div", {
                "className": "EditorVisualOptions",
                "onclick": this.cancelEvent.bind(this),
                "textContent": "Click an icon to view options.",
                "style": {
                    "display": "block"
                }
            });
            this.display.gui.appendChild(this.display.sections.ClickToPlace.VisualSummary);
            this.display.gui.appendChild(this.display.sections.ClickToPlace.VisualOptions);
        };
        LevelEditr.prototype.resetDisplayButtons = function () {
            var scope = this;
            this.display.gui.appendChild(this.GameStarter.createElement("div", {
                "className": "EditorMenu",
                "onclick": this.cancelEvent.bind(this),
                "children": (function (actions) {
                    return Object.keys(actions).map(function (key) {
                        return scope.GameStarter.createElement("div", {
                            "className": "EditorMenuOption EditorMenuOptionFifth EditorMenuOption-" + key,
                            "textContent": key,
                            "onclick": actions[key][0].bind(scope),
                            "children": actions[key][1]
                        });
                    });
                })({
                    "Build": [this.startBuilding.bind(this)],
                    "Play": [this.startPlaying.bind(this)],
                    "Save": [this.downloadCurrentJSON.bind(this)],
                    "Load": [
                        this.loadCurrentJSON.bind(this),
                        this.display.inputDummy = this.GameStarter.createElement("input", {
                            "type": "file",
                            "style": {
                                "display": "none"
                            },
                            "onchange": this.handleUploadStart.bind(this)
                        })
                    ],
                    "Reset": [this.resetDisplayMap.bind(this)]
                })
            }));
        };
        /**
         * Adds the Things and Macros menus to the EditorOptionsList container in
         * the main GUI.
         */
        LevelEditr.prototype.resetDisplayOptionsListSubOptions = function () {
            this.resetDisplayOptionsListSubOptionsThings();
            this.resetDisplayOptionsListSubOptionsMacros();
        };
        /**
         * Creates the menu of icons for Things, with a dropdown select to choose
         * the groupings being displayed. These icons, when clicked, trigger
         * this.onThingIconClick on the Thing's title.
         */
        LevelEditr.prototype.resetDisplayOptionsListSubOptionsThings = function () {
            var scope = this, 
            // Without clicker, tslint complaints onThingIconClick isn't used...
            clicker = this.onThingIconClick;
            this.display.sections.ClickToPlace.Things = this.GameStarter.createElement("div", {
                "className": "EditorSectionSecondary EditorOptions EditorOptions-Things",
                "style": {
                    "display": "block"
                },
                "children": (function () {
                    var selectedIndex = 0, containers = Object.keys(scope.prethings).map(function (key) {
                        var children = Object.keys(scope.prethings[key]).map(function (title) {
                            var thing = scope.GameStarter.ObjectMaker.make(title), container = scope.GameStarter.createElement("div", {
                                "className": "EditorListOption",
                                "name": title,
                                "options": scope.prethings[key][title],
                                "children": [thing.canvas],
                                "onclick": clicker.bind(scope, title)
                            }), sizeMax = 70, widthThing = thing.width * scope.GameStarter.unitsize, heightThing = thing.height * scope.GameStarter.unitsize, widthDiff = (sizeMax - widthThing) / 2, heightDiff = (sizeMax - heightThing) / 2;
                            thing.canvas.style.top = heightDiff + "px";
                            thing.canvas.style.right = widthDiff + "px";
                            thing.canvas.style.bottom = heightDiff + "px";
                            thing.canvas.style.left = widthDiff + "px";
                            scope.GameStarter.PixelDrawer.setThingSprite(thing);
                            return container;
                        });
                        return scope.GameStarter.createElement("div", {
                            "className": "EditorOptionContainer",
                            "style": {
                                "display": "none"
                            },
                            "children": children
                        });
                    }), switcher = scope.createSelect(Object.keys(scope.prethings), {
                        "className": "EditorOptionContainerSwitchers",
                        "onchange": function () {
                            containers[selectedIndex + 1].style.display = "none";
                            containers[switcher.selectedIndex + 1].style.display = "block";
                            selectedIndex = switcher.selectedIndex;
                        }
                    });
                    containers[0].style.display = "block";
                    containers.unshift(switcher);
                    return containers;
                })()
            });
            this.display.sections.ClickToPlace.container.appendChild(this.display.sections.ClickToPlace.Things);
        };
        /**
         * Creates the menu of (text) icons for Macros. When clicked, these trigger
         * this.onMacroIconClick on the macro's title, description, and options.
         */
        LevelEditr.prototype.resetDisplayOptionsListSubOptionsMacros = function () {
            var scope = this;
            scope.display.sections.ClickToPlace.Macros = scope.GameStarter.createElement("div", {
                "className": "EditorSectionSecondary EditorOptions EditorOptions-Macros",
                "style": {
                    "display": "none"
                },
                "children": Object.keys(scope.macros).map(function (key) {
                    var macro = scope.macros[key];
                    return scope.GameStarter.createElement("div", {
                        "className": "EditorOptionContainer",
                        "children": [
                            scope.GameStarter.createElement("div", {
                                "className": "EditorOptionTitle EditorMenuOption",
                                "textContent": key,
                                "onclick": scope.onMacroIconClick.bind(scope, key, macro.description, macro.options)
                            })
                        ]
                    });
                })
            });
            this.display.sections.ClickToPlace.container.appendChild(this.display.sections.ClickToPlace.Macros);
        };
        /**
         *
         */
        LevelEditr.prototype.setSectionClickToPlace = function () {
            this.display.sections.ClickToPlace.VisualOptions.style.display = "block";
            this.display.sections.ClickToPlace.container.style.display = "block";
            this.display.sections.MapSettings.container.style.display = "none";
            this.display.sections.JSON.style.display = "none";
            this.display.sections.buttons.ClickToPlace.container.style.backgroundColor = "white";
            this.display.sections.buttons.MapSettings.style.background = "gray";
            this.display.sections.buttons.JSON.style.background = "gray";
        };
        /**
         *
         */
        LevelEditr.prototype.setSectionMapSettings = function () {
            this.display.sections.ClickToPlace.VisualOptions.style.display = "none";
            this.display.sections.ClickToPlace.container.style.display = "none";
            this.display.sections.MapSettings.container.style.display = "block";
            this.display.sections.JSON.style.display = "none";
            this.display.sections.buttons.ClickToPlace.container.style.background = "gray";
            this.display.sections.buttons.MapSettings.style.background = "white";
            this.display.sections.buttons.JSON.style.background = "gray";
        };
        /**
         *
         */
        LevelEditr.prototype.setSectionJSON = function () {
            this.display.sections.ClickToPlace.VisualOptions.style.display = "none";
            this.display.sections.ClickToPlace.container.style.display = "none";
            this.display.sections.MapSettings.container.style.display = "none";
            this.display.sections.JSON.style.display = "block";
            this.display.sections.buttons.ClickToPlace.container.style.background = "gray";
            this.display.sections.buttons.MapSettings.style.background = "gray";
            this.display.sections.buttons.JSON.style.background = "white";
        };
        /**
         *
         */
        LevelEditr.prototype.setSectionClickToPlaceThings = function (event) {
            this.setCurrentClickMode("Thing", event);
            this.display.container.onclick = this.onClickEditingThing.bind(this);
            this.display.scrollers.container.onclick = this.onClickEditingThing.bind(this);
            this.display.sections.ClickToPlace.VisualOptions.style.display = "block";
            this.display.sections.ClickToPlace.Things.style.display = "block";
            this.display.sections.ClickToPlace.Macros.style.display = "none";
            this.display.sections.buttons.ClickToPlace.Things.style.background = "#CCC";
            this.display.sections.buttons.ClickToPlace.Macros.style.background = "#777";
        };
        /**
         *
         */
        LevelEditr.prototype.setSectionClickToPlaceMacros = function (event) {
            this.setCurrentClickMode("Macro", event);
            this.display.container.onclick = this.onClickEditingMacro.bind(this);
            this.display.scrollers.container.onclick = this.onClickEditingMacro.bind(this);
            this.display.sections.ClickToPlace.VisualOptions.style.display = "block";
            this.display.sections.ClickToPlace.Things.style.display = "none";
            this.display.sections.ClickToPlace.Macros.style.display = "block";
            this.display.sections.buttons.ClickToPlace.Things.style.background = "#777";
            this.display.sections.buttons.ClickToPlace.Macros.style.background = "#CCC";
        };
        /**
         *
         */
        LevelEditr.prototype.setTextareaValue = function (value, doBeautify) {
            if (doBeautify === void 0) { doBeautify = false; }
            if (doBeautify) {
                this.display.stringer.textarea.value = this.beautifier(value);
            }
            else {
                this.display.stringer.textarea.value = value;
            }
        };
        /**
         *
         */
        LevelEditr.prototype.beautifyTextareaValue = function () {
            this.display.stringer.textarea.value = this.beautifier(this.display.stringer.textarea.value);
        };
        /**
         *
         */
        LevelEditr.prototype.setVisualOptions = function (name, description, options) {
            var visual = this.display.sections.ClickToPlace.VisualOptions, 
            // Without clicker, tslint complains createVisualOption isn't being used...
            clicker = this.createVisualOption.bind(this), scope = this;
            visual.textContent = "";
            visual.appendChild(this.GameStarter.createElement("h3", {
                "className": "VisualOptionName",
                "textContent": name
            }));
            if (description) {
                visual.appendChild(this.GameStarter.createElement("div", {
                    "className": "VisualOptionDescription",
                    "textContent": description
                }));
            }
            if (options) {
                visual.appendChild(scope.GameStarter.createElement("div", {
                    "className": "VisualOptionsList",
                    "children": Object.keys(options).map(function (key) {
                        return scope.GameStarter.createElement("div", {
                            "className": "VisualOption",
                            "children": [
                                scope.GameStarter.createElement("div", {
                                    "className": "VisualOptionLabel",
                                    "textContent": key
                                }),
                                clicker(options[key])
                            ]
                        });
                    })
                }));
            }
            this.display.sections.ClickToPlace.VisualSummary.textContent = name;
        };
        /**
         *
         */
        LevelEditr.prototype.createVisualOption = function (optionRaw) {
            var option = this.createVisualOptionObject(optionRaw);
            switch (option.type) {
                case "Boolean":
                    return this.createVisualOptionBoolean();
                case "Number":
                    return this.createVisualOptionNumber(option);
                case "Select":
                    return this.createVisualOptionSelect(option);
                case "String":
                    return this.createVisualOptionString(option);
                case "Location":
                    return this.createVisualOptionLocation(option);
                case "Area":
                    return this.createVisualOptionArea(option);
                case "Everything":
                    return this.createVisualOptionEverything(option);
                default:
                    return this.createVisualOptionDefault(option);
            }
        };
        /**
         *
         */
        // mergin this into createVisualOption
        LevelEditr.prototype.createVisualOptionObject = function (optionRaw) {
            var option;
            // If the option isn't already an Object, make it one
            switch (optionRaw.constructor) {
                case Number:
                    option = {
                        "type": "Number",
                        "mod": optionRaw
                    };
                    break;
                case String:
                    option = {
                        "type": optionRaw
                    };
                    break;
                case Array:
                    option = {
                        "type": "Select",
                        "options": optionRaw
                    };
                    break;
                default:
                    option = optionRaw;
            }
            return option;
        };
        /**
         *
         */
        LevelEditr.prototype.createVisualOptionBoolean = function () {
            return this.createSelect([
                "false", "true"
            ], {
                "className": "VisualOptionValue",
                "data:type": "Boolean",
                "onchange": this.setCurrentArgs.bind(this)
            });
        };
        /**
         *
         */
        LevelEditr.prototype.createVisualOptionNumber = function (option) {
            var scope = this;
            return this.GameStarter.createElement("div", {
                "className": "VisualOptionHolder",
                "children": (function () {
                    var modReal = option.mod || 1, input = scope.GameStarter.createElement("input", {
                        "type": "Number",
                        "data:type": "Number",
                        "value": (option.value === undefined) ? 1 : option.value
                    }, {
                        "className": "VisualOptionValue modReal" + modReal,
                        "onchange": scope.setCurrentArgs.bind(scope)
                    }), children = [input];
                    input.setAttribute("data:mod", modReal.toString());
                    if (option.Infinite) {
                        var valueOld = undefined, infinite = scope.createSelect([
                            "Number", "Infinite"
                        ], {
                            "className": "VisualOptionInfiniter",
                            "onchange": function () {
                                if (infinite.value === "Number") {
                                    input.type = "Number";
                                    input.disabled = false;
                                    input.value = valueOld;
                                    input.onchange(undefined);
                                }
                                else {
                                    input.type = "Text";
                                    input.disabled = true;
                                    valueOld = input.value;
                                    input.value = "Infinity";
                                    input.onchange(undefined);
                                }
                            }
                        });
                        if (option.value === Infinity) {
                            infinite.value = "Infinite";
                            infinite.onchange(undefined);
                        }
                        children.push(infinite);
                    }
                    if (modReal > 1) {
                        children.push(scope.GameStarter.createElement("div", {
                            "className": "VisualOptionRecommendation",
                            "textContent": "x" + option.mod
                        }));
                    }
                    return children;
                })()
            });
        };
        /**
         *
         */
        LevelEditr.prototype.createVisualOptionSelect = function (option) {
            return this.createSelect(option.options, {
                "className": "VisualOptionValue",
                "data:type": "Boolean",
                "onchange": this.setCurrentArgs.bind(this)
            });
        };
        /**
         *
         */
        LevelEditr.prototype.createVisualOptionString = function (option) {
            return this.createSelect(option.options, {
                "className": "VisualOptionValue",
                "data:type": "String",
                "onchange": this.setCurrentArgs.bind(this)
            });
        };
        /**
         *
         */
        LevelEditr.prototype.createVisualOptionLocation = function (option) {
            var map = this.getMapObject(), locations;
            if (!map) {
                return this.GameStarter.createElement("div", {
                    "className": "VisualOptionValue VisualOptionLocation EditorComplaint",
                    "text": "Fix map compilation to get locations!"
                });
            }
            locations = Object.keys(map.locations);
            locations.unshift(this.keyUndefined);
            return this.createSelect(locations, {
                "className": "VisualOptionValue VisualOptionLocation",
                "data-type": "Number"
            });
        };
        /**
         *
         */
        LevelEditr.prototype.createVisualOptionArea = function (option) {
            var map = this.getMapObject(), areas;
            if (!map) {
                return this.GameStarter.createElement("div", {
                    "className": "VisualOptionValue VisualOptionArea EditorComplaint",
                    "text": "Fix map compilation to get areas!"
                });
            }
            areas = Object.keys(map.areas);
            areas.unshift(this.keyUndefined);
            return this.createSelect(areas, {
                "className": "VisualOptionValue VisualOptionArea",
                "data-type": "Number",
                "onchange": this.setCurrentArgs.bind(this)
            });
        };
        /**
         *
         */
        LevelEditr.prototype.createVisualOptionEverything = function (option) {
            return this.createSelect(this.thingKeys, {
                "className": "VisualOptionValue VisualOptionEverything",
                "data-type": "String",
                "onchange": this.setCurrentArgs.bind(this)
            });
        };
        /**
         *
         */
        LevelEditr.prototype.createVisualOptionDefault = function (option) {
            return this.GameStarter.createElement("div", {
                "className": "EditorComplaint",
                "textContent": "Unknown type requested: " + option.type
            });
        };
        /**
         *
         */
        LevelEditr.prototype.resetDisplayMap = function () {
            this.setTextareaValue(this.stringifySmart(this.mapDefault), true);
            this.setDisplayMap(true);
            this.GameStarter.InputWriter.setCanTrigger(false);
        };
        /**
         *
         */
        LevelEditr.prototype.setDisplayMap = function (doDisableThings) {
            if (doDisableThings === void 0) { doDisableThings = false; }
            var value = this.display.stringer.textarea.value, mapName = this.getMapName(), testObject, map;
            try {
                testObject = this.parseSmart(value);
                this.setTextareaValue(this.display.stringer.textarea.value);
            }
            catch (error) {
                this.setSectionJSON();
                this.display.stringer.messenger.textContent = error.message;
                return;
            }
            try {
                this.GameStarter.MapsCreator.storeMap(mapName, testObject);
                map = this.GameStarter.MapsCreator.getMap(mapName);
            }
            catch (error) {
                this.setSectionJSON();
                this.display.stringer.messenger.textContent = error.message;
                return;
            }
            this.display.stringer.messenger.textContent = "";
            this.setTextareaValue(this.display.stringer.textarea.value);
            this.GameStarter.setMap(mapName, this.getCurrentLocation());
            if (doDisableThings) {
                this.disableAllThings();
            }
        };
        /**
         *
         */
        LevelEditr.prototype.getMapName = function () {
            return this.display.namer.value || this.mapNameDefault;
        };
        /* Utility functions
        */
        /**
         *
         */
        LevelEditr.prototype.roundTo = function (num, rounding) {
            return Math.round(num / rounding) * rounding;
        };
        /**
         *
         */
        LevelEditr.prototype.stringifySmart = function (object) {
            if (object === void 0) { object = {}; }
            return JSON.stringify(object, this.jsonReplacerSmart);
        };
        /**
         *
         */
        LevelEditr.prototype.parseSmart = function (text) {
            return JSON.parse(text, this.jsonReplacerSmart);
        };
        /**
         *
         */
        LevelEditr.prototype.jsonReplacerSmart = function (key, value) {
            if (value !== value) {
                return "NaN";
            }
            else if (value === Infinity) {
                return "Infinity";
            }
            else if (value === -Infinity) {
                return "-Infinity";
            }
            else {
                return value;
            }
        };
        /**
         *
         */
        LevelEditr.prototype.disableThing = function (thing, opacity) {
            if (opacity === void 0) { opacity = .49; }
            thing.movement = undefined;
            thing.onThingMake = undefined;
            thing.onThingAdd = undefined;
            thing.onThingAdded = undefined;
            thing.nofall = true;
            thing.nocollide = true;
            thing.xvel = 0;
            thing.yvel = 0;
            thing.opacity = typeof opacity;
        };
        /**
         *
         */
        LevelEditr.prototype.disableAllThings = function () {
            var scope = this, groups = this.GameStarter.GroupHolder.getGroups(), i;
            for (i in groups) {
                if (groups.hasOwnProperty(i)) {
                    groups[i].forEach(function (thing) {
                        scope.disableThing(thing);
                    });
                }
            }
            // Helps prevent triggers such as Bowser jumping
            this.GameStarter.player.dead = true;
            this.GameStarter.ItemsHolder.setItem("time", Infinity);
        };
        /**
         *
         */
        LevelEditr.prototype.clearAllThings = function () {
            var scope = this, groups = this.GameStarter.GroupHolder.getGroups(), i;
            for (i in groups) {
                if (groups.hasOwnProperty(i)) {
                    groups[i].forEach(function (thing) {
                        scope.GameStarter.killNormal(thing);
                    });
                }
            }
        };
        /**
         *
         */
        LevelEditr.prototype.getNormalizedX = function (raw) {
            return raw / this.GameStarter.unitsize;
        };
        /**
         *
         */
        LevelEditr.prototype.getNormalizedY = function (raw) {
            return this.GameStarter.MapScreener.floor
                - (raw / this.GameStarter.unitsize)
                + this.GameStarter.unitsize * 3; // Why +3?
        };
        /**
         *
         */
        LevelEditr.prototype.getNormalizedThingArguments = function (args) {
            var argsNormal = this.GameStarter.proliferate({}, args);
            if (argsNormal.height === Infinity) {
                argsNormal.height = this.GameStarter.MapScreener.height;
            }
            if (argsNormal.width === Infinity) {
                argsNormal.width = this.GameStarter.MapScreener.width;
            }
            return argsNormal;
        };
        /**
         *
         */
        LevelEditr.prototype.createSelect = function (options, attributes) {
            var select = this.GameStarter.createElement("select", attributes), i;
            for (i = 0; i < options.length; i += 1) {
                select.appendChild(this.GameStarter.createElement("option", {
                    "value": options[i],
                    "textContent": options[i]
                }));
            }
            if (typeof attributes.value !== "undefined") {
                select.value = attributes.value;
            }
            return select;
        };
        /**
         *
         */
        LevelEditr.prototype.downloadFile = function (name, content) {
            var link = this.GameStarter.createElement("a", {
                "download": name,
                "href": "data:text/json;charset=utf-8," + encodeURIComponent(content)
            });
            this.display.container.appendChild(link);
            link.click();
            this.display.container.removeChild(link);
            return link;
        };
        /**
         *
         */
        LevelEditr.prototype.killCurrentPreThings = function () {
            for (var i = 0; i < this.currentPreThings.length - 1; i += 1) {
                this.GameStarter.killNormal(this.currentPreThings[i].thing);
            }
        };
        /* File uploading
        */
        /**
         *
         */
        LevelEditr.prototype.handleUploadStart = function (event) {
            var file, reader;
            this.cancelEvent(event);
            if (event && event.dataTransfer) {
                file = event.dataTransfer.files[0];
            }
            else {
                file = this.display.inputDummy.files[0];
                reader = new FileReader();
            }
            if (!file) {
                return;
            }
            reader = new FileReader();
            reader.onloadend = this.handleUploadCompletion.bind(this);
            reader.readAsText(file);
        };
        /**
         *
         */
        LevelEditr.prototype.handleDragEnter = function (event) {
            this.setSectionJSON();
        };
        /**
         *
         */
        LevelEditr.prototype.handleDragOver = function (event) {
            this.cancelEvent(event);
        };
        /**
         *
         */
        LevelEditr.prototype.handleDragDrop = function (event) {
            this.handleUploadStart(event);
        };
        /**
         *
         */
        LevelEditr.prototype.cancelEvent = function (event) {
            if (!event) {
                return;
            }
            if (typeof event.preventDefault === "function") {
                event.preventDefault();
            }
            if (typeof event.stopPropagation === "function") {
                event.stopPropagation();
            }
            event.cancelBubble = true;
        };
        /* Styles
         */
        /*
         *
         */
        LevelEditr.prototype.createPageStyles = function () {
            return {
                ".LevelEditor": {
                    "position": "absolute",
                    "top": "0",
                    "right": "0",
                    "bottom": "0",
                    "left": "0"
                },
                ".LevelEditor h4": {
                    "margin": "14px 0 7px 0"
                },
                ".LevelEditor select, .LevelEditor input": {
                    "margin": "7px",
                    "padding": "3px 7px",
                    "font-size": "1.17em"
                },
                // EditorGUI & EditorScrollers
                ".LevelEditor .EditorGui": {
                    "position": "absolute",
                    "top": "0",
                    "right": "0",
                    "bottom": "0",
                    "width": "50%",
                    "background": "rgba(0, 7, 14, .84)",
                    "overflow": "hidden",
                    "user-select": "none",
                    "box-sizing": "border-box",
                    "z-index": "70",
                    "transition": "117ms all"
                },
                // EditorMenuContainer & EditorScrollers
                ".LevelEditor .EditorMenuContainer": {
                    "position": "absolute",
                    "top": "0",
                    "right": "0",
                    "bottom": "0",
                    "width": "50%",
                    "background": "rgba(0, 7, 14, .84)",
                    "overflow": "hidden",
                    "user-select": "none",
                    "box-sizing": "border-box",
                    "z-index": "70",
                    "transition": "117ms all"
                },
                ".LevelEditor .EditorScrollers": {
                    "position": "absolute",
                    "top": "0",
                    "right": "50%",
                    "bottom": "0",
                    "left": "0",
                    "transition": "117ms all"
                },
                ".EditorScroller": {
                    "position": "absolute",
                    "width": "70px",
                    "height": "101%",
                    "cursor": "pointer",
                    "box-sizing": "border-box",
                    "text-align": "center",
                    "transition": "280ms opacity"
                },
                ".EditorScrollerRight": {
                    "right": "0"
                },
                ".EditorScrollerLeft": {
                    "left": "0"
                },
                ".LevelEditor.minimized .EditorGui": {
                    "width": "117px"
                },
                ".LevelEditor.minimized .EditorMenuContainer": {
                    "width": "117px"
                },
                ".LevelEditor.minimized .EditorScrollers": {
                    "right": "117px",
                    "padding-right": "117px"
                },
                // EditorHead
                ".LevelEditor .EditorHead": {
                    "position": "relative",
                    "height": "35px"
                },
                ".LevelEditor .EditorHead .EditorNameContainer": {
                    "position": "absolute",
                    "top": "1px",
                    "right": "73px",
                    "left": "2px",
                    "height": "35px"
                },
                ".LevelEditor .EditorHead .EditorNameInput": {
                    "display": "block",
                    "margin": "0",
                    "padding": "3px 7px",
                    "width": "100%",
                    "background": "white",
                    "border": "1px solid black",
                    "font-size": "1.4em",
                    "box-sizing": "border-box"
                },
                ".LevelEditor .EditorHead .EditorHeadButton": {
                    "position": "absolute",
                    "top": "2px",
                    "width": "32px",
                    "height": "32px",
                    "background": "rgb(35,35,35)",
                    "border": "1px solid silver",
                    "box-sizing": "border-box",
                    "text-align": "center",
                    "padding-top": "7px",
                    "cursor": "pointer"
                },
                ".LevelEditor .EditorHead .EditorMinimizer": {
                    "right": "38px"
                },
                ".LevelEditor .EditorHead .EditorCloser": {
                    "right": "3px"
                },
                // EditorSectionChoosers
                ".LevelEditor .EditorSectionChooser": {
                    "width": "50%",
                    "box-sizing": "border-box",
                    "height": "35px",
                    "background": "white",
                    "border": "3px solid black",
                    "color": "black",
                    "cursor": "pointer"
                },
                ".LevelEditor .EditorSectionChooser.Inactive": {
                    "background": "gray"
                },
                ".LevelEditor.minimized .EditorSectionChoosers": {
                    "opacity": "0"
                },
                // EditorSectionMain
                ".LevelEditor .EditorSectionMain": {
                    "position": "absolute",
                    "top": "70px",
                    "right": "0",
                    "bottom": "49px",
                    "left": "0",
                    "overflow-y": "auto"
                },
                ".LevelEditor .EditorSectionSecondary": {
                    "position": "absolute",
                    "top": "35px",
                    "right": "248px",
                    "bottom": "0px",
                    "left": "0",
                    "overflow-y": "auto"
                },
                // EditorJSON
                ".LevelEditor .EditorJSON": {
                    "font-family": "Courier"
                },
                ".LevelEditor .EditorJSONInput": {
                    "display": "block",
                    "width": "100%",
                    "height": "84%",
                    "background": "rgba(0, 3, 7, .91)",
                    "color": "rgba(255, 245, 245, .91)",
                    "box-sizing": "border-box",
                    "overflow-y": "auto",
                    "resize": "none"
                },
                ".LevelEditor .EditorJSONInfo": {
                    "height": "1.75em",
                    "padding": "3px 7px"
                },
                ".LevelEditor.minimized .EditorJSON": {
                    "opacity": "0"
                },
                // EditorOptions
                ".LevelEditor .EditorOptions, .LevelEditor .EditorOptionContainer": {
                    "padding-left": "3px",
                    "clear": "both",
                    "min-width": "98px"
                },
                ".LevelEditor.minimized .EditorOptionsList": {
                    "opacity": "0"
                },
                ".LevelEditor .EditorListOption": {
                    "position": "relative",
                    "float": "left",
                    "margin": "0 7px 7px 0",
                    "width": "70px",
                    "height": "70px",
                    "background": "black",
                    "border": "white",
                    "overflow": "hidden",
                    "cursor": "pointer"
                },
                ".LevelEditor .EditorListOption canvas": {
                    "position": "absolute"
                },
                // EditorVisualOptions
                ".LevelEditor .EditorVisualSummary": {
                    "margin": "42px 7px",
                    "opacity": "0",
                    "transition": "117ms opacity"
                },
                ".LevelEditor.minimized .EditorVisualSummary": {
                    "opacity": "0"
                },
                ".LevelEditor .EditorVisualOptions": {
                    "position": "absolute",
                    "right": "21px",
                    "top": "119px",
                    "bottom": "42px",
                    "padding": "7px 11px",
                    "width": "210px",
                    "border": "1px solid silver",
                    "border-width": "1px 0 0 1px",
                    "overflow-x": "visible",
                    "overflow-y": "auto",
                    "opacity": "1",
                    "box-sizing": "border-box",
                    "transition": "117ms opacity"
                },
                ".LevelEditor.minimized .EditorVisualOptions": {
                    "left": "100%"
                },
                ".LevelEditor .EditorVisualOptions .VisualOption": {
                    "padding": "14px 0"
                },
                ".LevelEditor .EditorVisualOptions .VisualOptionName": {
                    "margin": "3px 0 7px 0"
                },
                ".LevelEditor .EditorVisualOptions .VisualOptionDescription": {
                    "padding-bottom": "14px"
                },
                ".LevelEditor .EditorVisualOptions .VisualOptionValue": {
                    "max-width": "117px"
                },
                ".LevelEditor .EditorVisualOptions .VisualOptionInfiniter, .LevelEditor .EditorVisualOptions .VisualOptionRecommendation": {
                    "display": "inline"
                },
                // EditorMenu
                ".LevelEditor .EditorMenu": {
                    "position": "absolute",
                    "right": "0",
                    "bottom": "0",
                    "left": "0"
                },
                ".LevelEditor .EditorMenuOption": {
                    "display": "inline-block",
                    "padding": "7px 14px",
                    "background": "white",
                    "border": "3px solid black",
                    "box-sizing": "border-box",
                    "color": "black",
                    "text-align": "center",
                    "overflow": "hidden",
                    "cursor": "pointer"
                },
                ".LevelEditor.minimized .EditorMenuOption:not(:first-of-type)": {
                    "display": "none"
                },
                ".LevelEditor.minimized .EditorMenuOption:first-of-type": {
                    "width": "auto"
                },
                ".LevelEditor .EditorMenuOption:hover": {
                    "opacity": ".91"
                },
                ".LevelEditor .EditorMenuOption.EditorMenuOptionHalf": {
                    "width": "50%"
                },
                ".LevelEditor .EditorMenuOption.EditorMenuOptionThird": {
                    "width": "33%"
                },
                ".LevelEditor .EditorMenuOption.EditorMenuOptionFifth": {
                    "width": "20%"
                },
                // EditorMapSettings
                ".LevelEditor .EditorMapSettingsGroup": {
                    "padding-left": "7px"
                },
                ".LevelEditor .EditorMapSettingsSubGroup": {
                    "padding-left": "14px"
                },
                ".LevelEditor.minimized .EditorMapSettings": {
                    "opacity": "0"
                }
            };
        };
        return LevelEditr;
    })();
    LevelEditr_1.LevelEditr = LevelEditr;
})(LevelEditr || (LevelEditr = {}));
