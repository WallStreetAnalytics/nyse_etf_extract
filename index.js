import postRequest from './Modules/PostRequest'
import etfObject from './Modules/etfRequestObject.json';


async function flowControl() {
    let response = await postRequest(etfObject);
    //console.log(response);

}

flowControl();