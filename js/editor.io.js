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
                gProjects.code[dataInput.oprojectID].moveKeyBind.push({ whichKey: "Enter", keyCodeA: 65, toX : -10, toY : 10});
                updateCodeBlocks(dataInput.oprojectID);
            }
        }
    });
}

updateData();
