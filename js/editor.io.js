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
        }
    });
}

updateData();
