//ICA inside joke

exports.name = 'ska';
exports.hidden = true;
exports.enabled = true;
exports.matchStart = false;
exports.handler = function(data) {
    var response = ('Vomit! Make it stop!');
    output({text: response, destination: data.source, userid: data.userid});
}