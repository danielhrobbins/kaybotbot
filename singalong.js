var houseboatbabies = [
    ['CAN YOU FEEL IT?', 86000], 
    ['YES I CAN FEEL IT!', 88500], 
    ['When I\'m at Jenny\'s house', 90000], 
    ['I look for bad ends', 93500], 
    ['Forget your parents!', 96000], 
    ['But it\'s just cat and mouse!', 98500]
];

var bad = [
    ['Ummmmm', 184000],
    ['It was not THAT bad', 484000],
    ['And you did cry if I recall', 684000],
    ['errr, nevermind', 884000],
    ['He is definitely not talking about me', 984000],
    ['no matter what he tells you', 9984000],
    
];

var boy = [
    ['Oh yeah, your song Dan', 14500], 
    ['I spell eM', 63500], 
    ['Ayy child', 75500], 
    ['Isnt he right J3ss', 93500], 
    ['sing it girls', 96500],     ['Whew Im getting hot', 99500], 
    
];
    
var songlist = [
    ['Muddy Waters', 'Mannish Boy', boy],
    ['Mel Young', 'The Killer', bad],  
    ['Reptar', 'Houseboat Babies', houseboatbabies]
];

exports.getLyrics = function (artist, song) {
    for (i in songlist) {
        if ((songlist[i][0] == artist) && (songlist[i][1] == song)) {
            return songlist[i][2];
        }
    }
    return null;
}