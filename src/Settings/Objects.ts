import { IObjectsModuleSettings } from "gamestartr/lib/IGameStartr";

import { Actions } from "../components/Actions";
import { Collisions } from "../components/Collisions";
import { Maps } from "../components/Maps";
import { Things } from "../components/Things";

/* tslint:disable object-literal-key-quotes */

export function GenerateObjectsSettings(): IObjectsModuleSettings {
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
                        "Table16x32": {},
                        "Table32x32": {},
                        "Table32x48": {},
                        "Table48x16": {},
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
                            "BattleSpritFrontLarge": {
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
                            "CHARIZARDBack": {},
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
                        "Char16Shadow": {},
                        "Char32Shadow": {},
                        "Char48Shadow": {},
                        "Char64Shadow": {},
                        "Char80Shadow": {},
                        "Char96Shadow": {},
                        "Char112Shadow": {},
                        "Char128Shadow": {},
                        "Char144Shadow": {},
                    },
                    "Number": {
                        "Char0": {},
                        "Char16": {},
                        "Char32": {},
                        "Char48": {},
                        "Char64": {},
                        "Char80": {},
                        "Char96": {},
                        "Char112": {},
                        "Char128": {},
                        "Char144": {}
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
                "onMake": Maps.prototype.areaProcess,
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
                "width": 128,
                "height": 128,
                // Placement
                "alive": true,
                "placed": false,
                // Sprites
                "sprite": "",
                "spriteType": "neither",
                "scale": 16,
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
                "onMake": Things.prototype.process
            },
            "Character": {
                "groupType": "Character",
                "speed": 4 / 3,
                "walking": false,
                "shouldWalk": false,
                "switchDirectionOnDialog": true,
                "heightGrass": 64,
                "direction": 32,
                "offsetY": -4,
                "roamingDirections": [0, 1, 2, 3],
                "onThingAdd": Actions.prototype.spawnCharacter,
                "onWalkingStart": Actions.prototype.animateCharacterStartWalking,
                "onWalkingStop": Actions.prototype.animateCharacterStopWalking,
                "activate": Collisions.prototype.collideCharacterDialog,
            },
            "Buzzer": {
                "width": 56,
                "height": 48,
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
                "direction": 32,
                "speed": 8,
                "onWalkingStart": Actions.prototype.animateCharacterStartWalking,
                "onWalkingStop": Actions.prototype.animatePlayerStopWalking,
                "getKeys": () => {
                    return {
                        "0": false,
                        "16": false,
                        "32": false,
                        "48": false,
                        "a": false,
                        "b": false
                    };
                }
            },
            "Pokeball": {
                "action": "item",
                "activate": Collisions.prototype.collidePokeball,
                "borderPrimary": true
            },
            "Rival": {
                "id": "Rival"
            },
            "Solid": {
                "repeat": true,
                "groupType": "Solid",
                "activate": Collisions.prototype.collideCharacterDialog
            },
            "BedSingle": [128, 256],
            "Bookshelf": {
                "width": 128,
                "height": 256,
                "dialogDirections": true,
                "dialog": ["", "", "Crammed full of %%%%%%%POKEMON%%%%%%% books!", ""]
            },
            "BuildingBase": [64, 64],
            "BuildingTopBase": {
                "height": 256,
                "spriteheight": 64
            },
            "BuildingMiddleBase": {
                "height": 128,
                "spriteheight": 64
            },
            "BuildingBottom": {
                "height": 64
            },
            "Cabinet": [128, 256],
            "CollisionDetector": {
                "collide": Collisions.prototype.collideCollisionDetector,
                "active": false,
                "hidden": true
            },
            "AreaGate": {
                "activate": Actions.prototype.activateAreaGate,
                "active": true,
                "requireOverlap": true
            },
            "CutsceneTriggerer": {
                "activate": Actions.prototype.activateCutsceneTriggerer,
                "requireOverlap": true
            },
            "MenuTriggerer": {
                "activate": Actions.prototype.activateMenuTriggerer
            },
            "SightDetector": {
                "activate": Actions.prototype.activateSightDetector,
                "requireOverlap": true,
                "hidden": true
            },
            "ThemePlayer": {
                "activate": Actions.prototype.activateThemePlayer,
                "requireOverlap": true,
                "hidden": true
            },
            "Transporter": {
                "activate": Actions.prototype.activateTransporter,
                "requireOverlap": true,
                "hidden": false
            },
            "HiddenTransporter": {
                "hidden": true,
                "noStretchBoundaries": true
            },
            "Computer": {
                "width": 128,
                "height": 192,
                "tolBottom": 64
            },
            "ComputerDesk": [128, 256],
            "ConsoleController": [128, 80],
            "DialogResponder": {
                "hidden": true
            },
            "CutsceneResponder": {
                "activate": Actions.prototype.activateCutsceneResponder
            },
            "FenceVertical": [64, 128],
            "FloorDiamondsDark": {
                "width": 64,
                "height": 128,
                "spritewidth": 128,
                "spriteheight": 128,
                "nocollide": true
            },
            "Grass": {
                "rarity": 160,
                "collide": Collisions.prototype.collideCharacterGrass
            },
            "GymStatue": {
                "height": 256,
                "activate": Actions.prototype.activateGymStatue
            },
            "HealingMachine": [256, 256],
            "HealingMachineBall": [48, 48],
            "HMCharacter": {
                "activate": Actions.prototype.activateHMCharacter
            },
            "CuttableTree": {
                "moveName": "Cut",
                "moveCallback": Actions.prototype.partyActivateCut,
                "requiredBadge": "Cascade"
            },
            "StrengthBoulder": {
                "moveName": "Strength",
                "moveCallback": Actions.prototype.partyActivateStrength,
                "speed": 16,
                "requiredBadge": "Rainbow"
            },
            "HouseBase": {
                "width": 512,
                "height": 128,
                "spritewidth": 256,
                "spriteheight": 256
            },
            "HouseSide": {
                "width": 128,
                "spritewidth": 128,
                "spriteheight": 128
            },
            "HouseTop": {
                "width": 512,
                "height": 256,
                "spritewidth": 256
            },
            "HouseTopRoof": {
                "spritewidth": 8
            },
            "HouseTopRoofSide": {
                "width": 128,
                "spritewidth": 128,
                "spriteheight": 128
            },
            "HouseLargeBase": {
                "width": 768,
                "height": 320,
                "spritewidth": 320
            },
            "HouseLargeTopLeft": {
                "width": 128,
                "spritewidth": 128
            },
            "HouseLargeTopMiddle": {
                "width": 768,
            },
            "HouseLargeTopRight": {
                "width": 128,
                "spritewidth": 128
            },
            "HouseLargeCenter": {
                "spritewidth": 64,
                "height": 192
            },
            "HouseWallWhitewash": [64, 64],
            "InvisibleWall": {
                "hidden": true
            },
            "LabComputer": [256, 128],
            "Label": {
                "position": "end"
            },
            "GymLabel": [256, 64],
            "Ledge": {
                "width": 128,
                "height": 64,
                "spritewidth": 64,
                "direction": 32,
                "collide": Collisions.prototype.collideLedge,
                "attributes": {
                    "jagged": {
                        "spritewidth": 256
                    },
                    "crumbleLeft": {},
                    "crumbleRight": {}
                }
            },
            "LedgeOpening": {
                "width": 128,
                "height": 64,
                "spritewidth": 64,
                "nocollide": true
            },
            "MountainSolidBase": [64, 64],
            "MountainTop": {
                "width": 64,
                "height": 80,
                "tolBottom": -48
            },
            "PlantLarge": [256, 256],
            "PokeCenterDeskBlocker": {
                "width": 128,
                "height": 128,
                "spritewidth": 16
            },
            "PokeCenterDeskLeft": [64, 128],
            "PottedPalmTree": [128, 256],
            "Sign": {
                "attributes": {
                    "forest": {}
                }
            },
            "SofaLeft": [128, 256],
            "Spawner": {
                "hidden": true,
                "onThingAdd": Actions.prototype.activateSpawner
            },
            "AreaSpawner": {
                "activate": Actions.prototype.spawnareaSpawner
            },
            "SquareWallTop": {
                "spriteheight": 8
            },
            "SquareWallFront": {
                "spriteheight": 24
            },
            "StoreAisle": [256, 256],
            "StoreFridge": [128, 256],
            "StoreSaleBin": [128, 192],
            "Table": {
                "tolBottom": 64
            },
            "Table16x32": [128, 256],
            "Table32x32": [256, 256],
            "Table32x48": [256, 256],
            "Table48x16": [384, 192],
            "Tree": {},
            "Door": {
                "width": 128,
                "height": 128,
                "requireDirection": 0,
                "attributes": {
                    "indoor": {}
                }
            },
            "WaterEdge": {
                "height": 64,
                "width": 64,
                "collide": Collisions.prototype.collideWaterEdge,
                "activate": Actions.prototype.activateHMCharacter,
                "moveName": "Surf",
                "moveCallback": Actions.prototype.partyActivateSurf,
                "requiredBadge": "Soul"
            },
            "WaterEdgeTop": {
                "exitDirection": 0
            },
            "WaterEdgeRight": {
                "exitDirection": 16
            },
            "WaterEdgeBottom": {
                "exitDirection": 32
            },
            "WaterEdgeLeft": {
                "exitDirection": 48
            },
            "WindowDetector": {
                "hidden": true,
                "onThingAdd": Actions.prototype.spawnWindowDetector
            },
            "FloorLinedHorizontal": {
                "spritewidth": 8,
                "spriteheight": 32
            },
            "Scenery": {
                "groupType": "Scenery",
                "repeat": true
            },
            "Blackboard": [256, 128],
            "Bridge": [64, 64],
            "Clipboard": {
                "offsetY": -4
            },
            "Doormat": {
                "spritewidth": 8,
                "spriteheight": 128
            },
            "DoormatDotted": {
                "spritewidth": 56,
                "spriteheight": 120
            },
            "DoormatDashed": {
                "spritewidth": 64,
                "spriteheight": 128
            },
            "Flower": {
                "width": 64,
                "height": 64,
                "spriteCycle": [
                    ["one", "one", "two", "three"], "waving", 224
                ]
            },
            "FlowerVase": [96, 96],
            "ForestDirt": [64, 64],
            "GroundArrow": [64, 64],
            "HPBar": {
                "width": 8,
                "height": 32,
                "repeat": true
            },
            "Note": [104, 112],
            "Shadow": [112, 64],
            "SmokeSmall": [88, 88],
            "SmokeMedium": [120, 120],
            "SmokeLarge": [120, 120],
            "PlayerPortrait": [208, 368],
            "PlayerSilhouetteSmall": [112, 184],
            "PlayerSilhouetteLarge": [176, 320],
            "OakPortrait": [232, 448],
            "RivalPortrait": [232, 448],
            "BattleSpriteFrontSmall": [320, 320],
            "BattleSpriteFrontMedium": [384, 384],
            "BattleSpriteFrontLarge": [448, 448],
            "BattleSpriteBack": {
                "width": 256,
                "height": 224, // 256 (lowest 32 cropped)
                "scale": 32,
                "repeat": false
            },
            "ElderBack": [224, 224],
            "PlayerBack": [224, 224],
            "Terrain": {
                "groupType": "Terrain",
                "repeat": true,
            },
            "TerrainSmall": [32, 32],
            "TerrainSmallRepeating": {
                "width": 128,
                "height": 128,
                "spritewidth": 32,
                "spriteheight": 32
            },
            "BrickRoad": [64, 64],
            "Mountain": [64, 64],
            "WallIndoorLightWithDarkBottom": {
                "spritewidth": 8,
                "spriteheight": 128
            },
            "WallIndoorFancyWithDarkBottom": [64, 128],
            "WallIndoorHorizontalBandsDark": {
                "width": 128,
                "height": 128,
                "spritewidth": 8,
                "spriteheight": 32,
            },
            "Water": {
                "spriteCycle": [
                    ["one", "two", "three", "two", "one", "four", "five", "four"], "waving", 224
                ]
            },
            "Text": {
                "groupType": "Text",
                "width": 64,
                "height": 64,
                "paddingX": 0,
                "paddingY": 128,
                "noshiftx": true,
                "noshifty": true,
            },
            "Exclamation": {
                "width": 112,
                "height": 112,
                "offsetY": -4
            },
            "HalfArrowHorizontal": [64, 32],
            "EmberSmall": [96, 96],
            "EmberLarge": [128, 128],
            "BubbleSmall": [64, 64],
            "BubbleLarge": [128, 128],
            "ExplosionSmall": [128, 128],
            "ExplosionLarge": [256, 256],
            "ScratchLine": [24, 24],
            "Square": {
                "width": 16,
                "height": 16,
                "repeat": true
            },
            "CharacterDropped": {
                "offsetY": 3
            },
            "CharacterShadow": [56, 56],
            "CharMDash": {
                "attributes": {
                    "blinking": {
                        "onThingAdd": (): void => console.log("HA")
                    }
                }
            },
            "CharPoke": {
                "offsetY": 2
            },
            "CharMon": {
                "offsetY": 2
            },
            "CharNo": {
                "width": 64,
                "height": 48,
                "offsetY": 2
            },
            "CharID": {
                "width": 64,
                "height": 48,
                "offsetY": 2
            },
            "CharSlash": {
                "offsetY": 2
            },
            "CharPeriod": {
                "offsetY": 2
            },
            "CharComma": {
                "offsetY": 2
            },
            "CharApostrophe": [16, 32],
            "CharFeet": [32, 24],
            "CharInches": [56, 32],
            "CharBall": [56, 56],
            "CharBallEmpty": [56, 56],
            "CharCircle": [40, 40],
            "CharHP": [88, 32],
            "CharPP": [120, 56],
            "CharTo": [56, 48],
            "CharLevel": [48, 40],
            "Char$": {
                "width": 64,
                "spritewidth": 40,
                "height": 64,
                "offsetx": 2,
                "offsetY": 2
            },
            "CharArrowUp": [56, 40],
            "CharArrowRight": [40, 56],
            "CharArrowDown": [56, 40],
            "CharArrowLeft": [40, 56],
            "HalfArrow": [64, 32],
            "Line": {
                "width": 16,
                "height": 16,
                "repeat": true
            },
            "LineDecoratorHorizontal": [128, 48],
            "LineDecoratorVertical": [48, 128],
            "LineSeparatorHorizontal": [64, 64],
            "MapGreyDiagonal": [64, 64],
            "TownMapNoWater": [1216, 2048],
            "Menu": {
                "groupType": "Text",
                "spritewidth": 64,
                "spriteheight": 64,
                "width": 128,
                "height": 128,
                "repeat": true,
                "noshiftx": true,
                "noshifty": true,
                "arrowXOffset": 20,
                "arrowYOffset": 16,
                "textXOffset": 64,
                "textYOffset": 120,
                "textSpeed": 16,
                "attributes": {
                    "plain": {},
                    "light": {
                        "spritewidth": 16,
                        "spriteheight": 16
                    },
                    "lined": {
                        "spritewidth": 32,
                        "spriteheight": 32
                    },
                    "dirty": {},
                    "watery": {
                        "spritewidth": 64,
                        "spriteheight": 64
                    },
                }
            }
        }
    };
}

/* tslint:enable object-literal-key-quotes */
