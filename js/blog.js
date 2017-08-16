var editor;
function initialize() {
    var container = document.getElementById('writeup');
    editor = new Quill(container, {
        theme: 'snow'
    });

}
function readData() {
    console.log(editor.root.innerHTML);
}
