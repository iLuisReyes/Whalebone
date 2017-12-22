const request=require('request');class Whalebone{constructor(url){this.url=url}
authenticate(username,password,cb){const self=this;request.post({url:this.url+'/api/authorization',json:{clientkey:username,passcode:password},},function(err,resp,body){if(resp.statusCode!==200){return cb(!0,resp,body)}
self.token=body.token;self.session=request.defaults({auth:{bearer:self.token},json:!0});cb(err,resp,body)})}
getConditions(cb){this.session.get({url:this.url+'/api/filter/conditions'},cb)}
updateConditions(conditions,cb){this.session.patch({url:this.url+'/api/filter/conditions',json:conditions,},cb)}
evaluateContent(content,cb,opts={}){this.session.post({url:this.url+'/api/filter',json:Object.assign({source_text:content},opts),},cb)}
submitSpam(item_id,cb,opts={}){this.session.post({url:this.url+'/api/filter/spam',json:Object.assign({response_id:item_id},opts),},cb)}
submitHam(item_id,cb,opts={}){this.session.post({url:this.url+'/api/filter/ham',json:Object.assign({response_id:item_id},opts),},cb)}
getGatedItems(cb,{offset=0,limit=0}={}){this.session.get({url:this.url+'/api/filter/gated',qs:{offset,limit},},cb)}
releaseItem(item_id,cb){this.session.put({url:this.url+'/api/filter/gated/'+item_id},cb)}
clearGatedItems(cb){this.session.delete({url:this.url+'/api/filter/gated'},cb)}
getReleasedItems(cb,{offset=0,limit=0,remove='n'}={}){this.session.get({url:this.url+'/api/filter/gated/released',qs:{offset,limit,remove},},cb)}
clearReleasedItems(cb){this.session.delete({url:this.url+'/api/filter/gated/released'},cb)}}
module.exports=Whalebone
