//在 .vue 中可以直接使用，js中单独引用
import {Message} from 'element-ui';
import {MessageBox} from 'element-ui';
import router from "../router";

/**
 * axios响应拦截器
 * success : {
 *     status:http状态码
 *     data:服务端返回数据
 * }
 *
 * axios.get(...).then(res => { });
 * @return：响应拦截器函数的返回值就是then函数回调参数(res)的值，res的值被响应拦截器进行二次处理
 * @return：返回空，那么axios发送请求，then函数的回调参数(res)就为空，如果回调参数为空则代表请求失败
 * 如果res为空则代表请求失败
 * 不为空代表请求成功
 */
axios.interceptors.response.use(success => {
    if (success.status && success.status == 200 && success.data.code == 500) {
        //业务错误  Http状态码存在且为200，但是服务端返回AjaxResult中status为500
        Message.error({message: success.data.msg, showClose: true, center: true});//展示错误信息
        return;
    }

    //请求成功：服务端返回AjaxResult中msg信息存在就展示
    if (success.data.msg) {
        Message.success({message: success.data.msg, showClose: true});
    }
    //请求成功：返回服务端返回的AjaxResult
    return success.data;//axios请求函数的回调参数res == success.data;

}, error => {
    if (error.response.status == 504 || error.response.status == 404) {
        Message.error({message: "服务器故障！", showClose: true})
    } else if (error.response.status == 403) {
        Message.error({message: "权限不足，请联系管理员！", showClose: true})
    } else if (error.response.status == 401) {
        MessageBox.alert('登录状态过期，请重新登录!', '温馨提示', {
            showClose: false,
            confirmButtonText: '确定',
            callback: action => {
                router.replace("/");
            }
        });
    } else { //其他错误
        if (error.response.data.msg) { //服务端有返回错误信息就展示，否则就是未知错误
            Message.error({message: error.response.data.msg, showClose: true})
        } else {
            Message.error({message: "未知错误！", showClose: true})
        }
    }
    return;
});
