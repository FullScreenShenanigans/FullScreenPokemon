/**
 * 
 */
function UserWrappr(settings) {
    if (!this || this === window) {
    "use strict";
        return new UserWrappr(settings);
    }
    var self = this,
        
        GameStartrConstructor,
        
        StatsHolder,
        
        GameStarter,
        
        helpSettings,
        
        globalName,
        
        globalNameAlias,
        
        generators,
        
        allPossibleKeys,
        
        size,
        
        sizes,
        
        currentSize,
        
        isFullScreen,
        
        documentElement = document.documentElement,
        
        requestFullScreen = (
            documentElement.requestFullScreen
            || documentElement.webkitRequestFullScreen
            || documentElement.mozRequestFullScreen
            || documentElement.msRequestFullscreen
            || function () {}
        ).bind(documentElement),
        
        cancelFullScreen = (
            document.cancelFullScreen
            || document.webkitCancelFullScreen
            || document.mozCancelFullScreen
            || document.msCancelFullscreen
            || function () {}
        ).bind(document);
    
    /**
     * 
     */
    self.reset = function (settings) {
        var customs = settings.customs || {};
        GameStartrConstructor = (
            settings.GameStartrConstructor || GameStartrConstructor
        );
        
        helpSettings = settings.helpSettings;
        globalName = settings.globalName;
        globalNameAlias = helpSettings.globalNameAlias;
        
        isFullScreen = false;
        sizes = settings.sizes;
        currentSize = settings.currentSize || settings.sizeDefault;
        
        GameStartrConstructor.prototype.proliferate(
            customs,
            settings.sizes[customs.size || currentSize],
            true
        );
        
        generators = {
            "generatorOptionsButtons": generatorOptionsButtons,
            "generatorOptionsTable": generatorOptionsTable,
            "generatorLevelEditor": generatorLevelEditor,
            "generatorMapsGrid": generatorMapsGrid
        };
        
        allPossibleKeys = settings.allPossibleKeys ||  [
            "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m",
            "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z",
            "up", "right", "down", "left", "space", "shift", "ctrl"
        ];
        
        self.resetGameStarter(customs);
        
        if (GameStarter.settings.ui.styleSheet) {
            GameStarter.addPageStyles(GameStarter.settings.ui.styleSheet);
        }
        
        resetPageVisibilityHandlers();
    };
    
    /**
     * 
     */
    self.resetGameStarter = function (customs) {
        loadGameStarter(fixCustoms(customs || {}));
        loadControls(settings);
        
        window[settings.globalName || "GameStarter"] = GameStarter;
        GameStarter.UserWrapper = self;
    }
    
    
    /* Simple gets
    */
    
    /**
     * 
     */
    self.getGameStarter = function () {
        return GameStarter;
    };
    
    /**
     * 
     */
    self.getStatsHolder = function () {
        return StatsHolder;
    };
    
    
    /* Page visibility
    */
    
    /**
     * 
     */
    function resetPageVisibilityHandlers() {
        document.addEventListener("visibilitychange", handleVisibilityChange);
    }
    
    /**
     * 
     */
    function handleVisibilityChange(event) {
        switch (document.visibilityState) {
            case "hidden": 
                onPageHidden();
                return;
            case "visible":
                onPageVisible();
                return;
        }
    }
    
    /**
     * 
     */
    function onPageHidden() {
        if (!GameStarter.GamesRunner.getPaused()) {
            GameStarter.MapScreener.pageHidden = true;
            GameStarter.GamesRunner.pause();
        }
    }
    
    /**
     * 
     */
    function onPageVisible() {
        if (GameStarter.MapScreener.pageHidden) {
            GameStarter.MapScreener.pageHidden = false;
            GameStarter.GamesRunner.play();
        }
    }
    
    
    /* Help dialog
    */
    
    /**
     * 
     */
    self.displayHelpMenu = function () {
        helpSettings.openings.forEach(logHelpString);
    };
    
    /**
     * 
     */
    self.displayHelpOptions = function () {
        logHelpString(
            "To focus on a group, enter `"
            + globalName 
            + ".UserWrapper.displayHelpOption(<group-name>);`"
        );
        
        Object.keys(helpSettings.options).forEach(self.displayHelpGroupSummary);
        
        logHelpString(
            "\nTo focus on a group, enter `"
            + globalName 
            + ".UserWrapper.displayHelpOption(<group-name>);`"
        );
    };
    
    /**
     * 
     */
    self.displayHelpGroupSummary = function (optionName) {
        var actions = helpSettings.options[optionName],
            strings = [],
            maxTitleLength = 0,
            action, i;
        
        console.log("\n" + optionName);
        
        for (i = 0; i < actions.length; i += 1) {
            maxTitleLength = Math.max(
                maxTitleLength, 
                filterHelpString(actions[i].title).length
            );
        }
        
        for (i = 0; i < actions.length; i += 1) {
            action = actions[i];
            console.log(
                padStringRight(filterHelpString(action.title), maxTitleLength)
                + " ... " + action.description
            );
        }
    };
    
    /**
     * 
     */
    self.displayHelpOption = function (optionName) {
        var actions = helpSettings.options[optionName],
            action, maxExampleLength, example, i, j;

        for (i = 0; i < actions.length; i += 1) {
            action = actions[i];
            maxExampleLength = 0;
            logHelpString(action.title);
            
            for (j = 0; j < action.examples.length; j += 1) {
                example = action.examples[j];
                maxExampleLength = Math.max(
                    maxExampleLength,
                    filterHelpString("    " + example.code).length
                );
            }
            
            for (j = 0; j < action.examples.length; j += 1) {
                example = action.examples[j];
                logHelpString(
                    padStringRight(
                        filterHelpString("    " + example.code), 
                        maxExampleLength
                    )
                    + "  // " + example.comment
                );
            }
            
            console.log("\n");
        }
    };
    
    /**
     * 
     */
    function logHelpString(string) {
        console.log(filterHelpString(string));
    }
    
    /**
     * 
     */
    function filterHelpString(string) {
        return string.replace(new RegExp(globalNameAlias, "g"), globalName);
    }
    
    /**
     * 
     */
    function padStringRight(string, length) {
        var diff = 1 + length - string.length;
        
        if (diff <= 0) {
            return string;
        }
        
        return string + Array.call(Array, diff).join(' ');
    }
    
    
    /* Control section loaders
    */
    
    /**
     * 
     */
    var loadGameStarter = function (customs) {
        var section = document.getElementById("game");
        
        GameStarter = new GameStartrConstructor(customs);
        
        section.textContent = "";
        section.appendChild(GameStarter.container);
        
        GameStarter.proliferate(document.body, {
            "onkeydown": GameStarter.InputWriter.makePipe("onkeydown", "keyCode"),
            "onkeyup": GameStarter.InputWriter.makePipe("onkeyup", "keyCode")
        });
        
        GameStarter.proliferate(section, {
            "onmousedown": GameStarter.InputWriter.makePipe("onmousedown", "which", true),
            "oncontextmenu": GameStarter.InputWriter.makePipe("oncontextmenu", null, true)
        });

        GameStarter.gameStart();
    };
    
    /**
     * 
     */
    var loadControls = function (settings) {
        var section = document.getElementById("controls"),
            schemas = settings.schemas,
            length = schemas.length,
            i;
        
        StatsHolder = new StatsHoldr({
            "prefix": globalName + "::UserWrapper::StatsHolder",
            "proliferate": GameStarter.proliferate,
            "createElement": GameStarter.createElement
        });
        
        section.textContent = "";
        section.className = "length-" + length;
        
        for (i = 0; i < length; i += 1) {
            section.appendChild(loadControlDiv(schemas[i]));
        }
    };
    
    /** 
     * 
     */
    var loadControlDiv = function (schema) {
        var control = document.createElement("div"),
            heading = document.createElement("h4"),
            inner = document.createElement("div");
        
        control.className = "control";
        control.id = "control-" + schema.title;
        
        heading.textContent = schema.title;
        
        inner.className = "control-inner";
        inner.appendChild(generators["generator" + schema.generator](schema));
        
        control.appendChild(heading);
        control.appendChild(inner);
        
        // Touch events often propogate to children before the control div has
        // been fully extended. Setting the "active" attribute fixes that.
        control.onmouseover = setTimeout.bind(undefined, function () {
            control.setAttribute("active", "on");
        }, 35);
        
        control.onmouseout = function () {
            control.setAttribute("active", "off");
        };
        
        return control;
    };
    
    
    /* Generator functions
    */
    
    /**
     * 
     */
    var generatorOptionsButtons = function (schema) {
        var output = document.createElement("div"),
            options = schema.options instanceof Function 
                ? schema.options.call(self, GameStarter)
                : schema.options,
            optionKeys = Object.keys(options),
            keyActive = schema.keyActive || "active",
            classNameStart = "select-option options-button-option",
            option, element, i;
    
        function getParentControlDiv(element) {
            if (element.className === "control") {
                return element;
            } else if (!element.parentNode) {
                return undefined;
            } 
            return getParentControlDiv(element.parentNode);
        }
        
        output.className = "select-options select-options-buttons";
        
        for (i = 0; i < optionKeys.length; i += 1) {
            option = options[optionKeys[i]];
            
            element = document.createElement("div");
            element.className = classNameStart;
            element.textContent = optionKeys[i];
            
            element.onclick = function (schema, element) {
                if (getParentControlDiv(element).getAttribute("active") !== "on") {
                    return;
                }
                schema.callback.call(self, GameStarter, schema, element);
                
                if (element.getAttribute("option-enabled") == "true") {
                    element.setAttribute("option-enabled", false);
                    element.className = classNameStart + " option-disabled";
                } else {
                    element.setAttribute("option-enabled", true);
                    element.className = classNameStart + " option-enabled";
               }
            }.bind(undefined, schema, element);
            
            if (option[keyActive]) {
                element.className += " option-enabled";
                element.setAttribute("option-enabled", true);
            } else if (schema.assumeInactive) {
                element.className += " option-disabled";
                element.setAttribute("option-enabled", false);
            } else {
                element.setAttribute("option-enabled", true);
            }
            
            output.appendChild(element);
        }
        
        return output;
    }
    
    /**
     * 
     */
    var generatorOptionsTable = (function () {
        function setBooleanInput(input, details, schema) {
            var status = details.source.call(self, GameStarter) ? "on" : "off",
                statusString = status === "on" ? "enabled" : "disabled";
            
            input.className = "select-option options-button-option option-" + statusString;
            input.textContent = status;
            
            input.onclick = function () {
                input.setValue(newStatus = input.textContent === "off");
            };
            
            input.setValue = function (newStatus) {
                if (newStatus.constructor === String) {
                    if (newStatus === "false" || newStatus === "off") {
                        newStatus = false;
                    } else if(newStatus === "true" || newStatus === "on") {
                        newStatus = true;
                    }
                }
                
                if (newStatus) {
                    details.enable.call(self, GameStarter);
                    input.textContent = "on";
                    input.className = input.className.replace("disabled", "enabled");
                } else {
                    details.disable.call(self, GameStarter);
                    input.textContent = "off";
                    input.className = input.className.replace("enabled", "disabled");
                }
                
                if (details.storeLocally) {
                    storeLocalStorageValue(input, newStatus.toString());
                }
            };
            
            return input;
        }
        
        function setKeyInput(input, details, schema) {
            var values = details.source.call(self, GameStarter),
                children = [],
                child, i, j;
            
            for (i = 0; i < values.length; i += 1) {
                child = document.createElement("select");
                child.className = "options-key-option";
                
                for (j = 0; j < allPossibleKeys.length; j += 1) {
                    child.appendChild(new Option(allPossibleKeys[j]));
                }
                child.value = child.valueOld = values[i].toLowerCase();
                
                child.onchange = (function (child) {
                    details.callback.call(
                        self, GameStarter, child.valueOld, child.value
                    );
                    if (details.storeLocally) {
                        storeLocalStorageValue(child, child.value);
                    }
                }).bind(undefined, child);
                
                children.push(child);
                input.appendChild(child);
            }
            
            return children;
        }
        
        function setNumberInput(input, details, schema) {
            var child = document.createElement("input");
            
            child.type = "number";
            child.value = Number(details.source.call(self, GameStarter));
            child.min = details.minimum || 0;
            child.max = details.maximum || Math.max(details.minimum + 10, 10);
            
            child.onchange = child.oninput = function () {
                if (child.checkValidity()) {
                    details.update.call(self, GameStarter, child.value);
                }
                if (details.storeLocally) {
                    storeLocalStorageValue(child, child.value);
                }
            };
            
            input.appendChild(child);
            
            return child;
        }
        
        function setSelectInput(input, details, schema) {
            var child = document.createElement("select"),
                options = details.options(),
                i;
            
            for (i = 0; i < options.length; i += 1) {
                child.appendChild(new Option(options[i]));
            }
            
            child.value = details.source.call(self, GameStarter);
            
            child.onchange = function () {
                details.update.call(self, GameStarter, child.value);
                child.blur();
                
                if (details.storeLocally) {
                    storeLocalStorageValue(child, child.value);
                }
            };
            
            input.appendChild(child);
            
            return child;
        }
        
        var setScreenSizeInput = (function () {
            var detailsOptions = function () {
                    return Object.keys(sizes)
                },
                detailsSource = function () {
                    return currentSize;
                },
                detailsUpdate = function (GameStarter, value) {
                    if (value === currentSize) {
                        return;
                    }
                    
                    var sizing = sizes[value],
                        customs = fixCustoms(sizing);
                    
                    currentSize = value;
                    
                    if (sizing.full) {
                        requestFullScreen();
                        isFullScreen = true;
                    } else if(isFullScreen) {
                        cancelFullScreen();
                        isFullScreen = false;
                    }
                    
                    GameStarter.container.parentNode.removeChild(GameStarter.container);
                    self.resetGameStarter(customs);
                };
            
            return function (input, details, schema) {
                var child;
                
                details.options = detailsOptions;
                details.source = detailsSource;
                details.update = detailsUpdate;
                child = setSelectInput(input, details, schema);
                
                return child;
            };
        })();
        
        var optionTypes = {
            "Boolean": setBooleanInput,
            "Keys": setKeyInput,
            "Number": setNumberInput,
            "Select": setSelectInput,
            "ScreenSize": setScreenSizeInput
        };

        return function (schema) {
            var output = document.createElement("div"),
                table = document.createElement("table"),
                details, row, label, input, child,
                i;
            
            output.className = "select-options select-options-table";
            
            if (schema.options) {
                for (i = 0; i < schema.options.length; i += 1) {
                    row = document.createElement("tr");
                    label = document.createElement("td");
                    input = document.createElement("td");
                    
                    details = schema.options[i],
                    
                    label.className = "options-label-" + details.type;
                    label.textContent = details.title;
                    
                    input.className = "options-cell-" + details.type;
                    
                    row.appendChild(label);
                    row.appendChild(input);
                    
                    child = optionTypes[schema.options[i].type](input, details, schema);
                    if (details.storeLocally) {
                        ensureLocalStorageValue(child, details, schema);
                    }
                    
                    table.appendChild(row);
                }
            }
            
            output.appendChild(table);
            
            if (schema.actions) {
                for (i = 0; i < schema.actions.length; i += 1) {
                    row = document.createElement("div");
                    
                    details = schema.actions[i];
                    
                    row.className = "select-option options-button-option";
                    row.textContent = details.title;
                    row.onclick = details.action.bind(self, GameStarter);
                    
                    output.appendChild(row);
                }
            }
            
            return output;
        };
    })();
    
    /**
     * 
     */
    var generatorLevelEditor = (function () {
        function createUploaderDiv() {
            var uploader = document.createElement("div"),
                input = document.createElement("input");
            
            uploader.className = "select-option select-option-large options-button-option";
            uploader.textContent = "Click to upload and continue your editor files!";
            uploader.setAttribute("textOld", uploader.textContent);
            
            input.type = "file";
            input.className = "select-upload-input";
            input.onchange = handleFileDrop.bind(undefined, input, uploader);
            
            uploader.ondragenter = handleFileDragEnter.bind(undefined, uploader);
            uploader.ondragover = handleFileDragOver.bind(undefined, uploader);
            uploader.ondragleave = input.ondragend = handleFileDragLeave.bind(undefined, uploader);
            uploader.ondrop = handleFileDrop.bind(undefined, input, uploader);
            uploader.onclick = input.click.bind(input);
            
            uploader.appendChild(input);
            
            return uploader;
        };
        
        function handleFileDragEnter(uploader, event) {
            if (event.dataTransfer) {
                event.dataTransfer.dropEFfect = "copy";
            }
            uploader.className += " hovering";
        }
        
        function handleFileDragOver(uploader, event) {
            event.preventDefault();
            return false;
        }
        
        function handleFileDragLeave(uploader, event) {
            if (event.dataTransfer) {
                event.dataTransfer.dropEffect = "none"
            }
            uploader.className = uploader.className.replace(" hovering", "");
        }
        
        function handleFileDrop(input, uploader, event) {
            var files = input.files || event.dataTransfer.files,
                file = files[0],
                reader = new FileReader();
            
            handleFileDragLeave(input, event);
            event.preventDefault();
            event.stopPropagation();
            
            reader.onprogress = handleFileUploadProgress.bind(undefined, file, uploader);
            reader.onloadend = handleFileUploadCompletion.bind(undefined, file, uploader);
            
            reader.readAsText(file);
        }
        
        function handleFileUploadProgress(file, uploader, event) {
            var percent;
            
            if (!event.lengthComputable) {
                return;
            }
            
            percent = Math.round((event.loaded / event.total) * 100);
            
            if (percent > 100) {
                percent = 100;
            }
            
            uploader.innerText = "Uploading '" + file.name + "' (" + percent + "%)...";
        }
        
        function handleFileUploadCompletion(file, uploader, event) {
            GameStarter.LevelEditor.handleUploadCompletion(event);
            uploader.innerText = uploader.getAttribute("textOld");
        }
        
        return function (schema) {
            var output = document.createElement("div"),
                title = document.createElement("div"),
                button = document.createElement("div"),
                between = document.createElement("div"),
                uploader = createUploaderDiv();
            
            output.className = "select-options select-options-level-editor";
            
            title.className = "select-option-title";
            title.textContent = "Create your own custom levels:";
            
            button.className = "select-option select-option-large options-button-option";
            button.innerHTML = "Start the <br /> Level Editor!";
            button.onclick = function () {
                GameStarter.LevelEditor.enable();
            };
            
            between.className = "select-option-title";
            between.innerHTML = "<em>- or -</em><br />";
            
            output.appendChild(title);
            output.appendChild(button);
            output.appendChild(between);
            output.appendChild(uploader);
            
            return output;
        }
    })();
    
    /**
     * 
     */
    var generatorMapsGrid = function (schema) {
        var output = document.createElement("div"),
            rangeX = schema.rangeX,
            rangeY = schema.rangeY,
            element,
            i, j;
        
        output.className = "select-options select-options-maps-grid";
        
        if (rangeX && rangeY) {
            var table = document.createElement("table"),
                row;
                
            function getParentControlDiv(element) {
                if (element.className === "control") {
                    return element;
                } else if (!element.parentNode) {
                    return undefined;
                } 
                return getParentControlDiv(element.parentNode);
            }    
            
            for (i = rangeY[0]; i <= rangeY[1]; i += 1) {
                row = document.createElement("tr");
                row.className = "maps-grid-row";
                
                for (j = rangeX[0]; j <= rangeX[1]; j += 1) {
                    element = document.createElement("td");
                    element.className = "select-option maps-grid-option maps-grid-option-range";
                    element.textContent = i + "-" + j;
                    element.onclick = (function (callback) {
                        if (getParentControlDiv(element).getAttribute("active") !== "on") {
                            return;
                        }
                        callback();
                    }).bind(undefined, schema.callback.bind(self, GameStarter, schema, element));
                    row.appendChild(element);
                }
                
                table.appendChild(row);
            }
            
            output.appendChild(table);
        }
        
        if (schema.extras) {
            var extra;
            for (i in schema.extras) {
                extra = schema.extras[i];
                element = document.createElement("div");
                
                element.className = "select-option maps-grid-option maps-grid-option-extra";
                element.textContent = extra.title;
                element.setAttribute("value", extra.title);
                element.onclick = extra.callback.bind(self, GameStarter, schema, element);
                output.appendChild(element);
                
                if (extra.extraElements) {
                    for (j = 0; j < extra.extraElements.length; j += 1) {
                        output.appendChild(GameStarter.createElement.apply(
                            GameStarter,
                            extra.extraElements[j]
                        ));
                    }
                }
            }
        }
        
        return output;
    };
    
    
    /* Utilities
    */
    
    /**
     * 
     */
    function ensureLocalStorageValue(child, details, schema) {
        if (child.constructor === Array) {
            ensureLocalStorageValues(child, details, schema);
            return;
        }
        
        var key = schema.title + "::" + details.title,
            valueDefault = details.source.call(self, GameStarter).toString(),
            value;
        
        child.setAttribute("localStorageKey", key);
        StatsHolder.addStatistic(key, {
            "storeLocally": true,
            "valueDefault": valueDefault
        });
        
        value = StatsHolder.get(key);
        if (value !== "" && value !== child.value) {
            child.value = value;
                
            if (child.setValue) {
                child.setValue(value);
            } else if (child.onchange) {
                child.onchange();
            } else if (child.onclick) {
                child.onclick();
            }
        }
    }
    
    /**
     * 
     */
    function ensureLocalStorageValues(children, details, schema) {
        var keyGeneral = schema.title + "::" + details.title,
            values = details.source.call(self, GameStarter),
            settings = {
                "storeLocally": true
            },
            key, child, value, i;
        
        for (i = 0; i < children.length; i += 1) {
            key = keyGeneral + "::" + i;
            child = children[i];
            child.setAttribute("localStorageKey", key);
            
            StatsHolder.addStatistic(key, {
                "storeLocally": true,
                "valueDefault": values[i]
            });
            
            value = StatsHolder.get(key);
            if (value !== "" && value !== child.value) {
                child.value = value;
                
                if (child.onchange) {
                    child.onchange();
                } else if (child.onclick) {
                    child.onclick();
                }
            }
        }
    }
    
    /**
     * 
     */
    function storeLocalStorageValue(child, value) {
        var key = child.getAttribute("localStorageKey");
        if (key) {
            StatsHolder.set(key, value);
        }
    }
    
    
    /**
     * 
     */
    function fixCustoms(customsRaw) {
        var customs = GameStartrConstructor.prototype.proliferate({}, customsRaw);
        
        if (!isFinite(customs.width)) {
            customs.width = document.body.clientWidth;
        }
        if (!isFinite(customs.height)) {
            if (customs.full) {
                customs.height = screen.height;
            } else if(isFullScreen) {
                // Guess for browser window...
                customs.height = window.innerHeight - 140;
            } else {
                customs.height = window.innerHeight;
            }
            // 49px from header, 35px from menus
            customs.height -= 84;
        }
        
        return customs;
    }
    
    
    self.reset(settings || {});
}