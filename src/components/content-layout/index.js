import React, { createContext, useState } from "react";
import { Route, Routes } from "react-router-dom";
import Nav from "../user-control/nav";
// import Footer from "../user-control/footer";
import Loadable from 'react-loadable';

const Loading = () => null;

const DashboardFleet = Loadable({
    loader: () => import("../apps-library/dashboard/fleet"),
    loading: Loading
});

const MasterFleetDetail = Loadable({
    loader: () => import("../apps-library/masters/fleet/detail"),
    loading: Loading
});

const DashboardKurir = Loadable({
    loader: () => import("../apps-library/dashboard/kurir/"),
    loading: Loading
});

const DashboardList = Loadable({
    loader: () => import("../apps-library/dashboard/list/"),
    loading: Loading
});

const MasterFleet = Loadable({
    
    loader: () => import("../apps-library/masters/fleet/"),
    loading: Loading
});

const MasterQR = Loadable({
    loader: () => import("../apps-library/masters/print-qr/"),
    loading: Loading
});

const MenuWebmenuList = Loadable({
    loader: () => import("../apps-library/menu/webmenu/list/"),
    loading: Loading
});

const MenuWebmenuDetail = Loadable({
    loader: () => import("../apps-library/menu/webmenu/detail/"),
    loading: Loading
});

const AccessRoleList = Loadable({
    loader: () => import("../apps-library/users/access-role/list/"),
    loading: Loading
});

const AccessRoleDetail = Loadable({
    loader: () => import("../apps-library/users/access-role/detail/"),
    loading: Loading
});

const AccessUserList = Loadable({
    loader: () => import("../apps-library/users/access-user/list/"),
    loading: Loading
});

const AccessUserDetail = Loadable({
    loader: () => import("../apps-library/users/access-user/detail/"),
    loading: Loading
});

const RoleList = Loadable({
    loader: () => import("../apps-library/users/role/list/"),
    loading: Loading
});

const Roledetail = Loadable({
    loader: () => import("../apps-library/users/role/detail/"),
    loading: Loading
});

const UserDetail = Loadable({
    loader: () => import("../apps-library/users/user/detail"),
    loading: Loading
});

const UserList = Loadable({
    loader: () => import("../apps-library/users/user/list"),
    loading: Loading
});

const ListDo = Loadable({
    loader: () => import("../apps-library/dashboard/kurir/deliveryorder"),
    loading: Loading
});

const ResiDetails = Loadable({
    loader: () => import("../apps-library/dashboard/kurir/deliveryorder/resi"),
    loading: Loading
});

export const NavContext = createContext(null);

const ContentLayout = () => {
    const [navData, setNavData] = useState({ 
        hide: false, 
        th: false, 
        transparent: false, 
        blur: false,
        separator: false,
        textColor: 'text-black',
    });

    const navSetData = {
        setNavData: setNavData
    }

return (
    <div className={"leading-normal tracking-normal text-white gradient font-inter flex min-h-screen"}>
        <NavContext.Provider value={{ navData, navSetData }}>
            <div className={(navData.hide ? 'hidden' : '')}>
                <Nav />
            </div>
            <div className="flex-grow">
            <Routes>
                <Route path="/Dashboard/Fleet" element={<DashboardFleet />} />
                <Route path="/Dashboard/Kurir" element={<DashboardKurir />} />
                <Route path="/Dashboard/Kurir/ListDo/:code" element={<ListDo />} />
                <Route path="/Dashboard/List" element={<DashboardList/>} />
                <Route path="/Master/QR" element={<MasterQR/>} />
                <Route path="/Master/Fleet" element={<MasterFleet/>} />
                <Route path="/Master/Fleet/Detail/:id" element={<MasterFleetDetail/>} />
                <Route path="/Menu/Webmenu/List" element={<MenuWebmenuList/>} />
                <Route path="/Menu/Webmenu/Detail/:id" element={<MenuWebmenuDetail/>} />
                <Route path="/Users/Accessrole/List" element={<AccessRoleList/>} />
                <Route path="/Users/Accessrole/Detail/:id" element={<AccessRoleDetail/>} />
                <Route path="/Users/Accessuser/List" element={<AccessUserList/>} />
                <Route path="/Users/Accessuser/Detail/:uid" element={<AccessUserDetail/>} />  
                <Route path="/Users/Role/List" element={<RoleList/>} />
                <Route path="/Users/Role/Detail/:id" element={<Roledetail/>} />
                <Route path="/Users/User/Detail/:uid" element={<UserDetail/>} />
                <Route path="/Users/User/List" element={<UserList/>} />
                <Route path="/Dashboard/Kurir/ListDo/:code/resi/:resi" element={<ResiDetails />} />
            </Routes>
            </div>           
            {/* <Footer />   */}
        </NavContext.Provider>
    </div>
    
)
            }
export default ContentLayout;