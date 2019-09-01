var db = new Firebase("https://makeio.firebaseio.com/");

var updateData = function () {
    db.on('child_added', function (snapshot) {
        var dataInput = snapshot.val();
        if( dataInput.type == "acc" ) {
            acc.usr.push(dataInput.usr);
            acc.psw.push(dataInput.psw);
        } else if (dataInput.type == "makeNewGame" ) {
            if( dataInput.user == loggedUser ) {
                gProjects.name.push( dataInput.gname );
                gProjects.code.push( { moveWhen : "buttonPress", moveKeyBindEnabled : true, moveKeyBind: [], changeDirWhen : "buttonPress", directionKeyBindEnabled : false, directionKeyBind : [{ keyCodeB: 13, directionRL: "right", moveRL: false, directionUD: "up", moveUD: false }], playerAppearPointSettings : "size", playerLibrarySprite : "./assets/samplePack/car.png", playerUploadSprite : "./assets/editorMisc/blank.png", usePlayerSprite : "library", playerAttackSetting : { type:"shoot", keyCode:13 }, playerAttackLibrarySprite : "./assets/samplePack/axe.png", playerAttackuploadSprite : "./assets/editorMisc/blank.png", usePlayerAttackSprite : "library", howCollectablesSpawn : "randomPoint", howMuchCollectablesSpawn : "alot", howManyCollectablePoint : 0, collectablesLibrarySprite : "./assets/samplePack/coin.png", collectablesUploadSprite : "./assets/editorMisc/blank.png", collectablesSpriteType : "library", floorLibrarySprite : "./assets/samplePack/hexagon.png", floorUploadSprite : "./assets/editorMisc/blank.png", useFloorTexture : "library", useGameTitle : "text", uploadedGameTitleImage : "./assets/editorMisc/blank.png" } );
                updateGameLaunchers();
            }
        } else if( dataInput.type == "newMoveKeyBind" ) {
            if( dataInput.user == loggedUser ) {
                gProjects.code[dataInput.oprojectID].moveKeyBind.push({ whichKey: "Enter", keyCodeA: 13, toX : 0, toY : 0});
                updateCodeBlocks(dataInput.oprojectID);
                saveProjectShou()
            }
        } else if( dataInput.type == "newChangeDirKeyBind" ) {
            if( dataInput.user == loggedUser ) {
                gProjects.code[dataInput.oprojectID].directionKeyBind.push({ keyCodeB: 13, directionRL: "right", moveRL: false, directionUD: "up", moveUD: false });
                updateCodeBlocks(dataInput.oprojectID);
                saveProjectShou()
            }
        } else if( dataInput.type == "deletePlayerMovementCodeBlock" ) {
            if( dataInput.user == loggedUser ) {
                gProjects.code[dataInput.pID].moveKeyBind.splice( dataInput.whichI, 1 );
                updateCodeBlocks(dataInput.pID);
                saveProjectShou()
            }
        } else if( dataInput.type == "deletePlayerDirectionCodeBlock" ) {
            if( dataInput.user == loggedUser ) {
                gProjects.code[dataInput.pID].directionKeyBind.splice( dataInput.whichI, 1 );
                updateCodeBlocks(dataInput.pID);
                saveProjectShou()
            }
        } else if( dataInput.type == "updatePlayerMovementKeyBindOption" ) {
            if( dataInput.user == loggedUser ) {
                gProjects.code[dataInput.pID].moveKeyBind[dataInput.whichI].keyCodeA = parseInt(dataInput.keyCodeAA);
                updateCodeBlocks(dataInput.pID);
                saveProjectShou()
            }
        } else if( dataInput.type == "updateRLdirectionPlayer" ) {
            if( dataInput.user == loggedUser ) {
                if( dataInput.whichDirection == "right" ) {
                    gProjects.code[dataInput.pID].moveKeyBind[dataInput.whichI].toX = Math.abs(parseInt(gProjects.code[dataInput.pID].moveKeyBind[dataInput.whichI].toX));
                } else {
                    gProjects.code[dataInput.pID].moveKeyBind[dataInput.whichI].toX = -1 * Math.abs(parseInt(gProjects.code[dataInput.pID].moveKeyBind[dataInput.whichI].toX));
                }
                updateCodeBlocks(dataInput.pID);
                saveProjectShou()
            }
        } else if( dataInput.type == "updateUDdirectionPlayer" ) {
            if( dataInput.user == loggedUser ) {
                if( dataInput.whichDirection == "up" ) {
                    gProjects.code[dataInput.pID].moveKeyBind[dataInput.whichI].toY = Math.abs(parseInt(gProjects.code[dataInput.pID].moveKeyBind[dataInput.whichI].toY));
                } else {
                    gProjects.code[dataInput.pID].moveKeyBind[dataInput.whichI].toY = -1 * Math.abs(parseInt(gProjects.code[dataInput.pID].moveKeyBind[dataInput.whichI].toY));
                }
                updateCodeBlocks(dataInput.pID);
                saveProjectShou()
            }
        } else if( dataInput.type == "changeRLspeedPlayer" ) {
            if( dataInput.user == loggedUser ) {
                gProjects.code[dataInput.pID].moveKeyBind[dataInput.whichI].toX = parseInt(dataInput.speed);
            }
        } else if( dataInput.type == "changeUDspeedPlayer" ) {
            if( dataInput.user == loggedUser ) {
                gProjects.code[dataInput.pID].moveKeyBind[dataInput.whichI].toY = parseInt(dataInput.speed);
            }
        } else if( dataInput.type == "changeWhatToMovePlayer" ) {
            if( dataInput.user == loggedUser ) {
                if( dataInput.which == "always" ) {
                    document.getElementById("whatToMove").selectedIndex = 1;
                    gProjects.code[dataInput.pID].moveWhen = "always";
                } else {
                    document.getElementById("whatToMove").selectedIndex = 0;
                    gProjects.code[dataInput.pID].moveWhen = "buttonPress";
                }
                changeWhatToMoveCondition();
                saveProjectShou()
            }
        } else if( dataInput.type == "updateKeyForDirectionKeyBindBlock" ) {
            if( dataInput.user == loggedUser ) {
                gProjects.code[dataInput.pID].directionKeyBind[dataInput.whichI].keyCodeB = parseInt(dataInput.value);
                updateCodeBlocks(dataInput.pID);
                saveProjectShou()
            }
        } else if( dataInput.type == "updateRLdirectionPlayerChoose" ) {
            if( dataInput.user == loggedUser ) {
                if( dataInput.value == "right" ) {
                    gProjects.code[dataInput.pID].directionKeyBind[dataInput.whichI].directionRL = "right";
                } else {
                    gProjects.code[dataInput.pID].directionKeyBind[dataInput.whichI].directionRL = "left";
                }
            }
        } else if( dataInput.type == "updateUDdirectionPlayerChoose" ) {
            if( dataInput.user == loggedUser ) {
                if( dataInput.value == "up" ) {
                    gProjects.code[dataInput.pID].directionKeyBind[dataInput.whichI].directionUD = "up";
                } else {
                    gProjects.code[dataInput.pID].directionKeyBind[dataInput.whichI].directionUD = "down";
                }
            }
        } else if( dataInput.type == "RLmoveOrNotUpdate" ) {
            if( dataInput.user == loggedUser ) {
                if( dataInput.value == "noMove" ) {
                    gProjects.code[dataInput.pID].directionKeyBind[dataInput.whichI].moveRL = false;
                } else if( dataInput.value == "yesMove" ) {
                    gProjects.code[dataInput.pID].directionKeyBind[dataInput.whichI].moveRL = true;
                }
                updateCodeBlocks(dataInput.pID);
                saveProjectShou()
            }
        } else if( dataInput.type == "UDmoveOrNotUpdate" ) {
            if( dataInput.user == loggedUser ) {
                if( dataInput.value == "noMove" ) {
                    gProjects.code[dataInput.pID].directionKeyBind[dataInput.whichI].moveUD = false;
                } else if( dataInput.value == "yesMove" ) {
                    gProjects.code[dataInput.pID].directionKeyBind[dataInput.whichI].moveUD = true;
                }
                saveProjectShou()
                updateCodeBlocks(dataInput.pID);
            }
        } else if( dataInput.type == "whatToCDirUpdate" ) {
            if( dataInput.user == loggedUser ) {
                if( dataInput.value == "always" ) {
                    gProjects.code[dataInput.pID].changeDirWhen = "always";
                } else {
                    gProjects.code[dataInput.pID].changeDirWhen = "buttonPress";
                }
                updateWhenToCDirOption();
                saveProjectShou()
            }
        } else if( dataInput.type == "changePointAppearSettingPlayer" ) {
            if( dataInput.user == loggedUser ) {
                if( dataInput.value == "size" ) {
                    gProjects.code[dataInput.pID].playerAppearPointSettings = "size";
                } else if( dataInput.value == "length" ) {
                    gProjects.code[dataInput.pID].playerAppearPointSettings = "length";
                } else if( dataInput.value == "nothing" ) {
                    gProjects.code[dataInput.pID].playerAppearPointSettings = "nothing";
                }
                updatePlayerPointAppearance();
                saveProjectShou()
            }
        } else if( dataInput.type == "chooseSpriteForPlayerAttack" ) {
            if( dataInput.user == loggedUser ) {
                if( dataInput.value == "axe" ) {
                    gProjects.code[dataInput.pID].playerAttackLibrarySprite = "./assets/samplePack/axe.png";
                } else if( dataInput.value == "sword" ) {
                    gProjects.code[dataInput.pID].playerAttackLibrarySprite = "./assets/samplePack/sword.png";
                } else if( dataInput.value == "flame" ) {
                    gProjects.code[dataInput.pID].playerAttackLibrarySprite = "./assets/samplePack/flame.svg";
                } else if( dataInput.value == "bullet" ) {
                    gProjects.code[dataInput.pID].playerAttackLibrarySprite = "./assets/samplePack/bullet.png";
                }
                updatePlayerAttackLibrarySelectedSprite();
                saveProjectShou()
            }
        } else if( dataInput.type == "chooseSpriteForPlayer" ) {
            if( dataInput.user == loggedUser ) {
                if( dataInput.value == "car" ) {
                    gProjects.code[dataInput.pID].playerLibrarySprite = "./assets/samplePack/car.png";
                } else if( dataInput.value == "tank" ) {
                    gProjects.code[dataInput.pID].playerLibrarySprite = "./assets/samplePack/tank.png";
                } else if( dataInput.value == "plane" ) {
                    gProjects.code[dataInput.pID].playerLibrarySprite = "./assets/samplePack/plane.png";
                } else if( dataInput.value == "person" ) {
                    gProjects.code[dataInput.pID].playerLibrarySprite = "./assets/samplePack/person.png";
                }
                updatePlayerLibrarySelectedSprite();
                saveProjectShou()
            }
        } else if( dataInput.type == "setWhichSourceToUsePlayerAttack" ) {
            if( dataInput.user == loggedUser ) {
                if( dataInput.value == "uploadedImage" ) {
                    gProjects.code[dataInput.pID].usePlayerAttackSprite = "uploadedImage";
                } else if( dataInput.value == "libraryImage" ) {
                    gProjects.code[dataInput.pID].usePlayerAttackSprite = "libraryImage";
                }
                whichSpriteTypeToUseForPlayerAttackUpdate();
                saveProjectShou()
            }
        } else if( dataInput.type == "changePlayerAttackKeyBind" ) {
            if( dataInput.user == loggedUser ) {
                gProjects.code[dataInput.pID].playerAttackSetting.keyCode = parseInt(dataInput.keyCode);
            }
            updatePlayerAttackTriggerKeyCode();
            saveProjectShou()
        } else if( dataInput.type == "changePlayerAttackType" ) {
            if( dataInput.user == loggedUser ) {
                gProjects.code[dataInput.pID].playerAttackSetting.type = dataInput.value;
                updatePlayerAttackTypeSelector();
                saveProjectShou()
            }
        } else if( dataInput.type == "uploadPlayerWeaponImage" ) {
            if( dataInput.user == loggedUser ) {
                gProjects.code[dataInput.pID].playerAttackuploadSprite = dataInput.value;
                updateUploadedDataScheme();
                saveProjectShou()
            }
        } else if( dataInput.type == "updateWhichPlayerSprite" ) {
            if( dataInput.user == loggedUser ) {
                gProjects.code[dataInput.pID].usePlayerSprite = dataInput.value;
                updateWhichPlayerSpriteType();
                saveProjectShou()
            }
        } else if( dataInput.type == "uploadPlayerSprite" ) {
            if( dataInput.user == loggedUser ) {
                gProjects.code[dataInput.pID].playerUploadSprite = dataInput.value;
                updateUploadedDataScheme();
                saveProjectShou()
            }
        } else if( dataInput.type == "uploadCollectablesSprite" ) {
            if( dataInput.user == loggedUser ) {
                gProjects.code[dataInput.pID].collectablesUploadSprite = dataInput.value;
                updateUploadedDataScheme();
                saveProjectShou()
            }
        } else if( dataInput.type == "collectableSpawnOptionUpdate" ) {
            if( dataInput.user == loggedUser ) {
                gProjects.code[dataInput.pID].howCollectablesSpawn = dataInput.value;
                updateHowSpawnSelector();
                saveProjectShou()
            }
        } else if( dataInput.type == "changeHowMuchCollectablesSpawn" ) {
            if( dataInput.user == loggedUser ) {
                gProjects.code[dataInput.pID].howMuchCollectablesSpawn = dataInput.value;
                updateHowMuchSpawnSelector();
                saveProjectShou()
            }
        } else if( dataInput.type == "changeHowManyPointsPerInput" ) {
            if( dataInput.user == loggedUser ) {
                gProjects.code[dataInput.pID].howManyCollectablePoint = parseInt(dataInput.value);
                updateHowManyPointsPerCollectSelector();
                saveProjectShou()
            }
        } else if( dataInput.type == "chooseLibrarySpriteForCollectables" ) {
            if( dataInput.user == loggedUser ) {
                if( dataInput.value == "coin" ) {
                    gProjects.code[dataInput.pID].collectablesLibrarySprite = "./assets/samplePack/coin.png";
                } else if( dataInput.value == "apple" ) {
                    gProjects.code[dataInput.pID].collectablesLibrarySprite = "./assets/samplePack/apple.png";
                } else if( dataInput.value == "orange" ) {
                    gProjects.code[dataInput.pID].collectablesLibrarySprite = "./assets/samplePack/orange.png";
                } else if( dataInput.value == "peach" ) {
                    gProjects.code[dataInput.pID].collectablesLibrarySprite = "./assets/samplePack/peach.png";
                }
                updateLibraryCollectableSpriteSelector();
                saveProjectShou()
            }
        } else if( dataInput.type == "whichUseCollectable" ) {
            if( dataInput.user == loggedUser ) {
                gProjects.code[dataInput.pID].collectablesSpriteType = dataInput.value;
                updateCollectablesSpriteTypeSelector();
                saveProjectShou()
            }
        } else if( dataInput.type == "whichLibraryFloorTexture" ) {
            if( dataInput.user == loggedUser ) {
                if( dataInput.value == 'hexagon' ) {
                    gProjects.code[dataInput.pID].floorLibrarySprite = "./assets/samplePack/hexagon.png";
                } else {
                    gProjects.code[dataInput.pID].floorLibrarySprite = "./assets/samplePack/grass.png";
                }
                updateWhichLibraryTextureSelected();
            }
        } else if( dataInput.type == "uploadFloorTexture" ) {
            if( dataInput.user == loggedUser ) {
                gProjects.code[dataInput.pID].floorUploadSprite = dataInput.value;
            }
            saveProjectShou()
            updateUploadedFloorTexturePreview();
        } else if( dataInput.type == "whichTouseForFloorTextureUpdate" ) {
            if( dataInput.user == loggedUser ) {
                gProjects.code[dataInput.pID].useFloorTexture = dataInput.value;
                saveProjectShou()
                updateWhichFloorTextureTypeUseSelector();
            }
        } else if( dataInput.type == "updateWhichTypeOfTitleImageToUseSelector" ) {
            if( dataInput.user == loggedUser ) {
                gProjects.code[dataInput.pID].useGameTitle = dataInput.value;
                saveProjectShou()
                updateWhichTitleTypeToUseSelector();
            }
        } else if( dataInput.type == "uploadGameTitleImage" ) {
            if( dataInput.user == loggedUser ) {
                gProjects.code[dataInput.pID].uploadedGameTitleImage = dataInput.value;
                saveProjectShou()
                updateUploadedGameTitleImagePreview();
            }
        }
    });
}

updateData();
