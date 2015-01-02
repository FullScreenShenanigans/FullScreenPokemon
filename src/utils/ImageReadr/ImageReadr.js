document.onreadystatechange = (function (settings) {
    "use strict";
    
    var PixelRender,
    
        currentPalette;
    
    
    /* Palettes
    */
    
    /**
     * 
     */
    var initializePalettes = function (palettes, backgroundImage, defaultPalette) {
        var section = document.getElementById("palettes"),
            name, element, chosen;

        section.appendChild(initializePaletteUploader());

        for (name in palettes) {
            element = initializePalette(name, palettes[name]);
            section.appendChild(element);

            if (name === defaultPalette) {
                chosen = element;
            }
        }

        chosen.onclick();
    };
    
    /**
     * 
     */
    var initializePalette = function (name, palette) {
        var surround = document.createElement("div"),
            label = document.createElement("h4"),
            container = document.createElement("div"),
            color, boxOut, boxIn, i;
        
        surround.className = "palette";
        label.className = "palette-label";
        container.className = "palette-container";
        
        surround.onclick = choosePalette.bind(undefined, surround, name, palette);
        
        label.textContent = "Palette: " + name;
        
        for (i = 0; i < palette.length; i += 1) {
            color = palette[i];
            
            boxOut = document.createElement("div");
            boxOut.className = "palette-box";
            
            boxIn = document.createElement("div");
            boxIn.className = "palette-box-in";
            boxIn.style.background = "rgba(" + color.join(",") + ")";
            
            boxOut.appendChild(boxIn);
            container.appendChild(boxOut);
        }
        
        surround.appendChild(label);
        surround.appendChild(container);
        
        return surround;
    };

    /**
     * 
     */
    var initializePaletteUploader = function () {
        var surround = document.createElement("div"),
            label = document.createElement("h4");
        
        surround.className = "palette palette-uploader";
        label.className = "palette-label";

        label.textContent = "Drag or upload an image here to generate a palette.";

        initializeClickInput(surround);
        initializeDragInput(surround);

        surround.children[0].workerCallback = workerPaletteUploaderStart;

        surround.appendChild(label);

        return surround;
    };
    
    /**
     * 
     */
    var choosePalette = function (element, name, palette, event) {
        var elements = element.parentNode.children,
            i;
        
        for (i = 0; i < elements.length; i += 1) {
            elements[i].className = "palette"
        }
        
        element.className = "palette palette-selected";
        
        PixelRender = new PixelRendr({
            "paletteDefault": palette
        });
        
        currentPalette = name;
    };
    
    
    /* Input
    */
    
    /**
     * 
     */
    var initializeInput = function (selector) {
        var input = document.querySelector(selector);
        
        initializeClickInput(input);
        initializeDragInput(input);
    };
    
    /**
     * 
     */
    var initializeClickInput = function (input) {
        var dummy = document.createElement("input");
        
        dummy.type = "file";
        dummy.multiple = "multiple";
        dummy.onchange = handleFileDrop.bind(undefined, dummy);
        
        input.addEventListener("click", function () {
            dummy.click();
        });
        
        input.appendChild(dummy);
    };
    
    /**
     * 
     */
    var initializeDragInput = function (input) {
        input.ondragenter = handleFileDragEnter.bind(undefined, input);
        input.ondragover = handleFileDragOver.bind(undefined, input);
        input.ondragleave = input.ondragend = handleFileDragLeave.bind(undefined, input);
        input.ondrop = handleFileDrop.bind(undefined, input);
    };
    
    /**
     * 
     */
    var handleFileDragEnter = function (input, event) {
        if (event.dataTransfer) {
            event.dataTransfer.dropEffect = "copy"
        }
        input.className += " hovering";
    };
    
    /**
     * 
     */
    var handleFileDragOver = function (input, event) {
        event.preventDefault();
        return false;
    };
    
    /**
     * 
     */
    var handleFileDragLeave = function (input, event) {
        if (event.dataTransfer) {
            event.dataTransfer.dropEffect = "none"
        }
        input.className = input.className.replace(" hovering", "");
    };
    
    /**
     * 
     * 
     * @remarks input.files is when the input[type=file] is the source, while
     *          event.dataTransfer.files is for drag-and-drop.
     */
    var handleFileDrop = (function (allowedFiles, output, input, event) {
        var files = input.files || event.dataTransfer.files,
            elements = [],
            file, type, element, i;
        
        handleFileDragLeave(input, event);
        
        event.preventDefault();
        event.stopPropagation();
        
        for (i = 0; i < files.length; i += 1) {
            file = files[i];
            type = file.type.split("/")[1];
            
            if (!allowedFiles.hasOwnProperty(type)) {
                element = document.createElement("div");
                element.className = "output output-failed";
                element.textContent = "'" + file.name + "' is either a folder or has a non-image type...";
                elements.push(element);
                continue;
            }
            
            elements.push(createWorkerElement(files[i], event.target));
        }
        
        for (i = 0; i < elements.length; i += 1) {
            output.insertBefore(elements[i], output.firstElementChild);
        }
    }).bind(
        undefined, 
        settings.allowedFiles, 
        document.querySelector(settings.outputSelector)
    );
    
    /**
     * 
     */
    var createWorkerElement = function (file, target) {
        var element = document.createElement("div"),
            reader = new FileReader();

        element.workerCallback = target.workerCallback;
        element.className = "output output-uploading";
        element.setAttribute("palette", currentPalette);
        element.innerText = "Uploading '" + file.name + "'...";
        
        reader.onprogress = workerUpdateProgress.bind(undefined, file, element);
        reader.onloadend = workerTryStartWorking.bind(undefined, file, element);
        reader.readAsDataURL(file);
        
        return element;
    };
    
    /**
     * 
     */
    var workerUpdateProgress = function (file, element, event) {
        var percent;
        
        if (!event.lengthComputable) {
            return;
        }
        
        percent = Math.round((event.loaded / event.total) * 100);
        
        if (percent > 100) {
            percent = 100;
        }
        
        element.innerText = "Uploading '" + file.name + "' (" + percent + "%)...";
    };
    
    /**
     * 
     * 
     * 
     */
    var workerTryStartWorking = function (file, element, event) {
        var result = event.currentTarget.result;
        
        if (element.workerCallback) {
            element.workerCallback(result, file, element, event);
        } else {
            workerTryStartWorkingDefault(result, file, element, event);
        }
    };

    /**
     * 
     */
    var workerTryStartWorkingDefault = function (result, file, element, event) {
        if (result.length > 100000) {
            workerCannotStartWorking(result, file, element, event);
        } else {
            workerStartWorking(result, file, element, event);
        }
    };
    
    /**
     * 
     */
    var workerCannotStartWorking = function (result, file, element, event) {
        element.innerText = "'" + file.name + "' is too big! Use a smaller file.";
        element.className = "output output-failed";
    };
    
    /**
     * 
     */
    var workerStartWorking = function (result, file, element, event) {
        var displayBase64 = document.createElement("input");

        element.className = "output output-working";
        element.innerText = "Working on " + file.name + "...";

        displayBase64.spellcheck = false;
        displayBase64.className = "selectable";
        displayBase64.type = "text";
        displayBase64.setAttribute("value", result);

        element.appendChild(document.createElement("br"));
        element.appendChild(displayBase64);

        parseBase64Image(file, result, workerFinishRender.bind(undefined, file, element));
    };
    
    /**
     * 
     */
    var parseBase64Image = function (file, string, callback) {
        var image = document.createElement("img");
        image.onload = PixelRender.encode.bind(undefined, image, callback);
        image.src = string;
    };
    
    /**
     * 
     */
    var workerFinishRender = function (file, element, result, image) {
        var displayResult = document.createElement("input");
        
        displayResult.spellcheck = false;
        displayResult.className = "selectable";
        displayResult.type = "text";
        displayResult.setAttribute("value", result);
        
        element.firstChild.textContent = "Finished '" + file.name + "' ('" + element.getAttribute("palette") + "' palette).";
        element.className = "output output-complete";
        element.style.backgroundImage = "url('" + image.src + "')";
        
        element.appendChild(displayResult);
    };

    /**
     * 
     */
    var workerPaletteUploaderStart = function (result, file, element, event) {
        var image = document.createElement("img");
        image.onload = workerPaletteCollect.bind(
            undefined, image, file, element, result
        );
        image.src = result;

        element.className = "output output-working";
        element.innerText = "Working on " + file.name + "...";
    };

    /**
     * 
     */
    var workerPaletteCollect = function (image, file, element, src, event) {
        var canvas = document.createElement("canvas"),
            context = canvas.getContext("2d"),
            data;

        canvas.width = image.width;
        canvas.height = image.height;

        context.drawImage(image, 0, 0);

        data = context.getImageData(0, 0, canvas.width, canvas.height).data;

        workerPaletteFinish(
            PixelRender.generatePaletteFromRawData(data, true, true), file, element, src
        );
    };

    /**
     * 
     */
    var workerPaletteFinish = function (colors, file, element, src) {
        if (colors.length > 999) {
            element.className = "output output-failed";
            element.innerText = "Too many colors (>999) in " + file.name + " palette.";
        }

        element.className = "output output-complete";
        element.innerText = "Created " + file.name + " palette (" + colors.length + " colors).";

        var chooser = initializePalette(file.name, colors),
            displayResult = document.createElement("input");

        chooser.style.backgroundImage = "url('" + src + "')";

        displayResult.spellcheck = false;
        displayResult.className = "selectable";
        displayResult.type = "text";
        displayResult.setAttribute("value", "[ [" + colors.join("], [") + "] ]");

        document.querySelector("#palettes").appendChild(chooser);

        element.appendChild(displayResult);

        chooser.click();
    };
    

    /**
     * 
     */
    return function (event) {
        if (event.target.readyState != "complete") {
            return;
        }
        
        initializePalettes(
            settings.palettes,
            settings.paletteBackgroundImage,
            settings.paletteDefault
        );
        
        initializeInput(settings.inputSelector);
    };
})({
    "allowedFiles": {
        "gif": true,
        "png": true,
        "jpeg": true,
        "jpg": true
    },
    "inputSelector": "#input",
    "outputSelector": "#output",
    "paletteDefault": "Mario",
    "palettes": {
        "Black & White": [
          [0,0,0,0],
          [255,255,255,255],
          [0,0,0,255]
        ],
        "GameBoy": [
          [0,0,0,0],
          [255,255,255,255],
          [0,0,0,255],
          [199,199,192,255],
          [128,128,128,255]
        ],
        "Mario": [
            [0,0,0,0],
            // Grayscales (1-4)
            [255,255,255,255],
            [0,0,0,255],
            [188,188,188,255],
            [116,116,116,255],
            // Reds & Browns (5-11)
            [252,216,168,255],
            [252,152,56,255],
            [252,116,180,255],
            [216,40,0,255],
            [200,76,12,255],
            [136,112,0,255],
            [124,7,0,255],
            // Greens (12-14, and 21)
            [168,250,188,255],
            [128,208,16,255],
            [0,168,0,255],
            // Blues (15-20)
            [24,60,92,255],
            [0,128,136,255],
            [32,56,236,255],
            [156,252,240,255],
            [60,188,252,255],
            [92,148,252,255],
            // Green (21) for Luigi
            [0,130,0,255],
            // Pinkish tan (22) for large decorative text
            [252, 188, 176,255]
        ]
    }
});