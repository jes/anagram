(function() {
    //+ Jonas Raoni Soares Silva
    //@ http://jsfromhell.com/array/shuffle [v1.0]
    function shuffle(o){ //v1.0
        for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
        return o;
    };

    var refresh = function() {
        var letters = $('#input-letters').val().toUpperCase();
        var used = $('#anagram-letters').val().toUpperCase();

        var count = {};

        /* get the net change in usage of each letter (input letters minus used letters) */
        for (var i = 0; i < letters.length; i++) {
            if (!count.hasOwnProperty(letters[i]))
                count[letters[i]] = 0;
            count[letters[i]]++;
        }
        for (var i = 0; i < used.length; i++) {
            if (!count.hasOwnProperty(used[i]))
                count[used[i]] = 0;
            count[used[i]]--;
        }

        var output = [];
        var excess = [];

        /* get a list of available and excessively-used letters */
        for (var letter in count) {
            if (!letter.match(/[A-Z]/))
                continue;
            for (var i = 0; i < count[letter]; i++)
                output.push(letter);
            for (var i = 0; i > count[letter]; i--)
                excess.push(letter);
        }

        /* shuffle to make it easy to spot patterns */
        output = shuffle(output).join('');
        excess = shuffle(excess).join('');

        $('#unused-letters').html(output);
        $('#excess-letters').html(excess);

        /* try to complete the word the user is typing (unless they've used all the inputs) */
        var inputs = $('#anagram-letters').val().split(' ');
        if (inputs.length > 0 && output.length > 0) {
            var lastword = inputs[inputs.length-1].toLowerCase();

            var words = [];

            /* find the node in the trie corresponding to this prefix */
            var dictnode = dictionary;
            for (var i = 0; dictnode && i < lastword.length; i++)
                dictnode = dictnode[lastword[i]];

            /* if there is a dictionary node here, recurse through it remembering the words */
            if (dictnode) {
                _recurse_solve_letters(output.toLowerCase(), dictnode, {}, function(word) {
                    words.push(word)
                }, lastword);
            }

            /* put longer words first */
            words.sort(function(a, b) { return b.length - a.length });
            $('#suggestions').html(words.join('\n'));
        } else {
            $('#suggestions').html('');
        }
    };

    $('#input-letters').on('keyup', refresh);
    $('#anagram-letters').on('keyup', refresh);
})();
