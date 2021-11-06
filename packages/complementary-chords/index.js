//Hard coded Diatonic Scale for all chords using Circle of Fifths
//Which is used to determine Complimentary chords from the "hummed" array
//Input: array called "hummed"
//Output: array called "recommendChords"

var chords = [
    "C", "G", "D", 
    "A", "E", "B",
    "F#", "Db", "Ab",
    "Eb", "Bb", "F",
    "Am", "Em", "Bm", 
    "F#m", "C#m", "G#m",
    "Ebm", "Bbm", "Fm",
    "Cm", "Gm", "Dm"

];

var DiatScale = [
    ["F","G", "Dm", "Am", "Em"],
    ["C","D", "Am", "Em", "Bm"],
    ["G","A", "Em", "Bm", "F#m"],
    ["D","E", "Bm", "F#m", "C#m"],
    ["A","B", "F#m", "C#m", "G#m"],
    ["E","F#", "C#m", "G#m", "D#m"],
    ["B","Db", "G#m", "D#m", "Bbm"],
    ["F#","Ab", "D#m", "Bbm", "Fm"],
    ["Db","Eb", "Bbm", "Fm", "Cm"],
    ["Ab","Bb", "Fm", "Cm", "Gm"],
    ["Eb","F", "Cm", "Gm", "Dm"],
    ["Bb","C", "Gm", "Dm", "Am"],
    
    ["F","G", "Dm", "C", "Em"],
    ["C","D", "Am", "G", "Bm"],
    ["G","A", "Em", "D", "F#m"],
    ["D","E", "Bm", "A", "C#m"],
    ["A","B", "F#m", "E", "G#m"],
    ["E","F#", "C#m", "B", "D#m"],
    ["B","Db", "G#m", "F#", "Bbm"],
    ["F#","Ab", "D#m", "Db", "Fm"],
    ["Db","Eb", "Bbm", "Ab", "Cm"],
    ["Ab","Bb", "Fm", "Eb", "Gm"],
    ["Eb","F", "Cm", "Bb", "Dm"],
    ["Bb","C", "Gm", "F", "Am"]
    
];

var obj = {};


for(var i = 0; i < chords.length; i++){
    obj[chords[i]] = DiatScale[i];
}

//print of circle of Fifths 
/* (var key of Object.keys(obj)) {
    document.write(key + " => " + obj[key] + "</br>")
}
*/

//Given a vector of chords, if 2 or more chords are part of each others 
//Diatonic scale then make them recommended


//MODIFY THIS TO BE INPUT FROM CHORDS GIVEN
//given by user
const hummed = ["C", "G", "Dm"];



document.write("</br>"+"Given Chords: " + hummed + "</br></br>" )

const compChords = [];
const temp = [];

//gets all complimentary chords from hummed chords
for(let i=0; i < hummed.length; i++){
    //if hummed chord is in chord list
    if( chords.includes(hummed[i]) ){
        //loop through array of chords at chord hummed[i]
        for(let j=0; j < obj[hummed[i]].length; j++){
            
            let happen = 0;
            
            compChords.push( obj[hummed[i]][j] );
            
            //chord hasn't happened before add it to temp
            for(let k=0; k < temp.length; k++){
                if(temp[k] == obj[hummed[i]][j] ){
                    happen = 1;
                }
            }
            
            if(happen == 0){
                temp.push( obj[hummed[i]][j] );
            }
        }
    }
}



const itemCounter = (array, item) => {
  let counter = 0
  array.flat(Infinity).forEach(x => {
    if(x == item){ counter++ }
  });
  return counter
}

var recommendChords = [];

//counts occurances of chords to see whic is best to recommend
for(var i=0; i < temp.length; i++){
    
    let val = itemCounter(compChords, temp[i]);
    
    //if the note has more than 1 occurance put it into recommendChords
    if(val > 1){
        recommendChords.push( temp[i]);
    }
    
}


//remove duplicate if exists of hummed and complimentary chords
for(let i=0; i < hummed.length; i++){
    for(let j=0; j < recommendChords.length; j++){
        if(hummed[i] == recommendChords[j]){
            recommendChords.splice(j, 1);
        }
    }
}

if(recommendChords.length > 0){
    document.write( "Complimentary Chords: " + recommendChords)}
else{
    document.write( "Complimentary Chords: None (you have the best ones)")
}
