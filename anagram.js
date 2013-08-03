(function() {
    //+ Jonas Raoni Soares Silva
    //@ http://jsfromhell.com/array/shuffle [v1.0]
    function shuffle(o){ //v1.0
        for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
        return o;
    };

    var refresh_unused = function() {
        var letters = $('#input-letters').val();
        var used = $('#anagram-letters').val();

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
            for (var i = 0; i < count[letter]; i++)
                output.push(letter);
            for (var i = 0; i > count[letter]; i--)
                excess.push(letter);
        }

        $('#unused-letters').html(shuffle(output).join(''));
        $('#excess-letters').html(shuffle(excess).join(''));
    };

    $('#input-letters').on('input', refresh_unused);
    $('#anagram-letters').on('input', refresh_unused);
})();
