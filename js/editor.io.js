var db = new Firebase("https://makeio.firebaseio.com/");

var updateData = function () {
    db.on('child_added', function (snapshot) {
        var dataInput = snapshot.val();
        if( dataInput.type == "acc" ) {
            acc.usr.push(dataInput.usr);
            acc.psw.push(dataInput.psw);
        } else if (dataInput.type == "makeNewGame" ) {
            console.log(dataInput.user);
            console.log(dataInput.user == loggedUser);
            if( dataInput.user == loggedUser ) {
                gProjects.name.push( dataInput.gname );
                updateGameLaunchers();
            }
        } else if( dataInput.type == "newMoveKeyBind" ) {
            if( dataInput.user == loggedUser ) {
                gProjects.code[dataInput.oprojectID].moveKeyBind.push({ whichKey: "Enter", keyCodeA: 13, toX : 0, toY : 0});
                updateCodeBlocks(dataInput.oprojectID);
            }
        } else if( dataInput.type == "newChangeDirKeyBind" ) {
            if( dataInput.user == loggedUser ) {
                gProjects.code[dataInput.oprojectID].directionKeyBind.push({ keyCodeB: 13, directionRL: "right", moveRL: false, directionUD: "up", moveUD: false });
                updateCodeBlocks(dataInput.oprojectID);
            }
        } else if( dataInput.type == "deletePlayerMovementCodeBlock" ) {
            if( dataInput.user == loggedUser ) {
                gProjects.code[dataInput.pID].moveKeyBind.splice( dataInput.whichI, 1 );
                updateCodeBlocks(dataInput.pID);
            }
        } else if( dataInput.type == "deletePlayerDirectionCodeBlock" ) {
            if( dataInput.user == loggedUser ) {
                gProjects.code[dataInput.pID].directionKeyBind.splice( dataInput.whichI, 1 );
                updateCodeBlocks(dataInput.pID);
            }
        } else if( dataInput.type == "updatePlayerMovementKeyBindOption" ) {
            if( dataInput.user == loggedUser ) {
                gProjects.code[dataInput.pID].moveKeyBind[dataInput.whichI].keyCodeA = parseInt(dataInput.keyCodeAA);
                updateCodeBlocks(dataInput.pID);
            }
        } else if( dataInput.type == "updateRLdirectionPlayer" ) {
            if( dataInput.user == loggedUser ) {
                if( dataInput.whichDirection == "right" ) {
                    gProjects.code[dataInput.pID].moveKeyBind[dataInput.whichI].toX = Math.abs(parseInt(gProjects.code[dataInput.pID].moveKeyBind[dataInput.whichI].toX));
                } else {
                    gProjects.code[dataInput.pID].moveKeyBind[dataInput.whichI].toX = -1 * Math.abs(parseInt(gProjects.code[dataInput.pID].moveKeyBind[dataInput.whichI].toX));
                }
                updateCodeBlocks(dataInput.pID);
            }
        } else if( dataInput.type == "updateUDdirectionPlayer" ) {
            if( dataInput.user == loggedUser ) {
                if( dataInput.whichDirection == "up" ) {
                    gProjects.code[dataInput.pID].moveKeyBind[dataInput.whichI].toY = Math.abs(parseInt(gProjects.code[dataInput.pID].moveKeyBind[dataInput.whichI].toY));
                } else {
                    gProjects.code[dataInput.pID].moveKeyBind[dataInput.whichI].toY = -1 * Math.abs(parseInt(gProjects.code[dataInput.pID].moveKeyBind[dataInput.whichI].toY));
                }
                updateCodeBlocks(dataInput.pID);
            }
        } else if( dataInput.type == "changeRLspeedPlayer" ) {
            if( dataInput.user == loggedUser ) {
                gProjects.code[dataInput.pID].moveKeyBind[dataInput.whichI].toX = dataInput.speed;
            }
        } else if( dataInput.type == "changeUDspeedPlayer" ) {
            if( dataInput.user == loggedUser ) {
                gProjects.code[dataInput.pID].moveKeyBind[dataInput.whichI].toY = dataInput.speed;
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
            }
        } else if( dataInput.type == "updateKeyForDirectionKeyBindBlock" ) {
            if( dataInput.user == loggedUser ) {
                gProjects.code[dataInput.pID].directionKeyBind[dataInput.whichI].keyCodeB = parseInt(dataInput.value);
                updateCodeBlocks(dataInput.pID);
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
            }
        } else if( dataInput.type == "UDmoveOrNotUpdate" ) {
            if( dataInput.user == loggedUser ) {
                if( dataInput.value == "noMove" ) {
                    gProjects.code[dataInput.pID].directionKeyBind[dataInput.whichI].moveUD = false;
                } else if( dataInput.value == "yesMove" ) {
                    gProjects.code[dataInput.pID].directionKeyBind[dataInput.whichI].moveUD = true;
                }
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
            }
        } else if( dataInput.type == "chooseSpriteForPlayerAttack" ) {
            if( dataInput.user == loggedUser ) {
                if( dataInput.value == "axe" ) {
                    gProjects.code[dataInput.pID].playerAttackLibrarySprite = "./assets/samplePack/axe.png";
                } else if( dataInput.value == "sword" ) {
                    gProjects.code[dataInput.pID].playerAttackLibrarySprite = "./assets/samplePack/sword.png";
                } else if( dataInput.value == "flame" ) {
                    gProjects.code[dataInput.pID].playerAttackLibrarySprite = "./assets/samplePack/flame.png";
                } else if( dataInput.value == "bullet" ) {
                    gProjects.code[dataInput.pID].playerAttackLibrarySprite = "./assets/samplePack/bullet.png";
                }
                updatePlayerAttackLibrarySelectedSprite();
            }
        } else if( dataInput.type == "setWhichSourceToUsePlayerAttack" ) {
            if( dataInput.user == loggedUser ) {
                if( dataInput.value == "uploadedImage" ) {
                    gProjects.code[dataInput.pID].usePlayerAttackSprite = "uploadedImage";
                } else if( dataInput.value == "libraryImage" ) {
                    gProjects.code[dataInput.pID].usePlayerAttackSprite = "libraryImage";
                }
                whichSpriteTypeToUseForPlayerAttackUpdate();
            }
        } else if( dataInput.type == "changePlayerAttackKeyBind" ) {
            if( dataInput.user == loggedUser ) {
                gProjects.code[dataInput.pID].playerAttackSetting.keyCode = parseInt(dataInput.keyCode);
            }
            updatePlayerAttackTriggerKeyCode();
        } else if( dataInput.type == "changePlayerAttackType" ) {
            if( dataInput.user == loggedUser ) {
                gProjects.code[dataInput.pID].playerAttackSetting.type = dataInput.value;
                updatePlayerAttackTypeSelector();
            }
        } else if( dataInput.type == "uploadPlayerWeaponImage" ) {
            if( dataInput.user == loggedUser ) {
                gProjects.code[dataInput.pID].playerAttackuploadSprite = dataInput.value;
                updateUploadedDataScheme();
            }
        }
    });
}

updateData();
