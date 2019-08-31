// modal elements in variable list
var newGameModal = document.getElementById("newGameModal");

// modal opening buttons
var createNewProject = document.getElementById("createNewProject");

// you see the little X at the right upper part of modal? it makes the modal disappear
var closeNewGameModal = document.getElementById("closeNewGameModal");

//newGameModal script
createNewProject.onclick = function () {
    newGameModal.style.display = "block";
}

closeNewGameModal.onclick = function () {
    newGameModal.style.display = "none";
}

window.onclick = function (event) {
    if (event.target == newGameModal) {
        newGameModal.style.display = "none";
    }
}

document.getElementById("pointAppearancePlayerSettingLaunch").onclick = function () {
    document.getElementById("playerPointEffectSetting").style.display = "block";
}
document.getElementById("closePlayerPointEffectSetting").onclick = function () {
    document.getElementById("playerPointEffectSetting").style.display = "none";
}

document.getElementById("playerAttackSettingLaunch").onclick = function () {
    document.getElementById("playerAttackSetting").style.display = "block";
}
document.getElementById("closePlayerAttackSetting").onclick = function () {
    document.getElementById("playerAttackSetting").style.display = "none";
}
document.getElementById("shareLinkShowInEditor").onclick = function () {
    document.getElementById("shareLinkHolder").value = "https://mushroomisgod.github.io/iomaker-project/play.html?u="+loggedUser+"&c="+openedProjectId;
    document.getElementById("shareLinkModal").style.display = "block";
}
function showShareLink(psID) {
    document.getElementById("shareLinkHolder").value = "https://mushroomisgod.github.io/iomaker-project/play.html?u="+loggedUser+"&c="+psID;
    document.getElementById("shareLinkModal").style.display = "block";
}
document.getElementById("closeShareLinkModal").onclick = function () {
    document.getElementById("shareLinkModal").style.display = "none";
    document.getElementById("copiedSpan").style.display = "none";
}
document.getElementById("copyShareLink").onclick = function () {
    var copyText = document.getElementById("shareLinkHolder");
    copyText.select();
    copyText.setSelectionRange(0, 99999);
    document.execCommand("copy");
    document.getElementById("copiedSpan").style.display = "inline";
}
