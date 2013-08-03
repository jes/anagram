/* Javascript version of cntdn
 *
 * Countdown letters game solver
 *
 * James Stanley 2013
 */

function _recurse_solve_letters(letters, node, used_letter, cb, answer) {
    if (node[0])
        if (cb(answer) == false)
            return false;

    if (answer.length == letters.length)
        return true;

    var done = {};

    for (var i = 0; i < letters.length; i++) {
        var c = letters.charAt(i);

        if (used_letter[i] || done[c])
            continue;

        if (node[c]) {
            used_letter[i] = true;
            done[c] = true;
            if (_recurse_solve_letters(letters, node[c], used_letter, cb, answer+c) == false)
                return false;
            used_letter[i] = false;
        }
    }

    return true;
}

function solve_letters(letters, cb) {
    _recurse_solve_letters(letters, dictionary, {}, cb, '');
}
