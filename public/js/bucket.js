var numOfLine =2;
function addRow(){
  //UFG stands for UnFinishedGoals

  // Get a element of tbody which have a parent node, table -
  // and named unfinishedGoals into a var UFG.
  var UFG = document.getElementById("unfinishedGoals");

  var row = UFG.insertRow(UFG.rows.length);

  var cardinal = row.insertCell(0);
  var goal = row.insertCell(1);
  var deadline = row.insertCell(2);

  cardinal.innerHTML = numOfLine;
  goal.innerHTML = "next goal";
  deadline.innerHTML = "~yy-mm-dd";
  numOfLine++;
};
