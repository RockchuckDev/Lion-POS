

export function createAndAppendElement(elementType, elementInnerHTML, preexistingParentElementToAppendTo){
    let newElement = document.createElement(`${elementType}`);
    newElement.innerHTML = elementInnerHTML;
    preexistingParentElementToAppendTo.appendChild(newElement);
    return newElement;
}

export function returnProductsJsonAsString(){

    let toReturn = "";
    fetch("/productsJson")
    .then(fetchedJson => toReturn = fetchedJson);
    return toReturn;
}

export function returnOrderTemplateAsString(){

    return fetch("/orderTemplateJson")
    .then(fetchedJson => fetchedJson.json());
}

export function returnDate(){
    return new Date().toISOString().split('T')[0];
}

export function returnTime(){
    return new Date().toTimeString().split(' ')[0].replace(/:/g, "-");
}