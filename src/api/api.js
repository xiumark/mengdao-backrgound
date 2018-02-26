


export function getAssetModelList(cb) {
    let headers = getHttpHeader();
    httpRequest(HOST_IP + '/model-summaries', {
        headers: headers,
        method: 'GET',
    }, response => {
        cb && cb(response);
    });
}


export function postAssetsByModel(model, data, cb) {
    let headers = getHttpHeader();
    let dat = { id: data.id, type: data.modelId, base: { name: data.name, geoPoint: { lat: data.lat, lng: data.lng }, extendType: model, domainId: data.domainId } };
    httpRequest(HOST_IP + '/' + model + 's', {
        headers: headers,
        method: 'POST',
        body: JSON.stringify(dat),
    }, response => {
        cb && cb(response);
    });
}






export function sendGift() {


}







handleSubmit = (e) => {
    console.log("e:", e.target.id)
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
        if (!err) {
            console.log('Received values of form: ', values);
            let { giftType, serverId, playerName, giftContent, duration, title } = values;
            const querystring = `giftType=${giftType}&serverId=${serverId}&playerName=${playerName}&giftContent=${giftContent}&duration=${duration}&title=${title}`
            let headers = { 'Content-Type': 'application/x-www-form-urlencoded' };
            fetch(`/root/sendGift.action`, {
                credentials: 'include', //发送本地缓存数据
                method: 'POST',
                headers: {
                    headers
                },
                body: querystring
            }).then(res => {
                console.log('res:', res)
                if (res.status !== 200) {
                    throw new Error('失败')
                }
                return res;
            })
                .then(res => res.json())
                .then(res => {
                })
                .catch(err => {
                    message.info('失败')
                })
        }
    });
}


function apiRequest(url, method, querystring, cb) {
    let headers = { 'Content-Type': 'application/x-www-form-urlencoded' };
    fetch(url, {
        credentials: 'include', //发送本地缓存数据
        method: method,
        headers: {
            headers
        },
        body: querystring
    }).then(res => {
        console.log('res:', res)
        if (res.status !== 200) {
            throw new Error('失败')
        }
        return res;
    })
        .then(res => res.json())
        .then(res => {cb&cb(res)
        })
        .catch(err => {
            message.info('失败')
        })


}