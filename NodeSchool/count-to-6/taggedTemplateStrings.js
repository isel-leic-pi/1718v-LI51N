
console.log(html`<b>${process.argv[2]} says</b>: "${process.argv[3]}"`);

function html(template, ...args) {
    let result = ""
    template.forEach((element, idx) => {
        result += element + encode(args[idx])
    })

    return result
}

function encode(str) {
    return str == undefined ? "" : str
        .replace(/&/g, '&amp;')
        .replace(/'/g, '&apos;')
        .replace(/"/g, '&quot;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
}

