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
