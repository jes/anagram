(function() {
    //+ Jonas Raoni Soares Silva
    //@ http://jsfromhell.com/array/shuffle [v1.0]
    function shuffle(o){ //v1.0
        for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
        return o;
    };

    var refresh = function() {
        var letters = $('#input-letters').val().toLowerCase();
        var used = $('#anagram-letters').val().toLowerCase();

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
            if (!letter.match(/[a-z]/))
                continue;
            for (var i = 0; i < count[letter]; i++)
                output.push(letter);
            for (var i = 0; i > count[letter]; i--)
                excess.push(letter);
        }

        /* shuffle to make it easy to spot patterns */
        output = shuffle(output).join('');
        excess = shuffle(excess).join('');

        $('#unused-letters').html(output.toUpperCase());
        $('#excess-letters').html(excess.toUpperCase());

        /* try to complete the word the user is typing (unless they've used all the inputs) */
        var inputs = $('#anagram-letters').val().split(' ');
        if (inputs.length > 0 && output.length > 0) {
            var lastword = inputs[inputs.length-1].toLowerCase();

            var words = [];

            /* find the node in the trie corresponding to this prefix */
            var dictnode = dictionary;
            for (var i = 0; dictnode && i < lastword.length; i++)
                if (lastword[i].match(/[a-z]/))
                    dictnode = dictnode[lastword[i]];

            /* if there is a dictionary node here, recurse through it remembering the words */
            if (dictnode) {
                for (var i = 0; i < lastword.length; i++)
                    count[lastword[i]]++;

                console.log(output);

                _recurse_solve_letters(output, dictnode, {}, function(word) {
                    /* build the set of remaining letters, after playing this */
                    var c = {};
                    for (var k in count)
                        c[k] = count[k];
                    for (var i = 0; i < word.length; i++)
                        c[word[i]]--;

                    var s = '';
                    for (var k in c)
                        for (var i = 0; i < c[k]; i++)
                            s += k;

                    /* solve_letters */
                    var got_solutions = false;
                    if (s == '') {
                        got_solutions = true;
                    } else {
                        solve_letters(s, function(word2) {
                            got_solutions = true;
                            return false;
                        });
                    }

                    /* if there were solutions, add it like normal; otherwise, make it appear inferior */
                    if (got_solutions)
                        words.push({
                            "word": word,
                            "good": true,
                        });
                    else
                        words.push({
                            "word": word,
                            "good": false,
                        });
                }, lastword);
            }

            /* put longer words first */
            words.sort(function(a, b) {
                if (b.good != a.good)
                    return b.good - a.good;
                if (b.word.length != a.word.length)
                    return b.word.length - a.word.length;
                return 0;
            });
            $('#suggestions').html(words.map(function(w) {
                return '<span class=' + (w.good ? 'good-word' : 'bad-word') + '>' + w.word + '</span>';
            }).join(' '));
        } else {
            $('#suggestions').html('');
        }
    };

    $('#input-letters').on('keyup', refresh);
    $('#anagram-letters').on('keyup', refresh);
})();
