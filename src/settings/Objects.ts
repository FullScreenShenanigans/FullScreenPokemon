import { IObjectsModuleSettings } from "gamestartr/lib/IGameStartr";

import { FullScreenPokemon } from "../FullScreenPokemon";

/* tslint:disable object-literal-key-quotes */

/**
 * @param fsp   A generating FullScreenPokemon instance.
 * @returns Object settings for the FullScreenPokemon instance.
 */
export function GenerateObjectsSettings(fsp: FullScreenPokemon): IObjectsModuleSettings {
    "use strict";

    return {
        "onMake": "onMake",
        "indexMap": ["width", "height"],
        "doPropertiesFull": true,
        "giveFunctionsNames": true,
        "inheritance": {
            "Quadrant": {},
            "Map": {},
            "Area": {},
            "Location": {},
            "Thing": {
                "Character": {
                    "BirdPokemon": {},
                    "Boss": {},
                    "BugCatcher": {},
                    "Buzzer": {},
                    "Cashier": {},
                    "ChubbyGuy": {},
                    "CoolTrainerM": {},
                    "Dad": {},
                    "Daisy": {},
                    "DeskWoman": {},
                    "Elder": {},
                    "Fatty": {},
                    "Girl": {},
                    "Gentleman": {},
                    "GlassesOldGuy": {},
                    "Guy": {},
                    "GymGuide": {},
                    "HMCharacter": {
                        "CuttableTree": {},
                        "StrengthBoulder": {}
                    },
                    "Lady": {},
                    "Lass": {},
                    "LandPokemon": {},
                    "LittleGirl": {},
                    "Mother": {},
                    "Nurse": {},
                    "Oak": {},
                    "OldMan": {},
                    "Player": {},
                    "Pokeball": {},
                    "Rival": {},
                    "Scientist": {},
                    "Toddler": {},
                    "WaterPokemon": {}
                },
                "Solid": {
                    "AsianScroll": {},
                    "BedSingle": {},
                    "Book": {},
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
                        "BuildingBottom": {
                            "BuildingBottomLeft": {},
                            "BuildingBottomMiddle": {},
                            "BuildingBottomRight": {}
                        },
                    },
                    "Cabinet": {},
                    "CollisionDetector": {
                        "AreaGate": {},
                        "CutsceneTriggerer": {},
                        "MenuTriggerer": {},
                        "SightDetector": {},
                        "ThemePlayer": {},
                        "Transporter": {
                            "CaveOpening": {},
                            "Door": {},
                            "HiddenTransporter": {},
                            "StairsDown": {},
                            "StairsUp": {},
                            "StairsVertical": {}
                        },
                    },
                    "Computer": {},
                    "ComputerDesk": {},
                    "ConsoleAndController": {},
                    "DialogResponder": {
                        "CutsceneResponder": {}
                    },
                    "FenceWide": {},
                    "FenceVertical": {},
                    "FloorDiamondsDark": {},
                    "Grass": {},
                    "GymStatue": {},
                    "HealingMachine": {},
                    "HealingMachineBall": {},
                    "HouseBase": {
                        "HouseSide": {
                            "HouseLeft": {},
                            "HouseMiddle": {},
                            "HouseRight": {}
                        },
                        "HouseTop": {},
                        "HouseTopRoof": {},
                        "HouseTopRoofSide": {
                            "HouseTopRoofLeft": {},
                            "HouseTopRoofRight": {}
                        }
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
                        "MountainTop": {},
                        "MountainTopRight": {},
                        "MountainTopLeft": {},
                        "MountainRight": {},
                        "MountainLeft": {},
                        "MountainBottom": {},
                        "MountainBottomLeft": {},
                        "MountainBottomRight": {},
                    },
                    "PlantLarge": {},
                    "PlantSmall": {},
                    "PokeCenterDesk": {
                        "PokeCenterDeskBlocker": {},
                        "PokeCenterDeskLeft": {}
                    },
                    "PottedPalmTree": {},
                    "Register": {},
                    "Rock": {},
                    "Sign": {},
                    "SofaLeft": {},
                    "Spawner": {},
                    "SquareWall": {
                        "SquareWallTop": {},
                        "SquareWallFront": {}
                    },
                    "StoreAisle": {},
                    "StoreFridge": {},
                    "StoreSaleBin": {},
                    "Stump": {},
                    "Table": {
                        "Table1x2": {},
                        "Table2x2": {},
                        "Table2x3": {},
                        "Table3x1": {},
                    },
                    "TelevisionMonitor": {},
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
                    "Blackboard": {},
                    "Bridge": {},
                    "Clipboard": {},
                    "Doormat": {},
                    "DoormatDotted": {},
                    "DoormatDashed": {},
                    "Flower": {},
                    "FlowerVase": {},
                    "ForestDirt": {},
                    "GroundArrow": {},
                    "Notepad": {},
                    "Painting": {},
                    "PokeCenterPoster": {},
                    "Shadow": {},
                    "SmokeSmall": {},
                    "SmokeMedium": {},
                    "SmokeLarge": {},
                    "Stool": {},
                    "Window": {},
                    "WindowBlinds": {},
                    "Portrait": {
                        "PlayerPortrait": {},
                        "PlayerSilhouetteSmall": {},
                        "PlayerSilhouetteLarge": {},
                        "OakPortrait": {},
                        "RivalPortrait": {},
                        "BlainePortrait": {},
                        "BrockPortrait": {},
                        "ErikaPortrait": {},
                        "GiovanniPortrait": {},
                        "KogaPortrait": {},
                        "LtSurgePortrait": {},
                        "MistyPortrait": {},
                        "SabrinaPortrait": {},
                    },
                    "BattleSprite": {
                        "BattleSpriteFront": {
                            "BattleSpriteFrontSmall": {
                                "BULBASAURFront": {},
                                "CHARMANDERFront": {},
                                "SQUIRTLEFront": {},
                                "CATERPIEFront": {},
                                "METAPODFront": {},
                                "WEEDLEFront": {},
                                "KAKUNAFront": {},
                                "PIDGEYFront": {},
                                "RATTATAFront": {},
                                "SPEAROWFront": {},
                                "EKANSFront": {},
                                "PIKACHUFront": {},
                                "SANDSHREWFront": {},
                                "NIDORANFemaleSymbolFront": {},
                                "NIDORANMaleSymbolFront": {},
                                "CLEFAIRYFront": {},
                                "JIGGLYPUFFFront": {},
                                "ZUBATFront": {},
                                "ODDISHFront": {},
                                "PARASFront": {},
                                "VENONATFront": {},
                                "DIGLETTFront": {},
                                "MEOWTHFront": {},
                                "PSYDUCKFront": {},
                                "MANKEYFront": {},
                                "GROWLITHEFront": {},
                                "POLIWAGFront": {},
                                "ABRAFront": {},
                                "MACHOPFront": {},
                                "BELLSPROUTFront": {},
                                "TENTACOOLFront": {},
                                "GEODUDEFront": {},
                                "SLOWPOKEFront": {},
                                "MAGNEMITEFront": {},
                                "DODUOFront": {},
                                "GRIMERFront": {},
                                "SHELLDERFront": {},
                                "KRABBYFront": {},
                                "VOLTORBFront": {},
                                "ELECTRODEFront": {},
                                "CUBONEFront": {},
                                "HORSEAFront": {},
                                "DITTOFront": {},
                                "EEVEEFront": {},
                                "OMANYTEFront": {},
                                "KABUTOFront": {},
                                "DRATINIFront": {},
                                "MEWFront": {}
                            },
                            "BattleSpriteFrontMedium": {
                                "BugCatcherFront": {},
                                "IVYSAURFront": {},
                                "CHARMELEONFront": {},
                                "WARTORTLEFront": {},
                                "PIDGEOTTOFront": {},
                                "RATICATEFront": {},
                                "SANDSLASHFront": {},
                                "NIDORINAFront": {},
                                "NIDORINOFront": {},
                                "CLEFABLEFront": {},
                                "VULPIXFront": {},
                                "WIGGLYTUFFFront": {},
                                "GLOOMFront": {},
                                "DUGTRIOFront": {},
                                "POLIWHIRLFront": {},
                                "KADABRAFront": {},
                                "WEEPINBELLFront": {},
                                "TENTACRUELFront": {},
                                "GRAVELERFront": {},
                                "GOLEMFront": {},
                                "PONYTAFront": {},
                                "MAGNETONFront": {},
                                "FARFETCHDFront": {},
                                "SEELFront": {},
                                "DEWGONGFront": {},
                                "HAUNTERFront": {},
                                "GENGARFront": {},
                                "DROWZEEFront": {},
                                "MAROWAKFront": {},
                                "HITMONCHANFront": {},
                                "KOFFINGFront": {},
                                "CHANSEYFront": {},
                                "TANGELAFront": {},
                                "SEADRAFront": {},
                                "STARYUFront": {},
                                "STARMIEFront": {},
                                "GOLDEENFront": {},
                                "MRMIMEFront": {},
                                "JYNXFront": {},
                                "ELECTABUZZFront": {},
                                "MAGMARFront": {},
                                "MAGIKARPFront": {},
                                "VAPOREONFront": {},
                                "JOLTEONFront": {},
                                "FLAREONFront": {},
                                "PORYGONFront": {},
                                "OMASTARFront": {},
                                "KABUTOPSFront": {},
                                "DRAGONAIRFront": {}
                            },
                            "BattleSpriteFrontLarge": {
                                "BROCKFront": {},
                                "JRTRAINERFront": {},
                                "VENUSAURFront": {},
                                "CHARIZARDFront": {},
                                "BLASTOISEFront": {},
                                "BUTTERFREEFront": {},
                                "BEEDRILLFront": {},
                                "PIDGEOTFront": {},
                                "FEAROWFront": {},
                                "ARBOKFront": {},
                                "RAICHUFront": {},
                                "NIDOQUEENFront": {},
                                "NIDOKINGFront": {},
                                "NINETALESFront": {},
                                "GOLBATFront": {},
                                "VILEPLUMEFront": {},
                                "PARASECTFront": {},
                                "VENOMOTHFront": {},
                                "PERSIANFront": {},
                                "GOLDUCKFront": {},
                                "PRIMEAPEFront": {},
                                "ARCANINEFront": {},
                                "POLIWRATHFront": {},
                                "ALAKAZAMFront": {},
                                "MACHOKEFront": {},
                                "MACHAMPFront": {},
                                "VICTREEBELFront": {},
                                "RAPIDASHFront": {},
                                "SLOWBROFront": {},
                                "DODRIOFront": {},
                                "MUKFront": {},
                                "CLOYSTERFront": {},
                                "GASTLYFront": {},
                                "ONIXFront": {},
                                "HYPNOFront": {},
                                "KINGLERFront": {},
                                "EXEGGCUTEFront": {},
                                "EXEGGUTORFront": {},
                                "HITMONLEEFront": {},
                                "LICKITUNGFront": {},
                                "WEEZINGFront": {},
                                "RHYHORNFront": {},
                                "RHYDONFront": {},
                                "KANGASKHANFront": {},
                                "SEAKINGFront": {},
                                "SCYTHERFront": {},
                                "PINSIRFront": {},
                                "TAUROSFront": {},
                                "GYARADOSFront": {},
                                "LAPRASFront": {},
                                "AERODACTYLFront": {},
                                "SNORLAXFront": {},
                                "ARTICUNOFront": {},
                                "ZAPDOSFront": {},
                                "MOLTRESFront": {},
                                "DRAGONITEFront": {},
                                "MEWTWOFront": {}
                            }
                        },
                        "BattleSpriteBack": {
                            "PlayerBack": {},
                            "ElderBack": {},
                            "BULBASAURBack": {},
                            "IVYSAURBack": {},
                            "VENUSAURBack": {},
                            "CHARMANDERBack": {},
                            "CHARMELEONBack": {},
                            "SQUIRTLEBack": {},
                            "WARTORTLEBack": {},
                            "BLASTOISEBack": {},
                            "CATERPIEBack": {},
                            "METAPODBack": {},
                            "BUTTERFREEBack": {},
                            "WEEDLEBack": {},
                            "KAKUNABack": {},
                            "BEEDRILLBack": {},
                            "PIDGEYBack": {},
                            "PIDGEOTTOBack": {},
                            "PIDGEOTBack": {},
                            "RATTATABack": {},
                            "RATICATEBack": {},
                            "SPEAROWBack": {},
                            "FEAROWBack": {},
                            "EKANSBack": {},
                            "ARBOKBack": {},
                            "PIKACHUBack": {},
                            "RAICHUBack": {},
                            "SANDSHREWBack": {},
                            "SANDSLASHBack": {},
                            "NIDORANFemaleSymbolBack": {},
                            "NIDORINABack": {},
                            "NIDOQUEENBack": {},
                            "NIDORANMaleSymbolBack": {},
                            "NIDORINOBack": {},
                            "NIDOKINGBack": {},
                            "CLEFAIRYBack": {},
                            "CLEFABLEBack": {},
                            "VULPIXBack": {},
                            "NINETALESBack": {},
                            "JIGGLYPUFFBack": {},
                            "WIGGLYTUFFBack": {},
                            "ZUBATBack": {},
                            "GOLBATBack": {},
                            "ODDISHBack": {},
                            "GLOOMBack": {},
                            "VILEPLUMEBack": {},
                            "PARASBack": {},
                            "PARASECTBack": {},
                            "VENONATBack": {},
                            "VENOMOTHBack": {},
                            "DIGLETTBack": {},
                            "DUGTRIOBack": {},
                            "MEOWTHBack": {},
                            "PERSIANBack": {},
                            "PSYDUCKBack": {},
                            "GOLDUCKBack": {},
                            "MANKEYBack": {},
                            "PRIMEAPEBack": {},
                            "GROWLITHEBack": {},
                            "ARCANINEBack": {},
                            "POLIWAGBack": {},
                            "POLIWHIRLBack": {},
                            "POLIWRATHBack": {},
                            "ABRABack": {},
                            "KADABRABack": {},
                            "ALAKAZAMBack": {},
                            "MACHOPBack": {},
                            "MACHOKEBack": {},
                            "MACHAMPBack": {},
                            "BELLSPROUTBack": {},
                            "WEEPINBELLBack": {},
                            "VICTREEBELBack": {},
                            "TENTACOOLBack": {},
                            "TENTACRUELBack": {},
                            "GEODUDEBack": {},
                            "GRAVELERBack": {},
                            "GOLEMBack": {},
                            "PONYTABack": {},
                            "RAPIDASHBack": {},
                            "SLOWPOKEBack": {},
                            "SLOWBROBack": {},
                            "MAGNEMITEBack": {},
                            "MAGNETONBack": {},
                            "FARFETCHDBack": {},
                            "DODUOBack": {},
                            "DODRIOBack": {},
                            "SEELBack": {},
                            "DEWGONGBack": {},
                            "GRIMERBack": {},
                            "MUKBack": {},
                            "SHELLDERBack": {},
                            "CLOYSTERBack": {},
                            "GASTLYBack": {},
                            "HAUNTERBack": {},
                            "GENGARBack": {},
                            "ONIXBack": {},
                            "DROWZEEBack": {},
                            "HYPNOBack": {},
                            "KRABBYBack": {},
                            "KINGLERBack": {},
                            "VOLTORBBack": {},
                            "ELECTRODEBack": {},
                            "EXEGGCUTEBack": {},
                            "EXEGGUTORBack": {},
                            "CUBONEBack": {},
                            "MAROWAKBack": {},
                            "HITMONLEEBack": {},
                            "HITMONCHANBack": {},
                            "LICKITUNGBack": {},
                            "KOFFINGBack": {},
                            "WEEZINGBack": {},
                            "RHYHORNBack": {},
                            "RHYDONBack": {},
                            "CHANSEYBack": {},
                            "TANGELABack": {},
                            "KANGASKHANBack": {},
                            "HORSEABack": {},
                            "SEADRABack": {},
                            "GOLDEENBack": {},
                            "SEAKINGBack": {},
                            "STARYUBack": {},
                            "STARMIEBack": {},
                            "MRMIMEBack": {},
                            "SCYTHERBack": {},
                            "JYNXBack": {},
                            "ELECTABUZZBack": {},
                            "MAGMARBack": {},
                            "PINSIRBack": {},
                            "TAUROSBack": {},
                            "MAGIKARPBack": {},
                            "GYARADOSBack": {},
                            "LAPRASBack": {},
                            "DITTOBack": {},
                            "EEVEEBack": {},
                            "VAPOREONBack": {},
                            "JOLTEONBack": {},
                            "FLAREONBack": {},
                            "PORYGONBack": {},
                            "OMANYTEBack": {},
                            "OMASTARBack": {},
                            "KABUTOBack": {},
                            "KABUTOPSBack": {},
                            "AERODACTYLBack": {},
                            "SNORLAXBack": {},
                            "ARTICUNOBack": {},
                            "ZAPDOSBack": {},
                            "MOLTRESBack": {},
                            "DRATINIBack": {},
                            "DRAGONAIRBack": {},
                            "DRAGONITEBack": {},
                            "MEWTWOBack": {},
                            "MEWBack": {}
                        },
                        "BattleSpriteBackLarge": {
                            "CHARIZARDBack": {}
                        }
                    }
                },
                "Terrain": {
                    "TerrainSmall": {
                        "TerrainSmallRepeating": {
                            "WallIndoorHorizontalBands": {
                                "WallIndoorHorizontalBandsInverse": {}
                            },
                            "WallIndoorLightWithDarkBottom": {}
                        }
                    },
                    "BrickRoad": {},
                    "DirtClean": {},
                    "DirtForest": {},
                    "DirtLight": {},
                    "DirtMedium": {},
                    "DirtWhite": {},
                    "FloorCheckered": {},
                    "FloorDiamonds": {},
                    "FloorLinedHorizontal": {},
                    "FloorTiledDiagonal": {},
                    "Mountain": {},
                    "Water": {},
                    "WallIndoorFancyWithDarkBottom": {},
                    "WallIndoorHorizontalBandsDark": {}
                },
                "Text": {
                    "Exclamation": {},
                    "HalfArrowHorizontal": {},
                    "HPBar": {},
                    "Note": {},
                    "EmberSmall": {},
                    "EmberLarge": {},
                    "BubbleSmall": {},
                    "BubbleLarge": {},
                    "ExplosionSmall": {},
                    "ExplosionLarge": {},
                    "ScratchLine": {},
                    "Square": {
                        "BlackSquare": {},
                        "DarkGraySquare": {},
                        "LightGraySquare": {},
                        "WhiteSquare": {},
                    },
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
                        "CharSpace": {},
                        "CharTimes": {},
                        "CharLeftParenthesis": {},
                        "CharRightParenthesis": {},
                        "CharColon": {},
                        "CharSemicolon": {},
                        "CharLeftSquareBracket": {},
                        "CharRightSquareBracket": {},
                        "CharPoke": {},
                        "CharMon": {},
                        "CharNo": {},
                        "CharID": {},
                        "CharHyphen": {},
                        "CharMDash": {},
                        "CharUnderscore": {},
                        "CharQuestionMark": {},
                        "CharExclamationMark": {},
                        "CharMaleSymbol": {},
                        "CharFemaleSymbol": {},
                        "CharSlash": {},
                        "CharPeriod": {},
                        "CharComma": {},
                        "CharED": {},
                        "CharApostrophe": {},
                        "CharFeet": {},
                        "CharInches": {},
                        "ChareFancy": {},
                        "CharBall": {},
                        "CharBallEmpty": {},
                        "CharCircle": {},
                        "CharHP": {},
                        "CharPP": {},
                        "CharTo": {},
                        "CharLevel": {},
                        "Char$": {}
                    },
                    "CharArrow": {
                        "CharArrowUp": {},
                        "CharArrowRight": {},
                        "CharArrowDown": {},
                        "CharArrowLeft": {}
                    },
                    "HalfArrow": {
                        "HalfArrowLeft": {},
                        "HalfArrowRight": {}
                    },
                    "Line": {
                        "LineDecoratorHorizontal": {
                            "LineDecoratorHorizontalLeft": {},
                            "LineDecoratorHorizontalRight": {},
                        },
                        "LineDecoratorVertical": {},
                        "LineSeparatorHorizontal": {},
                    },
                    "MapGreyDiagonal": {},
                    "TownMapNoWater": {}
                },
                "Menu": {},
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
                // "stretches": [
                //     { "thing": "BackgroundFaker", "noBoundaryStretch": true } // This needs implementation.
                // ],
                "onMake": fsp.maps.areaProcess.bind(fsp.maps),
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
                "entry": "Normal"
            },
            "Thing": {
                // Sizing
                "width": 32,
                "height": 32,
                // Placement
                "alive": true,
                "placed": false,
                "maxquads": 16,
                // Sprites
                "sprite": "",
                "spriteType": "neither",
                "scale": 1,
                "offsetX": 0,
                "offsetY": 0,
                // Movements
                "movement": undefined,
                // Collisions
                "tolTop": 0,
                "tolRight": 0,
                "tolBottom": 0,
                "tolLeft": 0,
                // Triggered Functions
                "onMake": fsp.things.process.bind(fsp.things)
            },
            "Character": {
                "groupType": "Character",
                "speed": 2,
                "walking": false,
                "shouldWalk": false,
                "switchDirectionOnDialog": true,
                "direction": 2,
                "offsetY": -8,
                "roamingDirections": [0, 1, 2, 3],
                "onThingAdd": fsp.actions.spawnCharacter.bind(fsp.actions),
                "activate": fsp.collisions.collideCharacterDialog.bind(fsp.collisions),
            },
            "Buzzer": {
                "width": 14,
                "height": 12,
                "nocollide": true
            },
            "CoolTrainerM": {
                "attributes": {
                    "sitting": {}
                }
            },
            "Elder": {
                "attributes": {
                    "resting": {}
                }
            },
            "Player": {
                "id": "player",
                "player": true,
                "canKeyWalking": true,
                "direction": 2,
                "getKeys": () => {
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
            "Pokeball": {
                "action": "item",
                "activate": fsp.collisions.collidePokeball.bind(fsp.collisions),
                "borderPrimary": true
            },
            "Rival": {
                "id": "Rival"
            },
            "Solid": {
                "repeat": true,
                "groupType": "Solid",
                "activate": fsp.collisions.collideCharacterDialog.bind(fsp.collisions)
            },
            "BedSingle": [32, 64],
            "Bookshelf": {
                "width": 32,
                "height": 64,
                "dialogDirections": true,
                "dialog": ["", "", "Crammed full of %%%%%%%POKEMON%%%%%%% books!", ""]
            },
            "BuildingBase": [16, 16],
            "BuildingTopBase": {
                "height": 64,
                "spriteheight": 16
            },
            "BuildingMiddleBase": {
                "height": 32,
                "spriteheight": 16
            },
            "BuildingBottom": {
                "height": 16
            },
            "Cabinet": [32, 64],
            "CollisionDetector": {
                "collide": fsp.collisions.collideCollisionDetector.bind(fsp.collisions),
                "active": false,
                "hidden": true
            },
            "AreaGate": {
                "activate": fsp.actions.activateAreaGate.bind(fsp.actions),
                "active": true,
                "requireOverlap": true
            },
            "CutsceneTriggerer": {
                "activate": fsp.actions.activateCutsceneTriggerer.bind(fsp.actions),
                "requireOverlap": true
            },
            "MenuTriggerer": {
                "activate": fsp.actions.activateMenuTriggerer.bind(fsp.actions)
            },
            "SightDetector": {
                "activate": fsp.actions.activateSightDetector.bind(fsp.actions),
                "requireOverlap": true,
                "hidden": true
            },
            "ThemePlayer": {
                "activate": fsp.actions.activateThemePlayer.bind(fsp.actions),
                "requireOverlap": true,
                "hidden": true
            },
            "Transporter": {
                "activate": fsp.actions.activateTransporter.bind(fsp.actions),
                "requireOverlap": true,
                "hidden": false
            },
            "HiddenTransporter": {
                "hidden": true,
                "noStretchBoundaries": true
            },
            "Computer": {
                "width": 32,
                "height": 48,
                "tolBottom": 16
            },
            "ComputerDesk": [32, 64],
            "ConsoleController": [32, 20],
            "DialogResponder": {
                "hidden": true
            },
            "CutsceneResponder": {
                "activate": fsp.actions.activateCutsceneResponder.bind(fsp.actions)
            },
            "FenceVertical": [16, 32],
            "FloorDiamondsDark": {
                "width": 16,
                "height": 32,
                "spritewidth": 32,
                "spriteheight": 32,
                "nocollide": true
            },
            "Grass": {
                "rarity": 40,
                "collide": fsp.collisions.collideCharacterGrass.bind(fsp.collisions)
            },
            "GymStatue": {
                "height": 64,
                "activate": fsp.actions.activateGymStatue.bind(fsp.actions)
            },
            "HealingMachine": [64, 64],
            "HealingMachineBall": [12, 12],
            "HMCharacter": {
                "activate": fsp.actions.activateHMCharacter.bind(fsp.actions)
            },
            "CuttableTree": {
                "moveName": "Cut",
                "moveCallback": fsp.actions.partyActivateCut.bind(fsp.actions),
                "requiredBadge": "Cascade"
            },
            "StrengthBoulder": {
                "moveName": "Strength",
                "moveCallback": fsp.actions.partyActivateStrength.bind(fsp.actions),
                "speed": 4,
                "requiredBadge": "Rainbow"
            },
            "HouseBase": {
                "width": 128,
                "height": 32,
                "spritewidth": 64,
                "spriteheight": 64
            },
            "HouseSide": {
                "width": 32,
                "spritewidth": 32,
                "spriteheight": 32
            },
            "HouseTop": {
                "width": 128,
                "height": 64,
                "spritewidth": 64
            },
            "HouseTopRoof": {
                "spritewidth": 2
            },
            "HouseTopRoofSide": {
                "width": 32,
                "spritewidth": 32,
                "spriteheight": 32
            },
            "HouseLargeBase": {
                "width": 192,
                "height": 80,
                "spritewidth": 80
            },
            "HouseLargeTopLeft": {
                "width": 32,
                "spritewidth": 32
            },
            "HouseLargeTopMiddle": {
                "width": 192,
            },
            "HouseLargeTopRight": {
                "width": 32,
                "spritewidth": 32
            },
            "HouseLargeCenter": {
                "spritewidth": 16,
                "height": 48
            },
            "HouseWallWhitewash": [16, 16],
            "InvisibleWall": {
                "hidden": true
            },
            "LabComputer": [64, 32],
            "Label": {
                "position": "end"
            },
            "GymLabel": [64, 16],
            "Ledge": {
                "width": 32,
                "height": 16,
                "spritewidth": 16,
                "direction": 2,
                "collide": fsp.collisions.collideLedge.bind(fsp.collisions),
                "attributes": {
                    "jagged": {
                        "spritewidth": 64
                    },
                    "crumbleLeft": {},
                    "crumbleRight": {}
                }
            },
            "LedgeOpening": {
                "width": 32,
                "height": 16,
                "spritewidth": 16,
                "nocollide": true
            },
            "MountainSolidBase": [16, 16],
            "MountainTop": {
                "width": 16,
                "height": 20,
                "tolBottom": -12
            },
            "PlantLarge": [64, 64],
            "PokeCenterDeskBlocker": {
                "width": 32,
                "height": 32,
                "spritewidth": 4
            },
            "PokeCenterDeskLeft": [16, 32],
            "PottedPalmTree": [32, 64],
            "Sign": {
                "attributes": {
                    "forest": {}
                }
            },
            "SofaLeft": [32, 64],
            "Spawner": {
                "hidden": true,
                "onThingAdd": fsp.actions.activateSpawner.bind(fsp.actions)
            },
            "AreaSpawner": {
                "activate": fsp.actions.spawnAreaSpawner.bind(fsp.actions)
            },
            "SquareWallTop": {
                "spriteheight": 2
            },
            "SquareWallFront": {
                "spriteheight": 6
            },
            "StoreAisle": [64, 64],
            "StoreFridge": [32, 64],
            "StoreSaleBin": [32, 48],
            "Table": {
                "tolBottom": 16
            },
            "Table1x2": [32, 64],
            "Table2x2": [64, 64],
            "Table2x3": [64, 64],
            "Table3x1": [96, 48],
            "Tree": {},
            "Door": {
                "width": 32,
                "height": 32,
                "requireDirection": 0,
                "attributes": {
                    "indoor": {}
                }
            },
            "WaterEdge": {
                "height": 16,
                "width": 16,
                "collide": fsp.collisions.collideWaterEdge.bind(fsp.collisions),
                "activate": fsp.actions.activateHMCharacter.bind(fsp.actions),
                "moveName": "Surf",
                "moveCallback": fsp.actions.partyActivateSurf.bind(fsp.actions),
                "requiredBadge": "Soul"
            },
            "WaterEdgeTop": {
                "exitDirection": 0
            },
            "WaterEdgeRight": {
                "exitDirection": 1
            },
            "WaterEdgeBottom": {
                "exitDirection": 2
            },
            "WaterEdgeLeft": {
                "exitDirection": 3
            },
            "WindowDetector": {
                "hidden": true,
                "onThingAdd": fsp.actions.spawnWindowDetector.bind(fsp.actions)
            },
            "FloorLinedHorizontal": {
                "spritewidth": 2,
                "spriteheight": 8
            },
            "Scenery": {
                "groupType": "Scenery",
                "repeat": true
            },
            "Blackboard": [64, 32],
            "Bridge": [16, 16],
            "Clipboard": {
                "offsetY": -6
            },
            "Doormat": {
                "spritewidth": 2,
                "spriteheight": 32
            },
            "DoormatDotted": {
                "spritewidth": 14,
                "spriteheight": 30
            },
            "DoormatDashed": {
                "spritewidth": 16,
                "spriteheight": 32
            },
            "Flower": {
                "width": 16,
                "height": 16,
                "spriteCycle": [
                    ["one", "one", "two", "three"], "waving", 56
                ]
            },
            "FlowerVase": [24, 24],
            "ForestDirt": [16, 16],
            "GroundArrow": [16, 16],
            "HPBar": {
                "width": 2,
                "height": 8,
                "repeat": true
            },
            "Note": [26, 28],
            "Shadow": [28, 16],
            "SmokeSmall": [22, 22],
            "SmokeMedium": [30, 30],
            "SmokeLarge": [30, 30],
            "PlayerPortrait": [52, 92],
            "PlayerSilhouetteSmall": [28, 46],
            "PlayerSilhouetteLarge": [44, 80],
            "OakPortrait": [58, 112],
            "RivalPortrait": [58, 112],
            "BattleSpriteFrontSmall": [80, 80],
            "BattleSpriteFrontMedium": [96, 96],
            "BattleSpriteFrontLarge": [112, 112],
            "BattleSpriteBack": {
                "width": 64,
                "height": 56,
                "scale": 2,
                "repeat": false
            },
            "BattleSpriteBackLarge": {
                "width": 64,
                "height": 64,
                "scale": 2,
                "repeat": false
            },
            "ElderBack": [56, 56],
            "PlayerBack": [56, 56],
            "Terrain": {
                "groupType": "Terrain",
                "repeat": true,
            },
            "TerrainSmall": [8, 8],
            "TerrainSmallRepeating": {
                "width": 32,
                "height": 32,
                "spritewidth": 8,
                "spriteheight": 8
            },
            "BrickRoad": [16, 16],
            "Mountain": [16, 16],
            "WallIndoorLightWithDarkBottom": {
                "spritewidth": 2,
                "spriteheight": 32
            },
            "WallIndoorFancyWithDarkBottom": [16, 32],
            "WallIndoorHorizontalBandsDark": {
                "width": 32,
                "height": 32,
                "spritewidth": 2,
                "spriteheight": 8,
            },
            "Water": {
                "spriteCycle": [
                    ["one", "two", "three", "two", "one", "four", "five", "four"], "waving", 56
                ]
            },
            "Text": {
                "groupType": "Text",
                "width": 16,
                "height": 16,
                "paddingX": 0,
                "paddingY": 32,
                "noshiftx": true,
                "noshifty": true,
            },
            "Exclamation": {
                "width": 28,
                "height": 28,
                "offsetY": -8
            },
            "HalfArrowHorizontal": [16, 8],
            "EmberSmall": [24, 24],
            "EmberLarge": [32, 32],
            "BubbleSmall": [16, 16],
            "BubbleLarge": [32, 32],
            "ExplosionSmall": [32, 32],
            "ExplosionLarge": [64, 64],
            "ScratchLine": [6, 6],
            "Square": {
                "width": 4,
                "height": 4,
                "repeat": true
            },
            "CharacterDropped": {
                "offsetY": 3
            },
            "CharacterShadow": [14, 14],
            "CharMDash": {
                "attributes": {
                    "blinking": {
                        "onThingAdd": (): void => console.log("HA")
                    }
                }
            },
            "CharPoke": {
                "offsetx": 2
            },
            "CharMon": {
                "offsetx": 2
            },
            "CharNo": {
                "width": 16,
                "height": 12,
                "offsetx": 2
            },
            "CharID": {
                "width": 16,
                "height": 12,
                "offsetx": 2
            },
            "CharSlash": {
                "offsetx": 2
            },
            "CharPeriod": {
                "offsetx": 2
            },
            "CharComma": {
                "offsetx": 2
            },
            "CharApostrophe": [4, 8],
            "CharFeet": [8, 6],
            "CharInches": [14, 8],
            "CharBall": [14, 14],
            "CharBallEmpty": [14, 14],
            "CharCircle": [10, 10],
            "CharHP": [22, 8],
            "CharPP": [30, 14],
            "CharTo": [14, 12],
            "CharLevel": [12, 10],
            "Char$": {
                "width": 16,
                "spritewidth": 10,
                "height": 16,
                "offsetX": 8,
                "offsetx": 2
            },
            "CharArrowUp": [14, 10],
            "CharArrowRight": [10, 14],
            "CharArrowDown": [14, 10],
            "CharArrowLeft": [10, 14],
            "HalfArrow": [16, 8],
            "Line": {
                "width": 4,
                "height": 4,
                "repeat": true
            },
            "LineDecoratorHorizontal": [32, 12],
            "LineDecoratorVertical": [12, 32],
            "LineSeparatorHorizontal": [16, 16],
            "MapGreyDiagonal": [16, 16],
            "TownMapNoWater": [304, 512],
            "Menu": {
                "groupType": "Text",
                "spritewidth": 16,
                "spriteheight": 16,
                "width": 32,
                "height": 32,
                "repeat": true,
                "noshiftx": true,
                "noshifty": true,
                "arrowXOffset": 5,
                "arrowYOffset": 4,
                "textXOffset": 16,
                "textYOffset": 30,
                "textSpeed": 1,
                "attributes": {
                    "plain": {},
                    "light": {
                        "spritewidth": 4,
                        "spriteheight": 4
                    },
                    "lined": {
                        "spritewidth": 8,
                        "spriteheight": 8
                    },
                    "dirty": {},
                    "watery": {
                        "spritewidth": 16,
                        "spriteheight": 16
                    },
                }
            }
        }
    };
}

/* tslint:enable object-literal-key-quotes */
