import {
	HiOutlineViewGrid,
	HiOutlineCube,
	HiOutlineShoppingCart,
	HiOutlineUsers,
	HiOutlineDocumentText,
	HiOutlineAnnotation,
	HiOutlineQuestionMarkCircle,
	HiOutlineCog		
} from 'react-icons/hi'
import { 
	AiFillAccountBook,
	AiFillAppstore,
	AiFillEdit,
	AiFillFolderOpen


} from "react-icons/ai";
import {
	 FiUserPlus ,
	 FiUsers



	} from "react-icons/fi";
export const DASHBOARD_SIDEBAR_LINKS = [
	{
		key: 'dashboard',
		label: 'Dashboard',
		path: '/Dashboard',
		icon: <HiOutlineViewGrid />,
		roles: ['admin', 'salesrep', 'manager'] // Accessible to all roles
	},

	{
		key: 'orders',
		label: 'Product Management',
		path: '/product',
		icon: <HiOutlineShoppingCart />,
		roles: ['admin', 'sales', 'customer'], // Accessible to all roles
		subMenu: [
			
			{ key: 'sub1', label: 'Add New Product', path: '/AddProductForm', icon: < AiFillAccountBook/> },
			
			
			
		],

	},
	{
		key: 'Customer Management',
		label: 'Customer',
		path: '/products',
		icon: <HiOutlineCube />,
		roles: ['admin', 'sales', 'customer'],
		subMenu: [
			{ key: 'sub2', label: 'Add Customer', path: '/CustomerForm', icon: <AiFillFolderOpen /> },
			
			
			
		  ],
	},
	{
		key: 'Stock',
		label: 'Sales Rep',
		path: '/products',
		icon: <HiOutlineCube />,
		roles: ['admin', 'salesrep', 'customer'],
		subMenu: [
			{ key: 'sub1', label: 'Add Sales Rep', path: '/AddSalesRep', icon: < AiFillAccountBook/> },
			
			
			
			
		  ],
	},
	
	{
		key: 'Roots',
		label: 'Vehicle Management',
		path: '/customers',
		icon: <HiOutlineUsers />,
		roles: ['admin', 'sales', 'customer'],
		subMenu: [
			
			{ key: 'sub2', label: 'Add Vehicles', path: '/AddVehicle', icon: <AiFillAppstore /> },
			
			
		  ],
	},
	{
		key: 'User Management',
		label: 'User Management',
		path: '/users',
		icon: <HiOutlineUsers />,
		roles: ['admin', 'sales', 'customer'],
		subMenu: [
			
			{ key: 'sub21', label: 'Add new user', path: '/NewUser', icon: < FiUserPlus /> },
			
			
		  ],
	},
	{
		key: 'transactions',
		label: 'Transactions',
		path: '/transactions',
		icon: <HiOutlineDocumentText />,
		roles:['admin', 'sales', 'customer'],
		subMenu: [
			
			{ key: 'sub5', label: 'Add Product Main stock', path: '/AddReceiptForm', icon: <AiFillAppstore /> },
			{ key: 'sub5', label: 'Send product to branch', path: '/SendProductForm', icon: <AiFillAppstore /> },
			{ key: 'sub2', label: 'Create Bill By Sales Rep', path: '/CreateBill', icon: <AiFillAppstore /> },
			
			
			
		  ],
	},
	{
		key: 'messages',
		label: 'Report',
		path: '/PremadeProductPage',
		icon: <HiOutlineAnnotation />,
		roles: ['admin', 'salesrep'],
		subMenu: [
			{ key: 'sub7', label: 'Product List ', path: '/ProductList', icon: <AiFillAppstore /> },
			{ key: 'sub7', label: 'Receipt List ', path: '/ReceiptList', icon: <AiFillAppstore /> },
			{ key: 'sub2', label: 'Customer List', path: '/CustomerList', icon: <AiFillFolderOpen /> },	
			{ key: 'sub2', label: 'Sales Rep List', path: '/SalesRepList', icon: <AiFillFolderOpen /> },
			{ key: 'sub2', label: 'Bill List', path: '/BillDetails', icon: <AiFillFolderOpen /> },
			{ key: 'sub2', label: 'Sales Rep Achievement', path: '/SalesRepAchievement', icon: <AiFillFolderOpen /> },

			{ key: 'sub2', label: 'Company Sales Report', path: '/CompanySalesReport', icon: <AiFillFolderOpen /> },
		  ],
	}
]

export const DASHBOARD_SIDEBAR_BOTTOM_LINKS = [
	{
		key: 'settings',
		label: 'Settings',
		path: '/settings',
		icon: <HiOutlineCog />,
		roles: ['admin', 'sales', 'customer'],
	},
	{
		key: 'support',
		label: 'Help & Support',
		path: '/support',
		icon: <HiOutlineQuestionMarkCircle />,
		roles: ['admin', 'sales', 'customer'],
	}
]