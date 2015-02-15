(function () {
    FullScreenPokemon.prototype.settings.objects = {
        "onMake": "onMake",
        "indexMap": ["width", "height"],
        "doPropertiesFull": true,
        "inheritance": {
            "Quadrant": {},
            "Map": {},
            "Area": {},
            "Location": {},
            "Thing": {
                "Character": {
                    "Fatty": {},
                    "Lady": {},
                    "Mother": {},
                    "Player": {},
                    "Pokeball": {},
                    "RivalMother": {}
                },
                "Solid": {
                    "AsianScroll": {},
                    "BedSingle": {},
                    "Bookshelf": {},
                    "BuildingBase": {
                        "BuildingTopBase": {
                            "BuildingTopLeft": {},
                            "BuildingTopMiddle": {},
                            "BuildingTopRight": {}
                        },
                        "BuildingMiddleBase": {
                            "BuildingMiddleLeft": {},
                            "BuildingMiddleMiddle": {},
                            "BuildingMiddleRight": {},
                            "BuildingMiddleWindow": {}
                        },
                        "BuildingBottom": {},
                    },
                    "Cabinet": {},
                    "ComputerDesk": {},
                    "ConsoleAndController": {},
                    "FenceWide": {},
                    "FenceVertical": {},
                    "Grass": {},
                    "HouseBase": {
                        "HouseTop": {},
                    },
                    "HouseCenterLeft": {},
                    "HouseCenterMiddle": {},
                    "HouseCenterRight": {},
                    "HouseLargeBase": {
                        "HouseLargeTopLeft": {},
                        "HouseLargeTopMiddle": {},
                        "HouseLargeTopRight": {},
                        "HouseLargeCenter": {
                            "HouseLargeCenterLeft": {},
                            "HouseLargeCenterMiddle": {},
                            "HouseLargeCenterRight": {}
                        }
                    },
                    "HouseWallWhitewash": {},
                    "InvisibleWall": {},
                    "LabComputer": {},
                    "Label": {
                        "GymLabel": {},
                        "MartLabel": {},
                        "PokeLabel": {}
                    },
                    "Ledge": {},
                    "LedgeOpening": {},
                    "MountainSolidBase": {
                        "MountainRight": {},
                        "MountainTop": {},
                        "MountainTopRight": {},
                        "MountainTopLeft": {},
                        "MountainRight": {},
                        "MountainLeft": {},
                        "MountainBottom": {},
                        "MountainBottomLeft": {},
                        "MountainBottomRight": {},
                    },
                    "PlantSmall": {},
                    "PokeLabel": {},
                    "PottedPalmTree": {},
                    "Sign": {},
                    "Spawner": {},
                    "Table2x2": {},
                    "Table2x3": {},
                    "Table3x1": {},
                    "TelevisionMonitor": {},
                    "Transporter": {
                        "Door": {},
                        "HiddenTransporter": {},
                        "StairsDown": {},
                        "StairsUp": {}
                    },
                    "Tree": {},
                    "WaterEdge": {
                        "WaterEdgeTop": {},
                        "WaterEdgeRight": {},
                        "WaterEdgeBottom": {},
                        "WaterEdgeLeft": {}
                    },
                    "WindowDetector": {
                        "AreaSpawner": {}
                    }
                },
                "Scenery": {
                    "Book": {},
                    "Doormat": {},
                    "DoormatDotted": {},
                    "Flower": {},
                    "FlowerVase": {},
                    "HPBar": {},
                    "HPBarFill": {},
                    "Painting": {},
                    "Stool": {},
                    "Window": {},
                    "WindowBlinds": {},
                    "Portrait": {
                        "PlayerPortrait": {},
                        "BlainePortrait": {},
                        "BrockPortrait": {},
                        "ErikaPortrait": {},
                        "GiovanniPortrait": {},
                        "KogaPortrait": {},
                        "LtSurgePortrait": {},
                        "MistyPortrait": {},
                        "SabrinaPortrait": {},
                        "PokemonPortrait": {
                            "LandPokemon": {},
                            "WaterPokemon": {}
                        }
                    },
                    "BattleSprite": {
                        "BattleSpriteFront": {
                            "BulbasaurFront": {},
                            "IvysaurFront": {},
                            "VenusaurFront": {},
                            "CharmanderFront": {},
                            "CharmeleonFront": {},
                            "CharizardFront": {},
                            "SquirtleFront": {},
                            "WartortleFront": {},
                            "BlastoiseFront": {},
                            "CaterpieFront": {},
                            "MetapodFront": {},
                            "ButterfreeFront": {},
                            "WeedleFront": {},
                            "KakunaFront": {},
                            "BeedrillFront": {},
                            "PidgeyFront": {},
                            "PidgeottoFront": {},
                            "PidgeotFront": {},
                            "RattataFront": {},
                            "RaticateFront": {},
                            "SpearowFront": {},
                            "FearowFront": {},
                            "EkansFront": {},
                            "ArbokFront": {},
                            "PikachuFront": {},
                            "RaichuFront": {},
                            "SandshrewFront": {},
                            "SandslashFront": {},
                            "NidoranFFront": {},
                            "NidorinaFront": {},
                            "NidoqueenFront": {},
                            "NidoranMFront": {},
                            "NidorinoFront": {},
                            "NidokingFront": {},
                            "ClefairyFront": {},
                            "ClefableFront": {},
                            "VulpixFront": {},
                            "NinetalesFront": {},
                            "JigglypuffFront": {},
                            "WigglytuffFront": {},
                            "ZubatFront": {},
                            "GolbatFront": {},
                            "OddishFront": {},
                            "GloomFront": {},
                            "VileplumeFront": {},
                            "ParasFront": {},
                            "ParasectFront": {},
                            "VenonatFront": {},
                            "VenomothFront": {},
                            "DiglettFront": {},
                            "DugtrioFront": {},
                            "MeowthFront": {},
                            "PersianFront": {},
                            "PsyduckFront": {},
                            "GolduckFront": {},
                            "MankeyFront": {},
                            "PrimeapeFront": {},
                            "GrowlitheFront": {},
                            "ArcanineFront": {},
                            "PoliwagFront": {},
                            "PoliwhirlFront": {},
                            "PoliwrathFront": {},
                            "AbraFront": {},
                            "KadabraFront": {},
                            "AlakazamFront": {},
                            "MachopFront": {},
                            "MachokeFront": {},
                            "MachampFront": {},
                            "BellsproutFront": {},
                            "WeepinbellFront": {},
                            "VictreebelFront": {},
                            "TentacoolFront": {},
                            "TentacruelFront": {},
                            "GeodudeFront": {},
                            "GravelerFront": {},
                            "GolemFront": {},
                            "PonytaFront": {},
                            "RapidashFront": {},
                            "SlowpokeFront": {},
                            "SlowbroFront": {},
                            "MagnemiteFront": {},
                            "MagnetonFront": {},
                            "Farfetch'dFront": {},
                            "DoduoFront": {},
                            "DodrioFront": {},
                            "SeelFront": {},
                            "DewgongFront": {},
                            "GrimerFront": {},
                            "MukFront": {},
                            "ShellderFront": {},
                            "CloysterFront": {},
                            "GastlyFront": {},
                            "HaunterFront": {},
                            "GengarFront": {},
                            "OnixFront": {},
                            "DrowzeeFront": {},
                            "HypnoFront": {},
                            "KrabbyFront": {},
                            "KinglerFront": {},
                            "VoltorbFront": {},
                            "ElectrodeFront": {},
                            "ExeggcuteFront": {},
                            "ExeggutorFront": {},
                            "CuboneFront": {},
                            "MarowakFront": {},
                            "HitmonleeFront": {},
                            "HitmonchanFront": {},
                            "LickitungFront": {},
                            "KoffingFront": {},
                            "WeezingFront": {},
                            "RhyhornFront": {},
                            "RhydonFront": {},
                            "ChanseyFront": {},
                            "TangelaFront": {},
                            "KangaskhanFront": {},
                            "HorseaFront": {},
                            "SeadraFront": {},
                            "GoldeenFront": {},
                            "SeakingFront": {},
                            "StaryuFront": {},
                            "StarmieFront": {},
                            "Mr. MimeFront": {},
                            "ScytherFront": {},
                            "JynxFront": {},
                            "ElectabuzzFront": {},
                            "MagmarFront": {},
                            "PinsirFront": {},
                            "TaurosFront": {},
                            "MagikarpFront": {},
                            "GyaradosFront": {},
                            "LaprasFront": {},
                            "DittoFront": {},
                            "EeveeFront": {},
                            "VaporeonFront": {},
                            "JolteonFront": {},
                            "FlareonFront": {},
                            "PorygonFront": {},
                            "OmanyteFront": {},
                            "OmastarFront": {},
                            "KabutoFront": {},
                            "KabutopsFront": {},
                            "AerodactylFront": {},
                            "SnorlaxFront": {},
                            "ArticunoFront": {},
                            "ZapdosFront": {},
                            "MoltresFront": {},
                            "DratiniFront": {},
                            "DragonairFront": {},
                            "DragoniteFront": {},
                            "MewtwoFront": {},
                            "MewFront": {}
                        },
                        "BattleSpriteBack": {
                            "BulbasaurBack": {},
                            "IvysaurBack": {},
                            "VenusaurBack": {},
                            "CharmanderBack": {},
                            "CharmeleonBack": {},
                            "CharizardBack": {},
                            "SquirtleBack": {},
                            "WartortleBack": {},
                            "BlastoiseBack": {},
                            "CaterpieBack": {},
                            "MetapodBack": {},
                            "ButterfreeBack": {},
                            "WeedleBack": {},
                            "KakunaBack": {},
                            "BeedrillBack": {},
                            "PidgeyBack": {},
                            "PidgeottoBack": {},
                            "PidgeotBack": {},
                            "RattataBack": {},
                            "RaticateBack": {},
                            "SpearowBack": {},
                            "FearowBack": {},
                            "EkansBack": {},
                            "ArbokBack": {},
                            "PikachuBack": {},
                            "RaichuBack": {},
                            "SandshrewBack": {},
                            "SandslashBack": {},
                            "NidoranFBack": {},
                            "NidorinaBack": {},
                            "NidoqueenBack": {},
                            "NidoranMBack": {},
                            "NidorinoBack": {},
                            "NidokingBack": {},
                            "ClefairyBack": {},
                            "ClefableBack": {},
                            "VulpixBack": {},
                            "NinetalesBack": {},
                            "JigglypuffBack": {},
                            "WigglytuffBack": {},
                            "ZubatBack": {},
                            "GolbatBack": {},
                            "OddishBack": {},
                            "GloomBack": {},
                            "VileplumeBack": {},
                            "ParasBack": {},
                            "ParasectBack": {},
                            "VenonatBack": {},
                            "VenomothBack": {},
                            "DiglettBack": {},
                            "DugtrioBack": {},
                            "MeowthBack": {},
                            "PersianBack": {},
                            "PsyduckBack": {},
                            "GolduckBack": {},
                            "MankeyBack": {},
                            "PrimeapeBack": {},
                            "GrowlitheBack": {},
                            "ArcanineBack": {},
                            "PoliwagBack": {},
                            "PoliwhirlBack": {},
                            "PoliwrathBack": {},
                            "AbraBack": {},
                            "KadabraBack": {},
                            "AlakazamBack": {},
                            "MachopBack": {},
                            "MachokeBack": {},
                            "MachampBack": {},
                            "BellsproutBack": {},
                            "WeepinbellBack": {},
                            "VictreebelBack": {},
                            "TentacoolBack": {},
                            "TentacruelBack": {},
                            "GeodudeBack": {},
                            "GravelerBack": {},
                            "GolemBack": {},
                            "PonytaBack": {},
                            "RapidashBack": {},
                            "SlowpokeBack": {},
                            "SlowbroBack": {},
                            "MagnemiteBack": {},
                            "MagnetonBack": {},
                            "Farfetch'dBack": {},
                            "DoduoBack": {},
                            "DodrioBack": {},
                            "SeelBack": {},
                            "DewgongBack": {},
                            "GrimerBack": {},
                            "MukBack": {},
                            "ShellderBack": {},
                            "CloysterBack": {},
                            "GastlyBack": {},
                            "HaunterBack": {},
                            "GengarBack": {},
                            "OnixBack": {},
                            "DrowzeeBack": {},
                            "HypnoBack": {},
                            "KrabbyBack": {},
                            "KinglerBack": {},
                            "VoltorbBack": {},
                            "ElectrodeBack": {},
                            "ExeggcuteBack": {},
                            "ExeggutorBack": {},
                            "CuboneBack": {},
                            "MarowakBack": {},
                            "HitmonleeBack": {},
                            "HitmonchanBack": {},
                            "LickitungBack": {},
                            "KoffingBack": {},
                            "WeezingBack": {},
                            "RhyhornBack": {},
                            "RhydonBack": {},
                            "ChanseyBack": {},
                            "TangelaBack": {},
                            "KangaskhanBack": {},
                            "HorseaBack": {},
                            "SeadraBack": {},
                            "GoldeenBack": {},
                            "SeakingBack": {},
                            "StaryuBack": {},
                            "StarmieBack": {},
                            "Mr. MimeBack": {},
                            "ScytherBack": {},
                            "JynxBack": {},
                            "ElectabuzzBack": {},
                            "MagmarBack": {},
                            "PinsirBack": {},
                            "TaurosBack": {},
                            "MagikarpBack": {},
                            "GyaradosBack": {},
                            "LaprasBack": {},
                            "DittoBack": {},
                            "EeveeBack": {},
                            "VaporeonBack": {},
                            "JolteonBack": {},
                            "FlareonBack": {},
                            "PorygonBack": {},
                            "OmanyteBack": {},
                            "OmastarBack": {},
                            "KabutoBack": {},
                            "KabutopsBack": {},
                            "AerodactylBack": {},
                            "SnorlaxBack": {},
                            "ArticunoBack": {},
                            "ZapdosBack": {},
                            "MoltresBack": {},
                            "DratiniBack": {},
                            "DragonairBack": {},
                            "DragoniteBack": {},
                            "MewtwoBack": {},
                            "MewBack": {}
                        }
                    }
                },
                "Terrain": {
                    "TerrainSmall": {
                        "TerrainSmallRepeating": {
                            "WallIndoorHorizontalBands": {},
                            "WallIndoorLightWithDarkBottom": {}
                        }
                    },
                    "DirtClean": {},
                    "DirtLight": {},
                    "DirtMedium": {},
                    "DirtWhite": {},
                    "FloorLinedHorizontal": {},
                    "FloorTiledDiagonal": {},
                    "Mountain": {},
                    "Water": {}
                },
                "Text": {
                    "CharacterUpperCase": {
                        "CharA": {},
                        "CharB": {},
                        "CharC": {},
                        "CharD": {},
                        "CharE": {},
                        "CharF": {},
                        "CharG": {},
                        "CharH": {},
                        "CharI": {},
                        "CharJ": {},
                        "CharK": {},
                        "CharL": {},
                        "CharM": {},
                        "CharN": {},
                        "CharO": {},
                        "CharP": {},
                        "CharQ": {},
                        "CharR": {},
                        "CharS": {},
                        "CharT": {},
                        "CharU": {},
                        "CharV": {},
                        "CharW": {},
                        "CharX": {},
                        "CharY": {},
                        "CharZ": {},
                    },
                    "CharacterLowerCase": {
                        "Chara": {},
                        "Charb": {},
                        "Charc": {},
                        "Chard": {},
                        "Chare": {},
                        "Charf": {},
                        "Charh": {},
                        "Chari": {},
                        "Chark": {},
                        "Charl": {},
                        "Charm": {},
                        "Charn": {},
                        "Charo": {},
                        "Charr": {},
                        "Chars": {},
                        "Chart": {},
                        "Charu": {},
                        "Charv": {},
                        "Charw": {},
                        "Charx": {},
                        "Charz": {},
                        "CharacterDropped": {
                            "Charg": {},
                            "Charj": {},
                            "Charp": {},
                            "Charq": {},
                            "Chary": {}
                        }
                    },
                    "CharacterShadow": {
                        "Char0Shadow": {},
                        "Char1Shadow": {},
                        "Char2Shadow": {},
                        "Char3Shadow": {},
                        "Char4Shadow": {},
                        "Char5Shadow": {},
                        "Char6Shadow": {},
                        "Char7Shadow": {},
                        "Char8Shadow": {},
                        "Char9Shadow": {},
                    },
                    "Number": {
                        "Char0": {},
                        "Char1": {},
                        "Char2": {},
                        "Char3": {},
                        "Char4": {},
                        "Char5": {},
                        "Char6": {},
                        "Char7": {},
                        "Char8": {},
                        "Char9": {}
                    },
                    "Symbol": {
                        "CharTimes": {},
                        "CharLeftParenthesis": {},
                        "CharRightParenthesis": {},
                        "CharColon": {},
                        "CharSemicolon": {},
                        "CharLeftSquareBracket": {},
                        "CharRightSquareBracket": {},
                        "CharPoke": {},
                        "CharMon": {},
                        "CharHyphen": {},
                        "CharQuestionMark": {},
                        "CharExclamationMark": {},
                        "CharMaleSymbol": {},
                        "CharFemaleSymbol": {},
                        "CharSlash": {},
                        "CharPeriod": {},
                        "CharComma": {},
                        "CharED": {},
                        "CharApostrophe": {},
                        "ChareFancy": {},
                        "CharBall": {},
                        "CharCircle": {},
                        "CharHP": {},
                        "CharLevel": {}
                    },
                    "Arrow": {
                        "CharArrowUp": {},
                        "CharArrowRight": {},
                        "CharArrowDown": {},
                        "CharArrowLeft": {}
                    },
                    "Line": {
                        "LineDecorator": {},
                        "LineSeparatorHorizontal": {},
                    }
                },
                "Menu": {}
            }
        },
        "properties": {
            "Quadrant": {
                "tolx": 0,
                "toly": 0
            },
            "Map": {
                "initialized": false
            },
            "Area": {
                "background": "black",
                //"stretches": [
                ////{ "thing": "BackgroundFaker", "noBoundaryStretch": true } // This needs implementation.
                //],
                "onMake": FullScreenPokemon.prototype.areaProcess,
                "attributes": {
                    "invisibleWallBorders": {
                        "afters": [
                            { "thing": "InvisibleWall", "noBoundaryStretch": true },
                            { "thing": "InvisibleWall", "noBoundaryStretch": true },
                            { "thing": "InvisibleWall", "noBoundaryStretch": true },
                            { "thing": "InvisibleWall", "noBoundaryStretch": true }
                        ]
                    }
                }
            },
            "Location": {
                "entry": "Normal",
            },
            "Thing": {
                // Sizing
                "width": 8,
                "height": 8,
                // Placement
                "alive": true,
                "placed": false,
                "maxquads": 4,
                // Sprites
                "sprite": "",
                "spriteType": "neither",
                "opacity": 1,
                "offsetX": 0,
                "offsetY": 0,
                // Movements
                "movement": undefined,
                // Triggered Functions
                "onMake": FullScreenPokemon.prototype.thingProcess
            },
            "Character": {
                "groupType": "Character",
                "speed": FullScreenPokemon.unitsize / 3,
                "isWalking": false,
                "shouldWalk": false,
                "switchDirectionOnDialog": true,
                "direction": 2, // top,right,bottom,left is 0,1,2,3
                "offsetY": FullScreenPokemon.unitsize * -2,
                "onWalkingStart": FullScreenPokemon.prototype.animateCharacterStartWalking,
                "onWalkingStop": FullScreenPokemon.prototype.animateCharacterStopWalking,
                "attributes": {
                    "roaming": {
                        "onThingAdd": FullScreenPokemon.prototype.spawnCharacterRoaming
                    }
                }
            },
            "Mother": {
                "directionPreferred": 3
            },
            "Player": {
                "id": "player",
                "player": true,
                "canKeyWalking": true,
                "direction": 2,
                "speed": FullScreenPokemon.unitsize / 2,
                "onWalkingStart": FullScreenPokemon.prototype.animatePlayerStartWalking,
                "onWalkingStop": FullScreenPokemon.prototype.animatePlayerStopWalking,
                "getKeys": function () {
                    return {
                        "0": false,
                        "1": false,
                        "2": false,
                        "3": false,
                        "a": false,
                        "b": false
                    };
                }
            },
            "Solid": {
                "groupType": "Solid",
                "repeat": true
            },
            "BedSingle": [8, 16],
            "Bookshelf": {
                "width": 8,
                "height": 16,
                "dialogDirections": true,
                "dialog": ["", "", "Crammed full of %%%%%%%POKEMON%%%%%%% books!", ""]
            },
            "BuildingBase": [4, 4],
            "BuildingTopBase": {
                "height": 16,
                "spriteheight": 4
            },
            "BuildingMiddleBase": {
                "height": 8,
                "spriteheight": 4
            },
            "BuildingBottom": {
                "height": 4
            },
            "Cabinet": [8, 16],
            "ComputerDesk": [8, 16],
            "ConsoleController": [8, 5],
            "FenceVertical": [4, 8],
            "Grass": {
                "nocollide": true
            },
            "HouseBase": {
                "width": 32,
                "height": 8,
                "spritewidth": 16,
                "spriteheight": 16
            },
            "HouseTop": {
                "width": 32,
                "height": 16,
                "spritewidth": 16
            },
            "HouseLargeBase": {
                "width": 48,
                "height": 20,
                "spritewidth": 20
            },
            "HouseLargeTopLeft": {
                "width": 8,
                "spritewidth": 8
            },
            "HouseLargeTopMiddle": {
                "width": 48,
            },
            "HouseLargeTopRight": {
                "width": 8,
                "spritewidth": 8
            },
            "HouseLargeCenter": {
                "spritewidth": 4,
                "height": 12
            },
            "HouseWallWhitewash": [4, 4],
            "InvisibleWall": {
                "hidden": true
            },
            "LabComputer": [16, 8],
            "Label": {
                "position": "end"
            },
            "GymLabel": [16, 4],
            "Ledge": {
                "width": 8,
                "height": 4,
                "spritewidth": 4,
                "collide": FullScreenPokemon.prototype.collideLedge,
                "attributes": {
                    "jagged": {
                        "spritewidth": 16
                    },
                    "crumbleLeft": {},
                    "crumbleRight": {}
                }
            },
            "LedgeOpening": {
                "width": 8,
                "height": 4,
                "spritewidth": 4,
                "nocollide": true
            },
            "MountainSolidBase": [4, 4],
            "MountainTop": [4, 5],
            "PottedPalmTree": [8, 16],
            "Spawner": {
                "hidden": true,
                "onThingAdd": FullScreenPokemon.prototype.activateSpawner
            },
            "AreaSpawner": {
                "activate": FullScreenPokemon.prototype.spawnAreaSpawner
            },
            "Table2x2": [16, 16],
            "Table2x3": [16, 16],
            "Table3x1": [24, 12],
            "Transporter": {
                "collide": FullScreenPokemon.prototype.collideTransporter,
                "activate": FullScreenPokemon.prototype.activateTransporter,
                "activated": false
            },
            "Tree": {
                "dialog": "IT WOULD BE NICE TO CUT THE TREE DOWN LEL"
            },
            "Door": {
                "width": 8,
                "height": 8
            },
            "HiddenTransporter": {
                "hidden": true,
                "noStretchBoundaries": true
            },
            "WaterEdge": [4, 4],
            "WindowDetector": {
                "hidden": true,
                "onThingAdd": FullScreenPokemon.prototype.spawnWindowDetector
            },
            "FloorLinedHorizontal": {
                "spritewidth": .5,
                "spriteheight": 2
            },
            "Scenery": {
                "groupType": "Scenery",
                "repeat": true
            },
            "Doormat": {
                "spritewidth": .5,
                "spriteheight": 8
            },
            "DoormatDotted": {
                "spritewidth": 3.5,
                "spriteheight": 7.5
            },
            "Flower": {
                "width": 4,
                "height": 4,
                "spriteCycle": [
                    ["one", "one", "two", "three"], "waving", 14
                ]
            },
            "FlowerVase": [6, 6],
            "HPBar": [.5, 2],
            "HPBarFill": [.5, .5],
            "PlayerPortrait": [13, 23],
            "BattleSpriteFront": [20, 20], // many are not...
            "BattleSpriteBack": [16, 16],
            "Terrain": {
                "groupType": "Terrain",
                "repeat": true
            },
            "TerrainSmall": [2, 2],
            "TerrainSmallRepeating": {
                "width": 8,
                "height": 8,
                "spritewidth": 2,
                "spriteheight": 2
            },
            "Mountain": [4, 4],
            "WallIndoorLightWithDarkBottom": {
                "spritewidth": .5,
                "spriteheight": 8
            },
            "Water": {
                "spriteCycle": [
                    ["one", "two", "three", "two", "one", "four", "five", "four"], "waving", 14
                ]
            },
            "Text": {
                "groupType": "Text",
                "width": 4,
                "height": 4,
                "paddingX": 0,
                "paddingY": 8,
                "noshiftx": true,
                "noshifty": true,
            },
            "CharacterDropped": {
                "offsetY": FullScreenPokemon.unitsize * .75
            },
            "CharacterShadow": [3.5, 3.5],
            "CharSlash": {
                "offsetY": FullScreenPokemon.unitsize * .5
            },
            "CharApostrophe": [1, 2],
            "CharBall": [3.5, 3.5],
            "CharCircle": [2.5, 2.5],
            "CharHP": [5.5, 2],
            "CharLevel": [3, 2.5],
            "CharArrowUp": [3.5, 2.5],
            "CharArrowRight": [2.5, 3.5],
            "CharArrowDown": [3.5, 2.5],
            "CharArrowLeft": [2.5, 3.5],
            "Line": {
                "repeat": true
            },
            "LineDecorator": [3, 8],
            "LineSeparatorHorizontal": [4, 4],
            "Menu": {
                "groupType": "Text",
                "spritewidth": 4,
                "spriteheight": 4,
                "width": 8,
                "height": 8,
                "repeat": true,
                "noshiftx": true,
                "noshifty": true,
                "arrowXOffset": 4,
                "arrowYOffset": 1,
                "textXOffset": 4,
                "textYOffset": 7.5,
                "textSpeed": 1,
                "attributes": {
                    "plain": {},
                    "light": {
                        "spritewidth": 1,
                        "spriteheight": 1
                    },
                    "dirty": {}
                }
            },
        }
    };
})();