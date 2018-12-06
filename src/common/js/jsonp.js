import orignJSONP from 'jsonp'

export default function jsonp(url, data, option){
	//拼接url(如果url没有问号,则开头加问号)
	url += (url.indexOf('?') < 0 ? '?' : '&') + param(data);
	//返回Promise对象,resolve表示成功,rehect表示失败
	return new Promise((resolve, reject) => {
		orignJSONP(url, option, (err, data) => {
			if(!err){
				resolve(data);
			}else{
				reject(err);
			}
		})
	})
}

//拼接data
function param(data){
	let url = '';
	for(var k in data){
		let value = data[k] != 'undefinded' ? data[k] : '';
		url += `&${k}=${encodeURIComponent(value)}`;
	}
	return url ? url.substring(1) : '';
}