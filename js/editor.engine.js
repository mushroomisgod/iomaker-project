//
var selectedObject = 0;

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
            moveKeyBind: [{ whichKey: "A", keyCodeA: 65, toX : 0, toY : 10}],
            directionKeyBind : []
        }
    ]
};

function selectAssetSimple(ele) {
    ele.classList.add("simpleSelected");
    ele.disabled = true;
    document.getElementById("assetControl" + selectedObject).style.display = "none";
    document.getElementById("assetSelectorSimple" + selectedObject).classList.remove("simpleSelected");
    document.getElementById("assetSelectorSimple" + selectedObject).disabled = false;
    var whichAsset = ele.id.split("assetSelectorSimple")[1];
    selectedObject = whichAsset;

    document.getElementById("assetControl"+whichAsset).style.display = "block";
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

//@player settings > move : change move when
document.getElementById("whatToMove").onchange = function () {
    var whichCondition = document.getElementById("whatToMove").value;
    if ( whichCondition == "always" ) {
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
        document.getElementById("keyDirectionWrapper").style.display = "none";
        document.getElementById("newKeybindForMovementPlayer").style.display = "none";
    } else {
        document.getElementById("keyDirectionWrapper").style.display = "block";
        document.getElementById("newKeybindForMovementPlayer").style.display = "inline-block";
    }
}


var keyCodeSelectorFullHtml = '>< option value = "13" > Enter</option> <option value="8">Backspace / Delete</option> <option value="9">Tab</option> <option value="16">Shift</option> <option value="17">Ctrl</option> <option value="18">Alt</option> <option value="27">esc (Escape)</option> <option value="32">スペース</option> <option value="37">左矢印</option> <option value="38">上矢印</option> <option value="39">右矢印</option> <option value="40">下矢印</option> <option value="48">0</option> <option value="49">1</option> <option value="50">2</option> <option value="51">3</option> <option value="52">4</option> <option value="53">5</option> <option value="54">6</option> <option value="55">7</option> <option value="56">8</option> <option value="57">9</option> <option value="65">A</option> <option value="66">B</option> <option value="67">C</option> <option value="68">D</option> <option value="69">E</option> <option value="70">F</option> <option value="71">G</option> <option value="72">H</option> <option value="73">I</option> <option value="74">J</option> <option value="75">K</option> <option value="76">L</option> <option value="77">M</option> <option value="78">N</option> <option value="79">O</option> <option value="80">P</option> <option value="81">Q</option> <option value="82">R</option> <option value="83">S</option> <option value="84">T</option> <option value="85">U</option> <option value="86">V</option> <option value="87">W</option> <option value="88">X</option> <option value="89">Y</option> <option value="90">Z</option></select >';
var allKeyCodeList = [13, 8, 9, 16, 17, 18, 27, 32, 37, 38, 39, 40, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90];

function updateCodeBlocks(pID) {
    document.getElementById("keyControlsWrapper").innerHTML = "<strong>移動</strong>のボタンの入力が設定されていません";
    if( gProjects.code[pID].moveKeyBind.length != 0 ) {
        document.getElementById("keyControlsWrapper").innerHTML = "";
        for (i = 0; i < gProjects.code[pID].moveKeyBind.length; i++ ) {
            document.getElementById("keyControlsWrapper").innerHTML += '<div class="keyBindWrapper"><select class="miniselect"'+'id="'+ pID +'selectorBlockKeyBind'+ i + '"' + keyCodeSelectorFullHtml + 'キーが押された時<br><select id="'+pID+'directionPlayerChooseRL'+i+'" class="miniselect"><option value="right">右</option><option value="left">左</option></select>に<input type="number" placeholder="速度を入力" class="textput textminiput nomargin"><br><select id="'+pID+'directionPlayerChooseUD'+i+'"  class="miniselect"><option>上</option><option>下</option></select>に<input class="textput textminiput nomargin" type="number" placeholder="速度を入力"><hr class="whiteHR"><button class="deleteBtn"><img class="deleteIcon" src="./assets/editorMisc/delete.svg"></button></div>';
            var preSelectedCode = allKeyCodeList.indexOf(gProjects.code[pID].moveKeyBind[i].keyCodeA)-1;
            document.getElementById(pID + "selectorBlockKeyBind" + i).selectedIndex = preSelectedCode;

            if( gProjects.code[pID].moveKeyBind[i].toX > 0 ) {

            } else {

            }

            if( gProjects.code[pID].moveKeyBind[i].toY > 0 ) {

            } else {

            }

        }
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
