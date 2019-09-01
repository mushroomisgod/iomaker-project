var db = new Firebase("https://makeio.firebaseio.com/");

//game object elements variebles
var mainPlayer = document.getElementById("mainPlayer");
var garea = document.getElementById("garea");
var collectablesSpriteWrapper = document.getElementById("collectablesSpriteWrapper");

var urlString = window.location.href;
var urlParams = parseURLParams(urlString);
var loggedUser = urlParams.u[0];
var gameId = parseInt(urlParams.c[0]);
var isHost = false;

var playerPoints = 0;

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

}

var updateData = function () {
    db.on('child_added', function (snapshot) {
        var dataInput = snapshot.val();
        if (dataInput.type == "makeNewGame" ) {
            if( dataInput.user == loggedUser ) {
                gProjects.name.push( dataInput.gname );
                gProjects.code.push( { moveWhen : "buttonPress", moveKeyBindEnabled : true, moveKeyBind: [], changeDirWhen : "buttonPress", directionKeyBindEnabled : false, directionKeyBind : [{ keyCodeB: 13, directionRL: "right", moveRL: false, directionUD: "up", moveUD: false }], playerAppearPointSettings : "size", playerLibrarySprite : "./assets/samplePack/car.png", playerUploadSprite : "none", usePlayerSprite : "libraryImage", playerAttackSetting : { type:"shoot", keyCode:13 }, playerAttackLibrarySprite : "./assets/samplePack/axe.png", playerAttackuploadSprite : "none", usePlayerAttackSprite : "libraryImage", howCollectablesSpawn : "randomPoint", howMuchCollectablesSpawn : "alot", howManyCollectablePoint : 0, collectablesLibrarySprite : "./assets/samplePack/coin.png", collectablesUploadSprite : "none", collectablesSpriteType : "libraryImage", floorLibrarySprite : "./assets/samplePack/hexagon.png", floorUploadSprite : "none", useFloorTexture : "libraryImage", useGameTitle : "text", uploadedGameTitleImage : "none" } );
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
                gProjects.code[dataInput.pID].moveKeyBind[dataInput.whichI].toX = dataInput.speed;
            }
        } else if( dataInput.type == "changeUDspeedPlayer" ) {
            if( dataInput.user == loggedUser ) {
                gProjects.code[dataInput.pID].moveKeyBind[dataInput.whichI].toY = dataInput.speed;
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
                gProjects.code[dataInput.pID].directionKeyBind[dataInput.whichI].keyCodeB = parseInt(dataInput.value);
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
                } else {
                    gProjects.code[dataInput.pID].floorLibrarySprite = "./assets/samplePack/grass.png";
                }
            }
        } else if( dataInput.type == "uploadFloorTexture" ) {
            if( dataInput.user == loggedUser ) {
                gProjects.code[dataInput.pID].floorUploadSprite = dataInput.value;
            }
        } else if( dataInput.type == "whichTouseForFloorTextureUpdate" ) {
            if( dataInput.user == loggedUser ) {
                gProjects.code[dataInput.pID].useFloorTexture = dataInput.value;
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
        //ToDO: image game title setting
    }

    //player settings inititatw
    //load player playerSprite
    if( gProjects.code[gameId].usePlayerSprite == "libraryImage" ) {
        mainPlayer.src = gProjects.code[gameId].playerLibrarySprite;
    } else {
        mainPlayer.src = gProjects.code[gameId].playerUploadSprite;
    }
    //now align the player sprite position to center of the screen
    mainPlayer.style.top = window.innerHeight/2 - 95 + "px";
    mainPlayer.style.left = window.innerWidth/2 - 60 - mainPlayer.offsetWidth/2 + "px";

    //useer position,  aka camera setting
    //take user to random point in map
    cameraPos.x = Math.floor(getRandomArbitrary( -4000, -1000 )/100)*100;
    cameraPos.y = Math.floor(getRandomArbitrary( -2000, -1000 )/100)*100;
    //update the gArea to that place for better scenery
    garea.style.top = cameraPos.y + "px";
    garea.style.left = cameraPos.x + "px";


}
var gCode;
window.onload = function () {
    setTimeout( function () {
        initG();
        document.getElementById("loadingCurtain").style.display = "none";

        gCode = gProjects.code[gameId];

        //collectables spawn function
        if( gProjects.code[gameId].howCollectablesSpawn == "randomPoint" ) {
            maintainCollectablesToRandomPoint();
        }
    },3000)
}

document.getElementById("nickput").onkeyup = function () {
    if( document.getElementById("nickput").value.length != 0 && namesRegistered.indexOf(document.getElementById("nickput").value) == -1 ) {
        document.getElementById("joinGameBtn").disabled = false;
    } else {
        document.getElementById("joinGameBtn").disabled = true;
    }
}

document.getElementById("joinGameBtn").onclick = function () {
    myName = document.getElementById("nickput").value;
    isJoined = true;
    document.getElementById("introG").style.display = "none";
    gameLoop();
}

//random number function is useful
function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}

function gameLoop() {
    //player actual position, but floored
    var pX = Math.floor( ((cameraPos.x*-1)+(window.innerWidth/2))/100 )*100;
    var pY = Math.floor( ((cameraPos.y*-1)+(window.innerHeight/2))/100)*100;

    document.getElementById("playerHitBox").style.top = pY + "px";
    document.getElementById("playerHitBox").style.left = pX + "px";


    //player movement
    if( gProjects.code[gameId].moveWhen == "buttonPress" ) {
        for( i=0;i<gProjects.code[gameId].moveKeyBind.length;i++ ) {
            if( downKeyholder.indexOf(gProjects.code[gameId].moveKeyBind[i].keyCodeA) != -1 ) {
                cameraPos.x -= Math.round(parseInt(gProjects.code[gameId].moveKeyBind[i].toX)/100)*100;
                cameraPos.y += Math.round(parseInt(gProjects.code[gameId].moveKeyBind[i].toY)/100)*100;

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
    }

    lastRL = "none";
    lastUD = "none";

    //player attack
    if( downKeyholder.indexOf(gCode.playerAttackSetting.keyCode) != -1 ) {
        if( gCode.playerAttackSetting.type == "shoot" ) {
            if( playerPoints > 10 ) {
                if( gCode.usePlayerAttackSprite == "libraryImage" ) {
                    var bulletStartX = Math.floor(pX/100)*100;
                    var bulletStartY = Math.floor(pY/100)*100;
                    document.getElementById("bulletWrapper").innerHTML += "<img id='bulletContent"+bulletId+"' src='" + gCode.playerAttackLibrarySprite + "' class='bulletAppearHolder' style='top: "+bulletStartY+"px; left: "+bulletStartX+"px;'>";
                    bulletManagementClub.push( lastDirectionPointed );
                    bulletExpireManagement.push( 0 );
                    bulletId += 1;
                } else {
                    var bulletStartX = Math.floor(pX/100)*100;
                    var bulletStartY = Math.floor(pY/100)*100;
                    document.getElementById("bulletWrapper").innerHTML += "<img id='bulletContent"+bulletId+"' src='" + gCode.playerAttackuploadSprite + "' class='bulletAppearHolder' style='top: "+bulletStartY+"px; left: "+bulletStartX+"px;'>";
                    bulletManagementClub.push( lastDirectionPointed );
                    bulletExpireManagement.push( 0 );
                    bulletId += 1;
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
                } else if( bulletManagementClub[i] == "right,up" ) {
                    document.getElementById("bulletContent"+(i+bulletTrashedCount)).style.top = parseInt(document.getElementById("bulletContent"+(i+bulletTrashedCount)).style.top) - 100 + "px";
                    document.getElementById("bulletContent"+(i+bulletTrashedCount)).style.left = parseInt(document.getElementById("bulletContent"+(i+bulletTrashedCount)).style.left) + 100 + "px";
                } else if( bulletManagementClub[i] == "left,up" ) {
                    document.getElementById("bulletContent"+(i+bulletTrashedCount)).style.top = parseInt(document.getElementById("bulletContent"+(i+bulletTrashedCount)).style.top) - 100 + "px";
                    document.getElementById("bulletContent"+(i+bulletTrashedCount)).style.left = parseInt(document.getElementById("bulletContent"+(i+bulletTrashedCount)).style.left) - 100 + "px";
                } else if( bulletManagementClub[i] == "right,down" ) {
                    document.getElementById("bulletContent"+(i+bulletTrashedCount)).style.top = parseInt(document.getElementById("bulletContent"+(i+bulletTrashedCount)).style.top) + 100 + "px";
                    document.getElementById("bulletContent"+(i+bulletTrashedCount)).style.left = parseInt(document.getElementById("bulletContent"+(i+bulletTrashedCount)).style.left) + 100 + "px";
                } else if( bulletManagementClub[i] == "left,down" ) {
                    document.getElementById("bulletContent"+(i+bulletTrashedCount)).style.top = parseInt(document.getElementById("bulletContent"+(i+bulletTrashedCount)).style.top) + 100 + "px";
                    document.getElementById("bulletContent"+(i+bulletTrashedCount)).style.left = parseInt(document.getElementById("bulletContent"+(i+bulletTrashedCount)).style.left) - 100 + "px";
                } else if( bulletManagementClub[i] == "none,up" ) {
                    document.getElementById("bulletContent"+(i+bulletTrashedCount)).style.top = parseInt(document.getElementById("bulletContent"+(i+bulletTrashedCount)).style.top) - 100 + "px";
                    document.getElementById("bulletContent"+(i+bulletTrashedCount)).style.left = parseInt(document.getElementById("bulletContent"+(i+bulletTrashedCount)).style.left) + "px";
                } else if( bulletManagementClub[i] == "none,down" ) {
                    document.getElementById("bulletContent"+(i+bulletTrashedCount)).style.top = parseInt(document.getElementById("bulletContent"+(i+bulletTrashedCount)).style.top) + 100 + "px";
                    document.getElementById("bulletContent"+(i+bulletTrashedCount)).style.left = parseInt(document.getElementById("bulletContent"+(i+bulletTrashedCount)).style.left) + "px";
                } else if( bulletManagementClub[i] == "left,none" ) {
                    document.getElementById("bulletContent"+(i+bulletTrashedCount)).style.top = parseInt(document.getElementById("bulletContent"+(i+bulletTrashedCount)).style.top) + "px";
                    document.getElementById("bulletContent"+(i+bulletTrashedCount)).style.left = parseInt(document.getElementById("bulletContent"+(i+bulletTrashedCount)).style.left) - 100 + "px";
                } else if( bulletManagementClub[i] == "none,none" ) {
                    document.getElementById("bulletContent"+(i+bulletTrashedCount)).style.top = parseInt(document.getElementById("bulletContent"+(i+bulletTrashedCount)).style.top) - 100 + "px";
                    document.getElementById("bulletContent"+(i+bulletTrashedCount)).style.left = parseInt(document.getElementById("bulletContent"+(i+bulletTrashedCount)).style.left) + "px";
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
        console.log("before remove: " + document.getElementById(pX+"collectablesAppearanceHolder"+pY));
        if( document.getElementById(pX+"collectablesAppearanceHolder"+pY) != null ) {
            document.getElementById(pX+"collectablesAppearanceHolder"+pY).remove();
        }
        // if( document.getElementById(pX+"collectablesAppearanceHolder"+pY) != null ) {
        //     document.getElementById(pX+"collectablesAppearanceHolder"+pY).style.display = "none";
        // }

        playerPoints += parseInt(gCode.howManyCollectablePoint);
        document.getElementById("howManyPlayerPoints").innerHTML = playerPoints;
    }

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
