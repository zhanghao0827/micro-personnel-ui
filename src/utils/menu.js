export const initMenu = (router, store) => {
    if (store.state.routes.length > 0) {
        return;
    }

    axios.get('/auth/menu').then(res => {
        if (res) {
            let fmtRoutes = formatRoutes(res);
            router.addRoutes(fmtRoutes);
            store.commit('initRoutes', fmtRoutes);
            store.dispatch('connect');
        }
    });

}

export const formatRoutes = (routes) => {
    let fmtRoutes = [];
    routes.forEach(router => {
        let {
            menuName,
            path,
            component,
            icon,
            children
        } = router;
        if (children && children instanceof Array) {
            children = formatRoutes(children);
        }
        let fmtRouter = {
            name: menuName,
            path: path,
            icon: icon,
            children: children,
            component(resolve) {//es5语法
                if (component.startsWith("Home")) {
                    //一点要先加载Home路由，即根路由，才能加载子路由
                    require(['../views/' + component + '.vue'], resolve);
                } else if (component.startsWith("Sys")) {
                    require(['../views/sys/' + component + '.vue'], resolve);
                } else if (component.startsWith("Ser")) {
                    require(['../views/ser/' + component + '.vue'], resolve);
                } else if (component.startsWith("Log")) {
                    require(['../views/log/' + component + '.vue'], resolve);
                }
            }
        };
        fmtRoutes.push(fmtRouter);
    });
    return fmtRoutes;
}
