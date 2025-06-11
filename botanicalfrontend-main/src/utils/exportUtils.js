
export function toCSV(data) {
    if (!data.length) return "";
    const headers = Object.keys(data[0]);
    const rows = data.map(row =>
        headers.map(h => `"${row[h]}"`).join(",")
    );
    return [headers.join(","), ...rows].join("\n");
}

export function toXML(data) {
    let xml = '<?xml version="1.0" encoding="UTF-8"?><items>';
    data.forEach(item => {
        xml += "<item>";
        Object.entries(item).forEach(([key, val]) => {
            xml += `<${key}>${val}</${key}>`;
        });
        xml += "</item>";
    });
    xml += "</items>";
    return xml;
}

export function toDOC(data) {
    let html = "<html><body><table border='1'><tr>";
    Object.keys(data[0]).forEach(key => {
        html += `<th>${key}</th>`;
    });
    html += "</tr>";
    data.forEach(row => {
        html += "<tr>";
        Object.values(row).forEach(val => {
            html += `<td>${val}</td>`;
        });
        html += "</tr>";
    });
    html += "</table></body></html>";
    return new Blob([html], { type: "application/msword" });
}
