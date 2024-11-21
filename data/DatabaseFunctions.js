import { MONGODB_API_KEY, URL_MONGODB,   DATA_SOURCE,
    DATABASE,
    COLLECTION } from '../env.js';

async function Mongo_ListarItems(collection) {

    let now = new Date();
    let sNow = now.toISOString();
    const urlEventosList = URL_MONGODB + 'find';

    let payload = {
                    "dataSource": DATA_SOURCE,
                    "database": DATABASE,
                    "collection": collection            
                    }

    const rawResponse = await fetch(urlEventosList, {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: {
        'content-type': 'application/json', 
        'Access-Control-Request-Headers': '*',
        'Accept': 'application/json',
        'api-key': MONGODB_API_KEY
      },
    })
    .catch(error => 
      console.error(error)

    );

    const content = await rawResponse.json();
    //console.log("CONTENT" +  JSON.stringify(content));
    return  content.documents;


}

function Mongo_AddItem(collection,  document) {
  let now = new Date();
  let sNow = now.toISOString();
  
  let payload = {};

  let url = URL_MONGODB + 'insertOne';

  payload = {
    "dataSource": DATA_SOURCE,
    "database": DATABASE,
    "collection":collection,
    "document": document
  }

  fetch(url, {
    method: 'POST',
    body: JSON.stringify(payload),
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
      'content-type': 'application/json', 
      'Access-Control-Request-Headers': '*',
      'api-key': MONGODB_API_KEY
    },
  })
  .then((response) => response.json())
}

function Mongo_UpdateItem(collection, id, document) {

  console.log("UPDATE_ITEM", document);
  let now = new Date();
  let sNow = now.toISOString();
  
  let payload = {};

  let url = URL_MONGODB + 'updateOne';


  payload =  {
    "dataSource": DATA_SOURCE,
    "database": DATABASE,
    "collection":collection,
    "filter": { "_id": id },
    "update": { "$set": document
    }
  }


  fetch(url, {
    method: 'POST',
    body: JSON.stringify(payload),
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
      'content-type': 'application/json', 
      'Access-Control-Request-Headers': '*',
      'api-key': MONGODB_API_KEY
    },
  })
  .then((response) => response.json())

}

function Mongo_UpdateCursoAlunosArray(collection, id, value) {

  console.log("UPDATE_ITEM");
  let now = new Date();
  let sNow = now.toISOString();
  
  let payload = {};

  let url = URL_MONGODB + 'updateOne';


  payload =  {
    "dataSource": DATA_SOURCE,
    "database": DATABASE,
    "collection":collection,
    "filter": { "_id": id },
    "update": { "$set": { "alunos" : value } }
    }

  fetch(url, {
    method: 'POST',
    body: JSON.stringify(payload),
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
      'content-type': 'application/json', 
      'Access-Control-Request-Headers': '*',
      'api-key': MONGODB_API_KEY
    },
  })
  .then((response) => response.json())

}

function Mongo_DeleteItem(collection, id) {

  let now = new Date();
  let sNow = now.toISOString();
  
  let payload = {};

  let url = URL_MONGODB + 'deleteOne';

  console.log("DELETE_ITEM", id);
  payload =  {
        "dataSource": DATA_SOURCE,
        "database": DATABASE,
        "collection":collection,
        "filter": { "_id": id }
      }
 

  fetch(url, {
    method: 'POST',
    body: JSON.stringify(payload),
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
      'content-type': 'application/json', 
      'Access-Control-Request-Headers': '*',
      'api-key': MONGODB_API_KEY
    },
  })
  .then((response) => response.json())

}



async function Mongo_ListarDataEventos(idEvento) {

  let now = new Date();
  let sNow = now.toISOString();
  const urlEventosList = URL_MONGODB + 'find';

  let payload = {
                  "dataSource": DATA_SOURCE,
                  "database": DATABASE,
                  "collection": "EventoData",
                  "filter": { "evento_id": idEvento }            
                  }

  const rawResponse = await fetch(urlEventosList, {
    method: 'POST',
    body: JSON.stringify(payload),
    headers: {
      'content-type': 'application/json', 
      'Access-Control-Request-Headers': '*',
      'Accept': 'application/json',
      'api-key': MONGODB_API_KEY
    },
  })
  .catch(error => 
    console.error(error)

  );

  const content = await rawResponse.json();
  //console.log("CONTENT" +  JSON.stringify(content));
  return  content.documents;s

}

async function Mongo_DeleteDataEventos(idEvento) {

  let now = new Date();
  let sNow = now.toISOString();
  const urlEventosList = URL_MONGODB + 'deleteMany';

  let payload = {
                  "dataSource": DATA_SOURCE,
                  "database": DATABASE,
                  "collection": "EventoData",
                  "filter": { "evento_id": idEvento }            
                  }

  const rawResponse = await fetch(urlEventosList, {
    method: 'POST',
    body: JSON.stringify(payload),
    headers: {
      'content-type': 'application/json', 
      'Access-Control-Request-Headers': '*',
      'Accept': 'application/json',
      'api-key': MONGODB_API_KEY
    },
  })
  .catch(error => 
    console.error(error)

  );

  const content = await rawResponse.json();
  //console.log("CONTENT" +  JSON.stringify(content));
  return  content.documents;


}

async function Mongo_ListarDataAulas(idCurso) {

  let now = new Date();
  let sNow = now.toISOString();
  const urlEventosList = URL_MONGODB + 'find';

  let payload = {
                  "dataSource": DATA_SOURCE,
                  "database": DATABASE,
                  "collection": "CursoData",
                  "filter": { "curso_id": idCurso }            
                  }

  const rawResponse = await fetch(urlEventosList, {
    method: 'POST',
    body: JSON.stringify(payload),
    headers: {
      'content-type': 'application/json', 
      'Access-Control-Request-Headers': '*',
      'Accept': 'application/json',
      'api-key': MONGODB_API_KEY
    },
  })
  .catch(error => 
    console.error(error)

  );

  const content = await rawResponse.json();
  //console.log("CONTENT" +  JSON.stringify(content));
  return  content.documents;s

}



 export {Mongo_ListarItems, Mongo_ListarDataEventos, Mongo_ListarDataAulas,
    Mongo_UpdateItem, Mongo_UpdateCursoAlunosArray, 
    Mongo_AddItem, Mongo_DeleteItem,
    Mongo_DeleteDataEventos };
