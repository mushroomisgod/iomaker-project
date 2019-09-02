var db = new Firebase("https://makeio.firebaseio.com/");

//game object elements variebles
var mainPlayer = document.getElementById("mainPlayer");
var garea = document.getElementById("garea");
var collectablesSpriteWrapper = document.getElementById("collectablesSpriteWrapper");
var otherPlayersWrapper = document.getElementById("otherPlayersWrapper");

var howToPlayWrappers = document.getElementById("howToPlayWrappers");

var urlString = window.location.href;
var urlParams = parseURLParams(urlString);
var loggedUser = urlParams.u[0];
var gameId = parseInt(urlParams.c[0]);
var isHost = false;

var playerPoints = 0;

var rlDirAssist = "none";
var udDirAssist = "up";

var lastRL = "none";
var lastUD = "none"

var udChanged = false;
var rlChanged = false;

var lastDirectionPointed = "null";
var bulletId = 0;
var bulletCooldown = 0;

var bulletManagementClub = [];
var bulletExpireManagement = [];

var bulletTrashedCount = 0;

var respondedManagement;

var respondKingCheck = false;

var cameraPos = {
    x : 2500,
    y : 1500
}

function parseURLParams(url) {
    var queryStart = url.indexOf("?") + 1,
        queryEnd   = url.indexOf("#") + 1 || url.length + 1,
        query = url.slice(queryStart, queryEnd - 1),
        pairs = query.replace(/\+/g, " ").split("&"),
        parms = {}, i, n, v, nv;

    if (query === url || query === "") return;

    for (i = 0; i < pairs.length; i++) {
        nv = pairs[i].split("=", 2);
        n = decodeURIComponent(nv[0]);
        v = decodeURIComponent(nv[1]);

        if (!parms.hasOwnProperty(n)) parms[n] = [];
        parms[n].push(nv.length === 2 ? v : null);
    }
    return parms;
}


var gProjects = {
    name : [],
    code : []
}

var namesRegistered = [];

var myName = "";
var isJoined = false;

var playerData = {
    name : [],
    position : [],
    points : [],
    direction : []
};

var respondedCall = true;

var faultStars = true;

var updateData = function () {
    db.on('child_added', function (snapshot) {
        var dataInput = snapshot.val();
        preInit(faultStars);
        if (dataInput.type == "makeNewGame" ) {
            if( dataInput.user == loggedUser ) {
                gProjects.name.push( dataInput.gname );
                gProjects.code.push( { moveWhen : "buttonPress", moveKeyBindEnabled : true, moveKeyBind: [], changeDirWhen : "buttonPress", directionKeyBindEnabled : false, directionKeyBind : [], playerAppearPointSettings : "size", playerLibrarySprite : "./assets/samplePack/car.png", playerUploadSprite : "none", usePlayerSprite : "libraryImage", playerAttackSetting : { type:"shoot", keyCode:13 }, playerAttackLibrarySprite : "./assets/samplePack/axe.png", playerAttackuploadSprite : "none", usePlayerAttackSprite : "libraryImage", howCollectablesSpawn : "randomPoint", howMuchCollectablesSpawn : "alot", howManyCollectablePoint : 0, collectablesLibrarySprite : "./assets/samplePack/coin.png", collectablesUploadSprite : "none", collectablesSpriteType : "libraryImage", floorLibrarySprite : "./assets/samplePack/hexagon.png", floorUploadSprite : "none", useFloorTexture : "libraryImage", useGameTitle : "text", uploadedGameTitleImage : "none" } );
            }
        } else if( dataInput.type == "newMoveKeyBind" ) {
            if( dataInput.user == loggedUser ) {
                gProjects.code[dataInput.oprojectID].moveKeyBind.push({ whichKey: "Enter", keyCodeA: 13, toX : 0, toY : 0});
            }
        } else if( dataInput.type == "newChangeDirKeyBind" ) {
            if( dataInput.user == loggedUser ) {
                gProjects.code[dataInput.oprojectID].directionKeyBind.push({ keyCodeB: 13, directionRL: "right", moveRL: false, directionUD: "up", moveUD: false });
            }
        } else if( dataInput.type == "deletePlayerMovementCodeBlock" ) {
            if( dataInput.user == loggedUser ) {
                gProjects.code[dataInput.pID].moveKeyBind.splice( dataInput.whichI, 1 );
            }
        } else if( dataInput.type == "deletePlayerDirectionCodeBlock" ) {
            if( dataInput.user == loggedUser ) {
                gProjects.code[dataInput.pID].directionKeyBind.splice( dataInput.whichI, 1 );
            }
        } else if( dataInput.type == "updatePlayerMovementKeyBindOption" ) {
            if( dataInput.user == loggedUser ) {
                gProjects.code[dataInput.pID].moveKeyBind[dataInput.whichI].keyCodeA = parseInt(dataInput.keyCodeAA);
            }
        } else if( dataInput.type == "updateRLdirectionPlayer" ) {
            if( dataInput.user == loggedUser ) {
                if( dataInput.whichDirection == "right" ) {
                    gProjects.code[dataInput.pID].moveKeyBind[dataInput.whichI].toX = Math.abs(parseInt(gProjects.code[dataInput.pID].moveKeyBind[dataInput.whichI].toX));
                } else {
                    gProjects.code[dataInput.pID].moveKeyBind[dataInput.whichI].toX = -1 * Math.abs(parseInt(gProjects.code[dataInput.pID].moveKeyBind[dataInput.whichI].toX));
                }
            }
        } else if( dataInput.type == "updateUDdirectionPlayer" ) {
            if( dataInput.user == loggedUser ) {
                if( dataInput.whichDirection == "up" ) {
                    gProjects.code[dataInput.pID].moveKeyBind[dataInput.whichI].toY = Math.abs(parseInt(gProjects.code[dataInput.pID].moveKeyBind[dataInput.whichI].toY));
                } else {
                    gProjects.code[dataInput.pID].moveKeyBind[dataInput.whichI].toY = -1 * Math.abs(parseInt(gProjects.code[dataInput.pID].moveKeyBind[dataInput.whichI].toY));
                }
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
                    gProjects.code[dataInput.pID].moveWhen = "always";
                } else {
                    gProjects.code[dataInput.pID].moveWhen = "buttonPress";
                }
            }
        } else if( dataInput.type == "updateKeyForDirectionKeyBindBlock" ) {
            if( dataInput.user == loggedUser ) {
                gProjects.code[gameId].directionKeyBind[parseInt(dataInput.whichI)].keyCodeB = parseInt(dataInput.value);
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
            }
        } else if( dataInput.type == "UDmoveOrNotUpdate" ) {
            if( dataInput.user == loggedUser ) {
                if( dataInput.value == "noMove" ) {
                    gProjects.code[dataInput.pID].directionKeyBind[dataInput.whichI].moveUD = false;
                } else if( dataInput.value == "yesMove" ) {
                    gProjects.code[dataInput.pID].directionKeyBind[dataInput.whichI].moveUD = true;
                }
            }
        } else if( dataInput.type == "whatToCDirUpdate" ) {
            if( dataInput.user == loggedUser ) {
                if( dataInput.value == "always" ) {
                    gProjects.code[dataInput.pID].changeDirWhen = "always";
                } else {
                    gProjects.code[dataInput.pID].changeDirWhen = "buttonPress";
                }
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
            }
        } else if( dataInput.type == "setWhichSourceToUsePlayerAttack" ) {
            if( dataInput.user == loggedUser ) {
                if( dataInput.value == "uploadedImage" ) {
                    gProjects.code[dataInput.pID].usePlayerAttackSprite = "uploadedImage";
                } else if( dataInput.value == "libraryImage" ) {
                    gProjects.code[dataInput.pID].usePlayerAttackSprite = "libraryImage";
                }
            }
        } else if( dataInput.type == "changePlayerAttackKeyBind" ) {
            if( dataInput.user == loggedUser ) {
                gProjects.code[dataInput.pID].playerAttackSetting.keyCode = parseInt(dataInput.keyCode);
            }
        } else if( dataInput.type == "changePlayerAttackType" ) {
            if( dataInput.user == loggedUser ) {
                gProjects.code[dataInput.pID].playerAttackSetting.type = dataInput.value;
            }
        } else if( dataInput.type == "uploadPlayerWeaponImage" ) {
            if( dataInput.user == loggedUser ) {
                gProjects.code[dataInput.pID].playerAttackuploadSprite = dataInput.value;
            }
        } else if( dataInput.type == "updateWhichPlayerSprite" ) {
            if( dataInput.user == loggedUser ) {
                gProjects.code[dataInput.pID].usePlayerSprite = dataInput.value;
            }
        } else if( dataInput.type == "uploadPlayerSprite" ) {
            if( dataInput.user == loggedUser ) {
                gProjects.code[dataInput.pID].playerUploadSprite = dataInput.value;
            }
        } else if( dataInput.type == "uploadCollectablesSprite" ) {
            if( dataInput.user == loggedUser ) {
                gProjects.code[dataInput.pID].collectablesUploadSprite = dataInput.value;
            }
        } else if( dataInput.type == "collectableSpawnOptionUpdate" ) {
            if( dataInput.user == loggedUser ) {
                gProjects.code[dataInput.pID].howCollectablesSpawn = dataInput.value;
            }
        } else if( dataInput.type == "changeHowMuchCollectablesSpawn" ) {
            if( dataInput.user == loggedUser ) {
                gProjects.code[dataInput.pID].howMuchCollectablesSpawn = dataInput.value;
            }
        } else if( dataInput.type == "changeHowManyPointsPerInput" ) {
            if( dataInput.user == loggedUser ) {
                gProjects.code[dataInput.pID].howManyCollectablePoint = parseInt(dataInput.value);
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
            }
        } else if( dataInput.type == "whichUseCollectable" ) {
            if( dataInput.user == loggedUser ) {
                gProjects.code[dataInput.pID].collectablesSpriteType = dataInput.value;
            }
        } else if( dataInput.type == "whichLibraryFloorTexture" ) {
            if( dataInput.user == loggedUser ) {
                if( dataInput.value == 'hexagon' ) {
                    gProjects.code[dataInput.pID].floorLibrarySprite = "./assets/samplePack/hexagon.png";
                    updateFloorTexture();
                } else {
                    gProjects.code[dataInput.pID].floorLibrarySprite = "./assets/samplePack/grass.png";
                    updateFloorTexture();
                }
            }
        } else if( dataInput.type == "uploadFloorTexture" ) {
            if( dataInput.user == loggedUser ) {
                gProjects.code[dataInput.pID].floorUploadSprite = dataInput.value;
            }
        } else if( dataInput.type == "whichTouseForFloorTextureUpdate" ) {
            if( dataInput.user == loggedUser ) {
                gProjects.code[dataInput.pID].useFloorTexture = dataInput.value;
                updateFloorTexture();
            }
        } else if( dataInput.type == "updateWhichTypeOfTitleImageToUseSelector" ) {
            if( dataInput.user == loggedUser ) {
                gProjects.code[dataInput.pID].useGameTitle = dataInput.value;
            }
        } else if( dataInput.type == "uploadGameTitleImage" ) {
            if( dataInput.user == loggedUser ) {
                gProjects.code[dataInput.pID].uploadedGameTitleImage = dataInput.value;
            }
        }

        //game server
        if( dataInput.type == "newplayerjoin" ) {
            if( dataInput.gameCreator == loggedUser && dataInput.gameId == gameId ) {
                playerData.name.push(dataInput.playerName);
                playerData.position.push("0,0");
                playerData.points.push(0);
                if( dataInput.playerName != myName ) {
                    var spritey;
                    if( gProjects.code[gameId].usePlayerSprite == "libraryImage" ) {
                        spritey = gProjects.code[gameId].playerLibrarySprite;
                    } else {
                        spritey = gProjects.code[gameId].playerUploadSprite;
                    }
                    otherPlayersWrapper.innerHTML += "<img src='"+spritey+"' class='oPlayerSprite' id='otherPlayerSprite!"+dataInput.playerName+"'>";
                }
            }
        } else if( dataInput.type == "playerPositionUpdate" ) {
            if( dataInput.gameCreator == loggedUser && dataInput.gameId == gameId ) {
                var arrayPlayerPosA = playerData.name.indexOf( dataInput.playerName );
                playerData.position[arrayPlayerPosA] = dataInput.positionData;
            }
        } else if( dataInput.type == "checkAliveMsg" ) {
            if( dataInput.gameCreator == loggedUser && dataInput.gameId == gameId && dataInput.playerName == myName ) {
                db.push({ type:"confirmAliveMsg",gameCreator:loggedUser,gameId:gameId,cha:myName,reciever:dataInput.sentBy });
            }
        } else if( dataInput.type == "confirmAliveMsg" ) {
            if(  dataInput.gameCreator == loggedUser && dataInput.gameId == gameId && dataInput.reciever == myName ) {
                respondedManagement[playerData.name.indexOf(dataInput.cha)] = true;
            }
        } else if( dataInput.type == "killPlayer" ) {
            if( dataInput.gameCreator == loggedUser && dataInput.gameId == gameId ) {
                var killingName = dataInput.playerName;
                if( document.getElementById("otherPlayerSprite!"+killingName) != null ) {
                    document.getElementById("otherPlayerSprite!"+killingName).remove();
                }
                var arrayPlayerPos = playerData.name.indexOf( killingName );
                if( arrayPlayerPos != -1 ) {
                    playerData.name.splice( arrayPlayerPos, 1 );
                    playerData.position.splice( arrayPlayerPos, 1 );
                    playerData.points.splice( arrayPlayerPos, 1 );
                }

                if( gProjects.code[gameId].howCollectablesSpawn != "randomPoint" ) {

                }
            }
        } else if( dataInput.type == "playerPointsUpdate" ) {
            if( dataInput.gameCreator == loggedUser && dataInput.gameId == gameId ) {
                var arrayPlayerPosB = playerData.name.indexOf( dataInput.playerName );
                playerData.points[arrayPlayerPosB] = parseInt(dataInput.pointsData);
            }
        } else if( dataInput.type == "damagePlayer" ) {
            if( dataInput.gameCreator == loggedUser && dataInput.gameId == gameId ) {
                if( dataInput.playerName == myName ) {
                    playerPoints -= gProjects.code[gameId].howManyCollectablePoint*2;
                    document.getElementById("howManyPlayerPoints").innerHTML = playerPoints;
                }
            }
        } else if( dataInput.type == "checkKingVitality" ) {
            if( playerData.name.indexOf(myName) == 0 ) {
                if( dataInput.gameCreator == loggedUser && dataInput.gameId == gameId ) {
                    db.push({type:"confirmVitaliy",gameCreator:loggedUser,gameId:gameId,to:dataInput.by});
                }
            }
        } else if( dataInput.type == "confirmVitaliy" ) {
            if( dataInput.gameCreator == loggedUser && dataInput.gameId == gameId ) {
                if( dataInput.to == myName ) {
                    respondKingCheck = true;
                }
            }
        }
    });
}
updateData();

function initG() {
    //initiate game interface setting, according to user code
    //load game game title
    if( gProjects.code[gameId].useGameTitle == "text" ) {
        //hide image titkle show wrapper
        document.getElementById("imageT").style.display = "none";
        //change template name
        document.getElementById("textBasedTitle").innerHTML = gProjects.name[gameId];
    } else  {
        document.getElementById("imageT").style.display = "block";
        document.getElementById("textT").style.display = "none";
        document.getElementById("gameTitleImageHolder").src = gProjects.code[gameId].uploadedGameTitleImage;
    }

    //chenge tab title
    document.title = gProjects.name[gameId] + ".io";

    //alive check manager
    respondedManagement = [];
    for( i=0; i<playerData.name.length; i++ ) {
        respondedManagement.push(false);
    }

    //how to play update
    //if buttonPress movement setting
    var movementControlConfirm;
    var attackControlConfirm;

    if( gProjects.code[gameId].moveWhen == "buttonPress" ) {
        howToPlayWrappers.innerHTML = "";
        if( gProjects.code[gameId].moveKeyBind.length != 0 ) {
            var whichDirectionToGo;
            for( i=0; i<gProjects.code[gameId].moveKeyBind.length; i++ ) {
                var keyBindData = allKeyCodeReverse[allKeyCodeList.indexOf(gProjects.code[gameId].moveKeyBind[i].keyCodeA)];
                if( parseInt(gProjects.code[gameId].moveKeyBind[i].toX) < 0 && parseInt(gProjects.code[gameId].moveKeyBind[i].toY) == 0 ) {
                    whichDirectionToGo = "左";
                } else if( parseInt(gProjects.code[gameId].moveKeyBind[i].toX) > 0 && parseInt(gProjects.code[gameId].moveKeyBind[i].toY) == 0 ) {
                    whichDirectionToGo = "右";
                } else if( parseInt(gProjects.code[gameId].moveKeyBind[i].toX) == 0 && parseInt(gProjects.code[gameId].moveKeyBind[i].toY) < 0 ) {
                    whichDirectionToGo = "下";
                } else if( parseInt(gProjects.code[gameId].moveKeyBind[i].toX) == 0 && parseInt(gProjects.code[gameId].moveKeyBind[i].toY) > 0 ) {
                    whichDirectionToGo = "上";
                } else if(　parseInt(gProjects.code[gameId].moveKeyBind[i].toX) < 0 && parseInt(gProjects.code[gameId].moveKeyBind[i].toY) < 0　) {
                    whichDirectionToGo = "左下"
                } else if(　parseInt(gProjects.code[gameId].moveKeyBind[i].toX) > 0 && parseInt(gProjects.code[gameId].moveKeyBind[i].toY) < 0　) {
                    whichDirectionToGo = "右下"
                } else if(　parseInt(gProjects.code[gameId].moveKeyBind[i].toX) < 0 && parseInt(gProjects.code[gameId].moveKeyBind[i].toY) > 0　) {
                    whichDirectionToGo = "左上"
                } else if(　parseInt(gProjects.code[gameId].moveKeyBind[i].toX) > 0 && parseInt(gProjects.code[gameId].moveKeyBind[i].toY) > 0　) {
                    whichDirectionToGo = "右上"
                }
                howToPlayWrappers.innerHTML += "<strong class='keyButtonSpan'>" + keyBindData + "</strong>: "+whichDirectionToGo+"へ移動<br>";
            }
            movementControlConfirm = true;
        } else {
            movementControlConfirm = false;
        }
    } else if( gProjects.code[gameId].moveWhen == "always" ) {
        if( gProjects.code[gameId].changeDirWhen == "always" ) {
            howToPlayWrappers.innerHTML = "マウスで移動<br>";
        } else {
            howToPlayWrappers.innerHTML = "";
            for( i=0; i<gProjects.code[gameId].directionKeyBind.length; i++ ) {
                var keyBindWhich = allKeyCodeReverse[allKeyCodeList.indexOf(gProjects.code[gameId].directionKeyBind[i].keyCodeB)];
                if( gProjects.code[gameId].directionKeyBind[i].moveRL == true ) {
                    var rlD = gProjects.code[gameId].directionKeyBind[i].directionRL;
                } else {
                    var rlD = "none";
                }
                if( gProjects.code[gameId].directionKeyBind[i].moveUD == true ) {
                    var udD = gProjects.code[gameId].directionKeyBind[i].directionUD;
                } else {
                    var udD = "none";
                }
                var whichDir = "null";
                if( rlD == "right" ) {
                    if( udD == "up" ) {
                        whichDir = "右上";
                    } else if( udD == "down" ) {
                        whichDir = "右下";
                    } else {
                        whichDir = "右";
                    }
                } else if( rlD == "left" ) {
                    if( udD == "up" ) {
                        whichDir = "左上";
                    } else if( udD == "down" ) {
                        whichDir = "左下";
                    } else {
                        whichDir = "左";
                    }
                } else {
                    if( udD == "up" ) {
                        whichDir = "上";
                    } else if( udD == "down" ) {
                        whichDir = "下";
                    } else {
                        whichDir = "上";
                    }
                }
                howToPlayWrappers.innerHTML += "<strong class='keyButtonSpan'>" + keyBindWhich + "</strong>: "+whichDir+"へ方向を変える<br>";
            }
        }
    }

    //attack how to play stuff
    if( movementControlConfirm = false ) {
        howToPlayWrappers.innerHTML = "";
    }

    howToPlayWrappers.innerHTML += "<strong class='keyButtonSpan'>" + allKeyCodeReverse[allKeyCodeList.indexOf(gProjects.code[gameId].playerAttackSetting.keyCode)] + "</strong>: 攻撃する";

    //player settings inititatw
    //load player playerSprite
    if( gProjects.code[gameId].usePlayerSprite == "libraryImage" ) {
        mainPlayer.src = gProjects.code[gameId].playerLibrarySprite;
    } else {
        mainPlayer.src = gProjects.code[gameId].playerUploadSprite;
    }
    //now align the player sprite position to center of the screen
    mainPlayer.style.top = window.innerHeight/2 - 95 + "px";
    mainPlayer.style.left = window.innerWidth/2 - 83 - mainPlayer.offsetWidth/2 + "px";

    //useer position,  aka camera setting
    //take user to random point in map
    cameraPos.x = Math.floor(getRandomArbitrary( -4000, -1000 )/100)*100;
    cameraPos.y = Math.floor(getRandomArbitrary( -2000, -1000 )/100)*100;
    //update the gArea to that place for better scenery
    garea.style.top = cameraPos.y + "px";
    garea.style.left = cameraPos.x + "px";


}
var gCode;
function preInit(zekk) {
    if( zekk == true ) {
        faultStars = false;
        setTimeout( function () {
            initG();
            document.getElementById("loadingCurtain").style.display = "none";

            gCode = gProjects.code[gameId];

            //collectables spawn function

            maintainCollectablesToRandomPoint();
        }, 1000)
    }
}

document.getElementById("nickput").onkeyup = function () {
    if( document.getElementById("nickput").value.length != 0 && playerData.name.indexOf(document.getElementById("nickput").value) == -1 ) {
        document.getElementById("joinGameBtn").disabled = false;
    } else {
        document.getElementById("joinGameBtn").disabled = true;
    }
}

document.getElementById("joinGameBtn").onclick = function () {
    myName = document.getElementById("nickput").value;
    isJoined = true;
    document.getElementById("introG").style.display = "none";

    db.push({type:"newplayerjoin",gameCreator:loggedUser,gameId:gameId,playerName:document.getElementById("nickput").value});

    gameLoop();
    repondDoind();
}

//random number function is useful
function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}

var playerAddSize = 0;

function gameLoop() {

    //player actual position, but floored
    var pX = Math.floor( ((cameraPos.x*-1)+(window.innerWidth/2))/100 )*100;
    var pY = Math.floor( ((cameraPos.y*-1)+(window.innerHeight/2))/100)*100;


    mainPlayer.style.top = pY + "px";
    mainPlayer.style.left = pX + "px";

    document.getElementById("playerHitBox").style.top = pY + "px";
    document.getElementById("playerHitBox").style.left = pX + "px";


    //player movement
    if( gCode.moveWhen == "buttonPress" ) {
        for( i=0;i<gProjects.code[gameId].moveKeyBind.length;i++ ) {
            if( downKeyholder.indexOf(gProjects.code[gameId].moveKeyBind[i].keyCodeA) != -1 ) {
                var pickUped = false;
                cameraPos.x -= parseInt(gProjects.code[gameId].moveKeyBind[i].toX)*100;
                cameraPos.y += parseInt(gProjects.code[gameId].moveKeyBind[i].toY)*100;

                cameraPos.x = Math.floor(cameraPos.x/100)*100;
                cameraPos.y = Math.floor(cameraPos.y/100)*100;

                //update direction
                if( parseInt(gProjects.code[gameId].moveKeyBind[i].toX) > 0 ) {
                    lastRL = "right";
                } else if( parseInt(gProjects.code[gameId].moveKeyBind[i].toX) < 0 ) {
                    lastRL = "left";
                }

                if( parseInt(gProjects.code[gameId].moveKeyBind[i].toY) > 0 ) {
                    lastUD = "up";
                } else if( parseInt(gProjects.code[gameId].moveKeyBind[i].toY) < 0 ) {
                    lastUD = "down";
                }

                lastDirectionPointed = lastRL + "," + lastUD;
            }
        }
    } else if( gCode.moveWhen == "always" ) {
        if( gCode.changeDirWhen == "always" ) {
            var mainPCenterX = window.innerWidth/2;
            var mainPCenterY = window.innerHeight/2;

            if( (mainPCenterX-30)<mousePosX && (mainPCenterX+30)>mousePosX ) {
                cameraPos.x -= 0; //this has no meaning
            } else if( (mainPCenterX-30)>mousePosX ) {
                cameraPos.x += 50;
                var pickUped = false;
                lastRL = "left";
            } else if( (mainPCenterX+30)<mousePosX ) {
                cameraPos.x -= 50;
                var pickUped = false;
                lastRL = "right";
            }

            if( (mainPCenterY-30)<mousePosY && (mainPCenterY+30)>mousePosY ) {
                cameraPos.y -= 0; //this has no meaning
            } else if( (mainPCenterY-30)>mousePosY ) {
                cameraPos.y += 50;
                var pickUped = false;
                lastUD = "up";
            } else if( (mainPCenterY+30)<mousePosY ) {
                cameraPos.y -= 50;
                var pickUped = false;
                lastUD = "down";
            }
            lastDirectionPointed = lastRL + "," + lastUD;
        } else {
            if( rlDirAssist == "right" ) {
                cameraPos.x -= 50;
                var pickUped = false;
                lastRL = "right";
            } else if( rlDirAssist == "left" ) {
                cameraPos.x += 50;
                var pickUped = false;
                lastRL = "left";
            } else {
                cameraPos.x += 0;
                lastRL = "none";
            }

            if( udDirAssist == "up" ) {
                cameraPos.y += 50;
                var pickUped = false;
                lastUD = "up";
            } else if( udDirAssist == "down" ) {
                cameraPos.y -= 50;
                var pickUped = false;
                lastUD = "down";
            } else {
                cameraPos.y += 0;
                lastUD = "none";
            }

            lastDirectionPointed = lastRL + "," + lastUD;

            for( i=0;i<gCode.directionKeyBind.length;i++ ) {
                if( downKeyholder.indexOf(gCode.directionKeyBind[i].keyCodeB) != -1 ) {
                    if( gCode.directionKeyBind[i].moveRL == true ) {
                        if( gCode.directionKeyBind[i].directionRL == "right" ) {
                            rlDirAssist = "right";
                        } else {
                            rlDirAssist = "left";
                        }
                    } else {
                        rlDirAssist = "none";
                    }
                    if( gCode.directionKeyBind[i].moveUD == true ) {
                        if( gCode.directionKeyBind[i].directionUD == "up" ) {
                            udDirAssist = "up";
                        } else {
                            udDirAssist = "down";
                        }
                    } else {
                        udDirAssist = "none";
                    }
                }
            }
        }
    }

    if( lastDirectionPointed == "right,none" ) {
        mainPlayer.style.transform = "rotate(90deg)";
    } else if( lastDirectionPointed == "left,none" ) {
        mainPlayer.style.transform = "rotate(-90deg)";
    } else if( lastDirectionPointed == "none,up" ) {
        mainPlayer.style.transform = "rotate(0deg)";
    } else if( lastDirectionPointed == "none,down" ) {
        mainPlayer.style.transform = "rotate(180deg)";
    } else if( lastDirectionPointed == "right,up" ) {
        mainPlayer.style.transform = "rotate(45deg)";
    } else if( lastDirectionPointed == "left,up" ) {
        mainPlayer.style.transform = "rotate(-45deg)";
    } else if( lastDirectionPointed == "left,down" ) {
        mainPlayer.style.transform = "rotate(-135deg)";
    } else if( lastDirectionPointed == "right,down" ) {
        mainPlayer.style.transform = "rotate(135deg)";
    }

    lastRL = "none";
    lastUD = "none";

    //player attack
    if( downKeyholder.indexOf(gCode.playerAttackSetting.keyCode) != -1 ) {
        if( gCode.playerAttackSetting.type == "shoot" ) {
            if( playerPoints >= 10 ) {
                if( gCode.usePlayerAttackSprite == "libraryImage" ) {
                    var bulletStartX = Math.floor(pX/100)*100;
                    var bulletStartY = Math.floor(pY/100)*100;
                    document.getElementById("bulletWrapper").innerHTML += "<img id='bulletContent"+bulletId+"' src='" + gCode.playerAttackLibrarySprite + "' class='bulletAppearHolder' style='top: "+bulletStartY+"px; left: "+bulletStartX+"px;'>";
                    bulletManagementClub.push( lastDirectionPointed );
                    bulletExpireManagement.push( 0 );
                    bulletId += 1;
                    if( gCode.howCollectablesSpawn == "randomPoint" ) {
                        playerPoints -= 10;
                    }
                    document.getElementById("howManyPlayerPoints").innerHTML = playerPoints;
                } else {
                    var bulletStartX = Math.floor(pX/100)*100;
                    var bulletStartY = Math.floor(pY/100)*100;
                    document.getElementById("bulletWrapper").innerHTML += "<img id='bulletContent"+bulletId+"' src='" + gCode.playerAttackuploadSprite + "' class='bulletAppearHolder' style='top: "+bulletStartY+"px; left: "+bulletStartX+"px;'>";
                    bulletManagementClub.push( lastDirectionPointed );
                    bulletExpireManagement.push( 0 );
                    bulletId += 1;
                    playerPoints -= 10;
                    document.getElementById("howManyPlayerPoints").innerHTML = playerPoints;
                }
            }
        }
    }

    var bulletRemoveMachine = 0;

    //update bullets
    if( gCode.playerAttackSetting.type == "shoot" ) {
        for( i=0;i<bulletManagementClub.length;i++ ) {
            if( bulletExpireManagement[i] < 6 ) {
                if( bulletManagementClub[i] == "right,none" ) {
                    document.getElementById("bulletContent"+(i+bulletTrashedCount)).style.top = parseInt(document.getElementById("bulletContent"+(i+bulletTrashedCount)).style.top) + "px";
                    document.getElementById("bulletContent"+(i+bulletTrashedCount)).style.left = parseInt(document.getElementById("bulletContent"+(i+bulletTrashedCount)).style.left) + 100 + "px";
                    document.getElementById("bulletContent"+(i+bulletTrashedCount)).style.transform = "rotate(90deg)";
                } else if( bulletManagementClub[i] == "right,up" ) {
                    document.getElementById("bulletContent"+(i+bulletTrashedCount)).style.top = parseInt(document.getElementById("bulletContent"+(i+bulletTrashedCount)).style.top) - 100 + "px";
                    document.getElementById("bulletContent"+(i+bulletTrashedCount)).style.left = parseInt(document.getElementById("bulletContent"+(i+bulletTrashedCount)).style.left) + 100 + "px";
                    document.getElementById("bulletContent"+(i+bulletTrashedCount)).style.transform = "rotate(45deg)";
                } else if( bulletManagementClub[i] == "left,up" ) {
                    document.getElementById("bulletContent"+(i+bulletTrashedCount)).style.top = parseInt(document.getElementById("bulletContent"+(i+bulletTrashedCount)).style.top) - 100 + "px";
                    document.getElementById("bulletContent"+(i+bulletTrashedCount)).style.left = parseInt(document.getElementById("bulletContent"+(i+bulletTrashedCount)).style.left) - 100 + "px";
                    document.getElementById("bulletContent"+(i+bulletTrashedCount)).style.transform = "rotate(-45deg)";
                } else if( bulletManagementClub[i] == "right,down" ) {
                    document.getElementById("bulletContent"+(i+bulletTrashedCount)).style.top = parseInt(document.getElementById("bulletContent"+(i+bulletTrashedCount)).style.top) + 100 + "px";
                    document.getElementById("bulletContent"+(i+bulletTrashedCount)).style.left = parseInt(document.getElementById("bulletContent"+(i+bulletTrashedCount)).style.left) + 100 + "px";
                    document.getElementById("bulletContent"+(i+bulletTrashedCount)).style.transform = "rotate(135deg)";
                } else if( bulletManagementClub[i] == "left,down" ) {
                    document.getElementById("bulletContent"+(i+bulletTrashedCount)).style.top = parseInt(document.getElementById("bulletContent"+(i+bulletTrashedCount)).style.top) + 100 + "px";
                    document.getElementById("bulletContent"+(i+bulletTrashedCount)).style.left = parseInt(document.getElementById("bulletContent"+(i+bulletTrashedCount)).style.left) - 100 + "px";
                    document.getElementById("bulletContent"+(i+bulletTrashedCount)).style.transform = "rotate(-135deg)";
                } else if( bulletManagementClub[i] == "none,up" ) {
                    document.getElementById("bulletContent"+(i+bulletTrashedCount)).style.top = parseInt(document.getElementById("bulletContent"+(i+bulletTrashedCount)).style.top) - 100 + "px";
                    document.getElementById("bulletContent"+(i+bulletTrashedCount)).style.left = parseInt(document.getElementById("bulletContent"+(i+bulletTrashedCount)).style.left) + "px";
                    document.getElementById("bulletContent"+(i+bulletTrashedCount)).style.transform = "rotate(0deg)";
                } else if( bulletManagementClub[i] == "none,down" ) {
                    document.getElementById("bulletContent"+(i+bulletTrashedCount)).style.top = parseInt(document.getElementById("bulletContent"+(i+bulletTrashedCount)).style.top) + 100 + "px";
                    document.getElementById("bulletContent"+(i+bulletTrashedCount)).style.left = parseInt(document.getElementById("bulletContent"+(i+bulletTrashedCount)).style.left) + "px";
                    document.getElementById("bulletContent"+(i+bulletTrashedCount)).style.transform = "rotate(180deg)";
                } else if( bulletManagementClub[i] == "left,none" ) {
                    document.getElementById("bulletContent"+(i+bulletTrashedCount)).style.top = parseInt(document.getElementById("bulletContent"+(i+bulletTrashedCount)).style.top) + "px";
                    document.getElementById("bulletContent"+(i+bulletTrashedCount)).style.left = parseInt(document.getElementById("bulletContent"+(i+bulletTrashedCount)).style.left) - 100 + "px";
                    document.getElementById("bulletContent"+(i+bulletTrashedCount)).style.transform = "rotate(-90deg)";
                } else if( bulletManagementClub[i] == "none,none" ) {
                    document.getElementById("bulletContent"+(i+bulletTrashedCount)).style.top = parseInt(document.getElementById("bulletContent"+(i+bulletTrashedCount)).style.top) - 100 + "px";
                    document.getElementById("bulletContent"+(i+bulletTrashedCount)).style.left = parseInt(document.getElementById("bulletContent"+(i+bulletTrashedCount)).style.left) + "px";
                    document.getElementById("bulletContent"+(i+bulletTrashedCount)).style.transform = "rotate(0deg)";
                }
                bulletExpireManagement[i] += 1;
            } else {
                bulletRemoveMachine += 1;
            }
        }
        for( i=0;i<bulletRemoveMachine;i++ ) {
            document.getElementById("bulletContent"+(bulletId-bulletManagementClub.length)).remove();
            bulletManagementClub.splice(0,1);
            bulletExpireManagement.splice(0,1);
            bulletTrashedCount += 1;
        }
    }

    //update camera position (move garea)
    garea.style.top = cameraPos.y + "px";
    garea.style.left = cameraPos.x + "px";

    //checkIfPickUp
    if( collectablesPosition.indexOf( String(pX+"!"+pY) ) != -1 ) {
        if( document.getElementById(pX+"collectablesAppearanceHolder"+pY) != null ) {
            document.getElementById(pX+"collectablesAppearanceHolder"+pY).remove();
        }
        // if( document.getElementById(pX+"collectablesAppearanceHolder"+pY) != null ) {
        //     document.getElementById(pX+"collectablesAppearanceHolder"+pY).style.display = "none";
        // }
        if( pickUped == false ) {
            playerPoints += parseInt(gCode.howManyCollectablePoint);
            pickUped = true;
        }
        if( gCode.playerAppearPointSettings == "size" ) {
            playerAddSize += parseInt(gCode.howManyCollectablePoint)/10;
        }
        document.getElementById("howManyPlayerPoints").innerHTML = playerPoints;
    }

    db.push({ type: "checkAlive", gameCreator:loggedUser, gameId:gameId, playerName:myName });

    //update where player is
    db.push({ type:"playerPositionUpdate",gameCreator:loggedUser, gameId:gameId, playerName:myName, positionData:pX+","+pY });

    //update player points

    //update ranking
    var rankDrop = [];
    var rankDropNames = [];
    var preStab = 0;
    for( i=0; i<playerData.name.length; i++ ) {
        preStab = 0
        var testy = playerData.points[i];
        for( p=0; p<rankDrop.length; p++ ) {
            if( testy > rankDrop[p] ) {
                preStab += 1;
            }
        }
        rankDrop.splice(preStab,0,testy);
        rankDropNames.splice(preStab,0,playerData.name[i]);
    }

    console.log(rankDropNames);

    if( playerData.name.length != 0 ) {
        document.getElementById("rankingBoard").innerHTML = "";
        for( i=0; i<rankDropNames.length; i++ ) {
            document.getElementById("rankingBoard").innerHTML += (i+1)+"位. <strong>" + rankDropNames[rankDropNames.length-(i+1)] + "</strong>: " + playerData.points[playerData.name.indexOf(rankDropNames[rankDropNames.length-(i+1)])] + "点<br>";
        }

    }

    //update other player positions
    for( i=0; i<playerData.name.length; i++ ) {
        if( playerData.name[i] != myName ) {
            document.getElementById("otherPlayerSprite!"+playerData.name[i]).style.top = playerData.position[i].split(",")[1] + "px";
            document.getElementById("otherPlayerSprite!"+playerData.name[i]).style.left = playerData.position[i].split(",")[0] + "px";
        }
    }

    //hurt other players
    if( gCode.playerAttackSetting.type == "shoot" ) {
        for( i=0; i<bulletManagementClub.length; i++ ) {
            var bulletY = parseInt(document.getElementById("bulletContent"+(bulletTrashedCount+i)).style.top.split("px")[0]);
            var bulletX = parseInt(document.getElementById("bulletContent"+(bulletTrashedCount+i)).style.left.split("px")[0]);

            for( p=0; p<playerData.name.length; p++ ) {
                if(playerData.position[p] == bulletX+","+bulletY ) {
                    if( playerData.name[p] != myName ) {
                        db.push({type:"damagePlayer",gameCreator:loggedUser,gameId:gameId,playerName:playerData.name[p]});
                    }
                }
            }

        }
    }

    if( playerPoints < 0 ) {
        gameOver();
        db.push({ type:"killPlayer",gameCreator:loggedUser, gameId:gameId, playerName:myName })
    }

    //check if outside map
    if( pX < 0 || pY < 0 || pX > 5000 || pY > 3000 ) {
        gameOver();
        db.push({ type:"killPlayer",gameCreator:loggedUser, gameId:gameId, playerName:myName })
    }

    db.push({ type:"playerPointsUpdate",gameCreator:loggedUser, gameId:gameId,playerName:myName,pointsData:playerPoints });

    setTimeout( function () {
        gameLoop();
    }, 300)
}

var downKeyholder = [];
var onKeyDown = function ( event ) {
    //event.keyCode
    if( downKeyholder.indexOf( event.keyCode ) == -1 ) {
        downKeyholder.push(event.keyCode);
    }
};
var onKeyUp = function ( event ) {
	//event.keyCode
    if( downKeyholder.indexOf( event.keyCode ) != -1 ) {
        downKeyholder.splice(downKeyholder.indexOf( event.keyCode ),1);
    }
};
document.addEventListener( 'keydown', onKeyDown, false );
document.addEventListener( 'keyup', onKeyUp, false );

var collectablesPosition = [];
var initiativeCFunction = true;

var cX,cY;

function maintainCollectablesToRandomPoint() {
    if( initiativeCFunction == true ) {
        cX = Math.floor(getRandomArbitrary( 10, 4990 )/100)*100;
        cY = Math.floor(getRandomArbitrary( 10, 2990 )/100)*100;
        if( gProjects.code[gameId].howMuchCollectablesSpawn == "alot" ) {
            if( collectablesPosition.length < 50 ) {
                if( collectablesPosition.indexOf(cX+"!"+cY) == -1 ) {
                    cX = Math.floor(getRandomArbitrary( 10, 4990 )/100)*100;
                    cY = Math.floor(getRandomArbitrary( 10, 2990 )/100)*100;
                    collectablesPosition.push(cX+"!"+cY);
                }
            }
        } else if( gProjects.code[gameId].howMuchCollectablesSpawn == "normal" ) {
            if( collectablesPosition.length < 30 ) {

                    if( collectablesPosition.indexOf(cX+"!"+cY) == -1 ) {
                        cX = Math.floor(getRandomArbitrary( 10, 4990 )/100)*100;
                        cY = Math.floor(getRandomArbitrary( 10, 2990 )/100)*100;
                        collectablesPosition.push(cX+"!"+cY);
                    }
            }
        } else {
            if( collectablesPosition.length < 10 ) {

                    if( collectablesPosition.indexOf(cX+"!"+cY) == -1 ) {
                        cX = Math.floor(getRandomArbitrary( 10, 4990 )/100)*100;
                        cY = Math.floor(getRandomArbitrary( 10, 2990 )/100)*100;
                        collectablesPosition.push(cX+"!"+cY);
                    }
            }
        }
        updateFruitsPosition();
        setTimeout( function () {
            maintainCollectablesToRandomPoint();
        }, 50)
    }
}

function updateFruitsPosition() {
    if( gCode.collectablesSpriteType == "libraryImage" ) {
        collectablesSpriteWrapper.innerHTML += "<img id='"+collectablesPosition[collectablesPosition.length-1].split("!")[0]+"collectablesAppearanceHolder"+collectablesPosition[collectablesPosition.length-1].split("!")[1]+"' src='"+gCode.collectablesLibrarySprite+"' class='collectableSpriteHolder' style='left:"+collectablesPosition[collectablesPosition.length-1].split("!")[0]+"px; top:"+collectablesPosition[collectablesPosition.length-1].split("!")[1]+"px;'>";
    }
}

var mousePosX = 0;
var mousePosY = 0;
//track mousePosition
window.onmousemove = function (e) {
    mousePosX = e.clientX;
    mousePosY = e.clientY;
}

function updateFloorTexture() {
    if( gProjects.code[gameId].useFloorTexture == "libraryImage" ) {
        document.getElementById("garea").style.background = "url(./" + gProjects.code[gameId].floorLibrarySprite+ ")";
    } else {
        document.getElementById("garea").style.background = "url("+gProjects.code[gameId].floorUploadSprite+")";
    }
}

var allKeyCodeList = [13, 8, 9, 16, 17, 18, 27, 32, 37, 38, 39, 40, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90];
var allKeyCodeReverse = ["Enter","Backspace / Delete","Tab","Shift","Ctrl","Alt","esc (Escape)","スペース","左矢印","上矢印","右矢印","下矢印","0","1","2","3","4","5","6","7","8","9","A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"];

window.onload = function () {
    document.body.style.width = window.innerWidth + "px";
    document.body.style.height = window.innerHeight + "px";
}

function gameOver() {
    document.getElementById("gameOver").style.display = "block";
    setTimeout( function () {
        location.reload();
    }, 3000)
}


function repondDoind() {
    for( i=0; i<respondedManagement; i++ ) {
        respondedManagement[i] = false;
    }

    respondedManagement[playerData.name.indexOf(myName)] = "itMe";

    // check peer activity, if not active, kill player
    for( i=0; i<playerData.name.length; i++ ) {
        if( playerData.name[i] != myName ) {
            var whichNameToCheck = playerData.name[i];
            db.push({ type : "checkAliveMsg", gameCreator:loggedUser, gameId:gameId, playerName:whichNameToCheck, sentBy:myName })
        }
    }



    setTimeout( function () {
        for( i=0; i<respondedManagement.length;i++ ) {
            if( respondedManagement[i] == false ) {
                db.push({ type:"killPlayer", gameCreator:loggedUser,gameId:gameId,playerName:playerData.name[i] });
            }
        }
        repondDoind();
    },2000);
}

// function ponpon() {
//     if(  ) {
//         respondKingCheck = false;
//         var currentKing = playerData.name[0];
//
//         db.push({type:"checkKingVitality", gameCreator:loggedUser,gameId:gameId,by:myName});
//     }
//
//     setTimeout( function () {
//         if( respondKingCheck == false ) {
//             db.push({ type:"killPlayer", gameCreator:loggedUser,gameId:gameId,playerName:playerData.name[0] });
//         }
//     },2000);
// }
