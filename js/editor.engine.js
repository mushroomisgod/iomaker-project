//
var selectedObject = 0;
var openedProjectId = 0;

//no matter what the heck happens, editor code stays seperate!!
function updateMeasurement() {
    document.getElementById("assetsFolder").style.height = (window.innerHeight - 110) + "px";
    document.getElementById("assetsFolder").style.width = (window.innerWidth - 60) / 2 + "px";

    document.getElementById("codeArea").style.height = (window.innerHeight - 110 - 51) + "px";
    document.getElementById("codeArea").style.width = (window.innerWidth - 60) / 2 - 30 + "px";
    document.getElementById("codeArea").style.left = (window.innerWidth - 59) / 2 + 30 + "px"

    document.getElementById("codeAreaParentWrapper").style.height = (window.innerHeight - 110 - 51 - 69) + "px";

    document.getElementById("codeTabWrapper").style.width = (window.innerWidth - 60) / 2 - 30 + "px";
}

function updateSimpleMes() {
    document.getElementById("simpleCodePort").style.width = window.innerWidth - 800 + "px";
    document.getElementById("codeAreaSimp").style.height = window.innerHeight - 50 + "px";
}

//users io game data
var gProjects = {
    name : [],
    code : [
        {
            moveWhen : "buttonPress",
            moveKeyBindEnabled : true,
            moveKeyBind: [],
            changeDirWhen : "buttonPress",
            directionKeyBindEnabled : false,
            directionKeyBind : [{ keyCodeB: 13, directionRL: "right", moveRL: false, directionUD: "up", moveUD: false }],
            playerAppearPointSettings : "size",
            playerLibrarySprite : "./assets/samplePack/car.png",
            playerUploadSprite : "none",
            usePlayerSprite : "library",
            playerAttackSetting : { type:"shoot", keyCode:13 },
            playerAttackLibrarySprite : "./assets/samplePack/axe.png",
            playerAttackuploadSprite : "none",
            usePlayerAttackSprite : "library",
            howCollectablesSpawn : "randomPoint",
            howMuchCollectablesSpawn : "alot",
            howManyCollectablePoint : 0,
            collectablesLibrarySprite : "./assets/samplePack/coin.png",
            collectablesUploadSprite : "none",
            collectablesSpriteType : "library"
        }
    ]
};

function selectAssetSimple(ele) {
    ele.classList.add("simpleSelected");
    ele.disabled = true;
    document.getElementById("assetControl" + selectedObject).style.display = "none";
    document.getElementById("assetApControl"+selectedObject).style.display = "none";
    document.getElementById("assetSelectorSimple" + selectedObject).classList.remove("simpleSelected");
    document.getElementById("assetSelectorSimple" + selectedObject).disabled = false;
    var whichAsset = ele.id.split("assetSelectorSimple")[1];
    selectedObject = whichAsset;

    document.getElementById("assetControl"+whichAsset).style.display = "block";
    document.getElementById("assetApControl"+whichAsset).style.display = "block";
}

//change tabs
document.getElementById("switchSettingTab").onclick = function () {
    document.getElementById("switchSettingTab").classList.add("selectedCodeTab");
    document.getElementById("switchAppearTab").classList.remove("selectedCodeTab");

    document.getElementById("codeAreaSimp").style.display = "block";
    document.getElementById("appearAreaSimp").style.display = "none";
}
document.getElementById("switchAppearTab").onclick = function () {
    document.getElementById("switchSettingTab").classList.remove("selectedCodeTab");
    document.getElementById("switchAppearTab").classList.add("selectedCodeTab");

    document.getElementById("codeAreaSimp").style.display = "none";
    document.getElementById("appearAreaSimp").style.display = "block";
}


//modal code!! YEEE!!
document.getElementById("movementPlayerSettingLaunch").onclick = function () {
    document.getElementById("playerMoveSetting").style.display = "block";
}

document.getElementById("closeplayerMoveSetting").onclick = function () {
    document.getElementById("playerMoveSetting").style.display = "none";
}
document.getElementById("whatToMove").onchange = function () {
    db.push({type:"changeWhatToMovePlayer",pID:openedProjectId,user:loggedUser, which:document.getElementById("whatToMove").value});
}

//@player settings > move : change move when
function changeWhatToMoveCondition() {
    var whichCondition = document.getElementById("whatToMove").value;
    if ( whichCondition == "always" ) {
        //change game save data Content

        //ui based scripts
        document.getElementById("keyControlsWrapper").style.display = "none";
        document.getElementById("changeDirectionControls").style.display = "block";
        if (document.getElementById("whatToCDir").value = "whenButtonPressed" ) {
            document.getElementById("keyDirectionWrapper").style.display = "block";
            document.getElementById("newKeybindForMovementPlayer").style.display = "inline-block";
        } else {
            document.getElementById("keyDirectionWrapper").style.display = "block";
            document.getElementById("newKeybindForMovementPlayer").style.display = "none";
        }
    } else {
        document.getElementById("changeDirectionControls").style.display = "none";
        document.getElementById("keyControlsWrapper").style.display = "block";
        document.getElementById("newKeybindForMovementPlayer").style.display = "inline-block";
    }
}

document.getElementById("whatToCDir").onchange = function () {
    var whichCondition = document.getElementById("whatToCDir").value;
    if( whichCondition == "always" ) {
        db.push({type:"whatToCDirUpdate",pID:openedProjectId,user:loggedUser,value:"always"});
    } else {
        db.push({type:"whatToCDirUpdate",pID:openedProjectId,user:loggedUser,value:"buttonPress"});
    }
}


var keyCodeSelectorFullHtml = '><option value="13">Enter</option> <option value="8">Backspace / Delete</option> <option value="9">Tab</option> <option value="16">Shift</option> <option value="17">Ctrl</option> <option value="18">Alt</option> <option value="27">esc (Escape)</option> <option value="32">スペース</option> <option value="37">左矢印</option> <option value="38">上矢印</option> <option value="39">右矢印</option> <option value="40">下矢印</option> <option value="48">0</option> <option value="49">1</option> <option value="50">2</option> <option value="51">3</option> <option value="52">4</option> <option value="53">5</option> <option value="54">6</option> <option value="55">7</option> <option value="56">8</option> <option value="57">9</option> <option value="65">A</option> <option value="66">B</option> <option value="67">C</option> <option value="68">D</option> <option value="69">E</option> <option value="70">F</option> <option value="71">G</option> <option value="72">H</option> <option value="73">I</option> <option value="74">J</option> <option value="75">K</option> <option value="76">L</option> <option value="77">M</option> <option value="78">N</option> <option value="79">O</option> <option value="80">P</option> <option value="81">Q</option> <option value="82">R</option> <option value="83">S</option> <option value="84">T</option> <option value="85">U</option> <option value="86">V</option> <option value="87">W</option> <option value="88">X</option> <option value="89">Y</option> <option value="90">Z</option></select >';
var allKeyCodeList = [13, 8, 9, 16, 17, 18, 27, 32, 37, 38, 39, 40, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90];

function updateCodeBlocks(pID) {
    document.getElementById("keyControlsWrapper").innerHTML = "<strong>移動</strong>のボタンの入力が設定されていません";
    if( gProjects.code[pID].moveKeyBind.length != 0 ) {
        document.getElementById("keyControlsWrapper").innerHTML = "";
        for (i = 0; i < gProjects.code[pID].moveKeyBind.length; i++ ) {
            document.getElementById("keyControlsWrapper").innerHTML += '<div class="keyBindWrapper"><select onchange="updatePlayerMovementKeyBindOption(this)" class="miniselect"'+' id="'+ pID +'selectorBlockKeyBind'+ i + '"' + keyCodeSelectorFullHtml + 'キーが押された時<br><select id="'+pID+'directionPlayerChooseRL'+i+'" class="miniselect" onchange="updateRLdirectionPlayer(this)"><option value="right">右</option><option value="left">左</option></select>に<input onchange="changeRLspeedPlayer(this)" id="'+pID+'RLspeedPlayer'+i+'" type="number" placeholder="速度を入力" class="textput textminiput nomargin"><br><select onchange="updateUDdirectionPlayer(this)" id="'+pID+'directionPlayerChooseUD'+i+'"  class="miniselect"><option>上</option><option>下</option></select>に<input id="'+pID+'UDspeedPlayer'+i+'" class="textput textminiput nomargin" type="number" placeholder="速度を入力" onchange="changeUDspeedPlayer(this)"><hr class="whiteHR"><button id="'+pID+'deleteBtnTrigger'+i+'" onclick="deleteThisPlayerMovementCodeBlock(this)" class="deleteBtn"><img class="deleteIcon" src="./assets/editorMisc/delete.svg"></button></div>';
            var preSelectedCode = allKeyCodeList.indexOf(gProjects.code[pID].moveKeyBind[i].keyCodeA);
            document.getElementById(pID + "selectorBlockKeyBind" + i).selectedIndex = preSelectedCode;

            if( gProjects.code[pID].moveKeyBind[i].toX >= 0 ) {
                document.getElementById(pID+'directionPlayerChooseRL'+i).selectedIndex = 0;
                document.getElementById(pID+'RLspeedPlayer'+i).value = gProjects.code[pID].moveKeyBind[i].toX;
            } else {
                document.getElementById(pID+'directionPlayerChooseRL'+i).selectedIndex = 1;
                document.getElementById(pID+'RLspeedPlayer'+i).value = gProjects.code[pID].moveKeyBind[i].toX * -1;
            }

            if( gProjects.code[pID].moveKeyBind[i].toY >= 0 ) {
                document.getElementById(pID+'directionPlayerChooseUD'+i).selectedIndex = 0;
                document.getElementById(pID+'UDspeedPlayer'+i).value = gProjects.code[pID].moveKeyBind[i].toY;
            } else {
                document.getElementById(pID+'directionPlayerChooseUD'+i).selectedIndex = 1;
                document.getElementById(pID+'UDspeedPlayer'+i).value = gProjects.code[pID].moveKeyBind[i].toY * -1;
            }

        }
    }
    //direction control blocks
    document.getElementById("keyDirectionWrapper").innerHTML = "<strong>方向転換</strong>のボタンの入力が設定されていません";
    if( gProjects.code[pID].directionKeyBind.length != 0 ) {
        document.getElementById("keyDirectionWrapper").innerHTML = "";
        for( i=0;i<gProjects.code[pID].directionKeyBind.length;i++) {
            document.getElementById("keyDirectionWrapper").innerHTML += '<div class="keyBindWrapper"><select onchange="updateDirection(this)" class="miniselect"'+' id="'+ pID +'changeDirectionKeyBindBlock'+ i + '"' + keyCodeSelectorFullHtml + 'キーが押された時<br><select id="'+pID+'changeDirectionKeyRL'+i+'" class="miniselect" onchange="updateRLdirectionPlayerReal(this)"><option value="right">右</option><option value="left">左</option></select>に<select id="'+pID+'moveRLorNot'+i+'" class="miniselect" onchange="RLmoveOrNotUpdate(this)"><option value="noMove">進まない</option><option value="yesMove">進む</option></select><br><select onchange="updateUDdirectionPlayerReal(this)" id="'+pID+'changeDirectionKeyUD'+i+'" class="miniselect"><option value="up">上</option><option value="down">下</option></select>に<select id="'+pID+'moveUDorNot'+i+'" class="miniselect" onchange="UDmoveOrNotUpdate(this)"><option value="noMove">進まない</option><option value="yesMove">進む</option></select><hr class="whiteHR"><button id="'+pID+'deleteBtnTrigger'+i+'" onclick="deleteThisPlayerDirectionCodeBlock(this)" class="deleteBtn"><img class="deleteIcon" src="./assets/editorMisc/delete.svg"></button></div>';

            var preSelectedCode = allKeyCodeList.indexOf(gProjects.code[pID].directionKeyBind[i].keyCodeB);
            document.getElementById(pID + "changeDirectionKeyBindBlock" + i).selectedIndex = preSelectedCode;

            if( gProjects.code[pID].directionKeyBind[i].directionRL == "right" ) {
                document.getElementById(pID+"changeDirectionKeyRL"+i).selectedIndex = 0;
            } else {
                document.getElementById(pID+"changeDirectionKeyRL"+i).selectedIndex = 1;
            }

            if( gProjects.code[pID].directionKeyBind[i].directionUD == "up" ) {
                document.getElementById(pID+"changeDirectionKeyUD"+i).selectedIndex = 0;
            } else {
                document.getElementById(pID+"changeDirectionKeyUD"+i).selectedIndex = 1;
            }

            if( gProjects.code[pID].directionKeyBind[i].moveRL == true ) {
                document.getElementById(pID+"moveRLorNot"+i).selectedIndex = 1;
            } else {
                document.getElementById(pID+"moveRLorNot"+i).selectedIndex = 0;
            }

            if( gProjects.code[pID].directionKeyBind[i].moveUD == true ) {
                document.getElementById(pID+"moveUDorNot"+i).selectedIndex = 1;
            } else {
                document.getElementById(pID+"moveUDorNot"+i).selectedIndex = 0;
            }
        }
    }
}

//add more player movement keybind controls
document.getElementById("newKeybindForMovementPlayer").onclick = function () {
    if( gProjects.code[openedProjectId].moveWhen == "buttonPress" ) {
        db.push({ type : "newMoveKeyBind", user : loggedUser, oprojectID : openedProjectId });
    } else if( gProjects.code[openedProjectId].moveWhen == "always" && gProjects.code[openedProjectId].changeDirWhen == "buttonPress" ) {
        db.push({ type : "newChangeDirKeyBind", user : loggedUser, oprojectID : openedProjectId });
    }
}

/* <select>
    <option value="13">Enter</option>
    <option value="8">Backspace / Delete</option>
    <option value="9">Tab</option>
    <option value="16">Shift</option>
    <option value="17">Ctrl</option>
    <option value="18">Alt</option>
    <option value="27">esc (Escape)</option>
    <option value="32">スペース</option>
    <option value="37">左矢印</option>
    <option value="38">上矢印</option>
    <option value="39">右矢印</option>
    <option value="40">下矢印</option>
    <option value="48">0</option>
    <option value="49">1</option>
    <option value="50">2</option>
    <option value="51">3</option>
    <option value="52">4</option>
    <option value="53">5</option>
    <option value="54">6</option>
    <option value="55">7</option>
    <option value="56">8</option>
    <option value="57">9</option>
    <option value="65">A</option>
    <option value="66">B</option>
    <option value="67">C</option>
    <option value="68">D</option>
    <option value="69">E</option>
    <option value="70">F</option>
    <option value="71">G</option>
    <option value="72">H</option>
    <option value="73">I</option>
    <option value="74">J</option>
    <option value="75">K</option>
    <option value="76">L</option>
    <option value="77">M</option>
    <option value="78">N</option>
    <option value="79">O</option>
    <option value="80">P</option>
    <option value="81">Q</option>
    <option value="82">R</option>
    <option value="83">S</option>
    <option value="84">T</option>
    <option value="85">U</option>
    <option value="86">V</option>
    <option value="87">W</option>
    <option value="88">X</option>
    <option value="89">Y</option>
    <option value="90">Z</option>
</select> */


function deleteThisPlayerMovementCodeBlock(ele) {
    var idHolder = ele.id.split("deleteBtnTrigger");
    db.push({type:"deletePlayerMovementCodeBlock",user:loggedUser,pID:idHolder[0],whichI:idHolder[1]});
}
function deleteThisPlayerDirectionCodeBlock(ele) {
    var idHolder = ele.id.split("deleteBtnTrigger");
    db.push({type:"deletePlayerDirectionCodeBlock",user:loggedUser,pID:idHolder[0],whichI:idHolder[1]});
}

function updatePlayerMovementKeyBindOption(ele) {
    var idHolder = ele.id.split("selectorBlockKeyBind");
    var valueKeyCode = ele.value;
    db.push({type:"updatePlayerMovementKeyBindOption",user:loggedUser,pID:idHolder[0],whichI:idHolder[1], keyCodeAA:valueKeyCode});
}

function updateRLdirectionPlayer(ele) {
    var idHolder = ele.id.split("directionPlayerChooseRL");
    var valueRL = ele.value;
    db.push({type:"updateRLdirectionPlayer",user:loggedUser,pID:idHolder[0],whichI:idHolder[1],whichDirection:valueRL})
}

function updateUDdirectionPlayer(ele) {
    var idHolder = ele.id.split("directionPlayerChooseUD");
    var valueUD = ele.value;
    db.push({type:"updateUDdirectionPlayer",user:loggedUser,pID:idHolder[0],whichI:idHolder[1],whichDirection:valueUD})
}
function changeRLspeedPlayer(ele) {
    ele.value = Math.abs(parseInt(ele.value));
    var idHolder= ele.id.split("RLspeedPlayer");
    var valueVelRL = ele.value;
    db.push({type:"changeRLspeedPlayer",user:loggedUser,pID:idHolder[0],whichI:idHolder[1],speed:valueVelRL});
}
function changeUDspeedPlayer(ele) {
    ele.value = Math.abs(parseInt(ele.value));
    var idHolder= ele.id.split("UDspeedPlayer");
    var valueVelUD = ele.value;
    db.push({type:"changeUDspeedPlayer",user:loggedUser,pID:idHolder[0],whichI:idHolder[1],speed:valueVelUD});
}
function updateDirection(ele) {
    var idHolder = ele.id.split("changeDirectionKeyBindBlock");
    var valueHolder = ele.value;
    db.push({type:"updateKeyForDirectionKeyBindBlock",user:loggedUser,pID:idHolder[0],whichI:idHolder[1],value:valueHolder});
}
function updateRLdirectionPlayerReal(ele) {
    var idHolder = ele.id.split("changeDirectionKeyRL");
    var valueHolder = ele.value;
    db.push({type:"updateRLdirectionPlayerChoose",user:loggedUser,pID:idHolder[0],whichI:idHolder[1],value:valueHolder});
}
function updateUDdirectionPlayerReal(ele) {
    var idHolder = ele.id.split("changeDirectionKeyUD");
    var valueHolder = ele.value;
    db.push({type:"updateUDdirectionPlayerChoose",user:loggedUser,pID:idHolder[0],whichI:idHolder[1],value:valueHolder});
}
function RLmoveOrNotUpdate(ele) {
    var idHolder= ele.id.split("moveRLorNot");
    var valueHolder = ele.value;
    db.push({type:"RLmoveOrNotUpdate",user:loggedUser,pID:idHolder[0],whichI:idHolder[1],value:valueHolder});
}
function UDmoveOrNotUpdate(ele) {
    var idHolder= ele.id.split("moveUDorNot");
    var valueHolder = ele.value;
    db.push({type:"UDmoveOrNotUpdate",user:loggedUser,pID:idHolder[0],whichI:idHolder[1],value:valueHolder});
}
function updateWhenToCDirOption() {
    var optionvalue = gProjects.code[openedProjectId].changeDirWhen;
    if( optionvalue == "always" ) {
        document.getElementById("keyDirectionWrapper").style.display = "none";
        document.getElementById("newKeybindForMovementPlayer").style.display = "none";
        document.getElementById("whatToCDir").selectedIndex = 1;
    } else {
        document.getElementById("keyDirectionWrapper").style.display = "block";
        document.getElementById("newKeybindForMovementPlayer").style.display = "inline-block";
        document.getElementById("whatToCDir").selectedIndex = 0;
    }
}
function changePointAppearSettingPlayer(ele) {
    if( ele.value == "size" ) {
        db.push({type:"changePointAppearSettingPlayer",user:loggedUser,pID:openedProjectId,value:"size"});
    } else if( ele.value == "length" ) {
        db.push({type:"changePointAppearSettingPlayer",user:loggedUser,pID:openedProjectId,value:"length"});
    } else {
        db.push({type:"changePointAppearSettingPlayer",user:loggedUser,pID:openedProjectId,value:"nothing"});
    }
}
function updatePlayerPointAppearance() {
    if( gProjects.code[openedProjectId].playerAppearPointSettings == "size" ) {
        document.getElementById("playerPointNAppearSetting").selectedIndex = 0;
    } else if( gProjects.code[openedProjectId].playerAppearPointSettings == "length" ) {
        document.getElementById("playerPointNAppearSetting").selectedIndex = 1;
    } else if ( gProjects.code[openedProjectId].playerAppearPointSettings == "nothing" ) {
        document.getElementById("playerPointNAppearSetting").selectedIndex = 2;
    }
}
function updatePlayerAttackSetting() {
    var data = gProjects.code[openedProjectId].playerAttackSetting;
}
function chooseSpriteForPlayerAttack(type) {
    db.push({type:"chooseSpriteForPlayerAttack",user:loggedUser,pID:openedProjectId,value:type})
}
function updatePlayerAttackLibrarySelectedSprite() {
    if( gProjects.code[openedProjectId].playerAttackLibrarySprite == "./assets/samplePack/axe.png" ) {
        document.getElementById("playerAttackSpriteAxe").classList.add("migAssetLibraryPickerSelected");
        document.getElementById("playerAttackSpriteSword").classList.remove("migAssetLibraryPickerSelected");
        document.getElementById("playerAttackSpriteFlame").classList.remove("migAssetLibraryPickerSelected");
        document.getElementById("playerAttackSpriteBullet").classList.remove("migAssetLibraryPickerSelected");
    } else if( gProjects.code[openedProjectId].playerAttackLibrarySprite == "./assets/samplePack/sword.png" ) {
        document.getElementById("playerAttackSpriteAxe").classList.remove("migAssetLibraryPickerSelected");
        document.getElementById("playerAttackSpriteSword").classList.add("migAssetLibraryPickerSelected");
        document.getElementById("playerAttackSpriteFlame").classList.remove("migAssetLibraryPickerSelected");
        document.getElementById("playerAttackSpriteBullet").classList.remove("migAssetLibraryPickerSelected");
    } else if( gProjects.code[openedProjectId].playerAttackLibrarySprite == "./assets/samplePack/flame.svg" ) {
        document.getElementById("playerAttackSpriteAxe").classList.remove("migAssetLibraryPickerSelected");
        document.getElementById("playerAttackSpriteSword").classList.remove("migAssetLibraryPickerSelected");
        document.getElementById("playerAttackSpriteFlame").classList.add("migAssetLibraryPickerSelected");
        document.getElementById("playerAttackSpriteBullet").classList.remove("migAssetLibraryPickerSelected");
    } else if( gProjects.code[openedProjectId].playerAttackLibrarySprite == "./assets/samplePack/bullet.png"  ) {
        document.getElementById("playerAttackSpriteAxe").classList.remove("migAssetLibraryPickerSelected");
        document.getElementById("playerAttackSpriteSword").classList.remove("migAssetLibraryPickerSelected");
        document.getElementById("playerAttackSpriteFlame").classList.remove("migAssetLibraryPickerSelected");
        document.getElementById("playerAttackSpriteBullet").classList.add("migAssetLibraryPickerSelected");
    }
}

function updatePlayerLibrarySelectedSprite() {
    if( gProjects.code[openedProjectId].playerLibrarySprite == "./assets/samplePack/car.png" ) {
        document.getElementById("playerAttackSpriteCar").classList.add("migAssetLibraryPickerSelected");
        document.getElementById("playerAttackSpriteTank").classList.remove("migAssetLibraryPickerSelected");
        document.getElementById("playerAttackSpritePlane").classList.remove("migAssetLibraryPickerSelected");
        document.getElementById("playerAttackSpritePerson").classList.remove("migAssetLibraryPickerSelected");
    } else if( gProjects.code[openedProjectId].playerLibrarySprite == "./assets/samplePack/tank.png" ) {
        document.getElementById("playerAttackSpriteCar").classList.remove("migAssetLibraryPickerSelected");
        document.getElementById("playerAttackSpriteTank").classList.add("migAssetLibraryPickerSelected");
        document.getElementById("playerAttackSpritePlane").classList.remove("migAssetLibraryPickerSelected");
        document.getElementById("playerAttackSpritePerson").classList.remove("migAssetLibraryPickerSelected");
    } else if( gProjects.code[openedProjectId].playerLibrarySprite == "./assets/samplePack/plane.png" ) {
        document.getElementById("playerAttackSpriteCar").classList.remove("migAssetLibraryPickerSelected");
        document.getElementById("playerAttackSpriteTank").classList.remove("migAssetLibraryPickerSelected");
        document.getElementById("playerAttackSpritePlane").classList.add("migAssetLibraryPickerSelected");
        document.getElementById("playerAttackSpritePerson").classList.remove("migAssetLibraryPickerSelected");
    } else if( gProjects.code[openedProjectId].playerLibrarySprite == "./assets/samplePack/person.png"  ) {
        document.getElementById("playerAttackSpriteCar").classList.remove("migAssetLibraryPickerSelected");
        document.getElementById("playerAttackSpriteTank").classList.remove("migAssetLibraryPickerSelected");
        document.getElementById("playerAttackSpritePlane").classList.remove("migAssetLibraryPickerSelected");
        document.getElementById("playerAttackSpritePerson").classList.add("migAssetLibraryPickerSelected");
    }
}

document.getElementById("whichToUseForPlayerAttackSprite").onchange = function () {
    db.push({type:"setWhichSourceToUsePlayerAttack",user:loggedUser,pID:openedProjectId,value:document.getElementById("whichToUseForPlayerAttackSprite").value});
}
function whichSpriteTypeToUseForPlayerAttackUpdate() {
    if(gProjects.code[openedProjectId].usePlayerAttackSprite == "uploadedImage" ) {
        document.getElementById("whichToUseForPlayerAttackSprite").selectedIndex = 0;
    } else {
        document.getElementById("whichToUseForPlayerAttackSprite").selectedIndex = 1;
    }
}
document.getElementById("attackKeyBindSelector").onchange = function () {
    db.push({type:"changePlayerAttackKeyBind",user:loggedUser,pID:openedProjectId,keyCode:document.getElementById("attackKeyBindSelector").value})
}
function updatePlayerAttackTriggerKeyCode() {
    document.getElementById("attackKeyBindSelector").selectedIndex = allKeyCodeList.indexOf(gProjects.code[openedProjectId].playerAttackSetting.keyCode);
}
document.getElementById("playerAttackTypeSelect").onchange = function () {
    db.push({type:"changePlayerAttackType",user:loggedUser,pID:openedProjectId,value:document.getElementById("playerAttackTypeSelect").value});
}
function updatePlayerAttackTypeSelector() {
    if( gProjects.code[openedProjectId].playerAttackSetting.type == "shoot" ) {
        document.getElementById("playerAttackTypeSelect").selectedIndex = 0;
    } else if( gProjects.code[openedProjectId].playerAttackSetting.type == "punch" ) {
        document.getElementById("playerAttackTypeSelect").selectedIndex = 1;
    } else if( gProjects.code[openedProjectId].playerAttackSetting.type == "nothing" ) {
        document.getElementById("playerAttackTypeSelect").selectedIndex = 2;
    }
}

//image datauri converter scripts
function covertDataURI(input,targetElement,redirectFunctionKey) {
  if (input.files && input.files[0]) {
    var reader = new FileReader();

    reader.onload = function(e) {
      $(targetElement).attr('src', e.target.result);
    }

    reader.readAsDataURL(input.files[0]);

    updateImageCodeHolders(redirectFunctionKey);
  }
}

function updateImageCodeHolders(RFK) {
    setTimeout( function () {
        if( RFK == "playerAttackWeapon" ) {
            db.push({ type:"uploadPlayerWeaponImage",user:loggedUser,pID:openedProjectId,value:document.getElementById("previewImagePlayerWeapon").src });
        } else if( RFK == "playerSprite" ) {
            db.push({ type:"uploadPlayerSprite",user:loggedUser,pID:openedProjectId,value:document.getElementById("playerSpritePreview").src });
        }
    },400)
}
function updateUploadedDataScheme() {
    document.getElementById("previewImagePlayerWeapon").src = gProjects.code[openedProjectId].playerAttackuploadSprite;
    document.getElementById("playerSpritePreview").src = gProjects.code[openedProjectId].playerUploadSprite;
}

function chooseSpriteForPlayer(type) {
    db.push({type:"chooseSpriteForPlayer",user:loggedUser,pID:openedProjectId,value:type})
}
function updateWhichPlayerSprite() {
    db.push({type:"updateWhichPlayerSprite",user:loggedUser,pID:openedProjectId,value:document.getElementById("whichTouseForPlayerSprite").value})
}
function updateWhichPlayerSpriteType() {
    console.log("check one");
    if( gProjects.code[openedProjectId].usePlayerSprite == "uploadedImage" ) {
        document.getElementById("whichTouseForPlayerSprite").selectedIndex = 0;
        console.log("check two");
    } else {
        document.getElementById("whichTouseForPlayerSprite").selectedIndex = 1;
    }
}

//collectables code
document.getElementById("howCollectablesSpawnSelector").onchange = function () {
    db.push({type:"collectableSpawnOptionUpdate",user:loggedUser,pID:openedProjectId,value:document.getElementById("howCollectablesSpawnSelector").value});
}

function updateHowSpawnSelector() {
    if( gProjects.code[openedProjectId].howCollectablesSpawn == "randomPoint" ) {
        document.getElementById("howCollectablesSpawnSelector").selectedIndex = 0;
    } else {
        document.getElementById("howCollectablesSpawnSelector").selectedIndex = 1;
    }
}

document.getElementById("howMuchCollectablesSpawnSelector").onchange = function () {
    db.push({type:"changeHowMuchCollectablesSpawn",user:loggedUser,pID:openedProjectId,value:document.getElementById("howMuchCollectablesSpawnSelector").value});
}

function updateHowMuchSpawnSelector() {
    if( gProjects.code[openedProjectId].howMuchCollectablesSpawn == "alot" ) {
        document.getElementById("howMuchCollectablesSpawnSelector").selectedIndex = 0;
    } else if( gProjects.code[openedProjectId].howMuchCollectablesSpawn == "normal" ) {
        document.getElementById("howMuchCollectablesSpawnSelector").selectedIndex = 1;
    } else {
        document.getElementById("howMuchCollectablesSpawnSelector").selectedIndex = 2;
    }
}

document.getElementById("howManyPointsPerInput").onchange = function () {
    db.push({type:"changeHowManyPointsPerInput",pID:openedProjectId,user:loggedUser,value:document.getElementById("howManyPointsPerInput").value});
}

function updateHowManyPointsPerCollectSelector() {
    document.getElementById("howManyPointsPerInput").value = gProjects.code[openedProjectId].howManyCollectablePoint;
}

function chooseSpriteForCollectables(type) {
    db.push({type:"chooseLibrarySpriteForCollectables",user:loggedUser,pID:openedProjectId,value:type});
}
