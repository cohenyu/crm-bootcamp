/**
 * Sends a request for the leads to the db 
 * @param {string} orderType 
 * @param {string} searchVal 
 */
function getLeads(orderType=null, searchVal=null){
    
    axios.get('http://rgb.com:8004/leads', {
        params: {
            order: orderType,
            search: searchVal
        }
    })
    .then(function (response) {
        insertLeads(response.data.leads);
    })
    .catch(function (error) {
        console.log(error);
    });
}


/**
 * Creates rows in the table according to the leads
 */
function insertLeads(leads){
    var table = document.getElementById("leads_table");
    while (table.children.length > 1) {
        table.removeChild(table.lastChild);
    }
    for(let l of leads){
        createRow(l);
    }
    exportLeads(leads);
}

/**
 * Creates row in the table from the lead.
 */
function createRow(lead){
    var newTr = document.createElement('tr');
    newTr.classList.add('card');
    for(let field in lead){
        var newTd = document.createElement('td');

        if(field == "user_mail"){
            var newLink = document.createElement('a');
            newLink.setAttribute('href', 'mailto:' + lead[field]);
            newLink.innerText = lead[field];
            newTd.appendChild(newLink);
        } else if(field == "user_phone") {
            var newLink = document.createElement('a');
            newLink.setAttribute('href', 'tel:' + lead[field])
            newLink.innerText = lead[field];
            newTd.appendChild(newLink);
        } else {
            newTd.innerText = lead[field];
        }

        newTr.appendChild(newTd);
    }
    var table = document.getElementById("leads_table");
    table.appendChild(newTr);
}

function changeOrder(ele){
    getLeads(ele.value);
}

/**
 * Add event to the search form
 */
function searchLeads(){
    const form = document.querySelector('#search');
    form.addEventListener('submit', function(e){
        e.preventDefault();
        const text = form.elements.search_field.value;
        getLeads(null, text);
    });
}

function autoSearch(){
    const input = document.querySelector('#search_field');
    input.addEventListener('input', function(e){
        e.preventDefault();
        const text = search_field.value;
        getLeads(null, text);
    });
}

autoSearch();
searchLeads();
getLeads('ascending');