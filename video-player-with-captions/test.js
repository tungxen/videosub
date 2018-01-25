//
// Editor: //cdnjs.cloudflare.com/ajax/libs/ace/1.1.3/ace.js
var theme='ace/theme/tomorrow';
var mode='ace/mode/scss';
var editors = document.querySelectorAll('[data-ace-mode]');
console.log( editors.length );
for(var i=0,l=editors.length;i<l;++i){
    var editor= ace.edit(editors[i]);
    if(editors[i].getAttribute('data-ace-theme')){
        editor.setTheme('ace/theme/'+editors[i].getAttribute('data-ace-theme'));
    } else {
        editor.setTheme(theme);
    }
    if(editors[i].getAttribute('data-ace-mode')){
        editor.getSession().setMode('ace/mode/'+editors[i].getAttribute('data-ace-mode'));
    } else {
        editor.getSession().setMode(mode);
    }
    editor.renderer.setShowGutter(false); 
    editor.setShowPrintMargin(false);
    editor.setShowPrintMargin(false);
    editor.setDisplayIndentGuides(false);
    editor.setOptions({ 
        maxLines: Infinity, 
        //readOnly: false,
        highlightActiveLine: false,
        highlightGutterLine: false      
    });
}



function getTextAreaSelection(textarea) {
    var start = textarea.selectionStart, end = textarea.selectionEnd;
    return {
        start: start,
        end: end,
        length: end - start,
        text: textarea.value.slice(start, end)
    };
}

function detectPaste(textarea, callback) {
    textarea.onpaste = function() {
        var sel = getTextAreaSelection(textarea);
        var initialLength = textarea.value.length;
        window.setTimeout(function() {
            var val = textarea.value;
            var pastedTextLength = val.length - (initialLength - sel.length);
            var end = sel.start + pastedTextLength;
            callback({
                start: sel.start,
                end: end,
                length: pastedTextLength,
                text: val.slice(sel.start, end)
            });
        }, 1);
    };
}

var textarea = document.getElementById("pastzone");
detectPaste(textarea, function(svg) {

    
        txt = svg.text
        .replace('<svg',(~svg.text.indexOf('xmlns')?'<svg':'<svg xmlns="http://www.w3.org/2000/svg"'))
        
        //
        //   Encode (may need a few extra replacements)
        //
        .replace(/"/g, '\'')
        .replace(/%/g, '%25')
        .replace(/#/g, '%23')       
        .replace(/{/g, '%7B')
        .replace(/}/g, '%7D')         
        .replace(/</g, '%3C')
        .replace(/>/g, '%3E')

        .replace(/\s+/g,' ') 
        // 
        //    The maybe list (add on documented fail)
        // 
        //  .replace(/&/g, '%26')
        //  .replace('|', '%7C')
        //  .replace('[', '%5B')
        //  .replace(']', '%5D')
        //  .replace('^', '%5E')
        //  .replace('`', '%60')
        //  .replace(';', '%3B')
        //  .replace('?', '%3F')
        //  .replace(':', '%3A')
        //  .replace('@', '%40')
        //  .replace('=', '%3D')          

    textarea.value = 'background-image: url("data:image/svg+xml,'+txt+'");';
    textarea.select();
});






  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','//www.google-analytics.com/analytics.js','ga');
  ga('create', 'UA-68258285-1', 'auto');
  ga('send', 'pageview');

