import LandingPage from './components/LandingPage.vue'
import Login from './components/Login.vue'
import Owner from './components/OwnerView.vue'
import Kasir from './components/KasirView.vue'
import CS from './components/CSView.vue'
import Dashboard from './components/Dashboard.vue'

// Data Master
import Pegawai from './components/dataMaster/Pegawai.vue'
import formPegawai from './components/dataMaster/formPegawai.vue'
import Produk from './components/dataMaster/Produk.vue'
import formProduk from './components/dataMaster/formProduk.vue'
import Layanan from './components/dataMaster/Layanan.vue'
import formLayanan from './components/dataMaster/formLayanan.vue'

// CS
import Hewan from './components/dataMaster/Hewan.vue'
import formHewan from './components/dataMaster/formHewan'

export default [
    {
        path: '/',
        component: LandingPage
    },
    {
        path: '/login',
        component: Login
    },
    // Routes untuk OWNER
    {
        path: '/Owner',
        component: Owner,
        children: [
            // ===== DASHBOARD =====
            {
                name: 'OwnerDashboard',
                path: '/owner/dashboard',
                component: Dashboard
            },
            // ===== PEGAWAI =====
            {
                name: 'Pegawai',
                path: '/owner/pegawai',
                component: Pegawai
            },
            {
                name: 'formPegawai',
                path: '/owner/form-pegawai',
                component: formPegawai
            },
            {
                name: 'formEditPegawai',
                path: '/owner/form-pegawai/:id',
                component: formPegawai
            },
            // ===== PRODUK =====
            {
                name: 'Produk',
                path: '/owner/produk',
                component: Produk
            },
            {
                name: 'formProduk',
                path: '/owner/form-produk',
                component: formProduk
            },
            {
                name: 'formEditProduk',
                path: '/owner/form-produk/:id',
                component: formProduk
            },
            // ===== LAYANAN =====
            {
                name: 'Layanan',
                path: '/owner/layanan',
                component: Layanan
            },
            {
                name: 'formLayanan',
                path: '/owner/form-layanan',
                component: formLayanan
            },
            {
                name: 'formEditLayanan',
                path: '/owner/form-layanan/:id',
                component: formLayanan
            }
        ]
            
    },
    // Routes untuk KASIR
    {
        path: '/Kasir',
        component: Kasir,
        children: [
            // ===== DASHBOARD =====
            {
                name: 'KasirDashboard',
                path: '/kasir/dashboard',
                component: Dashboard
            },
        ]
            
    },
    {
        path: '/CS',
        component: CS,
        children: [
            // ===== DASHBOARD =====
            {
                name: 'CSDashboard',
                path: '/cs/dashboard',
                component: Dashboard
            },
            // ===== HEWAN =====
            {
                name: 'Hewan',
                path: '/cs/hewan',
                component: Hewan
            },
            {
                name: 'formHewan',
                path: '/cs/form-hewan',
                component: formHewan
            },
            {
                name: 'formEditHewan',
                path: '/cs/form-hewan/:id',
                component: formHewan
            }
        ]
            
    },
]