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
                var recurse = function(d, s, n, total_letters, thisword, count, is_topword) {
                    var goodness = 0;

                    if (d[0]) {
                        goodness = (total_letters - n) / total_letters;
                        var g = recurse(dictionary, s + ' ', n, total_letters, 0, count, false);
                        if (g > goodness)
                            goodness = g;
                        if (is_topword) {
                            words.push({
                                "word": s,
                                "good": goodness,
                            });
                        }
                    }

                    if (n == 0) {
                        if (d[0]) {
                            console.log(s);
                            return 1;
                        }
                        return (total_letters - thisword) / total_letters;
                    }

                    for (var k in count) {
                        if (count[k] <= 0 || !d[k])
                            continue;

                        count[k]--;
                        var g = recurse(d[k], s + k, n-1, total_letters, thisword+1, count, is_topword);
                        if (g > goodness)
                            goodness = g;
                        count[k]++;
                    }

                    return goodness;
                };

                var n = 0;
                for (var k in count)
                    if (k.match(/[a-z]/))
                        n += count[k];
                recurse(dictnode, lastword, n, n, lastword.length, count, true);

                /* put longer words first */
                words.sort(function(a, b) {
                    if (b.good != a.good)
                        return b.good - a.good;
                    if (b.word.length != a.word.length)
                        return b.word.length - a.word.length;
                    return 0;
                });
            }

            $('#suggestions').html(words.map(function(w) {
                var c;
                if (w.good == 1)
                    c = 0;
                else
                    c = parseInt(255 * (1.4 - w.good));
                if (c < 0)   c = 0;
                if (c > 200) c = 200;
                var rgb = "rgb(" + c + "," + c + "," + c + ")";
                return '<span style="color: ' + rgb + '">' + w.word + '</span>';
            }).join(' '));
        } else {
            $('#suggestions').html('');
        }
    };

    $('#input-letters').on('keyup', refresh);
    $('#anagram-letters').on('keyup', refresh);
})();
