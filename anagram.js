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

        for (var letter in count) {
            if (!letter.match(/[A-Z]/))
                continue;
            for (var i = 0; i < count[letter]; i++)
                output.push(letter);
            for (var i = 0; i > count[letter]; i--)
                excess.push(letter);
        }

        output = shuffle(output).join('');
        excess = shuffle(excess).join('');

        $('#unused-letters').html(output);
        $('#excess-letters').html(excess);

        var words = [];
        solve_letters(output.toLowerCase(), function(word) {
            words.push(word);
        });
        words.sort(function(a, b) { return b.length - a.length });
        $('#suggestions').html(words.join('\n'));
    };

    $('#input-letters').on('input', refresh);
    $('#anagram-letters').on('input', refresh);
})();
