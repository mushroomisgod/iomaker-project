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
        } else if( dataInput.type == "deletePlayerMovementCodeBlock" ) {
            gProjects.code[dataInput.pID].moveKeyBind.splice( dataInput.whichI, 1 );
            updateCodeBlocks(dataInput.pID);
        }
    });
}

updateData();
