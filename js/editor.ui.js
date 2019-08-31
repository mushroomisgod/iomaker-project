var accountPage = document.getElementById("accounts");
var dashboardPage = document.getElementById("dashboard");
var editorPage = document.getElementById("simpleEditor");

window.onload = function () {
    if( localStorage.loggedID ) {
        if( localStorage.loggedID != "" ) {
            loggedUser = localStorage.loggedID;
            accountPage.style.display = "none";
            dashboardPage.style.display = "block";
        }
    }

    //update based functions
    updateSimpleMes();
    updateGameLaunchers();

    //test development purpose scripts below
    // setTimeout( function () {
    //     //code goes here
    //     dashboardPage.style.display = "none";
    //     editorPage.style.display = "block";
    // }, 100)
}


window.onresize = function () {
    updateSimpleMes();
}

function makeNewAccount() {
    var usrOne = document.getElementById("usernameCAinput").value;
    var pswOne = document.getElementById("passwordCAinput").value;
    var pswTwo = document.getElementById("passwordCAinputC").value;
    document.getElementById("userNameIsUsed").style.display = "none";
    document.getElementById("passwordsDontMatch").style.display = "none";
    if( acc.usr.indexOf( usrOne ) == -1 ) {
        if( pswOne == pswTwo ) {
            db.push({ type : "acc", usr : usrOne, psw : pswOne });
            loggedUser = usrOne;
            localStorage.loggedID = loggedUser;
            console.log("congratulations! you are now logged in as " + usrOne);

            //hide accountport
            accountPage.style.display = "none";
            dashboardPage.style.display = "block";
        } else {
            document.getElementById("passwordsDontMatch").style.display = "block";
        }
    } else {
        document.getElementById("userNameIsUsed").style.display = "block";
    }
}

function loginToAccount() {
    var usrAtt = document.getElementById("usernameLGinput").value;
    var pswAtt = document.getElementById("passwordLGinput").value;
    document.getElementById("wrongLogCred").style.display = "none";
    console.log(acc.psw[acc.usr.indexOf(usrAtt)]);
    if (acc.usr.indexOf(usrAtt) != -1 && acc.psw[acc.usr.indexOf(usrAtt)] == pswAtt ) {
        loggedUser = usrAtt;
        console.log("congratulations! you are now logged in as " + usrAtt);
        localStorage.loggedID = loggedUser;
        //hide accountport
        accountPage.style.display = "none";
        dashboardPage.style.display = "block";
    } else {
        document.getElementById("wrongLogCred").style.display = "block";
    }
}

//switch to login page
document.getElementById("loginSwitchBtn").onclick = function () {
    document.getElementById("createAccPort").style.display = "none";
    document.getElementById("loginPort").style.display = "block";

}


//switch to sign up page
document.getElementById("createAccountSwitchBtn").onclick = function () {
    document.getElementById("createAccPort").style.display = "block";
    document.getElementById("loginPort").style.display = "none";

}

function chkCA() {
    var usrCA = document.getElementById("usernameCAinput").value;
    var pswCA = document.getElementById("passwordCAinput").value;
    var pswCAC = document.getElementById("passwordCAinputC").value;
    if (usrCA.length != 0 && pswCA.length != 0 && pswCAC.length != 0) {
        document.getElementById("crtAcc").disabled = false;
    } else {
        document.getElementById("crtAcc").disabled = true;
    }
}

function chkLG() {
    var usrLG = document.getElementById("usernameLGinput").value;
    var pswLG = document.getElementById("passwordLGinput").value;
    if (usrLG.length != 0 && pswLG.length != 0) {
        document.getElementById("lgiAcc").disabled = false;
    } else {
        document.getElementById("lgiAcc").disabled = true;
    }
}

//create projects
function createNewGame() {
    var nGameName = document.getElementById("gamenamecreate").value;
    document.getElementById("gamenamecreate").value = "";
    db.push({ type : "makeNewGame", user : loggedUser, gname : nGameName });

    //hide modal
    newGameModal.style.display = "none";
}

//game launcher list update
function updateGameLaunchers() {
    document.getElementById("launcherWrapper").innerHTML = "";
    document.getElementById("noGamesCreated").style.display = "block";
    for( i=0; i<gProjects.name.length; i++ ) {
        document.getElementById("noGamesCreated").style.display = "none";
        document.getElementById("launcherWrapper").innerHTML += '<div class="projectLauncher"><span class="projectTitle">' + gProjects.name[i] + '</span><!--<button class="openBtn deleteColor brighterBoi">削除</button>--><button onclick="showShareLink('+i+')" class="openBtn shareColor brighterBoi">共有</button><button class="openBtn playColor" onclick="playGameNewWindow('+i+')">プレイ</button><button class="openBtn editColor brighterBoi" onclick="openEditor('+i+')">編集</button></div>';
    }
}

//open editor
function openEditor(pID) {
    dashboardPage.style.display = "none";
    editorPage.style.display = "block";

    //load everything
    var oProjectName = gProjects.name[pID];

    //show project name in editor
    document.getElementById("projectName").innerHTML = oProjectName;

    openedProjectId = pID;

    updateCodeBlocks(pID);
    updateWhenToCDirOption();
    updatePlayerPointAppearance();
    whichSpriteTypeToUseForPlayerAttackUpdate();
    //sprite settings
    updatePlayerAttackLibrarySelectedSprite();
    updatePlayerLibrarySelectedSprite();

    updatePlayerAttackTriggerKeyCode();
    updatePlayerAttackTypeSelector();
    updateUploadedDataScheme();
    updateWhichPlayerSpriteType();
    //collectables code
    updateHowSpawnSelector();
    updateHowMuchSpawnSelector();
    updateHowManyPointsPerCollectSelector();
    //collectables appearance
    updateLibraryCollectableSpriteSelector();
    updateCollectablesSpriteTypeSelector();
    //floor texture
    updateWhichLibraryTextureSelected();
    updateUploadedFloorTexturePreview();

    updateWhichFloorTextureTypeUseSelector();

    updateWhichTitleTypeToUseSelector();
    updateUploadedGameTitleImagePreview();
}

document.getElementById("returnToDashboardBtn").onclick = function () {
    editorPage.style.display = "none";
    dashboardPage.style.display = "block";
}
document.getElementById("gamenamecreate").onkeyup = function () {
    if( document.getElementById("gamenamecreate").value.length != 0 && gProjects.name.indexOf(document.getElementById("gamenamecreate").value) == -1 ) {
        document.getElementById("makeNewGameSubmitBtn").disabled = false;
    } else {
        document.getElementById("makeNewGameSubmitBtn").disabled = true;
    }
}
function playGameNewWindow(poID) {
    window.open("./play.html?u="+loggedUser+"&c="+poID);
}
